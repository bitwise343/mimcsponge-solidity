const { expect } = require('chai')
const { ethers } = require('hardhat')
const {
    deployContract,
    deployWithAbiAndBytecode
} = require('../scripts/hardhat.utils.js')
const { mimcsponge } = require('circomlib')
const genContract = require('../scripts/mimcsponge_gencontract.js')

const mimcJson = require('./MiMC.json')

const toBN = n => new ethers.BigNumber.from(n.toString())

describe('MerkleTree', function() {

    before(async () => {
        const circomlibAbi = JSON.stringify(genContract.abi)
        const circomlibBytecode = genContract.createCode('mimcsponge', 220)
        this.mimcHasherCircomlib = await deployWithAbiAndBytecode(
            'MiMCHasherCircomlib', circomlibAbi, circomlibBytecode
        )
        this.mimcHasherPython = await deployContract('MiMCHasherPython')
        this.insertCaller = await deployContract('InsertCaller', [
            20, this.mimcHasherCircomlib.address
        ])
        this.insertCaller2 = await deployContract('InsertCaller', [
            20, this.mimcHasherPython.address
        ])
        this.insertInternal = await deployContract('InsertInternal', [20])
        this.merkleTreeWithHistory = await deployWithAbiAndBytecode(
            'MerkleTreeWithHistory.yul',
            mimcJson.abi,
            mimcJson.bytecode
        )
        await this.merkleTreeWithHistory.initialize(20)
        this.input = toBN('0x1111111111111111111111111111111111111111111111111111111111111111')
    })

    it("InsertCaller", async () => {
        let result = await this.insertCaller.insert(this.input)
        console.log('caller gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })

    it("InsertCaller2", async () => {
        let result = await this.insertCaller2.insert(this.input)
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

    it("InsertFinal", async () => {
        let result = await this.merkleTreeWithHistory.insert(this.input)
        console.log('final gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })
})
