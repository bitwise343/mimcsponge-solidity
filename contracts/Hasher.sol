pragma solidity ^0.6.12;
contract Hasher {
    function MiMCSponge(uint256 xL_in,uint256 xR_in) external pure returns(uint256 xL, uint256 xR) {
        uint n = 220;
        bytes32 ci = 0x0fbe43c36a80e36d7c7c584d4f8f3759fb51f0d66065d8a227b688d12488c5d4;
        uint q = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;
        uint k = 0;
        uint xL = xL_in;
        uint xR = xR_in;
        uint t=addmod(k, xL, q);
        uint b=mulmod(t, t, q);
        uint c=mulmod(b, b, q);
        uint d=mulmod(c, t, q);
        xR=addmod(xR, d, q);
        uint a;
        for(uint i = 0; i < n-1; i++){
            if (i<n-2 && i!=0){
                ci = keccak256(abi.encodePacked(ci));
            }
            else
            {
                ci = 0;
            }
            (xL, xR)=(xR, xL);
            a = addmod(uint(ci), xL, q);
            t = addmod(a, k, q);
            b = mulmod(t, t, q);
            c = mulmod(b, b, q);
            d = mulmod(c, t, q);
            xR = addmod(xR, d, q);
        }
        return (xL, xR);
    }

}
