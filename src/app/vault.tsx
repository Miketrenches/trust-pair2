"use client";

import { useState } from "react";

type Holding = {
  id: string;
  image: string | null;
  collection: string;
  symbol: string;
};

export function VaultHoldings() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Holding[] | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && items === null && !loading) {
      setLoading(true);
      fetch("/api/vault")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setItems(d && !d.error ? d.items : []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="mt-3">
      <button type="button" onClick={toggle} className="rs-btn w-full text-base">
        {open ? "▼ Hide vault holdings" : "▶ View vault holdings"}
      </button>

      {open && (
        <div className="rs-well mt-2 p-3">
          {loading && (
            <p className="py-4 text-center text-muted-foreground">
              checking the vault…
            </p>
          )}
          {!loading && items !== null && items.length === 0 && (
            <p className="py-4 text-center text-muted-foreground">
              The vault is empty. For now. u mad bro?
            </p>
          )}
          {!loading && items !== null && items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {items.map((h) => (
                <div
                  key={`${h.collection}-${h.id}`}
                  className="border-2 border-black/50 bg-black/30 p-2 text-center"
                >
                  {h.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={h.image}
                      alt={`${h.collection} #${h.id}`}
                      className="w-full"
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center text-3xl text-muted-foreground">
                      ?
                    </div>
                  )}
                  <p className="mt-1 truncate text-sm leading-tight">
                    {h.symbol || h.collection}{" "}
                    <span style={{ color: "var(--rs-yellow)" }}>#{h.id}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
