// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract ShadowERC1155 is ERC1155, AccessControl {
    // keccak256('MINTER_ROLE')
    bytes32 public constant MINTER_ROLE = 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6;

    constructor(
        string memory uri_,
        address admin,
        address minter
    ) ERC1155(uri_) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, minter);
    }

    function setURI(string memory newuri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(
        address receiver,
        uint256 tokenId,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        _mint(receiver, tokenId, amount, '');
    }

    function mintBatchMultiAccounts(
        address[] calldata tos,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyRole(MINTER_ROLE) {
        require(tos.length == ids.length, 'CKBShadowNFT: tos and ids length mismatch');
        require(ids.length == amounts.length, 'CKBShadowNFT: ids and amounts length mismatch');

        for (uint256 i = 0; i < ids.length; i++) {
            address to = tos[i];
            uint256 id = ids[i];
            uint256 amount = amounts[i];
            _mint(to, id, amount, '');
        }
    }

    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) external {
        _burn(from, id, amount);
    }

    function burnBatch(
        address from,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external {
        _burnBatch(from, ids, amounts);
    }
}
