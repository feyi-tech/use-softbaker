const fs = require("fs")
const path = require("path")
const web3 = require("web3")
const { networks } = require("./truffle-config")

const DEPLOY_PATH = "./deployed.json"

const getDeployJson = () => {
    try {
        return JSON.parse(fs.readFileSync(DEPLOY_PATH))

    } catch {
        return {}
    }
}
const setDeployJson = j => {
    fs.writeFileSync(DEPLOY_PATH, JSON.stringify(j, null, "   "))
}
const setDeployed = (key, value) => {
    var j = getDeployJson()
    j[key] = value
    setDeployJson(j)
}
const getDeployed = key => {
    var j = getDeployJson()
    return j[key]
}

const getAbi = (contractName) => {
    return JSON.parse(fs.readFileSync(`./build/contracts/${contractName}.json`))
}

const getAbiPaths = (network, abiName, pathsFormats) => {
    const nets = Object.keys(networks)
    const paths = []
    if(!network) {
        for (let index = 0; index < nets.length; index++) {
            const net = nets[index];
            for( let i = 0; i < pathsFormats.length; i++ ) {
                const p = pathsFormats[i].replace("{abiName}", abiName).replace("{network}", net)
                if(fs.existsSync(p)) paths.push(p)
            }
        }

    } else {
        if(!nets.includes(network)) throw new Error(`Unsupported chainName: ${network}`);
    
        for( let i = 0; i < pathsFormats.length; i++ ) {
            const p = pathsFormats[i].replace("{abiName}", abiName).replace("{network}", network)
            paths.push(p)
        }

        for (let index = 0; index < nets.length; index++) {
            const net = nets[index];
            if(net != network) {
                for( let i = 0; i < pathsFormats.length; i++ ) {
                    const p = pathsFormats[i].replace("{abiName}", abiName).replace("{network}", net)
                    if(!fs.existsSync(p)) paths.push(p)
                }
            }
        }
    }

    return paths
}

const readJson = (path) => {
    return JSON.parse(fs.readFileSync(path))
}

const writeJson = (data, path) => {
    fs.writeFileSync(path, JSON.stringify(data, null, "   "))
}

const saveAbiToWeb = (outputPath, contractName, beforeSave) => {
    //get the file
    var j = JSON.parse(fs.readFileSync(`./build/contracts/${contractName}.json`))
    //if(!j) throw exception
    if(beforeSave) {
        j = beforeSave(j)
    }
    fs.writeFileSync(outputPath, JSON.stringify(j, null, "   "))
}

const copyDeployed = outputPath => {
    fs.copyFileSync(DEPLOY_PATH, outputPath)
}

// Function to convert a string to bytes
function stringToBytes32(input) {
    const hexString = web3.utils.asciiToHex(input);
    return web3.utils.padLeft(hexString, 64);
}
function padNum(input) {
    return web3.utils.padLeft(input, 64);
}

module.exports = {
    setDeployed, getDeployed, saveAbiToWeb, copyDeployed, getAbi, readJson, writeJson, getAbiPaths, stringToBytes32, padNum
}