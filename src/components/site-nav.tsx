import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const links = [
  { href: "#markets", label: "Markets" },
  { href: "#launch", label: "Launch" },
  { href: "#how", label: "How it works" },
  { href: "#token", label: "$TRUST" },
  { href: "#api", label: "API" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2.5">
          <Image
            src="/trust-art.png"
            alt="Trust Markets logo"
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-2 ring-white/80"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            trust<span className="text-primary">markets</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-full border-primary/30 bg-white/70 text-primary hover:bg-primary/10 sm:inline-flex"
            asChild
          >
            <Link href="#token">Buy $TRUST</Link>
          </Button>
          <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Wallet />
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}
