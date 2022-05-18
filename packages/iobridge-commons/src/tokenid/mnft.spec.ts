import { convertMNftIdToErc1155 } from './mnft';
import { expect } from 'chai';

describe('mNFT Token ID convertor', () => {
  it('convert mNFT Token ID to ERC1155', () => {
    expect(() => convertMNftIdToErc1155('')).to.throw();
  });
});
