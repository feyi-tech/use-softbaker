import { Auth as A, User as U } from "firebase/auth"
import { Firestore } from "firebase/firestore"

export interface User extends U {
    metadata: {
        [x: string]: any
    }
    [x: string]: any
}

export interface Auth extends A {
    [x: string]: any
}

export interface AuthResource {
    auth: Auth | null | undefined,
    user?: User | null | undefined,
    authLoading?: boolean,
    db?: Firestore | null
}