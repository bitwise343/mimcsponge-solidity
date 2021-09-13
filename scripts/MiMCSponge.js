const circomlib = require('circomlib')
const mimcsponge = circomlib.mimcsponge

class MimcSpongeHasher {
    hash(left, right) {
        return mimcsponge.multiHash([left, right]).toString()
    }
}

module.exports = MimcSpongeHasher
