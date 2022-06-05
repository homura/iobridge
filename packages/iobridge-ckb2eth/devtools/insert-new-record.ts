import { knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { hexify } from '@ckb-lumos/codec/lib/bytes';
import crypto from 'crypto';
import { PostgreStore } from '../src/store';

async function main() {
  const knexInstance = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://iobridge:123456@localhost:5432/iobridge',
    ...knexSnakeCaseMappers(),
  });

  const store = new PostgreStore(knexInstance);

  await store.upsertCkbRecordsInABlock(
    1,
    [
      {
        bridgeMessage: { state: 'NotSubmitted' },
        bridgeFee: {
          state: 'Uncompleted',
          neededAmount: '40000000000',
          paidTxs: [],
          recipient: {
            hash_type: 'type',
            code_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            args: '0x0000000000000000000000000000000000000000',
          },
        },
        mint: { state: 'NotReady' },
        deposit: {
          state: 'Confirmed',
          depositTo: {
            hash_type: 'type',
            code_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            args: '0x0000000000000000000000000000000000000000',
          },
          blockNumber: 2,
          depositFrom: {
            hash_type: 'type',
            code_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            args: '0x0000000000000000000000000000000000000000',
          },
          nftId: hexify(crypto.randomBytes(28)),
          sequenceNumber: 1,
          txHash: hexify(crypto.randomBytes(32)),
          nftProposalType: 'mNFT',
          txIndexOfBlock: 0,
          outputIndexOfTx: 0,
        },
      },
    ],
    []
  );
}

main();
