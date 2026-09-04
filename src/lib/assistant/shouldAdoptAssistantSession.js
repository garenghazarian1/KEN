/**
 * Decide whether the widget may keep a conversation created while a
 * POST /api/assistant/session request was in flight.
 *
 * If the guest closed the panel (or ended the chat) before the response
 * arrived, adopting the id would leave Mongo `open` with no client owner.
 *
 * @param {{
 *   panelOpen: boolean,
 *   startedGeneration: number,
 *   currentGeneration: number,
 * }} args
 * @returns {boolean}
 */
export function shouldAdoptAssistantSession({
  panelOpen,
  startedGeneration,
  currentGeneration,
}) {
  return Boolean(panelOpen && startedGeneration === currentGeneration);
}
