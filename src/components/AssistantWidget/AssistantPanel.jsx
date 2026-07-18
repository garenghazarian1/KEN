"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Mic,
  MicOff,
  MessageCircle,
  Phone,
  CalendarCheck,
  ExternalLink,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  ASSISTANT_QUICK_CHIPS,
  ASSISTANT_WELCOME,
} from "@/data/assistantUi";
import {
  ASSISTANT_AVATAR_SRC,
  isAndroidWebView,
  isIOSWebView,
} from "@/config/constants";
import { linkifyToNodes } from "@/utils/linkifyText";
import useAssistantRealtime, {
  voiceSupported as detectVoiceSupport,
} from "@/hooks/useAssistantRealtime";
import styles from "./AssistantWidget.module.css";

const VOICE_UNSUPPORTED_IN_APP =
  "Voice isn’t available in the app yet (microphone permission). You can keep typing your question here.";
const VOICE_UNSUPPORTED_BROWSER =
  "Voice isn’t supported in this browser. You can keep typing your question here.";

const SESSION_KEY = "ken-assistant-session";
const NAME_DISMISS_KEY = "ken-assistant-name-dismissed";
let localMessageSequence = 0;

function isNamePromptDismissed() {
  try {
    return localStorage.getItem(NAME_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function persistNamePromptDismissed() {
  try {
    localStorage.setItem(NAME_DISMISS_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

function createClientMessage(role, content, extra = {}) {
  localMessageSequence += 1;
  return {
    id: `local-${Date.now()}-${localMessageSequence}`,
    role,
    content,
    source: "text",
    ...extra,
  };
}

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      if (globalThis.crypto?.randomUUID) {
        id = globalThis.crypto.randomUUID();
      } else if (globalThis.crypto?.getRandomValues) {
        const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
        id = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
      } else {
        id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `mem-${Math.random().toString(36).slice(2)}`;
  }
}

function actionIcon(type) {
  if (type === "whatsapp") return <MessageCircle size={14} aria-hidden="true" />;
  if (type === "call") return <Phone size={14} aria-hidden="true" />;
  if (type === "book") return <CalendarCheck size={14} aria-hidden="true" />;
  return <ExternalLink size={14} aria-hidden="true" />;
}

async function readAssistantSse(response, handlers) {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Streaming is not supported in this browser.");
  }
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      const line = part
        .split("\n")
        .map((row) => row.trim())
        .find((row) => row.startsWith("data:"));
      if (!line) continue;
      let payload;
      try {
        payload = JSON.parse(line.slice(5).trim());
      } catch {
        continue;
      }
      if (payload.type === "transcript") handlers.onTranscript?.(payload.content);
      else if (payload.type === "delta") handlers.onDelta?.(payload.content);
      else if (payload.type === "done") handlers.onDone?.(payload);
      else if (payload.type === "error") {
        throw new Error(payload.message || "Something went wrong.");
      }
    }
  }
}

export default function AssistantPanel({ isOpen, onClose }) {
  const [nameInput, setNameInput] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sessionIdRef = useRef(null);
  const conversationIdRef = useRef(null);
  const listRef = useRef(null);
  const textInputRef = useRef(null);

  const requestInFlightRef = useRef(false);

  // Live-caption bubbles for the realtime voice conversation.
  const voiceUserBubblesRef = useRef(new Map()); // itemId -> local message id
  const voiceAssistantBubblesRef = useRef(new Map()); // responseId -> local message id

  useEffect(() => {
    sessionIdRef.current = getSessionId();
    setShowNamePrompt(!isNamePromptDismissed());
  }, []);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, conversationId]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    conversationIdRef.current = null;
    setInput("");
    setError(null);
    setNameInput("");
    setShowNamePrompt(!isNamePromptDismissed());
    voiceUserBubblesRef.current = new Map();
    voiceAssistantBubblesRef.current = new Map();
  }, []);

  const voice = useAssistantRealtime({
    conversationId,
    getSessionId: () => sessionIdRef.current,
    onConversationId: (id) => setConversationId(id),
    onUserSpeechStart: (itemId) => {
      // Show an empty "listening" bubble immediately — the transcript
      // itself only arrives once the turn ends.
      if (voiceUserBubblesRef.current.has(itemId)) return;
      const bubble = createClientMessage("user", "", {
        source: "voice",
        pending: true,
      });
      voiceUserBubblesRef.current.set(itemId, bubble.id);
      setMessages((prev) => [...prev, bubble]);
    },
    onUserDelta: (itemId, delta) => {
      const localId = voiceUserBubblesRef.current.get(itemId);
      if (!localId) {
        const bubble = createClientMessage("user", delta, {
          source: "voice",
          pending: true,
        });
        voiceUserBubblesRef.current.set(itemId, bubble.id);
        setMessages((prev) => [...prev, bubble]);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === localId && msg.source === "voice"
            ? { ...msg, content: `${msg.content || ""}${delta}` }
            : msg
        )
      );
    },
    onUserFinal: (itemId, transcript) => {
      const localId = voiceUserBubblesRef.current.get(itemId);
      if (!transcript) {
        if (localId) {
          setMessages((prev) => prev.filter((msg) => msg.id !== localId));
        }
        return;
      }
      if (!localId) {
        const bubble = createClientMessage("user", transcript, {
          source: "voice",
        });
        voiceUserBubblesRef.current.set(itemId, bubble.id);
        setMessages((prev) => [...prev, bubble]);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === localId && msg.source === "voice"
            ? { ...msg, content: transcript, pending: false }
            : msg
        )
      );
    },
    onAssistantDelta: (responseId, delta) => {
      const localId = voiceAssistantBubblesRef.current.get(responseId);
      if (!localId) {
        const bubble = createClientMessage("assistant", delta, {
          source: "voice",
          streaming: true,
        });
        voiceAssistantBubblesRef.current.set(responseId, bubble.id);
        setMessages((prev) => [...prev, bubble]);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === localId && msg.source === "voice"
            ? { ...msg, content: `${msg.content || ""}${delta}` }
            : msg
        )
      );
    },
    onAssistantFinal: (responseId, { transcript, actions }) => {
      const localId = voiceAssistantBubblesRef.current.get(responseId);
      if (!localId) {
        if (!transcript) return;
        const bubble = createClientMessage("assistant", transcript, {
          source: "voice",
          actions: actions || [],
        });
        voiceAssistantBubblesRef.current.set(responseId, bubble.id);
        setMessages((prev) => [...prev, bubble]);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === localId && msg.source === "voice"
            ? {
                ...msg,
                content: transcript || msg.content,
                streaming: false,
                actions: actions || [],
              }
            : msg
        )
      );
    },
    onAutoClosed: () => {
      resetConversation();
      onClose();
    },
    onEnded: () => {
      // Keep completed voice captions in the shared transcript, but remove an
      // empty listening placeholder or finalize a partial caption. Text
      // messages are never touched by voice cleanup.
      setMessages((prev) =>
        prev
          .filter(
            (msg) =>
              !(
                msg.source === "voice" &&
                msg.pending &&
                !msg.content
              )
          )
          .map((msg) =>
            msg.source === "voice" && msg.pending
              ? { ...msg, pending: false }
              : msg
          )
      );
      voiceUserBubblesRef.current = new Map();
      voiceAssistantBubblesRef.current = new Map();
    },
    onError: (message) => setError(message),
  });

  const voiceActiveRef = useRef(false);
  voiceActiveRef.current = voice.active;

  const voiceStatusLabel =
    {
      connecting: "Connecting…",
      listening: voice.muted ? "Muted" : "Listening",
      thinking: "Thinking…",
      speaking: "Speaking",
      ending: "Ending…",
    }[voice.status] || "";

  const ensureSession = useCallback(async () => {
    if (requestInFlightRef.current || conversationIdRef.current) return;
    if (!sessionIdRef.current) {
      sessionIdRef.current = getSessionId();
    }
    requestInFlightRef.current = true;
    setError(null);
    setMessages((prev) =>
      prev.length === 0
        ? [createClientMessage("assistant", ASSISTANT_WELCOME.greeting, { actions: [] })]
        : prev
    );
    try {
      const res = await fetch("/api/assistant/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          path: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not start the chat.");

      conversationIdRef.current = data.conversationId;
      setConversationId(data.conversationId);
    } catch (err) {
      setError(err.message || "Could not start the chat. Please try again.");
      setMessages([]);
    } finally {
      requestInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || conversationId) return;
    ensureSession();
  }, [isOpen, conversationId, ensureSession]);

  const dismissNamePrompt = useCallback(() => {
    setShowNamePrompt(false);
    persistNamePromptDismissed();
  }, []);

  const saveGuestName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      dismissNamePrompt();
      return;
    }
    if (!conversationIdRef.current) return;

    try {
      const res = await fetch("/api/assistant/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          sessionId: sessionIdRef.current,
          guestName: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not save your name.");

      const saved = data.guestName || trimmed;
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const [first, ...rest] = prev;
        if (first.role !== "assistant") return prev;
        return [
          {
            ...first,
            content: `Hi ${saved}! ${ASSISTANT_WELCOME.greeting}`,
          },
          ...rest,
        ];
      });
      setNameInput("");
      dismissNamePrompt();
    } catch (err) {
      setError(err.message || "Could not save your name. Please try again.");
    }
  };

  const requestHandoff = async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/assistant/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sessionId: sessionIdRef.current,
          reason: "user_request",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not contact the salon.");
      setMessages((prev) => [
        ...prev,
        {
          ...createClientMessage("assistant", data.reply, {
            id: data.assistantMessageId,
            actions: data.actions || [],
          }),
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      requestInFlightRef.current = false;
      setSending(false);
    }
  };

  const sendPayload = async (payload) => {
    setError(null);
    setSending(true);
    const assistantBubble = createClientMessage("assistant", "", {
      pending: true,
      streaming: true,
    });
    const assistantLocalId = assistantBubble.id;
    setMessages((prev) => [...prev, assistantBubble]);

    try {
      const res = await fetch("/api/assistant/chat", { method: "POST", ...payload });
      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("text/event-stream")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong.");
        // Non-stream fallback (should be rare — errors are JSON).
        setMessages((prev) => {
          const next = [...prev];
          if (data.transcript) {
            for (let idx = next.length - 1; idx >= 0; idx--) {
              if (
                next[idx].role === "user" &&
                next[idx].source === "text" &&
                next[idx].pending
              ) {
                next[idx] = {
                  ...next[idx],
                  content: data.transcript,
                  pending: false,
                };
                break;
              }
            }
          }
          const bubbleIndex = next.findIndex((msg) => msg.id === assistantLocalId);
          const completed = {
            ...assistantBubble,
            id: data.assistantMessageId || assistantLocalId,
            content: data.reply,
            pending: false,
            streaming: false,
            actions: data.actions || [],
          };
          if (bubbleIndex >= 0) next[bubbleIndex] = completed;
          else next.push(completed);
          return next;
        });
        return;
      }

      if (!res.ok) {
        // Some proxies may still send SSE on error; try parse once.
        throw new Error("Something went wrong.");
      }

      let assistantMessageId = null;
      let actions = [];

      await readAssistantSse(res, {
        onTranscript: (transcript) => {
          setMessages((prev) => {
            const next = [...prev];
            for (let idx = next.length - 1; idx >= 0; idx--) {
              if (
                next[idx].role === "user" &&
                next[idx].source === "text" &&
                next[idx].pending
              ) {
                next[idx] = {
                  ...next[idx],
                  content: transcript,
                  pending: false,
                };
                break;
              }
            }
            return next;
          });
        },
        onDelta: (delta) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantLocalId
                ? {
                    ...msg,
                    content: `${msg.content || ""}${delta}`,
                    pending: false,
                  }
                : msg
            )
          );
        },
        onDone: (done) => {
          assistantMessageId = done.assistantMessageId;
          actions = done.actions || [];
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantLocalId
                ? {
                    ...msg,
                    id: done.assistantMessageId || msg.id,
                    pending: false,
                    streaming: false,
                    actions,
                  }
                : msg
            )
          );
        },
      });

      if (!assistantMessageId) {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (err) {
      setMessages((prev) =>
        prev.filter((m) => !m.pending && m.id !== assistantLocalId)
      );
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      requestInFlightRef.current = false;
      setSending(false);
    }
  };

  const sendText = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending || requestInFlightRef.current || !conversationId) return;
    requestInFlightRef.current = true;

    // Typing switches the interaction back to text mode. Keeping the
    // realtime microphone active here lets a voice turn race the text
    // request, which can leave a stale thinking bubble or speak a second
    // reply over the streamed text response.
    if (voiceActiveRef.current) {
      voice.stop("switch_to_text");
    } else {
      voice.noteActivity();
    }
    if (trimmed === "Talk to the salon") {
      setMessages((prev) => [
        ...prev,
        createClientMessage("user", trimmed),
      ]);
      await requestHandoff();
      return;
    }

    setMessages((prev) => [
      ...prev,
      createClientMessage("user", trimmed),
    ]);
    setInput("");
    await sendPayload({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        sessionId: sessionIdRef.current,
        message: trimmed,
      }),
    });
  };

  const startVoice = () => {
    setError(null);
    if (!detectVoiceSupport()) {
      setError(
        isIOSWebView() || isAndroidWebView()
          ? VOICE_UNSUPPORTED_IN_APP
          : VOICE_UNSUPPORTED_BROWSER
      );
      return;
    }
    voiceUserBubblesRef.current = new Map();
    voiceAssistantBubblesRef.current = new Map();
    voice.start();
  };

  const endVoice = () => {
    voice.stop("user_end");
  };

  const closePanel = () => {
    if (voiceActiveRef.current) voice.stop("panel_closed");
    onClose();
  };

  useEffect(() => {
    if (isOpen) return;
    if (voiceActiveRef.current) voice.stop("panel_closed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div
      className={styles.panel}
      onKeyDown={(event) => event.key === "Escape" && closePanel()}
      onPointerDown={voice.noteActivity}
    >
      <header className={styles.header}>
        <div className={styles.headerIdentity}>
          <Image
            src={ASSISTANT_AVATAR_SRC}
            alt=""
            width={36}
            height={36}
            className={styles.headerFace}
          />
          <span className={styles.headerTitle}>{ASSISTANT_WELCOME.title}</span>
        </div>
        <div className={styles.headerButtons}>
        <button
          type="button"
          className={styles.headerButton}
          onClick={closePanel}
          aria-label="Close assistant"
          title="Close"
        >
          <X size={16} aria-hidden="true" />
        </button>
        </div>
      </header>

      {showNamePrompt && (
        <div className={styles.namePrompt}>
          <label className={styles.namePromptLabel} htmlFor="assistant-name">
            {ASSISTANT_WELCOME.nameLabel}
          </label>
          <div className={styles.namePromptRow}>
            <input
              id="assistant-name"
              type="text"
              className={styles.namePromptInput}
              value={nameInput}
              maxLength={80}
              disabled={!conversationId}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveGuestName();
                }
              }}
              placeholder={ASSISTANT_WELCOME.namePrompt}
              aria-label={ASSISTANT_WELCOME.nameLabel}
            />
            <button
              type="button"
              className={styles.namePromptSave}
              onClick={saveGuestName}
              disabled={!conversationId || !nameInput.trim()}
            >
              {ASSISTANT_WELCOME.nameSaveLabel}
            </button>
            <button
              type="button"
              className={styles.namePromptDismiss}
              onClick={dismissNamePrompt}
              aria-label={ASSISTANT_WELCOME.nameDismissLabel}
              title={ASSISTANT_WELCOME.nameDismissLabel}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div
        className={styles.messages}
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.map((msg, i) => (
          <div
            key={msg.id || `${msg.role}-${i}`}
            className={
              msg.role === "user"
                ? styles.userMessageRow
                : styles.assistantMessageRow
            }
          >
            {msg.role === "assistant" && (
              <Image
                src={ASSISTANT_AVATAR_SRC}
                alt=""
                width={28}
                height={28}
                className={styles.bubbleFace}
              />
            )}
            <div
              className={msg.role === "user" ? styles.userMessage : styles.assistantMessage}
            >
            <p
              className={`${styles.messageText} ${
                msg.pending && !msg.content ? styles.typing : ""
              }`}
            >
              {msg.role === "assistant"
                ? linkifyToNodes(msg.content, styles.inlineLink)
                : msg.content || (msg.pending ? "…" : "")}
            </p>
            {msg.actions?.length > 0 && (
              <div className={styles.actions}>
                {msg.actions.map((action, j) => (
                  <a
                    key={`${action.type}-${action.url}-${j}`}
                    href={action.url}
                    target={action.type === "call" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={styles.actionButton}
                    aria-label={
                      action.type === "call"
                        ? action.label
                        : `${action.label} (opens in a new tab)`
                    }
                  >
                    {actionIcon(action.type)}
                    <span>{action.label}</span>
                  </a>
                ))}
              </div>
            )}
            </div>
          </div>
        ))}
        {voice.status === "thinking" && (
          <div className={styles.assistantMessageRow}>
            <Image
              src={ASSISTANT_AVATAR_SRC}
              alt=""
              width={28}
              height={28}
              className={styles.bubbleFace}
            />
            <div className={styles.assistantMessage}>
              <p className={`${styles.messageText} ${styles.typing}`}>…</p>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className={styles.chips}>
          {ASSISTANT_QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={styles.chip}
              onClick={() => sendText(chip)}
              disabled={sending}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.composer}>
        {voice.active && (
          <div className={styles.voiceStatusBar} role="status" aria-live="polite">
            <span
              className={`${styles.voiceStatusDot} ${
                styles[`voiceDot_${voice.status}`] || ""
              }`}
              aria-hidden="true"
            />
            <span className={styles.voiceStatusLabel}>{voiceStatusLabel}</span>
            <button
              type="button"
              className={styles.voiceMuteButton}
              onClick={voice.toggleMute}
              aria-pressed={voice.muted}
              aria-label={voice.muted ? "Unmute microphone" : "Mute microphone"}
              title={voice.muted ? "Unmute microphone" : "Mute microphone"}
            >
              {voice.muted ? (
                <MicOff size={14} aria-hidden="true" />
              ) : (
                <Mic size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
        <form
          className={styles.inputRow}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            sendText(input);
          }}
        >
          <button
            type="button"
            className={`${styles.voiceOrb} ${
              voice.active ? styles.voiceOrbLive : ""
            } ${voice.status === "speaking" ? styles.voiceOrbSpeaking : ""}`}
            onClick={voice.active ? endVoice : startVoice}
            disabled={voice.status === "connecting" || voice.status === "ending"}
            aria-pressed={voice.active}
            aria-label={
              voice.active
                ? "End voice conversation"
                : "Start voice conversation"
            }
            title={
              voice.active
                ? "End voice conversation"
                : "Start voice conversation"
            }
          >
            <span className={styles.voiceAura} aria-hidden="true" />
            <span className={styles.voiceBlob} aria-hidden="true">
              <span className={styles.voiceBlobLayer} />
              <span
                className={`${styles.voiceBlobLayer} ${styles.voiceBlobLayerTwo}`}
              />
              <span
                className={`${styles.voiceBlobLayer} ${styles.voiceBlobLayerThree}`}
              />
            </span>
            <span className={styles.voiceLiveLabel} aria-hidden="true">
              {voice.active ? "End" : "Talk"}
            </span>
          </button>
          <input
            type="text"
            ref={textInputRef}
            className={styles.textInput}
            value={input}
            maxLength={1000}
            onChange={(e) => {
              setInput(e.target.value);
              voice.noteActivity();
              if (error) setError(null);
            }}
            placeholder={
              voice.active
                ? "Speak, or type here…"
                : "Ask about services, prices, locations…"
            }
            aria-label="Message"
            disabled={sending}
          />
          <button
            type="submit"
            className={styles.iconButton}
            disabled={sending || !input.trim()}
            aria-label="Send message"
            title="Send"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
