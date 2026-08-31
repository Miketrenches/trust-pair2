"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TRUST_CONTRACT } from "@/lib/markets";
import { Check, Copy, Rocket, Sparkles } from "lucide-react";

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
    <section className="sky-gradient candles-bg relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:pt-20 lg:pb-24">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <Badge className="rounded-full border-white/70 bg-white/70 px-3 py-1 text-primary shadow-sm backdrop-blur">
            <Sparkles className="size-3.5" />
            The launchpad for conviction
          </Badge>

          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Pair any memecoin with a{" "}
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              live prediction market
            </span>
          </h1>

          <p className="max-w-md text-lg text-foreground/70">
            Launchpads pair coins with SOL. stonk.fun pairs them with stocks.
            Trust Markets pairs them with the odds themselves — your coin
            trades against the YES share of a real market. Trust me bro.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full bg-primary px-7 text-base shadow-lg shadow-primary/25 hover:bg-primary/90"
              asChild
            >
              <Link href="#launch">
                <Rocket />
                Launch a coin
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-primary/30 bg-white/70 px-7 text-base text-primary backdrop-blur hover:bg-white"
              asChild
            >
              <Link href="#markets">Browse markets</Link>
            </Button>
          </div>

          <button
            onClick={copyContract}
            className="group mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-white"
          >
            <span className="font-sans font-semibold text-primary">$TRUST</span>
            <span className="truncate">{TRUST_CONTRACT}</span>
            {copied ? (
              <Check className="size-3.5 shrink-0 text-yes" />
            ) : (
              <Copy className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
            )}
          </button>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="animate-float relative">
            <div className="absolute -inset-8 rounded-full bg-white/40 blur-3xl" aria-hidden />
            <Image
              src="/trust-hero.jpg"
              alt="The $TRUST shiba, eyes closed, radiating pure trust"
              width={460}
              height={460}
              priority
              className="relative size-[300px] rounded-[2.5rem] object-cover shadow-2xl shadow-primary/20 ring-4 ring-white/70 sm:size-[380px] lg:size-[440px]"
            />
            <span className="animate-sparkle absolute -top-3 -right-2 text-3xl" aria-hidden>
              ✨
            </span>
            <span
              className="animate-sparkle absolute -bottom-2 -left-3 text-2xl [animation-delay:1.2s]"
              aria-hidden
            >
              ✨
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
