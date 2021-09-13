pragma solidity ^0.8.0;

import "./MerkleTreeWithHistoryCaller.sol";


contract InsertCaller is MerkleTreeWithHistoryCaller {
    constructor(uint32 levels, IHasher hasher) MerkleTreeWithHistoryCaller(levels, hasher) {}

    function insert(bytes32 leaf) public returns (uint32 index) {
        index = _insert(leaf);
    }
}
