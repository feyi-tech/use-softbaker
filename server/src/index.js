require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const serviceAccount = require("./serviceAccountKey.json");
const WalletFactory = require('./WalletFactory');
const { COINS, PRICE_DATA_TTL_MINUTES } = require('./utils/c');
const { default: axios } = require('axios');

const isFirebaseTimestamp = (value) => value instanceof admin.firestore.Timestamp;

const getCoinBalanceKey = (coin, suffix) => {
  return `${coin}${suffix? `_${suffix}` : "_balance"}`.toLowerCase();
}

const readServerCoinBalance = (coin, balanceDoc) => {
  var balance = balanceDoc[getCoinBalanceKey(coin, "balance")];
  if (!balance) balance = "0";
  return BigInt(balance);
}

const getCoinsPrices = async () => {

  // Reference to the firestore document at cache/price_list
  const priceListDocRef = admin.firestore().doc('cache/price_list');

  try {
    // Attempt to fetch the price data from the cache
    const cacheSnapshot = await priceListDocRef.get();

    if (cacheSnapshot.exists) {
      // If the cache document exists, check the TTL
      const cacheData = cacheSnapshot.data();
      const currentTime = new Date().getTime();
      const ttlExpiration = cacheData.last_update.toMillis() + (cacheData.ttl_minutes || PRICE_DATA_TTL_MINUTES) * 60 * 1000;

      if (currentTime < ttlExpiration) {
        // If the cache is still valid, return the cached price data
        return cacheData;
      }
    }

    // Fetch the current price from the Coingecko API if the cache is not available or expired
    const priceData = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,ethereum&vs_currencies=usd'
    );

    // Create or update the cache document with the new price data, TTL, and last_update
    const priceDataForDoc = {
      last_update: FieldValue.serverTimestamp()
    }
    for(const key of Object.keys(priceData.data)) {
      priceDataForDoc[`${key}_usd`] = priceData.data[key].usd
    }
    //console.log("priceData.data: ", priceData.data, priceDataForDoc)
    if(!cacheSnapshot.exists) priceDataForDoc.ttl_minutes = PRICE_DATA_TTL_MINUTES
    // Use set with merge option to create or update the document
    await priceListDocRef.set(priceDataForDoc, { merge: true });

    // Return the fetched price data
    return priceDataForDoc;
  } catch (error) {
    throw new Error('Error fetching coin price: ' + error.message, );
  }
};

const initAdmin = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const closeAdmin = () => {
  admin.app().delete()
  .then(() => {
    //console.log('Firebase Admin SDK instance has been deleted.');
  })
  .catch((error) => {
    //console.error('Error deleting Firebase Admin SDK instance:', error);
  });
}

