import {
  signCrossChainMessage,
  verifyCrossChainMessage,
  validateCrossChainMessage,
  EthereumProvider,
  CrossChainMessage,
  TxHashTypeError,
  ToAddressTypeError,
} from './cross-chain-message';
import { personalSign } from '@metamask/eth-sig-util';
import { expect } from 'chai';
import { bufferToHex, privateToAddress, toBuffer } from 'ethereumjs-util';

const PRIVATE_KEY = toBuffer('0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1');

const MOCK_ETH_ADRESS = bufferToHex(privateToAddress(PRIVATE_KEY));

const MOCK_MESSAGE: CrossChainMessage = {
  txHash: 'testHash',
  toAddress: 'testAddress',
};

const mockEthProvider: EthereumProvider = {
  request: async (payload) => {
    return personalSign({ privateKey: PRIVATE_KEY, data: payload.params[0] });
  },
};

describe('sign personalSign', () => {
  it('should sign message', async () => {
    const signature = await signCrossChainMessage(mockEthProvider, MOCK_MESSAGE, MOCK_ETH_ADRESS);

    expect(signature).to.equal(personalSign({ privateKey: PRIVATE_KEY, data: JSON.stringify(MOCK_MESSAGE) }));
  });

  it('should verify message', async () => {
    const signature = await signCrossChainMessage(mockEthProvider, MOCK_MESSAGE, MOCK_ETH_ADRESS);
    const result = verifyCrossChainMessage({
      expectedSignerAddress: MOCK_ETH_ADRESS,
      signature,
      message: JSON.stringify(MOCK_MESSAGE),
    });
    expect(result).true;

    const errorResult = verifyCrossChainMessage({
      expectedSignerAddress: MOCK_ETH_ADRESS,
      signature: 'sometext',
      message: JSON.stringify(MOCK_MESSAGE),
    });
    expect(errorResult).false;
  });

  it('should validate message', async () => {
    expect(validateCrossChainMessage).to.throw();
    expect(() => validateCrossChainMessage('{}')).to.throw(TxHashTypeError);
    expect(() => validateCrossChainMessage('{"txHash": "test"}')).to.throw(ToAddressTypeError);
    expect(() => validateCrossChainMessage('{"txHash": "test","toAddress": "test"}')).to.not.throw();
  });
});
