const { unlinkSync } = require("fs");
const { setDeployed, getDeployed, saveAbiToWeb, getAbiPaths } = require("./functions");
const path = require("path")

const abiPaths = getAbiPaths(null, "WalletFactory", [
  path.join(__dirname, `../src/abis/{abiName}{network}.json`),
  path.join(__dirname, `../server/src/abis/{abiName}{network}.json`)
]).concat(
  getAbiPaths(null, "Wallet", [
    path.join(__dirname, `../src/abis/{abiName}{network}.json`),
    path.join(__dirname, `../server/src/abis/{abiName}{network}.json`)
  ])
)

for (let index = 0; index < abiPaths.length; index++) {
  unlinkSync(abiPaths[index]);
}