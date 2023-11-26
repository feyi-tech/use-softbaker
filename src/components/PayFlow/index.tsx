import React, { useEffect, useState } from 'react'
import { Box, Divider, Flex, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react"
import { COINS, IS_TEST, LIGHT_THEME, LOGO_PATH, PRECISION, SDK_NAME, SDK_SITE } from '../../utils/c'
import PaymentDetected from './PaymentDetected'
import { AllCoinsBalanceInfo, PriceData, SaltBalanceConfirmation, Vendor } from './types'
import { FaEdit, FaLock, FaPen, FaTimes } from 'react-icons/fa'
import useFirebase from '../Firebase'
import CryptoDeposit from './CryptoDeposit'
import FiatDeposit from './FiatDeposit'
import { getDefaultCoin } from '../../utils/f'
import { Theme } from '../../theme.type'
import PleaseWaitForX from '../widgets/PleaseWaitForX'
import AmountEditor from './AmountEditor'


export interface PayFlow {
    show: boolean,
    payAmount: number | null | undefined,
    walletListenerResult: AllCoinsBalanceInfo,
    priceData: PriceData,
    vendors?: Vendor[] | null,
    minDeposit: number,
    minVendorDeposit: number
    onSuccess: (latestDeposit: SaltBalanceConfirmation) => void,
    onClose: () => void,
    theme?: Theme
}

const PayFlow: React.FC<PayFlow> = ({ show, payAmount, walletListenerResult, priceData, vendors, minDeposit, minVendorDeposit, onSuccess, onClose, theme }) => {
    const { user } = useFirebase()
    const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME)
    useEffect(() => {
        if(theme) setCurrentTheme(theme)
    }, [theme])

    const [amount, setAmount] = useState<number>(payAmount || 0)
    const [minDepositLoaded, setMinDepositLoaded] = useState<boolean>(false)
    const [coin, setCoin] = useState<string>(getDefaultCoin())
    const [wallet, setWallet] = useState<string | null | undefined>(null)
    const [editAmount, setEditAmount] = useState<boolean>(true)

    useEffect(() => {
        if(minDeposit > 0 && !minDepositLoaded) {
            setMinDepositLoaded(true)
            setAmount(!payAmount || payAmount < minDeposit? minDeposit : payAmount)
        }
    }, [minDeposit])

    useEffect(() => {
        console.log(`${SDK_NAME}:/PayFlow.amount: `, amount)
    }, [amount])
    

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


    if(!show) return null
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
                      <Box p="0.5rem" cursor="pointer" border="1px solid #e2e8f0" _hover={{opacity: 0.7}} 
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
                            <HStack justifyContent="flex-start" alignItems="center" m="0px !important">
                                <Box fontSize="1rem" fontWeight="bold" color="green" mt="0px !important">
                                    ${amount.toFixed(2)}
                                </Box>
                                {
                                    editAmount? null :
                                    <Box p="0px" ml="5px !important" cursor="pointer" onClick={() => {
                                        setEditAmount(true)
                                    }}>
                                        <FaPen />
                                    </Box>
                                }
                            </HStack>
                        </VStack>
                    </Box>
                    <Divider mx="0px !important" mb={2} />
                    {
                        minDeposit == 0 || minVendorDeposit == 0?
                        <PleaseWaitForX />
                        :
                        editAmount?
                        <AmountEditor amount={amount} minAmount={minDeposit} onAmountValid={(amount) => {
                            setAmount(amount)
                        }} onSubmit={() => {
                            setEditAmount(false)
                        }} />
                        :
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
                                        coin={coin}
                                        setCoin={setCoin}
                                        coinSymbol={COINS[coin].symbol}
                                        coinAmount={Number((amount / priceData[`${COINS[coin].coingecko_price_key}_usd`]).toPrecision(PRECISION))}
                                        wallet={wallet}
                                        setWallet={setWallet}
                                        walletListenerResult={walletListenerResult}
                                    />
                                    </TabPanel>
                                    <TabPanel p="0px !important" w="100%" h="68vh">
                                        {
                                            priceData[`${COINS.bnb.coingecko_price_key}_usd`]?
                                            <FiatDeposit 
                                                vendors={vendors}
                                                minVendorCoinAmount={Number((minVendorDeposit / priceData[`${COINS.bnb.coingecko_price_key}_usd`]).toPrecision(PRECISION))}
                                                minVendorUSDAmount={minVendorDeposit}
                                                coinAmount={Number((amount / priceData[`${COINS.bnb.coingecko_price_key}_usd`]).toPrecision(PRECISION))}
                                                coinSymbol={COINS.bnb.symbol}
                                                wallet={IS_TEST? walletBnbTest : walletBnb}
                                                usdAmount={amount}
                                                fiatSymbol="NGN"
                                                fiatName="Naira"
                                                fiatLogo={<>&#8358;&nbsp;</>}
                                            />
                                            :
                                            <PleaseWaitForX />
                                        }
                                    </TabPanel>
                                </TabPanels>
                            }
                        </Tabs>
                    }
                </Box>
            </Flex>
        </Box>
    );
}

export default PayFlow