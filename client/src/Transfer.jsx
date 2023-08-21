import { useState } from "react";
import server from "./server";
import { hashMessage, signMessage } from "./scripts/crypto";
import { toHex } from 'ethereum-cryptography/utils';

function Transfer({ setBalance, address, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


/**
 * @param {*} evt 
 */
  async function transfer(evt) { 

    evt.preventDefault();

    try {
      console.log("private key: " + privateKey)
      console.log("public key address: " + address)
      console.log("sendAmount: " + sendAmount)
      console.log("recipient: " + recipient)

      const intentMessage = address + "_" + sendAmount + "_" + recipient;
      const intentMessageHash = toHex(hashMessage(intentMessage));
      console.log("intent hex: " + intentMessageHash);

      const signature = signMessage(intentMessageHash, privateKey); // also hashes msg before signing
      console.log("signature: " + signature.s)

      const jsonSignature = JSON.stringify(signature, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
          );

      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: jsonSignature,
        senderPublicKey: address,
        intentMessageHash: intentMessageHash,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;