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
import {
	getOrCreateAssociatedTokenAccount,
	transfer,
} from "@solana/spl-token";
const connection = new Connection(
	clusterApiUrl("devnet"),
	"confirmed"
);
const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`🔑 Public key is: ${user.publicKey.toBase58()}`);

// Add the recipient public key here
const recipient = new PublicKey(
	"97LQneFAwi3mUcaKyFvpwgbbRcaQVGruXcJNEnXEQavY"
);

// Subtitute in your token mint account
const tokenMintAccount = new PublicKey(
	"ESxnnDXNXdEtDd2g2CmyzNekPbH444a58nEFisRFD6Qj"
);

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);
console.log(
	`🔃 Attempting to send token to ${recipient.toBase58()} ...`
);
// Get or create the source and destination token accounts to store this token

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	user,
	tokenMintAccount,
	user.publicKey
);
const destinationTokenAccount =
	await getOrCreateAssociatedTokenAccount(
		connection,
		user,
		tokenMintAccount,
		recipient
	);
console.log(
	`🌿 Source token account address is: ${sourceTokenAccount.address.toBase58()}`
);
// Transfer the tokens
const signature = await transfer(
	connection,
	user,
	sourceTokenAccount.address,
	destinationTokenAccount.address,
	user,
	10 * MINOR_UNITS_PER_MAJOR_UNITS
);
console.log(`🚀 Transaction Signature: ${signature}`);
const explorerLink = getExplorerLink(
	"transaction",
	signature,
	"devnet"
);
console.log(
	`✅ Transaction confirmed, explorer link is: ${explorerLink}!`
);
