"use client";

import { useEffect, useState } from "react";

// Release moment, taken from the timer on trollface.io
const TARGET = Date.parse("2026-09-23T00:37:00Z");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Countdown() {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMsLeft(Math.max(0, TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  let digits = "--:--:--";
  let live = false;
  if (msLeft !== null) {
    if (msLeft <= 0) {
      live = true;
    } else {
      const s = Math.floor(msLeft / 1000);
      digits = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }
  }

  return (
    <div className="rs-well px-4 py-3 text-center">
      {live ? (
        <p className="text-4xl sm:text-5xl" style={{ color: "var(--pos)" }}>
          TROLLS ARE LIVE
        </p>
      ) : (
        <>
          <p className="text-sm tracking-[0.25em] text-muted-foreground">
            TROLL NFTS RELEASE IN
          </p>
          <p
            className="mt-1 text-5xl leading-none tabular-nums sm:text-6xl"
            style={{ color: "var(--rs-yellow)", textShadow: "0 0 12px rgba(178,138,56,0.45)" }}
          >
            {digits}
          </p>
        </>
      )}
      <a
        href="https://www.trollface.io/"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-base text-primary underline underline-offset-4 hover:text-foreground"
      >
        trollface.io ↗
      </a>
    </div>
  );
}
