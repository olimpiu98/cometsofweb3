import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {
	getKeypairFromEnvironment,
	getExplorerLink,
} from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔑 Public key is: ${user.publicKey.toBase58()}`);

const tokenMint = await createMint(
	connection,
	user,
	user.publicKey,
	null,
	9
);

const link = getExplorerLink(
	"address",
	tokenMint.toString(),
	"devnet"
);

const mintAddress = tokenMint;
console.log(`🌿 Mint address is: ${mintAddress.toBase58()}`);

console.log(`✅ Finished! Created token mint: ${link}`);
