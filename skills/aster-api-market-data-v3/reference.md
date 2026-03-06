# Market Data v3 – Response shapes

**Depth:** lastUpdateId, E, T, bids/asks: [[price, qty]]

**Kline:** [ openTime, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBase, takerBuyQuote, ignore ]

**Ticker 24hr:** symbol, priceChange, priceChangePercent, weightedAvgPrice, prevClosePrice, lastPrice, lastQty, openPrice, highPrice, lowPrice, volume, quoteVolume, openTime, closeTime, firstId, lastId, count

**Ticker price:** symbol, price, time | **bookTicker:** symbol, bidPrice, bidQty, askPrice, askQty, time

**exchangeInfo filters** (symbols[].filters; use for validation, not pricePrecision/quantityPrecision): PRICE_FILTER minPrice,maxPrice,tickSize | LOT_SIZE minQty,maxQty,stepSize | MARKET_LOT_SIZE idem | MAX_NUM_ORDERS limit | MAX_NUM_ALGO_ORDERS limit | PERCENT_PRICE multiplierUp,multiplierDown | MIN_NOTIONAL notional

**premiumIndex:** symbol, markPrice, indexPrice, estimatedSettlePrice, lastFundingRate, nextFundingTime, interestRate, time
