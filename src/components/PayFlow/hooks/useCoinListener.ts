import React, { useEffect, useState }  from 'react'
import { COINS, PRECISION, PROMISE_ID } from '../../../utils/c'
import WalletFactory from '../WalletFactory'
import { promiseResolvePending, resolvePromise, weiToEther } from '../../../utils/f';
import { BalanceInfo, PriceData, SaltBalanceConfirmation } from '../types';
import useFirebase from '../../Firebase';


const useCoinListener = (coin: string, decimals: number, requiredConfirmations: number, priceData: PriceData): [
    boolean,
    BigInt,
    number,
    BigInt,
    number,
    SaltBalanceConfirmation[],
    SaltBalanceConfirmation | null | undefined,
    string | null | undefined,
    string | null | undefined,
    string | null | undefined,
    boolean,
    number,
    number
] => {
    const TAG = "useCoinListener"
    const EMPTY_BALANCE_INFO: BalanceInfo = {
        hasError: false,
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
        confirmedDepositsBalanceInUsd: 0,
        unconfirmedDepositsBalanceInUsd: 0,
    }

    const { user } = useFirebase()
    const [currentUid, setCurrentUid] = useState<string | null | undefined>()
    const [factory, setFactory] = useState<WalletFactory | null | undefined>()
    const [confirmationBalanceInfo, setConfirmationBalanceInfo] = useState<BalanceInfo>(EMPTY_BALANCE_INFO)

    const updateConfirmationsInfo = (confirmationsInfo: BalanceInfo) => {

        setConfirmationBalanceInfo(confirmationsInfo)
        console.log("updateConfirmationsInfo: ", confirmationsInfo)
    }

    useEffect(() => {
        if(coin && user && currentUid != user.uid && !COINS[coin].disabled) {
            setCurrentUid(user.uid)
            if(factory) factory.stopSubscriptions()
            if(!factory) {
                // Clean up on component unmount
                const walletFactory = new WalletFactory(
                    COINS[coin].abiData.address, COINS[coin].abiData.abi, COINS[coin].abiData.rpcUrl,
                    COINS[coin].secondsPerBlock
                )
                setFactory(factory)
                initCoin(user.uid, coin, walletFactory)
                return () => {
                    walletFactory.stopSubscriptions();
                };

            } else {
                initCoin(user.uid, coin, factory)
            }

        } else if(!user) {
            updateConfirmationsInfo(EMPTY_BALANCE_INFO)
            setCurrentUid(null)
        }
    }, [coin, user]);
    
    const initCoin = (uid: string, coinKey: string, factory: WalletFactory) => {
        factory.getSaltBalance(uid)
        .then(async ({ wallet, isCreated, balance, salt, paddedSalt }) => {
            setConfirmationBalanceInfo({
                ...confirmationBalanceInfo,
                salt, paddedSalt, wallet,
                walletCreated: isCreated
            })

            const currentBlock = Number(await factory.getCurrentBlockNumber());
            const confirmations = await getConfirmations(uid, currentBlock, requiredConfirmations, coinKey, factory)
            const confirmationsInfo = getConfirmationsInfo(confirmations)
            updateConfirmationsInfo(confirmationsInfo)

            factory.startBlockListener(async blockNumber => {
                console.log("startBlockListener.blockNumber", blockNumber)
                if(user) {
                    try {
                        const confirmations = await getConfirmations(user.uid, blockNumber, requiredConfirmations, coinKey, factory)
                        const confirmationsInfo = getConfirmationsInfo(confirmations)
                        updateConfirmationsInfo(confirmationsInfo)
    
                    } catch(e: any) {
                        console.log(`${TAG}/startBlockListener/error/ => ${e.message}`)
                    }

                } else {
                    updateConfirmationsInfo(EMPTY_BALANCE_INFO)
                }
            }, currentBlock)

        })
        .catch(e => {
            console.log(`${TAG}/e1/${coinKey} => ${e.message}`)
            setTimeout(() => {
                initCoin(uid, coinKey, factory);
            }, 5000);
        })
    }

    const getConfirmations = (uid: string, currentBlock: number, confirmations: number, coin: string, factory: WalletFactory): Promise<SaltBalanceConfirmation[]> => {
        return new Promise(async (resolve, reject) => {
            const promises = []
            //Check the balance in each block, starting from the past blocks to the current block
            for(var i = currentBlock - confirmations; i <= currentBlock; i++) {
                //console.log("i: ", i, confirmations - (currentBlock - i))
                promises.push(new Promise(async (resolve, reject) => {
                    try {
                        const confirmation = await factory.getSaltBalance(uid, i)
                        const saltBalanceConfirmation: SaltBalanceConfirmation = {
                            ...confirmation,
                            coin,
                            requiredConfirmations: confirmations,
                            remainingConfirmations: confirmations - (currentBlock - (confirmation.blockNumber as number))
                        } as SaltBalanceConfirmation
                        
                        /*
                        if([7,8,9,40,55,56].includes(saltBalanceConfirmation.remainingConfirmations)) {
                            saltBalanceConfirmation.balance = [
                                BigInt("1000000000000000000"),
                                BigInt("1000000000000000"),
                                BigInt("10000000000000"),
                            ][Math.floor(Math.random() * 3)]
                        }*/
                        
                        resolve(saltBalanceConfirmation)
        
                    } catch(e: any) {
                        //console.log("Error: ", e.message)
                        resolve({})
                    }
        
                }))
            }
            try {
                resolve(await Promise.all(promises) as SaltBalanceConfirmation[])

            } catch(e: any) {
                reject(e)
            }
        })
    }
    const getConfirmationsInfo = (confirmations: SaltBalanceConfirmation[]) => {
        var emptyBalanceInfo: BalanceInfo = {
            hasError: false,
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
            confirmedDepositsBalanceInUsd: 0,
            unconfirmedDepositsBalanceInUsd: 0,
        }
        var balanceInfo = {...emptyBalanceInfo}
        const coinPrice = priceData[`${COINS[coin].coingecko_price_key}_usd`]
        for (let index = 0; index < confirmations.length; index++) {
            const confirmation = confirmations[index];
            if(Object.keys(confirmation).length == 0) {
                balanceInfo = emptyBalanceInfo
                balanceInfo.hasError = true
                break
            }
            if(index > 0) {
                const prevConfirmation = confirmations[index - 1];
                if(confirmation.balance > prevConfirmation.balance) {
                    const newDeposit: SaltBalanceConfirmation = {
                        ...confirmation,
                        depositedAmount: ((confirmation.balance as any) - (prevConfirmation.balance as any)) as any,
                        depositedAmountInCoin: 0,
                        depositedAmountInUsd: 0,
                    }
                    newDeposit.depositedAmountInCoin = weiToEther(newDeposit.depositedAmount, decimals, PRECISION)
                    balanceInfo.unconfirmedDeposits.push(newDeposit)
                    balanceInfo.unconfirmedDepositsBalance += newDeposit.depositedAmount as any

                    
                    if(coinPrice) {
                        newDeposit.depositedAmountInUsd = newDeposit.depositedAmountInCoin * coinPrice
                        //console.log("fetchPrice.coinPrice", coinPrice, newDeposit.depositedAmountInUsd, newDeposit.depositedAmountInCoin)
                    }

                    if(index == confirmations.length - 1) {
                        balanceInfo.latestDeposit = newDeposit
                    }
                }
                if(index == confirmations.length - 1) {
                    balanceInfo.confirmedDepositsBalance = ((confirmation.balance as any) - (balanceInfo.unconfirmedDepositsBalance as any)) as any
                    balanceInfo.salt = confirmation.salt
                    balanceInfo.paddedSalt = confirmation.paddedSalt
                    balanceInfo.wallet = confirmation.wallet
                    balanceInfo.walletCreated = confirmation.isCreated
                }
            }
        }
    
        balanceInfo.confirmedDepositsBalanceInCoin = weiToEther(balanceInfo.confirmedDepositsBalance, decimals, PRECISION)
        balanceInfo.unconfirmedDepositsBalanceInCoin = weiToEther(balanceInfo.unconfirmedDepositsBalance, decimals, PRECISION)
        if(coinPrice) {
            balanceInfo.confirmedDepositsBalanceInUsd = balanceInfo.confirmedDepositsBalanceInCoin * coinPrice
            balanceInfo.unconfirmedDepositsBalanceInUsd = balanceInfo.unconfirmedDepositsBalanceInCoin * coinPrice
        }

        if(balanceInfo.latestDeposit && promiseResolvePending(PROMISE_ID.deposit)) {
            //resolvePromise(PROMISE_ID.deposit, balanceInfo.latestDeposit)
        }
        return balanceInfo
    }


    return [
        confirmationBalanceInfo.hasError,
        confirmationBalanceInfo.confirmedDepositsBalance,
        confirmationBalanceInfo.confirmedDepositsBalanceInCoin,
        confirmationBalanceInfo.unconfirmedDepositsBalance,
        confirmationBalanceInfo.unconfirmedDepositsBalanceInCoin,
        confirmationBalanceInfo.unconfirmedDeposits,
        confirmationBalanceInfo.latestDeposit,
        confirmationBalanceInfo.salt,
        confirmationBalanceInfo.paddedSalt,
        confirmationBalanceInfo.wallet,
        confirmationBalanceInfo.walletCreated,
        confirmationBalanceInfo.confirmedDepositsBalanceInUsd,
        confirmationBalanceInfo.unconfirmedDepositsBalanceInUsd,
    ]
}

export default useCoinListener