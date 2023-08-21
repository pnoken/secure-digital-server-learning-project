const secp = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils")

const getAddress = pubkey => keccak256(pubkey.slice(1)).slice(-20);

const hashMessage = msg => keccak256(utf8ToBytes(JSON.stringify(msg)))

const restorePublicKey = (msgHash, sign, recoveryBit) => {
  return secp.recoverPublicKey(msgHash, sign, recoveryBit)
}

module.exports = {getAddress, hashMessage, restorePublicKey} 