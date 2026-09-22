import { NextResponse } from "next/server";

const TREASURY = "0x2C09251B62a422DB36AD5E55D89486F4803b063e";
const TROLLS_CONTRACT = "0xfba5880244850d89a91479a01bb8d1b678cd79fe";

// dweb.link / ipfs.io are being shut down; rewrite IPFS links to a live gateway
function fixImage(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/ipfs\/(.+)$/);
  if (m) return `https://gateway.pinata.cloud/ipfs/${m[1]}`;
  return url;
}

// The treasury's ERC-721 holdings via Blockscout's free public API, cached 60s.
export async function GET() {
  const res = await fetch(
    `https://eth.blockscout.com/api/v2/addresses/${TREASURY}/nft?type=ERC-721`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    return NextResponse.json({ error: `Blockscout ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  type Item = {
    id: string;
    image_url: string | null;
    token: {
      address_hash?: string;
      address?: string;
      name: string | null;
      symbol: string | null;
    } | null;
  };

  const items = ((data.items ?? []) as Item[])
    // hide ENS name registrations — not part of the vault story
    .filter((i) => i.token?.symbol !== "ENS")
    .map((i) => {
      const contract = (i.token?.address_hash ?? i.token?.address ?? "").toLowerCase();
      const isTroll = contract === TROLLS_CONTRACT;
      return {
        id: i.id,
        // every troll shares one image and we host it locally — instant + reliable
        image: isTroll ? "/troll.png" : fixImage(i.image_url),
        collection: i.token?.name ?? "Unknown",
        symbol: i.token?.symbol ?? "",
      };
    });

  return NextResponse.json({ items });
}
