# WebSocket v3 – Payloads

**aggTrade:** e, E, s, a, p, q, f, l, T, m (eventTime, symbol, aggregateTradeId, price, qty, first/lastTradeId, tradeTime, buyerIsMaker)

**depthUpdate:** e, E, T, s, U, u, pu, b, a. b/a: [[price,qty],...]; qty 0 = remove level.

**markPriceUpdate:** e, E, s, p, i, P, r, T (markPrice, indexPrice, estimatedSettlePrice, fundingRate, nextFundingTime)

**bookTicker:** u, E, T, s, b, B, a, A (bestBid/Ask price & qty)

**kline (event.k):** t, T, s, i, f, L, o/c/h/l, v, n, x, q, V, Q (openTime, closeTime, symbol, interval, ohlc, volume, trades, isKlineClosed, quoteVol, takerBuyBase/Quote)

**ACCOUNT_UPDATE:** a: { m: reasonType, B: [{ a, wb, cw, bc }], P: [{ s, pa, ep, cr, up, mt, iw, ps }] }. m: ORDER, FUNDING_FEE, DEPOSIT, WITHDRAW, MARGIN_TRANSFER, etc.

**ORDER_TRADE_UPDATE:** o: { s, c, S, o, f, q, p, ap, sp, x, X, i, l, z, L, N/n, T, t, ps, cp, AP, cr, rp }. x: NEW, CANCELED, TRADE, EXPIRED. X: NEW, PARTIALLY_FILLED, FILLED, CANCELED, EXPIRED, NEW_INSURANCE, NEW_ADL. c "autoclose-*" = liquidation; "adl_autoclose" = ADL.

**listenKeyExpired:** e, E. No more user events until new listenKey.

**MARGIN_CALL:** E, cw, p: [{ s, ps, pa, mt, iw, mp, up, mm }]

**ACCOUNT_CONFIG_UPDATE:** ac: { s, l } (leverage); ai: { j, f, d } (multiAssetsMargin, feeDeduction, dualSidePosition)
