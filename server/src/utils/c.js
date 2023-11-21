const WalletFactoryTestnet = require('../abis/WalletFactoryTestnet.json');
const WalletFactoryBsc = require('../abis/WalletFactoryBsc.json');
const WalletFactoryEth = require('../abis/WalletFactoryEth.json');
const WalletFactoryGoerli = require('../abis/WalletFactoryGoerli.json');

const PRECISION = 5
const PRICE_DATA_TTL_MINUTES = 5
const IS_TEST = true
const COINS = {
    bnb_testnet: {
        coingecko_price_key: "binancecoin",
        disabled: !IS_TEST,
        decimals: 18,
        requiredConfirmations: 60,
        priority: 1,
        key: "bnb_testnet",
        abiData: WalletFactoryTestnet
    },
    bnb: {
        coingecko_price_key: "binancecoin",
        disabled: IS_TEST,
        decimals: 18,
        requiredConfirmations: 60,
        priority: 1,
        key: "bnb",
        abiData: WalletFactoryBsc
    },
    ethereum: {
        coingecko_price_key: "ethereum",
        disabled: IS_TEST,
        decimals: 18,
        requiredConfirmations: 12,
        priority: 2,
        key: "ethereum",
        abiData: WalletFactoryEth
    },
    ethereum_testnet: {
        coingecko_price_key: "ethereum",
        disabled: true,
        decimals: 18,
        requiredConfirmations: 12,
        priority: 2,
        key: "ethereum_testnet",
        abiData: WalletFactoryGoerli
    }
}

module.exports = {
    PRECISION,
    PRICE_DATA_TTL_MINUTES,
    COINS
}