# Spot Account v3 – Reference

**account:** balances array: asset, free, locked. **userTrades:** id, orderId, symbol, price, qty, quoteQty, commission, commissionAsset, time, isBuyer, etc.

**transfer:** kindType FUTURE_SPOT | SPOT_FUTURE. **withdraw/estimateFee:** chainId, asset. **user-withdraw:** signed; amount, asset, chainId, address, etc. **getNonce/createApiKey:** see api-docs for testnet registration flow.
