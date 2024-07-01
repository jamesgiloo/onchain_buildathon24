// src/components/NftCard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import ERC721ABI from '../contracts/ERC721ABI.json';
import './NftCard.css';

const NftCard = ({ contractAddress, page }) => {
    const { address, isConnected } = useAccount();
    const [nftData, setNftData] = useState({ name: '', imgURL: '', description: '' });
    const [baseURI, setBaseURI] = useState('');
    const { 
        data: hash, 
        error,
        isPending,
        writeContract 
    } = useWriteContract();

    const { data,
    isError,
    isLoading,
    isSuccess,
    failureReason
    } = useReadContract({
        abi: ERC721ABI,
        address: contractAddress,
        functionName: 'baseURI',
        // args: ["0x9A3B3874CBA4E850F8859Ba763386ad3B6917E39"],
    });
    // console.log("failureReason: ", failureReason)
    // console.log(data)

    useEffect(() => {
        setBaseURI(data);
      }, [data]);

    const handleBuyTicket = async () => {
        writeContract({
            address: contractAddress,
            abi: ERC721ABI,
            functionName: 'mint',
            args: [address],
            value:1000000000000
        })
        console.log(error);
    };

    useEffect(() => {
        if (baseURI) {
          const fetchNftData = async () => {
            try {
              const response = await fetch(baseURI);
              const data = await response.json();
              setNftData({ 
                name: data.name, 
                imgURL: data.image, 
                description: data.description 
              });
            } catch (error) {
              console.error('Error fetching NFT data:', error);
            }
          };
    
          fetchNftData();
        }
      }, [baseURI, contractAddress]);

    return (
        <div className="nft-card">
        <Link to={`/movie-profile/${contractAddress}`}>
        <img src={nftData.imgURL} alt={nftData.name} />
        </Link>
        <div className="nft-info">
            <h2 className="nft-name">{nftData.name}</h2>
            <p className="nft-description">{nftData.description}</p>
            {page === "market" ? <button disabled={isPending || !isConnected} onClick={() => handleBuyTicket()}>
                { isConnected ? isPending ? 'Confirming...' : 'Buy Ticket' : 'Connect first'}
            </button> : <></> }
        </div>
        </div>
    );
};

export default NftCard;
