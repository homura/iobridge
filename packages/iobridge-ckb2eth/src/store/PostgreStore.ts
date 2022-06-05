import { Ckb2EthStore } from '../types/store';
import { BridgeFee, Ckb2EthDeposited, Ckb2EthRecord } from '../types/record';
import { Knex } from 'knex';
import { Ckb2ethEntity } from './generated/DatabaseModel';
import { ckb2ethRecordToEntity } from './convert';
import { assertsState } from '../utils';
import { TABLE_CKB2ETH } from './constatns';

function unimplemented(): never {
  throw new Error('unimplemented');
}

export class PostgreStore implements Ckb2EthStore {
  readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  Ckb2Eth(): Knex.QueryBuilder<Ckb2ethEntity, Ckb2ethEntity[]> {
    return this.knex(TABLE_CKB2ETH);
  }

  submitBridgeMessage(txHash: string): Promise<void> {
    unimplemented();
  }

  async addWriteLockForThisProcess(): Promise<void> {
    unimplemented();
  }

  async queryRecordByDepositSequenceNumber(sequenceNumber: number): Promise<Ckb2EthRecord | null> {
    unimplemented();

    // return entities.length === 0 ? null : ;
  }

  queryRecordsByDepositTxHash(txHash: string): Promise<Ckb2EthRecord[] | null> {
    unimplemented();
  }

  getLatestHandledBlockNumber(): Promise<number> {
    unimplemented();
  }

  getMaxEthNonce(): Promise<number> {
    unimplemented();
  }

  getMaxSequenceNumber(): Promise<number> {
    unimplemented();
  }

  getMintCommittedRecords(): Promise<Ckb2EthRecord[]> {
    unimplemented();
  }

  getReadyToMintRecords(): Promise<Ckb2EthRecord[]> {
    unimplemented();
  }

  getUncompletedBridgeFeePaymentRecipients(): Promise<string[]> {
    unimplemented();
  }

  updateRecordsWhenMintCommitted(records: Ckb2EthRecord[]): Promise<number> {
    unimplemented();
  }

  updateRecordsWhenMintConfirmed(records: Ckb2EthRecord[]): Promise<number> {
    unimplemented();
  }

  async upsertCkbRecordsInABlock(
    blockNumber: number,
    depositedRecords: Ckb2EthDeposited[],
    bridgeFeeRecords: BridgeFee[]
  ): Promise<void> {
    const trx = await this.knex.transaction();
    const ckb2eth = this.Ckb2Eth();

    // deposit records
    for (const deposited of depositedRecords) {
      const { deposit, bridgeMessage, bridgeFee, mint } = deposited;

      assertsState(deposit, 'Confirmed');
      assertsState(bridgeMessage, 'NotSubmitted');
      assertsState(bridgeFee, 'Uncompleted');
      assertsState(mint, 'NotReady');

      const depositEntity = ckb2ethRecordToEntity(deposited);
      await ckb2eth.insert(depositEntity).transacting(trx);
    }

    // bridge fee records
    for (const feePaid of bridgeFeeRecords) {
      // TODO
      //  1. insert bridge fee record
      //  2. update fee state if bridge fee is enough
    }

    await trx.commit().catch(trx.rollback);
  }
}
