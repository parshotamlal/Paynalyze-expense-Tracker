import React, { useState, useEffect } from "react";

const STOCKS = [
  { symbol: "RELIANCE.NS", label: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS.NS", label: "TCS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.NS", label: "HDFCBANK", name: "HDFC Bank" },
  { symbol: "INFY.NS", label: "INFY", name: "Infosys" },
  { symbol: "ICICIBANK.NS", label: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "SBIN.NS", label: "SBI", name: "State Bank of India" },
  { symbol: "WIPRO.NS", label: "WIPRO", name: "Wipro Ltd" },
  { symbol: "HINDUNILVR.NS", label: "HUL", name: "Hindustan Unilever" },
  { symbol: "ITC.NS", label: "ITC", name: "ITC Ltd" },
  { symbol: "BHARTIARTL.NS", label: "AIRTEL", name: "Bharti Airtel" },
  { symbol: "LT.NS", label: "LT", name: "Larsen & Toubro" },
  { symbol: "AXISBANK.NS", label: "AXISBANK", name: "Axis Bank" },
  { symbol: "MARUTI.NS", label: "MARUTI", name: "Maruti Suzuki" },
  { symbol: "TATAMOTORS.NS", label: "TATAMOTORS", name: "Tata Motors" },
  { symbol: "ADANIENT.NS", label: "ADANI", name: "Adani Enterprises" },
];
async function fetchYahooQuote(symbol) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    yahooUrl
  )}`;

  const res = await fetch(proxyUrl);
  const json = await res.json();

  const meta = json?.chart?.result?.[0]?.meta;
  const closes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;

  if (!meta) throw new Error("No stock data");

  const price = meta.regularMarketPrice ?? meta.previousClose;
  const prev = meta.previousClose ?? price;
  const change = ((price - prev) / prev) * 100;

  return {
    price: +price.toFixed(2),
    change: +change.toFixed(2),
    history: (closes || []).filter(Boolean).slice(-15),
  };
}

function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const W = 80;
  const H = 30;

  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");

  const color = positive ? "#10b981" : "#ef4444";
  const gid = `g${Math.random().toString(36).slice(2)}`;

  return (
    <svg width={W} height={H}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${gid})`} />

      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StockCard({ meta, data }) {
  const positive = (data?.change ?? 0) >= 0;

  return (
    <div
      style={{
        background: "#4285F4",
        borderRadius: "12px",
        padding: "16px",
        color: "black",
      }}
    >
      <h3>{meta.label}</h3>

      {data ? (
        <>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            ₹{data.price}
          </div>

          <div
            style={{
              color: positive ? "#10b981" : "#ef4444",
              fontWeight: "bold",
            }}
          >
            {positive ? "▲" : "▼"} {data.change}%
          </div>

          <Sparkline data={data.history} positive={positive} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default function InvestmentGraph() {
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    STOCKS.forEach(async (stock) => {
      try {
        const data = await fetchYahooQuote(stock.symbol);

        setStockData((prev) => ({
          ...prev,
          [stock.symbol]: data,
        }));
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  return (
    <div
      style={{
        background: "white",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1 style={{ color: "black", marginBottom: "20px" }}>
        Stock Market Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        {STOCKS.map((stock) => (
          <StockCard
            key={stock.symbol}
            meta={stock}
            data={stockData[stock.symbol]}
          />
        ))}
      </div>
    </div>
  );
}