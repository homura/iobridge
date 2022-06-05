import { ScanCkbAdapter } from './types';
import { asyncSleep } from './utils';

export async function start(adapter: ScanCkbAdapter): Promise<void> {
  const { store, config, scanner, logger } = adapter;

  // throw error when the store is locked by another process
  await store
    .addWriteLockForThisProcess()
    .catch(() => logger.makeError('another instance is writing to the store, exit'));

  let scannedBlockNumber = Math.max(await store.getLatestHandledBlockNumber(), config.minScanBlockNumber);

  while (true) {
    logger.info(`current scanned block number`, scannedBlockNumber);

    const confirmedBlockNumber = await scanner.getLatestConfirmedBlockNumber();

    if (scannedBlockNumber > confirmedBlockNumber) {
      logger.makeError('impossible: scannedBlockNumber > confirmedBlockNumber, maybe the CKB node has been re-synced');
    }

    if (scannedBlockNumber === confirmedBlockNumber) {
      await asyncSleep(config.rescanInterval);
      continue;
    }

    const currentBlockNumber = scannedBlockNumber + 1;

    // TODO catch and retry here
    const bridgeFeeRecipients = await store.getUncompletedBridgeFeePaymentRecipients();
    // TODO catch and retry here
    const { confirmedDepositRecords, bridgeFeeRecords } = await scanner.scanCkb2EthRecordByBlockNumber(
      currentBlockNumber,
      bridgeFeeRecipients
    );

    logger.info(`UncompletedBridgeFeePaymentRecipients`, bridgeFeeRecipients);
    logger.info(`scanned Ckb2EthRecord in block ${currentBlockNumber}`, confirmedDepositRecords, bridgeFeeRecords);

    // TODO catch and retry in a limited number of times here
    await store
      .upsertCkbRecordsInABlock(currentBlockNumber, confirmedDepositRecords, bridgeFeeRecords)
      .catch((e) => logger.faultAndNotify(`the bridge store may crashed:`, e));

    scannedBlockNumber = currentBlockNumber;
  }
}
