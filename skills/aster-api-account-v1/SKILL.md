---
name: aster-api-account-v1
description: Account and position endpoints for Aster Finance Futures API (v1 / HMAC-signed). Covers balance, account info, positions, leverage, margin type, isolated margin, and spot–futures transfer. Use when reading or updating futures balance, positions, leverage, margin type, or transferring between spot and futures via /fapi/v1/, /fapi/v2/, or /fapi/v4/. Requires signed requests; see aster-api-auth-v1.
---

# Aster API Account (v1)

All endpoints require **signature**. See **aster-api-auth-v1** skill for signing. Base URL: **https://fapi.asterdex.com**. Prefer **user data stream** for real-time balance and position updates (doc recommendation).

## Balance and account

- **GET /fapi/v2/balance** (Weight: 5). No params beyond auth. Returns array: accountAlias, asset, balance, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime.
- **GET /fapi/v4/account** (Weight: 5). Returns feeTier, canTrade, canDeposit, canWithdraw, updateTime, totalInitialMargin, totalMaintMargin, totalWalletBalance, totalUnrealizedProfit, totalMarginBalance, totalPositionInitialMargin, totalOpenOrderInitialMargin, totalCrossWalletBalance, totalCrossUnPnl, availableBalance, maxWithdrawAmount, assets[], positions[] (all symbols).

## Positions

- **GET /fapi/v2/positionRisk** (Weight: 5). Params: symbol (optional). Returns per-symbol/positionSide: entryPrice, marginType, isAutoAddMargin, isolatedMargin, leverage, liquidationPrice, markPrice, maxNotionalValue, positionAmt, symbol, unRealizedProfit, positionSide (BOTH/LONG/SHORT), updateTime. One-way mode returns BOTH; hedge mode returns LONG and SHORT.

## Leverage and margin type

- **POST /fapi/v1/leverage** (Weight: 1): symbol, leverage (1–125). Returns leverage, maxNotionalValue, symbol.
- **POST /fapi/v1/marginType** (Weight: 1): symbol, marginType (ISOLATED | CROSSED). Fails if open orders or position exist when changing (see error codes).

## Isolated position margin

- **POST /fapi/v1/positionMargin** (Weight: 1): symbol, positionSide (optional; BOTH or LONG/SHORT in hedge), amount, type (1 = add, 2 = reduce). Only for isolated margin.
- **GET /fapi/v1/positionMargin/history** (Weight: 1): symbol, type (optional), startTime, endTime, limit (default 500).

## Transfer (futures ↔ spot)

- **POST /fapi/v1/asset/wallet/transfer** (Weight: 5): amount, asset, clientTranId (required, unique e.g. within 7 days), kindType (FUTURE_SPOT | SPOT_FUTURE), timestamp. Returns tranId, status.

## Position and account mode

- **GET /fapi/v1/positionSide/dual** (Weight: 30): returns dualSidePosition (true = hedge, false = one-way).
- **POST /fapi/v1/positionSide/dual** (Weight: 1): dualSidePosition "true"|"false". Affects every symbol.
- **GET /fapi/v1/multiAssetsMargin** (Weight: 30): returns multiAssetsMargin.
- **POST /fapi/v1/multiAssetsMargin** (Weight: 1): multiAssetsMargin "true"|"false". Affects every symbol.

## Other

- **GET /fapi/v1/income** (Weight: 30): symbol, incomeType (optional), startTime, endTime, limit (default 100, max 1000). incomeType: TRANSFER, WELCOME_BONUS, REALIZED_PNL, FUNDING_FEE, COMMISSION, INSURANCE_CLEAR, MARKET_MERCHANT_RETURN_REWARD. Default 7-day window if no time range.
- **GET /fapi/v1/leverageBracket** (Weight: 1): symbol optional; notional brackets per symbol.
- **GET /fapi/v1/adlQuantile** (Weight: 5): symbol optional; ADL queue (0–4).
- **GET /fapi/v1/forceOrders** (Weight: 20/50): symbol, autoCloseType (LIQUIDATION | ADL), startTime, endTime, limit (default 50, max 100).
- **GET /fapi/v1/commissionRate** (Weight: 20): symbol required; makerCommissionRate, takerCommissionRate.
- **GET /fapi/v1/remainingOpenableNotionalValue** (Weight: 20): symbol, leverage required; returns remainingOpenableNotionalValue (USDT).

Response shapes and incomeType values: [reference.md](reference.md).
