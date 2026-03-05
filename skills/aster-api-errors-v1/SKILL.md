---
name: aster-api-errors-v1
description: Error codes, rate limits, and safe retry/backoff behavior for Aster Finance Futures API (v1 / HMAC-signed). Covers error payload format, REQUEST_WEIGHT and ORDERS limits, 429/418 handling, and timestamp/signature errors. Use when handling API errors, 429/418 responses, or implementing rate-aware clients for Aster Futures v1 endpoints.
---

# Aster API Errors (v1)

## Error payload

Every error response has the form:

```json
{ "code": -1121, "msg": "Invalid symbol." }
```

**Codes are stable** across the API; **messages may vary**. Handle by `code`, not by exact `msg`.

## Rate limits

- Limits come from **GET /fapi/v1/exchangeInfo** → `rateLimits` array.
- **REQUEST_WEIGHT:** e.g. 2400 per minute (per IP). Response header: `X-MBX-USED-WEIGHT-<intervalNum><intervalLetter>` (e.g. 1M).
- **ORDERS:** e.g. 1200 per minute **per account**. Response header: `X-MBX-ORDER-COUNT-<intervalNum><intervalLetter>`. Rejected/unsuccessful orders may not include this header.
- **HTTP 429:** Rate limit exceeded. **Back off**; do not retry immediately. Client must reduce request rate.
- **HTTP 418:** IP auto-banned after repeatedly hitting 429. Ban duration **scales** (2 minutes up to 3 days). Limits are **per IP**, not per API key.
- Prefer **WebSocket** for live data to reduce REST load and avoid bans.

## Security-related errors

- **-1021 INVALID_TIMESTAMP:** Timestamp outside `recvWindow` or &gt;1s ahead of server. Use **GET /fapi/v1/time** for server time if needed; keep `recvWindow` small (e.g. ≤5000 ms).
- **-1022 INVALID_SIGNATURE:** Signature invalid. Check HMAC SHA256 steps and secret key.

## Error categories

| Range | Category | Examples |
|-------|----------|----------|
| 10xx | Server/network | -1000 UNKNOWN, -1001 DISCONNECTED, -1003 TOO_MANY_REQUESTS, -1007 TIMEOUT, -1015 TOO_MANY_ORDERS, -1021 INVALID_TIMESTAMP, -1022 INVALID_SIGNATURE |
| 11xx | Request/params | -1102 MANDATORY_PARAM_EMPTY_OR_MALFORMED, -1121 BAD_SYMBOL, -1130 INVALID_PARAMETER |
| 20xx | Processing | -2010 NEW_ORDER_REJECTED, -2011 CANCEL_REJECTED, -2013 NO_SUCH_ORDER, -2018 BALANCE_NOT_SUFFICIENT, -2019 MARGIN_NOT_SUFFICIENT, -2021 ORDER_WOULD_IMMEDIATELY_TRIGGER, -2025 MAX_OPEN_ORDER_EXCEEDED |
| 40xx | Filters/validation | -4004 QTY_LESS_THAN_MIN_QTY, -4014 PRICE_NOT_INCREASED_BY_TICK_SIZE, -4023 QTY_NOT_INCREASED_BY_STEP_SIZE, -4047 THERE_EXISTS_OPEN_ORDERS, -4048 THERE_EXISTS_QUANTITY, -4164 MIN_NOTIONAL |

## HTTP status

- **4XX:** Client-side (malformed request, 403 WAF, 429 rate limit, 418 banned).
- **5XX:** Server-side. **503:** Request may have been processed; execution status UNKNOWN—do not treat as definite failure.

Full code list: [reference.md](reference.md).
