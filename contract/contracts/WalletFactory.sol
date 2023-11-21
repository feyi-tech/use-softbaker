// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Address.sol";
import "./SafeMath.sol";
import "./IWallet.sol";
import "./Wallet.sol";

contract WalletFactory {
    using Address for address;
    using SafeMath for uint256;
    
    address[] public wallets;
    mapping(bytes32 => address) public saltToWallet;
    mapping(address => bytes32) public walletToSalt;
    mapping(address => bool) public walletCreated;
    mapping(address => uint256) public walletToDeposits;

    address public owner;
    address public walletCreator;

    mapping(uint8 => ShareHolder) public shareHolders;
    uint8 public totalShareHolders;

    struct ShareHolder {
        address wallet;
        uint8 pct;
    }

    event WalletCreated(bytes32 indexed salt, address indexed wallet);
    event Transfer(address indexed from, address indexed toWallet, uint amount);
    event ShareHoldersUpdated(address indexed from, uint totalShareHolders, uint totalPercentages);
    event ShareSent(address indexed executor, address indexed holderWallet, uint amount);
    event FeesReturned(address indexed executor, uint amount);

    constructor(
        address _walletCreator,
        address[] memory _shareHoldersWallets, 
        uint8[] memory _shareHoldersPcts
    ) public {
        owner = msg.sender;
        walletCreator = _walletCreator;
        _updateShareHolders(_shareHoldersWallets, _shareHoldersPcts);
    }

    function receiveFunds(address from) external payable {
        // You can implement distribution logic here
        if(walletCreated[msg.sender] && msg.value > 0) {
            walletToDeposits[msg.sender] += msg.value;
            emit Transfer(from, msg.sender, msg.value);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyOwnerOrCreator() {
        require(msg.sender == owner || msg.sender == walletCreator, "Only the owner or wallet creator can call this function");
        _;
    }

    function updateOwner(address currentOwnerConfirmation, address newOwner) external onlyOwner {
        require(currentOwnerConfirmation == owner, "Wrong confirmation.");
        owner = newOwner;
    }
    function updateWalletCreator(address _walletCreator) external onlyOwner {
        walletCreator = _walletCreator;
    }

    // Function to update shareHolders and their percentages
    function updateShareHolders(
        address[] memory _shareHoldersWallets, 
        uint8[] memory _shareHoldersPcts
    ) external onlyOwner {
        _updateShareHolders(_shareHoldersWallets, _shareHoldersPcts);
    }
    
    function _updateShareHolders(
        address[] memory _shareHoldersWallets, 
        uint8[] memory _shareHoldersPcts
    ) private {
        require(_shareHoldersWallets.length > 0, "ShareHolders list must not be empty");
        require(_shareHoldersWallets.length == _shareHoldersPcts.length, "ShareHoldersWallet length != ShareHoldersPct");

        uint8 totalPercentage;
        // Update shareholders with the new list
        for (uint8 i = 0; i < _shareHoldersWallets.length; i++) {
            shareHolders[i].wallet = _shareHoldersWallets[i];
            shareHolders[i].pct = _shareHoldersPcts[i];
            totalPercentage += _shareHoldersPcts[i];
        }
        require(totalPercentage <= 100, "Total percentage exceeds 100%");
        totalShareHolders = uint8(_shareHoldersWallets.length);

        emit ShareHoldersUpdated(msg.sender, _shareHoldersWallets.length, totalPercentage);
    }

    function disburseFunds(uint256 gasFeeReturn) external onlyOwnerOrCreator {
        _disburseFunds(address(this).balance, gasFeeReturn);
    }

    function claimWalletEth(bytes32 salt) external onlyOwnerOrCreator returns (bool) {
        (address wallet,) = _getSaltAddress(salt);
        return IWallet(wallet).claimEth();
    }

    function _disburseFunds(uint256 amount, uint256 gasFeeReturn) private {
        require(amount > 0 && amount > gasFeeReturn, "WalletFactory: amount must be > 0 and gasFeeReturn");
        
        amount -= gasFeeReturn;
        
        uint256 totalSent;
        for (uint8 i = 0; i < totalShareHolders; i++) {
            uint256 share = (amount * shareHolders[i].pct) / 100;
            payable(shareHolders[i].wallet).transfer(share);
            emit ShareSent(msg.sender, shareHolders[i].wallet, share);
            totalSent += share;
        }
        if(amount > totalSent) {
            gasFeeReturn += amount - totalSent;
        }
        if(gasFeeReturn > 0) {
            payable(msg.sender).transfer(gasFeeReturn);
            emit FeesReturned(msg.sender, gasFeeReturn);
        }
    }

    function createWallets(bytes32[] memory salts, uint256 disburseThreshold, uint256 gasFeeReturn) external onlyOwnerOrCreator {
        bytes memory bytecode = type(Wallet).creationCode;
        address wallet;
        bytes32 salt;
        for (uint32 index = 0; index < salts.length; index++) {
            salt = salts[index];
            assembly {
                wallet := create2(0, add(bytecode, 32), mload(bytecode), salt)
            }
            walletCreated[wallet] = true;
            saltToWallet[salt] = wallet;
            walletToSalt[wallet] = salt;
            wallets.push(wallet);
            emit WalletCreated(salt, wallet);
            IWallet(wallet).initialize();
        }
        uint256 amount = address(this).balance;
        if(amount > 0 && amount >= disburseThreshold && amount > gasFeeReturn) {
            _disburseFunds(amount, gasFeeReturn);

        } else if(amount > gasFeeReturn) {
            payable(msg.sender).transfer(gasFeeReturn);
        }
    }

    function getSaltAddress(bytes32 salt) public view returns (address wallet, bool isCreated) {
        (wallet, isCreated) = _getSaltAddress(salt);
    }

    function _getSaltAddress(bytes32 salt) private view returns (address wallet, bool isCreated) {
        wallet = saltToWallet[salt];
        isCreated = walletCreated[wallet];
        if(!isCreated) {
            bytes memory bytecode = type(Wallet).creationCode;
            bytes32 bytecodeHash = keccak256(bytecode);
            wallet = address(uint160(uint256(keccak256(abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                bytecodeHash
            )))));
        }
    }

    function getAllSaltsTotalBalance(bytes32[] memory salts) external view returns(uint256 totalBalance) {
        address wallet;
        bool isCreated;
        bytes32 salt;
        for (uint32 index = 0; index < salts.length; index++) {
            salt = salts[index];
            (wallet, isCreated) = _getSaltAddress(salt);
            totalBalance += isCreated? walletToDeposits[wallet] : wallet.balance;
        }
    }

    function getCreatedSaltsTotalBalance(bytes32[] memory salts) external view returns(uint256 totalBalance) {
        address wallet;
        bool isCreated;
        bytes32 salt;
        for (uint32 index = 0; index < salts.length; index++) {
            salt = salts[index];
            (wallet, isCreated) = _getSaltAddress(salt);
            if(isCreated) {
                totalBalance += walletToDeposits[wallet];
            }
        }
    }

    function getNonCreatedSaltsTotalBalance(bytes32[] memory salts) external view returns(uint256 totalBalance) {
        address wallet;
        bool isCreated;
        bytes32 salt;
        for (uint32 index = 0; index < salts.length; index++) {
            salt = salts[index];
            (wallet, isCreated) = _getSaltAddress(salt);
            if(!isCreated) {
                totalBalance += wallet.balance;
            }
        }
    }

    function walletsCount() external view returns (uint256) {
        return wallets.length;
    }

    function getAllShareHolders() external view returns (address[] memory, uint8[] memory) {
        address[] memory addresses = new address[](totalShareHolders);
        uint8[] memory pcts = new uint8[](totalShareHolders);

        for (uint8 i = 0; i < totalShareHolders; i++) {
            addresses[i] = shareHolders[i].wallet;
            pcts[i] = shareHolders[i].pct;
        }
        
        return (addresses, pcts);
    }

    //Entry function
    function getSaltBalance(bytes32 salt) external view returns(address wallet, bool isCreated, uint256 balance) {
        (wallet, isCreated) = _getSaltAddress(salt);
        balance = isCreated? walletToDeposits[wallet] : wallet.balance;
    }
}