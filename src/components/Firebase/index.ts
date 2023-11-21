import { useEffect, useState } from 'react'
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
//Analytics for web
import { Analytics, getAnalytics, setUserProperties } from "firebase/analytics";
//Authentication for Web
import { getAuth, onAuthStateChanged, reauthenticateWithCredential } from "firebase/auth";
//Cloud Firestore for Web
import { doc, DocumentData, Firestore, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { Auth, User, AuthResource } from './data.type';
import { FIREBASE_CONFIG } from '../../utils/c'

const useFirebase = () => {
    const [app, setApp] = useState<FirebaseApp | null | undefined>()
    const [analytics, setAnalytics] = useState<Analytics | null | undefined>()
    const [auth, setAuth] = useState<Auth | null | undefined>();
    const [db, setDb] = useState<Firestore | null | undefined>()
    const [user, setUser] = useState<User | null | undefined>()
    const [authLoading, setAuthLoading] = useState<boolean>(true)

    useEffect(() => {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        // Initialize Firebase
        const theApp = initializeApp(FIREBASE_CONFIG)
        setApp(theApp)
        setAnalytics(getAnalytics(theApp))
        const theAuth = getAuth(theApp)
        setAuth(theAuth)
        setDb(getFirestore(theApp));

        const unsubscribe = onAuthStateChanged(theAuth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(user)
                setAuthLoading(false)
            } else {
                // User is signed out
                setUser(null)
            }
        })
        
        return () => {
            unsubscribe()
        }
    }, [])

    return {
        auth,
        db,
        user,
        setUser,
        authLoading
    }
}

export default useFirebase