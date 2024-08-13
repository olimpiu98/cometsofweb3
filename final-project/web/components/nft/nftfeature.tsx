'use client'
//import { clusterApiUrl } from "@solana/web3.js";
import { PublicKey } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useNetworkConfiguration } from "./contexts/NetworkConfigurationProvider";
import { FC, useCallback, useState } from "react";
import { notify } from "./utils/notifications";
import { mintWithMetaplexJs } from "./utils/metaplex";
import Image from "next/image";
import { WalletButton } from '../solana/solana-provider';


const TOKEN_NAME = "Token Name";
const TOKEN_SYMBOL = "SYMB";
const TOKEN_DESCRIPTION = "NFT minted on Solana blockchain with Metaplex";
const WORKSHOP_COLLECTION = new PublicKey("CC1Qi29c6uKHRQKxznk4ZAMu7vQQfQV2JNCPwbLGieEv");

const NftFeature: FC = () => {
    const { connection } = useConnection();
    const { networkConfiguration } = useNetworkConfiguration();
    const wallet = useWallet();
    const { publicKey } = useWallet();

    const [tokenName, setTokenName] = useState(TOKEN_NAME);
    const [tokenSymbol, setTokenSymbol] = useState(TOKEN_SYMBOL);
    const [tokenDescription, setTokenDescription] = useState(TOKEN_DESCRIPTION);
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const [mintAddress, setMintAddress] = useState(null);
    const [mintSignature, setMintSignature] = useState(null);

    const uploadImage = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const uploadedImage = event.target.files[0];
            setImage(uploadedImage);
            setCreateObjectURL(URL.createObjectURL(uploadedImage));
            const body = new FormData();
            body.append("file", uploadedImage);
            await fetch("/api/upload", {
                method: "POST",
                body,
            }).catch((res) => {
                notify({ type: 'error', message: `Upload failed!`, description: res });
                console.log('error', `Upload failed! ${res}`);
            });
        }
    };

    const onClickMintNft = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        await mintWithMetaplexJs(
            connection,
            networkConfiguration,
            wallet,
            tokenName,
            tokenSymbol,
            tokenDescription,
            WORKSHOP_COLLECTION,
            image,
        ).then(([mintAddress, signature]) => {
            setMintAddress(mintAddress)
            setMintSignature(signature);
        });
    }, [wallet, connection, networkConfiguration, image, tokenName, tokenSymbol, tokenDescription]);

    return publicKey ?
        (
            <div>
                <div className="flex flex-col justify-around">
                    {!mintAddress && !mintSignature && <div> <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Symbol</span>
                        </div>
                        <input type="text" placeholder={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} className="input input-bordered w-full max-w-xs" />
                    </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Name</span>
                            </div>
                            <input type="text" placeholder={tokenName} onChange={(e) => setTokenName(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Description</span>
                            </div>
                            <input type="text" placeholder={tokenDescription} onChange={(e) => setTokenDescription(e.target.value)} className="input input-bordered w-full max-w-xs" />
                        </label></div>}
                    <div className="mt-5">
                        {createObjectURL && <Image className="mx-auto mb-4" alt='uploadedImage' width='300' height='300' src={createObjectURL} />}
                        {/* nft name is */}
                        <h2>Nft name is {tokenName} with symbol {tokenSymbol}</h2>
                        {!mintAddress && !mintSignature && <div className="mx-auto text-center mb-2">
                            <input className="w-full max-w-xs" type="file" onChange={uploadImage} />
                        </div>}
                    </div>
                </div>

                <div className="flex flex-row justify-center">
                    <div className="relative group items-center">

                        {createObjectURL && !mintAddress && !mintSignature &&
                            <div>
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-orange-300 to-orange-500 
                        rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="px-8 m-2 mt-4 w-40 h-14 btn animate-pulse bg-gradient-to-br from-orange-300 to-orange-500 hover:from-white hover:to-orange-300 text-black text-lg"
                                    onClick={onClickMintNft}
                                >
                                    <span>Mint!</span>

                                </button>
                            </div>
                        }

                        {mintAddress && mintSignature &&
                            <div>
                                <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
                                    <p>Mint successful!</p>
                                    <p className="text-xl mt-4 mb-2">
                                        Mint address: <span className="font-bold text-lime-500">
                                            <a
                                                className="border-b-2 border-transparent hover:border-lime-500"
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={`https://explorer.solana.com/address/${mintAddress}?cluster=${networkConfiguration}`}
                                            >{mintAddress}</a>
                                        </span>
                                    </p>
                                    <p className="text-xl">
                                        Tx signature: <span className="font-bold text-amber-600">
                                            <a
                                                className="border-b-2 border-transparent hover:border-amber-600"
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={`https://explorer.solana.com/tx/${mintSignature}?cluster=${networkConfiguration}`}
                                            >{mintSignature}</a>
                                        </span>
                                    </p>
                                </h4>
                            </div>
                        }
                    </div>
                </div>
            </div >
        ) : (
            <div className="hero py-[64px]">
                <div className="hero-content text-center">
                    <WalletButton />
                </div>
            </div>
        )
}
export default NftFeature;