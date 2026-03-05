---
name: aster-api-auth-v1
description: Builds HMAC SHA256 signed requests for Aster Finance Futures API (v1). Covers X-MBX-APIKEY, timestamp, recvWindow, and signature. Use when implementing TRADE, USER_DATA, or USER_STREAM calls against /fapi/v1/ (or v2/v4) endpoints.
---

# Aster API Authentication (v1)

## Base URL

- REST: **https://fapi.asterdex.com**

## Auth parameters

| Parameter   | Description              |
| ----------- | ------------------------- |
| X-MBX-APIKEY | API key (request header)  |
| timestamp   | Current time, milliseconds |
| recvWindow  | Optional; default 5000 ms. Request valid for this long after timestamp. |
| signature   | HMAC SHA256 of totalParams (hex) |

API keys and secret keys **are case sensitive**. For signed endpoints (TRADE, USER_DATA), send `timestamp` and `signature`; optionally `recvWindow`. Keep recvWindow ≤ 5000.

## Signature

1. **totalParams** = query string concatenated with request body (no `&` between them if both present). For GET: query string only. For POST/PUT/DELETE: query + body as sent (e.g. `application/x-www-form-urlencoded`).
2. **Sign:** HMAC SHA256 with **secretKey** as key, **totalParams** as value. Output **hex**.
3. **Send:** Add `signature` to query string or request body (signature must be the **last** parameter). Header: `X-MBX-APIKEY: <apiKey>`.
4. Signature is **not case sensitive**.

## Timing

Server accepts if: `timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow`. Use **GET /fapi/v1/time** for server time if clock skew is an issue.

## Security

- Never hardcode API key or secret. Use environment variables or config.
- API keys can be restricted to TRADE-only or exclude TRADE; by default they can access all secure routes.

## Full example

For query-string and request-body examples (openssl + curl), see [reference.md](reference.md).
