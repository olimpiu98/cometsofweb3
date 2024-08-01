import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
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
console.log(`🔑 Public key is: ${user.publicKey.toBase58()}`);

const tokenMintAccount = new PublicKey(
	"ESxnnDXNXdEtDd2g2CmyzNekPbH444a58nEFisRFD6Qj"
);

const recipient = new PublicKey(
	"97LQneFAwi3mUcaKyFvpwgbbRcaQVGruXcJNEnXEQavY"
);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
	connection,
	user,
	tokenMintAccount,
	recipient
);
console.log(
	`🌿 Token account address is: ${tokenAccount.address.toBase58()}`
);

const link = getExplorerLink(
	"address",
	tokenAccount.address.toBase58(),
	"devnet"
);

console.log(`✅ Created token Account: ${link}`);
