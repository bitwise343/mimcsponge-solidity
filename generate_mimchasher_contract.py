from web3 import Web3

keccak = Web3.keccak
toHex = Web3.toHex
seed = keccak(text='mimcsponge')
N = 220

code = '''
pragma solidity ^0.8.0;


contract MiMCHasherPython {

    function MiMCSponge(
        uint in_xL, uint in_xR
    ) public pure returns (uint xL, uint xR) {
        unchecked { assembly {
            let _xL := in_xL
            let _xR := in_xR
            let q := 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
            let a := 0
            let b := mulmod(_xL, _xL, q)
            let c := mulmod(b, b, q)
            let d := mulmod(c, _xL, q)
            let e := addmod(d, _xR, q)
            _xR := _xL
            _xL := e'''
code_fragments = [
'''
            a := addmod(%s, _xL, q)
            b := mulmod(a, a, q)
            c := mulmod(b, b, q)
            d := mulmod(c, a, q)
            e := addmod(d, _xR, q)
''',
'''            _xR := _xL
            _xL := e'''
]

for i in range(N-1):
    seed = keccak(seed)
    code += ''.join([
        code_fragments[0] % (toHex(seed)) if i < N-2 else code_fragments[0] % (toHex(0)),
        code_fragments[1]
    ])

code += '''
            xL := _xR
            xR := _xL
        }}
    }
}
'''

with open('./contracts/MiMCHasherPython.sol', 'w+') as f:
    f.write(code)
