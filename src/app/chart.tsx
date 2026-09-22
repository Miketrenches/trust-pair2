"use client";

import { useState } from "react";

/* ---------- Grand Exchange style chart (static mock data) ---------- */

type Timeframe = {
  key: string;
  label: string;
  seed: number;
  n: number;
  xLabels: string[];
  // shape: value at t in [0,1] before noise
  shape: (t: number, i: number, n: number) => number;
  buyIdx: number[];
};

const TIMEFRAMES: Timeframe[] = [
  {
    key: "1m",
    label: "1M · last hour",
    seed: 777,
    n: 60,
    xLabels: ["-50m", "-40m", "-30m", "-20m", "-10m", "now"],
    // launch hour: choppy, then the pump as the vault starts buying
    shape: (t, i, n) => {
      let base = 0.1 + 0.002 * Math.sin(t * 9);
      if (t > 0.7) base += 0.014 * ((t - 0.7) / 0.3);
      if (i >= n - 3) base += 0.004 * (i - (n - 3));
      return base;
    },
    buyIdx: [46, 53, 58],
  },
  {
    key: "5m",
    label: "5M · ~6 hours",
    seed: 1337,
    n: 72,
    xLabels: ["-5h", "-4h", "-3h", "-2h", "-1h", "now"],
    // drift down, recover, spike at the end
    shape: (t, i, n) => {
      let base = 0.112 - 0.014 * Math.min(1, t / 0.6);
      if (t > 0.6) base = 0.098 + 0.006 * ((t - 0.6) / 0.4);
      if (i >= n - 3) base += 0.007 * (i - (n - 3));
      return base;
    },
    buyIdx: [63, 68, 71],
  },
  {
    key: "15m",
    label: "15M · ~24 hours",
    seed: 4242,
    n: 96,
    xLabels: ["-20h", "-16h", "-12h", "-8h", "-4h", "now"],
    // slow bleed all day, then the launch pump
    shape: (t, i, n) => {
      let base = 0.115 - 0.017 * Math.min(1, t / 0.75);
      if (t > 0.75) base = 0.098 + 0.004 * ((t - 0.75) / 0.25);
      if (i >= n - 4) base += 0.006 * (i - (n - 4));
      return base;
    },
    buyIdx: [84, 90, 95],
  },
];

function buildSeries(tf: Timeframe) {
  // deterministic LCG noise so re-renders are stable
  let seed = tf.seed;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const vals: number[] = [];
  for (let i = 0; i < tf.n; i++) {
    const t = i / (tf.n - 1);
    vals.push(tf.shape(t, i, tf.n) + (rand() - 0.5) * 0.004);
  }
  return vals;
}

function ChartSvg({ tf }: { tf: Timeframe }) {
  const W = 1000;
  const H = 330;
  const padL = 64;
  const padR = 16;
  const padT = 18;
  const padB = 38;
  const yMin = 0.09;
  const yMax = 0.125;

  const vals = buildSeries(tf);
  const x = (i: number) => padL + (i / (vals.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);

  const points = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const avg = 0.117;
  const yTicks = [0.09, 0.1, 0.11, 0.12];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="TROLLS floor price chart">
      {/* grid */}
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(t)}
            y2={y(t)}
            stroke="#20213a"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <text x={padL - 8} y={y(t) + 5} textAnchor="end" fontSize="16" fill="#a1a1a1" fontFamily="inherit">
            {t.toFixed(2)} Ξ
          </text>
        </g>
      ))}
      {tf.xLabels.map((l, i) => {
        const xi = padL + ((i + 0.5) / tf.xLabels.length) * (W - padL - padR);
        return (
          <g key={l}>
            <line x1={xi} x2={xi} y1={padT} y2={H - padB} stroke="#191a30" strokeWidth="1" strokeDasharray="2 6" />
            <text x={xi} y={H - padB + 22} textAnchor="middle" fontSize="15" fill="#a1a1a1" fontFamily="inherit">
              {l}
            </text>
          </g>
        );
      })}

      {/* our average buy price */}
      <line
        x1={padL}
        x2={W - padR}
        y1={y(avg)}
        y2={y(avg)}
        stroke="var(--rs-cyan)"
        strokeWidth="2"
        strokeDasharray="8 6"
      />
      <text x={padL + 8} y={y(avg) - 8} fontSize="16" fill="var(--rs-cyan)" fontFamily="inherit">
        OUR AVG 0.117 Ξ
      </text>

      {/* price line */}
      <polyline points={points} fill="none" stroke="var(--rs-yellow)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* our buys */}
      {tf.buyIdx.map((i) => (
        <circle key={i} cx={x(i)} cy={y(vals[i])} r="5" fill="var(--pos)" stroke="var(--rs-amber)" strokeWidth="2" />
      ))}
    </svg>
  );
}

export function GrandExchange() {
  const [active, setActive] = useState(TIMEFRAMES[0].key);
  const tf = TIMEFRAMES.find((t) => t.key === active) ?? TIMEFRAMES[0];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl tracking-wide text-primary sm:text-3xl">
          GRAND EXCHANGE · TROLLS NFT FLOOR
        </h2>
        <div className="flex gap-2 text-sm">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`rs-btn ${t.key === active ? "rs-btn-active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="rs-well p-2 sm:p-3">
        <ChartSvg tf={tf} />
      </div>
      <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <span>
          <span
            className="mr-1.5 inline-block size-2.5 align-middle"
            style={{ background: "var(--rs-yellow)" }}
          />
          floor mid price
        </span>
        <span>
          <span className="mr-1.5 align-middle" style={{ color: "var(--rs-cyan)" }}>
            --
          </span>
          our average buy price
        </span>
        <span>
          <span
            className="mr-1.5 inline-block size-2.5 rounded-full align-middle"
            style={{ background: "var(--pos)" }}
          />
          our buys
        </span>
      </p>
    </>
  );
}
