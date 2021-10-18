const { expect } = require('chai')
const { ethers } = require('hardhat')
const {
    deployContract,
    deployWithAbiAndBytecode
} = require('../scripts/hardhat.utils.js')

const { mimcsponge } = require('circomlib')
const genContract = require('../scripts/mimcsponge_gencontract.js')

const merkleTreeV1 = require('../remix/MerkleTreeWithHistoryV1.json')
const merkleTreeV2 = require('../remix/MerkleTreeWithHistoryV2.json')

const toBN = n => new ethers.BigNumber.from(n.toString())

describe('MiMCSponge', function() {

    before(async () => {
        const circomlibAbi = JSON.stringify(genContract.abi)
        const circomlibBytecode = genContract.createCode('mimcsponge', 220)
        this.mimcHasherCircomlib = await deployWithAbiAndBytecode(
            'MiMCHasherCircomlib', circomlibAbi, circomlibBytecode
        )
        this.mimcSponge = await deployWithAbiAndBytecode(
            'MiMCSponge',
            merkleTreeV1.abi,
            merkleTreeV1.bytecode
        )
        this.mimcSponge2 = await deployWithAbiAndBytecode(
            'MiMCSponge2',
            merkleTreeV2.abi,
            merkleTreeV2.bytecode
        )
        this.calldata = this.mimcSponge.interface.encodeFunctionData(
            'MiMCSponge(uint,uint)', [1, 2]
        )
        const { xL, xR } = mimcsponge.hash(1, 2, 0)
        this.xL = toBN(xL)
        this.xR = toBN(xR)
    })

    after(async() => {
        const estimateCircomlib = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcHasherCircomlib.address, data: this.calldata}]
        )
        const estimateMimcSponge = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcSponge.address, data: this.calldata}]
        )
        const estimateMimcSponge2 = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcSponge2.address, data: this.calldata}]
        )
        console.log('Circomlibjs::MiMCSponge gas estimate: ',
            toBN(estimateCircomlib).toString()
        )
        console.log('MerkleTreeWithHistory.yul::MiMCSponge gas estimate: ',
            toBN(estimateMimcSponge).toString(),
            'relative to circomlib: ',
            Number(toBN(estimateMimcSponge))/Number(toBN(estimateCircomlib))
        )
        console.log('MerkleTreeWithHistoryV2.yul::MiMCSponge gas estimate: ',
            toBN(estimateMimcSponge2).toString(),
            'relative to circomlib: ',
            Number(toBN(estimateMimcSponge2))/Number(toBN(estimateCircomlib))
        )
    })

    it("MiMCHasherCircomlib should match js implementation", async () => {
        const result = await this.mimcHasherCircomlib.MiMCSponge(1, 2)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })

    it("MerkleTreeWithHistory.yul::MiMCSponge should match js implementation", async () => {
        const result = await this.mimcSponge.MiMCSponge(1, 2)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })

    it("MerkleTreeWithHistoryV2.yul::MiMCSponge should match js implementation", async () => {
        const result = await this.mimcSponge2.MiMCSponge(1, 2)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })
})
