import { useState, useEffect } from "react"
import { Balance, BalanceDoc, UseBalanceUpdateResult } from "../types"
import useFirebase from "../../Firebase"
import { doc, onSnapshot, collection } from "firebase/firestore"
import axios from "axios"
import { IS_TEST, SERVER_BASE_URL_LIVE, SERVER_BASE_URL_TEST } from "../../../utils/c"
import { consoleLog } from "../../../utils/f"

interface CustomWindow extends Window {
    unsubscribeBalance?: () => void;
}
const customWindow = typeof window !== 'undefined' ? (window as CustomWindow) : null;

const useServerBalanceUpdate = (): UseBalanceUpdateResult => {
    const { user, db } = useFirebase()

    const [balanceDoc, setBalanceDoc] = useState<BalanceDoc>({
        usd_balance: 0
    })

    const getCoinBalanceKey = (coin: string) => {
        return `${coin}_balance`.toLowerCase()
    }

    const readServerCoinBalance = (coin: string): BigInt => {
        var balance = balanceDoc[getCoinBalanceKey(coin)]
        if (!balance) balance = "0"
        return BigInt(balance)
    }

    const [updatingCoins, setUpdatingCoins] = useState<string[]>([])
    const syncConfirmedBalance = (coinsInfo: {[x: string]: BigInt}) => {
        const coins = []
        const updating = []
        
        for(const coin of Object.keys(coinsInfo)) {
            if ((coinsInfo[coin] as any) > readServerCoinBalance(coin)) {
                coins.push(coin)
                updating.push(`${coin}:${coinsInfo[coin].toString()}`)
            }
        }
        if(coins.length > 0) {
            //Keep track of the coins being synced with the values being synced tp avoid multiple sync request
            setUpdatingCoins(updating)
            //Send sync request for the coins that needs syncing
            updateBalanceDoc(coins)
            .catch(e => {
                //errorCoins contain the coins that failed during balance update
                var errorCoins = e?.response?.data?.errorCoins
                if(errorCoins) {
                    const coinsOnly = errorCoins.map((coinData: {error: string, coin: string}) => coinData.coin)
                    errorCoins = coinsOnly
                } else {
                    errorCoins = Object.keys(coinsInfo)
                }
                //Get the current track of coins being synced. Might have changed by another call of "syncConfirmedBalance" 
                var updatingState = [...updatingCoins]
                //Loop through the coins being synced
                for(const coin of errorCoins) {
                    //Get the coin/balance being synced
                    const coinState = `${coin}:${coinsInfo[coin].toString()}`
                    //If the state still exist
                    if (updatingState.includes(coinState)) {
                        //Remove it so it can be available for syncing again
                        updatingState.splice(updatingState.indexOf(coinState), 1)
                    }
                }
                setUpdatingCoins(updatingState)
            })
        }
    }

    const updateBalanceDoc = (coins: string[]) => {
        return new Promise((resolve, reject) => {
            if(!user) {
                reject({error: "No User"})

            } else {
                user.getIdToken().then((authToken) => {
                    axios.post(`${IS_TEST? SERVER_BASE_URL_TEST : SERVER_BASE_URL_LIVE}/update_balance`, {
                        coins
                    },
                    {
                      headers: {
                        Authorization: authToken,
                      },
                    })
                    .then(result => {
                        consoleLog("updateBalanceDoc:result ", result)
                        resolve(null)
                    })
                    .catch((error: Error) => {
                        consoleLog("updateBalanceDoc:error ", error)
                        reject(error)
                    })
                });
            }
        })
    }

    useEffect(() => {
        if (!user || !db) {
            setBalanceDoc({
                usd_balance: 0
            });
            if (customWindow && customWindow.unsubscribeBalance) {
                try {
                    customWindow.unsubscribeBalance();
                } catch (e) {}
            }
            return;
        }

        const unsubscribe = onSnapshot(doc(collection(db, "wallets"), user.uid), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as BalanceDoc;
                setBalanceDoc(data);
            }
        });

        if (customWindow) {
            customWindow.unsubscribeBalance = unsubscribe;
        }

        return () => unsubscribe();
    }, [user, db])

    return {
        usdBalance: balanceDoc.usd_balance,
        syncConfirmedBalance
    }
}

export default useServerBalanceUpdate
