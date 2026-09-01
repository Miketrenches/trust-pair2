"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PAIRS, TRUST_CONTRACT } from "@/lib/markets";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

const TAPE = PAIRS.slice(0, 4);

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(TRUST_CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-24 lg:pb-28">
        <div className="flex flex-col items-start gap-6">
          <p className="font-display text-xs text-primary">
            Launch against the odds
          </p>

          <h1 className="font-sans text-4xl leading-[1.1] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Memecoins priced in conviction, not collateral
          </h1>

          <p className="max-w-md text-base text-muted-foreground">
            Launchpads pair coins with SOL. stonk.fun pairs them with stocks.
            Here your coin trades against the YES share of a real prediction
            market. Trust me bro.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-lg bg-primary px-7 text-base hover:bg-primary/90"
              asChild
            >
              <Link href="#launch">Launch a coin</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg border-border bg-card/70 px-7 text-base text-foreground backdrop-blur hover:bg-card"
              asChild
            >
              <Link href="#markets">Browse markets</Link>
            </Button>
          </div>

          <button
            onClick={copyContract}
            className="group mt-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card/70 px-4 py-2 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-card"
          >
            <span className="font-semibold text-primary">$TRUST</span>
            <span className="truncate">{TRUST_CONTRACT}</span>
            {copied ? (
              <Check className="size-3.5 shrink-0 text-yes" />
            ) : (
              <Copy className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
            )}
          </button>
        </div>

        <div className="glass overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="font-display text-xs text-primary">
              Market tape
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 animate-live-dot rounded-full bg-yes" />
              live
            </span>
          </div>

          {TAPE.map((p) => (
            <Link
              key={p.id}
              href="#markets"
              className="flex items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5"
            >
              <Image
                src={p.image}
                alt={`${p.coinName} logo`}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">${p.symbol}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.market.question}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold">
                  {p.priceInYes} <span className="text-xs text-muted-foreground">YES</span>
                </p>
                <p
                  className={cn(
                    "text-xs",
                    p.change24h >= 0 ? "text-yes" : "text-no"
                  )}
                >
                  {p.change24h >= 0 ? "+" : ""}
                  {p.change24h}% · 24h
                </p>
              </div>
            </Link>
          ))}

          <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
            <span>{PAIRS.length} live pairs</span>
            <Link href="#markets" className="text-primary hover:underline">
              view all →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
