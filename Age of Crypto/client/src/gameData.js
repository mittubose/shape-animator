export const DEVICES = {
  usb: { name: 'USB Miner', icon: '🔌', price: 20, size: 1, power: 1, upgradable: false, specs: 'Very low power, 1 slot' },
  laptop: { name: 'Old Laptop', icon: '💻', price: 60, size: 1, power: 2, upgradable: false, specs: 'Low power, 1 slot' },
  pi: { name: 'Raspberry Pi', icon: '🍓', price: 40, size: 1, power: 1.5, upgradable: false, specs: 'Low power, 1 slot' },
  gpu: { name: 'Entry GPU Rig', icon: '🎮', price: 150, size: 1, power: 5, upgradable: true, specs: 'Medium power, 1 slot, upgradable' },
  rig: { name: 'High Power Mining Rig', icon: '🖥️', price: 400, size: 2, power: 12, upgradable: true, specs: 'High power, 2 slots, upgradable' },
  rack: { name: 'Server Rack', icon: '🗄️', price: 1200, size: 4, power: 30, upgradable: true, specs: 'Very high power, 4 slots, hosts upgrades/devices' },
  asic: { name: 'ASIC Miner', icon: '⚙️', price: 2500, size: 2, power: 50, upgradable: true, specs: 'Extreme power, 2 slots, upgradable' },
  solar: { name: 'Solar Panel', icon: '☀️', price: 800, size: 1, power: 0, upgradable: false, specs: 'Reduces energy costs, 1 slot' },
  broken: { name: 'Broken Device', icon: '❌', price: 0, size: 1, power: 0, upgradable: false, specs: 'Needs repair before use' },
};

export const UPGRADES = {
  ram: { name: 'RAM', icon: '🧠', price: 30, effect: 0.1, limit: 2, specs: '+10% power (upgradable devices)' },
  'gpu-upg': { name: 'GPU', icon: '🎮', price: 80, effect: 0.25, limit: 1, specs: '+25% power (upgradable devices)' },
  psu: { name: 'Power Supply', icon: '🔌', price: 50, effect: 0, limit: 1, specs: 'Required for max upgrades' },
  cooling: { name: 'Cooling System', icon: '❄️', price: 200, effect: 0.15, limit: 1, specs: '+15% power, reduces failure chance' },
};

export const UPGRADE_LIMITS = { ram: 2, 'gpu-upg': 1, psu: 1, cooling: 1 }; 