# Security Changelog

Security hardening applied to this fork based on a full security audit of `asterdex/aster-skills-hub`.

## Summary

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| SEC-01 | Treasury address whitelist (oracle attack prevention) | CRITICAL | Fixed |
| SEC-02 | Private key validation + memory cleanup + error sanitization | CRITICAL | Fixed |
| SEC-03 | User confirmation rules in SKILL.md | HIGH | Fixed |
| SEC-04 | Public RPC warning for production | HIGH | Fixed |
| SEC-05 | Single source of truth for treasury ABI | MEDIUM | Fixed |
| SEC-06 | Balance verification before deposit | MEDIUM | Fixed |
| SEC-07 | No private key in balance.mjs (read-only) | MEDIUM | Fixed |
| SEC-08 | chainId 1666 documentation in EIP-712 | MEDIUM | Fixed |
| SEC-09 | Explicit gas limit on transactions | LOW | Fixed |
| SEC-10 | Per-chain confirmation count (reorg protection) | LOW | Fixed |
| SEC-11 | Broker parameter documentation | LOW | Fixed |
| SEC-12 | .env.example + .gitignore hardening | LOW | Fixed |

## Details

### SEC-01 — Treasury address whitelist
**File:** `common.mjs`
Deposit addresses fetched from the API are now validated against a hardcoded `TREASURY_WHITELIST`. If the API returns an unexpected address (DNS hijack, BGP hijack), the transaction is aborted with a clear error. Operators must populate the whitelist with official Aster addresses before production use.

### SEC-02 — Private key security
**Files:** `common.mjs`, `deposit.mjs`
- Key format is strictly validated: must match `0x` + 64 hex characters.
- Key is deleted from `process.env` immediately after account derivation.
- All error output is sanitized to prevent accidental key leakage in logs.
- Exported `validatePrivateKey()` and `sanitizeError()` helpers.

### SEC-03 — User confirmation
**File:** `SKILL.md`
The empty `## User confirmation` section is now filled with mandatory rules: display summary, require explicit textual confirmation, never assume consent, never batch without individual confirmation.

### SEC-04 — RPC production warning
**File:** `common.mjs`
`getRpcUrl()` now emits a warning when falling back to public RPCs. Public RPCs have no SLA, no authentication, and can manipulate responses. Operators should set `ETH_RPC_URL`, `BSC_RPC_URL`, `ARBITRUM_RPC_URL` to private endpoints.

### SEC-05 — ABI single source of truth
**Files:** `common.mjs`, `aster-smart-contract-abi.ts`
`TREASURY_ABI` in `common.mjs` now imports from `aster-smart-contract-abi.ts` instead of duplicating the definition. Only one copy exists.

### SEC-06 — Balance check before deposit
**File:** `deposit.mjs`
Before submitting `approve()` + `deposit()`, the script now checks `balanceOf()` (ERC20) or `getBalance()` (native) and aborts with a clear error if insufficient.

### SEC-07 — No private key in balance.mjs
**File:** `balance.mjs`
The `privateKeyToAccount` import is removed. `balance.mjs` now requires `--address` or `ASTER_WALLET_ADDRESS` env. A read-only operation never needs a private key.

### SEC-08 — chainId 1666 documentation
**File:** `skills/aster-api-auth-v3/SKILL.md`
Added explicit note explaining that chainId `1666` in the EIP-712 domain is an off-chain AsterDex signing identifier, not the Harmony ONE chain. Prevents confusion with on-chain deposit chainIds.

### SEC-09 — Explicit gas limit
**Files:** `common.mjs`, `deposit.mjs`
All `writeContract()` calls now include `gas: MAX_GAS_LIMIT` (500,000). Prevents gas drain from anomalous contract behavior or estimation bugs.

### SEC-10 — Per-chain confirmations
**Files:** `common.mjs`, `deposit.mjs`
`waitForTransactionReceipt()` now uses chain-specific confirmation counts: ETH=2, BSC=3 (higher reorg risk), Arbitrum=2. Configurable via `REQUIRED_CONFIRMATIONS`.

### SEC-11 — Broker documentation
**Files:** `deposit.mjs`, `SKILL.md`
The `--broker` parameter is documented: default `1` = primary Aster broker. `--help` flag added to `deposit.mjs`. SKILL.md includes a dedicated section explaining broker IDs.

### SEC-12 — .env.example + .gitignore
**Files:** `.env.example` (new), `.gitignore`
- `.env.example` created with all env vars, placeholder values, and security recommendations (hardware wallets, secret managers).
- `.gitignore` updated to exclude `.env` and `.env.*` (except `.env.example`).
