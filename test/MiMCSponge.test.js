const { expect } = require('chai')
const { ethers } = require('hardhat')
const {
    deployContract,
    deployWithAbiAndBytecode
} = require('../scripts/hardhat.utils.js')
const { mimcsponge } = require('circomlib')
const genContract = require('../scripts/mimcsponge_gencontract.js')

const toBN = n => new ethers.BigNumber.from(n.toString())

describe('MiMCSponge', function() {

    before(async () => {
        const circomlibAbi = JSON.stringify(genContract.abi)
        const circomlibBytecode = genContract.createCode('mimcsponge', 220)
        this.mimcHasherCircomlib = await deployWithAbiAndBytecode(
            'MiMCHasherCircomlib', circomlibAbi, circomlibBytecode
        )
        this.mimcHasherPython = await deployContract('MiMCHasherPython')
        this.mimcHasherYul = await deployContract('MiMCHasherYul')
        this.calldata = this.mimcHasherPython.interface.encodeFunctionData(
            'MiMCSponge(uint,uint)', [1, 1]
        )
        const { xL, xR } = mimcsponge.hash(1, 1, 0)
        this.xL = toBN(xL)
        this.xR = toBN(xR)
    })

    it("MiMCHasherCircomlib should match js implementation", async () => {
        const result = await this.mimcHasherCircomlib.MiMCSponge(1, 1)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })

    it("MiMCHasherPython should match js implementation", async () => {
        const result = await this.mimcHasherPython.MiMCSponge(1, 1)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })

    it("MiMCHasherYul should match js implementation", async () => {
        const result = await this.mimcHasherYul.MiMCSponge(1, 1)
        const xL = toBN(result.xL)
        const xR = toBN(result.xR)
        expect(xL).to.be.equal(this.xL)
        expect(xR).to.be.equal(this.xR)
    })

    it("gas estimates", async() => {
        const estimateCircomlib = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcHasherCircomlib.address, data: this.calldata}]
        )
        const estimatePython = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcHasherPython.address, data: this.calldata}]
        )
        const estimateYul = await ethers.provider.send(
            'eth_estimateGas',
            [{to: this.mimcHasherYul.address, data: this.calldata}]
        )
        console.log('circomlib gas estimate: ',
            toBN(estimateCircomlib).toString()
        )
        console.log('python gas estimate: ',
            toBN(estimatePython).toString(),
            'relative to circomlib: ',
            Number(toBN(estimatePython))/Number(toBN(estimateCircomlib))
        )
        console.log('yul gas estimate: ',
            toBN(estimateYul).toString(),
            'relative to circomlib: ',
            Number(toBN(estimateYul))/Number(toBN(estimateCircomlib))
        )
    })
})
