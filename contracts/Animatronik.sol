// SPDX-License-Identifier: MIT
// @ts-expect-error asfasdf
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AnimatronikContract is ERC721, ERC721Enumerable, Pausable, Ownable {
    using SafeMath for uint256;

    struct Animatronik {
      string css;
      string svg;
    }

    Animatronik[] public animatroniks;

    constructor() ERC721("Animatronik", "ATK") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory css, string memory svg) public {
        animatroniks.push(Animatronik(css, svg));
        uint256 tokenId = animatroniks.length - 1;
        _safeMint(to, tokenId);
    }

    function getAnimatronikCount() public view returns (uint256) {
        return animatroniks.length;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
