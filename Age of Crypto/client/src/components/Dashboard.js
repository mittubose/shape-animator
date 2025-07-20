import React, { useState, useEffect, useRef } from "react";
import AvatarSelectionModal from "./AvatarSelectionModal";
import MiningArea from "./MiningArea";
import ShopModal from "./ShopModal";
import useGameState from "../hooks/useGameState";
import { DEVICES } from "../gameData";

// Move MarketModal above Dashboard so it's always in scope
function MarketModal({ open, onClose, crypto, usd, onSell, onBuy, selectedCurrency, setSelectedCurrency, rate, mode, setMode, transactions, tab, setTab }) {
  const [amount, setAmount] = useState("");
  const currency = CURRENCIES.find(c => c.code === selectedCurrency);
  return open ? (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(24,28,32,0.92)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace"
    }}>
      <div style={{ background: "#232526", border: "2px solid #00ff99", borderRadius: 14, boxShadow: "0 0 32px #00ff99aa", padding: 32, minWidth: 420, textAlign: "center" }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <button onClick={() => setTab('trade')} style={{ background: tab === 'trade' ? '#00ff99' : '#181c20', color: tab === 'trade' ? '#181c20' : '#00ff99', border: '2px solid #00ff99', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '6px 18px', marginRight: 8, cursor: 'pointer' }}>Trade</button>
          <button onClick={() => setTab('history')} style={{ background: tab === 'history' ? '#00ff99' : '#181c20', color: tab === 'history' ? '#181c20' : '#00ff99', border: '2px solid #00ff99', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '6px 18px', cursor: 'pointer' }}>History</button>
        </div>
        {tab === 'trade' ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setMode('buy')} style={{ background: mode === 'buy' ? '#00ff99' : '#181c20', color: mode === 'buy' ? '#181c20' : '#00ff99', border: '2px solid #00ff99', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '6px 18px', marginRight: 8, cursor: 'pointer' }}>Buy</button>
              <button onClick={() => setMode('sell')} style={{ background: mode === 'sell' ? '#00ff99' : '#181c20', color: mode === 'sell' ? '#181c20' : '#00ff99', border: '2px solid #00ff99', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '6px 18px', cursor: 'pointer' }}>Sell</button>
            </div>
            <div style={{ color: "#b8ffb8", fontSize: 16, marginBottom: 12 }}>Balance: <span style={{ color: "#00ff99" }}>{crypto.toFixed(2)} Coin</span> | <span style={{ color: "#00ff99" }}>{currency.symbol}{usd.toLocaleString()} {currency.code}</span></div>
            <div style={{ marginBottom: 12 }}>
              <select value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #00ff99', background: '#181c20', color: '#b8ffb8' }}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
            <div style={{ color: "#ffe082", marginBottom: 12 }}>Exchange Rate: 1 Coin = {currency.symbol}{rate} {currency.code}</div>
            <input
              type="number"
              min={0}
              max={mode === 'sell' ? crypto : usd / rate}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={mode === 'sell' ? "Amount to sell" : "Amount to buy"}
              style={{ width: 180, fontSize: 16, padding: 6, borderRadius: 6, border: "1px solid #00ff99", marginBottom: 12, background: "#181c20", color: "#b8ffb8" }}
            />
            <div style={{ marginBottom: 16 }}>
              {mode === 'sell' ? (
                <button
                  onClick={() => { onSell(Number(amount)); setAmount(""); }}
                  disabled={Number(amount) <= 0 || Number(amount) > crypto}
                  style={{ background: Number(amount) > 0 && Number(amount) <= crypto ? "#00ff99" : "#555", color: Number(amount) > 0 && Number(amount) <= crypto ? "#181c20" : "#aaa", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 15, padding: "6px 18px", cursor: Number(amount) > 0 && Number(amount) <= crypto ? "pointer" : "not-allowed", marginLeft: 12 }}
                >
                  Sell
                </button>
              ) : (
                <button
                  onClick={() => { onBuy(Number(amount)); setAmount(""); }}
                  disabled={Number(amount) <= 0 || Number(amount) * rate > usd}
                  style={{ background: Number(amount) > 0 && Number(amount) * rate <= usd ? "#00ff99" : "#555", color: Number(amount) > 0 && Number(amount) * rate <= usd ? "#181c20" : "#aaa", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 15, padding: "6px 18px", cursor: Number(amount) > 0 && Number(amount) * rate <= usd ? "pointer" : "not-allowed", marginLeft: 12 }}
                >
                  Buy
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ maxHeight: 260, overflowY: 'auto', background: '#181c20', border: '1px solid #00ff99', borderRadius: 8, padding: 12, color: '#b8ffb8', fontSize: 15, textAlign: 'left' }}>
            {transactions.length === 0 ? <div style={{ color: '#888' }}>No transactions yet.</div> :
              transactions.map((t, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <span style={{ color: t.type === 'buy' ? '#00ff99' : '#e74c3c', fontWeight: 700 }}>{t.type.toUpperCase()}</span>{' '}
                  {t.amount} Coin @ {CURRENCIES.find(c => c.code === t.currency).symbol}{t.rate} {t.currency}
                  <span style={{ float: 'right', color: '#888', fontSize: 13 }}>{new Date(t.timestamp).toLocaleString()}</span>
                </div>
              ))}
          </div>
        )}
        <button
          onClick={onClose}
          style={{ marginTop: 18, background: "#232526", color: "#00ff99", border: "1px solid #00ff99", borderRadius: 6, fontFamily: "inherit", fontSize: 16, padding: "6px 24px", cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
}

const consensusOptions = ["Proof of Work", "Proof of Stake"];

const retroBg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
};

