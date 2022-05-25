import { recoverPersonalSignature } from '@metamask/eth-sig-util';

interface EthereumRpc {
  (payload: { method: 'personal_sign'; params: [string /* from */, string /* message */] }): Promise<string>;
}

export interface EthereumProvider {
  request: EthereumRpc;
}

export type CrossChainMessage = { txHash: string; toAddress: string };

export const TxHashTypeError = new TypeError('txHash type is not string');
export const ToAddressTypeError = new TypeError('toAddress type is not string');

export function validateCrossChainMessage(message: string): void {
  const messageObj = JSON.parse(message);

  if (typeof messageObj.txHash !== 'string') {
    throw TxHashTypeError;
  }

  if (typeof messageObj.toAddress !== 'string') {
    throw ToAddressTypeError;
  }
}

export function verifyCrossChainMessage(payload: {
  expectedSignAddress: string;
  signature: string;
  message: string;
}): boolean {
  try {
    const msg = `0x${Buffer.from(payload.message, 'utf8').toString('hex')}`;
    const recoveredAddr = recoverPersonalSignature({
      data: msg,
      signature: payload.signature,
    });

    return payload.expectedSignAddress === recoveredAddr;
  } catch {
    return false;
  }
}

export async function signCrossChainMessage(
  provider: EthereumProvider,
  message: CrossChainMessage,
  from: string
): Promise<string> {
  const msg = JSON.stringify(message);

  return provider.request({
    method: 'personal_sign',
    params: [msg, from],
  });
}
