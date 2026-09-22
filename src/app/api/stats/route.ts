import { NextResponse } from "next/server";

// Live TROLLS collection stats from OpenSea, cached for 60s so visitors
// share one upstream call per minute (key allows 600 reads/hour).
export async function GET() {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OPENSEA_API_KEY not set" }, { status: 503 });
  }

  const res = await fetch(
    "https://api.opensea.io/api/v2/collections/trollsoneth/stats",
    {
      headers: { "x-api-key": key },
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    return NextResponse.json({ error: `OpenSea ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  const day = Array.isArray(data.intervals)
    ? data.intervals.find((i: { interval: string }) => i.interval === "one_day")
    : null;

  // ETH → USD via Coinbase's free public spot price
  let ethUsd: number | null = null;
  try {
    const px = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot", {
      next: { revalidate: 60 },
    });
    if (px.ok) {
      const j = await px.json();
      ethUsd = parseFloat(j.data?.amount) || null;
    }
  } catch {
    // leave ethUsd null — the UI falls back to showing ETH
  }

  const floor = data.total?.floor_price ?? null;
  return NextResponse.json({
    floor,
    floorUsd: floor != null && ethUsd != null ? floor * ethUsd : null,
    owners: data.total?.num_owners ?? null,
    sales24h: day?.sales ?? null,
    volume24h: day?.volume ?? null,
  });
}
