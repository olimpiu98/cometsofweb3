import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
	Metaplex,
	keypairIdentity,
	bundlrStorage,
	NftWithToken,
	toMetaplexFile,
	PublicKey,
} from "@metaplex-foundation/js";

import "dotenv/config";
import {
	getExplorerLink,
	getKeypairFromEnvironment,
} from "@solana-developers/helpers";

import * as fs from "fs";

interface NftData {
	name: string;
	symbol: string;
	description: string;
	sellerFeeBasisPoints: number;
	imageFile: string;
}

// example data for a new NFT
const nftData = {
	name: "Maria of web",
	symbol: "MOW",
	description: "Maria of web NFT",
	sellerFeeBasisPoints: 0,
	imageFile: "success.png",
};

// TODO: BONUS example data for updating an existing NFT
const updateNftData = {
	name: "Update",
	symbol: "UPDATE",
	description: "Update Description",
	sellerFeeBasisPoints: 100,
	imageFile: "success.png",
};

// helper function to upload image and metadata
async function uploadMetadata(
	metaplex: Metaplex,
	nftData: NftData
): Promise<string> {
	// file to buffer
	const buffer = fs.readFileSync("src/" + nftData.imageFile);

	// buffer to metaplex file
	const file = toMetaplexFile(buffer, nftData.imageFile);

	// upload image and get image uri
	const imageUri = await metaplex.storage().upload(file);
	console.log("image uri:", imageUri);

	// upload metadata and get metadata uri (off chain metadata)
	const { uri } = await metaplex.nfts().uploadMetadata({
		name: nftData.name,
		symbol: nftData.symbol,
		description: nftData.description,
		image: imageUri,
	});

	console.log("metadata uri:", uri);
	return uri;
}

// helper function create NFT
async function createNft(
	metaplex: Metaplex,
	uri: string,
	nftData: NftData
): Promise<NftWithToken> {
	const { nft } = await metaplex.nfts().create(
		{
			uri: uri, // metadata URI
			name: nftData.name,
			sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
			symbol: nftData.symbol,
		},
		{ commitment: "finalized" }
	);

	console.log(
		`Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
	);

	return nft;
}

// [BONUS] TODO: Implement helper function update NFT
// helper function update NFT
async function updateNftUri(
	metaplex: Metaplex,
	uri: string,
	mintAddress: PublicKey
) {
	// fetch NFT data using mint address
	const nft = await metaplex.nfts().findByMint({ mintAddress });

	// update the NFT metadata
	const { response } = await metaplex.nfts().update(
		{
			nftOrSft: nft,
			uri: uri,
		},
		{ commitment: "finalized" }
	);

	console.log(
		`Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
	);

	console.log(
		`Transaction: https://explorer.solana.com/tx/${response.signature}?cluster=devnet`
	);
}

async function main() {
	// create a new connection to the cluster's API
	const connection = new Connection(clusterApiUrl("devnet"));

	// initialize a keypair for the user
	const user = getKeypairFromEnvironment("SECRET_KEY");

	console.log(
		`🔑 We've loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
	);

	// TODO: Setup metaplex
	// metaplex set up
	const metaplex = Metaplex.make(connection)
		.use(keypairIdentity(user))
		.use(
			bundlrStorage({
				address: "https://devnet.bundlr.network",
				providerUrl: "https://api.devnet.solana.com",
				timeout: 60000,
			})
		);
	// 	// upload the NFT data and get the URI for the metadata
	//	const uri = await uploadMetadata(metaplex, nftData);

	// 	// create an NFT using the helper function and the URI from the metadata
	const nft = await createNft(metaplex, uri, nftData);
	// }

	// BONUS: Update an existing NFT
	// 1. upload updated NFT data and get the new URI for the metadata
	const updatedUri = await uploadMetadata(metaplex, updateNftData);

	//   // 2. update the NFT using the helper function and the new URI from the metadata
	await updateNftUri(metaplex, updatedUri, nft.address);
}

main()
	.then(() => {
		console.log("Finished successfully!");
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
