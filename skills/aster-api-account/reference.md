# Aster API Account – Reference

## Balance item

accountAlias, asset, balance, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime

## Account (top level)

feeTier, canTrade, canDeposit, canWithdraw, updateTime, totalInitialMargin, totalMaintMargin, totalWalletBalance, totalUnrealizedProfit, totalMarginBalance, totalPositionInitialMargin, totalOpenOrderInitialMargin, totalCrossWalletBalance, totalCrossUnPnl, availableBalance, maxWithdrawAmount, assets[], positions[]

## Account assets[] item

asset, walletBalance, unrealizedProfit, marginBalance, maintMargin, initialMargin, positionInitialMargin, openOrderInitialMargin, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime

## Account positions[] item

symbol, initialMargin, maintMargin, unrealizedProfit, positionInitialMargin, openOrderInitialMargin, leverage, isolated, entryPrice, maxNotional, positionSide, positionAmt, updateTime

## positionRisk item (one-way)

entryPrice, marginType, isAutoAddMargin, isolatedMargin, leverage, liquidationPrice, markPrice, maxNotionalValue, positionAmt, symbol, unRealizedProfit, positionSide (BOTH), updateTime

## positionRisk item (hedge)

Same fields; positionSide LONG or SHORT; positionAmt positive (long) or negative (short).

## incomeType

TRANSFER, WELCOME_BONUS, REALIZED_PNL, FUNDING_FEE, COMMISSION, INSURANCE_CLEAR, MARKET_MERCHANT_RETURN_REWARD

## Income item

symbol, incomeType, income, asset, info, time, tranId, tradeId

## Transfer response

tranId, status (e.g. SUCCESS)

## Notes

- clientTranId must be unique (e.g. within 7 days).
- Margin type cannot be changed if open orders or position exist (see error codes -4047, -4048).