// Pontty avatar SVG
const ponttyAvatar = (
  <svg width="32" height="32" viewBox="0 0 48 48">
    <rect x="16" y="8" width="16" height="16" fill="#ffe082" />
    <rect x="20" y="24" width="8" height="12" fill="#90caf9" />
    <rect x="16" y="36" width="4" height="8" fill="#a1887f" />
    <rect x="28" y="36" width="4" height="8" fill="#a1887f" />
    <rect x="12" y="24" width="4" height="8" fill="#ffe082" />
    <rect x="32" y="24" width="4" height="8" fill="#ffe082" />
    <rect x="16" y="4" width="16" height="4" fill="#6d4c41" />
    <rect x="22" y="12" width="4" height="4" fill="#fff" /> {/* Glasses */}
    <rect x="18" y="12" width="4" height="4" fill="#fff" />
    <rect x="26" y="12" width="4" height="4" fill="#fff" />
    <rect x="18" y="16" width="12" height="2" fill="#fff" />
  </svg>
);

// Avatars for chat
const avatarSvgs = {
  pontty: ponttyAvatar,
  player: null, // Will be set to selectedAvatar
};

// Intro chat sequence with Pontty
const introChat = [
  {
    sender: "pontty",
    text: "Hey! Thanks for helping me after that wild car accident. I'm Pontty, by the way. Crypto billionaire, but a bit clumsy!",
  },
  {
    sender: "pontty",
    text: "As a thank you, I want to help you start your own crypto empire. Here, take this old mining device. It's a bit broken, but you can fix it!",
  },
  {
    sender: "pontty",
    text: "Repair it, and you'll be mining your first coins in no time. I'll be here to guide you!",
  },
  {
    sender: "player",
    text: "Thank you, Pontty! I'll get started right away.",
  },
];

const SAVE_KEY = 'crypto_game_save';

function getRandomRate(base = 1) {
  // Simulate market: random between 0.7x and 1.3x base
  return +(base * (0.7 + Math.random() * 0.6)).toFixed(2);
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', base: 1 },
  { code: 'EUR', symbol: '€', base: 1.1 },
  { code: 'GBP', symbol: '£', base: 0.9 },
];

