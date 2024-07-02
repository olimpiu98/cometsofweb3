import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    clusterApiUrl,
    } from "@solana/web3.js";
    
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log(`🛜 Connected to ${connection.rpcEndpoint}` );
    const publicKey = new PublicKey("7Qukt2NUAqComFGhqjFtn5Kstp162xLdkixidYmu9eHT");
    connection.getBalance(publicKey).then((balance) => {
        console.log(`💸 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
        }
    );