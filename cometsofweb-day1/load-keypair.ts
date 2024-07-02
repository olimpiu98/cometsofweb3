import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import bs58 from "bs58";

const keypair = getKeypairFromEnvironment("SECRET_KEY");
const privatKey = bs58.encode(keypair.secretKey);
console.log(
    `✅ Our public key is: ${keypair.publicKey.toBase58()}`
);

console.log(`🔐 Private key: ${privatKey}`);