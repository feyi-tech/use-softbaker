// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IWallet {
    function initialize() external;
    function claimEth() external returns(bool);
}