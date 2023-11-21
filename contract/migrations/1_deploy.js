const { setDeployed, getDeployed, saveAbiToWeb, getAbiPaths } = require("../functions");
const path = require("path");

const WalletFactory = artifacts.require("WalletFactory");

const walletCreator = "0x0Bf91C2a775E922D09C79Bf5Ca80669c9A3DCE5B";
const shareHoldersWallets = ['0x6dcE280853a1365D06aCed1DaBe63c62D575f8c9','0xEECf4d829f1685571436d0b1b5fe7Ba189d68C92','0xdF8d18b274e3033b5537978F461B7E9b00857c82','0xFA4372408C5cb43BaE2d6752f54223f3E0792Ac4']
const shareHoldersPcts = [30,30,30,10]

//0x6dcE280853a1365D06aCed1DaBe63c62D575f8c9,0xEECf4d829f1685571436d0b1b5fe7Ba189d68C92,0xdF8d18b274e3033b5537978F461B7E9b00857c82,0xFA4372408C5cb43BaE2d6752f54223f3E0792Ac4
module.exports = function (deployer, network) {
  deployer.deploy(WalletFactory, walletCreator, shareHoldersWallets, shareHoldersPcts).then(() => {
    var address = WalletFactory.address;
    // save the token address into a file for the next deployed contract to use for deployment
    setDeployed(`WalletFactory-${network}`, address);

    const abiPaths = getAbiPaths(network, "WalletFactory", [
      path.join(__dirname, `../../src/abis/{abiName}{network}.json`),
      path.join(__dirname, `../../server/src/abis/{abiName}{network}.json`)
    ]);

    // Get the current date and time in a readable format
    const currentTime = new Date().toLocaleString();

    for (let index = 0; index < abiPaths.length; index++) {
      saveAbiToWeb(abiPaths[index], "WalletFactory", (abiAll) => {
        var abiShort = {
          rpcUrl: network.rpcUrl,
          chainId: network.chainId,
          address: address,
          timestamp: currentTime, // Include the timestamp
          network,
          ...abiAll,
        };
        return abiShort;
      });
    }
  });
};
