import { useEffect, useState } from 'react'
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
//Analytics for web
import { Analytics, getAnalytics } from "firebase/analytics";
//Authentication for Web
import { getAuth, onAuthStateChanged } from "firebase/auth";
//Cloud Firestore for Web
import {Firestore, getFirestore } from "firebase/firestore";
import { Auth, User } from './data.type';
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

        const theApp = initializeApp(FIREBASE_CONFIG);
        const theDb = getFirestore(theApp);
        const theAuth = getAuth(theApp)
        const theAnalytics = getAnalytics(theApp);
        setApp(theApp);
        setDb(theDb);
        setAuth(theAuth);
        setAnalytics(theAnalytics);

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