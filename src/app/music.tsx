"use client";

import { useEffect, useRef, useState } from "react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  // start the song on the first interaction anywhere on the page
  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audioRef.current?.play().catch(() => {
        // browser refused (no real gesture) — keep waiting for the next one
        startedRef.current = false;
      });
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    startedRef.current = true;
    if (a.paused) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  return (
    <>
      <audio
        ref={(a) => {
          audioRef.current = a;
          if (a) a.volume = 0.1;
        }}
        src="/troll-song.mp3"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        className="rs-btn fixed right-4 bottom-4 z-50 text-base"
        aria-label={playing ? "Pause the troll song" : "Play the troll song"}
      >
        {playing ? "♪ troll song · ON" : "♪ troll song · OFF"}
      </button>
    </>
  );
}
