import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

/** SPL Memo program (mainnet) */
export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

/**
 * Deterministic registry address for this app. Every memo transaction
 * includes a 0-lamport transfer touching this address, so the global feed
 * can be read by anyone via getSignaturesForAddress — no backend needed.
 */
export const REGISTRY = PublicKey.findProgramAddressSync(
  [new TextEncoder().encode("memo-terminal-v1")],
  MEMO_PROGRAM_ID
)[0];

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://solana-rpc.publicnode.com";

export const connection = new Connection(RPC_URL, "confirmed");

/** Max bytes we allow in one memo (fits comfortably in a single tx) */
export const MEMO_BYTE_LIMIT = 566;

/* ---------- wallet provider (Phantom / Solflare injected API) ---------- */

export interface WalletProvider {
  publicKey: { toString(): string } | null;
  isConnected?: boolean;
  connect(): Promise<{ publicKey: { toString(): string } } | void>;
  disconnect(): Promise<void>;
  signAndSendTransaction?(tx: Transaction): Promise<{ signature: string }>;
  signTransaction?(tx: Transaction): Promise<Transaction>;
}

export function getWalletProvider(): WalletProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown> & {
    phantom?: { solana?: WalletProvider };
    solflare?: WalletProvider;
    solana?: WalletProvider;
  };
  return w.phantom?.solana ?? w.solflare ?? w.solana ?? null;
}

/* ---------- send a real memo ---------- */

export async function sendMemo(
  provider: WalletProvider,
  ownerBase58: string,
  text: string,
  toBase58?: string
): Promise<string> {
  const owner = new PublicKey(ownerBase58);

  const tx = new Transaction();
  tx.add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: new TextEncoder().encode(text) as unknown as Buffer,
    })
  );
  // tag the registry so the memo shows up in the global feed
  tx.add(
    SystemProgram.transfer({ fromPubkey: owner, toPubkey: REGISTRY, lamports: 0 })
  );
  // optional recipient tag, so the memo is indexed on their address too
  if (toBase58) {
    const to = new PublicKey(toBase58); // throws if invalid
    tx.add(SystemProgram.transfer({ fromPubkey: owner, toPubkey: to, lamports: 0 }));
  }

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.feePayer = owner;
  tx.recentBlockhash = blockhash;

  let signature: string;
  if (provider.signAndSendTransaction) {
    ({ signature } = await provider.signAndSendTransaction(tx));
  } else if (provider.signTransaction) {
    const signed = await provider.signTransaction(tx);
    signature = await connection.sendRawTransaction(signed.serialize());
  } else {
    throw new Error("wallet cannot sign transactions");
  }

  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );
  return signature;
}

/* ---------- read the global feed ---------- */

export interface ChainMemo {
  sig: string;
  from: string;
  text: string;
  blockTime: number | null;
}

export async function fetchFeed(limit = 20): Promise<ChainMemo[]> {
  const sigs = await connection.getSignaturesForAddress(REGISTRY, { limit });
  const ok = sigs.filter((s) => !s.err && s.memo);
  if (ok.length === 0) return [];

  // one batched call to resolve senders (fee payers)
  const parsed = await connection.getParsedTransactions(
    ok.map((s) => s.signature),
    { maxSupportedTransactionVersion: 0 }
  );

  return ok.map((s, i) => ({
    sig: s.signature,
    from:
      parsed[i]?.transaction.message.accountKeys
        .find((k) => k.signer)
        ?.pubkey.toString() ?? "unknown",
    // RPC prefixes memos with "[len] " — strip it
    text: (s.memo ?? "").replace(/^\[\d+\]\s*/, ""),
    blockTime: s.blockTime ?? null,
  }));
}

/* ---------- misc helpers ---------- */

export function short(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 4)}\u2026${addr.slice(-4)}` : addr;
}

export function timeAgo(blockTime: number | null) {
  if (!blockTime) return "?";
  const s = Math.max(1, Math.floor(Date.now() / 1000 - blockTime));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
