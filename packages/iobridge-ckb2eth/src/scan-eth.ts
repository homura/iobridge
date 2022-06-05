import { ScanEthAdapter } from './types';
import { asyncSleep } from './utils';

export async function start(adapter: ScanEthAdapter): Promise<void> {
  const { store, scanner } = adapter;

  while (true) {
    const latestBlockNumber = await scanner.getLatestConfirmedBlockNumber();

    const records = await store.getMintCommittedRecords();

    const confirmedRecords = records.filter(
      (record) => record.mint.state === 'Committed' && latestBlockNumber > record.mint.blockNumber
    );

    // TODO Reconfirm that mint really succeeded
    //  group confirmed records' mint txHash and check the receipt

    await store.updateRecordsWhenMintConfirmed(confirmedRecords);
    await asyncSleep(2000);
  }
}