const updateBalance = (uid, coins) => {
  return new Promise((resolve, reject) => {
    // Reference to the firebase document at /wallets/{uid}
    const walletDocRef = admin.firestore().doc(`wallets/${uid}`);

    // Reference to a firebase batch writer
    const batchWriter = admin.firestore().batch();

    // Fetch the current balance document
    walletDocRef.get()
      .then(async (docSnapshot) => {

        const balanceDoc =  docSnapshot.exists? docSnapshot.data() : { }

        const promises = [];

        const priceData = await getCoinsPrices()

        for (const coin of coins) {
          promises.push(new Promise(async (resolve, reject) => {
            const coinData = COINS[coin];
            if(!coinData) {
              return resolve({
                error: "Invalid coin",
                coin: coin
              });

            } else if(coinData.disabled) {
              return resolve({
                error: "Coin disabled",
                coin: coin
              });
            }
            const factory = new WalletFactory(coinData.abiData.address, coinData.abiData.abi, coinData.abiData.rpcUrl, coin);

            try {
              const confirmations = await factory.getConfirmations(uid, coinData.requiredConfirmations);
              const confirmationsInfo = factory.getConfirmationsInfo(confirmations, coinData.decimals);

              if (confirmationsInfo.error) {
                resolve({
                  error: confirmationsInfo.error,
                  coin: coin
                });

              } else if (confirmationsInfo.confirmedDepositsBalance > readServerCoinBalance(coin, balanceDoc)) {
                // Determine the coin price
                let coinPrice = priceData[`${coinData.coingecko_price_key}_usd`];

                const priceInUsd = confirmationsInfo.confirmedDepositsBalanceInCoin * coinPrice
                
                batchWriter.set(walletDocRef, {
                  salt: confirmationsInfo.salt,
                  [getCoinBalanceKey(coin, "balance")]: confirmationsInfo.confirmedDepositsBalance.toString(),
                  [getCoinBalanceKey(coin, "balance_in_coin")]: confirmationsInfo.confirmedDepositsBalanceInCoin,
                  [getCoinBalanceKey(coin, "balance_in_usd")]: priceInUsd,
                  [getCoinBalanceKey(coin, "contract_created")]: confirmationsInfo.walletCreated,
                  usd_balance: FieldValue.increment(priceInUsd),
                  deposit_counts: FieldValue.increment(1),
                  last_updated: FieldValue.serverTimestamp()
                }, { merge: true });
                

                resolve(null);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve({
                error: e.message,
                coin: coin
              });
            }
          }));
        }

        Promise.all(promises)
          .then((promisesResult) => {
            // Commit the batch to update the document
            batchWriter.commit()
            .then(() => {
              const errorCoins = []
              for(const promiseResult of promisesResult) {
                if(promiseResult != null) {
                  errorCoins.push(promiseResult)
                }
              }
              if(errorCoins.length > 0) {
                reject({ updatedCounts: coins.length - errorCoins.length, errorCoins })

              } else {
                resolve({ updatedCounts: coins.length })
              }
              
            })
            .catch((error) => {
              reject({ error: error.message });
            });
          })
          .catch((error) => {
            reject({ error: error.message });
          });
      })
      .catch((error) => {
        reject({ error: error.message });
      })
      .finally(() => {
        closeAdmin()
      });
  });
}

const X_COLUMN_DATA = {
  key: (columns) => {
    return columns[0]
  },
  name: (columns) => {
    return columns[0]
  },
  type: (columns) => {
    return columns[1]
  },
  min: (columns) => {
    return parseInt(columns[2])
  },
  max: (columns) => {
    return parseInt(columns[3])
  },
  editable: (columns) => {
    return columns[4].toLowerCase() === "true"
  },
  requiredForCreate: (columns) => {
    return columns[5].toLowerCase() === "true"
  },
  requiredForUpdate: (columns) => {
    return columns[6].toLowerCase() === "true"
  }
}
const ruleDocToRule = (ruleDoc, doc, isEdit, uid) => {
  const rule = {
    allow_freemium: ruleDoc.allow_freemium == true,
    create_price: ruleDoc.create_price,
    update_price: ruleDoc.update_price,
    x: {}
  }

  for (const x of ruleDoc.x) {
    const colums = x.split(",")
    const column = {
      key: X_COLUMN_DATA.key(colums),
      name: X_COLUMN_DATA.name(colums),
      type: X_COLUMN_DATA.type(colums),
      min: X_COLUMN_DATA.min(colums),
      max: X_COLUMN_DATA.max(colums),
      editable: X_COLUMN_DATA.editable(colums),
      requiredForCreate: X_COLUMN_DATA.requiredForCreate(colums),
      requiredForUpdate: X_COLUMN_DATA.requiredForUpdate(colums)
    }

    if(!doc[column.key] && ((!isEdit && column.requiredForCreate) || (isEdit && column.requiredForUpdate))) throw Error(`${column.name} cannot be empty.`)
    if(doc[column.key] && isEdit && !column.editable) throw Error(`${column.name} cannot be updated.`)
    if(column.type == "uid" && doc[column.key]) {
      if(doc[column.key] != "uid") throw Error(`${column.name} value must be "uid".`)
      if(!uid) throw Error(`uid not available for ${column.name}.`)
      rule.x[column.key] = uid

    } else if(column.type == "string" && doc[column.key]) {
      if(typeof doc[column.key] != "string") throw Error(`${column.name} must be string.`)
      if(doc[column.key].length < column.min) throw Error(`${column.name} total characters cannot be less than ${column.min}.`)
      if(doc[column.key].length > column.max) throw Error(`${column.name} total characters cannot be greater than ${column.max}.`)
      if(doc[column.key].length > column.max) throw Error(`${column.name} total characters cannot be greater than ${column.max}.`)
      rule.x[column.key] = doc[column.key]

    } else if(column.type == "number" && doc[column.key]) {
      if(typeof doc[column.key] != "number") throw Error(`${column.name} must be a number.`)
      if(doc[column.key] < column.min) throw Error(`${column.name} cannot be less than ${column.min}.`)
      if(doc[column.key] > column.max) throw Error(`${column.name} cannot be greater than ${column.max}.`)
      rule.x[column.key] = doc[column.key]

    } else if(column.type == "time" && doc[column.key]) {
      if(!isFirebaseTimestamp(doc[column.key])) throw Error(`${column.name} must be a timestamp.`)
      rule.x[column.key] = doc[column.key]

    } else if(column.type == "current_time" && doc[column.key]) {
      if(doc[column.key] != "current_time") throw Error(`${column.name} value must be "current_time".`)
      rule.x[column.key] = admin.firestore.Timestamp.now()

    }
    
  }

  if(doc.is_freemium === true) {
    rule.x.is_freemium = true

  } else if(doc.is_freemium === false) {
    rule.x.is_freemium = false
  }

  return rule

}//199.36.158.100
const saveDoc = (uid, collection, docId, doc, isEdit) => {
  return new Promise((resolve, reject) => {
    // Get the rule file for the collection
    const collectionRuleDocRef = admin.firestore().doc(`collection_rule/${collection}`);

    // Fetch the current balance document
    collectionRuleDocRef.get()
      .then(async (docSnapshot) => {

        if(!docSnapshot.exists) {
          return reject({error: "Invalid collection"})
        }

        const collectionRule =  ruleDocToRule(docSnapshot.data(), doc, isEdit, uid)

        const walletDocRef = admin.firestore().doc(`wallets/${uid}`);
        var chargeAmount = 0
        if(!isEdit && collectionRule.create_price > 0) {
          // Fetch the current balance document
          const docSnapshot = await walletDocRef.get()
          if(!docSnapshot.exists || docSnapshot.data().usd_balance < collectionRule.create_price && (!collectionRule.allow_freemium || !doc.is_freemium)) {
            return reject({error: `You have low balance. $${collectionRule.create_price} is needed.`})

          } else if(!doc.is_freemium) {
            chargeAmount = collectionRule.create_price
          }

        } else if(isEdit && (collectionRule.update_price > 0 || (collectionRule.create_price > 0 && !doc.is_freemium))) {
          // Fetch the current balance document
          const docSnapshot = await walletDocRef.get()
          //If the user wants to change from freemiun to paid
          if(!doc.is_freemium) {
            if(!docSnapshot.exists || docSnapshot.data().usd_balance < collectionRule.create_price) {
              return reject({error: `You have low balance. $${collectionRule.create_price} is needed.`})
  
            } else {
              chargeAmount = collectionRule.create_price
            }

          } else {
            if(!docSnapshot.exists || docSnapshot.data().usd_balance < collectionRule.update_price) {
              return reject({error: `You have low balance. $${collectionRule.update_price} is needed.`})
  
            } else {
              chargeAmount = collectionRule.update_price
            }
          }
          
        }
        // Reference to a firebase batch writer
        const batchWriter = admin.firestore().batch();
        if(chargeAmount > 0) {
          batchWriter.set(walletDocRef, {
            usd_balance: FieldValue.increment(chargeAmount * -1),
            last_updated: FieldValue.serverTimestamp()
          }, { merge: true });
        }

        const docRef = admin.firestore().doc(`${collection}/${docId}`);
        if(isEdit) {
          batchWriter.update(docRef, collectionRule.x);

        } else {
          batchWriter.create(docRef, collectionRule.x);
        }

        // Commit the batch to update the document
        batchWriter.commit()
        .then(() => {
          resolve({ docId: docId, totalFieldsUpdated: Object.keys(collectionRule.x).length})

        })
        .catch((error) => {
          if(error.message.toLowerCase().includes("document already exists")) {
            reject({ error: "Document already exists" });

          } else if(error.message.toLowerCase().includes("no document to update")) {
            reject({ error: "Document does not exist" });

          } else {
            reject({ error: error.message });
          }
        });

      })
      .catch((error) => {
        reject({ error: error.message });
      })
      .finally(() => {
        closeAdmin()
      });
  });
}

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',  
    'http://localhost:5000',  
    'https://softbaker.com',
    /\.softbaker\.com$/, // Allow any subdomain of softbaker.com
  ],
  methods: 'POST',
}));
app.use(bodyParser.json());
// Middleware to authenticate Firebase user
const authenticateFirebaseUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    initAdmin()
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    closeAdmin()
    return res.status(401).json({ error: `Unauthorized: Invalid token(${token}) => ` + error.message});
  }
};

