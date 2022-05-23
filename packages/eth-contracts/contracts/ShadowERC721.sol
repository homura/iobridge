// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract ShadowERC721 is ERC721Burnable, AccessControl {
    string private _baseTokenUri;

    // keccak256('MINTER_ROLE')
    bytes32 public constant MINTER_ROLE = 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6;

    constructor(
        string memory _uri,
        address admin,
        address minter
    ) ERC721('CKB Shadow NFT', 'SHADOW') {
        _baseTokenUri = _uri;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, minter);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 id) external onlyRole(MINTER_ROLE) {
        _mint(to, id);
    }

    function mintBatchMultiAccounts(address[] calldata tos, uint256[] calldata ids) external onlyRole(MINTER_ROLE) {
        uint256 tosLen = tos.length;
        uint256 idsLen = ids.length;

        require(tosLen == idsLen, 'ShadowERC721: tos and ids length mismatch');

        for (uint256 i = 0; i < tosLen; i++) {
            address to = tos[i];
            uint256 id = ids[i];
            _mint(to, id);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenUri;
    }

    function setBaseURI(string memory newuri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenUri = newuri;
    }
}
