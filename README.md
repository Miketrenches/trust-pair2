# Trust Markets

The front-end for **$TRUST** — *trust me bro* — a meme launchpad concept where
you pair any memecoin with a **live prediction market** instead of SOL or a
stablecoin. Inspired by [stonk.fun](https://www.stonkfun.xyz/), which pairs
coins with tokenized stocks; here the quote asset is the YES share of a
prediction market, so a coin's price is denominated in the odds themselves.

This is a static front-end with mock data — no wallet, chain, or API is wired
up yet. It includes:

- A hero with the $TRUST shiba and a copyable (fake) contract address
- A scrolling ticker of live prediction-market odds
- A grid of mock coin/market pairs with sparklines and category filters
- A mock "Launch a coin" flow where you pick the market to pair against
- How-it-works, $TRUST tokenomics, and a developer API preview

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:4711](http://localhost:4711).

## Disclaimer

Trust Markets is a meme. Nothing here is financial advice or a functioning
exchange. All odds are illustrative. Trust me bro.
