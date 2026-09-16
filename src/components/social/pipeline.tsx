const STEPS = [
  {
    n: "01",
    title: "Launch a token, point it at a basket",
    body:
      "Launch on Pump and set the creator-fee recipient to your SOCIAL basket instead of a single X handle. One address, many people behind it.",
  },
  {
    n: "02",
    title: "Fees detected instantly",
    body:
      "Paid watches the Pump Fees Program with onProgramAccountChange filtered on the basket treasury. No polling — the moment fees accrue, the pipeline fires.",
  },
  {
    n: "03",
    title: "SOL off-ramped to dollars",
    body:
      "Accrued SOL is sent to the exchange, sold at market, and lands as USD — the same transparent off-ramp ledger Paid already runs, order IDs and all.",
  },
  {
    n: "04",
    title: "Split by weight, paid via X Money",
    body:
      "SOCIAL fans the dollars out across every member by their basket weight — 8 KOLs, 40 devs, a whole team — each getting their own X Money payout and receipt.",
  },
];

export function Pipeline() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s) => (
        <div key={s.n} className="relative rounded-xl border border-border bg-card p-5">
          <div className="font-mono text-xs font-semibold text-primary">{s.n}</div>
          <div className="mt-2 font-display text-base font-semibold">{s.title}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
