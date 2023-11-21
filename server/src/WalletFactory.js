const Web3 = require("web3").default;
const { weiToEther } = require("./utils/f");
const { PRECISION } = require("./utils/c");

class WalletFactory {
    constructor(address, abi, rpcUrl, coin) {
        this.address = address;
        this.abi = abi;
        this.rpcUrl = rpcUrl;
        this.web3 = new Web3(rpcUrl);
        this.contract = new this.web3.eth.Contract(abi, address);
        this.coin = coin;
    }

    getSaltBalance(salt, blockNumber) {
        return new Promise((resolve, reject) => {
            const paddedSalt = this.web3.utils.rightPad(
                this.web3.utils.asciiToHex(salt.toLowerCase()),
                64
            );

            this.contract.methods
                .getSaltBalance(paddedSalt)
                .call({}, blockNumber || 'latest')
                .then((result) => {
                    const balanceObject = {
                        salt: salt,
                        paddedSalt: paddedSalt,
                        wallet: result.wallet,
                        isCreated: result.isCreated,
                        balance: result.balance,
                        blockNumber: blockNumber || "latest"
                    };
                    resolve(balanceObject);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getCurrentBlockNumber() {
        return new Promise(async (resolve, reject) => {
            try {
                const blockNumber = await this.web3.eth.getBlockNumber();
                resolve(blockNumber);
            } catch (error) {
                reject(error);
            }
        });
    }

    getConfirmations = async (uid, confirmations) => {
        try {
            const currentBlock = Number(await this.getCurrentBlockNumber());
            const promises = [];
            for (let i = currentBlock - confirmations; i <= currentBlock; i++) {
                promises.push(
                    new Promise(async (resolve, reject) => {
                        try {
                            const confirmation = await this.getSaltBalance(uid, i);
                            const saltBalanceConfirmation = {
                                ...confirmation,
                                coin: this.coin,
                                requiredConfirmations: confirmations,
                                remainingConfirmations: confirmations - (currentBlock - confirmation.blockNumber),
                            };

                            resolve(saltBalanceConfirmation);
                        } catch (e) {
                            resolve({error: e.message});
                        }
                    })
                );
            }

            const results = await Promise.all(promises);
            return results;
        } catch (e) {
            throw e;
        }
    };

    getConfirmationsInfo = (confirmations, decimals) => {
        var emptyBalanceInfo = {
            error: null,
            confirmedDepositsBalance: BigInt(0),
            confirmedDepositsBalanceInCoin: 0,
            unconfirmedDepositsBalance: BigInt(0),
            unconfirmedDepositsBalanceInCoin: 0,
            unconfirmedDeposits: [],
            latestDeposit: null,
            salt: null,
            paddedSalt: null,
            wallet: null,
            walletCreated: false,
        };
        var balanceInfo = { ...emptyBalanceInfo };

        for (let index = 0; index < confirmations.length; index++) {
            const confirmation = confirmations[index];
            if (confirmation.error) {
                balanceInfo = emptyBalanceInfo;
                balanceInfo.error = confirmation.error;
                break;
            }
            if (index > 0) {
                const prevConfirmation = confirmations[index - 1];
                if (confirmation.balance > prevConfirmation.balance) {
                    const newDeposit = {
                        ...confirmation,
                        depositedAmount: (confirmation.balance - prevConfirmation.balance),
                        depositedAmountInCoin: 0,
                    };
                    newDeposit.depositedAmountInCoin = weiToEther(newDeposit.depositedAmount, decimals, PRECISION);
                    balanceInfo.unconfirmedDeposits.push(newDeposit);
                    balanceInfo.unconfirmedDepositsBalance += newDeposit.depositedAmount;
                    if (index == confirmations.length - 1) {
                        balanceInfo.latestDeposit = newDeposit;
                    }
                }
                if (index == confirmations.length - 1) {
                    balanceInfo.confirmedDepositsBalance = confirmation.balance - balanceInfo.unconfirmedDepositsBalance;
                    balanceInfo.salt = confirmation.salt;
                    balanceInfo.paddedSalt = confirmation.paddedSalt;
                    balanceInfo.wallet = confirmation.wallet;
                    balanceInfo.walletCreated = confirmation.isCreated;
                }
            }
        }

        balanceInfo.confirmedDepositsBalanceInCoin = weiToEther(balanceInfo.confirmedDepositsBalance, decimals, PRECISION);
        balanceInfo.unconfirmedDepositsBalanceInCoin = weiToEther(balanceInfo.unconfirmedDepositsBalance, decimals, PRECISION);

        return balanceInfo;
    };
}

module.exports = WalletFactory;