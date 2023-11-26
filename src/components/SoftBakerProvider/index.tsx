import React, { useEffect, useState, createContext, useContext, Context } from 'react'
//import "./SoftBakerProvider.scss";
import AuthView from '../Firebase/AuthView';
import useFirebase from '../Firebase';
import { User } from 'firebase/auth';
import { consoleLog, rejectPromise, resolvePromise, savePromise, updateLogSettings } from '../../utils/f';
import { 
  COINS, IS_TEST, PROMISE_ID, SERVER_BASE_URL_LIVE, SERVER_BASE_URL_TEST,
  LIGHT_THEME, DARK_THEME, SDK_NAME 
} from '../../utils/c';
import AccessTokenDoor from '../Firebase/AccessTokenDoor';
import { AuthResource } from '../Firebase/data.type';
import PayFlow from '../PayFlow';
import useWalletListener from '../PayFlow/hooks/useWalletListener';
import { SaltBalanceConfirmation, Tool } from '../PayFlow/types';
import WalletTracker from '../WalletTracker';
import useServerBalanceUpdate from '../PayFlow/hooks/useServerBalanceUpdate';
import usePriceData from '../PayFlow/hooks/usePriceData';
import { Theme } from '../../theme.type';
import axios from 'axios';
import useSdkConfig from '../PayFlow/hooks/useSdkConfig';
import ToolSwitch from '../ToolSwitch';
import Tutorial from '../Tutorial';

const SoftBakerContext: Context<any> = createContext({})

export interface SoftBakerProviderProps {
  siteId: string,
  children: any,
  enableLog?: boolean,
  theme?: Theme
}

interface DocSaveResult {docId: string, totalFieldsUpdated: number}
export interface SoftBakerResourceProps extends AuthResource {
  signIn: (signInTitle: string | null | undefined, signUpTitle: string | null | undefined) => Promise<User>,
  signOut: () => Promise<void>,
  createDoc: (collection: string, documentId: string | null, document: {[x: string]: any}) => Promise<DocSaveResult>,
  updateDoc: (collection: string, documentId: string | null, document: {[x: string]: any}) => Promise<DocSaveResult>,
  deposit: (amount: number, signInTitle: string | null | undefined, signUpTitle: string | null | undefined) => Promise<SaltBalanceConfirmation>,
  showWallet: (depositAmount: number) => void,
  showTools: () => void,
  showTutorial: () => void,
  currentTool: Tool,
  contact_link: string | null | undefined,
  parent_site_home: string | null | undefined,
  balanceInUsd: 0, 
  balancePendingInUsd: 0,
  unconfirmedDepositsCount: 0
}

