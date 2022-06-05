# CKB to Ethereum

## CKB -> Ethereum State Transition

```mermaid
stateDiagram-v2
    [*] --> DepositConfirmed: deposit NFT to bridge lock
    state deposited <<fork>>
    DepositConfirmed --> deposited
    deposited --> BridgeFeeConfirmed: pay bridge fee
    deposited --> BridgeMessageSubmitted: personal_sign
    state ready_to_mint <<join>>
    BridgeFeeConfirmed --> ready_to_mint
    BridgeMessageSubmitted --> ready_to_mint
    ready_to_mint --> MintCommitted: mint NFT on Ethereum
    MintCommitted --> MintConfirmed: confirmed on Ethereum
    MintConfirmed --> [*]
```

## CKB <- Ethereum

TODO

## Terms

- Committed: transaction has committed on BlockChain, but not yet reached the confirmed height
- Confirmed: transaction has reached the confirmation height
