export type Category =
  | "Macro"
  | "Crypto"
  | "Sports"
  | "AI"
  | "Politics"
  | "Pop culture";

export interface PredictionMarket {
  id: string;
  question: string;
  category: Category;
  yesPct: number;
  delta24h: number; // change in YES odds, percentage points
  volume: string;
  resolves: string;
}

export interface CoinPair {
  id: string;
  coinName: string;
  symbol: string;
  emoji: string;
  market: PredictionMarket;
  /** Price of the coin denominated in YES shares of the paired market */
  priceInYes: number;
  change24h: number;
  marketCap: string;
  vol24h: string;
  spark: number[];
  flagship?: boolean;
}

export const MARKETS: PredictionMarket[] = [
  {
    id: "fed-sept",
    question: "Fed cuts rates at the September FOMC?",
    category: "Macro",
    yesPct: 67,
    delta24h: 3.2,
    volume: "$4.1M",
    resolves: "Sep 17, 2026",
  },
  {
    id: "btc-250k",
    question: "Bitcoin above $250K on Dec 31?",
    category: "Crypto",
    yesPct: 41,
    delta24h: -1.8,
    volume: "$12.8M",
    resolves: "Dec 31, 2026",
  },
  {
    id: "gpt6-2026",
    question: "GPT-6 ships before 2027?",
    category: "AI",
    yesPct: 58,
    delta24h: 5.1,
    volume: "$2.3M",
    resolves: "Dec 31, 2026",
  },
  {
    id: "chiefs-sb",
    question: "Chiefs win Super Bowl LXI?",
    category: "Sports",
    yesPct: 22,
    delta24h: 0.9,
    volume: "$6.7M",
    resolves: "Feb 2027",
  },
  {
    id: "recession-26",
    question: "US recession declared in 2026?",
    category: "Macro",
    yesPct: 18,
    delta24h: -2.4,
    volume: "$3.5M",
    resolves: "Dec 31, 2026",
  },
  {
    id: "sol-flip",
    question: "SOL flips ETH market cap this cycle?",
    category: "Crypto",
    yesPct: 12,
    delta24h: 1.1,
    volume: "$5.2M",
    resolves: "Dec 31, 2027",
  },
  {
    id: "aliens",
    question: "Pentagon confirms non-human craft by 2027?",
    category: "Pop culture",
    yesPct: 4,
    delta24h: 0.3,
    volume: "$890K",
    resolves: "Dec 31, 2026",
  },
  {
    id: "mars-2030",
    question: "Crewed Mars launch announced for 2030?",
    category: "AI",
    yesPct: 31,
    delta24h: 2.7,
    volume: "$1.9M",
    resolves: "Jun 2027",
  },
  {
    id: "senate-flip",
    question: "Senate flips in the 2026 midterms?",
    category: "Politics",
    yesPct: 47,
    delta24h: -0.6,
    volume: "$9.4M",
    resolves: "Nov 3, 2026",
  },
  {
    id: "swift-tour",
    question: "New Taylor Swift world tour announced in 2026?",
    category: "Pop culture",
    yesPct: 73,
    delta24h: 4.4,
    volume: "$1.2M",
    resolves: "Dec 31, 2026",
  },
];

const byId = Object.fromEntries(MARKETS.map((m) => [m.id, m]));

