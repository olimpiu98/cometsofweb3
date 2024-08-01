import React, { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const SendSol: React.FC = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const { publicKey, sendTransaction } = useWallet();
    const connection = new Connection('https://api.devnet.solana.com');

    const handleSendSol = async () => {
        if (!publicKey) {
            console.log('Please connect your wallet first');
            return;
        }

        const recipientPubKey = new PublicKey(recipient);
        const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPubKey,
                lamports,
            })
        );

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            console.log(`Transaction ${signature} confirmed`);
            console.log(`Ammount sent: ${amount} SOL to ${recipient}`);
            console.log(`Transaction details: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        } catch (error) {
            console.error('Transaction failed', error);
            console.log('Transaction failed');
        }
    };

    return (
        <div>
            <h2>Send Solana</h2>
            <div>
                <label>
                    Recipient Address:
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Amount (SOL):
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleSendSol}>Send</button>
        </div>
    );
};

export default SendSol;