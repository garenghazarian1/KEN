"use client";

/**
 * OpenAI Realtime (WebRTC) voice conversation state machine.
 *
 * Flow per user turn:
 *   semantic VAD ends the turn → final transcript event →
 *   POST /api/assistant/realtime/turn (persist + hard escalation gate +
 *   catalog grounding) → session.update instructions → response.create.
 * The Realtime session is minted with `create_response: false`, so no model
 * response can start before that server check.
 *
 * Inactivity: after each finished assistant turn a two-stage closer runs —
 * 15s silence → spoken check-in; 15s more → spoken goodbye, conversation
 * closed server-side, connection torn down, and `onAutoClosed` fired.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createIdleCloser } from "@/lib/assistant/voiceLifecycle";

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";
const GOODBYE_FALLBACK_MS = 12_000;

const CHECK_IN_PROMPT =
  "The guest has been quiet for a little while. In one short warm sentence, ask if there is anything else you can help with.";
const GOODBYE_PROMPT =
  "The guest seems to be done. In one short warm sentence, say goodbye and mention they can reopen the chat any time. Do not ask a question.";

export function voiceSupported() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof RTCPeerConnection !== "undefined"
  );
}

function extractResponseTranscript(response) {
  const parts = [];
  for (const item of response?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.transcript === "string") parts.push(content.transcript);
      else if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join(" ").trim();
}

/**
 * @param {{
 *   conversationId: string|null,
 *   getSessionId: () => string,
 *   onConversationId?: (id: string) => void,
 *   onUserSpeechStart?: (itemId: string) => void,
 *   onUserDelta?: (itemId: string, delta: string) => void,
 *   onUserFinal?: (itemId: string, transcript: string) => void,
 *   onAssistantDelta?: (responseId: string, delta: string) => void,
 *   onAssistantFinal?: (responseId: string, result: { transcript: string, actions: Array }) => void,
 *   onAutoClosed?: () => void,
 *   onEnded?: (reason: string) => void,
 *   onError?: (message: string) => void,
 * }} options
 */
