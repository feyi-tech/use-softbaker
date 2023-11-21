import React, { useEffect, useState } from 'react'
import { Box, Divider, Flex, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react"
import { COINS, IS_TEST, LIGHT_THEME, LOGO_PATH, MIN_DEPOSIT, PRECISION, SDK_NAME, SDK_SITE } from '../../utils/c'
import PaymentDetected from './PaymentDetected'
import { AllCoinsBalanceInfo, PriceData, SaltBalanceConfirmation } from './types'
import { FaLock, FaTimes } from 'react-icons/fa'
import useFirebase from '../Firebase'
import CryptoDeposit from './CryptoDeposit'
import FiatDeposit from './FiatDeposit'
import { getDefaultCoin } from '../../utils/f'
import { Theme } from '../../theme.type'
import PleaseWaitForWallet from '../widgets/PleaseWaitForWallet'


export interface PayFlow {
    payAmount: number | null | undefined,
    walletListenerResult: AllCoinsBalanceInfo,
    priceData: PriceData,
    onSuccess: (latestDeposit: SaltBalanceConfirmation) => void,
    onClose: () => void,
    theme?: Theme
}

const PayFlow: React.FC<PayFlow> = ({ payAmount, walletListenerResult, priceData, onSuccess, onClose, theme }) => {
    const { user } = useFirebase()
    const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME)
    useEffect(() => {
        if(theme) setCurrentTheme(theme)
    }, [theme])

    const [amount, setAmount] = useState<number>(payAmount || MIN_DEPOSIT)
    const [coin, setCoin] = useState<string>(getDefaultCoin())
    const [wallet, setWallet] = useState<string | null | undefined>(null)
    

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

    const [latestDeposit, setLatestDeposit] = useState<SaltBalanceConfirmation>()

    useEffect(() => {
        if(latestDepositBnbTest) {
            setLatestDeposit(latestDepositBnbTest)

        } else if(latestDepositBnb) {
            setLatestDeposit(latestDepositBnb)

        } else if(latestDepositEth) {
            setLatestDeposit(latestDepositEth)

        }
    }, [latestDepositBnbTest, latestDepositBnb, latestDepositEth])


    if(!payAmount) return null
    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            w="100%" h="100%"
            bg={currentTheme.overlayBg}
            zIndex="9999" 
            display="flex" 
            justifyContent="center" alignItems="center"
        >
            <Flex flexDir="column" pos="relative" w="100%" h="100%" justifyContent="center" alignItems="center">
            
                <Box w="100%" maxW={{base: "100%", md: "400px"}} h={{base: "100%", md: "auto"}}
                  m="0 auto" bg={currentTheme.widgetBg} color={currentTheme.widgetColor} borderRadius={{base: "0px", md: "8px"}} pb={{base: "0px"}}
                boxShadow={{base: "none", md: `0px 0px 10px ${currentTheme.widgetShadow}`}} pos="relative" 
                pt={{base: "0.5rem", md: "0px"}} overflowY="auto" overflowX="hidden">
                  
                    <HStack w="100%" h="40px" px="0.5rem" justifyContent="flex-end" alignItems="center">
                      <Box p="0.5rem" cursor="pointer" border="1px solid #e2e8f0" 
                        borderRadius="50%" onClick={() => {
                            if(latestDeposit) {
                                onSuccess(latestDeposit)

                            } else {
                                onClose()
                            }
                        }}>
                        <FaTimes size="10px" />
                      </Box>
                    </HStack>
    
                    <Box display="flex" justifyContent="space-between" alignItems="center" pt="8px" px={{base: "8px", md: "32px"}} 
                    borderBottom="">
                        <Box display="flex" alignItems="center">
                          {
                            LOGO_PATH?
                            <Image src={LOGO_PATH} alt={SDK_NAME} 
                                width="50px" height="50px" 
                            />
                            : null
                          }
                        </Box>
                        <VStack justifyContent="center" alignItems="flex-start">
                            {
                                user?
                                <Box fontSize="11px">{user.email}</Box>
                                : null
                            }
                            <Box fontSize="1rem" fontWeight="bold" color="green" mt="0px !important">
                                ${amount.toFixed(2)}
                            </Box>
                        </VStack>
                    </Box>
                    <Divider mx="0px !important" mb={2} />
                    <Tabs isFitted>
                        <TabList>
                            <Tab>Crypto</Tab>
                            <Tab>Cash/Fiat</Tab>
                        </TabList>
                        {
                            latestDeposit?
                            <PaymentDetected amount={latestDeposit.depositedAmountInCoin} symbol={COINS[latestDeposit.coin].symbol} />
                            :
                            <TabPanels p="0px !important">
                                <TabPanel p="0px !important" w="100%" h="68vh">
                                <CryptoDeposit 
                                    amount={amount}
                                    setAmount={setAmount} 
                                    coin={coin}
                                    setCoin={setCoin}
                                    wallet={wallet}
                                    setWallet={setWallet}
                                    walletListenerResult={walletListenerResult}
                                />
                                </TabPanel>
                                <TabPanel p="0px !important" w="100%" h="68vh">
                                    {
                                        priceData[`${COINS.bnb.coingecko_price_key}_usd`]?
                                        <FiatDeposit 
                                            coinAmount={Number((amount / priceData[`${COINS.bnb.coingecko_price_key}_usd`]).toPrecision(PRECISION))}
                                            coinSymbol={COINS.bnb.symbol}
                                            wallet={IS_TEST? walletBnbTest : walletBnb}
                                            usdAmount={amount}
                                            fiatSymbol="NGN"
                                            fiatName="Naira"
                                            fiatLogo={<>&#8358;&nbsp;</>}
                                        />
                                        :
                                        <PleaseWaitForWallet />
                                    }
                                </TabPanel>
                            </TabPanels>
                        }
                    </Tabs>
                </Box>
                <Divider display={{base: "block", md: "none"}} />
                <HStack 
                  w="100%" maxW="400px" justifyContent="center" alignItems="center"
                  bg={{base: "#fff", md: "transparent"}} 
                  py="0.5rem">
                    <Box><FaLock color="black" size="12px" /> </Box>
                    <Text as="div" fontSize="12px" color={{base: "#555", md: "#fff"}}>Powered by <Text as="a" href={SDK_SITE} target="_blank" color="rgb(254,127,38)" opacity="0.7" fontWeight="bold">{SDK_NAME}</Text></Text>
                </HStack>
            </Flex>
        </Box>
    );
}

export default PayFlow