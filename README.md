# Aster Skills Hub

OpenClaw skills for the **Aster Finance Futures API** and **Spot API (testnet)**.

## What this is

This repo is a collection of [AgentSkills](https://agentskills.io/)-compatible skills that teach an AI agent how to call the Aster Finance **Futures** and **Spot (testnet)** APIs. Each skill includes a `SKILL.md` (instructions and frontmatter) and a `reference.md` (detailed API reference). They work with **OpenClaw** and any other agent that loads skills from this format.

Coverage includes:

- **Authentication** — EIP-712 signed requests, nonce, signature (Futures and Spot)
- **Trading** — Place, cancel, and query orders (Futures and Spot)
- **Market data** — Public REST endpoints (ping, time, depth, klines, tickers, funding, etc.)
- **WebSocket** — Market streams and user data stream
- **Account** — Balance, positions, transfers, income
- **Errors** — Error codes, rate limits, retry/backoff
- **Deposit** — Deposit funds to Aster from wallet (BAPI, supported assets, env key)

## API base URLs

| API     | Type      | URL                              |
|---------|-----------|-----------------------------------|
| Futures | REST      | `https://fapi.asterdex.com`       |
| Futures | WebSocket | `wss://fstream.asterdex.com`      |
| Spot (testnet) | REST      | `https://sapi.asterdex-testnet.com` |
| Spot (testnet) | WebSocket | `wss://sstream.asterdex-testnet.com` |

## Skills

### Futures API

| Skill | Purpose |
|-------|---------|
| **aster-api-auth-v3** | EIP-712 signed requests, nonce, signature payload |
| **aster-api-auth-v1** | Same for v1 API |
| **aster-api-trading-v3** | Orders: place, cancel, batch, query (open/history) |
| **aster-api-trading-v1** | Same for v1 API |
| **aster-api-market-data-v3** | Public REST: ping, time, exchangeInfo, depth, trades, klines, tickers, funding |
| **aster-api-market-data-v1** | Same for v1 API |
| **aster-api-websocket-v3** | WebSocket: market streams + user data stream, listenKey |
| **aster-api-websocket-v1** | Same for v1 API |
| **aster-api-account-v3** | Account, balance, positions, transfers, income |
| **aster-api-account-v1** | Same for v1 API |
| **aster-api-errors-v3** | Error codes, rate limits, 429/418 handling, retry/backoff |
| **aster-api-errors-v1** | Same for v1 API |

### Spot API (testnet)

| Skill | Purpose |
|-------|---------|
| **aster-api-spot-auth-v3** | EIP-712 signed requests for Spot testnet (/api/v3/) |
| **aster-api-spot-auth-v1** | Same for v1 |
| **aster-api-spot-trading-v3** | Spot orders: place, cancel, query (open/history) |
| **aster-api-spot-trading-v1** | Same for v1 |
| **aster-api-spot-market-data-v3** | Public REST: ping, time, exchangeInfo, depth, trades, klines, tickers |
| **aster-api-spot-market-data-v1** | Same for v1 |
| **aster-api-spot-websocket-v3** | WebSocket: market + user data streams, listenKey |
| **aster-api-spot-websocket-v1** | Same for v1 |
| **aster-api-spot-account-v3** | Spot account, balance |
| **aster-api-spot-account-v1** | Same for v1 |
| **aster-api-spot-errors-v3** | Error codes, rate limits, retry/backoff |
| **aster-api-spot-errors-v1** | Same for v1 |

### Other

| Skill | Purpose |
|-------|---------|
| **aster-deposit-fund** | Deposit funds to Aster from wallet; supported assets and deposit address via BAPI; private key from env; ETH, BSC, Arbitrum |

## Using with OpenClaw

OpenClaw loads skills from workspace folders, `~/.openclaw/skills`, or paths listed in config. To use this hub:

1. Install and set up OpenClaw (see [OpenClaw installation](#openclaw-installation) below).
2. Either copy/symlink this repo’s `skills/` into your OpenClaw workspace skills folder, or add this repo’s `skills` directory to `skills.load.extraDirs` in `~/.openclaw/openclaw.json`.
3. Start a new session so OpenClaw picks up the Aster skills.
4. Chinese users can also discover more skills through Skills宝: https://skilery.com

Details and install steps are in the [OpenClaw installation](#openclaw-installation) section.

---

## OpenClaw installation

This section walks through installing OpenClaw and then loading the Aster skills from this hub.

### Prerequisites

- **Node.js 22+** (check with `node --version`).
- 4 GB RAM minimum (8 GB recommended), 64-bit macOS, Linux, or WSL2 on Windows.

### Install

**macOS / Linux:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### First-time setup

Run the onboarding wizard (configures auth, gateway, and optional channels):

```bash
openclaw onboard --install-daemon
```

Then check that the gateway is running and open the UI:

```bash
openclaw gateway status
openclaw dashboard
```

You can also open the Control UI at **http://127.0.0.1:18789/**.

### Using this hub with OpenClaw

OpenClaw loads skills from, in order of precedence:

1. Workspace skills (e.g. `/skills` in the agent’s workspace)
2. `~/.openclaw/skills`
3. Paths in `skills.load.extraDirs` in `~/.openclaw/openclaw.json`

**Option A — Workspace skills**

Clone this repo and copy or symlink its `skills/` contents into your OpenClaw workspace skills folder (often `~/.openclaw/workspace/skills/`). Each skill should appear as its own folder, e.g. `~/.openclaw/workspace/skills/aster-api-auth-v3`, `~/.openclaw/workspace/skills/aster-api-spot-trading-v3`, and so on.

**Option B — Extra skill dirs**

Clone this repo to a fixed path (e.g. `~/aster-skills-hubs`). In `~/.openclaw/openclaw.json`, set `skills.load.extraDirs` to an array that includes the **absolute path** to this repo’s `skills` directory:

```json
{
  "skills": {
    "load": {
      "extraDirs": ["/path/to/aster-skills-hubs/skills"]
    }
  }
}
```

Restart the gateway or start a new session so OpenClaw reloads skills.

### Verification

After adding the Aster skills, start a new session and confirm they appear (e.g. in the Skills UI or in the agent’s available skills list).

### More information

- [OpenClaw Skills](https://docs.openclaw.ai/skills) — Skill locations, format, and config
- [OpenClaw Getting Started](https://docs.openclaw.ai/start/getting-started) — Full setup and next steps

---

Built with [Claude Code](https://claude.ai/claude-code)
