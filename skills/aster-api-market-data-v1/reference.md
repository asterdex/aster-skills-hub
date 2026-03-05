# Aster API Market Data v1 – Reference

## Depth response

```javascript
{
  "lastUpdateId": 1027024,
  "E": 1589436922972,
  "T": 1589436922959,
  "bids": [ ["4.00000000", "431.00000000"] ],  // [PRICE, QTY]
  "asks": [ ["4.00000200", "12.00000000"] ]
}
```

## Kline array (single candle)

`[ openTime, open, high, low, close, volume, closeTime, quoteVolume, trades, takerBuyBase, takerBuyQuote, ignore ]`

## Ticker 24hr

Fields: symbol, priceChange, priceChangePercent, weightedAvgPrice, prevClosePrice, lastPrice, lastQty, openPrice, highPrice, lowPrice, volume, quoteVolume, openTime, closeTime, firstId, lastId, count.

## Ticker price

`{ "symbol": "BTCUSDT", "price": "6000.01", "time": ms }`

## Ticker bookTicker

`{ "symbol", "bidPrice", "bidQty", "askPrice", "askQty", "time" }`

## exchangeInfo – symbol filters

Use filters from `symbols[].filters` for validation; do not use `pricePrecision`/`quantityPrecision` as tick/step.

- **PRICE_FILTER:** minPrice, maxPrice, tickSize (price/stopPrice rules)
- **LOT_SIZE:** minQty, maxQty, stepSize (quantity)
- **MARKET_LOT_SIZE:** minQty, maxQty, stepSize (MARKET order quantity)
- **MAX_NUM_ORDERS:** limit
- **MAX_NUM_ALGO_ORDERS:** limit (STOP, STOP_MARKET, TAKE_PROFIT, TAKE_PROFIT_MARKET, TRAILING_STOP_MARKET)
- **PERCENT_PRICE:** multiplierUp, multiplierDown (vs mark price)
- **MIN_NOTIONAL:** notional (min price×quantity)

## premiumIndex (single symbol)

`{ symbol, markPrice, indexPrice, estimatedSettlePrice, lastFundingRate, nextFundingTime, interestRate, time }`
