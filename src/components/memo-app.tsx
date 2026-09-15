"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/toast";

const MEMO_CA = "MEMob64KfyPHcmLo3sQeWqR9uT2vXaZ1jN8dCkE5pump";

/* ---------- fake helpers ---------- */

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function fakeSig() {
  const c = () => B58[Math.floor(Math.random() * B58.length)];
  return `${c()}${c()}${c()}${c()}\u2026${c()}${c()}${c()}${c()}`;
}

/* ---------- calculator beeps ---------- */

let audio: AudioContext | null = null;
function beep(freq: number, dur = 0.12) {
  audio ??= new AudioContext();
  const o = audio.createOscillator();
  const g = audio.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.06, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
  o.connect(g);
  g.connect(audio.destination);
  o.start();
  o.stop(audio.currentTime + dur);
}
function playJingle() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15), i * 150));
}

const PADS = [
  { label: "SND-1", freq: 262 },
  { label: "SND-2", freq: 330 },
  { label: "SND-3", freq: 392 },
  { label: "SND-4", freq: 523 },
  { label: "SND-5", freq: 659 },
  { label: "SND-6", freq: 784 },
  { label: "SND-7", freq: 880 },
  { label: "SND-8", freq: 1047 },
];

/* ---------- feed ---------- */

type FeedItem = {
  id: number;
  from: string;
  sig: string;
  age: string;
  text: string;
  img?: string;
  snd?: boolean;
  lnk?: string;
};

const SEED_FEED: FeedItem[] = [
  {
    id: 4,
    from: "7xKp\u20269fQ2",
    sig: "3gVa\u2026Jw8d",
    age: "2m",
    text: "gm. inscribing this so nobody can delete it.",
  },
  {
    id: 3,
    from: "Fj2w\u2026k3Lm",
    sig: "9tRe\u2026Bq1x",
    age: "11m",
    text: "state of the market rn",
    img: "/coins/copium.png",
  },
  {
    id: 2,
    from: "9aQz\u2026mm21",
    sig: "5Kd3\u20269fQz",
    age: "34m",
    text: "leaked CT spaces audio (3s)",
    snd: true,
  },
  {
    id: 1,
    from: "B33f\u2026c0de",
    sig: "8Hnn\u2026Vv2p",
    age: "1h",
    text: "whitepaper is a link now",
    lnk: "memo.fun/wp",
  },
];

/* ---------- panel chrome ---------- */

function Panel({
  label,
  right,
  children,
  className = "",
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative flex min-h-0 flex-col border border-border ${className}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted px-3 py-1.5 text-xs tracking-widest">
        <span>&#9484;&#9472; {label}</span>
        {right}
      </div>
      {children}
    </section>
  );
}

/* ---------- main ---------- */

