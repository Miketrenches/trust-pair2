"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/toast";
import {
  type ChainMemo,
  MEMO_BYTE_LIMIT,
  type WalletProvider,
  fetchFeed,
  getWalletProvider,
  sendMemo,
  short,
  timeAgo,
} from "@/lib/solana";

const MEMO_CA = "MEMob64KfyPHcmLo3sQeWqR9uT2vXaZ1jN8dCkE5pump";

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

/* ---------- memo text rendering: URLs become embeds ---------- */

const URL_RE = /https?:\/\/[^\s]+/g;
const IMG_EXT = /\.(png|jpe?g|gif|webp|avif)(\?|#|$)/i;
const SND_EXT = /\.(mp3|wav|ogg|m4a)(\?|#|$)/i;

function MemoBody({ text }: { text: string }) {
  const urls = text.match(URL_RE) ?? [];
  const plain = text.replace(URL_RE, "").trim();
  return (
    <>
      {plain && <p className="mt-1 break-words">{plain}</p>}
      {urls.map((u, i) =>
        IMG_EXT.test(u) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={u}
            alt="memo attachment"
            className="mt-2 max-h-28 border border-border object-contain"
          />
        ) : SND_EXT.test(u) ? (
          <audio key={i} src={u} controls className="mt-2 h-8 w-full max-w-xs" />
        ) : (
          <a
            key={i}
            href={u}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-xs underline underline-offset-4 hover:text-accent"
          >
            &#8599; {u}
          </a>
        )
      )}
    </>
  );
}

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

type Attach = { kind: "IMG" | "SND" | "LNK"; url: string };

export function MemoApp() {
  const [provider, setProvider] = useState<WalletProvider | null>(null);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [msg, setMsg] = useState("");
  const [to, setTo] = useState("");
  const [attachments, setAttachments] = useState<Attach[]>([]);
  const [askAttach, setAskAttach] = useState<"IMG" | "SND" | "LNK" | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [feed, setFeed] = useState<ChainMemo[] | null>(null);
  const [clock, setClock] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);

  useEffect(() => {
    setProvider(getWalletProvider());
    const tick = () => setClock(new Date().toISOString().slice(11, 19) + " UTC");
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const refreshFeed = useCallback(async () => {
    try {
      setFeed(await fetchFeed(20));
    } catch {
      setFeed((f) => f ?? []);
      toast("ERR: RPC FEED FETCH FAILED");
    }
  }, []);

  useEffect(() => {
    refreshFeed();
    const t = setInterval(refreshFeed, 30000);
    return () => clearInterval(t);
  }, [refreshFeed]);

  const fullMemo = [msg.trim(), ...attachments.map((a) => a.url)]
    .filter(Boolean)
    .join("\n");
  const bytes = new TextEncoder().encode(fullMemo).length;

  const connect = async () => {
    beep(660, 0.08);
    const p = getWalletProvider();
    if (!p) {
      toast("NO WALLET FOUND \u00b7 INSTALL PHANTOM");
      window.open("https://phantom.app", "_blank");
      return;
    }
    setProvider(p);
    if (pubkey) {
      await p.disconnect().catch(() => {});
      setPubkey(null);
      toast("WALLET DISCONNECTED");
      return;
    }
    try {
      setConnecting(true);
      await p.connect();
      const k = p.publicKey?.toString() ?? null;
      setPubkey(k);
      if (k) toast(`CONNECTED: ${short(k)}`);
    } catch {
      toast("ERR: CONNECTION REJECTED");
    } finally {
      setConnecting(false);
    }
  };

  const inscribe = async () => {
    beep(784, 0.1);
    if (busy) return;
    if (!fullMemo) {
      toast("ERR: EMPTY MEMO");
      beep(180, 0.25);
      return;
    }
    if (bytes > MEMO_BYTE_LIMIT) {
      toast(`ERR: MEMO TOO BIG (${bytes}/${MEMO_BYTE_LIMIT} BYTES)`);
      beep(180, 0.25);
      return;
    }
    if (!provider || !pubkey) {
      toast("ERR: CONNECT WALLET FIRST");
      beep(180, 0.25);
      return;
    }
    setBusy(true);
    try {
      const sig = await sendMemo(provider, pubkey, fullMemo, to.trim() || undefined);
      playJingle();
      toast(`MEMO INSCRIBED \u00b7 TX ${short(sig)}`);
      setMsg("");
      setTo("");
      setAttachments([]);
      refreshFeed();
    } catch (e) {
      const m = e instanceof Error ? e.message : "unknown";
      toast(`ERR: ${m.slice(0, 80).toUpperCase()}`);
      beep(180, 0.3);
    } finally {
      setBusy(false);
    }
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

  const addAttachment = () => {
    if (draft && askAttach) {
      setAttachments((a) => [...a, { kind: askAttach, url: draft }]);
      beep(880, 0.08);
    }
    setDraft("");
    setAskAttach(null);
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
            <p>SOLANA MEMO TERMINAL v1.0 &#183; MAINNET</p>
            <p>PICTURES / SOUNDS / LINKS &#8594; TX MEMOS</p>
          </div>
        </div>
        <button
          onClick={connect}
          className="border border-border bg-background px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground"
        >
          {connecting
            ? "[ LINKING\u2026 ]"
            : pubkey
              ? `[ ${short(pubkey)} ]`
              : "[ CONNECT ]"}
        </button>
      </header>

      {/* ---- middle: composer | feed ---- */}
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1fr_1.15fr]">
        {/* composer */}
        <Panel
          label="COMPOSER"
          right={
            <span className={bytes > MEMO_BYTE_LIMIT ? "text-accent" : "text-muted-foreground"}>
              {bytes}/{MEMO_BYTE_LIMIT} BYTES
            </span>
          }
        >
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">TO:</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient address (optional)"
                className="w-full border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </label>

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={"> type your memo\u2026 it lives on-chain forever"}
              className="min-h-0 w-full flex-1 resize-none border border-border bg-background p-2 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
            />

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {attachments.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setAttachments((x) => x.filter((_, j) => j !== i))}
                    className="max-w-full truncate border border-border bg-muted px-2 py-1 hover:border-primary"
                    title="remove"
                  >
                    {a.kind === "IMG" ? "\u25a3" : a.kind === "SND" ? "\u266a" : "\u2197"}{" "}
                    {a.url} [x]
                  </button>
                ))}
              </div>
            )}

            {askAttach && (
              <div className="flex gap-2 text-sm">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    askAttach === "IMG"
                      ? "https://\u2026 .png / .jpg / .gif"
                      : askAttach === "SND"
                        ? "https://\u2026 .mp3 / .wav / .ogg"
                        : "https://"
                  }
                  className="w-full border border-border bg-background px-2 py-1 placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && addAttachment()}
                />
                <button
                  onClick={addAttachment}
                  className="border border-border px-2 hover:bg-primary hover:text-primary-foreground"
                >
                  OK
                </button>
              </div>
            )}

            <div className="grid shrink-0 grid-cols-3 gap-2 text-sm">
              <button onClick={() => { beep(440, 0.06); setAskAttach("IMG"); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+IMG URL]
              </button>
              <button onClick={() => { beep(494, 0.06); setAskAttach("SND"); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+SND URL]
              </button>
              <button onClick={() => { beep(523, 0.06); setAskAttach("LNK"); }} className="border border-border py-1.5 hover:bg-primary hover:text-primary-foreground">
                [+LNK]
              </button>
            </div>

            <button
              onClick={inscribe}
              disabled={busy}
              className="shrink-0 border border-primary bg-primary py-2 text-base font-bold text-primary-foreground hover:bg-foreground disabled:opacity-60"
            >
              {busy ? "\u2591\u2592\u2593 INSCRIBING ON-CHAIN \u2593\u2592\u2591" : "[ INSCRIBE MEMO ]"}
            </button>
            <p className="shrink-0 text-center text-[10px] text-muted-foreground">
              REAL SOLANA MAINNET TX &#183; COSTS ~0.000005 SOL &#183; PERMANENT
            </p>
          </div>
        </Panel>

        {/* feed */}
        <Panel
          label="MEMO FEED"
          right={
            <button onClick={() => { beep(587, 0.06); refreshFeed(); }} className="flex items-center gap-1.5 hover:text-foreground">
              <span className="size-1.5 bg-primary" />
              LIVE [&#8635;]
            </button>
          }
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {feed === null ? (
              <p className="p-4 text-sm text-muted-foreground">
                SCANNING CHAIN<span className="animate-cursor">&#9608;</span>
              </p>
            ) : feed.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                NO MEMOS INSCRIBED YET. CONNECT A WALLET AND BE THE FIRST.
              </p>
            ) : (
              feed.map((m) => (
                <article key={m.sig} className="border-b border-border/60 px-3 py-2.5 text-sm">
                  <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span className="text-foreground">&gt; {short(m.from)}</span>
                    <span>&#183; {timeAgo(m.blockTime)} ago</span>
                    <a
                      href={`https://solscan.io/tx/${m.sig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto hover:text-foreground"
                    >
                      TX:{short(m.sig)} [SOLSCAN]
                    </a>
                  </p>
                  <MemoBody text={m.text} />
                </article>
              ))
            )}
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
          MEMO LAYER: MAINNET
        </span>
        <span className="shrink-0 text-muted-foreground">{clock ?? "--:--:-- UTC"}</span>
        <span className="animate-cursor -ml-1">&#9608;</span>
      </footer>
    </main>
  );
}
