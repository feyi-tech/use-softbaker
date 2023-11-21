import { COINS } from "./c";

const Decimal = require('decimal.js');

export function weiToEther(bigIntValue: BigInt, decimalPlaces: number, precision: number) {
    const bigDecimalValue = new Decimal(bigIntValue.toString());
    return Number(bigDecimalValue.div(new Decimal(10).pow(decimalPlaces)).toNumber().toPrecision(precision));
}
export function bigIntToBigDecimal(bigIntValue: BigInt) {
    return new Decimal(bigIntValue.toString());
}


export const nullOrEmpty = (d: any) => {
    return !d || d.length == 0
}
export const isVoid = (value: any) => {
    return value === undefined || value === null
}
export const isValidEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}

export const isValidPhone = (phone: string) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)
}

const USE_SOFT_BAKER_RESOLVE_PREFIX: string = "USE_SOFT_BAKER_RESOLVE_"
const USE_SOFT_BAKER_REJECT_PREFIX: string = "USE_SOFT_BAKER_REJECT_"

export const promiseResolvePending = (promiseId: string): boolean => {
    return (window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`] != undefined
}
export const promiseRejectPending = (promiseId: string): boolean => {
    return (window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`] != undefined
}

export const savePromise = (promiseId: string, resolve: (x: any) => void, reject: (y: any) => any, pollInterval: number = 200): void => {
    (window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`] = resolve;
    (window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`] = reject;
}

export const resolvePromise = (promiseId: string, data: any): void => {
    if((window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`]) {
        (window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`](data)
        delete (window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`]
        delete (window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`]
    }
}

export const rejectPromise = (promiseId: string, error: any): void => {
    if((window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`]) {
        (window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`](error)
        delete (window as any)[`${USE_SOFT_BAKER_RESOLVE_PREFIX}${promiseId}`]
        delete (window as any)[`${USE_SOFT_BAKER_REJECT_PREFIX}${promiseId}`]
    }
}

export const whatsappLink = (phoneNumber?: string | null, message?: string): string => {
    if(message) {
        //message = `?text=${message.replaceAll("\n", "%0A")}`.replaceAll(" ", "%20")/*
        try {
            message = `?text=${message.replace(/\n/g, "%0A")}`.replace(/[ ]/g, "%20")

        } catch(e: any) {}
    }
    return `https://wa.me/${phoneNumber || ""}${message || ""}`
}

export const getDefaultCoin = (): string => {
    var defaultCoin = "bnb"
    var lastPriority = -1
    for(const coin of Object.keys(COINS)) {
        if(!COINS[coin].disabled && (lastPriority < 0 || COINS[coin].priority < lastPriority)) {
            defaultCoin = coin
            lastPriority = COINS[coin].priority
        }
    }
    return defaultCoin
}