export function MemoApp() {
  const [wallet, setWallet] = useState<"idle" | "connecting" | "connected">("idle");
  const [msg, setMsg] = useState("");
  const [to, setTo] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [snd, setSnd] = useState<string | null>(null);
  const [lnk, setLnk] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const [askLink, setAskLink] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>(SEED_FEED);
  const [clock, setClock] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const sndRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toISOString().slice(11, 19) + " UTC");
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const bytes =
    new TextEncoder().encode(msg).length +
    (img ? 4212 : 0) +
    (snd ? 9840 : 0) +
    (lnk ? lnk.length : 0);

  const connect = () => {
    beep(660, 0.08);
    if (wallet === "connecting") return;
    if (wallet === "connected") {
      setWallet("idle");
      toast("WALLET DISCONNECTED");
      return;
    }
    setWallet("connecting");
    setTimeout(() => {
      setWallet("connected");
      toast("CONNECTED AS 7xKp\u20269fQ2 [DEMO]");
    }, 900);
  };

  const inscribe = () => {
    beep(784, 0.1);
    if (busy) return;
    if (!msg && !img && !snd && !lnk) {
      toast("ERR: EMPTY MEMO");
      beep(180, 0.25);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const sig = fakeSig();
      setFeed((f) => [
        {
          id: Date.now(),
          from: wallet === "connected" ? "7xKp\u20269fQ2" : "ANON",
          sig,
          age: "now",
          text: msg || "(no text)",
          img: img ?? undefined,
          snd: !!snd,
          lnk: lnk ?? undefined,
        },
        ...f,
      ]);
      setMsg("");
      setImg(null);
      setSnd(null);
      setLnk(null);
      setBusy(false);
      playJingle();
      toast(`MEMO INSCRIBED \u00b7 TX ${sig} [DEMO]`);
    }, 1200);
  };

  const copyCa = async () => {
    beep(523, 0.08);
    try {
      await navigator.clipboard.writeText(MEMO_CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast("CA COPIED");
    } catch {
      /* clipboard unavailable */
    }
  };

  const hitPad = (i: number, freq: number) => {
    beep(freq);
    setFlash(i);
    setTimeout(() => setFlash(null), 200);
  };

  return (
    <main className="relative z-10 mx-auto flex h-dvh max-w-6xl flex-col gap-3 p-3 sm:p-4">
      {/* ---- top bar ---- */}
      <header className="flex shrink-0 items-center justify-between gap-4 border border-border bg-muted/60 px-4 py-2">
        <div className="flex items-center gap-4">
          <Image
            src="/memo.png"
            alt="MEMO"
            width={220}
            height={220}
            priority
            className="h-9 w-auto object-cover object-center"
            style={{ objectFit: "cover", aspectRatio: "5 / 2" }}
          />
          <div className="hidden text-xs leading-tight text-muted-foreground sm:block">
            <p>SOLANA MEMO TERMINAL v1.0</p>
            <p>PICTURES / SOUNDS / LINKS &#8594; TX MEMOS</p>
          </div>
        </div>
        <button
          onClick={connect}
          className="border border-border bg-background px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground hover:text-shadow-none"
        >
          {wallet === "connecting"
            ? "[ LINKING\u2026 ]"
            : wallet === "connected"
              ? "[ 7xKp\u20269fQ2 ]"
              : "[ CONNECT ]"}
        </button>
      </header>

      {/* ---- middle: composer | feed ---- */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_1.15fr]">
        {/* composer */}
        <Panel
          label="COMPOSER"
          right={<span className="text-muted-foreground">{bytes} BYTES</span>}
        >
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">TO:</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="address / tx signature (optional)"
                className="w-full border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </label>

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={"> type your memo\u2026 it lives on-chain forever"}
              className="min-h-0 w-full flex-1 resize-none border border-border bg-background p-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />

            {/* attachment chips */}
            {(img || snd || lnk) && (
              <div className="flex flex-wrap gap-2 text-xs">
                {img && (
                  <button onClick={() => setImg(null)} className="flex items-center gap-2 border border-border bg-muted px-2 py-1 hover:border-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="attachment" className="size-6 object-cover" />
                    IMG ATTACHED [x]
                  </button>
                )}
                {snd && (
                  <button onClick={() => setSnd(null)} className="border border-border bg-muted px-2 py-1 hover:border-primary">
                    &#9834; {snd} [x]
                  </button>
                )}
                {lnk && (
                  <button onClick={() => setLnk(null)} className="border border-border bg-muted px-2 py-1 hover:border-primary">
                    &#8599; {lnk} [x]
                  </button>
                )}
              </div>
            )}

            {askLink && (
              <div className="flex gap-2 text-sm">
                <input
                  autoFocus
                  value={linkDraft}
                  onChange={(e) => setLinkDraft(e.target.value)}
                  placeholder="https://"
                  className="w-full border border-border bg-background px-2 py-1 placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && linkDraft) {
                      setLnk(linkDraft);
                      setLinkDraft("");
                      setAskLink(false);
                      beep(880, 0.08);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (linkDraft) setLnk(linkDraft);
                    setLinkDraft("");
                    setAskLink(false);
                  }}
                  className="border border-border px-2 hover:bg-primary hover:text-primary-foreground"
                >
                  OK
                </button>
              </div>
            )}

            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setImg(URL.createObjectURL(f));
                  beep(880, 0.08);
                }
              }}
            />
            <input
              ref={sndRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setSnd(f.name);
                  beep(880, 0.08);
                }
              }}
            />

            <div className="grid shrink-0 grid-cols-3 gap-2 text-sm">
              <button onClick={() => { beep(440, 0.06); imgRef.current?.click(); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+IMG]
              </button>
              <button onClick={() => { beep(494, 0.06); sndRef.current?.click(); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+SND]
              </button>
              <button onClick={() => { beep(523, 0.06); setAskLink(true); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+LNK]
              </button>
            </div>

            <button
              onClick={inscribe}
              disabled={busy}
              className="shrink-0 border border-primary bg-primary py-2 text-base font-bold text-primary-foreground text-shadow-none hover:bg-foreground disabled:opacity-60"
            >
              {busy ? "\u2591\u2592\u2593 INSCRIBING \u2593\u2592\u2591" : "[ INSCRIBE MEMO ]"}
            </button>
            <p className="shrink-0 text-center text-[10px] text-muted-foreground">
              DEMO TERMINAL &#183; NOTHING IS SENT &#183; TRUST THE MEMO
            </p>
          </div>
        </Panel>

        {/* feed */}
        <Panel
          label="MEMO FEED"
          right={
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 bg-primary" />
              LIVE
            </span>
          }
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {feed.map((m) => (
              <article key={m.id} className="border-b border-border/60 px-3 py-2.5 text-sm">
                <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="text-foreground">&gt; {m.from}</span>
                  <span>&#183; {m.age === "now" ? "just now" : `${m.age} ago`}</span>
                  <button
                    onClick={() => { beep(587, 0.06); toast(`TX ${m.sig} \u00b7 SOLSCAN OPENS ON MAINNET [DEMO]`); }}
                    className="ml-auto hover:text-foreground"
                  >
                    TX:{m.sig} [SOLSCAN]
                  </button>
                </p>
                <p className="mt-1">{m.text}</p>
                {m.img && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={m.img} alt="memo attachment" className="mt-2 size-20 border border-border object-cover" />
                )}
                {m.snd && (
                  <button
                    onClick={() => { playJingle(); toast("PLAYING ON-CHAIN AUDIO [DEMO]"); }}
                    className="mt-2 border border-border px-2 py-1 text-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    &#9654; PLAY 0:03 &#9834;
                  </button>
                )}
                {m.lnk && (
                  <button
                    onClick={() => { beep(587, 0.06); toast(`LINK EMBEDDED IN MEMO: ${m.lnk} [DEMO]`); }}
                    className="mt-2 block text-xs underline underline-offset-4 hover:text-accent"
                  >
                    &#8599; {m.lnk}
                  </button>
                )}
              </article>
            ))}
          </div>
        </Panel>
      </div>

      {/* ---- soundpad ---- */}
      <Panel label="SOUNDPAD" className="shrink-0">
        <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-8">
          {PADS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => hitPad(i, p.freq)}
              className={`border border-border bg-muted px-1 py-2.5 text-xs hover:border-primary ${flash === i ? "pad-flash" : ""}`}
            >
              <span className="block text-base leading-none">&#9834;</span>
              {p.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* ---- status bar ---- */}
      <footer className="flex shrink-0 items-center gap-3 overflow-hidden border border-border bg-muted/60 px-3 py-1.5 text-xs">
        <button onClick={copyCa} className="flex min-w-0 items-center gap-2 hover:text-accent" title="copy CA">
          <span className="shrink-0 text-accent">$MEMO</span>
          <span className="truncate">{MEMO_CA}</span>
          <span className="shrink-0">{copied ? "[OK]" : "[COPY]"}</span>
        </button>
        <span className="ml-auto hidden shrink-0 text-muted-foreground sm:inline">
          MEMO LAYER: ONLINE
        </span>
        <span className="shrink-0 text-muted-foreground">{clock ?? "--:--:-- UTC"}</span>
        <span className="animate-cursor -ml-1">&#9608;</span>
      </footer>
    </main>
  );
}
