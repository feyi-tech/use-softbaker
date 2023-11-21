import React, { useState } from 'react'
import { User } from 'firebase/auth'
import DrawerPop from '../widgets/DrawerPop'
import { Box, Image, Text, VStack } from "@chakra-ui/react"
import SignInView from "./SignInView"
import SignUpView from "./SignUpView"
import { LOGO_PATH } from '../../utils/c'
import Link from '../widgets/Link'

interface AuthView {
    show: boolean,
    signInTitle: string, 
    signUpTitle: string,
    onSuccess: (user: User) => void,
    onError: (error: any) => void
}
const AuthView: React.FC<any> = ({ show, signInTitle, signUpTitle, onSuccess, onError }) => {
    const [showSignIn, setShowSignIn] = useState<boolean>(true)

    const handleAuthLinkClick = (e: any) => {
        e.preventDefault()
        setShowSignIn(!showSignIn)
    }

    if(!show) return null
    return (
        <DrawerPop title={`Softbaker Authentication`} 
          isOpen={true} onClose={() => {
            onError(new Error("closed"))
          }} placement="bottom" height="95vh" bg="#122 !important" color="#fff !important">
            <Box minH="60vh" w="100%" maxW="700px" 
                p={{base: "15px 15px", md: "50px 80px"}} m="15px auto">
                {
                    showSignIn? 
                    <>
                        <VStack w="100%" justifyContent="flex-start" alignItems="center">
                            <Image src={LOGO_PATH} h="48px" w="auto" />
                            <Text fontSize="14px" mb="1.5rem !important" textAlign="center">
                                {signInTitle}
                            </Text>
                        </VStack>
                        <SignInView onAuthDone={onSuccess} /> 
                    </>
                    : 
                    <>
                        <VStack w="100%" justifyContent="flex-start" alignItems="center">
                            <Image src={LOGO_PATH} h="48px" w="auto" />
                            <Text fontSize="14px" mb="1.5rem !important" textAlign="center">
                                {signUpTitle}
                            </Text>
                        </VStack>
                        <SignUpView onAuthDone={onSuccess} /> 
                    </>
                }
                <Text textAlign="center" fontSize="14px">
                    {
                        showSignIn?
                        <>Don't have an account yet? <Link onClick={handleAuthLinkClick}>Sign up here.</Link></>
                        :
                        <>Already have an account? <Link onClick={handleAuthLinkClick}>Log in here.</Link></>
                    }
                </Text>
            </Box>
        </DrawerPop>
    )
}

export default AuthView