import React, { useEffect, useState } from 'react';
import { 
    Box, Button, Flex, Text
} from '@chakra-ui/react';
import { whatsappLink } from '../../../utils/f';
import PleaseWaitForX from '../../widgets/PleaseWaitForX';
import { Vendor } from '../types';

interface WhatsappDeposit {
  vendors?: Vendor[] | null,
  coinAmount: number,
  coinSymbol: string,
  wallet: string | null | undefined,
  usdAmount: number,
  fiatSymbol: string,
  fiatName: string,
  fiatLogo: any,
  minVendorCoinAmount: number,
  minVendorUSDAmount: number
}
const WhatsappDeposit: React.FC<WhatsappDeposit> = ({ 
    vendors, coinAmount, coinSymbol, wallet, usdAmount, fiatSymbol, fiatName, fiatLogo,
    minVendorCoinAmount, minVendorUSDAmount
}) => {
    const [vendorPhone, setVendorPhone] = useState<string>()
    const [coinAmountState, setCoinAmount] = useState<number>(0)
    const [usdAmountState, setUsdAmount] = useState<number>(0)

    const randVendor = (cryproVendors: Vendor[]) => {
        const vendors = []
        for(const vendor of cryproVendors) {
            var freq = 0
            while(freq < vendor.freq) {
                vendors.push(vendor)
                freq++
            }
        }
        return vendors[Math.floor(Math.random() * vendors.length)]

    }

    useEffect(() => {
        if(vendors && vendors.length > 0) setVendorPhone(randVendor(vendors).number) 
    }, [vendors])

    useEffect(() => {
        if(usdAmount < minVendorUSDAmount) {
            setCoinAmount(minVendorCoinAmount)
            setUsdAmount(minVendorUSDAmount)

        } else {
            setCoinAmount(coinAmount)
            setUsdAmount(usdAmount)
        }
    }, [usdAmount, minVendorUSDAmount])
    
  return (
    <Flex direction="column" alignItems="center" justifyContent="flex-start" w="100%" 
        h={{base: "auto", md: "100%"}} px="1rem" py="2rem" overflowY="auto">

        {
            wallet && vendorPhone?
            <>
                <Text mt="1rem" textAlign="center" fontSize="1rem">
                    Buy {coinAmountState} {coinSymbol} to deposit approximately <Text as="span" fontSize="1.5rem" fontWeight="bold">${usdAmountState}</Text>
                </Text>

                <Text mb="1rem" textAlign="center" fontSize="12px">
                    Note that after purchasing {coinSymbol}, the amount credited to your wallet can be a little less or greater than <Text as="span" fontWeight="bold">${usdAmountState}</Text> depending on the current price of {coinSymbol} at the time of purchase.
                </Text>

                <Button bg="green.500" color="#fff" mb="0.5rem" 
                _hover={{
                    bg: "green.500 !important",
                    color: "#fff !important",
                    opacity: {base: "1", lg: "0.7"}
                }} 
                _active={{
                    bg: "green.500 !important",
                    color: "#fff !important"
                }} as="a" href={whatsappLink(vendorPhone, `Hello. I want to buy ${coinAmountState} ${coinSymbol} for my Softbaker account.\n\nMy wallet address is: ${wallet}`)}>
                    {fiatLogo}Buy With {fiatName}
                </Button>

                {
                    usdAmount < minVendorUSDAmount?
                    <Text fontSize="12px" textAlign="center">
                        The minimum amount that can be deposited by coin purchase via Cash/Fiat is ${minVendorUSDAmount}
                    </Text> : null
                }
            </>
            :
            <PleaseWaitForX />
        }
    </Flex>
  )
}

interface FiatDeposit extends WhatsappDeposit {
    [x: string]: any
}
const FiatDeposit: React.FC<FiatDeposit> = ({ 
    vendors, coinAmount, coinSymbol, usdAmount, fiatName, fiatSymbol, fiatLogo, wallet,
    minVendorCoinAmount, minVendorUSDAmount, 
    ...props 
}) => {

  return (
    <Box h="100%" {...props}>
      <WhatsappDeposit 
        vendors={vendors}
        minVendorCoinAmount={minVendorCoinAmount} 
        minVendorUSDAmount={minVendorUSDAmount}
        coinAmount={coinAmount}
        coinSymbol={coinSymbol}
        usdAmount={usdAmount}
        fiatName={fiatName}
        fiatSymbol={fiatSymbol}
        fiatLogo={fiatLogo}
        wallet={wallet}
      />
    </Box>
  );
};

export default FiatDeposit;