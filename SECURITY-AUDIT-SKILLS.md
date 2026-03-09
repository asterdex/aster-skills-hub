# Security Audit: Current Skills

**Date:** March 2026  
**Scope:** All skills in `skills/`, with focus on executable code and auth/secret handling.

---

## Executive summary

The repo is a **security-hardened fork** with 12 prior fixes (SEC-01–SEC-12). The only **executable code** is under `skills/aster-deposit-fund/scripts/` (Bun + viem). All other skills are **documentation only** (SKILL.md / reference.md) and do not run code.

**Overall:** Deposit scripts are well-hardened. A few **medium/low** improvements and doc fixes are recommended below.

---

## 1. Aster deposit fund (scripts)

### 1.1 What was audited

- `common.mjs` — config, BAPI helpers, key validation, error sanitization, RPC/whitelist
- `deposit.mjs` — deposit flow (native + ERC20), args, env, balance check, gas, confirmations
- `balance.mjs` — read-only balances (no private key)
- `aster-smart-contract-abi.ts` — treasury ABI (single source)
- `SKILL.md` — user confirmation rules, env, security section

### 1.2 Strengths (already in place)

| Control | Location | Notes |
|--------|----------|--------|
| Treasury whitelist (SEC-01) | `common.mjs` | Hardcoded deposit addresses; API response not trusted for send path when whitelist exists |
| Private key validation + cleanup (SEC-02) | `common.mjs`, `deposit.mjs` | 0x+64 hex, deleted from `process.env` after use |
| Error sanitization (SEC-02) | `common.mjs` | `sanitizeError()` redacts 64-char hex from log output |
| User confirmation (SEC-03) | `SKILL.md` | Mandatory summary + explicit confirmation before any deposit |
| Public RPC warning (SEC-04) | `common.mjs` | Warns when using default public RPCs |
| Single ABI source (SEC-05) | `aster-smart-contract-abi.ts` | No ABI duplication |
| Balance check (SEC-06) | `deposit.mjs` | Native/ERC20 balance checked before submit |
| No key in balance script (SEC-07) | `balance.mjs` | Address-only; no private key |
| Gas limit (SEC-09) | `common.mjs`, `deposit.mjs` | `MAX_GAS_LIMIT` on all writeContract calls |
| Confirmations (SEC-10) | `common.mjs`, `deposit.mjs` | Per-chain reorg protection |
| Broker docs (SEC-11) | `deposit.mjs`, `SKILL.md` | Default 1, documented |
| .gitignore / .env (SEC-12) | Repo root | `.env` and `.env.*` ignored |

### 1.3 Findings and recommendations

#### MEDIUM: Amount and broker validation in `deposit.mjs`

- **Amount:** `parseUnits(amount, decimalsForAmount)` is used without checking that the amount is positive. Viem’s `parseUnits` can accept negative input and return a negative `BigInt`. Passing a negative value into `approve`/`deposit` could lead to unexpected behavior or revert; it should be explicitly rejected.
- **Broker:** `--broker` is parsed as `BigInt(args[++i])` with no check for `broker < 1` (or `broker === 0n`). If the contract or backend treats broker `0` as invalid or special, the script could submit invalid data.

**Recommendation:**

- Reject non-positive amount: e.g. require parsed amount `> 0n` (and optionally reject `amount === "0"` or invalid numeric strings before calling `parseUnits`).
- Validate broker: e.g. require `broker >= 1n` (or per backend contract rules) and exit with a clear error otherwise.

#### LOW: SEC-01 when whitelist is missing for a chain

- When `TREASURY_WHITELIST[chainId]` is missing, `getDepositAddress()` still calls the API and returns the API response; it only logs a warning (unless `ASTER_TREASURY_WHITELIST_DISABLED=true`). So for a **new chainId** not in the whitelist, the script can send funds to an API-supplied address without hardcoded validation.

**Recommendation:**