export default function Dashboard() {
  const [coin, setCoin] = useState({
    name: "",
    consensus: consensusOptions[0],
    supply: 1000000,
    blockTime: 10,
  });
  const [balance, setBalance] = useState(0);
  const [usd, setUsd] = useState(500); // USD balance
  const [mining, setMining] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [chatIdx, setChatIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [brokenDevice, setBrokenDevice] = useState(true); // true = needs repair
  const [repairProgress, setRepairProgress] = useState(0); // 0-100
  const [showShop, setShowShop] = useState(false);
  const [spendNotif, setSpendNotif] = useState(null); // { amount, item }
  const [miningPower, setMiningPower] = useState(0);
  const [crypto, setCrypto] = useState(0);
  const [ponttyChats, setPonttyChats] = useState([]); // dynamic chat queue
  const [showPontty, setShowPontty] = useState(false);
  const [goals, setGoals] = useState([
    { id: 'upgrade', text: 'Apply your first upgrade', done: false },
    { id: 'rack', text: 'Use a server rack', done: false },
    { id: 'power20', text: 'Reach 20 mining power', done: false },
  ]);
  const [saveNotif, setSaveNotif] = useState(null); // { type: 'save'|'load', message }
  const [eventNotif, setEventNotif] = useState(null); // { type, message }
  const [miningPaused, setMiningPaused] = useState(false);
  const [energyCost, setEnergyCost] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [miningPausedByEnergy, setMiningPausedByEnergy] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [marketRate, setMarketRate] = useState(1.0);
  const [marketMode, setMarketMode] = useState('sell');
  const [transactions, setTransactions] = useState([]);
  const [marketTab, setMarketTab] = useState('trade'); // 'trade' or 'history'

  function addTransaction(type, amount, currency, rate) {
    setTransactions(txns => [
      { type, amount, currency, rate, timestamp: new Date().toISOString() },
      ...txns
    ]);
  }

  // Use custom game state hook
  const {
    inventory, setInventory,
    grid, setGrid,
    rackContents, setRackContents,
    maxGridSize, setMaxGridSize,
    save: saveGame, reset: resetGame
  } = useGameState();

  // Move all useEffect calls here, before any early returns or conditional logic
  React.useEffect(() => {
    console.log('slidein-keyframes effect');
    if (!selectedAvatar) return;
    if (!document.getElementById("slidein-keyframes")) {
      const style = document.createElement("style");
      style.id = "slidein-keyframes";
      style.innerHTML = `@keyframes slideInNotif { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
      document.head.appendChild(style);
    }
  }, [selectedAvatar]);

  React.useEffect(() => {
    console.log('mining earnings effect');
    if (!selectedAvatar) return;
    const interval = setInterval(() => {
      setCrypto((c) => c + miningPower / 100);
    }, 1000);
    return () => clearInterval(interval);
  }, [miningPower, selectedAvatar]);

  React.useEffect(() => {
    console.log('mining power milestone effect');
    if (!selectedAvatar) return;
    if (miningPower >= 20 && !goals.find(g => g.id === 'power20').done) {
      handleMiningEvent('mining_power', { power: miningPower });
    }
  }, [miningPower, goals, selectedAvatar]);

  React.useEffect(() => {
    console.log('load progress effect');
    if (!selectedAvatar) return;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      if (state.inventory) setInventory(state.inventory);
      if (typeof state.crypto === 'number') setCrypto(state.crypto);
      if (typeof state.usd === 'number') setUsd(state.usd);
      if (Array.isArray(state.goals)) setGoals(state.goals);
      if (state.grid) setGrid(state.grid);
      if (state.rackContents) setRackContents(state.rackContents);
      if (typeof state.maxGridSize === 'number') setMaxGridSize(state.maxGridSize);
    } catch {}
  }, [selectedAvatar]);

  React.useEffect(() => {
    console.log('random event system effect');
    if (!selectedAvatar) return;
    let timeout;
    function triggerRandomEvent() {
      const eventType = Math.random() < 0.5 ? 'power' : 'failure';
      if (eventType === 'power') {
        setEventNotif({ type: 'power', message: 'Power Outage! Mining paused for 10s.' });
        setMiningPaused(true);
        setTimeout(() => {
          setMiningPaused(false);
          setEventNotif(null);
          setPonttyChats((chats) => [...chats, {
            sender: 'pontty',
            text: "You survived a power outage! Always be ready for the unexpected in crypto mining."
          }]);
          setShowPontty(true);
        }, 10000);
      } else {
        if (!grid) return;
        let deviceCells = [];
        for (let row = 0; row < maxGridSize; row++) {
          for (let col = 0; col < maxGridSize; col++) {
            const cell = grid[row]?.[col];
            if (cell && cell.type && !cell.type.endsWith('-part') && cell.type !== 'broken' && cell.type !== 'rack') {
              deviceCells.push({ row, col });
            }
          }
        }
        if (deviceCells.length === 0) return;
        const idx = Math.floor(Math.random() * deviceCells.length);
        const { row, col } = deviceCells[idx];
        setGrid((g) => {
          const newGrid = g.map((r) => r.map((c) => (c ? { ...c } : null)));
          newGrid[row][col] = { type: 'broken', upgrades: [] };
          return newGrid;
        });
        setEventNotif({ type: 'failure', message: 'Device Failure! A device broke and needs repair.' });
        setPonttyChats((chats) => [...chats, {
          sender: 'pontty',
          text: "A device failed! Click the broken device to repair it and get back to mining."
        }]);
        setShowPontty(true);
        setTimeout(() => setEventNotif(null), 6000);
      }
      timeout = setTimeout(triggerRandomEvent, 60000 + Math.random() * 60000);
    }
    timeout = setTimeout(triggerRandomEvent, 60000 + Math.random() * 60000);
    return () => clearTimeout(timeout);
  }, [grid, maxGridSize, selectedAvatar]);

  React.useEffect(() => {
    console.log('pause mining earnings effect');
    if (!selectedAvatar) return;
    if (miningPaused) return;
    const interval = setInterval(() => {
      setCrypto((c) => c + miningPower / 100);
    }, 1000);
    return () => clearInterval(interval);
  }, [miningPower, miningPaused, selectedAvatar]);

  // Set player avatar for chat
  avatarSvgs.player = selectedAvatar ? avatarSvgs[selectedAvatar] : null;

  // Typing effect for chat
  function TypingText({ text, onDone, speed = 12 }) {
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);
    const idx = useRef(0);
    useEffect(() => {
      setDisplayed("");
      setTyping(true);
      idx.current = 0;
      if (!text) return;
      const interval = setInterval(() => {
        idx.current++;
        setDisplayed(text.slice(0, idx.current));
        if (idx.current >= text.length) {
          clearInterval(interval);
          setTyping(false);
          if (onDone) setTimeout(onDone, 200);
        }
      }, speed);
      return () => clearInterval(interval);
    }, [text, onDone, speed]);
    return <>{displayed}{typing && <span style={{ opacity: 0.5 }}>|</span>}</>;
  }

  // Add this function to handle coin input changes
  function handleInput(e) {
    const { name, value } = e.target;
    setCoin((c) => ({ ...c, [name]: value }));
  }

  // Show avatar selection modal if not selected
  if (!selectedAvatar) {
    return <AvatarSelectionModal onSelect={setSelectedAvatar} />;
  }

  // Shop buy handler with notification
  function handleBuy(deviceKey) {
    const prices = { usb: 20, laptop: 60, pi: 40, gpu: 150, rig: 400, rack: 1200, ram: 30, "gpu-upg": 80, psu: 50 };
    const names = {
      usb: "USB Miner", laptop: "Old Laptop", pi: "Raspberry Pi", gpu: "Entry GPU Rig", rig: "High Power Mining Rig", rack: "Server Rack",
      ram: "RAM Upgrade", "gpu-upg": "GPU Upgrade", psu: "Power Supply Upgrade"
    };
    if (usd >= prices[deviceKey]) {
      setUsd((u) => u - prices[deviceKey]);
      setInventory((inv) => ({ ...inv, [deviceKey]: inv[deviceKey] + 1 }));
      notifySpending(prices[deviceKey], names[deviceKey]);
    }
  }

  // Spending notification
  function notifySpending(amount, item) {
    setSpendNotif({ amount, item });
    setTimeout(() => setSpendNotif(null), 2500);
  }

  // Save/load logic
  function saveProgress() {
    saveGame();
    setSaveNotif({ type: 'save', message: 'Progress saved!' });
    setTimeout(() => setSaveNotif(null), 2000);
  }
  function loadProgress() {
    // Just reload the page to trigger useGameState's localStorage load
    window.location.reload();
  }
  function resetProgress() {
    resetGame();
    setSaveNotif({ type: 'save', message: 'Progress reset!' });
    setTimeout(() => setSaveNotif(null), 2000);
    window.location.reload();
  }

  // HUD Menu with Save/Load buttons
  const hudMenu = (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: 56,
      background: "#181c20cc",
      borderBottom: "2px solid #00ff99",
      display: "flex",
      alignItems: "center",
      zIndex: 20,
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      color: "#00ff99",
      fontWeight: 700,
      fontSize: 18,
      boxShadow: "0 2px 8px #00ff9955",
      paddingLeft: 24,
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: 32, cursor: "pointer" }}>☰ Menu</div>
        <div style={{ marginRight: 32, cursor: "pointer" }}>⚙ Settings</div>
        <div style={{ marginRight: 32, cursor: "pointer" }}>📋 Tasks</div>
        <div style={{ marginRight: 32, cursor: "pointer" }}>🔔 Notifications</div>
        <button
          onClick={saveProgress}
          style={{
            background: "#00ff99",
            color: "#181c20",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: "6px 18px",
            marginLeft: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px #00ff9955",
          }}
        >
          💾 Save
        </button>
        <button
          onClick={loadProgress}
          style={{
            background: "#232526",
            color: "#00ff99",
            border: "1px solid #00ff99",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: "6px 18px",
            marginLeft: 8,
            cursor: "pointer",
            boxShadow: "0 2px 8px #00ff9955",
          }}
        >
          ⬇️ Load
        </button>
        <button
          onClick={resetProgress}
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: "6px 18px",
            marginLeft: 8,
            cursor: "pointer",
            boxShadow: "0 2px 8px #e74c3c55",
          }}
        >
          🔄 Reset
        </button>
        <button
          onClick={() => setShowShop(true)}
          style={{
            background: "#00ff99",
            color: "#181c20",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            padding: "6px 18px",
            marginLeft: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px #00ff9955",
          }}
        >
          🛒 Shop
        </button>
        <button
          onClick={() => setShowMarket(true)}
          style={{ background: "#ffe082", color: "#181c20", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, padding: "6px 18px", marginLeft: 8, cursor: "pointer", boxShadow: "0 2px 8px #ffe08255" }}
        >
          💱 Market
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginRight: 32 }}>
        <div style={{
          background: "#181c20",
          color: "#00ff99",
          border: "2px solid #00ff99",
          borderRadius: 8,
          padding: "6px 16px",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 16,
          boxShadow: "0 0 8px #00ff9955",
          marginRight: 8,
        }}>
          ${usd.toLocaleString()} USD
        </div>
        <div style={{
          background: "#181c20",
          color: "#00ff99",
          border: "2px solid #00ff99",
          borderRadius: 8,
          padding: "6px 16px",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 16,
          boxShadow: "0 0 8px #00ff9955",
        }}>
          {crypto.toFixed(2)} {coin.name || "Coin"}
        </div>
        <div style={{
          background: "#232526",
          color: "#00ff99",
          border: "2px solid #00ff99",
          borderRadius: 8,
          padding: "6px 16px",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 16,
          boxShadow: "0 0 8px #00ff9955",
        }}>
          ⚡ {miningPower} Power
        </div>
        <div style={{ background: "#181c20", color: "#ffe082", border: "2px solid #ffe082", borderRadius: 8, padding: "6px 16px", fontFamily: "inherit", fontWeight: 700, fontSize: 16, boxShadow: "0 0 8px #ffe08255", marginRight: 8 }}>
          ⚡ Energy: -${energyCost.toFixed(2)}/s
        </div>
        <div style={{ background: "#181c20", color: netProfit >= 0 ? "#00ff99" : "#e74c3c", border: `2px solid ${netProfit >= 0 ? "#00ff99" : "#e74c3c"}`, borderRadius: 8, padding: "6px 16px", fontFamily: "inherit", fontWeight: 700, fontSize: 16, boxShadow: `0 0 8px ${netProfit >= 0 ? "#00ff9955" : "#e74c3c55"}` }}>
          Profit: {netProfit >= 0 ? "+" : "-"}${Math.abs(netProfit).toFixed(2)}/s
        </div>
      </div>
    </div>
  );

  // Chat box floating in bottom right, styled like Cursor prompt
  const chatBoxFloating = (
    <div
      style={{
        position: "fixed",
        right: 32,
        bottom: 32,
        zIndex: 100,
        width: 340,
        maxWidth: "90vw",
        minHeight: 80,
        background: "#181c20f2",
        border: "2px solid #00ff99",
        borderRadius: 16,
        boxShadow: "0 8px 32px #00ff9955, 0 1.5px 0 #00ff99",
        padding: 20,
        fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
        fontSize: 17,
        color: "#b8ffb8",
        transition: "opacity 0.4s cubic-bezier(.4,0,.2,1), filter 0.4s cubic-bezier(.4,0,.2,1)",
        opacity: showChat ? 1 : 0,
        animation: !showChat ? "dustFade 0.4s forwards" : undefined,
        pointerEvents: showChat ? "auto" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ minHeight: 60, marginBottom: 12, display: "flex", alignItems: "center" }}>
        <span style={{ color: "#00ff99", fontWeight: 700, marginRight: 8 }}>
          {introChat[chatIdx].sender === "pontty" ? ponttyAvatar : avatarSvgs.player}
        </span>
        <span style={{ color: introChat[chatIdx].sender === "pontty" ? "#ffe082" : "#00ff99", fontWeight: 700 }}>
          {introChat[chatIdx].sender === "pontty" ? "Pontty:" : "You:"}
        </span>{" "}
        <TypingText
          text={introChat[chatIdx].text}
          speed={12}
          onDone={() => setIsTyping(false)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#00ff99", fontSize: 14, opacity: 0.7, marginRight: 12 }}>
          {isTyping && "typing..."}
        </div>
        {chatIdx < introChat.length - 1 && !isTyping && (
          <button
            onClick={() => {
              setShowChat(false);
              setTimeout(() => {
                setChatIdx((idx) => Math.min(idx + 1, introChat.length - 1));
                setShowChat(true);
                setIsTyping(true);
              }, 420);
            }}
            style={{
              background: "#232526",
              color: "#00ff99",
              border: "1px solid #00ff99",
              borderRadius: 4,
              fontFamily: "inherit",
              fontSize: 16,
              padding: "4px 16px",
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );

  // Show repair mechanic after intro
  const showRepair = chatIdx === introChat.length - 1 && brokenDevice;

  // Repair mechanic: click to repair (5 clicks)
  function handleRepairClick() {
    setRepairProgress((p) => {
      const next = p + 20;
      if (next >= 100) {
        setBrokenDevice(false);
        return 100;
      }
      return next;
    });
  }

  // Rent more space logic
  function rentMoreSpace() {
    if (usd < 200) {
      setSaveNotif({ type: 'save', message: 'Not enough USD to rent more space!' });
      setTimeout(() => setSaveNotif(null), 2000);
      return;
    }
    if (maxGridSize >= 6) {
      setSaveNotif({ type: 'save', message: 'Max space reached!' });
      setTimeout(() => setSaveNotif(null), 2000);
      return;
    }
    setUsd((u) => u - 200);
    setMaxGridSize((s) => s + 1);
    setSaveNotif({ type: 'save', message: 'Space rented! Grid expanded.' });
    setTimeout(() => setSaveNotif(null), 2000);
  }

  // Spending notification UI
  const spendingNotification = spendNotif && (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 24,
      margin: "0 auto",
      width: 320,
      background: "#232526",
      color: "#00ff99",
      border: "2px solid #00ff99",
      borderRadius: 12,
      boxShadow: "0 4px 24px #00ff9955",
      padding: "16px 24px",
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      fontWeight: 700,
      fontSize: 17,
      textAlign: "center",
      zIndex: 300,
      animation: "slideInNotif 0.3s cubic-bezier(.4,0,.2,1)"
    }}>
      <span style={{ color: "#e57373", fontWeight: 900, marginRight: 8 }}>-${spendNotif.amount}</span>
      <span>Spent on <b>{spendNotif.item}</b></span>
    </div>
  );

  // Show save/load notification
  const saveLoadNotif = saveNotif && (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 80,
      margin: "0 auto",
      width: 320,
      background: "#232526",
      color: saveNotif.type === 'save' ? "#00ff99" : "#ffe082",
      border: `2px solid ${saveNotif.type === 'save' ? '#00ff99' : '#ffe082'}`,
      borderRadius: 12,
      boxShadow: "0 4px 24px #00ff9955",
      padding: "16px 24px",
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      fontWeight: 700,
      fontSize: 17,
      textAlign: "center",
      zIndex: 300,
      animation: "slideInNotif 0.3s cubic-bezier(.4,0,.2,1)"
    }}>{saveNotif.message}</div>
  );

  // Pontty chat triggers
  function handleMiningEvent(type, payload) {
    if (type === 'upgrade_applied' && !goals.find(g => g.id === 'upgrade').done) {
      setPonttyChats((chats) => [...chats, {
        sender: 'pontty',
        text: "Nice! You just applied your first upgrade. Upgrades make your rigs more powerful. Try stacking RAM and GPU for max effect!"
      }]);
      setGoals((gs) => gs.map(g => g.id === 'upgrade' ? { ...g, done: true } : g));
      setShowPontty(true);
    }
    if (type === 'rack_used' && !goals.find(g => g.id === 'rack').done) {
      setPonttyChats((chats) => [...chats, {
        sender: 'pontty',
        text: "You used a server rack! Racks let you organize and scale your mining operation. You can move devices in and out as needed."
      }]);
      setGoals((gs) => gs.map(g => g.id === 'rack' ? { ...g, done: true } : g));
      setShowPontty(true);
    }
    if (type === 'mining_power' && payload && payload.power >= 20 && !goals.find(g => g.id === 'power20').done) {
      setPonttyChats((chats) => [...chats, {
        sender: 'pontty',
        text: "Wow! Your mining power just hit 20. You're on your way to becoming a crypto mogul. Keep expanding and upgrading!"
      }]);
      setGoals((gs) => gs.map(g => g.id === 'power20' ? { ...g, done: true } : g));
      setShowPontty(true);
    }
  }

  // Show Pontty chat box for dynamic messages
  const ponttyChatBox = showPontty && ponttyChats.length > 0 && (
    <div style={{
      position: "fixed",
      right: 32,
      bottom: 120,
      zIndex: 200,
      width: 340,
      maxWidth: "90vw",
      background: "#181c20f2",
      border: "2px solid #ffe082",
      borderRadius: 16,
      boxShadow: "0 8px 32px #ffe08255, 0 1.5px 0 #ffe082",
      padding: 20,
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      fontSize: 17,
      color: "#ffe082",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      animation: "slideInNotif 0.3s cubic-bezier(.4,0,.2,1)"
    }}>
      <div style={{ minHeight: 60, marginBottom: 12, display: "flex", alignItems: "center" }}>
        <span style={{ color: "#ffe082", fontWeight: 700, marginRight: 8 }}>{ponttyAvatar}</span>
        <span style={{ color: "#ffe082", fontWeight: 700 }}>Pontty:</span>{" "}
        <span>{ponttyChats[0].text}</span>
      </div>
      <button
        onClick={() => {
          setPonttyChats((chats) => chats.slice(1));
          if (ponttyChats.length <= 1) setShowPontty(false);
        }}
        style={{
          background: "#232526",
          color: "#ffe082",
          border: "1px solid #ffe082",
          borderRadius: 4,
          fontFamily: "inherit",
          fontSize: 16,
          padding: "4px 16px",
          cursor: "pointer",
          alignSelf: "flex-end"
        }}
      >
        Close
      </button>
    </div>
  );

  // Task/goal sidebar
  const goalSidebar = (
    <div style={{
      position: "fixed",
      left: 0,
      top: 64,
      width: 260,
      background: "#232526",
      color: "#00ff99",
      border: "2px solid #00ff99",
      borderRadius: 12,
      boxShadow: "0 4px 24px #00ff9955",
      padding: 18,
      zIndex: 150,
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      fontSize: 16,
    }}>
      <div style={{ fontWeight: 900, marginBottom: 8 }}>Goals</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {goals.map(g => (
          <li key={g.id} style={{ marginBottom: 8, color: g.done ? '#b8ffb8' : '#00ff99', textDecoration: g.done ? 'line-through' : 'none' }}>
            {g.done ? '✔ ' : '○ '}{g.text}
          </li>
        ))}
      </ul>
    </div>
  );

  // Space used/max calculation (count main device cells only)
  function getSpaceUsed() {
    if (!grid) return 0;
    let used = 0;
    for (let row = 0; row < maxGridSize; row++) {
      for (let col = 0; col < maxGridSize; col++) {
        const cell = grid[row]?.[col];
        if (cell && cell.type && !cell.type.endsWith('-part')) used++;
      }
    }
    return used;
  }

  // Show event notification
  const eventNotification = eventNotif && (
    <div style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 140,
      margin: "0 auto",
      width: 340,
      background: eventNotif.type === 'power' ? '#222' : '#c62828',
      color: eventNotif.type === 'power' ? '#ffe082' : '#fff',
      border: `2px solid ${eventNotif.type === 'power' ? '#ffe082' : '#c62828'}`,
      borderRadius: 12,
      boxShadow: "0 4px 24px #ffe08255",
      padding: "16px 24px",
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
      fontWeight: 700,
      fontSize: 17,
      textAlign: "center",
      zIndex: 350,
      animation: "slideInNotif 0.3s cubic-bezier(.4,0,.2,1)"
    }}>{eventNotif.message}</div>
  );

  // Energy cost calculation
  React.useEffect(() => {
    if (!grid) return;
    let totalCost = 0;
    let solarPanels = 0;
    for (let row = 0; row < maxGridSize; row++) {
      for (let col = 0; col < maxGridSize; col++) {
        const cell = grid[row]?.[col];
        if (!cell || !cell.type || cell.type.endsWith('-part')) continue;
        if (cell.type === 'solar') { solarPanels++; continue; }
        // Energy cost: $0.02 per power per second (tweak as needed)
        const devicePower = DEVICES[cell.type]?.power || 0;
        totalCost += devicePower * 0.02;
      }
    }
    // Each solar panel offsets $0.20/sec
    const solarOffset = solarPanels * 0.2;
    totalCost = Math.max(0, totalCost - solarOffset);
    setEnergyCost(totalCost);
    setNetProfit(miningPower / 100 - totalCost); // miningPower/100 = coin/sec, assume 1 coin = $1 for now
  }, [grid, miningPower, maxGridSize]);

  // Deduct energy cost from USD every second
  React.useEffect(() => {
    if (energyCost === 0 || miningPausedByEnergy) return;
    const interval = setInterval(() => {
      setUsd((usd) => {
        const next = usd - energyCost;
        if (next < 0 && !miningPausedByEnergy) {
          setMiningPausedByEnergy(true);
          setMiningPaused(true);
          setEventNotif({ type: 'power', message: 'Out of USD! Mining paused due to unpaid energy bill.' });
          setTimeout(() => setEventNotif(null), 6000);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [energyCost, miningPausedByEnergy]);

  // Resume mining if USD recovers
  React.useEffect(() => {
    if (usd > 0 && miningPausedByEnergy) {
      setMiningPausedByEnergy(false);
      setMiningPaused(false);
      setEventNotif({ type: 'power', message: 'Energy bill paid! Mining resumed.' });
      setTimeout(() => setEventNotif(null), 4000);
    }
  }, [usd, miningPausedByEnergy]);

  // Update rate randomly every 30-60s
  useEffect(() => {
    let active = true;
    function updateRate() {
      if (!active) return;
      const base = CURRENCIES.find(c => c.code === selectedCurrency)?.base || 1;
      setMarketRate(getRandomRate(base));
      setTimeout(updateRate, 30000 + Math.random() * 30000);
    }
    updateRate();
    return () => { active = false; };
  }, [selectedCurrency]);

  function handleSellCoins(amount) {
    if (amount > 0 && amount <= crypto) {
      setCrypto(c => c - amount);
      setUsd(u => u + amount * marketRate);
      addTransaction('sell', amount, selectedCurrency, marketRate);
      setSaveNotif({ type: 'save', message: `Sold ${amount} Coin for ${CURRENCIES.find(c => c.code === selectedCurrency).symbol}${(amount * marketRate).toFixed(2)} ${selectedCurrency}` });
      setTimeout(() => setSaveNotif(null), 2000);
      setShowMarket(false);
    }
  }
  function handleBuyCoins(amount) {
    if (amount > 0 && amount * marketRate <= usd) {
      setCrypto(c => c + amount);
      setUsd(u => u - amount * marketRate);
      addTransaction('buy', amount, selectedCurrency, marketRate);
      setSaveNotif({ type: 'save', message: `Bought ${amount} Coin for ${CURRENCIES.find(c => c.code === selectedCurrency).symbol}${(amount * marketRate).toFixed(2)} ${selectedCurrency}` });
      setTimeout(() => setSaveNotif(null), 2000);
      setShowMarket(false);
    }
  }

  return (
    <div style={retroBg}>
      {hudMenu}
      {saveLoadNotif}
      {goalSidebar}
      {ponttyChatBox}
      {eventNotification}
      {showMarket && (
        <MarketModal
          open={showMarket}
          onClose={() => setShowMarket(false)}
          crypto={crypto}
          usd={usd}
          onSell={handleSellCoins}
          onBuy={handleBuyCoins}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          rate={marketRate}
          mode={marketMode}
          setMode={setMarketMode}
          transactions={transactions}
          tab={marketTab}
          setTab={setMarketTab}
        />
      )}
      {/* Space management UI */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 0 }}>
        <div style={{
          background: '#232526', color: '#00ff99', border: '2px solid #00ff99', borderRadius: 8, padding: '6px 18px', fontFamily: 'inherit', fontWeight: 700, fontSize: 16, marginRight: 16
        }}>
          Space: {getSpaceUsed()} / {maxGridSize * maxGridSize}
        </div>
        <button
          onClick={rentMoreSpace}
          style={{
            background: '#00ff99', color: '#181c20', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '6px 18px', cursor: 'pointer', boxShadow: '0 2px 8px #00ff9955', marginLeft: 8
          }}
        >
          Rent More Space ($200)
        </button>
      </div>
      {showShop && (
        <ShopModal
          usd={usd}
          onBuy={handleBuy}
          onClose={() => setShowShop(false)}
          inventory={inventory}
        />
      )}
      {spendingNotification}
      {chatBoxFloating}
      {/* Show repair mechanic if needed */}
      {showRepair && (
        <div style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 120,
          margin: "0 auto",
          width: 340,
          background: "#232526",
          border: "2px solid #00ff99",
          borderRadius: 12,
          boxShadow: "0 0 16px #00ff9955",
          padding: 24,
          color: "#fff",
          textAlign: "center",
          zIndex: 101,
        }}>
          <h3 style={{ color: "#ffe082", margin: 0 }}>Repair the Broken Device</h3>
          <div style={{ margin: "16px 0" }}>
            <button
              onClick={handleRepairClick}
              style={{
                background: "#00ff99",
                color: "#181c20",
                border: "none",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 700,
                padding: "12px 32px",
                cursor: "pointer",
                boxShadow: "0 2px 8px #00ff9955",
              }}
              disabled={repairProgress >= 100}
            >
              {repairProgress < 100 ? "Repair" : "Fixed!"}
            </button>
          </div>
          <div style={{
            width: "100%",
            height: 16,
            background: "#181c20",
            border: "1px solid #00ff99",
            borderRadius: 8,
            overflow: "hidden",
            margin: "0 auto",
          }}>
            <div style={{
              width: `${repairProgress}%`,
              height: "100%",
              background: "#00ff99",
              transition: "width 0.2s",
            }} />
          </div>
          <div style={{ marginTop: 8, color: "#b8ffb8" }}>
            {repairProgress < 100 ? `${repairProgress / 20}/5 repairs` : "Device is ready!"}
          </div>
        </div>
      )}
      {/* Show the mining area grid after chat, before the form */}
      <MiningArea
        usd={usd}
        setUsd={setUsd}
        brokenDevice={brokenDevice}
        deviceLimit={10}
        inventory={inventory}
        setInventory={setInventory}
        setMiningPower={setMiningPower}
        onEvent={handleMiningEvent}
        grid={grid}
        setGrid={setGrid}
        rackContents={rackContents}
        setRackContents={setRackContents}
        onStateChange={({ grid, rackContents }) => {
          setGrid(grid);
          setRackContents(rackContents);
        }}
        maxGridSize={maxGridSize}
      />
      {/* Show the form only after the last welcome message */}
      {chatIdx === introChat.length - 1 && !brokenDevice && (
        <div style={{
          background: "#232526",
          border: "2px solid #00ff99",
          borderRadius: 8,
          boxShadow: "0 0 16px #00ff9955",
          padding: 24,
          width: 420,
          maxWidth: "90vw",
          fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
          color: "#fff",
          animation: "fadeIn 0.5s cubic-bezier(.4,0,.2,1)",
        }}>
          <h3 style={{ color: "#00ff99", fontWeight: 700, marginTop: 0 }}>Create Your Coin</h3>
          <input
            name="name"
            placeholder="Coin Name"
            value={coin.name}
            onChange={handleInput}
            style={{ width: "100%", marginBottom: 8, fontFamily: "inherit", fontSize: 16, background: "#181c20", color: "#b8ffb8", border: "1px solid #00ff99", borderRadius: 4, padding: 6 }}
          />
          <select name="consensus" value={coin.consensus} onChange={handleInput} style={{ width: "100%", marginBottom: 8, fontFamily: "inherit", fontSize: 16, background: "#181c20", color: "#b8ffb8", border: "1px solid #00ff99", borderRadius: 4, padding: 6 }}>
            {consensusOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <input
            name="supply"
            type="number"
            min={1}
            value={coin.supply}
            onChange={handleInput}
            style={{ width: "100%", marginBottom: 8, fontFamily: "inherit", fontSize: 16, background: "#181c20", color: "#b8ffb8", border: "1px solid #00ff99", borderRadius: 4, padding: 6 }}
          />
          <input
            name="blockTime"
            type="number"
            min={1}
            value={coin.blockTime}
            onChange={handleInput}
            style={{ width: "100%", marginBottom: 8, fontFamily: "inherit", fontSize: 16, background: "#181c20", color: "#b8ffb8", border: "1px solid #00ff99", borderRadius: 4, padding: 6 }}
          />
          <div style={{ margin: "1rem 0" }}>
            <button
              onClick={() => setMining((m) => !m)}
              style={{
                padding: "0.5rem 1rem",
                background: mining ? "#e74c3c" : "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 16,
              }}
            >
              {mining ? "Stop Mining" : "Start Mining"}
            </button>
          </div>
          <div>
            <strong style={{ color: "#00ff99" }}>Balance:</strong> {balance} {coin.name || "Coin"}
          </div>
          <div>
            <strong style={{ color: "#00ff99" }}>Supply:</strong> {coin.supply}
          </div>
          <div>
            <strong style={{ color: "#00ff99" }}>Consensus:</strong> {coin.consensus}
          </div>
          <div>
            <strong style={{ color: "#00ff99" }}>Block Time:</strong> {coin.blockTime}s
          </div>
        </div>
      )}
    </div>
  );
} 