export default function useAssistantRealtime(options) {
  const [status, setStatus] = useState("idle"); // idle|connecting|listening|thinking|speaking|ending
  const [muted, setMuted] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const statusRef = useRef("idle");
  const activeRef = useRef(false);
  const conversationRef = useRef(null);

  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);

  const idleRef = useRef(null);
  const processedItemsRef = useRef(new Set());
  const transcriptsRef = useRef(new Map()); // responseId -> assistant transcript
  const serverReplyRef = useRef(null); // actions for a persisted fixed response
  const goodbyeRef = useRef(false);
  const goodbyeFallbackRef = useRef(null);

  const setStatusSafe = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const sendEvent = useCallback((event) => {
    const dc = dcRef.current;
    if (dc?.readyState === "open") {
      try {
        dc.send(JSON.stringify(event));
      } catch {
        // channel already closing
      }
    }
  }, []);

  const teardown = useCallback(() => {
    if (goodbyeFallbackRef.current) {
      clearTimeout(goodbyeFallbackRef.current);
      goodbyeFallbackRef.current = null;
    }
    idleRef.current?.dispose();
    idleRef.current = null;
    goodbyeRef.current = false;
    serverReplyRef.current = null;
    processedItemsRef.current = new Set();
    transcriptsRef.current = new Map();

    try {
      dcRef.current?.close();
    } catch {
      // already closed
    }
    dcRef.current = null;
    try {
      pcRef.current?.close();
    } catch {
      // already closed
    }
    pcRef.current = null;
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    activeRef.current = false;
    setMuted(false);
  }, []);

  const stop = useCallback(
    (reason = "user_end", { endConversation = false } = {}) => {
      if (!activeRef.current && statusRef.current === "idle") return;
      teardown();
      setStatusSafe("idle");
      if (endConversation && conversationRef.current) {
        fetch("/api/assistant/session/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: optionsRef.current.getSessionId(),
            conversationId: conversationRef.current,
            reason,
          }),
          keepalive: true,
        }).catch(() => {});
      }
      optionsRef.current.onEnded?.(reason);
    },
    [setStatusSafe, teardown]
  );
  const stopRef = useRef(stop);
  stopRef.current = stop;

  const endFromIdle = useCallback(() => {
    stopRef.current("idle_timeout", { endConversation: true });
    optionsRef.current.onAutoClosed?.();
  }, []);

  const persistAssistantTranscript = useCallback((transcript) => {
    if (!transcript || !conversationRef.current) return;
    fetch("/api/assistant/realtime/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: optionsRef.current.getSessionId(),
        conversationId: conversationRef.current,
        transcript,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  const handleUserTurn = useCallback(
    async (itemId, rawTranscript) => {
      if (processedItemsRef.current.has(itemId)) return;
      processedItemsRef.current.add(itemId);

      const transcript = (rawTranscript || "").trim();
      optionsRef.current.onUserFinal?.(itemId, transcript);
      if (!transcript) {
        if (statusRef.current === "thinking") setStatusSafe("listening");
        return;
      }

      idleRef.current?.noteUserActivity();
      setStatusSafe("thinking");
      try {
        const res = await fetch("/api/assistant/realtime/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: optionsRef.current.getSessionId(),
            conversationId: conversationRef.current,
            transcript,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong.");
        if (!activeRef.current) return;

        if (data.escalated || data.fixed) {
          // Reply text is server-owned and already persisted; Realtime only
          // reads it aloud while the caption receives the associated actions.
          serverReplyRef.current = { actions: data.actions || [] };
          sendEvent({
            type: "response.create",
            response: {
              instructions: `Say exactly the following to the guest, warmly, and nothing else: "${data.reply}"`,
            },
          });
        } else {
          sendEvent({
            type: "session.update",
            session: { type: "realtime", instructions: data.instructions },
          });
          sendEvent({ type: "response.create" });
        }
      } catch (err) {
        if (!activeRef.current) return;
        setStatusSafe("listening");
        optionsRef.current.onError?.(
          err.message || "Sorry, I missed that. Please try again."
        );
      }
    },
    [sendEvent, setStatusSafe]
  );

  const handleAssistantTurnEnd = useCallback(() => {
    if (goodbyeRef.current) {
      if (goodbyeFallbackRef.current) {
        clearTimeout(goodbyeFallbackRef.current);
        goodbyeFallbackRef.current = null;
      }
      endFromIdle();
      return;
    }
    if (statusRef.current !== "idle") setStatusSafe("listening");
    idleRef.current?.noteAssistantTurnEnd();
  }, [endFromIdle, setStatusSafe]);

  const handleServerEvent = useCallback(
    (event) => {
      switch (event.type) {
        case "input_audio_buffer.speech_started":
          // Barge-in: the server interrupts the active response itself
          // (interrupt_response: true); we just reflect the state.
          idleRef.current?.noteUserActivity();
          if (!goodbyeRef.current) setStatusSafe("listening");
          // item_id is the future user item — lets the UI show a live
          // "listening" bubble immediately (transcription only arrives
          // after the turn ends).
          if (event.item_id) {
            optionsRef.current.onUserSpeechStart?.(event.item_id);
          }
          break;

        case "input_audio_buffer.speech_stopped":
          if (statusRef.current === "listening") setStatusSafe("thinking");
          break;

        case "conversation.item.input_audio_transcription.delta":
          if (event.delta) {
            idleRef.current?.noteUserActivity();
            optionsRef.current.onUserDelta?.(event.item_id, event.delta);
          }
          break;

        case "conversation.item.input_audio_transcription.completed":
          handleUserTurn(event.item_id, event.transcript);
          break;

        case "conversation.item.input_audio_transcription.failed":
          // Remove the pending "listening" bubble for this turn.
          if (event.item_id) optionsRef.current.onUserFinal?.(event.item_id, "");
          if (statusRef.current === "thinking") setStatusSafe("listening");
          break;

        case "response.output_audio_transcript.delta":
        case "response.audio_transcript.delta": {
          if (!event.delta) break;
          const responseId = event.response_id;
          transcriptsRef.current.set(
            responseId,
            (transcriptsRef.current.get(responseId) || "") + event.delta
          );
          if (!goodbyeRef.current) setStatusSafe("speaking");
          optionsRef.current.onAssistantDelta?.(responseId, event.delta);
          break;
        }

        case "response.output_audio_transcript.done":
        case "response.audio_transcript.done": {
          const responseId = event.response_id;
          const transcript = (event.transcript || "").trim();
          if (!responseId || !transcript) break;

          // GA Realtime may deliver only the completed transcript in some
          // browsers. Keep it for response.done persistence and publish it to
          // the voice caption bubble immediately. response.done later enriches
          // the same bubble with escalation actions, without creating another.
          transcriptsRef.current.set(responseId, transcript);
          optionsRef.current.onAssistantFinal?.(responseId, {
            transcript,
            actions: [],
          });
          break;
        }

        case "response.done": {
          const responseId = event.response?.id;
          const transcript = (
            transcriptsRef.current.get(responseId) ||
            extractResponseTranscript(event.response)
          ).trim();
          transcriptsRef.current.delete(responseId);

          // Some WebRTC clients do not emit transcript deltas even though
          // response.done contains the completed transcript. Clear a stale
          // thinking state before publishing that fallback caption. Do not
          // force "speaking": the audio-buffer stopped event may have already
          // arrived.
          if (
            transcript &&
            !goodbyeRef.current &&
            statusRef.current === "thinking"
          ) {
            setStatusSafe("listening");
          }

          const serverReply = serverReplyRef.current;
          serverReplyRef.current = null;
          // Fixed replies were already persisted by the turn route.
          if (!serverReply && transcript) persistAssistantTranscript(transcript);
          if (transcript || serverReply) {
            optionsRef.current.onAssistantFinal?.(responseId, {
              transcript,
              actions: serverReply?.actions || [],
            });
          }
          // If no audio played (e.g. cancelled or empty), the buffer-stopped
          // event never fires — close the turn here.
          if (statusRef.current !== "speaking") handleAssistantTurnEnd();
          break;
        }

        case "output_audio_buffer.started":
          if (!goodbyeRef.current) setStatusSafe("speaking");
          break;

        case "output_audio_buffer.stopped":
        case "output_audio_buffer.cleared":
          handleAssistantTurnEnd();
          break;

        case "error":
          console.error("assistant realtime event error:", event.error);
          break;

        default:
          break;
      }
    },
    [handleAssistantTurnEnd, handleUserTurn, persistAssistantTranscript, setStatusSafe]
  );

  const start = useCallback(async () => {
    if (activeRef.current) return;
    if (!voiceSupported()) {
      optionsRef.current.onError?.(
        "Voice isn’t supported in this browser. You can keep typing your question here."
      );
      return;
    }
    activeRef.current = true;
    setStatusSafe("connecting");

    try {
      const sessionRes = await fetch("/api/assistant/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: optionsRef.current.getSessionId(),
          conversationId: optionsRef.current.conversationId || undefined,
          path: window.location.pathname,
        }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionData.message || "Could not start the voice conversation.");
      }
      conversationRef.current = sessionData.conversationId;
      optionsRef.current.onConversationId?.(sessionData.conversationId);

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!activeRef.current) {
        micStream.getTracks().forEach((track) => track.stop());
        return;
      }
      micStreamRef.current = micStream;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // iOS Safari / WKWebView: remote WebRTC audio needs playsInline and a
      // document-attached <audio> element; new Audio() alone often stays silent.
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioEl.playsInline = true;
      audioEl.setAttribute("playsinline", "");
      audioEl.setAttribute("webkit-playsinline", "");
      audioEl.style.display = "none";
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        audioEl.play().catch(() => {
          // Start was a user gesture, so autoplay should be allowed.
        });
      };
      micStream.getTracks().forEach((track) => pc.addTrack(track, micStream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = (e) => {
        try {
          handleServerEvent(JSON.parse(e.data));
        } catch {
          // ignore malformed events
        }
      };
      dc.onopen = () => {
        if (activeRef.current) setStatusSafe("listening");
      };

      pc.onconnectionstatechange = () => {
        if (!activeRef.current) return;
        if (pc.connectionState === "failed") {
          stopRef.current("connection_lost");
          optionsRef.current.onError?.(
            "Voice connection lost. You can keep typing or start voice again."
          );
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(REALTIME_CALLS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionData.clientSecret}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });
      if (!sdpRes.ok) throw new Error("Could not connect the voice call.");
      if (!activeRef.current) return;
      await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });

      idleRef.current = createIdleCloser({
        onCheckIn: () => {
          sendEvent({
            type: "response.create",
            response: { instructions: CHECK_IN_PROMPT },
          });
        },
        onGoodbye: () => {
          goodbyeRef.current = true;
          setStatusSafe("ending");
          sendEvent({
            type: "response.create",
            response: { instructions: GOODBYE_PROMPT },
          });
          // Safety net in case audio-finished events never arrive.
          goodbyeFallbackRef.current = setTimeout(() => {
            goodbyeFallbackRef.current = null;
            endFromIdle();
          }, GOODBYE_FALLBACK_MS);
        },
      });
    } catch (err) {
      teardown();
      setStatusSafe("idle");
      optionsRef.current.onError?.(
        err?.name === "NotAllowedError"
          ? "Microphone access was blocked — you can keep typing instead."
          : err.message || "Could not start the voice conversation."
      );
    }
  }, [endFromIdle, handleServerEvent, sendEvent, setStatusSafe, teardown]);

  const toggleMute = useCallback(() => {
    const stream = micStreamRef.current;
    if (!stream) return;
    setMuted((prev) => {
      const next = !prev;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !next;
      });
      return next;
    });
    idleRef.current?.noteUserActivity();
  }, []);

  const noteActivity = useCallback(() => {
    idleRef.current?.noteUserActivity();
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  return {
    status,
    muted,
    active: status !== "idle",
    start,
    stop,
    toggleMute,
    noteActivity,
  };
}
