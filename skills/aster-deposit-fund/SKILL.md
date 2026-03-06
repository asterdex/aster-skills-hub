---
name: aster-deposit-fund
description: Deposit funds to Aster from a wallet; private key from env. Use when the user wants to deposit to Aster or fund an Aster account.
---

# Aster Deposit Fund

**Base URL:** `https://www.asterdex.com/bapi/futures/v1/public/future/`. Public endpoints; no auth.

## Env

| Var | Description |
|-----|--------------|
| `ASTER_DEPOSIT_PRIVATE_KEY` | Wallet private key (hex). Used to sign on-chain deposit txs. Derive address for display/safety only; never log or echo. |

## Supported chains

| Chain | chainId |
|-------|---------|
| ETH (Ethereum) | 1 |
| BSC | 56 |
| Arbitrum | 42161 |

## User confirmation



## Flow

1. **Supported assets** — GET `aster/withdraw/assets?chainIds=<chainId>&networks=EVM&accountType=perp`. Response `data[]`: name, contractAddress, decimals, isNative, chainId. Use to pick asset and token contract for ERC20.
2. **Deposit address** — GET `web3/ae/deposit-address?chainId=<chainId>`. Response `data` = deposit address (string). Same address for native and ERC20 on that chain.
3. **Always confirm with the user before executing a deposit.** Summarize chain, asset, amount (and broker if not default), and get explicit approval (e.g. "Proceed?", "Confirm deposit?") before running scripts or signing transactions. Do not assume consent from a prior message.
4. **On-chain send** — From wallet (key from env), sign with appropriate RPC for chain:
   - **Native:** Send tx to deposit address with `value = amount` (wei).
   - **ERC20:** Approve deposit address for amount, then `transfer(depositAddress, amount)` from wallet.

RPC: user/agent supplies chain RPC URLs (e.g. env) or use public endpoints.

## Security

Private key only from env; never log, echo, or pass via CLI args.

## Scripts (viem)

Optional: `scripts/` — Bun + viem. Install: `cd skills/aster-deposit-fund/scripts && bun install`.

| Script | Purpose |
|--------|---------|
| `deposit.mjs` | Deposit: `ASTER_DEPOSIT_PRIVATE_KEY=0x... bun run deposit.mjs --chain <eth|bsc|arbitrum> --asset <SYMBOL> --amount <amount>` |
| `balance.mjs` | Wallet balances for deposit-supported assets: `bun run balance.mjs --chain <eth|bsc|arbitrum> [--address <0x...>]`. Address from env key if omitted. |

Optional env: `ETH_RPC_URL`, `BSC_RPC_URL`, `ARBITRUM_RPC_URL`.

Payload shapes and optional examples: [reference.md](reference.md).
