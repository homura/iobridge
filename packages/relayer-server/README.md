# IO Bridge Relayer Server

All-in-one service for relaying CKB NFTs to Ethereum networks.

## Quick Start

```sh
yarn run start:dev
```

```
curl --location --request POST 'localhost:3030/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "getDepositLock",
    "params": [
    ]
}'
```