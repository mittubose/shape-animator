# Age of Crypto: Learn & Conquer

A strategy-simulation game where you build, mine, defend, and expand your own cryptocurrency empire—while learning the real-world mechanics and challenges of crypto!

---

## What is Age of Crypto?

**Age of Crypto** is not just a game—it's an interactive learning experience.
You’ll create your own cryptocurrency, mine coins, defend against hackers, and grow your empire, all while discovering the real principles behind blockchain, mining, security, and crypto economics.

---

## Core Gameplay & Learning Features

- **Create Your Own Coin:**
  - Set up your blockchain: choose consensus (Proof of Work, Proof of Stake, etc.)
  - Decide on supply, block time, and other real parameters.
  - Learn how these choices affect security, decentralization, and adoption.

- **Crypto Mining Mechanics:**
  - Start with basic mining rigs.
  - Upgrade hardware, optimize algorithms, and see how hash rates, difficulty, and energy use work.
  - Experience compounding mining rewards and diminishing returns.

- **Economics & Expansion:**
  - Use your coins to fund development, marketing, and infrastructure.
  - Learn about tokenomics, inflation, and market cap.
  - Attract users, exchanges, and investors.

- **Security & Hacker Attacks:**
  - Defend your network from real-world threats: DDoS, 51% attacks, phishing, and more.
  - Build firewalls, upgrade protocols, and educate your users.
  - Visualize attacks and defenses to understand vulnerabilities.

- **Scenarios & Goals:**
  - Each scenario teaches a different aspect:
    - Survive a bear market
    - Achieve eco-friendly mining
    - Outcompete rival coins
    - Handle regulatory changes
    - Survive a major hack

- **Mini-Goals & Quizzes:**
  - Complete challenges and answer in-game quizzes to reinforce learning.
  - Unlock achievements for mastering concepts (e.g., “Understands Proof of Stake”).

---

## Example Scenarios

1. **Genesis Block:**
   Launch your first coin, set parameters, and attract your first miners.

2. **Security Breach:**
   Defend against a simulated 51% attack and learn how consensus mechanisms protect the network.

3. **Market Mayhem:**
   Navigate price volatility, FUD, and pump-and-dump schemes.

4. **Green Revolution:**
   Transition your coin to a more energy-efficient protocol.

5. **Regulatory Gauntlet:**
   Adapt to new laws and keep your project compliant.

---

## How We Keep You Engaged

- **Visual, Interactive Learning:**
  See mining, attacks, and transactions in action.

- **Progression & Upgrades:**
  Unlock new tech, security, and economic tools as you learn.

- **Real-World Events:**
  Randomized news, hacks, and market events keep you adapting.

- **Quests & Achievements:**
  Mini-goals and quizzes reinforce concepts and reward mastery.

- **Scenario Editor:**
  Create and share your own learning scenarios.

---

## Getting Started

1. **Clone the Repo:**
   `git clone <repo-url>`

2. **Install Dependencies:**
   `npm install` (if using Node/JS)

3. **Run the Game:**
   `npm start` or open `index.html` in your browser

4. **Pick a Scenario or Start Free Play:**
   Learn by doing—every action is a lesson!

---

## Contributing

- Suggest new scenarios, mechanics, or educational content!
- Report bugs or submit pull requests.

---

## Why Play Age of Crypto?

- **Learn by Doing:**
  Every mechanic is grounded in real crypto principles.

- **Master the Details:**
  From mining math to security, you’ll get hands-on with the real stuff.

- **Fun & Challenging:**
  It’s a game, but you’ll walk away with real knowledge.

---

**Want more technical details, code samples, or a breakdown of the learning modules? Just ask!** 

---

## 1. Game Expansion: Phases & Steps

### Phase 1: Core Simulation Engine
- Task: Blockchain & Coin Creation
- Task: Mining Simulation (basic)
- Task: Basic UI/UX (start, mine, see balance)
- Task: Save/Load Game State

### Phase 2: Economic Layer
- Task: Coin Economics (supply, inflation, market cap)
- Task: User/Investor Simulation
- Task: Upgrades & Shop System

### Phase 3: Security & Attacks
- Task: Hacker AI (basic attacks)
- Task: Defense Mechanisms (firewalls, upgrades)
- Task: Visual Attack/Defense Feedback

### Phase 4: Scenarios & Learning
- Task: Scenario System (load, win/lose conditions)
- Task: Mini-Goals & Quizzes
- Task: Achievement System

### Phase 5: Advanced Features
- Task: Real-World Events (random news, regulation)
- Task: Scenario Editor
- Task: Multiplayer/Leaderboard (optional)

---

## 2. Task File Structure

- Create a folder: `Implementation/`
- For each task, create a markdown file:  
  - `01-Blockchain-Creation.md`
  - `02-Mining-Simulation.md`
  - `03-Basic-UI.md`
  - ...etc.

Each file should have:
- **Task Name**
- **Description**
- **Acceptance Criteria**
- **Checklist/Subtasks**
- **Status** (To Do / In Progress / Done)
- **Notes/Links**

---

## 3. Task Implementation Checker

