import { bytify, concat, hexify } from '@ckb-lumos/codec/lib/bytes';
import { BytesLike } from '@ckb-lumos/codec';
import { asserts } from '../asserts';

export const MNFT_PROPOSAL_TYPE = 0x01;

export function mNftIdToEthNftId(mNftId: BytesLike): string {
  const tokenId = bytify(mNftId);
  asserts(tokenId.length === 28, 'Invalid mNFT ID length');

  return hexify(concat([MNFT_PROPOSAL_TYPE], new Uint8Array(3), mNftId));
}

export function ethNftIdToMNftId(ethNftId: BytesLike): string {
  const tokenId = bytify(ethNftId);

  asserts(tokenId.length === 32, `Invalid uint256`);
  asserts(tokenId[0] === MNFT_PROPOSAL_TYPE, `Invalid proposal type, ${tokenId[0]} is not mNFT proposal type`);

  return hexify(tokenId.slice(-28));
}
