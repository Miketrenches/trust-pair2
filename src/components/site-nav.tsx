"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import { Loader2, Wallet } from "lucide-react";

const links = [
  { href: "#markets", label: "Markets" },
  { href: "#launch", label: "Launch" },
  { href: "#how", label: "How it works" },
  { href: "#token", label: "$TRUST" },
  { href: "#api", label: "API" },
];

const DEMO_ADDRESS = "7xKp…9fQ2";

export function SiteNav() {
  const [wallet, setWallet] = useState<"idle" | "connecting" | "connected">(
    "idle"
  );

  const handleConnect = () => {
    if (wallet === "connecting") return;
    if (wallet === "connected") {
      setWallet("idle");
      toast("Wallet disconnected");
      return;
    }
    setWallet("connecting");
    setTimeout(() => {
      setWallet("connected");
      toast(`Connected as ${DEMO_ADDRESS} (demo)`);
    }, 900);
  };

  return (
    <header className="relative z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="#" className="flex items-center">
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
            className="hidden rounded-lg border-primary/40 bg-transparent text-primary hover:bg-primary/10 sm:inline-flex"
            asChild
          >
            <Link href="#token">Buy $TRUST</Link>
          </Button>
          <Button
            size="sm"
            onClick={handleConnect}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {wallet === "connecting" ? (
              <>
                <Loader2 className="animate-spin" />
                Connecting…
              </>
            ) : wallet === "connected" ? (
              <>
                <Wallet />
                <span className="font-mono">{DEMO_ADDRESS}</span>
              </>
            ) : (
              <>
                <Wallet />
                Connect
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
