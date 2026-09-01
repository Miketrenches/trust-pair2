"use client";

import { useState } from "react";
import { PairCard } from "@/components/pair-card";
import { CATEGORIES, PAIRS, type Category } from "@/lib/markets";
import { cn } from "@/lib/utils";

export function MarketsGrid() {
  const [active, setActive] = useState<"All" | Category>("All");

  const visible =
    active === "All" ? PAIRS : PAIRS.filter((p) => p.market.category === active);

  return (
    <section id="markets" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="animate-live-dot size-2 rounded-full bg-yes" aria-hidden />
            <p className="text-sm font-medium text-yes">{PAIRS.length} live pairs</p>
          </div>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Coins trading against the odds
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Every coin here is quoted in YES shares of a live prediction
            market. When the odds move, the denominator moves — conviction is
            the price.
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((pair) => (
            <PairCard key={pair.id} pair={pair} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="text-3xl" aria-hidden>
            🐕
          </p>
          <p className="mt-3 font-display text-lg font-bold">
            No coins in this category yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to launch one. It&apos;ll work out. Trust me bro.
          </p>
        </div>
      )}
    </section>
  );
}
