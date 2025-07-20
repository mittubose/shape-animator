import React from "react";

const avatars = [
  {
    id: "blue-hat",
    svg: (
      <svg width="64" height="64" viewBox="0 0 48 48">
        <rect x="16" y="8" width="16" height="16" fill="#ffe0b2" />
        <rect x="20" y="24" width="8" height="12" fill="#90caf9" />
        <rect x="16" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="28" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="12" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="32" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="16" y="4" width="16" height="6" fill="#1976d2" />
      </svg>
    ),
  },
  {
    id: "pink-hair",
    svg: (
      <svg width="64" height="64" viewBox="0 0 48 48">
        <rect x="16" y="8" width="16" height="16" fill="#ffe0b2" />
        <rect x="20" y="24" width="8" height="12" fill="#f06292" />
        <rect x="16" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="28" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="12" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="32" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="16" y="4" width="16" height="6" fill="#e040fb" />
      </svg>
    ),
  },
  {
    id: "green-glasses",
    svg: (
      <svg width="64" height="64" viewBox="0 0 48 48">
        <rect x="16" y="8" width="16" height="16" fill="#ffe0b2" />
        <rect x="20" y="24" width="8" height="12" fill="#81c784" />
        <rect x="16" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="28" y="36" width="4" height="8" fill="#a1887f" />
        <rect x="12" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="32" y="24" width="4" height="8" fill="#ffe0b2" />
        <rect x="16" y="4" width="16" height="4" fill="#333" />
        <rect x="18" y="14" width="4" height="4" fill="#00ff99" />
        <rect x="26" y="14" width="4" height="4" fill="#00ff99" />
      </svg>
    ),
  },
];

export default function AvatarSelectionModal({ onSelect }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(24,28,32,0.96)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
    }}>
      <div style={{
        background: "#232526",
        border: "2px solid #00ff99",
        borderRadius: 12,
        boxShadow: "0 0 32px #00ff99aa",
        padding: 32,
        minWidth: 340,
        textAlign: "center",
      }}>
        <h2 style={{ color: "#00ff99", marginBottom: 24 }}>Choose Your Avatar</h2>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24 }}>
          {avatars.map((a) => (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              style={{
                background: "#181c20",
                border: "2px solid #00ff99",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                margin: 4,
                transition: "transform 0.1s",
              }}
            >
              {a.svg}
            </button>
          ))}
        </div>
        <div style={{ color: "#b8ffb8", fontSize: 16 }}>Pick an avatar to start your crypto journey!</div>
      </div>
    </div>
  );
} 