import { useState, useEffect, useCallback } from "react";

const SAVE_KEY = 'crypto_game_save';

const initialInventory = { usb: 0, laptop: 0, pi: 0, gpu: 0, rig: 0, rack: 0, ram: 0, "gpu-upg": 0, psu: 0 };

export default function useGameState() {
  const [inventory, setInventory] = useState(initialInventory);
  const [grid, setGrid] = useState(null);
  const [rackContents, setRackContents] = useState(null);
  const [maxGridSize, setMaxGridSize] = useState(3);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      if (state.inventory) setInventory(state.inventory);
      if (state.grid) setGrid(state.grid);
      if (state.rackContents) setRackContents(state.rackContents);
      if (typeof state.maxGridSize === 'number') setMaxGridSize(state.maxGridSize);
    } catch {}
  }, []);

  // Save to localStorage
  const save = useCallback(() => {
    const state = { inventory, grid, rackContents, maxGridSize };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [inventory, grid, rackContents, maxGridSize]);

  // Reset game state
  const reset = useCallback(() => {
    setInventory(initialInventory);
    setGrid(null);
    setRackContents(null);
    setMaxGridSize(3);
    localStorage.removeItem(SAVE_KEY);
  }, []);

  return {
    inventory, setInventory,
    grid, setGrid,
    rackContents, setRackContents,
    maxGridSize, setMaxGridSize,
    save, reset
  };
} 