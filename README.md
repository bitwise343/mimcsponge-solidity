# MiMCSponge in Pure Solidity
Here I test two different solidity implementations of the MiMCSponge hasher as used by Tornado cash. If we can get a pure solidity implementation, then the hasher contract can be included in the Merkle Tree, instead of being a library/external contract.

The barrier to putting MiMCSponge into MerkleTreeWithHistory is having a pure solidity implementation. Here I test two different implementations and use `eth_estimateGas` to compare costs.

# Install and Test

  1. Simply clone the repo and then run `yarn` or `npm install .` in the root directory.
  2. Run `npx hardhat test` from the root directory.

To generate the contract from python you need to install python web3 dependencies:
```sh
$ python3 -m venv venv
$ source venv/bin/activate
$ pip3 install -r requirements.txt
```
then you can generate the file using
```
(venv) $ python generate_mimchasher_contract.py
```

# Initial Results
```sh
circomlib gas estimate:  38804
python gas estimate:  48282 relative to circomlib:  1.2442531697763117
yul gas estimate:  83982 relative to circomlib:  2.16426141634883
```
# Final Results
TODO:
Next step is to plug this into the MerkleTree and compare costs.
