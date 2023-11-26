import React, { useEffect, useState } from "react"
import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import AppButton from "../widgets/AppButton"
import InputBox from "../widgets/InputBox"
import { isValidEmail, nullOrEmpty } from "../../utils/f"
import Swal from 'sweetalert2'
import { User, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth"
import useFirebase from "."


interface SignUpView {
    onAuthDone?: (user: User) => void
}
const SignUpView: React.FC<SignUpView> = ({ onAuthDone }) => {

    const { auth, db } = useFirebase()

    const [fullname, setFullname] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [password2, setPassword2] = useState<string>()

    const [fullnameError, setFullnameError] = useState<string>("")
    const [emailError, setEmailError] = useState<string>()
    const [passwordError, setPasswordError] = useState<string>()
    const [passwordError2, setPasswordError2] = useState<string>()
    const [requesting, setRequesting] = useState<boolean>()

    const clearErrors = () => {
        setFullnameError("")
        setEmailError("")
        setPasswordError("")
        setPasswordError2("")
    }

    const handleSubmit = (e: Event) => {
        //e.preventDefault()
        clearErrors()
        var hasError = false
    
        //Check fullname
        if(nullOrEmpty(fullname)) {
            hasError = true
            setFullnameError("Please enter your fullname.")
      
        }

        //Check email
        if(nullOrEmpty(email)) {
          hasError = true
          setEmailError("Please enter your email address.")
    
        } else if(!isValidEmail(email)) {
          hasError = true
          setEmailError('Please enter a valid email address.')
        }
    
        //Check password and password confirmation
        if(nullOrEmpty(password)) {
          hasError = true
          setPasswordError("Please enter your password.")
    
        } else if(nullOrEmpty(password2)) {
          hasError = true
          setPasswordError2("Re-enter password")
    
        } else if(password != password2) {
          hasError = true
          setPasswordError2("Password does not match")
        }
        
        
        if(!hasError && auth) {
            setRequesting(true)
            createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
              if(userCredential) {
                updateProfile(userCredential.user, {displayName: fullname})
                .then(() => {
                    sendVerification(userCredential.user)
                })
                .catch(error => {
                    sendVerification(userCredential.user)
                })
                
              }
            })
            .catch((e) => {
                let msg
                if(e.code == "auth/email-already-in-use") {
                  msg = "Email already in use. Please sign in."

                } else if(e.code == "auth/invalid-verification-code") {
                  msg = "The verification code is invalid."

                } else if(e.code == "auth/popup-closed-by-user") {
                  msg = "Authentication cancelled."

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

    const sendVerification = (user: User) => {
        sendEmailVerification(user, {url: location.href})
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Registration successfull",
                text: `Your registration was successfull. An email to verify your email address has been sent. Please check your email inbox or spam folder for the email sent.`
            })
            .then(() => {
                setRequesting(false)
                if(onAuthDone) onAuthDone(user)
            })
            .catch((e: any) => {
                setRequesting(false)
                if(onAuthDone) onAuthDone(user)
            })

        })
        .catch((e: any) => {
            Swal.fire({
                icon: "success",
                title: "Registration successfull",
                text: `Your registration was successfull.`
            })
            .then(() => {
                setRequesting(false)
                if(onAuthDone) onAuthDone(user)
            })
            .catch((e: any) => {
                setRequesting(false)
                if(onAuthDone) onAuthDone(user)
            })
        })
    }

    return (
        <VStack>
            <InputBox type={InputBox.TYPES.text} 
                title={"Fullname"} 
                placeholder={"Enter your fullname"} 
                mb={"1rem !important"} 
                value={fullname}
                onChange={(e) => setFullname(e)}
                errorMessage={fullnameError}
            />

            <InputBox type={InputBox.TYPES.email} 
            title={"Email"} 
            placeholder={"Enter your email"} 
            mb={"1rem !important"} 
            value={email}
            onChange={(e) => setEmail(e)}
            errorMessage={emailError}
            />

            <InputBox type="password" 
            title={"Password"} 
            placeholder={"Enter your password"} 
            mb={"1rem !important"}  
            value={password}
            onChange={e => {setPassword(e)}}
            errorMessage={passwordError}
            />
            <InputBox type="password" 
            title={"Confirm password"} 
            placeholder={"Re-enter password"} 
            mb={"1rem !important"}  
            value={password2}
            onChange={e => {setPassword2(e)}}
            errorMessage={passwordError2}
            />
            
            <AppButton w="100%" alignSelf="flex-start" type="submit" 
            onClick={handleSubmit} 
            disabled={requesting} fontStyle={requesting? "italic" : "normal"} 
            mt={"1rem !important"} mb={"1.5rem !important"}>
                {requesting && !nullOrEmpty(password)? "Please wait..." : "Sign up"}
            </AppButton>
        </VStack>
    )

}

export default SignUpView