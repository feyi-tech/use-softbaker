import Web3, { EventLog, BlockHeaderOutput, ProviderMessage } from "web3";
import { SaltBalanceInfo } from "./types";

class WalletFactory {
    
    private address;
    private abi;
    private rpcUrl;
    private secondsPerBlock = 3;
    private contract;
    public web3: Web3;
    private subscriptions: any[] = []

    constructor(address: string, abi: any, rpcUrl: string, secondsPerBlock: number = 3) {
        this.address = address;
        this.abi = abi;
        this.rpcUrl = rpcUrl;
        this.web3 = new Web3(rpcUrl);
        this.contract = new this.web3.eth.Contract(abi, address);
        this.secondsPerBlock = secondsPerBlock;
    }

    public stopSubscriptions() {
      if(this.web3 && this.web3.provider && this.web3.provider.removeAllListeners) {
        //this.web3.provider.removeAllListeners('block')
      }
      for(const subscription of this.subscriptions) {
          try {
            subscription.unsubscribe()
          } catch(e) {}
      }
      this.subscriptions = []
    }

    public getSaltBalance(salt: string, blockNumber?: number): Promise<SaltBalanceInfo> {
        return new Promise((resolve, reject) => {
          const paddedSalt = this.web3.utils.rightPad(
            this.web3.utils.asciiToHex(salt.toLowerCase()), 64
          );

          this.contract.methods
          .getSaltBalance(paddedSalt)
          .call({}, blockNumber || 'latest')
          .then((result: any) => {
            const balanceObject = {
              salt: salt,
              paddedSalt: paddedSalt,
              wallet: result.wallet,
              isCreated: result.isCreated,
              balance: result.balance,
              blockNumber: blockNumber || "latest"
            };
            resolve(balanceObject);
          })
          .catch((error: Error) => {
            reject(error);
          });
        });
    }

    public startBlockListener(callBack: (blockNumber: any) => void, lastBlock: number) {
      const interval = Math.round(this.secondsPerBlock / 2)
      setTimeout(async () => {
        try {
          const currentBlock = Number(await this.getCurrentBlockNumber());
          try {
            if(currentBlock > lastBlock) callBack(currentBlock)
            this.startBlockListener(callBack, currentBlock)
  
          } catch(e) {
            this.startBlockListener(callBack, currentBlock)
          }

        } catch(e) {
          this.startBlockListener(callBack, lastBlock)
        }
        
      }, interval);
    }

    getCurrentBlockNumber() {
        return new Promise(async (resolve, reject) => {
          try {
            const blockNumber = await this.web3.eth.getBlockNumber();
            resolve(blockNumber)
          } catch (error) {
            reject(error)
          }
        })
    }
}

export default WalletFactory