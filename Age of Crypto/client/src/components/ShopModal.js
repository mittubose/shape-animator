import React from "react";
import { DEVICES, UPGRADES } from "../gameData";

const shopItems = [
  ...Object.entries(DEVICES).map(([key, d]) => ({
    key,
    name: d.name,
    price: d.price,
    type: "device",
    specs: d.specs,
    tooltip: d.specs,
    icon: d.icon,
  })),
  ...Object.entries(UPGRADES).map(([key, u]) => ({
    key,
    name: u.name + (u.name.includes("Upgrade") ? "" : " Upgrade"),
    price: u.price,
    type: "upgrade",
    specs: u.specs,
    tooltip: u.specs,
    icon: u.icon,
  })),
];

export default function ShopModal({ usd, onBuy, onClose, inventory }) {
  // Only allow buying upgrades if player owns a compatible device
  function canBuyUpgrade(upgradeKey) {
    // For demo, allow if player owns at least one upgradable device
    const upgradableDevices = Object.keys(DEVICES).filter((k) => DEVICES[k].upgradable);
    return upgradableDevices.some((dev) => inventory[dev] > 0);
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(24,28,32,0.92)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
    }}>
      <div style={{
        background: "#232526",
        border: "2px solid #00ff99",
        borderRadius: 14,
        boxShadow: "0 0 32px #00ff99aa",
        padding: 32,
        minWidth: 360,
        textAlign: "center",
      }}>
        <h2 style={{ color: "#00ff99", marginBottom: 24 }}>Marketplace</h2>
        <div style={{ color: "#b8ffb8", fontSize: 16, marginBottom: 16 }}>
          Balance: <span style={{ color: "#00ff99" }}>${usd.toLocaleString()} USD</span>
        </div>
        {shopItems.map((item) => {
          const isUpgrade = item.type === "upgrade";
          const canBuy = isUpgrade ? canBuyUpgrade(item.key) : true;
          return (
            <div key={item.key} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
              background: "#181c20",
              borderRadius: 8,
              padding: "10px 18px",
              border: "1px solid #00ff99",
              position: "relative",
            }}>
              <span style={{ fontSize: 22, marginRight: 8 }}>{item.icon}</span>
              <span style={{ color: "#fff", fontWeight: 700 }} title={item.tooltip}>{item.name}</span>
              <span style={{ color: "#00ff99", fontWeight: 700 }} title={item.specs}>{item.price ? `$${item.price}` : ""}</span>
              <span style={{ color: "#b8ffb8", fontSize: 13, marginLeft: 8 }} title={item.specs}>{item.specs}</span>
              <button
                onClick={() => onBuy(item.key)}
                disabled={usd < item.price || !canBuy}
                style={{
                  background: usd >= item.price && canBuy ? "#00ff99" : "#555",
                  color: usd >= item.price && canBuy ? "#181c20" : "#aaa",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "6px 18px",
                  cursor: usd >= item.price && canBuy ? "pointer" : "not-allowed",
                  marginLeft: 12,
                }}
              >
                Buy
              </button>
              <span style={{
                position: "absolute",
                top: 4,
                right: 8,
                color: "#00ff99",
                fontSize: 13,
                fontWeight: 700,
              }}>{inventory[item.key] > 0 ? `x${inventory[item.key]}` : ""}</span>
            </div>
          );
        })}
        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            background: "#232526",
            color: "#00ff99",
            border: "1px solid #00ff99",
            borderRadius: 6,
            fontFamily: "inherit",
            fontSize: 16,
            padding: "6px 24px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
} 