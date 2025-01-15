// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract HTLC {

    event Locked(address _from, address indexed _to, uint256 _value, uint256 timelock, bytes32 hash, bytes _to_symbol);
    event Redeemed(bytes32 hash, bytes _preimage);

    address payable immutable to;
    address payable immutable from;
    uint256 immutable value;
    uint256 immutable timelock;
    bytes32 immutable hash;

    constructor(address _to, uint256 _timelock, bytes32 _hash, bytes memory _to_symbol) payable {
        value = msg.value;
        from = payable(msg.sender);
        to = payable(_to);
        timelock = _timelock;
        hash = _hash;

        emit Locked(from, to ,value, timelock, hash, _to_symbol);
    }

    function redeem(bytes calldata preimage) external {
        require(sha256(abi.encodePacked(sha256(abi.encodePacked(preimage)))) == hash);
        require(block.timestamp < timelock);

        to.transfer(value);

        emit Redeemed(hash, preimage);
    }

    function refund() external {
        require(block.timestamp >= timelock);

        from.transfer(value);
    }
}
