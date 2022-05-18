//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';

interface ICkbShadowNft is IERC1155 {
    function mint(
        address receiver,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function mintBatch(
        address[] calldata receivers,
        uint256[] calldata tokenIds,
        bytes calldata data
    ) external;

    function burn(uint256 id, bytes calldata data) external;

    function burnBatch(
        address[] calldata addresses,
        uint256[] calldata tokenIds,
        bytes calldata data
    ) external;
}
