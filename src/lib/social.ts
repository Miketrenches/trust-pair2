// ---------------------------------------------------------------------------
// SOCIAL — baskets of people on top of Paid.
// One token's creator fees, fanned out to many X handles via X Money.
// ---------------------------------------------------------------------------

export type Member = {
  handle: string; // X handle, no @
  name: string;
  weightBps: number; // basis points of the basket, all members sum to 10_000
};

export type Basket = {
  id: string;
  name: string;
  ticker: string;
  tagline: string;
  tokenAddress: string;
  members: Member[];
  preset: boolean;
  createdAt: number;
};

// ---------------------------------------------------------------------------
// Deterministic PRNG (mulberry32) so the simulated ledger is stable per seed
// ---------------------------------------------------------------------------

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** Vanity mint like Paid uses — base58, ends in "paid". */
export function fakeTokenAddress(rand: () => number): string {
  let s = "";
  for (let i = 0; i < 40; i++) s += BASE58[Math.floor(rand() * BASE58.length)];
  return s + "paid";
}

export function fakeTxId(rand: () => number): string {
  let s = "Cf";
  for (let i = 0; i < 19; i++) s += BASE58[Math.floor(rand() * BASE58.length)];
  return s;
}

// ---------------------------------------------------------------------------
// Split math
// ---------------------------------------------------------------------------

export type Payout = { member: Member; amountUsd: number };

/** Split a USD amount across basket members by weight. Cents-exact: the
 *  remainder after flooring goes to the largest weight (treasury rounding). */
export function splitAmount(members: Member[], amountUsd: number): Payout[] {
  const cents = Math.round(amountUsd * 100);
  const floors = members.map((m) => Math.floor((cents * m.weightBps) / 10_000));
  let remainder = cents - floors.reduce((a, b) => a + b, 0);
  const order = members
    .map((m, i) => ({ i, w: m.weightBps }))
    .sort((a, b) => b.w - a.w);
  const out = floors.slice();
  for (let k = 0; remainder > 0; k = (k + 1) % order.length) {
    out[order[k].i] += 1;
    remainder--;
  }
  return members.map((m, i) => ({ member: m, amountUsd: out[i] / 100 }));
}

