# Aster Skills Hub

OpenClaw skills for the **Aster Finance Futures API**.

## What this is

This repo is a collection of [AgentSkills](https://agentskills.io/)-compatible skills that teach an AI agent how to call the Aster Finance Futures API. Each skill includes a `SKILL.md` (instructions and frontmatter) and a `reference.md` (detailed API reference). They work with **OpenClaw** and any other agent that loads skills from this format.

Coverage includes:

- **Authentication** — EIP-712 signed requests, nonce, signature
- **Trading** — Place, cancel, and query orders
- **Market data** — Public REST endpoints (ping, time, depth, klines, tickers, funding, etc.)
- **WebSocket** — Market streams and user data stream
- **Account** — Balance, positions, transfers, income
- **Errors** — Error codes, rate limits, retry/backoff

## API base URLs

| Type     | URL                      |
|----------|--------------------------|
| REST     | `https://fapi.asterdex.com` |
| WebSocket| `wss://fstream.asterdex.com` |

## Skills

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
| **aster-deposit-fund** | Deposit funds to Aster from wallet; supported assets and deposit address via BAPI; private key from env; ETH, BSC, Arbitrum |

## Using with OpenClaw

OpenClaw loads skills from workspace folders, `~/.openclaw/skills`, or paths listed in config. To use this hub:

1. Install and set up OpenClaw (see [OpenClaw installation](#openclaw-installation) below).
2. Either copy/symlink this repo’s `skills/` into your OpenClaw workspace skills folder, or add this repo’s `skills` directory to `skills.load.extraDirs` in `~/.openclaw/openclaw.json`.
3. Start a new session so OpenClaw picks up the Aster skills.

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

Clone this repo and copy or symlink its `skills/` contents into your OpenClaw workspace skills folder (often `~/.openclaw/workspace/skills/`). Each skill should appear as its own folder, e.g. `~/.openclaw/workspace/skills/aster-api-auth-v3`, `~/.openclaw/workspace/skills/aster-api-trading-v3`, and so on.

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
