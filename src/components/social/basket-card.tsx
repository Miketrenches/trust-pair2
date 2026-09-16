import Link from "next/link";
import { Basket, basketLifetime, fmtUsdCompact, shortAddress } from "@/lib/social";
import { AvatarStack } from "@/components/social/avatar";
import { Badge } from "@/components/ui/badge";

export function BasketCard({ basket }: { basket: Basket }) {
  const life = basketLifetime(basket.id);
  return (
    <Link
      href={`/b/${basket.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(79,124,255,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold">{basket.name}</div>
          <div className="font-mono text-xs text-muted-foreground">
            ${basket.ticker} · {shortAddress(basket.tokenAddress)}
          </div>
        </div>
        {basket.preset ? (
          <Badge variant="outline" className="shrink-0">basket</Badge>
        ) : (
          <Badge className="shrink-0 bg-pos/15 text-pos">yours</Badge>
        )}
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{basket.tagline}</p>
      <div className="mt-auto flex items-center justify-between">
        <AvatarStack members={basket.members} max={5} />
        <div className="text-right">
          <div className="font-mono text-sm font-semibold text-pos">
            {fmtUsdCompact(life.totalUsd)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            routed to {basket.members.length} people
          </div>
        </div>
      </div>
    </Link>
  );
}
