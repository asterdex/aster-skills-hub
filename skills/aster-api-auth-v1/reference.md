# Aster API Auth v1 – Reference

## Example: POST /fapi/v1/order (signature as query string)

Parameters: symbol=BTCUSDT, side=BUY, type=LIMIT, timeInForce=GTC, quantity=1, price=9000, recvWindow=5000, timestamp=1591702613943

**totalParams (for signature):**  
`symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=9000&timeInForce=GTC&recvWindow=5000&timestamp=1591702613943`

**HMAC SHA256 (shell):**
```shell
echo -n "symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=9000&timeInForce=GTC&recvWindow=5000&timestamp=1591702613943" | openssl dgst -sha256 -hmac "YOUR_SECRET_KEY"
# (stdin)= <hex_signature>
```

**curl:**
```shell
curl -H "X-MBX-APIKEY: YOUR_API_KEY" -X POST 'https://fapi.asterdex.com/fapi/v1/order?symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=9000&timeInForce=GTC&recvWindow=5000&timestamp=1591702613943&signature=<hex_signature>'
```

## Example: POST /fapi/v1/order (signature in body)

Same totalParams. Send body: same string + `&signature=<hex_signature>`.

**curl:**
```shell
curl -H "X-MBX-APIKEY: YOUR_API_KEY" -X POST 'https://fapi.asterdex.com/fapi/v1/order' \
  -d 'symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=9000&timeInForce=GTC&recvWindow=5000&timestamp=1591702613943&signature=<hex_signature>'
```

## Mixed query and body

If some params are in query and some in body, totalParams = query string concatenated with body string (no `&` between query and body). Example: query `symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC`, body `quantity=1&price=9000&recvWindow=5000&timestamp=1591702613943&signature=...`. Signature is computed over: `symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTCquantity=1&price=9000&...` (note no `&` between GTC and quantity).

## Timing

Server logic: process if `timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow`; else reject. Use small recvWindow (e.g. 5000 ms).
