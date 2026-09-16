"use client";

import { useEffect, useRef, useState } from "react";
import { PRESET_BASKETS, fmtUsd, splitAmount } from "@/lib/social";
import { Avatar } from "@/components/social/avatar";

const basket = PRESET_BASKETS[0]; // KOL Coin
const FEE_USD = 240;
const payouts = splitAmount(basket.members.slice(0, 6), FEE_USD);

const W = 520;
const H = 380;
const SRC = { x: 92, y: H / 2 };
const TARGET_X = 428;

function targetY(i: number, count: number): number {
  const pad = 34;
  return pad + (i * (H - pad * 2)) / (count - 1);
}

function pathFor(i: number, count: number): string {
  const ty = targetY(i, count);
  const mx = (SRC.x + TARGET_X) / 2;
  return `M ${SRC.x} ${SRC.y} C ${mx} ${SRC.y}, ${mx} ${ty}, ${TARGET_X} ${ty}`;
}

export function FanoutVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const count = payouts.length;

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[520px]" style={{ height: H * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})` }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0" fill="none">
          {payouts.map((_, i) => (
            <path key={i} d={pathFor(i, count)} stroke="url(#fan-stroke)" strokeWidth="1.25" />
          ))}
          <defs>
            <linearGradient id="fan-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
            </linearGradient>
          </defs>
        </svg>

        {/* traveling dollar dots */}
        {payouts.map((_, i) => (
          <div
            key={i}
            className="travel-dot absolute size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(79,124,255,0.9)]"
            style={{
              offsetPath: `path("${pathFor(i, count)}")`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}

        {/* source token node */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: SRC.x, top: SRC.y }}
        >
          <div className="relative">
            <div className="ping-soft absolute inset-0 rounded-2xl bg-primary/40" />
            <div className="relative flex flex-col items-center gap-0.5 rounded-2xl border border-primary/40 bg-card px-4 py-3 shadow-[0_0_30px_rgba(79,124,255,0.25)]">
              <span className="font-display text-base font-bold">${basket.ticker}</span>
              <span className="text-[10px] text-muted-foreground">creator fees</span>
              <span className="font-mono text-xs font-semibold text-pos">{fmtUsd(FEE_USD)}</span>
            </div>
          </div>
        </div>

        {/* member nodes */}
        {payouts.map((p, i) => (
          <div
            key={p.member.handle}
            className="absolute -translate-y-1/2"
            style={{ left: TARGET_X, top: targetY(i, count) }}
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 shadow-sm">
              <Avatar handle={p.member.handle} name={p.member.name} className="size-6 text-[8px]" />
              <div className="leading-none">
                <div className="text-[11px] font-medium whitespace-nowrap">{p.member.name}</div>
                <div className="font-mono text-[10px] text-pos">+{fmtUsd(p.amountUsd)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
