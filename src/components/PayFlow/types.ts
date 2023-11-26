
export interface Doc {
    [x: string]: any
}

export interface Tool {
    id: string,
    name: string,
    isActive: boolean,
    siteLogoUrl: string,
    siteUrl: string,
    desktopVideoUrl: string,
    mobileVideoUrl: string,
}
export interface Vendor {
    name: string,
    number: string,
    freq: number
}
export interface SdkConfig {
    ttl_days: number,
    valid_till: number,
    min_deposit: number,
    min_vendor_deposit: number,
    parent_site_home: string,
    contact_link: string,
    tools: Tool[],
    vendors: Vendor[]
}

export interface Coins {
    [x: string]: {
        coingecko_price_key: string,
        disabled: boolean,
        key: string,
        symbol: string,
        decimals: number,
        requiredConfirmations: number,
        priority: number,
        name: string,
        depositWarning: string,
        secondsPerBlock: number,
        logo: string,
        abiData: {
            rpcUrl: string,
            chainId: number,
            address: string,
            abi: {}[]
            [x: string]: any
        }
    }
}

export interface UseBalanceUpdateResult {
    usdBalance: number,
    syncConfirmedBalance: (coinsInfo: {[x: string]: BigInt}) => void
}

export interface BalanceDoc {
    usd_balance: number,
    [coinXConfirmedBalance: string]: any
}

export interface PriceData {
    [coinPrice: string]: number
}

export interface Balance { 
    loading: boolean,
    ethWallet: string | null | undefined, ethWalletContracted: boolean,
    bnbWallet: string | null | undefined, bnbWalletContracted: boolean,
    ethBalance: number, ethBalanceInUsd: number
    bnbBalance: number, bnbBalanceInUsd: number
    ethBalancePending: number, ethBalancePendingInUsd: number
    bnbBalancePending: number, bnbBalancePendingInUsd: number,
    balanceInUsd: number, balancePendingInUsd: number
}

export interface SaltBalanceInfo {
    salt: string,
    paddedSalt: string,
    wallet: string,
    isCreated: boolean,
    balance: BigInt,
    blockNumber: number | string
}
export interface SaltBalanceConfirmation extends SaltBalanceInfo {
    depositedAmount: BigInt,
    depositedAmountInCoin: number,
    remainingConfirmations: number,
    requiredConfirmations: number,
    coin: string,
    depositedAmountInUsd: number,
}
export interface BalanceInfo {
    hasError: boolean,
    confirmedDepositsBalance: BigInt,
    confirmedDepositsBalanceInCoin: number,
    unconfirmedDepositsBalance: BigInt,
    unconfirmedDepositsBalanceInCoin: number,
    unconfirmedDeposits: SaltBalanceConfirmation[],
    latestDeposit: SaltBalanceConfirmation | null | undefined,
    salt: string | null | undefined,
    paddedSalt: string | null | undefined,
    wallet: string | null | undefined,
    walletCreated: boolean,
    confirmedDepositsBalanceInUsd: number,
    unconfirmedDepositsBalanceInUsd: number,
}

export interface AllCoinsBalanceInfo {
    hasErrorBnbTest: boolean,
    confirmedDepositsBalanceBnbTest: BigInt,
    confirmedDepositsBalanceInCoinBnbTest: number,
    unconfirmedDepositsBalanceBnbTest: BigInt,
    unconfirmedDepositsBalanceInCoinBnbTest: number,
    unconfirmedDepositsBnbTest: SaltBalanceConfirmation[],
    latestDepositBnbTest: SaltBalanceConfirmation | null | undefined,
    saltBnbTest: string | null | undefined,
    paddedSaltBnbTest: string | null | undefined,
    walletBnbTest: string | null | undefined,
    walletCreatedBnbTest: boolean,
    confirmedDepositsBalanceInUsdBnbTest: number,
    unconfirmedDepositsBalanceInUsdBnbTest: number,

    hasErrorBnb: boolean,
    confirmedDepositsBalanceBnb: BigInt,
    confirmedDepositsBalanceInCoinBnb: number,
    unconfirmedDepositsBalanceBnb: BigInt,
    unconfirmedDepositsBalanceInCoinBnb: number,
    unconfirmedDepositsBnb: SaltBalanceConfirmation[],
    latestDepositBnb: SaltBalanceConfirmation | null | undefined,
    saltBnb: string | null | undefined,
    paddedSaltBnb: string | null | undefined,
    walletBnb: string | null | undefined,
    walletCreatedBnb: boolean,
    confirmedDepositsBalanceInUsdBnb: number,
    unconfirmedDepositsBalanceInUsdBnb: number,

    hasErrorEth: boolean,
    confirmedDepositsBalanceEth: BigInt,
    confirmedDepositsBalanceInCoinEth: number,
    unconfirmedDepositsBalanceEth: BigInt,
    unconfirmedDepositsBalanceInCoinEth: number,
    unconfirmedDepositsEth: SaltBalanceConfirmation[],
    latestDepositEth: SaltBalanceConfirmation | null | undefined,
    saltEth: string | null | undefined,
    paddedSaltEth: string | null | undefined,
    walletEth: string | null | undefined,
    walletCreatedEth: boolean,
    confirmedDepositsBalanceInUsdEth: number,
    unconfirmedDepositsBalanceInUsdEth: number,


    balanceInUsd: number, balancePendingInUsd: number,
}