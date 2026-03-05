# Aster API WebSocket – Reference

## aggTrade payload

e: "aggTrade", E: eventTime, s: symbol, a: aggregateTradeId, p: price, q: quantity, f: firstTradeId, l: lastTradeId, T: tradeTime, m: buyerIsMaker

## depthUpdate payload (diff. depth)

e: "depthUpdate", E: eventTime, T: transactionTime, s: symbol, U: firstUpdateId, u: finalUpdateId, pu: previous finalUpdateId, b: [[price, qty], ...], a: [[price, qty], ...]. Quantity 0 = remove level.

## markPrice payload

e: "markPriceUpdate", E: eventTime, s: symbol, p: markPrice, i: indexPrice, P: estimatedSettlePrice, r: fundingRate, T: nextFundingTime

## bookTicker payload

e: "bookTicker", u: updateId, E: eventTime, T: transactionTime, s: symbol, b: bestBidPrice, B: bestBidQty, a: bestAskPrice, A: bestAskQty

## kline payload (event.k)

t: kline start, T: kline close, s: symbol, i: interval, f: firstTradeId, L: lastTradeId, o/c/h/l: open/close/high/low, v: volume, n: trades, x: isKlineClosed, q: quoteVolume, V: takerBuyBaseVolume, Q: takerBuyQuoteVolume

## User data: ACCOUNT_UPDATE

e: "ACCOUNT_UPDATE", E: eventTime, T: transactionTime, a: { m: reasonType, B: [{ a: asset, wb: walletBalance, cw: crossWalletBalance, bc: balanceChange }], P: [{ s: symbol, pa: positionAmt, ep: entryPrice, cr: accumulatedRealized, up: unrealizedPnl, mt: marginType, iw: isolatedWallet, ps: positionSide }] }. Reason m: ORDER, FUNDING_FEE, DEPOSIT, WITHDRAW, MARGIN_TRANSFER, MARGIN_TYPE_CHANGE, etc.

## User data: ORDER_TRADE_UPDATE

e: "ORDER_TRADE_UPDATE", E: eventTime, T: transactionTime, o: { s: symbol, c: clientOrderId, S: side, o: orderType, f: timeInForce, q: origQty, p: price, ap: avgPrice, sp: stopPrice, x: executionType, X: orderStatus, i: orderId, l: lastFilledQty, z: filledQty, L: lastPrice, N/n: commissionAsset/commission, T: tradeTime, t: tradeId, ps: positionSide, cp: closeAll, AP: activationPrice, cr: callbackRate, rp: realizedProfit, ... }. ExecutionType: NEW, CANCELED, TRADE, EXPIRED. OrderStatus: NEW, PARTIALLY_FILLED, FILLED, CANCELED, EXPIRED, NEW_INSURANCE, NEW_ADL. clientOrderId "autoclose-*" = liquidation; "adl_autoclose" = ADL.

## User data: listenKeyExpired

e: "listenKeyExpired", E: eventTime. After this, no more user events until new listenKey.

## User data: MARGIN_CALL

e: "MARGIN_CALL", E: eventTime, cw: crossWalletBalance, p: [{ s: symbol, ps: positionSide, pa: positionAmt, mt: marginType, iw: isolatedWallet, mp: markPrice, up: unrealizedPnl, mm: maintMarginRequired }]

## User data: ACCOUNT_CONFIG_UPDATE

Leverage: ac: { s: symbol, l: leverage }. Account config: ai: { j: multiAssetsMargin, f: feeDeduction, d: dualSidePosition }
