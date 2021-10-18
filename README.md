# MiMCSponge in Solidity
In an effort to reduce the gas cost of the TornadoCash MerkleTreeWithHistory contract, I set out to include the MiMCSponge hasher contract directly into the MerkleTreeWithHistory contract (this was a [recommendation](https://tornado.cash/audits/TornadoCash_contract_audit_ABDK.pdf) that ABDK consulting made in their audit of the TornadoCash contracts). After extensive testing, this is the final version.

# Install and Test

  1. Simply clone the repo and then run `yarn` or `npm install .` in the root directory.
  2. Run `npx hardhat test` from the root directory.


# Final Results
The results of the unit tests are below. I removed some old contracts, but the previous results can be found in older commits. Noteably, the recommendation that [Hari](https://twitter.com/_hrkrshnn) made to me was to change from the switch/case expression to `CODECOPY` instead, which reduced the gas cost a further 5k gas. In total, this is about 15k gas savings compared to the original contract!
```sh
MerkleTrees
✓ MerkleTreeWithHistoryV1.yul::initialize should work (91ms)
final gas used:  904133
✓ MerkleTreeWithHistoryV1.yul::insert should work (1001ms)
final gas used:  899793
✓ MerkleTreeWithHistoryV3.yul::insert should work (846ms)
✓ Both implementations should share the same last root

MiMCSponge
✓ MiMCHasherCircomlib should match js implementation
✓ MerkleTreeWithHistory.yul::MiMCSponge should match js implementation
✓ MerkleTreeWithHistoryV2.yul::MiMCSponge should match js implementation
Circomlibjs::MiMCSponge gas estimate:  38804
MerkleTreeWithHistory.yul::MiMCSponge gas estimate:  39142 relative to circomlib:  1.0087104422224513
MerkleTreeWithHistoryV2.yul::MiMCSponge gas estimate:  39040 relative to circomlib:  1.0060818472322441
```
