import { expect } from 'chai';
import { ethNftIdToMNftId, mNftIdToEthNftId } from '.';
import { randomBytes } from 'crypto';

describe('NFTIDMapper', () => {
  it('Should convert between mNFT and ETH tokenID correctly', () => {
    const mNftId = '0x0e25724fd9fcdaf19e92298ae97e410da29203532fafb1e4f430edfc';
    const ethNftId = '0x010000000e25724fd9fcdaf19e92298ae97e410da29203532fafb1e4f430edfc';

    expect(mNftIdToEthNftId(mNftId)).to.equals(ethNftId);
    expect(ethNftIdToMNftId(ethNftId)).to.equals(mNftId);
  });

  it('Should throw error when ethNftId with wrong proposal type', () => {
    expect(() => ethNftIdToMNftId('0x000000000e25724fd9fcdaf19e92298ae97e410da29203532fafb1e4f430edfc')).to.be.throw();
  });

  it('Should throw error when NFT with wrong length', () => {
    expect(() => ethNftIdToMNftId(randomBytes(31))).to.throw();
    expect(() => ethNftIdToMNftId(randomBytes(33))).to.throw();

    expect(() => mNftIdToEthNftId(randomBytes(29))).to.throw();
    expect(() => mNftIdToEthNftId(randomBytes(27))).to.throw();
  });
});
