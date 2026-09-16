"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Basket,
  equalWeights,
  fakeTokenAddress,
  fmtUsd,
  hashString,
  mulberry32,
  saveUserBasket,
  splitAmount,
} from "@/lib/social";
import { Avatar } from "@/components/social/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";

type Row = { handle: string; name: string; pct: string };

const SUGGESTIONS: [string, string][] = [
  ["elonmusk", "Elon Musk"],
  ["blknoiz06", "Ansem"],
  ["aeyakovenko", "Toly"],
  ["sama", "Sam Altman"],
  ["cobie", "Cobie"],
  ["0xMert_", "Mert"],
  ["karpathy", "Andrej Karpathy"],
  ["naval", "Naval"],
];

const PREVIEW_FEES = 1000;

export function BasketBuilder() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [tagline, setTagline] = useState("");
  const [mode, setMode] = useState<"equal" | "custom">("equal");
  const [rows, setRows] = useState<Row[]>([
    { handle: "", name: "", pct: "" },
    { handle: "", name: "", pct: "" },
  ]);

  const filled = rows.filter((r) => r.handle.trim() !== "");

  const members = useMemo(() => {
    if (filled.length === 0) return [];
    if (mode === "equal") {
      const weights = equalWeights(filled.length);
      return filled.map((r, i) => ({
        handle: r.handle.trim().replace(/^@/, ""),
        name: r.name.trim() || r.handle.trim().replace(/^@/, ""),
        weightBps: weights[i],
      }));
    }
    return filled.map((r) => ({
      handle: r.handle.trim().replace(/^@/, ""),
      name: r.name.trim() || r.handle.trim().replace(/^@/, ""),
      weightBps: Math.round((parseFloat(r.pct) || 0) * 100),
    }));
  }, [filled, mode]);

  const totalBps = members.reduce((a, m) => a + m.weightBps, 0);
  const weightsValid = mode === "equal" || totalBps === 10_000;
  const preview = weightsValid && members.length >= 2 ? splitAmount(members, PREVIEW_FEES) : [];

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const addRow = (handle = "", displayName = "") => {
    setRows((rs) => {
      // fill first empty row before appending
      const emptyIdx = handle ? rs.findIndex((r) => r.handle.trim() === "") : -1;
      if (handle && emptyIdx !== -1) {
        return rs.map((r, j) => (j === emptyIdx ? { handle, name: displayName, pct: "" } : r));
      }
      return [...rs, { handle, name: displayName, pct: "" }];
    });
  };

  const removeRow = (i: number) => setRows((rs) => rs.filter((_, j) => j !== i));

  const alreadyAdded = (handle: string) =>
    rows.some((r) => r.handle.trim().replace(/^@/, "").toLowerCase() === handle.toLowerCase());

  const launch = () => {
    if (!name.trim()) return toast("Give your basket a name");
    if (!ticker.trim()) return toast("Pick a ticker");
    if (members.length < 2) return toast("A basket needs at least 2 people");
    const handles = members.map((m) => m.handle.toLowerCase());
    if (new Set(handles).size !== handles.length) return toast("Duplicate handles in the basket");
    if (!weightsValid) return toast(`Weights must total 100% (currently ${(totalBps / 100).toFixed(1)}%)`);

    const id = "u-" + Date.now().toString(36);
    const rand = mulberry32(hashString(id));
    const basket: Basket = {
      id,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase().replace(/^\$/, ""),
      tagline: tagline.trim() || `${members.length} people, one fee stream.`,
      tokenAddress: fakeTokenAddress(rand),
      members,
      preset: false,
      createdAt: Date.now(),
    };
    saveUserBasket(basket);
    toast(`$${basket.ticker} basket created`);
    router.push(`/b/${basket.id}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Basics */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">1 · Basics</h2>
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <Input
            placeholder="Basket name — e.g. KOL Coin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Ticker — e.g. KOL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            maxLength={10}
          />
        </div>
        <Input
          className="mt-3"
          placeholder="Tagline (optional) — what is this basket funding?"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </section>

      {/* Members */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">2 · People</h2>
          <div className="flex rounded-lg border border-border p-0.5">
            {(["equal", "custom"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "equal" ? "Equal split" : "Custom weights"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 text-right font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>
              <Input
                placeholder="@handle"
                value={r.handle}
                onChange={(e) => update(i, { handle: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="Display name"
                value={r.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="hidden flex-1 sm:block"
              />
              {mode === "custom" && (
                <div className="relative w-24">
                  <Input
                    placeholder="0"
                    inputMode="decimal"
                    value={r.pct}
                    onChange={(e) => update(i, { pct: e.target.value })}
                    className="pr-7 text-right font-mono"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeRow(i)}
                disabled={rows.length <= 2}
                aria-label="Remove"
                className="text-muted-foreground"
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => addRow()}>
            + Add person
          </Button>
          {mode === "custom" && (
            <span
              className={cn(
                "ml-auto font-mono text-xs",
                weightsValid ? "text-pos" : "text-destructive"
              )}
            >
              total {(totalBps / 100).toFixed(1)}% {weightsValid ? "✓" : "→ needs 100%"}
            </span>
          )}
        </div>

        <div className="mt-5 border-t border-border/60 pt-4">
          <div className="mb-2 text-xs text-muted-foreground">Quick add</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.filter(([h]) => !alreadyAdded(h)).map(([handle, displayName]) => (
              <button
                key={handle}
                type="button"
                onClick={() => addRow(handle, displayName)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Avatar handle={handle} name={displayName} className="size-4 text-[7px]" />
                @{handle}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-1 font-display text-lg font-semibold">3 · Payout preview</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          If your token earns {fmtUsd(PREVIEW_FEES)} in creator fees, here&apos;s who gets what:
        </p>
        {preview.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Add at least 2 people{mode === "custom" ? " and make weights total 100%" : ""} to
            see the split.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {preview.map((p) => {
              const pct = p.member.weightBps / 100;
              return (
                <div key={p.member.handle} className="flex items-center gap-3">
                  <Avatar handle={p.member.handle} name={p.member.name} className="size-7 text-[9px]" />
                  <div className="w-40 min-w-0">
                    <div className="truncate text-sm">{p.member.name}</div>
                    <div className="truncate text-xs text-muted-foreground">@{p.member.handle}</div>
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-xs text-muted-foreground">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="w-20 text-right font-mono text-sm font-semibold text-pos">
                    {fmtUsd(p.amountUsd)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Ready?</span> You&apos;ll get a basket
          address to point your token&apos;s fees at.
        </div>
        <Button size="lg" onClick={launch}>
          Launch basket
        </Button>
      </div>
    </div>
  );
}
