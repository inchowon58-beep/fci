"use client";

import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/cn";

function toPath(
  values: number[],
  width: number,
  getY: (value: number, index: number) => number,
) {
  if (values.length === 0) return "";
  const step = width / Math.max(values.length - 1, 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = getY(value, index);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function clickBandY(value: number, values: number[], height: number, impressionY: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const top = height * 0.62;
  const bottom = height * 0.9;
  const bandY = bottom - ((value - min) / range) * (bottom - top);
  const belowBlue = impressionY + height * 0.07;
  return Math.min(height * 0.94, Math.max(bandY, belowBlue));
}

function drawPath(el: SVGPathElement | null, durationMs: number, delayMs = 0) {
  if (!el) return () => {};
  const length = el.getTotalLength();
  el.style.strokeDasharray = `${length}`;
  el.style.strokeDashoffset = `${length}`;
  el.style.opacity = "1";

  let frame = 0;
  let startAt = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (now: number) => {
    if (!startAt) startAt = now;
    const elapsed = now - startAt - delayMs;
    if (elapsed < 0) {
      frame = requestAnimationFrame(run);
      return;
    }
    if (reduce) {
      el.style.strokeDashoffset = "0";
      return;
    }
    const t = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.style.strokeDashoffset = `${length * (1 - eased)}`;
    if (t < 1) frame = requestAnimationFrame(run);
  };

  frame = requestAnimationFrame(run);
  return () => cancelAnimationFrame(frame);
}

export function LineChart({
  impressions,
  clicks,
  yMax,
  labels,
  className,
  dark = true,
}: {
  impressions: number[];
  clicks: number[];
  yMax: number;
  labels: string[];
  className?: string;
  dark?: boolean;
}) {
  const rawId = useId();
  const gradId = `chart-grad-${rawId.replace(/:/g, "")}`;
  const impressionRef = useRef<SVGPathElement | null>(null);
  const clickRef = useRef<SVGPathElement | null>(null);
  const areaRef = useRef<SVGPathElement | null>(null);

  const width = 680;
  const height = 228;
  const padLeft = 52;
  const padRight = 10;
  const padY = 10;
  const innerW = width - padLeft - padRight;
  const innerH = height - padY * 2;
  const axisColor = dark ? "rgba(232,232,239,0.4)" : "#a8a29e";
  const gridColor = dark ? "rgba(232,232,239,0.08)" : "#e7e5e4";

  const impressionY = (value: number) => innerH - (value / yMax) * innerH;
  const clickY = (value: number, index: number) =>
    clickBandY(value, clicks, innerH, impressionY(impressions[index] ?? 0));

  const impressionPath = useMemo(
    () => toPath(impressions, innerW, impressionY),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [impressions, innerW, innerH, yMax],
  );
  const clickPath = useMemo(
    () => toPath(clicks, innerW, clickY),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clicks, impressions, innerW, innerH, yMax],
  );
  const areaPath = `${impressionPath} L ${innerW} ${innerH} L 0 ${innerH} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1];

  useLayoutEffect(() => {
    const stopA = drawPath(impressionRef.current, 1600, 0);
    const stopB = drawPath(clickRef.current, 1600, 220);
    if (areaRef.current) {
      areaRef.current.style.opacity = "0";
      const t = window.setTimeout(() => {
        if (areaRef.current) areaRef.current.style.opacity = "1";
      }, 450);
      return () => {
        stopA();
        stopB();
        window.clearTimeout(t);
      };
    }
    return () => {
      stopA();
      stopB();
    };
  }, [impressionPath, clickPath]);

  return (
    <div className={cn("w-full", className)} style={{ minHeight: 220 }}>
      <svg
        viewBox={`0 0 ${width} ${height + 34}`}
        width="100%"
        height="100%"
        style={{ display: "block", width: "100%", height: "auto", minHeight: 220 }}
        role="img"
        aria-label="최근 60일 콘텐츠 노출·클릭 추이 그래프"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`translate(${padLeft} ${padY})`}>
          {grid.map((ratio) => (
            <g key={ratio}>
              <line
                x1="0"
                x2={innerW}
                y1={innerH * (1 - ratio)}
                y2={innerH * (1 - ratio)}
                stroke={gridColor}
                strokeDasharray={ratio === 0 ? "0" : "4 6"}
              />
              <text
                x="-10"
                y={innerH * (1 - ratio) + 4}
                textAnchor="end"
                fontSize="10"
                fill={axisColor}
              >
                {Math.round(yMax * ratio).toLocaleString("ko-KR")}
              </text>
            </g>
          ))}

          <path
            ref={areaRef}
            d={areaPath}
            fill={`url(#${gradId})`}
            style={{ opacity: 0, transition: "opacity 0.8s ease 0.45s" }}
          />
          <path
            ref={impressionRef}
            d={impressionPath}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 1 }}
          />
          <path
            ref={clickRef}
            d={clickPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 1 }}
          />

          {impressions.map((value, index) => {
            const step = Math.max(1, Math.floor(impressions.length / 6));
            if (index % step !== 0 && index !== impressions.length - 1) return null;
            const x = (index / Math.max(impressions.length - 1, 1)) * innerW;
            return (
              <circle
                key={`imp-${index}-${value}`}
                cx={x}
                cy={impressionY(value)}
                r="4"
                fill="#93c5fd"
              />
            );
          })}
          {clicks.map((value, index) => {
            const step = Math.max(1, Math.floor(clicks.length / 6));
            if (index % step !== 0 && index !== clicks.length - 1) return null;
            const x = (index / Math.max(clicks.length - 1, 1)) * innerW;
            return (
              <circle
                key={`clk-${index}-${value}`}
                cx={x}
                cy={clickY(value, index)}
                r="3.5"
                fill="#f59e0b"
              />
            );
          })}
        </g>

        {labels.map((label, index) => {
          const x = padLeft + (index / Math.max(labels.length - 1, 1)) * innerW;
          return (
            <text
              key={label}
              x={x}
              y={height + 26}
              textAnchor="middle"
              fontSize="11"
              fill={dark ? "rgba(232,232,239,0.45)" : "#78716c"}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
