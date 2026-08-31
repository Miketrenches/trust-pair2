import { MARKETS } from "@/lib/markets";
import { TrendingDown, TrendingUp } from "lucide-react";

function TickerRow() {
  return (
    <>
      {MARKETS.map((m) => {
        const up = m.delta24h >= 0;
        return (
          <span
            key={m.id}
            className="inline-flex shrink-0 items-center gap-2 px-6 text-sm"
          >
            <span className="font-medium text-foreground/80">{m.question}</span>
            <span className="font-mono font-semibold text-primary">
              YES {m.yesPct}%
            </span>
            <span
              className={`inline-flex items-center gap-0.5 font-mono text-xs ${
                up ? "text-yes" : "text-no"
              }`}
            >
              {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {up ? "+" : ""}
              {m.delta24h.toFixed(1)}
            </span>
          </span>
        );
      })}
    </>
  );
}

export function OddsTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/60 bg-white/50 py-2.5 backdrop-blur-sm">
      <div className="flex w-max animate-ticker whitespace-nowrap">
        <TickerRow />
        <TickerRow />
      </div>
    </div>
  );
}
