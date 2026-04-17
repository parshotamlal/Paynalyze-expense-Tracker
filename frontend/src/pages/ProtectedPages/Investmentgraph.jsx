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

const formatCurrency = (value) =>
  value == null
    ? "--"
    : `₹${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const formatPercent = (value) =>
  value == null ? "--" : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const formatNumber = (value) =>
  value == null ? "--" : `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const calculateAnalytics = (history = []) => {
  if (!history.length) return null;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const avg = history.reduce((sum, value) => sum + value, 0) / history.length;
  const first = history[0];
  const last = history[history.length - 1];
  const change = first ? ((last - first) / first) * 100 : 0;
  const volatility =
    history.length > 1
      ? Math.sqrt(
          history.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) /
            history.length
        )
      : 0;

  return {
    min,
    max,
    avg,
    change,
    volatility,
    pointCount: history.length,
  };
};

async function fetchYahooQuote(symbol) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;

  const res = await fetch(proxyUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${symbol}: ${res.statusText}`);
  }

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  const meta = result?.meta;
  const quote = result?.indicators?.quote?.[0];

  if (!meta || !result || !quote) {
    throw new Error(`No stock data returned for ${symbol}`);
  }

  const closes = quote.close?.filter((value) => value != null) || [];
  const dayHigh = meta.regularMarketDayHigh ?? 0;
  const dayLow = meta.regularMarketDayLow ?? 0;
  const previousClose = meta.previousClose ?? 0;
  const open = meta.regularMarketOpen ?? 0;
  const price = meta.regularMarketPrice ?? previousClose ?? 0;
  const change = previousClose ? ((price - previousClose) / previousClose) * 100 : 0;

  return {
    price: +price.toFixed(2),
    change: +change.toFixed(2),
    history: closes,
    dayHigh: +dayHigh.toFixed(2),
    dayLow: +dayLow.toFixed(2),
    open: +open.toFixed(2),
    previousClose: +previousClose.toFixed(2),
    marketCap: meta.marketCap ?? null,
    trailingPE: meta.trailingPE ?? null,
  };
}

function Sparkline({ data, positive }) {
  const pointsData = data.length > 15 ? data.slice(-15) : data;
  if (!pointsData || pointsData.length < 2) return null;

  const min = Math.min(...pointsData);
  const max = Math.max(...pointsData);
  const range = max - min || 1;
  const W = 80;
  const H = 30;

  const points = pointsData
    .map((value, index) => {
      const x = (index / (pointsData.length - 1)) * W;
      const y = H - ((value - min) / range) * H;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive ? "#10b981" : "#ef4444";
  const gradientId = `spark-${Math.random().toString(36).slice(2)}`;

  return (
    <svg width={W} height={H} aria-label="Price sparkline">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${points} ${W},${H}`} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StockChart({ history }) {
  if (!history || history.length < 2) {
    return <p style={{ color: "#6b7280" }}>Not enough history to display.</p>;
  }

  const data = history.slice(-30);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 720;
  const H = 280;
  const padding = 28;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (W - padding * 2);
      const y = H - padding - ((value - min) / range) * (H - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const positive = data[data.length - 1] >= data[0];
  const color = positive ? "#10b981" : "#ef4444";
  const gradientId = `chart-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="#ffffff" rx="18" />

      {[0, 1, 2, 3].map((index) => (
        <line
          key={index}
          x1={padding}
          x2={W - padding}
          y1={padding + (index * (H - padding * 2)) / 3}
          y2={padding + (index * (H - padding * 2)) / 3}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      <polygon points={`0,${H} ${points} ${W},${H}`} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {data.map((value, index) => {
        const x = padding + (index / (data.length - 1)) * (W - padding * 2);
        const y = H - padding - ((value - min) / range) * (H - padding * 2);
        return <circle key={index} cx={x} cy={y} r="2.5" fill="#111827" opacity="0.75" />;
      })}
    </svg>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        flex: "1 1 180px",
        minWidth: 180,
        background: "#f8fafc",
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={{ color: "#6b7280", marginBottom: 8, fontSize: 14 }}>{title}</div>
      <div style={{ color: "#111827", fontSize: 22, fontWeight: 700 }}>{value}</div>
      {subtitle && (
        <div style={{ color: "#475569", marginTop: 6, fontSize: 13 }}>{subtitle}</div>
      )}
    </div>
  );
}

function StockCard({ meta, data, selected, onClick }) {
  const positive = (data?.change ?? 0) >= 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: selected
          ? "0 0 0 2px rgba(16, 185, 129, 0.2), 0 10px 24px rgba(0,0,0,0.08)"
          : "0 10px 24px rgba(0,0,0,0.08)",
        minHeight: "170px",
        cursor: "pointer",
        transition: "transform 200ms ease, boxShadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ marginBottom: "12px", color: "#1f2937" }}>
        <strong>{meta.label}</strong>
      </div>
      <div style={{ color: "#6b7280", marginBottom: "10px" }}>{meta.name}</div>
      {data ? (
        <>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {formatCurrency(data.price)}
          </div>
          <div
            style={{
              color: positive ? "#10b981" : "#ef4444",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            {positive ? "▲" : "▼"} {formatPercent(data.change)}
          </div>
          <Sparkline data={data.history} positive={positive} />
        </>
      ) : (
        <p style={{ color: "#6b7280" }}>Loading...</p>
      )}
    </div>
  );
}

export default function InvestmentGraph() {
  const [stockData, setStockData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState(STOCKS[0]?.symbol);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStockData = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        STOCKS.map((stock) => fetchYahooQuote(stock.symbol))
      );

      const dataMap = STOCKS.reduce((acc, stock, index) => {
        const result = results[index];
        if (result.status === "fulfilled") {
          acc[stock.symbol] = result.value;
        } else {
          acc[stock.symbol] = null;
          console.error(`Failed to load ${stock.symbol}:`, result.reason);
        }
        return acc;
      }, {});

      setStockData(dataMap);
      setLoading(false);
    };

    loadStockData();
  }, []);

  const selectedStock = STOCKS.find((stock) => stock.symbol === selectedSymbol);
  const selectedData = selectedSymbol ? stockData[selectedSymbol] : null;
  const analytics = calculateAnalytics(selectedData?.history);

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px" }}>
      <h1 style={{ color: "#111827", marginBottom: "24px" }}>Stock Market Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
        }}
      >
        {STOCKS.map((stock) => (
          <StockCard
            key={stock.symbol}
            meta={stock}
            data={stockData[stock.symbol]}
            selected={stock.symbol === selectedSymbol}
            onClick={() => setSelectedSymbol(stock.symbol)}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          borderRadius: "24px",
          background: "#ffffff",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        {selectedStock ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#111827" }}>{selectedStock.label}</h2>
                <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
                  {selectedStock.name}
                </p>
              </div>

              {selectedData ? (
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {formatCurrency(selectedData.price)}
                  </div>
                  <div
                    style={{
                      color: selectedData.change >= 0 ? "#10b981" : "#ef4444",
                      fontWeight: "700",
                    }}
                  >
                    {selectedData.change >= 0 ? "▲" : "▼"} {formatPercent(selectedData.change)}
                  </div>
                </div>
              ) : (
                <p style={{ color: "#6b7280" }}>Loading data...</p>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <MetricCard title="Day High" value={formatCurrency(selectedData?.dayHigh)} />
              <MetricCard title="Day Low" value={formatCurrency(selectedData?.dayLow)} />
              <MetricCard title="Open Price" value={formatCurrency(selectedData?.open)} />
              <MetricCard title="Prev Close" value={formatCurrency(selectedData?.previousClose)} />
              <MetricCard
                title="Market Cap"
                value={selectedData?.marketCap ? `₹${(selectedData.marketCap / 1e9).toFixed(2)}B` : "--"}
              />
              <MetricCard title="P/E Ratio" value={formatNumber(selectedData?.trailingPE)} />
            </div>

            {loading ? (
              <p style={{ color: "#6b7280" }}>Loading analytics...</p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <MetricCard
                    title="1M Trend"
                    value={analytics ? formatPercent(analytics.change) : "--"}
                    subtitle={`Last ${analytics?.pointCount ?? "--"} days`}
                  />
                  <MetricCard
                    title="Average Price"
                    value={analytics ? formatCurrency(analytics.avg) : "--"}
                  />
                  <MetricCard
                    title="Low / High"
                    value={analytics ? `${formatCurrency(analytics.min)} / ${formatCurrency(analytics.max)}` : "--"}
                  />
                  <MetricCard
                    title="Volatility"
                    value={analytics ? formatNumber(analytics.volatility) : "--"}
                  />
                </div>

                <div style={{ width: "100%" }}>
                  {selectedData ? (
                    <StockChart history={selectedData.history} />
                  ) : (
                    <p style={{ color: "#6b7280" }}>Click a stock card to view its full chart.</p>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <p style={{ color: "#6b7280" }}>Select a stock card above to see full graph details.</p>
        )}
      </div>
    </div>
  );
}