- Create a script or simple web page:  
  - Reads all `Implementation/Task-*.md` files
  - Parses the **Status** field
  - Displays a checklist/dashboard of all tasks and their completion state
  - Optionally, allow clicking to mark as done (if you want interactive)

---

## 4. Example Task File (`Implementation/01-Blockchain-Creation.md`)

```markdown
# Task: Blockchain & Coin Creation

**Description:**  
Implement the logic for creating a new blockchain and cryptocurrency, allowing the player to set parameters (consensus, supply, block time).

**Acceptance Criteria:**  
- Player can name their coin
- Player can choose consensus (PoW, PoS, etc.)
- Player can set supply and block time
- Coin parameters are saved in game state

**Checklist:**
- [ ] Coin naming UI
- [ ] Consensus selection UI
- [ ] Parameter input fields
- [ ] Save to game state

**Status:** To Do

**Notes:**  
See README.md “Create Your Own Coin” section.
```

---

## 5. Example Task Checker (Concept)

- Node.js script or simple HTML/JS page
- Reads all `Implementation/*.md`
- Looks for `**Status:**` and checklists
- Renders a dashboard like:

| Task Name                | Status      | Progress   |
|--------------------------|-------------|------------|
| Blockchain & Coin Creation | In Progress | 2/4        |
| Mining Simulation        | To Do       | 0/3        |
| ...                      | ...         | ...        |

---

**Let me know if you want code for the checker, or want me to generate the initial task markdown files!** 

---

### 1. Expand Game Creation Steps (Phases & Tasks)

#### Phase 1: Core Simulation Engine
- Blockchain & Coin Creation
- Mining Simulation (basic)
- Basic UI/UX (start, mine, see balance)
- Save/Load Game State

#### Phase 2: Economic Layer
- Coin Economics (supply, inflation, market cap)
- User/Investor Simulation
- Upgrades & Shop System

#### Phase 3: Security & Attacks
- Hacker AI (basic attacks)
- Defense Mechanisms (firewalls, upgrades)
- Visual Attack/Defense Feedback

#### Phase 4: Scenarios & Learning
- Scenario System (load, win/lose conditions)
- Mini-Goals & Quizzes
- Achievement System

#### Phase 5: Advanced Features
- Real-World Events (random news, regulation)
- Scenario Editor
- Multiplayer/Leaderboard (optional)

---

### 2. Implementation Plan

- Create `Implementation/` folder.
- For each task, create a markdown file (e.g., `01-Blockchain-Creation.md`) with:
  - Task Name
  - Description
  - Acceptance Criteria
  - Checklist/Subtasks
  - Status
  - Notes/Links

---

### 3. Task Implementation Checker

- Node.js script or simple HTML/JS page that:
  - Reads all `Implementation/*.md`
  - Parses the **Status** and checklists
  - Shows a dashboard of all tasks and their completion state

---

### 4. Install MVP Dependencies

Since you have a React app in `client/`, you need to initialize it with dependencies:

```sh
cd client
npm init -y
npm install react react-dom
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react webpack webpack-cli webpack-dev-server babel-loader
```

Or, if you want a quick start, use Create React App (recommended for MVP):

```sh
npx create-react-app .
```

This will set up everything for you.  
Then run:

```sh
npm start
```

---

**Next steps:**  
- Want me to generate the initial `Implementation/Task-*.md` files?  
- Want a script for the task checker?  
- Want a sample React component for the MVP?

Let me know which you want to do first! 

Here’s a plan for a simple Node.js script that will act as your task checker:

- It will scan the `Implementation/` folder for all `*.md` files.
- For each file, it will:
  - Parse the task name (from the first heading)
  - Parse the **Status** field (`To Do`, `In Progress`, `Done`)
  - Count checklist items and how many are checked
- It will print a table to the terminal showing:
  - Task Name | Status | Progress (e.g., 2/4)

**Let’s implement this as `task-checker.js` in your project root.**  
You’ll run it with:  
```sh
node task-checker.js
```

Ready? I’ll generate the script now. 

---

## Implementation Breakdown (Subtasks)

### Phase 1: Onboarding & Core Simulation
- [01a-Avatar-Selection.md](Implementation/01a-Avatar-Selection.md): Avatar selection modal at game start
- [01b-Initial-Mining-Area.md](Implementation/01b-Initial-Mining-Area.md): Render initial mining area with avatar and rig

### Phase 2: Mining & Devices
- [02a-Device-System.md](Implementation/02a-Device-System.md): Device shop, placement, upgrades, and mining animation
- [02b-Timeline-System.md](Implementation/02b-Timeline-System.md): Fast-forwarding time and timeline UI

### Phase 3: Economy & Exchange
- [03a-Exchange-UI.md](Implementation/03a-Exchange-UI.md): Exchange UI for trading and price simulation

### Phase 4: Expansion
- [04a-Land-Expansion.md](Implementation/04a-Land-Expansion.md): Land purchase and mining area expansion

### Phase 5: Progression
- [05a-Goal-System.md](Implementation/05a-Goal-System.md): Goal tracking, progress bars, and achievements 