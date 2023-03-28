const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
    "0xaff8b521a437Da10a8258Cb8E2DfAdd7C52F0315": 50,
    "0xd41D5925eb276F87e08C6D1FfCa28B6c3fbCfE39": 50,
    "0xd402AF8911fDB8A89120879C696e7CfAa8887ACd": 50,
};
let address;

app.get("/balance/:address", (req, res) => {
    address = req.params.address;
    const balance = balances[address] || 0;
    res.send({balance});
});

app.post("/send", (req, res) => {
    if (address == undefined || address == null) {
        res.status(400).send({message: "No address provided, need to get balance first !"});
    }
    const {recipient, amount, signature, recoveryBit, publicKey} = req.body;
    console.log("Sender : ", address);
    console.log("Recipient : ", recipient);
    console.log("Amount : ", amount);
    console.log("Signature : ", signature);
    console.log("Recovery Bit : ", recoveryBit);

    let message = {
        from: address,
        to: recipient,
        amount: amount,
    };
    const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
    const recoverKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);
    setInitialBalance(address);
    setInitialBalance(recipient);
    if (toHex(recoverKey) === publicKey) {
        if (balances[address] < amount) {
            res.status(400).send({message: "Not enough funds in " + address + " wallet !"});
        } else {
            balances[address] -= amount;
            balances[recipient] += amount;
            res.send({balance: balances[address]});
        }
    } else {
        res.status(400).send({message: "Not the right signature !"});
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}