app.post('/update_balance', authenticateFirebaseUser, async (req, res) => {
  const { uid } = req;
  const { coins } = req.body;
  if(!coins || coins.length == 0) return res.status(400).json({error: "Empty Coins"});

  updateBalance(uid, coins)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    res.status(400).json(error);
  })
});

app.post('/create_doc', authenticateFirebaseUser, async (req, res) => {
  const { uid } = req;
  const { collection, docId, doc } = req.body;
  if(!collection || typeof docId != "string") return res.status(400).json({error: "No collection specified"});
  if(!docId || typeof docId != "string") return res.status(400).json({error: "Empty document id"});
  if(!doc || !(Object.prototype.toString.call(doc) === '[object Object]') || Object.keys(doc).length == 0) return res.status(400).json({error: "Empty document"});

  saveDoc(uid, collection, docId, doc, false)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    res.status(400).json(error);
  })
});

app.post('/update_doc', authenticateFirebaseUser, async (req, res) => {
  const { uid } = req;
  const { collection, docId, doc } = req.body;
  if(!collection || typeof docId != "string") return res.status(400).json({error: "No collection specified"});
  if(!docId || typeof docId != "string") return res.status(400).json({error: "Empty document id"});
  if(!doc || !(Object.prototype.toString.call(doc) === '[object Object]') || Object.keys(doc).length == 0) return res.status(400).json({error: "Empty document"});

  saveDoc(uid, collection, docId, doc, true)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    res.status(400).json(error);
  })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});