import React, { ChangeEvent, useState } from 'react'
import { rejectPromise, resolvePromise } from '../../utils/f'
import { PROMISE_ID } from '../../utils/c'
import { User, signInWithEmailAndPassword } from 'firebase/auth'
import useFirebase from '.'

interface AccessTokenDoor {
    show: boolean,
    onSuccess: (accessToken: string) => void,
    onError: (error: any) => void
}
const AccessTokenDoor: React.FC<any> = ({ show, onSuccess, onError }) => {
    const { auth, user, setUser } = useFirebase()
    const [password, setPassword] = useState<string>()

    const handleSubmit = () => {
        if(auth && user && user.email && password && password.length > 0) {
            signInWithEmailAndPassword(auth, user.email, password)
            .then(auntentication => {
                const user = auntentication.user as User
                if(user) {
                    setUser(user)
                    user.getIdToken()
                    .then(token => {
                        onSuccess(token)
                    })
                    .catch(e => {
                        onError(e)
                    })
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
                onError(new Error(msg))
            })
        }
    }

    if(!show) return null
    return (
        <div>
            <div>Hey! Access Token Door Here!</div><br />
            <input type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
            }} /><br />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default AccessTokenDoor