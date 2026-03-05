---
name: aster-api-auth
description: Builds EIP-712 signed requests for Aster Finance Futures API v3. Covers nonce generation, signature payload construction, and authenticated request format. Use when implementing any Aster API call that requires signature (TRADE, USER_DATA, USER_STREAM, MARKET_DATA).
---

# Aster API Authentication

## Base URL

- REST: **https://fapi.asterdex.com**

## Auth parameters

| Parameter   | Description              |
| ----------- | ------------------------- |
| user        | Main account wallet address |
| signer      | API wallet address        |
| nonce       | Current timestamp, microseconds |
| signature   | EIP-712 signature (hex)   |

For signed endpoints also send `timestamp` (milliseconds) and optionally `recvWindow` (ms; default 5000). Keep recvWindow ≤ 5000.

## Nonce

- Must be **current system time in microseconds**.
- If nonce leads or lags system time by more than ~5 seconds, the request is invalid.
- Prefer monotonic within the same second to avoid collisions: e.g. `now_s * 1_000_000 + sequence`.

```python
def get_nonce():
    now_ms = int(time.time())
    # optionally: if now_ms == _last_ms: _i += 1 else: _last_ms, _i = now_ms, 0
    return now_ms * 1_000_000 + _i  # or use single time.time()*1e6
```

## Signing steps

1. **Build parameter string:** Convert API params to key=value, sort by key (ASCII). Treat all values as strings. Include `nonce`, `user`, `signer` in this string.
2. **EIP-712 typed data:**
   - Domain: `name`: "AsterSignTransaction", `version`: "1", `chainId`: 1666, `verifyingContract`: "0x0000000000000000000000000000000000000000"
   - Primary type: "Message", field "msg" (string) = the parameter string from step 1.
3. **Sign:** Encode typed data (e.g. `encode_structured_data`), sign with **API wallet private key** (ECDSA, e.g. eth_account). Output signature as hex.
4. **Send:** Add `signature` to query or body. POST/DELETE use body `application/x-www-form-urlencoded`.

## Security

- Never hardcode `user`, `signer`, or private key. Use environment variables or config.
- Use `GET /fapi/v3/time` for server time if clock skew is an issue.

## Full example

For complete Python example (typed_data dict, `get_nonce()`, `send_by_body()` / `send_by_url()`), see [reference.md](reference.md).
