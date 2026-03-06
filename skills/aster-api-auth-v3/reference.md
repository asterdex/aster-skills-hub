# Auth v3 – Python example

EIP-712: domain name "AsterSignTransaction", version "1", chainId 1666, verifyingContract "0x0000...0000"; type "Message", field "msg" = param string (key=value sorted, all string; include nonce, user, signer). Sign with API wallet key (eth_account), hex. Send signature in query or body; POST: application/x-www-form-urlencoded.

```python
typed_data = {"types": {"EIP712Domain": [{"name": "name", "type": "string"}, ...], "Message": [{"name": "msg", "type": "string"}]}, "primaryType": "Message", "domain": {"name": "AsterSignTransaction", "version": "1", "chainId": 1666, "verifyingContract": "0x0000000000000000000000000000000000000000"}, "message": {"msg": "$param_str"}}
# get_nonce: now_ms*1_000_000 + _i (monotonic per second)
# send_by_body: build param dict, add nonce/user/signer, set typed_data["message"]["msg"]=get_url(params), sign encode_structured_data(typed_data), params["signature"]=hex, requests.post(url, data=params)
# send_by_url: param_str + "&nonce=...&user=...&signer=...", sign param_str, POST url+"?"+param_str+"&signature="+hex
```

**Timing:** timestamp < serverTime+1000 and serverTime-timestamp ≤ recvWindow. GET /fapi/v3/time if skew.
