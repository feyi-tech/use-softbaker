import React, { useEffect, useState } from 'react'
import { Box, Divider, HStack, Text, VStack, Image, Button } from "@chakra-ui/react"
import { AllCoinsBalanceInfo, SaltBalanceConfirmation } from '../PayFlow/types'
import ModalPop from '../widgets/ModalPop'
import useFirebase from '../Firebase'
import { COINS } from '../../utils/c'

interface WalletTracker {
    walletListenerResult: AllCoinsBalanceInfo,
    defaultDepositAmount: number,
    onClose: () => void,
    deposit: (amount: number, signInTitle: string | null | undefined, signUpTitle: string | null | undefined) => Promise<SaltBalanceConfirmation>,
}

interface UnconfirmedDeposit {
    deposit: SaltBalanceConfirmation
}
const UnconfirmedDeposit: React.FC<UnconfirmedDeposit> = ({ deposit }) => {
    return (
        <VStack w="100%" justifyContent="flex-start" alignItems="center" mb="0.5rem">
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <HStack justifyContent="flex-start" alignItems="center">
                    <Image src={COINS[deposit.coin].logo} w="25px" h="25px" />
                    <Text>{COINS[deposit.coin].symbol}</Text>
                </HStack>

                <VStack justifyContent="flex-start" alignItems="center" gap="0rem !important">
                    <Text lineHeight="50%">{deposit.depositedAmountInCoin}</Text>
                    {
                        deposit.depositedAmountInUsd > 0?
                        <Text>~ ${deposit.depositedAmountInUsd.toFixed(2)}</Text> : null
                    }
                </VStack>
            </HStack>

            <Text fontStyle="italic" fontSize="11px">{deposit.remainingConfirmations} of {deposit.requiredConfirmations} confirmations remaining.</Text>

            <Box w="90%">
                <Divider />
            </Box>
        </VStack>
    )
}
const WalletTracker: React.FC<WalletTracker> = ({ walletListenerResult, defaultDepositAmount, onClose, deposit }) => {
    const { user } = useFirebase()

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

    const [totalUnconfirmedDeposits, setTotalUnconfirmedDeposits] = useState<number>(0)
    useEffect(() => {
        setTotalUnconfirmedDeposits(unconfirmedDepositsBnbTest.length + unconfirmedDepositsBnb.length + unconfirmedDepositsEth.length)
    }, [unconfirmedDepositsBnbTest, unconfirmedDepositsBnb, unconfirmedDepositsEth])

    if(defaultDepositAmount == 0) return null
    return (
        <ModalPop onClose={onClose} isOpen={true} title="Softbaker Wallet">
            <Box w="100%" display="flex" justifyContent="space-between" alignItems="flex-end" pt="8px" px={{base: "8px", md: "32px"}} 
            borderBottom="">
                <VStack justifyContent="center" alignItems="flex-start">
                    {
                        user?
                        <Box fontSize="11px">{user.email}</Box>
                        : null
                    }
                    <Box fontSize="1rem" fontWeight="bold" color="green" mt="0px !important">
                        ${balanceInUsd.toFixed(2)}
                    </Box>
                </VStack>
                <Button bg="green.500" color="#fff" 
                _hover={{
                    bg: "green.500 !important",
                    color: "#fff !important",
                    opacity: {base: "1", lg: "0.7"}
                }} 
                _active={{
                    bg: "green.500 !important",
                    color: "#fff !important"
                }} onClick={() => {
                    deposit(defaultDepositAmount, "Sign In to fund your wallet.", "Sign Up to fund your wallet.")
                    .then(() => {})
                    .catch(e => {})
                }}>
                    Fund Wallet
                </Button>
            </Box>
            <Divider mx="0px !important" mb={2} />
            {
                totalUnconfirmedDeposits > 0?
                <VStack w="100%">
                    {
                        balancePendingInUsd > 0?
                        <Text fontSize="14px">
                            You have <Text as="span" fontWeight="bold">${balancePendingInUsd.toFixed(2)} worth of {totalUnconfirmedDeposits} crypto {totalUnconfirmedDeposits > 1? "deposits" : "deposit"}</Text> awaiting confirmations.
                        </Text>
                        :
                        <Text fontSize="14px">
                            You have <Text as="span" fontWeight="bold">{totalUnconfirmedDeposits} {totalUnconfirmedDeposits > 1? "deposits" : "deposit"}</Text> awaiting confirmations.
                        </Text>
                    }
                    <Box w="100%" h="250px" overflow="auto" p="0.5rem">
                    {
                        unconfirmedDepositsBnbTest.map((deposit, index) => (
                            <UnconfirmedDeposit deposit={deposit} key={index} />
                        ))
                    }
                    {
                        unconfirmedDepositsBnb.map((deposit, index) => (
                            <UnconfirmedDeposit deposit={deposit} key={index} />
                        ))
                    }
                    {
                        unconfirmedDepositsEth.map((deposit, index) => (
                            <UnconfirmedDeposit deposit={deposit} key={index} />
                        ))
                    }
                    </Box>
                </VStack>
                :
                null
            }
        </ModalPop>
    )
}

export default WalletTracker