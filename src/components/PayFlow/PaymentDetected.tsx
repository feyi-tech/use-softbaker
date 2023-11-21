import React from "react"
import { Flex, Text } from "@chakra-ui/react"
import StatusCoin from "./StatusCoin"

interface PaymentDetected {
    amount: number, 
    symbol: string
}
const PaymentDetected: React.FC<PaymentDetected> = ({ amount, symbol }) => {

    return (
        <Flex direction="column" alignItems="center" justifyContent="center" 
            bg="green.500" w="100%" h="100%" p="1rem" textAlign="center"
        >
            <StatusCoin status="success" />
            <Text fontWeight="bold" color="white" mb={2} textAlign="center">
                <Text as ="span" fontWeight="bold" fontSize="1.5rem">{amount} {symbol}</Text>
                <Text as ="span" fontWeight="bold" fontSize="1.1rem"> deposit made!</Text>
            </Text>
            <Text fontSize="0.8rem" color="white">
                Your crypto payment was successful. The amount deposited will be available for your spending once confirmed.
            </Text>
          
        </Flex>
    )
}

export default PaymentDetected