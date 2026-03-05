---
name: aster-api-websocket
description: WebSocket market streams and user data stream for Aster Finance Futures API v3. Covers subscription model, stream names, listenKey lifecycle, and event payloads. Use when implementing real-time market data or user events (orders, balance, positions) on Aster Futures. listenKey endpoints require signature; see aster-api-auth.
---

# Aster API WebSocket

## Base URL

- **wss://fstream.asterdex.com**

**Raw stream:** `/ws/<streamName>`. **Combined:** `/stream?streams=name1/name2/...`. Combined events: `{"stream":"<name>","data":<payload>}`. All stream names use **lowercase** symbols (e.g. btcusdt).

## Connection limits

- Single connection valid **24 hours**; expect disconnect at 24h.
- Server sends **ping** every 5 min; must respond with **pong** within 15 min or disconnect.
- **10 incoming messages/second** limit; excess can disconnect; repeated disconnects can get IP banned.
- Max **200 streams** per connection.

## Market streams: subscribe / unsubscribe

Send JSON over the socket:

- **Subscribe:** `{"method":"SUBSCRIBE","params":["btcusdt@aggTrade","btcusdt@depth"],"id":1}` → response `{"result":null,"id":1}`.
- **Unsubscribe:** `{"method":"UNSUBSCRIBE","params":["btcusdt@depth"],"id":312}`.
- **List:** `{"method":"LIST_SUBSCRIPTIONS","id":3}` → `{"result":["btcusdt@aggTrade"],"id":3}`.

`id` is an unsigned integer.

## Stream names (market)

| Stream | Description |
|--------|-------------|
| `<symbol>@aggTrade` | Aggregate trades (100ms) |
| `<symbol>@depth` | Diff. book depth (250/500/100ms: `@depth@500ms`, `@depth@100ms`) |
| `<symbol>@depth5`, `@depth10`, `@depth20` | Partial book depth |
| `<symbol>@kline_<interval>` | Kline (e.g. 1m, 1h); interval as in REST |
| `<symbol>@markPrice`, `<symbol>@markPrice@1s` | Mark price (3s or 1s) |
| `!markPrice@arr`, `!markPrice@arr@1s` | All symbols mark price |
| `<symbol>@miniTicker` | 24h mini ticker (500ms) |
| `!miniTicker@arr` | All mini tickers (1000ms) |
| `<symbol>@ticker` | 24h ticker (500ms) |
| `!ticker@arr` | All tickers (1000ms) |
| `<symbol>@bookTicker` | Best bid/ask (real-time) |
| `!bookTicker` | All book tickers |
| `<symbol>@forceOrder` | Liquidation snapshot (1000ms) |
| `!forceOrder@arr` | All liquidations |

## User data stream

Requires **signed** REST calls (see **aster-api-auth**).

1. **Start:** `POST /fapi/v3/listenKey` (signed) → `{ "listenKey": "..." }`. If account already has active listenKey, same key returned and validity extended 60 min.
2. **Connect:** `wss://fstream.asterdex.com/ws/<listenKey>`.
3. **Keepalive:** `PUT /fapi/v3/listenKey` (signed) at least every **&lt;60 min** (e.g. every 30 min).
4. **Close:** `DELETE /fapi/v3/listenKey` (signed).

User data events are **not guaranteed in order** during heavy load; order updates by event time `E`.

**Events:** `ACCOUNT_UPDATE` (balance/position), `ORDER_TRADE_UPDATE`, `ACCOUNT_CONFIG_UPDATE` (leverage, multi-asset, position mode), `MARGIN_CALL`, `listenKeyExpired`.

## Order book sync (depth stream)

1. Connect to `btcusdt@depth` (or combined).
2. Buffer incoming events.
3. Get snapshot: `GET /fapi/v3/depth?symbol=BTCUSDT&limit=1000`.
4. Drop events with `u` &lt; snapshot `lastUpdateId`.
5. First valid event: `U` ≤ `lastUpdateId` and `u` ≥ `lastUpdateId`.
6. Then each event’s `pu` must equal previous event’s `u`; else re-sync from step 3.
7. Quantity in events is **absolute**; quantity 0 means remove that price level.

Payload shapes and examples: [reference.md](reference.md).
