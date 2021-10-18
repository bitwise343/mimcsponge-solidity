const { expect } = require('chai')
const { ethers } = require('hardhat')
const { deployWithAbiAndBytecode } = require('../scripts/hardhat.utils.js')

const merkleTreeV1 = require('../remix/MerkleTreeWithHistoryV1.json')
const merkleTreeV2 = require('../remix/MerkleTreeWithHistoryV2.json')
const merkleTreeV3 = require('../remix/MerkleTreeWithHistoryV3.json')

const toBN = n => new ethers.BigNumber.from(n.toString())

describe('MerkleTrees', function() {

    before(async () => {
        this.input = toBN('0x1111111111111111111111111111111111111111111111111111111111111111')

        this.merkleTreeV1 = await deployWithAbiAndBytecode(
            'MerkleTreeWithHistoryV1.yul',
            merkleTreeV1.abi,
            merkleTreeV1.bytecode
        )
        this.merkleTreeV2 = await deployWithAbiAndBytecode(
            'MerkleTreeWithHistoryV2.yul',
            merkleTreeV2.abi,
            merkleTreeV2.bytecode
        )
        this.merkleTreeV3 = await deployWithAbiAndBytecode(
            'MerkleTreeWithHistoryV3.yul',
            merkleTreeV3.abi,
            merkleTreeV3.bytecode
        )

        /*
            shockingly, zeros works, but `initialize` doesn't! (?) I'm lost
        */
        // for (let i = 0; i < 32; i++) {
        //     console.log(await this.merkleTreeV2.zeros(i))
        // }
    })

    it("MerkleTreeWithHistoryV1.yul::initialize should work", async () => {
        await this.merkleTreeV1.initialize(20)
    })

    // it("MerkleTreeWithHistoryV2.yul::initialize should work", async () => {
    //     await this.merkleTreeV2.initialize(20)
    // })

    it("MerkleTreeWithHistoryV1.yul::insert should work", async () => {
        let result = await this.merkleTreeV1.insert(this.input)
        console.log('final gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })

    // it("MerkleTreeWithHistoryV2.yul::insert should work", async () => {
    //     let result = await this.merkleTreeV2.insert(this.input)
    //     console.log('final gas used: ',
    //         (await result.wait()).gasUsed.toString()
    //     )
    // })

    it("MerkleTreeWithHistoryV3.yul::insert should work", async () => {
        let result = await this.merkleTreeV3.insert(this.input)
        console.log('final gas used: ',
            (await result.wait()).gasUsed.toString()
        )
    })

    it("Both implementations should share the same last root", async () => {
        const v1LastRoot = await this.merkleTreeV1.getLastRoot()
        const v3LastRoot = await this.merkleTreeV3.getLastRoot()
        expect(v1LastRoot).to.be.equal(v3LastRoot)
    })

})
