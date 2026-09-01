"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/toast";
import { MARKETS } from "@/lib/markets";
import { cn } from "@/lib/utils";
import { Check, ImagePlus, Loader2, PartyPopper } from "lucide-react";

export function LaunchSection() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState<{ symbol: string; market: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const chosen = MARKETS.find((m) => m.id === selected);

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 512 * 1024) {
      toast("Image too big — 512 KB max");
      return;
    }
    setImage(URL.createObjectURL(file));
    setImageName(file.name);
  };

  const handleLaunch = () => {
    if (!chosen || launching) return;
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      setLaunched({ symbol, market: chosen.question });
      toast(`$${symbol} launched against the odds (demo)`);
    }, 1400);
  };

  const reset = () => {
    setName("");
    setSymbol("");
    setSelected(null);
    setImage(null);
    setImageName(null);
    setLaunched(null);
  };

  return (
    <section id="launch" className="scroll-mt-20 bg-black/30 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Launch a coin. Pick your market.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Fixed-supply token, one-sided liquidity pool, quoted against the
            YES share of the prediction market you choose. Payment, mint and
            pool land in one bundle, or not at all.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            {launched ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-yes/10 text-yes">
                  <PartyPopper className="size-7" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold">
                    ${launched.symbol} is live
                  </p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Trading against &ldquo;{launched.market}&rdquo; — demo
                    launch, no chain was harmed.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                  onClick={reset}
                >
                  Launch another
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="coin-name">
                    Coin name
                  </label>
                  <Input
                    id="coin-name"
                    placeholder="Trust Me Bro Classic"
                    maxLength={32}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl bg-background/60"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Maximum 32 characters</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold" htmlFor="coin-symbol">
                    Symbol
                  </label>
                  <Input
                    id="coin-symbol"
                    placeholder="TMBC"
                    maxLength={10}
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="rounded-xl bg-background/60 font-mono"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Maximum 10 characters</p>
                </div>

                <div>
                  <p className="mb-1.5 text-sm font-semibold">Coin image</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => pickImage(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 px-4 py-8 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt="Coin image preview"
                          className="size-16 rounded-xl object-cover"
                        />
                        <span className="max-w-full truncate text-sm">{imageName}</span>
                        <span className="text-xs">Click to replace</span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="size-6" />
                        <span className="text-sm">PNG, JPEG or WebP · square · up to 512 KB</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl bg-accent/60 px-4 py-3 text-sm">
                  <p className="font-semibold text-accent-foreground">Pool fee: 1%</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Split 50/50 — you earn 0.5% of every trade, the platform keeps
                    0.5% and burns $TRUST with it.
                  </p>
                </div>

                <Button
                  size="lg"
                  disabled={!name || !symbol || !selected || launching}
                  onClick={handleLaunch}
                  className="rounded-lg bg-primary text-base hover:bg-primary/90"
                >
                  {launching ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Launching ${symbol}…
                    </>
                  ) : chosen ? (
                    `Launch $${symbol || "?"} against the odds`
                  ) : (
                    "Pick a market to launch"
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo interface — launches aren&apos;t live yet. Soon. Trust me bro.
                </p>
              </>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">
              Quote market{" "}
              <span className="font-normal text-muted-foreground">
                — your coin will trade against this market&apos;s YES share
              </span>
            </p>
            <div className="grid max-h-[520px] gap-2.5 overflow-y-auto pr-1">
              {MARKETS.map((m) => {
                const isSelected = selected === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3.5 text-left transition-all",
                      isSelected
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{m.question}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {m.category} · resolves {m.resolves} · {m.volume} vol
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge className="bg-primary/12 font-mono text-primary">
                        YES {m.yesPct}%
                      </Badge>
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-muted"
                        )}
                      >
                        {isSelected && <Check className="size-3" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
