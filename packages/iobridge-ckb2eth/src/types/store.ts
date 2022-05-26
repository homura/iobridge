import { Ckb2EthRecord } from './record';

export interface Ckb2EthStore {
  /**
   * to ensure only one instance is enabled to write to the store
   */
  addWriteLockForThisProcess(): Promise<void>;

  /**
   * insert or update Ethereum records, at meanwhile
   * @param blockNumber
   * @param records
   */
  upsertCkbRecordsInABlock(blockNumber: number, records: Ckb2EthRecord[]): Promise<number>;

  /**
   * update records' state when mint is committed
   * @param records
   */
  updateRecordsWhenMintCommitted(records: Ckb2EthRecord[]): Promise<number>;

  /**
   * update records' state when mint is confirmed
   * @param records
   */
  updateRecordsWhenMintConfirmed(records: Ckb2EthRecord[]): Promise<number>;

  /**
   * get a {@see Ckb2EthRecord} by a deposit TxHash, return null if not found
   * @param txHash
   */
  findRecordByDepositTxHash(txHash: string): Promise<Ckb2EthRecord | null>;

  /**
   * get a {@see Ckb2EthRecord} by a redemption TxHash, return null if not found
   * @param sequenceNumber
   */
  findRecordByDepositSequenceNumber(sequenceNumber: number): Promise<Ckb2EthRecord | null>;

  /**
   * each bridge operation needs to be paid some CKB as bridge fee, this method helps to filter uncompleted bridge fee payment
   */
  getUncompletedBridgeFeePaymentRecipients(): Promise<string[]>;

  getLatestHandledBlockNumber(): Promise<number>;

  getMaxSequenceNumber(): Promise<number>;

  getMaxEthNonce(): Promise<number>;

  getMintCommittedRecords(): Promise<Ckb2EthRecord[]>;

  /**
   * get all records ready to be minted, `BridgeFeePaidCompleted && BridgeMessageSubmitted`
   */
  getReadyToMintRecords(): Promise<Ckb2EthRecord[]>;
}
