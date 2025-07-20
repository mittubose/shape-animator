import React, { useState } from "react";
import { DEVICES, UPGRADES, UPGRADE_LIMITS } from "../gameData";

const voxelAssets = {
  usb: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="18" y="12" width="12" height="24" fill="#90caf9" stroke="#333" strokeWidth="2" /><rect x="20" y="8" width="8" height="8" fill="#b0bec5" /><rect x="22" y="10" width="4" height="4" fill="#333" /></svg>
  ),
  laptop: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="10" y="18" width="28" height="12" fill="#b0bec5" stroke="#333" strokeWidth="2" /><rect x="14" y="22" width="20" height="4" fill="#263238" /><rect x="8" y="32" width="32" height="6" fill="#789262" /></svg>
  ),
  pi: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="16" y="16" width="16" height="16" fill="#43a047" stroke="#222" strokeWidth="2" /><rect x="20" y="20" width="8" height="8" fill="#b2ff59" /></svg>
  ),
  gpu: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="10" y="18" width="28" height="12" fill="#43a047" stroke="#222" strokeWidth="2" /><rect x="14" y="22" width="20" height="4" fill="#b2ff59" /><rect x="12" y="32" width="24" height="4" fill="#222" /></svg>
  ),
  rig: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="16" fill="#b0bec5" stroke="#333" strokeWidth="2" /><rect x="12" y="20" width="24" height="8" fill="#263238" /><rect x="16" y="36" width="16" height="4" fill="#789262" /><rect x="20" y="40" width="8" height="4" fill="#333" /></svg>
  ),
  rack: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" fill="#616161" stroke="#333" strokeWidth="2" /><rect x="10" y="14" width="28" height="4" fill="#bdbdbd" /><rect x="10" y="22" width="28" height="4" fill="#bdbdbd" /><rect x="10" y="30" width="28" height="4" fill="#bdbdbd" /></svg>
  ),
  broken: (
    <svg width="48" height="48" viewBox="0 0 48 48"><rect x="8" y="20" width="32" height="16" fill="#b0bec5" stroke="#c62828" strokeWidth="2" /><rect x="12" y="24" width="24" height="8" fill="#c62828" /><rect x="16" y="36" width="16" height="4" fill="#b71c1c" /><rect x="20" y="40" width="8" height="4" fill="#333" /><line x1="12" y1="24" x2="36" y2="32" stroke="#fff" strokeWidth="2" /><line x1="36" y1="24" x2="12" y2="32" stroke="#fff" strokeWidth="2" /></svg>
  ),
};

const deviceTypes = [
  { key: "usb", label: "USB Miner" },
  { key: "laptop", label: "Old Laptop" },
  { key: "pi", label: "Raspberry Pi" },
  { key: "gpu", label: "GPU Rig" },
  { key: "rig", label: "Mining Rig" },
  { key: "rack", label: "Server Rack" },
  { key: "ram", label: "RAM" },
  { key: "gpu-upg", label: "GPU" },
  { key: "psu", label: "PSU" },
  { key: "remove", label: "Remove" },
];

