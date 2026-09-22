"use client";

import { useEffect, useState } from "react";

type Stats = {
  floor: number | null;
  floorUsd: number | null;
  owners: number | null;
  sales24h: number | null;
  volume24h: number | null;
};

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (alive && d && !d.error) setStats(d);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const floorValue =
    stats?.floorUsd != null
      ? `$${Math.round(stats.floorUsd)}`
      : stats?.floor != null
        ? `${stats.floor.toFixed(3)} Ξ`
        : "—";
  const floorLabel =
    stats?.floorUsd != null && stats?.floor != null
      ? `NFT floor · ${stats.floor.toFixed(3)} Ξ`
      : "NFT floor price";

  const wells: [string, string][] = [
    ["3,333", "troll NFTs exist"],
    [stats?.owners != null ? String(stats.owners) : "—", "owners"],
    [stats?.sales24h != null ? String(stats.sales24h) : "—", "sales (24h)"],
    [floorValue, floorLabel],
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {wells.map(([v, k]) => (
        <div key={k} className="rs-well px-3 py-2 text-center">
          <p className="text-2xl" style={{ color: "var(--rs-yellow)" }}>
            {v}
          </p>
          <p className="text-sm text-muted-foreground">{k}</p>
        </div>
      ))}
    </div>
  );
}
