import { useState, useEffect, useCallback } from 'react';
import './App.css';

interface Token {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  createdAt: Date;
  marketCap: number;
  holders: number;
  priceChange: number;
  liquidity: number;
  volume24h: number;
  isNew: boolean;
}

const generateRandomToken = (): Token => {
  const prefixes = ['MOON', 'DOGE', 'PEPE', 'SHIB', 'FLOKI', 'WOJAK', 'CHAD', 'BASED', 'TURBO', 'MEME', 'PUMP', 'APE', 'FROG', 'CAT', 'BONK', 'WIF', 'POPCAT', 'GIGA', 'NEIRO', 'SUNDOG'];
  const suffixes = ['INU', 'COIN', 'TOKEN', 'SWAP', 'MOON', 'PUMP', 'AI', 'GPT', 'TRON', 'SUN', '2.0', 'X', 'CLASSIC', 'GOLD', 'DEGEN'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random() > 0.5 ? suffixes[Math.floor(Math.random() * suffixes.length)] : '';
  const name = `${prefix}${suffix}`;
  const symbol = name.slice(0, Math.min(6, name.length)).toUpperCase();

  const chars = '0123456789abcdef';
  let address = 'T';
  for (let i = 0; i < 33; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    symbol: `$${symbol}`,
    contractAddress: address,
    createdAt: new Date(),
    marketCap: Math.floor(Math.random() * 500000) + 1000,
    holders: Math.floor(Math.random() * 500) + 10,
    priceChange: (Math.random() - 0.3) * 200,
    liquidity: Math.floor(Math.random() * 100000) + 5000,
    volume24h: Math.floor(Math.random() * 50000) + 1000,
    isNew: true,
  };
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
};

const formatAddress = (addr: string): string => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

function TokenRow({ token, index }: { token: Token; index: number }) {
  const [flash, setFlash] = useState(token.isNew);

  useEffect(() => {
    if (token.isNew) {
      const timer = setTimeout(() => setFlash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [token.isNew]);

  return (
    <div
      className={`token-row ${flash ? 'token-new' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="token-rank">#{index + 1}</div>
      <div className="token-main">
        <div className="token-avatar">
          <span className="avatar-glyph">{token.symbol[1]}</span>
        </div>
        <div className="token-info">
          <span className="token-name">{token.name}</span>
          <span className="token-symbol">{token.symbol}</span>
        </div>
      </div>
      <div className="token-address" title={token.contractAddress}>
        <span className="address-label">CA:</span>
        <code>{formatAddress(token.contractAddress)}</code>
        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(token.contractAddress)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      <div className="token-mcap">
        <span className="stat-label">MCAP</span>
        <span className="stat-value">${formatNumber(token.marketCap)}</span>
      </div>
      <div className="token-liq">
        <span className="stat-label">LIQ</span>
        <span className="stat-value">${formatNumber(token.liquidity)}</span>
      </div>
      <div className="token-holders">
        <span className="stat-label">HOLDERS</span>
        <span className="stat-value">{formatNumber(token.holders)}</span>
      </div>
      <div className={`token-change ${token.priceChange >= 0 ? 'positive' : 'negative'}`}>
        <span className="change-arrow">{token.priceChange >= 0 ? '▲' : '▼'}</span>
        <span className="change-value">{Math.abs(token.priceChange).toFixed(1)}%</span>
      </div>
      <div className="token-time">{formatTime(token.createdAt)}</div>
      <div className="token-actions">
        <button className="action-btn buy-btn">BUY</button>
        <button className="action-btn chart-btn">CHART</button>
      </div>
    </div>
  );
}

function MatrixRain() {
  return (
    <div className="matrix-rain">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="rain-column"
          style={{
            left: `${i * 5}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <span key={j} style={{ animationDelay: `${j * 0.1}s` }}>
              {String.fromCharCode(0x30A0 + Math.random() * 96)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatsBar({ tokens }: { tokens: Token[] }) {
  const totalMcap = tokens.reduce((sum, t) => sum + t.marketCap, 0);
  const totalVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0);
  const avgChange = tokens.length > 0
    ? tokens.reduce((sum, t) => sum + t.priceChange, 0) / tokens.length
    : 0;

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-icon">◈</span>
        <span className="stat-title">TOKENS TRACKED</span>
        <span className="stat-number">{tokens.length}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">◆</span>
        <span className="stat-title">TOTAL MCAP</span>
        <span className="stat-number">${formatNumber(totalMcap)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">◇</span>
        <span className="stat-title">24H VOLUME</span>
        <span className="stat-number">${formatNumber(totalVolume)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-icon">◉</span>
        <span className="stat-title">AVG CHANGE</span>
        <span className={`stat-number ${avgChange >= 0 ? 'positive' : 'negative'}`}>
          {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'new'>('all');

  const addNewToken = useCallback(() => {
    const newToken = generateRandomToken();
    setTokens(prev => {
      const updated = prev.map(t => ({ ...t, isNew: false }));
      return [newToken, ...updated].slice(0, 50);
    });
  }, []);

  useEffect(() => {
    // Initial tokens
    const initial = Array.from({ length: 15 }, () => ({
      ...generateRandomToken(),
      createdAt: new Date(Date.now() - Math.random() * 3600000),
      isNew: false,
    }));
    setTokens(initial);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(addNewToken, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isLive, addNewToken]);

  const filteredTokens = tokens.filter(token => {
    if (filter === 'gainers') return token.priceChange > 0;
    if (filter === 'new') {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      return token.createdAt > fiveMinAgo;
    }
    return true;
  });

  return (
    <div className="app">
      <MatrixRain />
      <div className="scanlines"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <header className="header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">$CLONK</span>
            <span className="logo-sub">TRACKER</span>
          </div>
          <div className="network-badge">
            <span className="pulse"></span>
            <span>TRON NETWORK</span>
          </div>
        </div>

        <div className="header-right">
          <div className="live-indicator" onClick={() => setIsLive(!isLive)}>
            <span className={`live-dot ${isLive ? 'active' : ''}`}></span>
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <div className="sunpump-badge">
            <span className="sun-icon">☀</span>
            <span>SUNPUMP</span>
          </div>
        </div>
      </header>

      <StatsBar tokens={tokens} />

      <main className="main">
        <div className="controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              ALL TOKENS
            </button>
            <button
              className={`filter-tab ${filter === 'gainers' ? 'active' : ''}`}
              onClick={() => setFilter('gainers')}
            >
              GAINERS
            </button>
            <button
              className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
              onClick={() => setFilter('new')}
            >
              JUST LAUNCHED
            </button>
          </div>
          <div className="token-count">
            <span className="count-number">{filteredTokens.length}</span>
            <span className="count-label">tokens</span>
          </div>
        </div>

        <div className="token-list-header">
          <span className="col-rank">#</span>
          <span className="col-token">TOKEN</span>
          <span className="col-address">CONTRACT</span>
          <span className="col-mcap">MCAP</span>
          <span className="col-liq">LIQUIDITY</span>
          <span className="col-holders">HOLDERS</span>
          <span className="col-change">24H</span>
          <span className="col-time">AGE</span>
          <span className="col-actions">ACTIONS</span>
        </div>

        <div className="token-list">
          {filteredTokens.map((token, index) => (
            <TokenRow key={token.id} token={token} index={index} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <span>Requested by <a href="https://twitter.com/wenxora" target="_blank" rel="noopener noreferrer">@wenxora</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer">@clonkbot</a></span>
      </footer>
    </div>
  );
}

export default App;
