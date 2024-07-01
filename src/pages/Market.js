// src/pages/Market.js
import React, { useState, useEffect } from 'react';
import { nftContracts } from '../data/contractAddress';
import './Market.css';
import NftCard from '../components/NftCard';

const Market = () => {
  

  return (
    <div className="market">
      <h1>Market Page</h1>
      <div className="nft-list">
        {nftContracts.map((contractAddress, index) => (
          <NftCard
            key={index}
            contractAddress={contractAddress}
            page='market'
          />
        ))}
      </div>
    </div>
  );
};

export default Market;
