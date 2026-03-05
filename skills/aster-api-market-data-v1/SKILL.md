---
name: aster-api-market-data-v1
description: Public REST market data endpoints for Aster Finance Futures API (v1). Covers ping, time, exchangeInfo, order book, trades, klines, tickers, mark price, and funding. Use when fetching market data from Aster Futures API via /fapi/v1/ without authentication (except historicalTrades which requires API key for MARKET_DATA).
---

# Aster API Market Data (v1)

## Base URL

- **https://fapi.asterdex.com**

All market data endpoints are **GET**; no signature required except **historicalTrades** (MARKET_DATA: requires API key). Parameters go in the **query string**.

## Endpoints

| Endpoint | Weight | Key parameters |
|----------|--------|----------------|
| `GET /fapi/v1/ping` | 1 | None |
| `GET /fapi/v1/time` | 1 | None → `{ "serverTime": ms }` |
| `GET /fapi/v1/exchangeInfo` | 1 | None → symbols, filters, rateLimits, assets |
| `GET /fapi/v1/depth` | 2–20 | symbol (required), limit (5,10,20,50,100,500,1000; default 500) |
| `GET /fapi/v1/trades` | 1 | symbol, limit (default 500, max 1000) |
| `GET /fapi/v1/historicalTrades` | 20 | symbol, limit, fromId. **MARKET_DATA:** requires API key |
| `GET /fapi/v1/aggTrades` | 20 | symbol, fromId, startTime, endTime, limit (max 1000); startTime–endTime &lt; 1h if both sent |
| `GET /fapi/v1/klines` | 1–10 | symbol, interval, startTime, endTime, limit (default 500, max 1500) |
| `GET /fapi/v1/indexPriceKlines` | 1–10 | pair, interval, startTime, endTime, limit |
| `GET /fapi/v1/markPriceKlines` | 1–10 | symbol, interval, startTime, endTime, limit |
| `GET /fapi/v1/premiumIndex` | 1 | symbol (optional) → markPrice, indexPrice, lastFundingRate, nextFundingTime |
| `GET /fapi/v1/fundingRate` | 1 | symbol, startTime, endTime, limit (default 100, max 1000) |
| `GET /fapi/v1/fundingInfo` | 1 | symbol (optional) → fundingIntervalHours, fundingFeeCap, fundingFeeFloor |
| `GET /fapi/v1/ticker/24hr` | 1 or 40 | symbol (optional; no symbol = 40 weight) |
| `GET /fapi/v1/ticker/price` | 1 or 2 | symbol (optional) |
| `GET /fapi/v1/ticker/bookTicker` | 1 or 2 | symbol (optional) |

## Depth weight by limit

- 5, 10, 20, 50 → 2
- 100 → 5
- 500 → 10
- 1000 → 20

## Kline weight by limit

- [1, 100) → 1; [100, 500) → 2; [500, 1000] → 5; &gt;1000 → 10

## Intervals (klines)

1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M

## Conventions

- **Symbols** in REST responses are **uppercase** (e.g. BTCUSDT). WebSocket stream names use **lowercase** (e.g. btcusdt).
- All timestamps in responses are **milliseconds**.

## Response shapes

For depth (bids/asks arrays), kline array format, ticker and exchangeInfo filters, see [reference.md](reference.md).
