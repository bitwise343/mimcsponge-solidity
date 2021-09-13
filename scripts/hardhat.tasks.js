task(
  "accounts",
  "Prints the list of accounts and balances"
).setAction(
  async (_, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
      const balance = await hre.ethers.provider.getBalance(account.address);
      console.log(`${account.address}: ${balance/1e18} ETH`);
    }
  }
);

task(
  "chainid",
  "Prints the chainid of hardhat node"
).setAction(
  async (_, hre) => {
    const chainId = (await hre.ethers.provider.getNetwork()).chainId;
    console.log(`chainId: ${chainId}`);
  }
);

task(
  "keccak",
  "Performs the solidityKeccak hash of --text"
).addParam(
  "text",
  "The text to take the solidityKeccak hash of"
).setAction(
  async (taskArgs, hre) => {
    console.log(
      hre.ethers.utils.solidityKeccak256(["string"], [taskArgs.text])
    );
  }
);

task(
  "selector",
  "Computes the function selector of --signature"
).addParam(
  "signature",
  "e.g. transferFrom(address,address,uint256)"
).setAction(
  async (taskArgs, hre) => {
    let fullHash = hre.ethers.utils.solidityKeccak256(
      ["string"], [taskArgs.signature]
    );
    console.log(fullHash.slice(0, 10));
  }
);

task(
  "solidityKeccak",
  "Performs the solidityKeccak hash of --values with given --types"
).addParam(
  "types",
  "JSON string e.g. '[\"uint256\", \"string\"]'"
).addParam(
  "values",
  "JSON string e.g. '[42, \"Jason Parser\"]'"
).setAction(
  async (taskArgs, hre) => {
    console.log(
      hre.ethers.utils.solidityKeccak256(
        JSON.parse(taskArgs.types), JSON.parse(taskArgs.values)
      )
    );
  }
);