export function equalWeights(count: number): number[] {
  const base = Math.floor(10_000 / count);
  const weights = Array(count).fill(base);
  let left = 10_000 - base * count;
  for (let i = 0; left > 0; i = (i + 1) % count) {
    weights[i] += 1;
    left--;
  }
  return weights;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

export const fmtUsdCompact = (n: number) =>
  n >= 1000
    ? "$" + (n / 1000).toFixed(n >= 10_000 ? 0 : 1) + "K"
    : "$" + n.toFixed(0);

export function shortAddress(addr: string): string {
  return addr.slice(0, 4) + "…" + addr.slice(-6);
}

/** Deterministic avatar hue per handle. */
export function avatarHue(handle: string): number {
  return hashString(handle.toLowerCase()) % 360;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ---------------------------------------------------------------------------
// Preset baskets
// ---------------------------------------------------------------------------

function basket(
  id: string,
  name: string,
  ticker: string,
  tagline: string,
  members: [handle: string, name: string, pct: number][]
): Basket {
  const rand = mulberry32(hashString(id));
  return {
    id,
    name,
    ticker,
    tagline,
    tokenAddress: fakeTokenAddress(rand),
    members: members.map(([handle, memberName, pct]) => ({
      handle,
      name: memberName,
      weightBps: Math.round(pct * 100),
    })),
    preset: true,
    createdAt: Date.UTC(2026, 8, 12),
  };
}

export const PRESET_BASKETS: Basket[] = [
  basket(
    "kol",
    "KOL Coin",
    "KOL",
    "Every fee event pays the whole crypto Twitter starting lineup.",
    [
      ["blknoiz06", "Ansem", 12.5],
      ["HsakaTrades", "Hsaka", 12.5],
      ["cobie", "Cobie", 12.5],
      ["GiganticRebirth", "GCR", 12.5],
      ["MustStopMurad", "Murad", 12.5],
      ["frankdegods", "Frank", 12.5],
      ["notthreadguy", "ThreadGuy", 12.5],
      ["Loopifyyy", "Loopify", 12.5],
    ]
  ),
  basket(
    "spcx",
    "SPCx Coin",
    "SPCX",
    "Fees flow to the people getting us to Mars.",
    [
      ["elonmusk", "Elon Musk", 40],
      ["Gwynne_Shotwell", "Gwynne Shotwell", 20],
      ["lrocket", "Tom Mueller", 10],
      ["rookisaacman", "Jared Isaacman", 10],
      ["Erdayastronaut", "Tim Dodd", 10],
      ["NASASpaceflight", "Chris Bergin", 10],
    ]
  ),
  basket(
    "sol100",
    "SOLANA Coin",
    "SOL100",
    "One token for the whole Solana ecosystem, split at the fee layer.",
    [
      ["aeyakovenko", "Toly", 25],
      ["rajgokal", "Raj Gokal", 20],
      ["0xMert_", "Mert", 15],
      ["armaniferrante", "Armani Ferrante", 10],
      ["calilyliu", "Lily Liu", 10],
      ["jacobvcreech", "Jacob Creech", 10],
      ["therealchaseeb", "Chase Barker", 10],
    ]
  ),
  basket(
    "agi",
    "AGI Coin",
    "AGI",
    "Route memecoin fees to the people building the machines.",
    [
      ["sama", "Sam Altman", 30],
      ["gdb", "Greg Brockman", 20],
      ["karpathy", "Andrej Karpathy", 20],
      ["ilyasut", "Ilya Sutskever", 15],
      ["emollick", "Ethan Mollick", 15],
    ]
  ),
];

// ---------------------------------------------------------------------------
// User baskets (localStorage)
// ---------------------------------------------------------------------------

const STORAGE_KEY = "social.baskets.v1";

export function loadUserBaskets(): Basket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Basket[]) : [];
  } catch {
    return [];
  }
}

export function saveUserBasket(b: Basket): void {
  const all = loadUserBaskets().filter((x) => x.id !== b.id);
  all.unshift(b);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function findBasket(id: string): Basket | undefined {
  return PRESET_BASKETS.find((b) => b.id === id) ?? loadUserBaskets().find((b) => b.id === id);
}

// ---------------------------------------------------------------------------
// Simulated fee events (the live ledger)
// ---------------------------------------------------------------------------

export type FeeEvent = {
  id: string;
  basket: Basket;
  grossUsd: number;
  sol: number;
  solPrice: number;
  txId: string;
  timestamp: number;
  payouts: Payout[];
};

/** Generate the nth simulated fee event for a set of baskets. Deterministic
 *  per (seed, n) so server/client and re-renders agree. */
export function makeFeeEvent(baskets: Basket[], seed: number, n: number, timestamp: number): FeeEvent {
  const rand = mulberry32(seed + n * 7919);
  const basket = baskets[Math.floor(rand() * baskets.length)];
  const solPrice = 95 + rand() * 6;
  // Log-ish distribution: most events small, occasional big ones
  const r = rand();
  const grossUsd = Math.round((r < 0.8 ? 40 + r * 400 : 400 + (r - 0.8) * 4200) * 100) / 100;
  const sol = grossUsd / solPrice;
  return {
    id: `evt-${seed}-${n}`,
    basket,
    grossUsd,
    sol,
    solPrice,
    txId: fakeTxId(rand),
    timestamp,
    payouts: splitAmount(basket.members, grossUsd),
  };
}

/** Simulated lifetime totals for a basket (used on detail pages). */
export function basketLifetime(basketId: string): { totalUsd: number; events: number } {
  const rand = mulberry32(hashString(basketId + ":lifetime"));
  const events = 40 + Math.floor(rand() * 400);
  const totalUsd = Math.round((events * (60 + rand() * 220)) * 100) / 100;
  return { totalUsd, events };
}
