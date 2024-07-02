import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

const sender = getKeypairFromEnvironment("SECRET_KEY");
console.log();
const reciver = new PublicKey("E8fcsDTokKM6XvutFx48JnFh2a28DZJSJy8fgx8J8YpS");
console.log("🏦 Sender address:", sender.publicKey.toBase58());
console.log("📥 Reciver address:", reciver.toBase58());

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const initialSenderBalance = await connection.getBalance(sender.publicKey);
const initialReciverBalance = await connection.getBalance(reciver);
console.log("🏦 Balance sender initial:", initialSenderBalance / LAMPORTS_PER_SOL)
console.log("📥 Balance reciver initial:", initialReciverBalance / LAMPORTS_PER_SOL);


const transaction = new Transaction()
const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: reciver,
    lamports: 0.01 * LAMPORTS_PER_SOL,
});
transaction.add(transferInstruction);

const memo = "👑 Solana is awesome!"
const memoInstruction = createMemoInstruction(memo);
transaction.add(memoInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [sender,]);
console.log("📑 Transaction signature:", signature);

const balanceSenderEnd = await connection.getBalance(sender.publicKey) / LAMPORTS_PER_SOL
console.log("🏦 Balance sender final:", balanceSenderEnd);

const balanceReciverEnd = await connection.getBalance(reciver) / LAMPORTS_PER_SOL
console.log("📥 Balance reciver final:", balanceReciverEnd);

console.log("🔻 Spend:", initialSenderBalance / LAMPORTS_PER_SOL - balanceSenderEnd);