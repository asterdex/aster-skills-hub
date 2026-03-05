---
name: aster-api-trading
description: Order placement, cancellation, and order queries for Aster Finance Futures API v3. Covers new order, batch orders, cancel, and order lookup. Use when placing or canceling orders, batching orders, or querying open or historical orders on Aster Futures. Requires signed requests; see aster-api-auth.
---

# Aster API Trading

All endpoints require **signature** (TRADE or USER_DATA). See **aster-api-auth** skill for signing. Base URL: **https://fapi.asterdex.com**. POST/DELETE: body **application/x-www-form-urlencoded**.

## New order

**POST /fapi/v3/order** (Weight: 1)

| Parameter | Mandatory | Notes |
|-----------|-----------|--------|
| symbol | YES | |
| side | YES | BUY, SELL |
| type | YES | See type-specific params below |
| positionSide | NO | BOTH (one-way) or LONG/SHORT (hedge); required in Hedge Mode |
| timeInForce | NO | GTC, IOC, FOK, GTX |
| quantity | NO | Not with closePosition=true |
| reduceOnly | NO | "true"/"false"; not with closePosition; not in Hedge Mode |
| price | NO | |
| newClientOrderId | NO | Unique, rule: `^[\.A-Z\:/a-z0-9_-]{1,36}$` |
| stopPrice | NO | For STOP/STOP_MARKET, TAKE_PROFIT/TAKE_PROFIT_MARKET |
| closePosition | NO | "true"/"false"; only with STOP_MARKET/TAKE_PROFIT_MARKET; cannot send quantity or reduceOnly |
| activationPrice | NO | TRAILING_STOP_MARKET; default latest price |
| callbackRate | NO | TRAILING_STOP_MARKET; min 0.1, max 5 (1 = 1%) |
| workingType | NO | MARK_PRICE, CONTRACT_PRICE (default) |
| priceProtect | NO | "TRUE"/"FALSE"; for conditional orders |
| newOrderRespType | NO | ACK (default), RESULT |

**Type-specific mandatory parameters:**

| type | Additional required |
|------|---------------------|
| LIMIT | timeInForce, quantity, price |
| MARKET | quantity |
| STOP, TAKE_PROFIT | quantity, price, stopPrice |
| STOP_MARKET, TAKE_PROFIT_MARKET | stopPrice |
| TRAILING_STOP_MARKET | callbackRate |

Condition order trigger rules (workingType = MARK_PRICE or CONTRACT_PRICE):

- **STOP / STOP_MARKET:** BUY → trigger when latest price >= stopPrice; SELL → latest price <= stopPrice.
- **TAKE_PROFIT / TAKE_PROFIT_MARKET:** BUY → latest price <= stopPrice; SELL → latest price >= stopPrice.
- **TRAILING_STOP_MARKET:** BUY → lowest price after place <= activationPrice, and latest price >= lowest * (1 + callbackRate); SELL → highest >= activationPrice, and latest <= highest * (1 - callbackRate). activationPrice: BUY must be &lt; latest price; SELL must be &gt; latest (else -2021).

closePosition=true: closes all long (SELL) or all short (BUY); no quantity/reduceOnly; in Hedge Mode cannot use BUY for LONG or SELL for SHORT.

## Batch orders

**POST /fapi/v3/batchOrders** (Weight: 5). Body: `batchOrders` = array of order params (max 5). Same parameter rules as new order. Processed concurrently; order of responses matches request order.

## Cancel

- **DELETE /fapi/v3/order** (Weight: 1): symbol + (orderId or origClientOrderId).
- **DELETE /fapi/v3/allOpenOrders** (Weight: 1): symbol.
- **DELETE /fapi/v3/batchOrders** (Weight: 1): symbol + orderIdList (array, max 10) or origClientOrderIdList (max 10).

## Query

- **GET /fapi/v3/order** (Weight: 1): symbol + (orderId or origClientOrderId).
- **GET /fapi/v3/openOrder** (Weight: 1): symbol + (orderId or origClientOrderId).
- **GET /fapi/v3/openOrders** (Weight: 1 or 40): symbol optional; no symbol returns all symbols (40).
- **GET /fapi/v3/allOrders** (Weight: 5): symbol required; orderId, startTime, endTime, limit (default 500, max 1000). Query window &lt; 7 days. If orderId set, returns orders >= that orderId.

Orders that are CANCELED/EXPIRED with no fills and older than 7 days may not be found.

Full parameter tables and response fields: [reference.md](reference.md).
