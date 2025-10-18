"use client";

import { useEffect, useRef } from "react";

export function LoadMoreSentinel({
  onLoadMore,
  hasMore,
}: {
  onLoadMore: () => void;
  hasMore: boolean | undefined;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [onLoadMore, hasMore]);

  return (
    <div
      ref={ref}
      style={{ padding: "1rem", textAlign: "center", color: "var(--muted)" }}
    >
      {hasMore ? "Loading more…" : "No more results."}
    </div>
  );
}
