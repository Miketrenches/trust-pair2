import Image from "next/image";
import Link from "next/link";
import { TRUST_CONTRACT } from "@/lib/markets";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Image
                src="/trust-art.png"
                alt="Trust Markets logo"
                width={32}
                height={32}
                className="size-8 rounded-full object-cover ring-2 ring-white"
              />
              <span className="font-display text-lg font-bold">
                trust<span className="text-primary">markets</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Pair any memecoin with a live prediction market. Price your coin
              in conviction, not collateral.
            </p>
            <p className="mt-3 font-mono text-[11px] break-all text-muted-foreground/70">
              $TRUST · {TRUST_CONTRACT}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold">Platform</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><Link href="#markets" className="hover:text-foreground">Live pairs</Link></li>
                <li><Link href="#launch" className="hover:text-foreground">Launch a coin</Link></li>
                <li><Link href="#how" className="hover:text-foreground">How it works</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Token</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><Link href="#token" className="hover:text-foreground">$TRUST</Link></li>
                <li><Link href="#token" className="hover:text-foreground">Buyback &amp; burn</Link></li>
                <li><Link href="#api" className="hover:text-foreground">Developer API</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Community</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">X / Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">Telegram</a></li>
                <li><a href="#" className="hover:text-foreground">Docs</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Trust Markets is a meme. Nothing here is financial advice, an
            offer of securities, or a functioning exchange — odds shown are
            illustrative. Prediction markets and memecoins can and will go to
            zero. But it&apos;ll be fine. Trust me bro.
          </p>
          <p className="mt-2">© 2026 Trust Markets. All vibes reserved.</p>
        </div>
      </div>
    </footer>
  );
}