export const PAIRS: CoinPair[] = [
  {
    id: "trust-fed",
    coinName: "Trust",
    symbol: "TRUST",
    emoji: "🐕",
    market: byId["fed-sept"],
    priceInYes: 0.0842,
    change24h: 12.4,
    marketCap: "$18.2M",
    vol24h: "$2.4M",
    spark: [4, 5, 4.5, 6, 5.5, 7, 6.5, 8, 7.5, 9, 8.8, 10, 9.5, 11, 12],
    flagship: true,
  },
  {
    id: "hopium-btc",
    coinName: "Hopium",
    symbol: "HOPIUM",
    emoji: "🌈",
    market: byId["btc-250k"],
    priceInYes: 0.0031,
    change24h: 34.7,
    marketCap: "$4.6M",
    vol24h: "$1.1M",
    spark: [3, 3.2, 3.1, 4, 4.5, 4.2, 5.5, 6, 5.8, 7, 8, 7.6, 9, 10, 11],
  },
  {
    id: "copium-recession",
    coinName: "Copium",
    symbol: "COPIUM",
    emoji: "😤",
    market: byId["recession-26"],
    priceInYes: 0.0009,
    change24h: -8.2,
    marketCap: "$1.9M",
    vol24h: "$430K",
    spark: [9, 8.5, 8.8, 8, 7.5, 7.8, 7, 6.5, 6.8, 6, 6.2, 5.8, 5.5, 5.7, 5.4],
  },
  {
    id: "wagmi-gpt6",
    coinName: "Wagmi",
    symbol: "WAGMI",
    emoji: "🤝",
    market: byId["gpt6-2026"],
    priceInYes: 0.0124,
    change24h: 21.3,
    marketCap: "$7.8M",
    vol24h: "$980K",
    spark: [5, 5.5, 5.2, 6, 6.8, 6.4, 7, 7.5, 7.2, 8, 8.6, 8.2, 9, 9.8, 10.4],
  },
  {
    id: "moonboi-sol",
    coinName: "Moonboi",
    symbol: "MOONBOI",
    emoji: "🌙",
    market: byId["sol-flip"],
    priceInYes: 0.0567,
    change24h: -3.1,
    marketCap: "$3.2M",
    vol24h: "$610K",
    spark: [7, 7.4, 7.1, 7.8, 7.5, 8, 7.6, 7.2, 7.5, 7, 6.8, 7.1, 6.9, 6.7, 6.8],
  },
  {
    id: "bighands-chiefs",
    coinName: "Big Hands",
    symbol: "BIGHANDS",
    emoji: "🙌",
    market: byId["chiefs-sb"],
    priceInYes: 0.0213,
    change24h: 6.9,
    marketCap: "$2.7M",
    vol24h: "$350K",
    spark: [4, 4.2, 4.1, 4.5, 4.3, 4.8, 5, 4.7, 5.2, 5.5, 5.3, 5.8, 6, 5.9, 6.2],
  },
  {
    id: "believe-aliens",
    coinName: "Believe",
    symbol: "BELIEVE",
    emoji: "👽",
    market: byId["aliens"],
    priceInYes: 0.00042,
    change24h: 88.5,
    marketCap: "$920K",
    vol24h: "$780K",
    spark: [2, 2.1, 2, 2.3, 2.2, 2.5, 3, 3.5, 4.2, 5, 6.5, 7, 8.5, 10, 12],
  },
  {
    id: "ballot-senate",
    coinName: "Ballot Box",
    symbol: "BALLOT",
    emoji: "🗳️",
    market: byId["senate-flip"],
    priceInYes: 0.0088,
    change24h: -1.4,
    marketCap: "$5.1M",
    vol24h: "$1.6M",
    spark: [6, 6.2, 6.1, 6.4, 6.2, 6.5, 6.3, 6.1, 6.4, 6.2, 6, 6.1, 5.9, 6, 5.9],
  },
  {
    id: "swiftie-tour",
    coinName: "Swiftie",
    symbol: "SWIFTIE",
    emoji: "💜",
    market: byId["swift-tour"],
    priceInYes: 0.0035,
    change24h: 15.8,
    marketCap: "$2.2M",
    vol24h: "$540K",
    spark: [3, 3.3, 3.2, 3.6, 3.5, 4, 4.4, 4.2, 4.8, 5, 5.4, 5.2, 5.8, 6.2, 6.5],
  },
];

export const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Macro",
  "Crypto",
  "AI",
  "Sports",
  "Politics",
  "Pop culture",
];

export const TRUST_CONTRACT = "trusTm3Bro1111111111111111111111111111111111";
