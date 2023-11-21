import React, { useEffect, useState } from 'react'
import useCoinListener from './useCoinListener'
import { COINS } from '../../../utils/c'
import { AllCoinsBalanceInfo, PriceData } from '../types'


const useWalletListener = (serverTotalBalanceInUsd: number, priceData: PriceData): AllCoinsBalanceInfo => {
    const TAG = "useDepositListener"
    const [
        hasErrorBnbTest,
        confirmedDepositsBalanceBnbTest,
        confirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBalanceBnbTest,
        unconfirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBnbTest,
        latestDepositBnbTest,
        saltBnbTest,
        paddedSaltBnbTest,
        walletBnbTest,
        walletCreatedBnbTest,
        confirmedDepositsBalanceInUsdBnbTest,
        unconfirmedDepositsBalanceInUsdBnbTest,
    ] = useCoinListener(COINS.bnb_testnet.key, COINS.bnb_testnet.decimals, COINS.bnb_testnet.requiredConfirmations, priceData)

    const [
        hasErrorBnb,
        confirmedDepositsBalanceBnb,
        confirmedDepositsBalanceInCoinBnb,
        unconfirmedDepositsBalanceBnb,
        unconfirmedDepositsBalanceInCoinBnb,
        unconfirmedDepositsBnb,
        latestDepositBnb,
        saltBnb,
        paddedSaltBnb,
        walletBnb, 
        walletCreatedBnb,
        confirmedDepositsBalanceInUsdBnb,
        unconfirmedDepositsBalanceInUsdBnb,
    ] = useCoinListener(COINS.bnb.key, COINS.bnb.decimals, COINS.bnb.requiredConfirmations, priceData)

    const [
        hasErrorEth,
        confirmedDepositsBalanceEth,
        confirmedDepositsBalanceInCoinEth,
        unconfirmedDepositsBalanceEth,
        unconfirmedDepositsBalanceInCoinEth,
        unconfirmedDepositsEth,
        latestDepositEth,
        saltEth,
        paddedSaltEth,
        walletEth, 
        walletCreatedEth,
        confirmedDepositsBalanceInUsdEth,
        unconfirmedDepositsBalanceInUsdEth,
    ] = useCoinListener(COINS.ethereum.key, COINS.ethereum.decimals, COINS.ethereum.requiredConfirmations, priceData)
    
    const [balancePendingInUsd, setBalancePendingInUsd] = useState<number>(0)
    useEffect(() => {
        setBalancePendingInUsd(
            unconfirmedDepositsBalanceInUsdBnbTest + 
            unconfirmedDepositsBalanceInUsdBnb + 
            unconfirmedDepositsBalanceInUsdBnb
        )
    }, [unconfirmedDepositsBalanceInUsdBnbTest, unconfirmedDepositsBalanceInUsdBnb, unconfirmedDepositsBalanceInUsdBnb])

    return {
        hasErrorBnbTest,
        confirmedDepositsBalanceBnbTest,
        confirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBalanceBnbTest,
        unconfirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBnbTest,
        latestDepositBnbTest,
        saltBnbTest,
        paddedSaltBnbTest,
        walletBnbTest, 
        walletCreatedBnbTest,
        confirmedDepositsBalanceInUsdBnbTest,
        unconfirmedDepositsBalanceInUsdBnbTest,

        hasErrorBnb,
        confirmedDepositsBalanceBnb,
        confirmedDepositsBalanceInCoinBnb,
        unconfirmedDepositsBalanceBnb,
        unconfirmedDepositsBalanceInCoinBnb,
        unconfirmedDepositsBnb,
        latestDepositBnb,
        saltBnb,
        paddedSaltBnb,
        walletBnb, 
        walletCreatedBnb,
        confirmedDepositsBalanceInUsdBnb,
        unconfirmedDepositsBalanceInUsdBnb,

        hasErrorEth,
        confirmedDepositsBalanceEth,
        confirmedDepositsBalanceInCoinEth,
        unconfirmedDepositsBalanceEth,
        unconfirmedDepositsBalanceInCoinEth,
        unconfirmedDepositsEth,
        latestDepositEth,
        saltEth,
        paddedSaltEth,
        walletEth, 
        walletCreatedEth,
        confirmedDepositsBalanceInUsdEth,
        unconfirmedDepositsBalanceInUsdEth,


        balanceInUsd: serverTotalBalanceInUsd, 
        balancePendingInUsd,
    }
}

export default useWalletListener