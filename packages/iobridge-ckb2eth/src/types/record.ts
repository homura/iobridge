import { Script } from '@ckb-lumos/base';

export type Deposit = {
  blockNumber: number;
  txHash: string;
  // the transaction index of a block
  txIndexOfBlock: number;
  // the deposit NFT output index of a transaction
  outputIndexOfTx: number;
  // the index of all deposit records
  // for deriving a bridge fee recipient address
  sequenceNumber: number;

  // deposit from address
  depositFrom: Script;
  // deposit to address, normally the bridge contract address
  depositTo: Script;
  // deposited NFT TokenID
  nftId: string;
  // 0x01 for mNFT
  nftProposalType: 'mNFT' | 'CoTA';
};

export type Deposited = { state: 'Confirmed' } & Deposit;
export type DepositRecord = Deposited;

export type BridgeFee = {
  // bridge fee
  neededAmount: string;
  // fee recipient lock
  // derive from a master key
  recipient: Script;
  // fee paid transactions
  paidTxs: Array<{ txHash: string; amount: string }>;
};
export type BridgeFeeUncompleted = { state: 'Uncompleted' } & BridgeFee;
export type BridgeFeeCompleted = { state: 'Completed' } & BridgeFee;
export type BridgeFeeRecord = BridgeFeeUncompleted | BridgeFeeCompleted;

export type BridgeMessageNotSubmitted = { state: 'NotSubmitted' };
export type BridgeMessageSubmitted = { state: 'Submitted'; mintNftRecipient: string; signature?: string };
export type BridgeMessageRecord = BridgeMessageNotSubmitted | BridgeMessageSubmitted;

export type MintTx = { txHash: string; txNonce: number; signedTx: unknown; mappedNftId: string };

export type MintNotReady = { state: 'NotReady' };
export type MintReady = { state: 'ReadyToMint'; mappedNftId: string };
export type MintCommitted = { state: 'Committed' } & MintTx & { blockNumber: number };
export type MintConfirmed = { state: 'Confirmed' } & MintTx;
export type MintRecord = MintNotReady | MintReady | MintCommitted | MintConfirmed;

export type Ckb2EthDeposited = {
  deposit: Deposited;
  bridgeFee: BridgeFeeUncompleted;
  bridgeMessage: BridgeMessageNotSubmitted;
  mint: MintNotReady;
};

export type Ckb2EthRecord = {
  deposit: DepositRecord;
  bridgeFee: BridgeFeeRecord;
  bridgeMessage: BridgeMessageRecord;
  mint: MintRecord;
};
