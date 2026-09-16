import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocialNav, SocialFooter } from "@/components/social/nav";
import { FanoutVisual } from "@/components/social/fanout-visual";
import { LiveFeed } from "@/components/social/live-feed";
import { BasketsGrid } from "@/components/social/baskets-grid";
import { Pipeline } from "@/components/social/pipeline";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <SocialNav />

      {/* Hero */}
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-pos" />
              Built on top of Paid — one recipient becomes many
            </div>
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              Route token fees to a{" "}
              <span className="text-primary">basket of people</span>, not just one.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Paid pays a token&apos;s creator fees to a single X handle. SOCIAL turns that
              handle into a whole basket — launch a KOL coin that pays every KOL, an
              ecosystem coin that pays every core dev — split by weight, paid out in
              dollars through X Money.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/create">Create a basket</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#baskets">Browse baskets</Link>
              </Button>
            </div>
          </div>
          <FanoutVisual />
        </div>
      </section>

      {/* Live feed */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <LiveFeed />
        </div>
      </section>

      {/* Baskets */}
      <section id="baskets" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Baskets</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One token address on the fee side. A whole roster on the payout side.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/create">+ New basket</Link>
          </Button>
        </div>
        <BasketsGrid />
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Same pipeline Paid runs today — SOCIAL adds the split at the last step.
          </p>
        </div>
        <Pipeline />
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Why baskets?</span> A single-recipient
            fee is a tip. A basket is an economy — communities can launch tokens that fund an
            entire scene at once, and every member sees their own receipts land on X.
          </p>
          <Button className="mt-5" asChild>
            <Link href="/create">Build yours</Link>
          </Button>
        </div>
      </section>

      <SocialFooter />
    </div>
  );
}
