'use client';
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import tokenAddresses from './tokenAddresses.json'; // Import the JSON file

const AccessFeature: FC = () => {
    const { publicKey, wallet } = useWallet();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkTokenExistence = async () => {
            if (publicKey && wallet) {
                const connection = new Connection("https://api.devnet.solana.com");

                // Fetch token accounts by owner
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    publicKey,
                    { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
                );

                // Check if any of the token addresses exist in the wallet
                const tokenExists = tokenAccounts.value.some(
                    accountInfo => tokenAddresses.includes(accountInfo.account.data.parsed.info.mint)
                );

                setMessage(tokenExists ? 'Yes, it exists' : 'No, it does not exist');
            }
        };

        checkTokenExistence();
    }, [publicKey, wallet]);

    return !publicKey ? (
        <div>
            Please connect your wallet.
        </div>
    ) : (
        <div>{message}</div>
    );
};

export default AccessFeature;