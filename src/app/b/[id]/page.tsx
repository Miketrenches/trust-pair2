"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Basket,
  basketLifetime,
  findBasket,
  fmtUsd,
  fmtUsdCompact,
  hashString,
  makeFeeEvent,
  splitAmount,
} from "@/lib/social";
import { SocialNav, SocialFooter } from "@/components/social/nav";
import { Avatar } from "@/components/social/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";

export default function BasketPage({ params }: PageProps<"/b/[id]">) {
  const { id } = use(params);
  const [basket, setBasket] = useState<Basket | null | undefined>(undefined);

  useEffect(() => {
    setBasket(findBasket(id) ?? null);
  }, [id]);

  if (basket === undefined) {
    return (
      <div className="min-h-dvh">
        <SocialNav />
        <div className="py-32 text-center text-sm text-muted-foreground">Loading basket…</div>
      </div>
    );
  }

  if (basket === null) {
    return (
      <div className="min-h-dvh">
        <SocialNav />
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <h1 className="font-display text-2xl font-bold">Basket not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This basket doesn&apos;t exist on this device.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/create">Create one</Link>
          </Button>
        </div>
        <SocialFooter />
      </div>
    );
  }

  return <BasketDetail basket={basket} />;
}

function BasketDetail({ basket }: { basket: Basket }) {
  const life = basketLifetime(basket.id);
  const cumulative = splitAmount(basket.members, life.totalUsd);
  const seed = hashString(basket.id + ":history");
  const now = Date.now();
  const history = Array.from({ length: 8 }, (_, i) =>
    makeFeeEvent([basket], seed, i + 1, now - (i + 1) * (1000 * 60 * (18 + ((seed >> (i % 8)) % 90))))
  );

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(basket.tokenAddress);
      toast("Basket address copied — point your token's fees here");
    } catch {
      toast(basket.tokenAddress);
    }
  };

  return (
    <div className="min-h-dvh">
      <SocialNav />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">{basket.name}</h1>
              <Badge variant="outline" className="font-mono">${basket.ticker}</Badge>
              {!basket.preset && <Badge className="bg-pos/15 text-pos">yours</Badge>}
            </div>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{basket.tagline}</p>
            <button
              type="button"
              onClick={copyAddress}
              className="mt-3 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              title="Copy basket address"
            >
              {basket.tokenAddress} ⧉
            </button>
          </div>
          <div className="flex gap-3">
            {[
              { label: "routed (sim)", value: fmtUsdCompact(life.totalUsd) },
              { label: "fee events", value: String(life.events) },
              { label: "people", value: String(basket.members.length) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3 text-center">
                <div className="font-mono text-lg font-bold text-pos">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Members */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold">The basket</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {cumulative.map((p, i) => {
              const pct = p.member.weightBps / 100;
              return (
                <div
                  key={p.member.handle}
                  className={
                    "flex items-center gap-3 px-4 py-3 " + (i > 0 ? "border-t border-border/60" : "")
                  }
                >
                  <Avatar handle={p.member.handle} name={p.member.name} className="size-9 text-[11px]" />
                  <div className="w-44 min-w-0">
                    <div className="truncate text-sm font-medium">{p.member.name}</div>
                    <div className="truncate text-xs text-muted-foreground">@{p.member.handle}</div>
                  </div>
                  <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-muted sm:block">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-14 text-right font-mono text-xs text-muted-foreground">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="w-24 text-right font-mono text-sm font-semibold text-pos">
                    {fmtUsd(p.amountUsd)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-right text-[11px] text-muted-foreground">
            cumulative payouts per member · simulated preview
          </p>
        </section>

        {/* History */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold">Recent fee events</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {history.map((evt, i) => (
              <div
                key={evt.id}
                className={
                  "flex items-center gap-3 px-4 py-3 " + (i > 0 ? "border-t border-border/60" : "")
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-mono font-semibold text-pos">{fmtUsd(evt.grossUsd)}</span>{" "}
                    <span className="text-muted-foreground">
                      split {basket.members.length} ways
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {evt.sol.toFixed(3)} SOL @ ${evt.solPrice.toFixed(2)} · tx {evt.txId}
                  </div>
                </div>
                <Badge className="shrink-0 bg-pos/15 text-pos">Sent via X Money</Badge>
                <span className="w-20 shrink-0 text-right text-[11px] text-muted-foreground">
                  {new Date(evt.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="text-sm text-muted-foreground">
            Launch a token on Pump and set this basket address as the fee recipient.
          </div>
          <Button onClick={copyAddress}>Copy basket address</Button>
        </div>
      </main>
      <SocialFooter />
    </div>
  );
}