- Either: require that for production use the address **must** be in the whitelist (e.g. in production, if not whitelisted, throw and abort instead of returning API address), or document clearly that adding a new chain requires updating `TREASURY_WHITELIST` before production use. SKILL.md already says “validated against a hardcoded whitelist”; making the code strict for “production” (e.g. when whitelist is not disabled) would align behavior with docs.

#### LOW: No HTTPS / URL validation in `fetchJson`

- `fetchJson(url)` is only used with `BAPI_BASE`-derived URLs (hardcoded base). So there is no current SSRF or mixed content from this function. If future code passes user-controlled or non-HTTPS URLs into `fetchJson`, that would be a risk.

**Recommendation:**

- Optional: add a small helper that only allows `https://` and optionally restrict to known host(s) (e.g. `asterdex.com`) if you ever allow configurable base URLs.

#### INFORMATIONAL: `common.mjs` reference to SECURITY-CHANGELOG

- Comment says “see SECURITY-CHANGELOG.md”. File lives at repo root; fine when running from root. If someone runs from `skills/aster-deposit-fund/scripts/`, the path is still repo root in typical setups. No change required unless you move the changelog.

---

## 2. API / auth skills (documentation only)

### 2.1 Scope

- Skills under `aster-api-*` and `aster-api-spot-*` (auth, account, trading, market-data, websocket, errors) are **markdown only**. They describe endpoints, signing (HMAC or EIP-712), and env vars. No code runs from these skills.

### 2.2 Consistency and doc security

- **Auth skills** (e.g. `aster-api-auth-v1`, `aster-api-spot-auth-v1`, `aster-api-auth-v3`, `aster-api-spot-auth-v3`) consistently say to use **env vars** for keys/secrets and to avoid hardcoding. Good.
- **Error skills** mention `-1022 INVALID_SIGNATURE` and point to checking key/signing; no secrets are embedded.
- **Deposit skill** clearly states: private key only from env; never log/echo/CLI; key removed after use; balance script does not use private key.

### 2.3 Documentation bug (SECURITY-CHANGELOG)

- **File:** `SECURITY-CHANGELOG.md`
- **Issue:** It references `aster-api-auth/SKILL.md` for SEC-08 (chainId 1666). There is no `aster-api-auth` skill directory; the actual skills are `aster-api-auth-v1` and `aster-api-auth-v3`.
- **Recommendation:** Update the reference to the correct skill(s), e.g. `aster-api-auth-v3/SKILL.md` (where EIP-712 and chainId 1666 are documented).

---

## 3. Environment and repo hygiene

- **.gitignore:** `.env` and `.env.*` are ignored; `.env.example` is allowed. Matches SEC-12.
- **Secrets in repo:** No private keys or API secrets found in skills or scripts. Hardcoded values are limited to:
  - Public RPC URLs (with SEC-04 warning),
  - Treasury addresses in whitelist (SEC-01),
  - BAPI base URL.
- **.env.example:** Referenced from SKILL.md and SECURITY.md; recommended to keep it at repo root with placeholders and “do not commit .env” guidance (could not read content due to permissions; assume it follows SEC-12).

---

## 4. Summary table

| Area | Finding | Severity | Status / action |
|------|---------|----------|------------------|
| deposit.mjs | Validate amount > 0 and broker ≥ 1 (or per contract) | Medium | Recommended |
| common.mjs / getDepositAddress | Strict whitelist in production (abort if not whitelisted) | Low | Optional / doc |
| fetchJson | Optional URL scheme/host check for future use | Low | Optional |
| SECURITY-CHANGELOG.md | Fix path `aster-api-auth` → e.g. `aster-api-auth-v3` | Low | Recommended |

---

## 5. Conclusion

- **Executable code** is limited to `aster-deposit-fund/scripts/` and is already hardened (SEC-01–SEC-12).
- Remaining work: **validate amount and broker** in `deposit.mjs`, **fix SECURITY-CHANGELOG** skill path, and optionally tighten whitelist behavior and URL validation for future-proofing.
- **Documentation-only** API/auth skills do not introduce runtime security issues; they consistently direct users to env-based secrets and correct signing.
