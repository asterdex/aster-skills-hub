# Spot Trading v1 – Reference

**type:** LIMIT, MARKET, STOP, TAKE_PROFIT, STOP_MARKET, TAKE_PROFIT_MARKET | **timeInForce:** GTC, IOC, FOK, GTX | **status:** NEW, PARTIALLY_FILLED, FILLED, CANCELED, REJECTED, EXPIRED

**Order response fields:** orderId, clientOrderId, symbol, status, side, type, origType, timeInForce, price, avgPrice, origQty, executedQty, cumQty, cumQuote, stopPrice, time, updateTime. newOrderRespType FULL includes fills.

**Cancel/query:** single order shape. **openOrders/allOrders:** array. **allOpenOrders:** optional orderIdList (comma-separated) or origClientOrderIdList for batch cancel.
