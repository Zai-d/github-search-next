import { useCallback, useEffect, useRef, useState } from "react";

type Opts = IntersectionObserverInit;

export function useInView(
  options?: Opts
): [(node: Element | null) => void, boolean] {
  const [inView, setInView] = useState(false);
  const nodeRef = useRef<Element | null>(null);

  const setRef = useCallback((node: Element | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setInView(true);
    }, options);
    io.observe(node);
    return () => io.disconnect();
  }, [options]);

  return [setRef, inView];
}
