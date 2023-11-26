import { Coins } from "../components/PayFlow/types";
import { LIB_LOGO, BNB_LOGO, ETH_LOGO,  } from "./base64Images"

import WalletFactoryTestnet from '../abis/WalletFactoryTestnet.json'
import WalletFactoryBsc from '../abis/WalletFactoryBsc.json'
import WalletFactoryEth from '../abis/WalletFactoryEth.json'
import WalletFactoryGoerli from '../abis/WalletFactoryGoerli.json'
import { Theme } from "../theme.type";

export const FIREBASE_CONFIG: {[x: string]: any} = {
    apiKey: "AIzaSyBykIOPWfKmDrAC6jly4p1Hl_NsaRSntFo",
    authDomain: "my-project-223a2.firebaseapp.com",
    projectId: "my-project-223a2",
    storageBucket: "my-project-223a2.appspot.com",
    messagingSenderId: "121945247533",
    appId: "1:121945247533:web:408269d255291ea70b8da4",
    measurementId: "G-2L4CPV9S32"
}

export const LIGHT_THEME: Theme = {
    overlayBg: "rgba(0, 0, 0, 0.5)",
    widgetBg: "rgb(255, 255, 255)",
    widgetShadow: "rgba(0, 0, 0, 0.2)",
    widgetColor: "#1A202C",
    selectButton: {
      bg: "#EDF2F7",
      selectedBg: "#F7FAFC",
      color: "#A0AEC0",
      iconColor: "#A0AEC0"
    },
}
export const DARK_THEME: Theme = {
    overlayBg: "rgba(0, 0, 0, 0.5)",
    widgetBg: "rgb(24, 26, 32)",
    widgetShadow: "rgba(0, 0, 0, 0.2)",
    widgetColor: "rgba(255, 255, 255, 0.92)",
    selectButton: {
        bg: "gray.100",
        selectedBg: "gray.50",
        color: "#1A202C",
        iconColor: "gray.400"
    },
}


export const PROMISE_ID = {
    signIn: "signIn",
    getAccessToken: "getAccessToken",
    deposit: "deposit"
}

export const IS_TEST = true
export const SERVER_BASE_URL_TEST = "https://server.softbaker.com"//"http://localhost:3001"
export const SERVER_BASE_URL_LIVE = "https://server.softbaker.com"
export const PRECISION = 5
export const SDK_RETRY_INTERVAL_MINS = 0.2
export const PRICE_FETCH_INTERVAL_MINS = 10
export const COINS: Coins = {
    bnb_testnet: {
        coingecko_price_key: "binancecoin",
        disabled: !IS_TEST,
        decimals: 18,
        requiredConfirmations: 60,
        priority: 1,
        key: "bnb_testnet",
        name: "BNB(Binance testnet)",
        symbol: "tBNB",
        depositWarning: `Please make sure you send only Test BNB coin to the wallet address shown.`,
        secondsPerBlock: 3,
        logo: BNB_LOGO,
        abiData: WalletFactoryTestnet
    },
    bnb: {
        coingecko_price_key: "binancecoin",
        disabled: IS_TEST,
        decimals: 18,
        requiredConfirmations: 60,
        priority: 1,
        key: "bnb",
        symbol: "BNB",
        name: "BNB(Binance smart chain)",
        depositWarning: `Please make sure you send only BNB coin to the wallet address shown.`,
        secondsPerBlock: 3,
        logo: BNB_LOGO,
        abiData: WalletFactoryBsc
    },
    ethereum: {
        coingecko_price_key: "ethereum",
        disabled: IS_TEST,
        decimals: 18,
        requiredConfirmations: 12,
        priority: 2,
        key: "ethereum",
        symbol: "ETH",
        name: "Ethereum(Ethereum block chain)",
        depositWarning: `Please make sure you send only Ethereum coin to the wallet address shown.`,
        secondsPerBlock: 12,
        logo: ETH_LOGO,
        abiData: WalletFactoryEth
    },
    ethereum_testnet: {
        coingecko_price_key: "ethereum",
        disabled: true,
        decimals: 18,
        requiredConfirmations: 12,
        priority: 2,
        key: "ethereum_testnet",
        symbol: "tETH",
        name: "Ethereum(Goerli network)",
        depositWarning: `Please make sure you send only Test Ethereum coin to the wallet address shown.`,
        secondsPerBlock: 12,
        logo: ETH_LOGO,
        abiData: WalletFactoryGoerli
    }
}


export const SDK_NAME = "SoftbakerPay"
export const SDK_SITE = "https://softbaker.com"

export const STORAGE_KEYS = {
    ENABLED_LOG: `${SDK_NAME}_ENABLED_LOG`,
    SDK_CONFIG: `${SDK_NAME}_SDK_CONFIG`
}
export const LOGO_PATH = LIB_LOGO