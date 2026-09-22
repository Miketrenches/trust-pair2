import type { Metadata } from "next";
import Link from "next/link";
import { VT323 } from "next/font/google";
import { GrandExchange } from "./chart";
import { Countdown } from "./countdown";
import { MusicPlayer } from "./music";
import { LiveStats } from "./stats";
import { VaultHoldings } from "./vault";

const pixel = VT323({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Troll Strategy — the coin that buys trolls",
  description:
    "$TSTR trading fees sweep the TROLLS NFT floor on Ethereum and lock them in the treasury. Stack trolls, squeeze the shorts. u mad bro?",
};

// The actual TROLLS artwork (every token shares this one image), pulled from IPFS:
// ipfs://bafybeigzigkyqpex2its2avncb4ag32rzqagkh5pb733ondq5z3ben2xoy
const TROLL_IMG = "/troll.png";
const WIZARD_IMG = "/wizard.jpg";
const OPENSEA = "https://opensea.io/collection/trollsoneth";
const X_URL = "https://x.com/TrollStrat";
const CONTRACT = "0xfbA5880244850d89a91479A01bB8d1B678cD79fE";
const TREASURY = "0x2C09251B62a422DB36AD5E55D89486F4803b063e";
const TREASURY_ENS = "trollstrategy.eth";
const TREASURY_ETHERSCAN = `https://etherscan.io/address/${TREASURY}#nfttransfers`;

/* eslint-disable @next/next/no-img-element */
function Troll({ className }: { className?: string }) {
  return <img src={TROLL_IMG} alt="Troll NFT — u mad bro?" className={className} />;
}
function Wizard({ className }: { className?: string }) {
  return <img src={WIZARD_IMG} alt="The Troll Wizard" className={className} />;
}
/* eslint-enable @next/next/no-img-element */

/* ---------- Page ---------- */

export default function Home() {
  return (
    <div className={`troll-theme ${pixel.className} min-h-dvh text-lg leading-snug`}>
      <MusicPlayer />
      {/* Top bar */}
      <header className="border-b-2 border-black/60 bg-black/25">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Wizard className="size-10 mix-blend-lighten" />
            <span className="leading-none">
              <span className="block text-2xl text-primary">Troll Strategy</span>
              <span className="block text-sm text-muted-foreground">$TSTR · NFT Collection</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <a href={X_URL} target="_blank" rel="noreferrer" className="rs-btn text-base">
              𝕏 Follow
            </a>
            <a href={OPENSEA} target="_blank" rel="noreferrer" className="rs-btn text-base">
              TROLLS ↗
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
        {/* Part 1 — the pitch */}
        <section className="mt-8">
          <div className="rs-panel p-5 sm:p-7">
            <Countdown />
            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
              <Wizard className="w-48 shrink-0 mix-blend-lighten sm:w-56" />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl leading-none text-primary sm:text-4xl">
                  Buy the coin. Squeeze the trolls.
                </h1>
                <div className="rs-parchment mt-4 px-4 py-3 text-base">
                  <p>
                    Every <strong>$TSTR</strong> trade pays a trading fee. The fee
                    buys{" "}
                    <a href={OPENSEA} target="_blank" rel="noreferrer" className="underline">
                      TROLLS
                    </a>{" "}
                    NFTs off the floor — 3,333 identical trollfaces on Ethereum —
                    and locks them in the treasury. Supply gets thinner. Shorts get
                    squeezed. Floor go up. u mad bro?
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <span className="rs-btn cursor-not-allowed opacity-60">Buy $TSTR — soon</span>
                  <a href={OPENSEA} target="_blank" rel="noreferrer" className="rs-btn">
                    Browse the NFTs ↗
                  </a>
                </div>
              </div>
            </div>
            {/* live stats from OpenSea */}
            <LiveStats />

            {/* treasury */}
            <div className="rs-well mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5">
              <p className="flex items-baseline gap-3">
                <span className="text-sm tracking-[0.2em] text-muted-foreground">
                  TREASURY
                </span>
                <span className="text-xl" style={{ color: "var(--rs-yellow)" }}>
                  {TREASURY_ENS}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <span className="hidden font-mono text-sm text-muted-foreground md:inline">
                  {TREASURY}
                </span>
                <a
                  href={TREASURY_ETHERSCAN}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base text-primary underline underline-offset-4 hover:text-foreground"
                >
                  Etherscan ↗
                </a>
              </p>
            </div>

            {/* live vault holdings */}
            <VaultHoldings />
          </div>
        </section>

        {/* Part 2 — the exchange */}
        <section className="mt-8">
          <div className="rs-panel p-4 sm:p-6">
            <GrandExchange />

            {/* how it works, compressed */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                "1. You trade $TSTR — the trading fee fills the treasury.",
                "2. The treasury sweeps the cheapest TROLLS NFTs on the floor.",
                "3. Trolls get locked. Supply shrinks. Shorts get squeezed.",
              ].map((s) => (
                <p key={s} className="rs-well px-3 py-2 text-base">
                  {s}
                </p>
              ))}
            </div>

            {/* latest treasury buy */}
            <div className="rs-well mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 text-base">
              <Troll className="size-7" />
              <span>
                Latest: bought{" "}
                <span style={{ color: "var(--rs-yellow)" }}>Troll NFT #2976</span> @{" "}
                <span style={{ color: "var(--rs-yellow)" }}>0.104 Ξ</span>
              </span>
              <span className="text-muted-foreground">·</span>
              <span>locked in the treasury</span>
            </div>

            <p className="mt-4 text-center text-sm break-all text-muted-foreground">
              TROLLS NFT contract: {CONTRACT}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-muted-foreground">
          <p>Not affiliated with the TROLLS NFT collection, OpenSea, or MicroStrategy.</p>
          <p>Entertainment, not investment. u mad bro?</p>
        </footer>
      </main>
    </div>
  );
}
