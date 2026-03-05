# Aster API Auth – Reference

## Official POST /fapi/v3/order Python example

Uses `eth_account.messages.encode_structured_data` and `Account.sign_message`. Configure `user`, `signer`, and `private_key` from env or config (never hardcode).

```python
import time
import requests
from eth_account.messages import encode_structured_data
from eth_account import Account

typed_data = {
  "types": {
    "EIP712Domain": [
      {"name": "name", "type": "string"},
      {"name": "version", "type": "string"},
      {"name": "chainId", "type": "uint256"},
      {"name": "verifyingContract", "type": "address"}
    ],
    "Message": [
      { "name": "msg", "type": "string" }
    ]
  },
  "primaryType": "Message",
  "domain": {
    "name": "AsterSignTransaction",
    "version": "1",
    "chainId": 1666,
    "verifyingContract": "0x0000000000000000000000000000000000000000"
  },
  "message": {
    "msg": "$msg"
  }
}

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'PythonApp/1.0'
}
order_url = 'https://fapi.asterdex.com/fapi/v3/order'

def get_url(my_dict) -> str:
    return '&'.join(f'{key}={str(value)}' for key, value in my_dict.items())

_last_ms = 0
_i = 0

def get_nonce():
    global _last_ms, _i
    now_ms = int(time.time())
    if now_ms == _last_ms:
        _i += 1
    else:
        _last_ms = now_ms
        _i = 0
    return now_ms * 1_000_000 + _i

def send_by_body():
    my_dict = {"symbol": "ASTERUSDT", "type": "LIMIT", "side": "BUY",
               "timeInForce": "GTC", "quantity": "10", "price": "0.6"}
    my_dict['nonce'] = str(get_nonce())
    my_dict['user'] = user
    my_dict['signer'] = signer
    content = get_url(my_dict)
    typed_data['message']['msg'] = content
    message = encode_structured_data(typed_data)
    signed = Account.sign_message(message, private_key=private_key)
    my_dict['signature'] = signed.signature.hex()
    res = requests.post(order_url, data=my_dict, headers=headers)
    return res.text

def send_by_url():
    param = 'symbol=ASTERUSDT&side=BUY&type=LIMIT&quantity=10&price=0.6&timeInForce=GTC'
    param += '&nonce=' + str(get_nonce()) + '&user=' + user + '&signer=' + signer
    typed_data['message']['msg'] = param
    message = encode_structured_data(typed_data)
    signed = Account.sign_message(message, private_key=private_key)
    url = order_url + '?' + param + '&signature=' + signed.signature.hex()
    res = requests.post(url, headers=headers)
    return res.text
```

## Timing

Server logic: `timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow` → process; else reject. Use small recvWindow (e.g. 5000 ms).
