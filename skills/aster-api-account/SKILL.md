---
name: aster-api-account
description: Account and position endpoints for Aster Finance Futures API v3. Covers balance, account info, positions, leverage, margin type, isolated margin, and spot–futures transfer. Use when reading or updating futures balance, positions, leverage, margin type, or transferring between spot and futures. Requires signed requests; see aster-api-auth.
---

# Aster API Account

All endpoints require **signature**. See **aster-api-auth** skill for signing. Base URL: **https://fapi.asterdex.com**. Prefer **user data stream** for real-time balance and position updates (doc recommendation).

## Balance and account

- **GET /fapi/v3/balance** (Weight: 5). No params beyond auth. Returns array: asset, balance, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime.
- **GET /fapi/v3/account** (Weight: 5). Returns feeTier, canTrade, canDeposit, canWithdraw, totalWalletBalance, totalUnrealizedProfit, totalMarginBalance, availableBalance, maxWithdrawAmount, assets[], positions[] (all symbols).

## Positions

- **GET /fapi/v3/positionRisk** (Weight: 5). Params: symbol (optional). Returns per-symbol/positionSide: entryPrice, marginType, isAutoAddMargin, isolatedMargin, leverage, liquidationPrice, markPrice, maxNotionalValue, positionAmt, symbol, unRealizedProfit, positionSide (BOTH/LONG/SHORT), updateTime. One-way mode returns BOTH; hedge mode returns LONG and SHORT.

## Leverage and margin type

- **POST /fapi/v3/leverage** (Weight: 1): symbol, leverage (1–125). Returns leverage, maxNotionalValue, symbol.
- **POST /fapi/v3/marginType** (Weight: 1): symbol, marginType (ISOLATED | CROSSED). Fails if open orders or position exist when changing (see error codes).

## Isolated position margin

- **POST /fapi/v3/positionMargin** (Weight: 1): symbol, positionSide (optional; BOTH or LONG/SHORT in hedge), amount, type (1 = add, 2 = reduce). Only for isolated margin.
- **GET /fapi/v3/positionMargin/history** (Weight: 1): symbol, type (optional), startTime, endTime, limit (default 500).

## Transfer (futures ↔ spot)

- **POST /fapi/v3/asset/wallet/transfer** (Weight: 5): amount, asset, clientTranId (unique, e.g. UUID), kindType (FUTURE_SPOT | SPOT_FUTURE), timestamp. Returns tranId, status.

## Position and account mode

- **GET /fapi/v3/positionSide/dual** (Weight: 30): returns dualSidePosition (true = hedge, false = one-way).
- **POST /fapi/v3/positionSide/dual** (Weight: 1): dualSidePosition "true"|"false". Affects every symbol.
- **GET /fapi/v3/multiAssetsMargin** (Weight: 30): returns multiAssetsMargin.
- **POST /fapi/v3/multiAssetsMargin** (Weight: 1): multiAssetsMargin "true"|"false". Affects every symbol.

## Other

- **GET /fapi/v3/income** (Weight: 30): symbol, incomeType (optional), startTime, endTime, limit (default 100, max 1000). incomeType: TRANSFER, WELCOME_BONUS, REALIZED_PNL, FUNDING_FEE, COMMISSION, INSURANCE_CLEAR, MARKET_MERCHANT_RETURN_REWARD. Default 7-day window if no time range.
- **GET /fapi/v3/leverageBracket** (Weight: 1): symbol optional; notional brackets per symbol.
- **GET /fapi/v3/adlQuantile** (Weight: 5): symbol optional; ADL queue (0–4).
- **GET /fapi/v3/forceOrders** (Weight: 20/50): symbol, autoCloseType (LIQUIDATION | ADL), startTime, endTime, limit (default 50, max 100).
- **GET /fapi/v3/commissionRate** (Weight: 20): symbol required; makerCommissionRate, takerCommissionRate.

Response shapes and incomeType values: [reference.md](reference.md).
