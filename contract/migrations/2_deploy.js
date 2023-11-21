const { existsSync } = require("fs");
const { setDeployed, getDeployed, saveAbiToWeb, getAbiPaths } = require("../functions");
const path = require("path")


const Wallet = artifacts.require("Wallet");

module.exports = function (deployer, network) {
  deployer.deploy(Wallet)
  .then(() => {
    var address = Wallet.address
    //save the token address into file for the next deployed contract to use for deployment
    setDeployed(`Wallet-${network}`, address)

    const abiPaths = getAbiPaths(network, "Wallet", [
      path.join(__dirname, `../../src/abis/{abiName}{network}.json`),
      path.join(__dirname, `../../server/src/abis/{abiName}{network}.json`)
    ]);

    // Get the current date and time in a readable format
    const currentTime = new Date().toLocaleString();

    for (let index = 0; index < abiPaths.length; index++) {
      saveAbiToWeb(abiPaths[index], "Wallet", (abiAll) => {
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

  })
}