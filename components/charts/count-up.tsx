"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function CountUp({
  value,
  duration = 1400,
  className,
  format,
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCurrent(value);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const delay = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 80);

    return () => {
      window.clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {format ? format(current) : Math.round(current).toLocaleString("ko-KR")}
    </span>
  );
}

export function formatCompactKorean(value: number, target = value) {
  if (target >= 10_000) return `${(value / 10_000).toFixed(1)}만`;
  if (target >= 1_000) return `${(value / 1_000).toFixed(1)}천`;
  return Math.round(value).toString();
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}
