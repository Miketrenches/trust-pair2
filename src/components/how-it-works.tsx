import { Coins, LineChart, Scale } from "lucide-react";

const steps = [
  {
    icon: Coins,
    title: "Launch against a market",
    body: "Mint a fixed-supply coin and pick any live prediction market as its quote asset. A one-sided liquidity pool opens against that market's YES share — no seed capital, no presale.",
  },
  {
    icon: Scale,
    title: "Odds are the denominator",
    body: "Your coin isn't priced in SOL — it's priced in conviction. If the YES odds rally and your coin stays flat, holders are down. Every trade is a bet relative to the market.",
  },
  {
    icon: LineChart,
    title: "Fees flow, $TRUST burns",
    body: "Every pool charges 1% per trade: half to the coin's creator, half to the platform. Platform revenue buys $TRUST on the open market and burns it. Supply only goes down.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          How it works
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Memecoins, denominated in belief
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <span className="font-display absolute top-5 right-6 text-4xl font-bold text-primary/10">
              0{i + 1}
            </span>
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="size-5" />
            </span>
            <h3 className="font-display text-xl font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
