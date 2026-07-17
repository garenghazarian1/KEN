/**
 * Play an audio/mpeg fetch Response. Prefers MediaSource so playback can start
 * before the full file arrives; falls back to a full blob when MSE fails.
 */

function waitForUpdateEnd(sourceBuffer) {
  if (!sourceBuffer.updating) return Promise.resolve();
  return new Promise((resolve) => {
    sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
  });
}

function appendChunk(sourceBuffer, chunk) {
  return new Promise((resolve, reject) => {
    const onUpdate = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("SourceBuffer append failed."));
    };
    const cleanup = () => {
      sourceBuffer.removeEventListener("updateend", onUpdate);
      sourceBuffer.removeEventListener("error", onError);
    };
    sourceBuffer.addEventListener("updateend", onUpdate);
    sourceBuffer.addEventListener("error", onError);
    try {
      sourceBuffer.appendBuffer(chunk);
    } catch (err) {
      cleanup();
      reject(err);
    }
  });
}

function playFromBlob(blob, { signal, onObjectUrl, onAudio } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const url = URL.createObjectURL(blob);
    onObjectUrl?.(url);
    const audio = new Audio(url);
    onAudio?.(audio);
    const onAbort = () => {
      audio.pause();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    audio.onended = () => {
      signal?.removeEventListener("abort", onAbort);
      resolve(audio);
    };
    audio.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      reject(new Error("Audio playback failed."));
    };
    audio.play().then(() => {}).catch(reject);
  });
}

async function drainReader(reader, chunks) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value?.byteLength) chunks.push(value);
  }
}

async function playWithMediaSource(reader, chunks, { signal, onObjectUrl, onAudio } = {}) {
  const mediaSource = new MediaSource();
  const url = URL.createObjectURL(mediaSource);
  onObjectUrl?.(url);
  const audio = new Audio(url);
  onAudio?.(audio);

  await new Promise((resolve, reject) => {
    const onAbort = () => reject(new DOMException("Aborted", "AbortError"));
    signal?.addEventListener("abort", onAbort, { once: true });

    mediaSource.addEventListener(
      "sourceopen",
      async () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
          let started = false;

          while (true) {
            if (signal?.aborted) {
              throw new DOMException("Aborted", "AbortError");
            }
            const { done, value } = await reader.read();
            if (done) break;
            if (!value?.byteLength) continue;
            chunks.push(value);
            await appendChunk(sourceBuffer, value);
            if (!started) {
              started = true;
              try {
                await audio.play();
              } catch {
                // Autoplay may be blocked; element is still available.
              }
            }
          }

          await waitForUpdateEnd(sourceBuffer);
          if (mediaSource.readyState === "open") {
            mediaSource.endOfStream();
          }

          if (!started) {
            await audio.play();
          }

          if (audio.ended) {
            signal?.removeEventListener("abort", onAbort);
            resolve(audio);
            return;
          }

          audio.onended = () => {
            signal?.removeEventListener("abort", onAbort);
            resolve(audio);
          };
          audio.onerror = () => {
            signal?.removeEventListener("abort", onAbort);
            reject(new Error("Audio playback failed."));
          };
        } catch (err) {
          signal?.removeEventListener("abort", onAbort);
          reject(err);
        }
      },
      { once: true }
    );
  });

  return audio;
}

/**
 * @param {Response} response
 * @param {{
 *   signal?: AbortSignal,
 *   onObjectUrl?: (url: string) => void,
 *   onAudio?: (audio: HTMLAudioElement) => void,
 * }} [options]
 * @returns {Promise<HTMLAudioElement>}
 */
export async function playMpegResponse(response, options = {}) {
  if (!response.ok) {
    throw new Error("TTS request failed.");
  }

  if (!response.body) {
    return playFromBlob(await response.blob(), options);
  }

  const mseOk =
    typeof MediaSource !== "undefined" &&
    MediaSource.isTypeSupported("audio/mpeg");

  const reader = response.body.getReader();
  const chunks = [];

  if (!mseOk) {
    await drainReader(reader, chunks);
    return playFromBlob(new Blob(chunks, { type: "audio/mpeg" }), options);
  }

  try {
    return await playWithMediaSource(reader, chunks, options);
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    try {
      await drainReader(reader, chunks);
    } catch {
      // ignore drain errors after a failed MSE attempt
    }
    if (!chunks.length) throw err;
    return playFromBlob(new Blob(chunks, { type: "audio/mpeg" }), options);
  }
}
