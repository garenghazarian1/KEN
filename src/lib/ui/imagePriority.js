/**
 * Only the page LCP image may be eager and high priority.
 * Every other content image stays lazy and low so the browser
 * cannot promote it on a busy or quiet run.
 */
export function imagePriorityProps(isLcp) {
  if (isLcp) {
    return {
      loading: "eager",
      fetchPriority: "high",
      priority: true,
    };
  }
  return {
    loading: "lazy",
    fetchPriority: "low",
    priority: false,
  };
}
