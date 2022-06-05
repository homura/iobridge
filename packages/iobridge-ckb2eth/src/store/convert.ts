import { Ckb2EthRecord } from '../types/record';
import { Ckb2ethEntity } from './generated/DatabaseModel';
import { bytify, hexify } from '@ckb-lumos/codec/lib/bytes';
import { BI } from '@ckb-lumos/bi';
import { createObjectCodec } from '@ckb-lumos/codec';
import { HashType } from '@ckb-lumos/base';
import { Uint8 } from '@ckb-lumos/codec/lib/number';
import { asserts } from '@iobridge/commons/lib/asserts';

export const ScriptCodec = createObjectCodec({
  code_hash: { pack: bytify, unpack: hexify },
  args: { pack: bytify, unpack: hexify },
  hash_type: {
    pack: (hashType: HashType): Uint8Array => {
      if (hashType === 'data') return Uint8.pack(0);
      if (hashType === 'type') return Uint8.pack(1);
      if (hashType === 'data1') return Uint8.pack(2);

      throw new Error(`Unknown hash_type ${hashType}`);
    },
    unpack(bin: Uint8Array): HashType {
      const unpacked = Uint8.unpack(bin);

      if (unpacked === 0) return 'data';
      if (unpacked === 1) return 'type';
      if (unpacked === 2) return 'data1';

      throw new Error(`Unknown hash_type ${unpacked}`);
    },
  },
});

export function ckb2ethRecordToEntity(record: Ckb2EthRecord): Ckb2ethEntity {
  const { deposit, bridgeFee, bridgeMessage, mint } = record;

  const {
    hash_type: depositToHashType,
    code_hash: depositToCodeHash,
    args: depositToArgs,
  } = ScriptCodec.pack(deposit.depositTo);

  const {
    code_hash: depositFromCodeHash,
    hash_type: depositFromHashType,
    args: depositFromArgs,
  } = ScriptCodec.pack(deposit.depositFrom);

  const {
    code_hash: bridgeFeeRecipientCodeHash,
    hash_type: bridgeFeeRecipientHashType,
    args: bridgeFeeRecipientArgs,
  } = ScriptCodec.pack(bridgeFee.recipient);

  const depositEntity = {
    depositState: deposit.state,
    depositNftId: bytify(deposit.nftId),

    // TODO replace it when other NFT proposal is supported
    depositNftProposalType: 1,

    depositBlockNumber: record.deposit.blockNumber,
    depositSequenceNumber: record.deposit.sequenceNumber,

    depositToCodeHash: depositToCodeHash,
    depositToHashType: depositToHashType,
    depositToArgs: depositToArgs,

    depositTxIndexOfBlock: deposit.txIndexOfBlock,
    depositOutputIndexOfTx: deposit.outputIndexOfTx,
    depositTxHash: bytify(deposit.txHash),

    depositFromCodeHash: depositFromCodeHash,
    depositFromHashType: depositFromHashType,
    depositFromArgs: depositFromArgs,
  };

  return {
    ...depositEntity,

    bridgeFeeNeededAmount: BI.from(bridgeFee.neededAmount).toString(),
    bridgeFeeRecipientArgs: bridgeFeeRecipientArgs,
    bridgeFeeRecipientCodeHash: bridgeFeeRecipientCodeHash,
    bridgeFeeRecipientHashType: bridgeFeeRecipientHashType,

    bridgeMessageState: bridgeMessage.state,
    ...(() => {
      if (bridgeMessage.state === 'Submitted') {
        asserts(bridgeMessage.signature != null);

        return {
          bridgeMessageSignature: bytify(bridgeMessage.signature),
          bridgeMessageMintNftRecipient: bytify(bridgeMessage.mintNftRecipient),
        };
      }

      return {};
    })(),

    bridgeFeeState: bridgeFee.state,
    ...(() => {
      // TODO convert bridge fee state
      return {};
    })(),

    mintState: mint.state,
    ...(() => {
      // TODO convert mint state
      return {};
    })(),
  };
}