export default function MiningArea({ brokenDevice, deviceLimit, inventory, setInventory, setMiningPower, onEvent, grid, setGrid, rackContents, setRackContents, maxGridSize = 3 }) {
  // 3x3 grid, each cell is null or a device object { type, upgrades: [] }
  const initialGrid = Array(maxGridSize)
    .fill(null)
    .map(() => Array(maxGridSize).fill(null));
  // Place broken device at center if needed
  if (brokenDevice) initialGrid[1][1] = { type: "broken", upgrades: [] };

  const [selected, setSelected] = useState("usb");
  const [limitMsg, setLimitMsg] = useState("");
  const [hovered, setHovered] = useState(null); // {row, col}
  const [highlighted, setHighlighted] = useState([]); // [{row, col}]
  const [rackPopup, setRackPopup] = useState(null); // {row, col} or null
  const [flashCell, setFlashCell] = useState(null); // {row, col} for animation
  const [rackUsed, setRackUsed] = useState(false);

  // Update grid size if maxGridSize changes
  React.useEffect(() => {
    setGrid((g) => {
      const size = maxGridSize;
      let newGrid = Array(size).fill(null).map(() => Array(size).fill(null));
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (g[row] && g[row][col]) newGrid[row][col] = g[row][col];
        }
      }
      return newGrid;
    });
  }, [maxGridSize, setGrid]);

  // Count devices (excluding null, land, broken)
  const deviceCount = grid.flat().filter(
    (cell) => cell && cell.type && cell.type !== "land" && cell.type !== "broken"
  ).length;

  // Sync grid/rackContents to parent (no-op, since parent owns state)

  // Calculate mining power
  React.useEffect(() => {
    let total = 0;
    for (let row = 0; row < maxGridSize; row++) {
      for (let col = 0; col < maxGridSize; col++) {
        const cell = grid[row][col];
        if (!cell || !cell.type || cell.type.endsWith("-part")) continue;
        let power = DEVICES[cell.type]?.power || 0;
        if (cell.upgrades && cell.upgrades.length > 0) {
          let boost = 0;
          for (const upg of cell.upgrades) {
            boost += UPGRADES[upg]?.effect || 0;
          }
          power += power * boost;
        }
        total += power;
      }
    }
    setMiningPower && setMiningPower(Math.round(total));
  }, [grid, setMiningPower, maxGridSize]);

  // Highlight compatible devices when upgrade is selected
  React.useEffect(() => {
    if (["ram", "gpu-upg", "psu"].includes(selected)) {
      const highlights = [];
      for (let row = 0; row < maxGridSize; row++) {
        for (let col = 0; col < maxGridSize; col++) {
          const cell = grid[row][col];
          if (
            cell &&
            cell.type &&
            DEVICES[cell.type]?.upgradable &&
            (!cell.upgrades ||
              (cell.upgrades.filter((u) => u === selected).length < UPGRADE_LIMITS[selected]) &&
              (selected !== "psu" || !cell.upgrades.includes("psu")) &&
              (selected === "psu" || cell.upgrades.includes("psu") || cell.upgrades.length < 2))
          ) {
            highlights.push({ row, col });
          }
        }
      }
      setHighlighted(highlights);
    } else {
      setHighlighted([]);
    }
  }, [selected, grid, maxGridSize]);

  // Animate upgrade application
  function flash(row, col) {
    setFlashCell({ row, col });
    setTimeout(() => setFlashCell(null), 350);
  }

  // Server rack popup logic
  function openRack(row, col) {
    setRackPopup({ row, col });
  }
  function closeRack() {
    setRackPopup(null);
  }

  // Move device into rack
  function moveDeviceToRack(fromRow, fromCol) {
    if (!rackPopup) return;
    const rackKey = `${rackPopup.row},${rackPopup.col}`;
    const contents = rackContents[rackKey] || [];
    if (contents.length >= 2) return;
    const cell = grid[fromRow][fromCol];
    if (!cell || !cell.type || cell.type === 'rack' || cell.type === 'broken') return;
    // Remove from grid
    setGrid((g) => {
      const newGrid = g.map((r) => r.map((c) => (c ? { ...c } : null)));
      newGrid[fromRow][fromCol] = null;
      return newGrid;
    });
    // Add to rack
    setRackContents((rc) => {
      const updated = { ...rc };
      updated[rackKey] = [...(updated[rackKey] || []), cell];
      return updated;
    });
    if (!rackUsed) {
      setRackUsed(true);
      onEvent && onEvent('rack_used');
    }
  }

  // Move device out of rack
  function moveDeviceOutOfRack(idx) {
    if (!rackPopup) return;
    const rackKey = `${rackPopup.row},${rackPopup.col}`;
    const contents = rackContents[rackKey] || [];
    // Find first empty grid cell
    let placed = false;
    setGrid((g) => {
      const newGrid = g.map((r) => r.map((c) => (c ? { ...c } : null)));
      for (let row = 0; row < maxGridSize && !placed; row++) {
        for (let col = 0; col < maxGridSize && !placed; col++) {
          if (!newGrid[row][col]) {
            newGrid[row][col] = contents[idx];
            placed = true;
          }
        }
      }
      return newGrid;
    });
    // Remove from rack
    setRackContents((rc) => {
      const updated = { ...rc };
      updated[rackKey] = contents.filter((_, i) => i !== idx);
      return updated;
    });
  }

  // Check if enough contiguous empty slots for device size
  function canPlaceDevice(row, col, deviceKey) {
    const size = DEVICES[deviceKey]?.size || 1;
    if (size === 1) return !grid[row][col];
    // For 2x2 (rack) or 1x2 (rig), check right and down
    if (size === 2) {
      // Try horizontal (right)
      if (col + 1 < maxGridSize && !grid[row][col] && !grid[row][col + 1]) return true;
      // Try vertical (down)
      if (row + 1 < maxGridSize && !grid[row][col] && !grid[row + 1][col]) return true;
      return false;
    }
    if (size === 4) {
      // 2x2 block
      if (
        row + 1 < maxGridSize &&
        col + 1 < maxGridSize &&
        !grid[row][col] &&
        !grid[row][col + 1] &&
        !grid[row + 1][col] &&
        !grid[row + 1][col + 1]
      )
        return true;
      return false;
    }
    return false;
  }

  function handleCellClick(row, col) {
    // Prevent editing the broken device cell until repaired
    if (brokenDevice && row === 1 && col === 1) return;
    setGrid((g) => {
      const newGrid = g.map((r) => r.map((cell) => (cell ? { ...cell } : null)));
      const prev = newGrid[row][col];
      // Upgrade application
      if (["ram", "gpu-upg", "psu"].includes(selected)) {
        const prev = newGrid[row][col];
        if (
          prev &&
          prev.type &&
          DEVICES[prev.type]?.upgradable &&
          (!prev.upgrades ||
            (prev.upgrades.filter((u) => u === selected).length < UPGRADE_LIMITS[selected]) &&
            (selected !== "psu" || !prev.upgrades.includes("psu")) &&
            (selected === "psu" || prev.upgrades.includes("psu") || prev.upgrades.length < 2)) &&
          inventory[selected] > 0
        ) {
          prev.upgrades = prev.upgrades || [];
          prev.upgrades.push(selected);
          setInventory((inv) => ({ ...inv, [selected]: inv[selected] - 1 }));
          flash(row, col);
          onEvent && onEvent("upgrade_applied", { type: selected, row, col });
        }
        return newGrid;
      }
      // Server rack open
      const cell = newGrid[row][col];
      if (cell && cell.type && cell.type.replace(/-part.*/, "") === "rack") {
        openRack(row, col);
        return newGrid;
      }
      // If rack popup is open and clicked cell is a device, move it into rack
      if (rackPopup && grid[row][col] && grid[row][col].type && grid[row][col].type !== 'rack' && grid[row][col].type !== 'broken') {
        moveDeviceToRack(row, col);
        return;
      }
      // Remove logic
      if (selected === "remove") {
        if (prev && prev.type && prev.type !== "broken" && prev.type !== "land") {
          setInventory((inv) => ({ ...inv, [prev.type]: inv[prev.type] + 1 }));
        }
        newGrid[row][col] = null;
      } else {
        const size = DEVICES[selected]?.size || 1;
        if (deviceCount >= deviceLimit && !newGrid[row][col]) {
          setLimitMsg(`Device limit of ${deviceLimit} reached!`);
          setTimeout(() => setLimitMsg(""), 2000);
          return g;
        }
        if (inventory[selected] > 0 && canPlaceDevice(row, col, selected)) {
          if (size === 1) {
            newGrid[row][col] = { type: selected, upgrades: [] };
          } else if (size === 2) {
            // Place horizontally if possible, else vertically
            if (col + 1 < maxGridSize && !newGrid[row][col + 1]) {
              newGrid[row][col] = { type: selected, upgrades: [] };
              newGrid[row][col + 1] = { type: selected + "-part", upgrades: [] };
            } else if (row + 1 < maxGridSize && !newGrid[row + 1][col]) {
              newGrid[row][col] = { type: selected, upgrades: [] };
              newGrid[row + 1][col] = { type: selected + "-part", upgrades: [] };
            }
          } else if (size === 4) {
            // 2x2 block
            newGrid[row][col] = { type: selected, upgrades: [] };
            newGrid[row][col + 1] = { type: selected + "-part1", upgrades: [] };
            newGrid[row + 1][col] = { type: selected + "-part2", upgrades: [] };
            newGrid[row + 1][col + 1] = { type: selected + "-part3", upgrades: [] };
          }
          setInventory((inv) => ({ ...inv, [selected]: inv[selected] - 1 }));
        }
      }
      return newGrid;
    });
  }

  function getDeviceInfo(cell) {
    if (!cell) return null;
    const baseKey = cell.type ? cell.type.replace(/-part.*/, "") : cell.replace(/-part.*/, "");
    return DEVICES[baseKey];
  }

  function getDeviceUpgrades(cell) {
    if (!cell || !cell.upgrades) return [];
    return cell.upgrades;
  }

  // Server rack mini-grid (up to 2 devices)
  function renderRackPopup() {
    if (!rackPopup) return null;
    const rackKey = `${rackPopup.row},${rackPopup.col}`;
    const contents = rackContents[rackKey] || [];
    return (
      <div style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 120,
        margin: "0 auto",
        width: 260,
        background: "#232526",
        color: "#00ff99",
        border: "2px solid #00ff99",
        borderRadius: 12,
        boxShadow: "0 4px 24px #00ff9955",
        padding: 18,
        zIndex: 300,
        textAlign: "center",
      }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>Server Rack</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          {[0, 1].map((idx) => (
            <div key={idx} style={{ width: 48, height: 48, background: "#181c20", border: "1px solid #00ff99", borderRadius: 8, position: 'relative', cursor: contents[idx] ? 'pointer' : 'default' }}
              onClick={() => contents[idx] && moveDeviceOutOfRack(idx)}
              title={contents[idx] ? 'Click to move out' : ''}
            >
              {contents[idx] && voxelAssets[contents[idx].type.replace(/-part.*/, "")]}
              {/* Tooltip/info popup for device in rack */}
              {contents[idx] && (
                <div style={{
                  position: "absolute",
                  left: 56,
                  top: 0,
                  background: "#232526",
                  color: "#00ff99",
                  border: "1px solid #00ff99",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "8px 14px",
                  zIndex: 10,
                  minWidth: 120,
                  boxShadow: "0 2px 8px #00ff9955",
                }}>
                  <div style={{ fontWeight: 900, marginBottom: 4 }}>{DEVICES[contents[idx].type]?.name}</div>
                  <div>{DEVICES[contents[idx].type]?.specs}</div>
                  {contents[idx].upgrades && contents[idx].upgrades.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      Upgrades: {contents[idx].upgrades.map((u, i) => (
                        <span key={u + i} style={{ marginRight: 6 }}>{UPGRADES[u]?.icon || u}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ color: '#b8ffb8', fontSize: 13, marginTop: 8 }}>Click a device in the grid to move it in.<br />Click a device here to move it out.</div>
        <button onClick={closeRack} style={{ marginTop: 16, background: "#232526", color: "#00ff99", border: "1px solid #00ff99", borderRadius: 6, fontFamily: "inherit", fontSize: 16, padding: "6px 24px", cursor: "pointer" }}>Close</button>
      </div>
    );
  }

  return (
    <div style={{ margin: "32px auto", width: 220 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        {deviceTypes.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelected(d.key)}
            disabled={d.key !== "remove" && inventory[d.key] <= 0}
            style={{
              background: selected === d.key ? "#00ff99" : "#181c20",
              color: selected === d.key ? "#181c20" : "#00ff99",
              border: "2px solid #00ff99",
              borderRadius: 8,
              margin: 2,
              padding: 6,
              cursor: d.key !== "remove" && inventory[d.key] <= 0 ? "not-allowed" : "pointer",
              fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
              fontWeight: 700,
              minWidth: 48,
              transition: "background 0.1s, color 0.1s",
              opacity: d.key !== "remove" && inventory[d.key] <= 0 ? 0.5 : 1,
              position: "relative",
            }}
          >
            {d.key !== "remove" ? (UPGRADES[d.key]?.icon || voxelAssets[d.key]) : "✖"}
            {d.key !== "remove" && (
              <span style={{
                position: "absolute",
                top: 2,
                right: 4,
                background: "#232526",
                color: "#00ff99",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                padding: "0 6px",
                border: "1px solid #00ff99",
                zIndex: 2,
              }}>{inventory[d.key]}</span>
            )}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${maxGridSize}, 56px)`,
          gridTemplateRows: `repeat(${maxGridSize}, 56px)`,
          gap: 8,
          background: "#232526",
          border: "2px solid #00ff99",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 0 16px #00ff9955",
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const info = getDeviceInfo(cell);
            const upgrades = getDeviceUpgrades(cell);
            const isHighlighted = highlighted.some((h) => h.row === rIdx && h.col === cIdx);
            const isFlashing = flashCell && flashCell.row === rIdx && flashCell.col === cIdx;
            return (
              <div
                key={rIdx + "," + cIdx}
                style={{
                  width: 48,
                  height: 48,
                  background: cell ? "#181c20" : "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  border: cell ? "1px solid #00ff99" : "1px solid #333",
                  cursor: brokenDevice && rIdx === 1 && cIdx === 1 ? "not-allowed" : "pointer",
                  transition: "background 0.1s, border 0.1s",
                  opacity: brokenDevice && info && info.name === "Broken Device" ? 0.7 : 1,
                  position: "relative",
                  boxShadow: isHighlighted ? "0 0 12px #00ff99" : undefined,
                  animation: isFlashing ? "flashCell 0.35s" : undefined,
                }}
                onClick={() => handleCellClick(rIdx, cIdx)}
                onMouseEnter={() => setHovered({ row: rIdx, col: cIdx })}
                onMouseLeave={() => setHovered(null)}
              >
                {cell && voxelAssets[(cell.type || cell).replace(/-part.*/, "")]}
                {/* Tooltip/info popup */}
                {hovered && hovered.row === rIdx && hovered.col === cIdx && info && (
                  <div style={{
                    position: "absolute",
                    left: 56,
                    top: 0,
                    background: "#232526",
                    color: "#00ff99",
                    border: "1px solid #00ff99",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "8px 14px",
                    zIndex: 10,
                    minWidth: 120,
                    boxShadow: "0 2px 8px #00ff9955",
                  }}>
                    <div style={{ fontWeight: 900, marginBottom: 4 }}>{info.name}</div>
                    <div>{info.specs}</div>
                    {upgrades.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        Upgrades: {upgrades.map((u, i) => (
                          <span key={u + i} style={{ marginRight: 6 }}>{UPGRADES[u]?.icon || u}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {renderRackPopup()}
      {/* Device limit message */}
      {limitMsg && (
        <div style={{
          marginTop: 12,
          color: "#e57373",
          background: "#181c20",
          border: "1px solid #c62828",
          borderRadius: 6,
          padding: "6px 12px",
          fontFamily: "'Fira Mono', 'Consolas', 'Menlo', monospace",
          fontWeight: 700,
        }}>{limitMsg}</div>
      )}
      {/* Add flash animation keyframes */}
      <style>{`@keyframes flashCell { 0% { background: #00ff99; } 100% { background: #181c20; } }`}</style>
    </div>
  );
} 