const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

function createRandomPrivateKey() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  let address = keccak256(publicKey.slice(1).slice(-20));
  console.log(`Private Key : ${toHex(privateKey)}`);
  console.log(`Public Key : ${toHex(publicKey)}`);
  console.log(`Address : ${toHex(publicKey)}`);
}

export async function sign(){
  const PRIVATE_KEY =
    "13fff45a968d07c1aceeed0cd2a2673099b34aecb28c42f5f8a0da5e695f7f99";
  let message = {
    from: "0xaff8b521a437Da10a8258Cb8E2DfAdd7C52F0315",
    to: "0xd41D5925eb276F87e08C6D1FfCa28B6c3fbCfE39",
    amount: 12,
  };
  console.log("Message : ", message);

  const messageHash = toHex(keccak256(utf8ToBytes(JSON.stringify(message))));
  console.log("Hashed Message : ", messageHash);

  const [sig, recoveryBit] = await secp.sign(messageHash, PRIVATE_KEY, {
    recovered: true,
  });
  console.log("Signature : ", toHex(sig));
  console.log("Recovery Bit : ", recoveryBit);
}

