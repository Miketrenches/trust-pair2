import { Badge } from "@/components/ui/badge";
import { Braces } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/markets",
    desc: "Live prediction markets a coin can be paired against. Call this first — quoteMarket must be one of these.",
  },
  {
    method: "POST",
    path: "/api/v1/launches/prepare",
    desc: "Build the atomic launch bundle: payment, mint and YES-quoted pool land together, or none of them do.",
  },
  {
    method: "GET",
    path: "/api/v1/tokens/{mint}/fees",
    desc: "Creator fees waiting to be claimed — paid in both your coin and the market's YES share.",
  },
];

const snippet = `const markets = await api('/api/v1/markets?launchable=true');
const fed = markets.find(m => m.slug === 'fed-cuts-september');

const launch = await api('/api/v1/launches/prepare', {
  method: 'POST',
  body: JSON.stringify({
    creatorWallet: creator.publicKey.toBase58(),
    quoteMarket: fed.yesMint,   // pair against the YES share
    name: 'Trust Me Bro',
    symbol: 'TRUST',
    mode: 'standard',           // splits trading fees with you
    devBuyPercent: 1,           // optional: up to 2.5% of supply
  }),
});
// poll /launches/{paymentSignature} until 'completed'`;

export function ApiSection() {
  return (
    <section id="api" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Developers
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Three calls to launch against the odds
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            The public API mirrors the launchpads you already know — fetch the
            pairable markets, prepare an atomic launch, claim your fees. Docs
            and keys ship with mainnet.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {endpoints.map((e) => (
              <div
                key={e.path}
                className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
              >
                <Badge
                  className={
                    e.method === "GET"
                      ? "mt-0.5 bg-yes/10 font-mono text-yes"
                      : "mt-0.5 bg-primary/10 font-mono text-primary"
                  }
                >
                  {e.method}
                </Badge>
                <div>
                  <p className="font-mono text-sm font-semibold">{e.path}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#3d2f63] bg-[#2a2046] shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-white/70">
              <Braces className="size-4" />
              <span className="font-mono text-xs">launch.ts</span>
            </div>
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff8fa3]" />
              <span className="size-2.5 rounded-full bg-[#ffd166]" />
              <span className="size-2.5 rounded-full bg-[#95d5b2]" />
            </div>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-[#e8ddff]">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
