import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SocialNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            SOCIAL
          </span>
          <span className="mt-0.5 hidden rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            built on Paid
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden text-muted-foreground sm:inline-flex">
            <Link href="/#baskets">Baskets</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden text-muted-foreground sm:inline-flex">
            <Link href="/#how">How it works</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/create">Create a basket</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SocialFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary font-display text-[11px] font-bold text-primary-foreground">
            S
          </span>
          <span>SOCIAL — the basket layer on top of Paid</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Fees detected on Solana · paid out via X Money</span>
        </div>
      </div>
    </footer>
  );
}
