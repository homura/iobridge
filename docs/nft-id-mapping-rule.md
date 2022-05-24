# NFT ID Mapping Rule

IOBridge uses [EIP721][eip721] as shadow NFT on Ethereum, the mapping rules of tokenID follow the following
rules

```
<proposal_type: uint8><mapped_token_id: uint248>
```

`mapped_token_id` is a mapping of tokenIDs on CKB with 31 bytes.

- when `mapped_token_id` <= 31 bytes, padding start with zeros
- when `mapped_token_id` > 31 bytes, TODO, but basically we can refer to the [Split ID Bits][split-id-bits] of EIP1155
  for encoding

## Rules

|                | Proposal type | Token ID(CKB)                                           | Token ID(Mapped on Ethereum)                                                                           |
| -------------- | ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [m-NFT][m-nft] | 0x01          | `<IssuerID: byte20><class_id: uint32><TokenID: uint32>` | `<proposal type(0x00): uint8><empty_byte: byte3><IssuerID: byte20><class_id: uint32><TokenID: uint32>` |

[m-nft]: https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434
[eip721]: https://eips.ethereum.org/EIPS/eip-721
[split-id-bits]: https://eips.ethereum.org/EIPS/eip-1155#split-id-bits
