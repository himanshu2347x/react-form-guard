export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, wait = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

export function throttle<Args extends unknown[]>(fn: (...args: Args) => void, limit = 1000) {
  let inThrottle = false;
  let trailingArgs: Args | null = null;

  const invoke = (...args: Args) => {
    fn(...args);
  };

  return (...args: Args) => {
    if (!inThrottle) {
      invoke(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (trailingArgs) {
          invoke(...trailingArgs);
          trailingArgs = null;
        }
      }, limit);
    } else {
      // keep last args for trailing call
      trailingArgs = args;
    }
  };
}
