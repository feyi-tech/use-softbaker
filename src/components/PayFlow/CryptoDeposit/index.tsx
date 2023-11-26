import React, { useEffect, useState } from 'react';
import { 
    Box, Flex, Text, Image, HStack, Select
} from '@chakra-ui/react';
import { QRCode } from 'react-qrcode-logo';
import { FaCheckCircle, FaCopy, FaExclamationTriangle } from 'react-icons/fa';
import { COINS, LOGO_PATH } from '../../../utils/c';
import { AllCoinsBalanceInfo } from '../types';
import PleaseWaitForX from '../../widgets/PleaseWaitForX';


interface CryptoDeposit {
    amount: number, 
    coin: string, setCoin: (coin: string) => void, 
    coinAmount: number, coinSymbol: string,
    wallet: string | null | undefined, setWallet: (wallet: string | null | undefined) => void,
    walletListenerResult: AllCoinsBalanceInfo, 
    [x: string]: any
}
const CryptoDeposit: React.FC<CryptoDeposit> = ({ 
    amount, coin, setCoin, coinAmount, coinSymbol,
    wallet, setWallet,
    walletListenerResult, ...props 
}) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        if(wallet) {
            navigator.clipboard.writeText(wallet);
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
            }, 3000);
        }
    }

    const { 
        hasErrorBnbTest,
        confirmedDepositsBalanceBnbTest,
        confirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBalanceBnbTest,
        unconfirmedDepositsBalanceInCoinBnbTest,
        unconfirmedDepositsBnbTest,
        latestDepositBnbTest,
        saltBnbTest,
        paddedSaltBnbTest,
        walletBnbTest, walletCreatedBnbTest,

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
    
        balanceInUsd, balancePendingInUsd,
    } = walletListenerResult

    useEffect(() => {
        if(coin) {
            if(coin == COINS.bnb_testnet.key) {
                setWallet(walletBnbTest)

            } else if(coin == COINS.bnb.key) {
                setWallet(walletBnb)

            } else if(coin == COINS.ethereum.key) {
                setWallet(walletEth)

            }
        }
    }, [coin, walletListenerResult])
    
    
    return (
        <Box px={{base: "8px", md: "32px"}} minH="250px" {...props}>
            <Flex direction="column" alignItems="center" justifyContent="center">
                <Text mb={1} textAlign="center" fontSize="14px">Scan the QR code or copy the wallet address to deposit:</Text>
                <Box mb={1}>
                    <Box pos="relative" display="inline-block" p="0px" bg="#fff" borderRadius="10px">
                    {
                        wallet?
                        <QRCode
                            value={wallet}
                            size={130}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            ecLevel="M"
                            logoImage={LOGO_PATH}
                            logoWidth={35}
                            logoHeight={35}
                            removeQrCodeBehindLogo={true}
                        />
                        :
                        <PleaseWaitForX />
                    }
                    </Box>
                </Box>

                <HStack w="100%" justifyContent="center" alignItems="center" mb={1}>
                    <Text p="0px" fontWeight="14px" textAlign="center">To deposit <b>${amount.toFixed(2)}</b>, transfer <b>{coinAmount} {coinSymbol}</b> to the wallet address.</Text>
                </HStack>
                
                <>
                {
                    wallet?
                    <Box cursor="pointer" mb={2} pos="relative" w="100%" border="1px solid #e2e8f0" borderRadius="0.5rem" 
                        onClick={handleCopy}>
                        <Text as="div" w="90%" m="0.5rem" textOverflow="clip" whiteSpace="nowrap" overflowX="hidden">
                            {wallet}
                        </Text>
                        <HStack as="div" w="auto" h="100%" bg="#D7F4E4" color="#37C978" p="0.5rem" 
                        pos="absolute" right="0" top="0" bottom="0" justifyContent="center" alignItems="center">
                        <Text as="div" mr="2px">{copySuccess? "Copied" : "Copy"}</Text>
                        <Box>
                            {copySuccess? <FaCheckCircle /> : <FaCopy />}
                        </Box>
                        </HStack>
                    </Box>
                    : null
                }
                </>

                <Box pos="relative" mb={2} w="100%">
                    <Text as="label" htmlFor="select-coin" w="100%" fontSize="10px">
                        Select a Coin(BNN or ETH)
                    </Text>
                    <Select bg="#f9f9f9" id="select-coin" cursor="pointer" onChange={(c: any) => {
                        setCoin(c.target.value)
                    }}
                    icon={
                            <Image src={COINS[coin].logo} width="24px" height="24px" />
                        }
                    >
                        {
                            Object.keys(COINS).map((c, index) => {
                                if(!COINS[c].disabled) {
                                    return (
                                        <option key={index} value={c}>{COINS[c].name}</option>
                                    )
                                }
                            })
                        }
                    </Select>
                </Box>
                

                <HStack pos="relative" w="100%" px="5px" border="1px solid #e2e8f0" borderRadius="0.5rem" 
                bg="#FFFBEB">
                    <Box>
                    <FaExclamationTriangle color="#dd6b20" size="32px" />
                    </Box>
                    <Text as="div" w="100%" fontSize="11px" p="10px 5px">
                        { COINS[coin].depositWarning }
                    </Text>
                </HStack>
                
            </Flex>
        </Box>
    );
};

export default CryptoDeposit;