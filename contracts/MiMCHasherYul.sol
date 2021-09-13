pragma solidity ^0.8.0;


contract MiMCHasherYul {

    function MiMCSponge(
        uint in_xL, uint in_xR
    ) public pure returns (uint xL, uint xR) {
        unchecked {
        assembly {
            let q := 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
            // hash of "mimcsponge"
            let ci := 0x10529277df5f5500b4ec3a33de5f758720073f434633f4491dcd9fa637249520
            let _xL := in_xL
            let _xR := in_xR

            let a := 0
            let b := mulmod(_xL, _xL, q)
            let c := mulmod(b, b, q)
            let d := mulmod(c, _xL, q)
            let e := addmod(d, _xR, q)

            _xR := _xL
            _xL := e

            /* nRounds == 220 */
            for { let i := 0 } lt(i, 219) { i := add(i, 1) } {
                if lt(i, 218) {
                    mstore(0, ci)
                    ci := keccak256(0, 32)
                }
                if or(gt(i, 218), eq(i, 218)) {
                    ci := 0
                }

                a := addmod(ci, _xL, q)
                b := mulmod(a, a, q)
                c := mulmod(b, b, q)
                d := mulmod(c, a, q)
                e := addmod(d, _xR, q)

                _xR := _xL
                _xL := e
            }

            xL := _xR
            xR := _xL
        }
    }
    }
}
