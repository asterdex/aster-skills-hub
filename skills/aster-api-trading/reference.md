# Aster API Trading – Reference

## Order types (type)

LIMIT, MARKET, STOP, STOP_MARKET, TAKE_PROFIT, TAKE_PROFIT_MARKET, TRAILING_STOP_MARKET

## Time in force (timeInForce)

GTC, IOC, FOK, GTX (Post Only)

## Position side (positionSide)

BOTH (one-way), LONG, SHORT (hedge)

## Order status (status)

NEW, PARTIALLY_FILLED, FILLED, CANCELED, REJECTED, EXPIRED

## Order response (example)

clientOrderId, cumQty, cumQuote, executedQty, orderId, avgPrice, origQty, price, reduceOnly, side, positionSide, status, stopPrice, closePosition, symbol, timeInForce, type, origType, activatePrice (TRAILING_STOP_MARKET), priceRate (TRAILING_STOP_MARKET), updateTime, workingType, priceProtect

## Batch order response

Array of order objects or error objects: `{ "code": -2022, "msg": "ReduceOnly Order is rejected." }`

## Cancel response

Single order: same shape as order. allOpenOrders: `{ "code": "200", "msg": "The operation of cancel all open order is done." }`. batchOrders: array of order or error objects.

## Query order / openOrder

One order object. openOrders / allOrders: array of order objects.

## Notes

- newOrderRespType=RESULT: MARKET returns final FILLED; LIMIT with special timeInForce can return FILLED or EXPIRED directly.
- triggerProtect (from exchangeInfo) applies when priceProtect=true for conditional orders.
