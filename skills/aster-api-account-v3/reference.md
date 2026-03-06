# Account v3 – Response shapes

**Balance item:** accountAlias, asset, balance, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime

**Account:** feeTier, canTrade, canDeposit, canWithdraw, updateTime, totalInitialMargin, totalMaintMargin, totalWalletBalance, totalUnrealizedProfit, totalMarginBalance, totalPositionInitialMargin, totalOpenOrderInitialMargin, totalCrossWalletBalance, totalCrossUnPnl, availableBalance, maxWithdrawAmount, assets[], positions[]

**assets[]:** asset, walletBalance, unrealizedProfit, marginBalance, maintMargin, initialMargin, positionInitialMargin, openOrderInitialMargin, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, marginAvailable, updateTime

**positions[]:** symbol, initialMargin, maintMargin, unrealizedProfit, positionInitialMargin, openOrderInitialMargin, leverage, isolated, entryPrice, maxNotional, positionSide, positionAmt, updateTime

**positionRisk:** entryPrice, marginType, isAutoAddMargin, isolatedMargin, leverage, liquidationPrice, markPrice, maxNotionalValue, positionAmt, symbol, unRealizedProfit, positionSide (BOTH | LONG/SHORT), updateTime

**incomeType:** TRANSFER, WELCOME_BONUS, REALIZED_PNL, FUNDING_FEE, COMMISSION, INSURANCE_CLEAR, MARKET_MERCHANT_RETURN_REWARD | **Income:** symbol, incomeType, income, asset, info, time, tranId, tradeId | **Transfer:** tranId, status

**Notes:** clientTranId unique. Margin type change fails if open orders/position (-4047, -4048).
