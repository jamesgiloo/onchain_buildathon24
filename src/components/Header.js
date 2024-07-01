// src/components/Header.js
import React, { useCallback } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '../assets/GilooLogoCircle 1.svg';
import './Header.css';

const Header = () => {
const { connectors, connect, data } = useConnect();
const { address, isConnected } = useAccount();

const createWallet = useCallback(() => {
  
    const coinbaseWalletConnector = connectors.find(
    (connector) => connector.id === 'coinbaseWalletSDK'
    );
    
    if (coinbaseWalletConnector) {
        connect({ connector: coinbaseWalletConnector });
    }
}, [connectors, connect]);

  return (
    <div className="header">
      <div className="logo">
      <img src={logo} alt="Giloo Logo" className="logo" />
      </div>

      <div className="buttons">
      <ConnectButton />
      {isConnected ? (
          <>
          </>
        ) : (
            <button className="create-wallet-button" onClick={createWallet}>Create wallet</button>
        )}
      
      </div>
    </div>
  );
};

export default Header;
