# Trading v3 – Reference

**type:** LIMIT, MARKET, STOP, STOP_MARKET, TAKE_PROFIT, TAKE_PROFIT_MARKET, TRAILING_STOP_MARKET | **timeInForce:** GTC, IOC, FOK, GTX | **positionSide:** BOTH, LONG, SHORT | **status:** NEW, PARTIALLY_FILLED, FILLED, CANCELED, REJECTED, EXPIRED

**Order response fields:** clientOrderId, cumQty, cumQuote, executedQty, orderId, avgPrice, origQty, price, reduceOnly, side, positionSide, status, stopPrice, closePosition, symbol, timeInForce, type, origType, activatePrice, priceRate, updateTime, workingType, priceProtect

**Batch:** array of order or `{ code, msg }`. **Cancel single:** order shape. **allOpenOrders:** `{ code: "200", msg }`. **batchOrders:** array of order or error. **Query/openOrder:** one order. **openOrders/allOrders:** array.

**Notes:** newOrderRespType=RESULT: MARKET→FILLED; LIMIT with special TIF→FILLED/EXPIRED. triggerProtect (exchangeInfo) when priceProtect=true.
