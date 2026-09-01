"use client";

import { useEffect, useState } from "react";

type ToastItem = { id: number; text: string };

let push: ((text: string) => void) | null = null;

export function toast(text: string) {
  push?.(text);
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    push = (text) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, text }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3200);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-medium text-foreground shadow-lg"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
