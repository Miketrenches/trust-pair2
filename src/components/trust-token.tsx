import Image from "next/image";
import { Flame, Lock, PieChart } from "lucide-react";

const stats = [
  { label: "Total supply", value: "1,000,000,000", note: "fixed forever" },
  { label: "Mint authority", value: "null", note: "nobody can print more" },
  { label: "Freeze authority", value: "null", note: "nobody can freeze you" },
  { label: "Buyback & burn", value: "60%", note: "of platform revenue" },
];

const pillars = [
  {
    icon: Flame,
    title: "Deflationary by design",
    body: "60% of platform trading revenue market-buys $TRUST and burns it. Supply can only go down.",
  },
  {
    icon: Lock,
    title: "No admin keys",
    body: "Mint and freeze authorities are revoked at genesis. What ships is what exists.",
  },
  {
    icon: PieChart,
    title: "Paired with the Fed",
    body: "$TRUST itself trades against \u201cFed cuts rates in September?\u201d — the flagship pair, eating its own cooking.",
  },
];

export function TrustToken() {
  return (
    <section id="token" className="scroll-mt-20 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              $TRUST
            </h2>
            <p className="mt-1 font-display text-xl text-foreground/60">
              trust me bro.
            </p>
            <p className="mt-4 max-w-md text-foreground/70">
              The house token of Trust Markets. Every coin launched on the
              platform pays fees, and those fees burn $TRUST. It is the only
              tokenomics document that fits in three words.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-2xl px-4 py-3.5"
                >
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {s.label}
                  </p>
                  <p className="font-mono text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <Image
                src="/trust-art.png"
                alt="$TRUST artwork"
                width={72}
                height={72}
                className="size-18 rounded-2xl object-cover ring-2 ring-border"
              />
              <div>
                <p className="font-display text-lg font-bold">TRUST / FED-SEPT-YES</p>
                <p className="text-sm text-muted-foreground">
                  Flagship pool · 1% fee · burns on every trade
                </p>
              </div>
            </div>
            {pillars.map((p) => (
              <div key={p.title} className="glass flex gap-4 rounded-2xl p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <p.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display font-bold">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-foreground/70">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
