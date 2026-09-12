"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends Element>(margin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin, visible]);

  return { ref, visible };
}
