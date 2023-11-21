import React, { useEffect, useState } from 'react';
import { 
    Box, Button, Flex, Text
} from '@chakra-ui/react';
import { whatsappLink } from '../../../utils/f';
import { CRYPTO_VENDORS } from '../../../utils/c';
import PleaseWaitForWallet from '../../widgets/PleaseWaitForWallet';

interface WhatsappDeposit {
  coinAmount: number,
  coinSymbol: string,
  wallet: string | null | undefined,
  usdAmount: number,
  fiatSymbol: string,
  fiatName: string,
  fiatLogo: any
}
const WhatsappDeposit: React.FC<WhatsappDeposit> = ({ coinAmount, coinSymbol, wallet, usdAmount, fiatSymbol, fiatName, fiatLogo }) => {
    const [vendorPhone, setVendorPhone] = useState<string>()

    const randVendor = () => {
        const vendors = []
        for(const vendor of CRYPTO_VENDORS) {
            var freq = 0
            while(freq < vendor.freq) {
                vendors.push(vendor)
                freq++
            }
        }
        return vendors[Math.floor(Math.random() * vendors.length)]

    }
    useEffect(() => {
        setVendorPhone(randVendor().phone)
    }, [])
    
  return (
    <Flex direction="column" alignItems="center" justifyContent="flex-start" w="100%" 
        h={{base: "auto", md: "100%"}} px="1rem" py="2rem" overflowY="auto">

        {
            wallet?
            <>
                <Text mt="1rem" textAlign="center" fontSize="1rem">
                    Buy {coinAmount} {coinSymbol} to deposit approximately <Text as="span" fontSize="1.5rem" fontWeight="bold">${usdAmount}</Text>
                </Text>

                <Text mb="1rem" textAlign="center" fontSize="12px">
                    Note that after purchasing {coinSymbol}, the amount credited to your wallet can be a little less or greater than <Text as="span" fontWeight="bold">${usdAmount}</Text> depending on the current price of {coinSymbol} at the time of purchase.
                </Text>

                <Button bg="green.500" color="#fff" 
                _hover={{
                    bg: "green.500 !important",
                    color: "#fff !important",
                    opacity: {base: "1", lg: "0.7"}
                }} 
                _active={{
                    bg: "green.500 !important",
                    color: "#fff !important"
                }} as="a" href={whatsappLink(vendorPhone, `Hello. I want to buy ${coinAmount} ${coinSymbol} for softbaker.\n\nMy wallet address: ${wallet}`)}>
                    {fiatLogo}Buy With {fiatName}
                </Button>
            </>
            :
            <PleaseWaitForWallet />
        }
    </Flex>
  )
}

interface FiatDeposit extends WhatsappDeposit {
    [x: string]: any
}
const FiatDeposit: React.FC<FiatDeposit> = ({ coinAmount, coinSymbol, usdAmount, fiatName, fiatSymbol, fiatLogo, wallet, ...props }) => {

  return (
    <Box h="100%" {...props}>
      <WhatsappDeposit 
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