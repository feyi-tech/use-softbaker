import { useEffect, useState } from "react"
import { PriceData } from "../types"
import axios from "axios"
import { PRICE_FETCH_INTERVAL_MINS } from "../../../utils/c"

const usePriceData = () => {
    const [priceData, setPriceData] = useState<PriceData>({})
    const [priceFetchStarted, setPriceFetchStarted] = useState<boolean>(false)

    useEffect(() => {
        if(!priceFetchStarted) {
            setPriceFetchStarted(true)
            fetchPrice()
        }
    }, [])

    const fetchPrice = async () => {
        try {
            const priceData = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,ethereum&vs_currencies=usd'
            );
          
            // Create or update the cache document with the new price data, TTL, and last_update
            const priceDataState: PriceData = {}
            for(const key of Object.keys(priceData.data)) {
                priceDataState[`${key}_usd`] = priceData.data[key].usd
            }
            setPriceData(priceDataState)
            console.log("fetchPrice.data: ", priceDataState)
            setTimeout(() => {
                fetchPrice()
            }, PRICE_FETCH_INTERVAL_MINS * 60 * 1000);

        } catch(e: any) {
            console.log("fetchPrice.Error: ", e.message)
            setTimeout(() => {
                fetchPrice()
            }, 10000);
        }
    }

    return priceData
}

export default usePriceData