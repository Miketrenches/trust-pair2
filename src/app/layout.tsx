import type { Metadata } from "next";
import { Share_Tech_Mono, VT323 } from "next/font/google";
import { Toaster } from "@/components/toast";
import "./globals.css";

const term = Share_Tech_Mono({
  variable: "--font-term",
  subsets: ["latin"],
  weight: "400",
});

const seg = VT323({
  variable: "--font-seg",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MEMO · the memo layer of Solana",
  description:
    "Embed pictures, sounds and links into Solana transaction memos. $MEMO — everything is a memo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${term.variable} ${seg.variable} h-full antialiased`}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
