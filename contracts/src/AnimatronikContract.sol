// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract AnimatronikContract is ERC721Enumerable {
    uint256 private _next_token_id;
    mapping(uint256 => string) private _data;

    constructor() ERC721("Animatronik", "ATRK") {}

    function mint(string memory data) public {
        uint256 token_id = _next_token_id++;
        _safeMint(msg.sender, token_id);
        _data[token_id] = data;
    }

    function get_data(uint256 token_id) public view returns (string memory) {
        return _data[token_id];
    }
}
