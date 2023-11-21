// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;


interface IFactory {
    function receiveFunds(address from) external payable;
}

contract Wallet {
    
    address public factory;

    receive() external payable {
        IFactory(factory).receiveFunds{value: address(this).balance}(msg.sender);
    }

    constructor() public {
        factory = msg.sender;
    }

    function initialize() external {
        require(msg.sender == factory, 'Wallet: FORBIDDEN'); // sufficient check
        IFactory(factory).receiveFunds{value: address(this).balance}(address(0));
    }

    function claimEth() public returns(bool) {
        require(msg.sender == factory, "Wallet: No permission");
        payable(tx.origin).transfer(address(this).balance);
        return true;
    }
}