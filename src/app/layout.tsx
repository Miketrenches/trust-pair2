import type { Metadata } from "next";
import { Baloo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Trust Markets · Pair any memecoin with a live prediction market",
  description:
    "$TRUST — trust me bro. Launch fixed-supply memecoins quoted against the YES share of live prediction markets. Price your coin in conviction, not collateral.",
  openGraph: {
    title: "Trust Markets",
    description:
      "Pair any memecoin with a live prediction market. $TRUST — trust me bro.",
    images: ["/trust-hero.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
