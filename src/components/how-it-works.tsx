const steps = [
  {
    title: "Launch against a market",
    body: "Mint a fixed-supply coin and pick any live prediction market as its quote asset. A one-sided liquidity pool opens against that market's YES share. No seed capital, no presale.",
  },
  {
    title: "Odds are the denominator",
    body: "Your coin isn't priced in SOL, it's priced in conviction. If the YES odds rally and your coin stays flat, holders are down. Every trade is a bet relative to the market.",
  },
  {
    title: "Fees flow, $TRUST burns",
    body: "Every pool charges 1% per trade: half to the coin's creator, half to the platform. Platform revenue buys $TRUST on the open market and burns it. Supply only goes down.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Memecoins, denominated in belief
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
          >
            <p className="font-mono text-sm text-muted-foreground">{i + 1}.</p>
            <h3 className="font-display text-xl font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
