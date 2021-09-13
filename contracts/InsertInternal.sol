pragma solidity ^0.8.0;

import "./MerkleTreeWithHistoryInternal.sol";


contract InsertInternal is MerkleTreeWithHistoryInternal {
    constructor(uint32 levels) MerkleTreeWithHistoryInternal(levels) {}

    function insert(bytes32 leaf) public returns (uint32 index) {
        index = _insert(leaf);
    }
}
