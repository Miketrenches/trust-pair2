"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FeeEvent,
  PRESET_BASKETS,
  fmtUsd,
  makeFeeEvent,
} from "@/lib/social";
import { Avatar, AvatarStack } from "@/components/social/avatar";
import { Badge } from "@/components/ui/badge";

const SEED = 20260916;
const MAX_EVENTS = 7;

function ago(ts: number, now: number): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

type FeedRow = FeeEvent & { sent: boolean };

export function LiveFeed() {
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [now, setNow] = useState(0);
  const counter = useRef(0);

  useEffect(() => {
    const t = Date.now();
    setNow(t);
    // seed history
    const initial: FeedRow[] = [];
    for (let i = 0; i < 5; i++) {
      counter.current += 1;
      initial.unshift({
        ...makeFeeEvent(PRESET_BASKETS, SEED, counter.current, t - (i + 1) * 47_000 - 12_000),
        sent: true,
      });
    }
    setRows(initial.reverse());

    const tick = setInterval(() => setNow(Date.now()), 1000);

    let timeout: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      timeout = setTimeout(() => {
        counter.current += 1;
        const evt: FeedRow = {
          ...makeFeeEvent(PRESET_BASKETS, SEED, counter.current, Date.now()),
          sent: false,
        };
        setRows((r) => [evt, ...r].slice(0, MAX_EVENTS));
        setTimeout(() => {
          setRows((r) => r.map((x) => (x.id === evt.id ? { ...x, sent: true } : x)));
        }, 2200);
        scheduleNext();
      }, 4500 + Math.random() * 4000);
    };
    scheduleNext();

    return () => {
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pos opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-pos" />
          </span>
          <span className="text-sm font-medium">Live basket payouts</span>
        </div>
        <span className="text-xs text-muted-foreground">simulated preview</span>
      </div>
      <div className="divide-y divide-border">
        {rows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Listening for fee events…
          </div>
        )}
        {rows.map((evt) => (
          <FeedItem key={evt.id} evt={evt} now={now} />
        ))}
      </div>
    </div>
  );
}

function FeedItem({ evt, now }: { evt: FeedRow; now: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="feed-in">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
      >
        <AvatarStack members={evt.basket.members} max={4} size="size-6" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm">
            <span className="font-mono font-semibold text-pos">{fmtUsd(evt.grossUsd)}</span>{" "}
            <span className="text-muted-foreground">fee on</span>{" "}
            <Link
              href={`/b/${evt.basket.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium hover:underline"
            >
              ${evt.basket.ticker}
            </Link>{" "}
            <span className="text-muted-foreground">
              → {evt.basket.members.length} people
            </span>
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            {evt.sol.toFixed(3)} SOL @ ${evt.solPrice.toFixed(2)} · tx {evt.txId.slice(0, 10)}…
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {evt.sent ? (
            <Badge className="bg-pos/15 text-pos">Sent via X Money</Badge>
          ) : (
            <Badge className="bg-primary/15 text-primary">Routing…</Badge>
          )}
          <span className="text-[11px] text-muted-foreground">{now ? ago(evt.timestamp, now) : ""}</span>
        </div>
      </button>
      {open && (
        <div className="grid grid-cols-1 gap-1.5 border-t border-border/60 bg-muted/40 px-4 py-3 sm:grid-cols-2">
          {evt.payouts.map((p) => (
            <div key={p.member.handle} className="flex items-center gap-2 text-sm">
              <Avatar handle={p.member.handle} name={p.member.name} className="size-6 text-[8px]" />
              <span className="min-w-0 truncate">
                {p.member.name}{" "}
                <span className="text-xs text-muted-foreground">@{p.member.handle}</span>
              </span>
              <span className="ml-auto font-mono text-xs font-semibold text-pos">
                +{fmtUsd(p.amountUsd)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
