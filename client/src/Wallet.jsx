import server from "./server";
import { getPublicKey, getPublicKeyHex, getEthAddress } from "./scripts/crypto";

/**
 * @param {*} param0 
 * @returns 
 */
function Wallet({ balance, setBalance, privateKey, setPrivateKey, publicKey, setPublicKey, ethAddress, setEthAddress }) {
  async function onChange(evt) {

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const publicKey = getPublicKey(privateKey);
    const publicKeyHex = getPublicKeyHex(privateKey);
    setPublicKey(publicKeyHex);

    const ethAddress = getEthAddress(publicKey);
    setEthAddress(ethAddress);

    if (ethAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${ethAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key to sign an intent" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Public Key Address: {publicKey}
      </div>

      <div>
        ETH Address: {ethAddress}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
