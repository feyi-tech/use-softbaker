import React, { useEffect, useState } from "react"
import { Text, VStack } from "@chakra-ui/react"
import AppButton from "../widgets/AppButton"
import InputBox from "../widgets/InputBox"
import Link from "../widgets/Link"
import { isValidEmail, nullOrEmpty } from "../../utils/f"
import Swal from 'sweetalert2'
import { FirebaseError } from "firebase/app"
import { User, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import useFirebase from "."


export interface SignView {
    onAuthDone?: (user: User) => void,
    [x: string]: any
}

const SignInView: React.FC<SignView> = ({ onAuthDone, ...props }) => {

    const { auth } = useFirebase()

    const [ email, setEmail ] = useState<string>("")
    const [ emailError, setEmailError ] = useState<string>()

    const [ password, setPassword ] = useState<string>("")
    const [ passwordError, setPasswordError ] = useState<string>()

    const [ requesting, setRequesting ] = useState<boolean>()

    const clearErrors = () => {
        setEmailError("")
        setPasswordError("")
    }
    const forgotPass = (e: Event) => {
        e.preventDefault()
        clearErrors()
        if(nullOrEmpty(email)) {
          setEmailError('Please enter your email address, then click "Forgot password".')
    
        } else if(!isValidEmail(email)) {
          setEmailError("Please enter a valid email address.")
    
        } else if(auth) {
            let pass = password
            setPassword("")
            setRequesting(true)
            const codeSettings = {
                url: window?.location?.href
            }
            sendPasswordResetEmail(auth, email, codeSettings)
            .then(() => {
                Swal.fire({
                icon: "info",
                text: isValidEmail(email)? 
                    `A password reset email has been sent to ${email}. Check your inbox or spam folder for the email sent.`
                    :
                    `A password reset code has been sent to ${email}. Check your messages for the code sent.` 
                })
                setRequesting(false)
                setPassword(pass)
            })
            .catch((e: FirebaseError) => {
                let msg
                if(e.code == 'auth/user-not-found') {
                msg = "The account is invalid."
        
                } else {
                msg = e.message
                }
                Swal.fire({
                icon: "error",
                text: msg
                })
                setRequesting(false)
                setPassword(pass)
            })
        }
    }

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        clearErrors()
        var hasError = false
    
        //Check email
        if(nullOrEmpty(email)) {
          hasError = true
          setEmailError("Please enter your email address.")
    
        } else if(!isValidEmail(email)) {
            hasError = true
            setEmailError("Please enter a valid email address.")
        }
    
        //Check password
        if(nullOrEmpty(password)) {
          hasError = true
          setPasswordError("Please enter your password.")
    
        }
    
        if(!hasError && auth) {
          setRequesting(true)
          signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setRequesting(false)
            if(userCredential && onAuthDone) {
              onAuthDone(userCredential.user)
            }
          })
          .catch((e) => {
            let msg
            if(e.code == "auth/wrong-password") {
              msg = "Wrong email address or password. Check your email address and password, then try again."
    
            } else if(e.code == 'auth/user-not-found') {
              msg = "Wrong email address or password. Check your email address and password, then try again."
    
            } else {
              msg = e.message
            }
            Swal.fire({
              icon: "error",
              text: msg
            })
            setRequesting(false)
          })
        }
    
    }

    return (
        <VStack>
            <InputBox type={InputBox.TYPES.email} 
                title={"Email"} 
                placeholder={"Enter your email address."} 
                mb={2} 
                value={email}
                onChange={(e) => setEmail(e)}
                errorMessage={emailError}
            />

            <InputBox type={InputBox.TYPES.password} 
                title={"Password"} 
                placeholder={"Enter your password"} 
                mb={2}  
                value={password}
                onChange={e => {setPassword(e)}}
                errorMessage={passwordError}
            />

            <Text alignSelf="flex-end">
                <Link onClick={forgotPass} disabled={requesting} 
                fontStyle={requesting && !password? "italic" : "normal"}>
                    {requesting && nullOrEmpty(password)? "Please wait..." : "Forgot password?"}
                </Link>
            </Text>

            <AppButton w="100%" alignSelf="flex-start" id="recaptcha-container" type="submit" 
            onClick={handleSubmit} 
            disabled={requesting} fontStyle={requesting && password? "italic" : "normal"} 
            mt={"1rem !important"} mb={"1.5rem !important"}>
                {requesting && !nullOrEmpty(password)? "Please wait..." : "Sign in"}
            </AppButton>
        </VStack>
    )

}

export default SignInView