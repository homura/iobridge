import { Address } from '@ckb-lumos/base';
import { Ckb2EthStore } from './store';
import { Ckb2EthRecord } from './record';

export type Log = (...args: unknown[]) => void;
export type Logger = {
  debug: Log;
  info: Log;
  warn: Log;
  error: Log;

  makeError: (...args: unknown[]) => never;

  notify: (...args: unknown[]) => Promise<void>;
  faultAndNotify: (...args: unknown[]) => Promise<void>;
};

interface CkbScanner {
  // get the latest confirmed block number of a CKB node
  getLatestConfirmedBlockNumber(): Promise<number>;

  scanCkb2EthRecordByBlockNumber(
    blockNumber: number,
    uncompletedBridgeFeeRecipients: Address[]
  ): Promise<Ckb2EthRecord[]>;
}

export interface ScanCkbAdapter {
  store: Ckb2EthStore;
  scanner: CkbScanner;
  logger: Logger;

  config: {
    // minimal block number to scan
    minScanBlockNumber: number;
    // re-scan interval in milliseconds
    rescanInterval: number;
  };
}

interface EthScanner {
  getLatestConfirmedBlockNumber(): Promise<number>;
}

export interface ScanEthAdapter {
  store: Ckb2EthStore;
  scanner: EthScanner;
  config: {
    rescanInterval: number;
  };
}
