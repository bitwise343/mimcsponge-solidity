const { expect } = require('chai')
const { ethers } = require('hardhat')
const {
    deployContract,
    deployWithAbiAndBytecode
} = require('../scripts/hardhat.utils.js')
const { mimcsponge } = require('circomlib')
const genContract = require('../scripts/mimcsponge_gencontract.js')

const toBN = n => new ethers.BigNumber.from(n.toString())

describe('MerkleTree', function() {

    before(async () => {
        const circomlibAbi = JSON.stringify(genContract.abi)
        const circomlibBytecode = genContract.createCode('mimcsponge', 220)
        this.mimcHasherCircomlib = await deployWithAbiAndBytecode(
            'MiMCHasherCircomlib', circomlibAbi, circomlibBytecode
        )
        this.insertCaller = await deployContract('InsertCaller', [
            20, this.mimcHasherCircomlib.address
        ])
        this.insertInternal = await deployContract('InsertInternal', [20])
        this.input = toBN('21888242871839275222246405745257275088548364400416034343698204186575808495616')
    })

    it("InsertCaller", async () => {
        let result = await this.insertCaller.insert(this.input)
        console.log('caller gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })

    it("InsertInternal", async () => {
        let result = await this.insertInternal.insert(this.input)
        console.log('internal gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })
})
