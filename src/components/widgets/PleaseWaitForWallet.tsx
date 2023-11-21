import { HStack } from '@chakra-ui/react'
import React from 'react'
import Loading from './Loading'

const PleaseWaitForWallet = () => {
    return (
        <HStack display="flex" w="100%" h="30px" justifyContent="center" alignItems="center">
            <Loading color="green.500" type={Loading.TYPES.RotatingLines} />
        </HStack>
    )
}

export default PleaseWaitForWallet