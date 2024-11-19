// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract HTLC{

    event Locked(address _from,address _to,uint256 _value,uint256 timelock,bytes32 hash,bytes32 _to_symbol);

    address payable immutable to;
    address payable immutable from;
    uint256 immutable value;
    uint256 immutable timelock;
    bytes32 immutable hash;

    constructor(address _to,uint256 _timelock,bytes32 _hash,bytes32 _to_symbol)payable{
        value=msg.value;
        from=payable(msg.sender);
        to=payable(_to);
        timelock=_timelock;
        hash=_hash;

        emit Locked(from,to,value,timelock,hash,_to_symbol);
    }

    function redeem(bytes calldata preimage)external{
        require(keccak256(preimage)==hash);
        require(block.timestamp<timelock);
        to.transfer(value);
    }

    function refund()external{
        require(block.timestamp>=timelock);
        from.transfer(value);
    }
}