const SoftBakerProvider: React.FC<SoftBakerProviderProps> = ({ siteId, enableLog, children, theme }): JSX.Element => {
  const { auth, db, user, authLoading } = useFirebase()
  const [ showAuth, setShowAuth ] = useState<boolean>()
  const [ signInTitle, setSignInTitle ] = useState<string | null | undefined>()
  const [ signUpTitle, setSignUpTitle ] = useState<string | null | undefined>()
  const [ showAccessTokenDoor, setShowAccessTokenDoor ] = useState<boolean>()
  const [ walletTrackerDefaultDepositAmount, setWalletTrackerDefaultDepositAmount ] = useState<number>(0)
  const [ toolsShown, setToolsShown ] = useState<boolean>(false)
  const [ tutorialShown, setTutorialShown ] = useState<boolean>(false)
  const [ payFlowInfo, setPayFlowInfo ] = useState<{showPayFlow: boolean, payAmount: number}>({showPayFlow: false, payAmount: 0})

  useEffect(() => {
    updateLogSettings(enableLog)
  }, [enableLog])

  const { sdkConfig, currentTool } = useSdkConfig(siteId)
  const { 
    usdBalance, syncConfirmedBalance
  } = useServerBalanceUpdate()
  const priceData = usePriceData()
  const walletListenerResult = useWalletListener(usdBalance, priceData)

  useEffect(() => {
    consoleLog(`${SDK_NAME}: sdkConfig/currentTool`, sdkConfig, currentTool)
  }, [sdkConfig, currentTool])

  const { 
    confirmedDepositsBalanceBnbTest,
    confirmedDepositsBalanceInCoinBnbTest,
    
    confirmedDepositsBalanceBnb,
    confirmedDepositsBalanceInCoinBnb,
    
    confirmedDepositsBalanceEth,
    confirmedDepositsBalanceInCoinEth,

    balanceInUsd, balancePendingInUsd,
  } = walletListenerResult

  useEffect(() => {
    if(user?.uid) {
      syncConfirmedBalance({
        [COINS.bnb_testnet.key]: confirmedDepositsBalanceBnbTest,
        [COINS.bnb.key]: confirmedDepositsBalanceBnb,
        [COINS.ethereum_testnet.key]: confirmedDepositsBalanceEth
      })
    }
    
  }, [confirmedDepositsBalanceBnbTest, confirmedDepositsBalanceBnb, confirmedDepositsBalanceEth, usdBalance])
  
  
  const signIn = (signInTitle: string | null | undefined, signUpTitle: string | null | undefined): Promise<User> => {
    return new Promise((resolve, reject) => {
      savePromise(PROMISE_ID.signIn, resolve, reject)
      setSignInTitle(signInTitle)
      setSignUpTitle(signUpTitle)
      setShowAuth(true)
    })
  }
  const signOut = (): Promise<unknown> => {
    if(auth) return auth.signOut()
    return new Promise((resolve, reject) => {
      resolve(null)
    })
  }
  const getAccessToken = (maxAgeMilli?: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if(!user) {
        reject(new Error("signed-out"))

      } else {
        var now = new Date()
        var lastLoginDate = new Date()
        lastLoginDate.setTime(user.metadata.lastLoginAt)
        var timeDiff = now.getTime() - lastLoginDate.getTime()

        if(!maxAgeMilli || timeDiff <= maxAgeMilli) {
          user.getIdToken()
          .then(token => {
            resolve(token)
          })
          .catch(e => {
            reject(e)
          })

        } else {
          savePromise(PROMISE_ID.getAccessToken, resolve, reject)
          setShowAccessTokenDoor(true)
        }
      }
    })
  }
  const createDoc = (collection: string, docId: string | null, doc: {[x: string]: any}): Promise<DocSaveResult> => {
    return new Promise((resolve, reject) => {
      if(!user) {
        reject(new Error("Sign In required"))

      } else {
        user.getIdToken().then((authToken) => {
          axios.post(`${IS_TEST? SERVER_BASE_URL_TEST : SERVER_BASE_URL_LIVE}/create_doc`, {
            collection, 
            docId, 
            doc
          },
          {
            headers: {
              Authorization: authToken,
            },
          })
          .then((result) => {
              resolve(result.data)
          })
          .catch((error: any) => {
              reject(error.response.data)
          })
        });
      }
    })
  }
  const updateDoc = (collection: string, docId: string | null, doc: {[x: string]: any}): Promise<DocSaveResult> => {
    return new Promise((resolve, reject) => {
      if(!user) {
        reject(new Error("Sign In required"))

      } else {
        user.getIdToken().then((authToken) => {
          axios.post(`${IS_TEST? SERVER_BASE_URL_TEST : SERVER_BASE_URL_LIVE}/update_doc`, {
            collection, 
            docId, 
            doc
          },
          {
            headers: {
              Authorization: authToken,
            },
          })
          .then((result) => {
              resolve(result.data)
          })
          .catch((error: any) => {
              reject(error.response.data)
          })
        });
      }
    })
  }
  const deposit = (amount: number, signInTitle: string | null | undefined, signUpTitle: string | null | undefined): Promise<SaltBalanceConfirmation> => {
    return new Promise((resolve, reject) => {
      if(!user) {
        signIn(signInTitle, signUpTitle)
        .then(user => {
          savePromise(PROMISE_ID.deposit, resolve, reject)
          setPayFlowInfo({showPayFlow: true, payAmount: amount})
        })
        .catch(e => {
          reject(e)
        })

      } else {
        savePromise(PROMISE_ID.deposit, resolve, reject)
        setPayFlowInfo({showPayFlow: true, payAmount: amount})
      }
    })
  }
  const showWallet = (amount: number) => {
    setWalletTrackerDefaultDepositAmount(amount)
  }

  const showTools = () => {
    setToolsShown(true)
  }

  const showTutorial = () => {
    setTutorialShown(true)
  }

  const resources = {
    auth, db, user, authLoading,
    signIn, signOut, createDoc, updateDoc,
    deposit, showWallet, 
    showTools,
    showTutorial,
    currentTool,
    contact_link: sdkConfig?.contact_link,
    parent_site_home: sdkConfig?.parent_site_home,
    balanceInUsd: walletListenerResult.balanceInUsd, 
    balancePendingInUsd: walletListenerResult.balancePendingInUsd,
    unconfirmedDepositsCount: walletListenerResult.unconfirmedDepositsBnbTest.length + 
    walletListenerResult.unconfirmedDepositsBnb.length + 
    walletListenerResult.unconfirmedDepositsEth.length
  }

  return (
    <SoftBakerContext.Provider value={resources}>
        {children}
        <AuthView show={showAuth} signInTitle={signInTitle} signUpTitle={signUpTitle} onSuccess={(user: User) => {
              setShowAuth(false)
              resolvePromise(PROMISE_ID.signIn, user)
          }} onError={(error: any) => {
              setShowAuth(false)
              rejectPromise(PROMISE_ID.signIn, error)
        }} />
        <AccessTokenDoor show={showAccessTokenDoor} onSuccess={(token: string) => {
              setShowAccessTokenDoor(false)
              resolvePromise(PROMISE_ID.getAccessToken, token)
          }} onError={(error: any) => {
              setShowAccessTokenDoor(false)
              rejectPromise(PROMISE_ID.getAccessToken, error)
        }} />
        <PayFlow theme={theme} show={payFlowInfo.showPayFlow} payAmount={payFlowInfo.payAmount} 
          walletListenerResult={walletListenerResult} 
          vendors={sdkConfig?.vendors}
          minDeposit={sdkConfig?.min_deposit || 0}
          minVendorDeposit={sdkConfig?.min_vendor_deposit || 0}
          priceData={priceData}
          onSuccess={(latestDeposit) => {
            setPayFlowInfo({showPayFlow: false, payAmount: 0})
            resolvePromise(PROMISE_ID.deposit, latestDeposit)
          }}
          onClose={() => {
            setPayFlowInfo({showPayFlow: false, payAmount: 0})
        }} />
        <WalletTracker walletListenerResult={walletListenerResult} 
          deposit={deposit}
          defaultDepositAmount={walletTrackerDefaultDepositAmount} 
          onClose={() => {
            setWalletTrackerDefaultDepositAmount(0)
        }} />
        <ToolSwitch tools={sdkConfig?.tools} currentTool={currentTool} theme={theme || LIGHT_THEME}
        show={toolsShown} onClose={() => {
          setToolsShown(false)
        }} />
        <Tutorial currentTool={currentTool} theme={theme || LIGHT_THEME}
        show={tutorialShown} onClose={() => {
          setTutorialShown(false)
        }} />
    </SoftBakerContext.Provider>
  )
}

function useSoftBaker(): SoftBakerResourceProps {
  return useContext(SoftBakerContext)
}

export { 
  SoftBakerProvider, 
  useSoftBaker,
  LIGHT_THEME, DARK_THEME 
}