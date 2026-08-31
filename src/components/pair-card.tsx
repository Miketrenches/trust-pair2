import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import type { CoinPair } from "@/lib/markets";
import { cn } from "@/lib/utils";

export function PairCard({ pair }: { pair: CoinPair }) {
  const up = pair.change24h >= 0;

  return (
    <article
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
        pair.flagship
          ? "border-primary/40 ring-2 ring-primary/20"
          : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent text-2xl">
            {pair.emoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold leading-tight">
                ${pair.symbol}
              </h3>
              {pair.flagship && (
                <Badge className="bg-primary/15 text-primary">Flagship</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{pair.coinName}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 bg-muted/50 text-[11px]">
          {pair.market.category}
        </Badge>
      </div>

      <div className="rounded-xl bg-muted/60 px-3.5 py-3">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Paired against
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">
          {pair.market.question}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-pink-400"
              style={{ width: `${pair.market.yesPct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-primary">
            YES {pair.market.yesPct}%
          </span>
        </div>
      </div>

      <Sparkline data={pair.spark} positive={up} />

      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-lg font-bold leading-none">
            {pair.priceInYes} <span className="text-xs font-medium text-muted-foreground">YES</span>
          </p>
          <p
            className={cn(
              "mt-1 font-mono text-xs font-semibold",
              up ? "text-yes" : "text-no"
            )}
          >
            {up ? "+" : ""}
            {pair.change24h.toFixed(1)}% · 24h
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>
            MC <span className="font-mono font-semibold text-foreground">{pair.marketCap}</span>
          </p>
          <p className="mt-1">
            Vol <span className="font-mono font-semibold text-foreground">{pair.vol24h}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
