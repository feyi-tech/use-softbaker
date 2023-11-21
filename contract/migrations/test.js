const path = require("path");
const { getAbiPaths } = require("../functions");


const network = "Testnet"
const abiPaths = getAbiPaths(network, "Wallet", [
    path.join(__dirname, `../../src/abis/{abiName}{network}.json`),
    path.join(__dirname, `../../server/src/abis/{abiName}{network}.json`)
]);

console.log(abiPaths)