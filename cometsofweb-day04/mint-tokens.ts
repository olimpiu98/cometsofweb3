import {
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from "@solana/spl-token";
import "dotenv/config";
import {
	getExplorerLink,
	getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
	Connection,
	PublicKey,
	clusterApiUrl,
} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

const UNITS = Math.pow(10, 9);

const tokenMintAccount = new PublicKey(
	"ESxnnDXNXdEtDd2g2CmyzNekPbH444a58nEFisRFD6Qj"
);
const recipient = new PublicKey(
	"97LQneFAwi3mUcaKyFvpwgbbRcaQVGruXcJNEnXEQavY"
);

const recipientAssociatedTokenAccount =
	await getOrCreateAssociatedTokenAccount(
		connection,
		user,
		tokenMintAccount,
		recipient
	);

const transactionSignature = await mintTo(
	connection,
	user,
	tokenMintAccount,
	recipientAssociatedTokenAccount.address,
	user,
	10000 * UNITS
);

const link = getExplorerLink(
	"transaction",
	transactionSignature,
	"devnet"
);
console.log(`🚀 Transaction Signature: ${transactionSignature}`);
console.log(`✅ Success! Mint Token Transaction: ${link}`);
