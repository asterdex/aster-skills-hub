---
name: aster-api-auth
description: EIP-712 signed requests for Aster Futures API v3. Nonce, signature payload, request format. Use when calling TRADE, USER_DATA, USER_STREAM, or MARKET_DATA.
---

# Aster API Authentication

**Base:** https://fapi.asterdex.com. Signed: send timestamp (ms), signature; optional recvWindow (default 5000, ≤5000).

| Param | Description |
|-------|--------------|
| user | Main account wallet |
| signer | API wallet |
| nonce | Current time, microseconds |
| signature | EIP-712 (hex) |

**Nonce:** Current system time in µs; invalid if ±~5s. Prefer monotonic: `now_s * 1_000_000 + sequence`. Example: `return int(time.time()) * 1_000_000 + _i` (or `time.time()*1e6`).

**Signing:** (1) Param string: key=value, sort ASCII, all strings; include nonce, user, signer. (2) EIP-712: domain name "AsterSignTransaction", version "1", chainId 1666, verifyingContract "0x0000...0000"; type "Message", field "msg" = param string. (3) Encode typed data, sign with API wallet private key (ECDSA), hex. (4) Add signature to query or body; POST/DELETE: application/x-www-form-urlencoded. **Security:** Env vars for user, signer, key. GET /fapi/v3/time if clock skew.

[reference.md](reference.md) — full Python example.
