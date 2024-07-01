import React, { useState } from 'react';
import './Airdrop.css';
import { getLeaderboard } from "../utils/stack";
import { getUser } from "../data/userAddressMap"
import { nftContracts } from '../data/contractAddress';
import getAttestationsData from "../utils/getAttestationsData"

const Airdrop = () => {
  const [scoreThreshold, setScoreThreshold] = useState(150);
  const [isScoreFilterEnabled, setIsScoreFilterEnabled] = useState(false);
  const [isCuratorBadgeFilterEnabled, setIsCuratorBadgeFilterEnabled] = useState(false);
  const [proofOfWatchedCount, setProofOfWatchedCount] = useState(1);
  const [isProofOfWatchedFilterEnabled, setIsProofOfWatchedFilterEnabled] = useState(false);
  const [results, setResults] = useState([]);

  const fetchLeaderboardData = async () => {
    try {
      const leaderboardData = await getLeaderboard();

      let filteredUsers = [];

      // Filter users based on the G points above condition
      if (isScoreFilterEnabled) {
        filteredUsers = leaderboardData.leaderboard.filter(user => user.points >= scoreThreshold);
      }

      let curatorBadgeRecipients = [];
      if (isCuratorBadgeFilterEnabled) {
        for (const contractAddress of nftContracts) {
          const attestations = await getAttestationsData("curatorLevel", contractAddress);
          curatorBadgeRecipients = curatorBadgeRecipients.concat(attestations.map(attestation => attestation.recipient));
        }
        // Combine filteredUsers with curatorBadgeRecipients
        const uniqueRecipients = new Set(filteredUsers.map(user => user.address).concat(curatorBadgeRecipients));
        filteredUsers = Array.from(uniqueRecipients).map(address => getUser(address));
      }

      let proofOfWatchedRecipients = {};
      if (isProofOfWatchedFilterEnabled) {
        let proofOfWatchedRecipients = {};
        for (const contractAddress of nftContracts) {
            const attestations = await getAttestationsData("proofOfWatched", contractAddress);
            attestations.forEach(attestation => {
                const recipient = attestation.recipient;
                if (proofOfWatchedRecipients[recipient]) {
                    proofOfWatchedRecipients[recipient]++;
                } else {
                    proofOfWatchedRecipients[recipient] = 1;
                }
            });
        }
        // Filter users based on proofOfWatchedCount
        const filteredProofOfWatchedUsers = Object.keys(proofOfWatchedRecipients)
            .filter(recipient => proofOfWatchedRecipients[recipient] >= proofOfWatchedCount)
            .map(recipient => getUser(recipient))
            .filter(user => user !== null);
        console.log(filteredProofOfWatchedUsers)
    
        // Combine filteredUsers with filteredProofOfWatchedUsers
        const uniqueRecipients = new Set(filteredUsers.map(user => user.address).concat(filteredProofOfWatchedUsers.map(user => user.address)));
        filteredUsers = Array.from(uniqueRecipients).map(address => getUser(address)).filter(user => user !== null);
    }

      // Get user icons for the final filtered users
      const userIcons = filteredUsers.map(user => getUser(user.address));
      setResults(userIcons);
    } catch (error) {
      console.error('Error fetching leaderboard data or attestations:', error);
    }
  };


  return (
    <div className="airdrop-container">
      <h1>Drop and Gift</h1>
      <div className="section">
        <h2>1. Choose members to drop and gift</h2>
        <div className="criteria-result-container">
          <div className="criteria">
          <h3>Criteria</h3>
            <div className="criteria-item">
              <label>G points above</label>
              <div className="input-group">
                <div className="toggle-switch">
                <input 
                      type="checkbox" 
                      id="g-points-switch" 
                      checked={isScoreFilterEnabled}
                      onChange={() => setIsScoreFilterEnabled(!isScoreFilterEnabled)}
                    />
                  <label htmlFor="g-points-switch"></label>
                </div>
                <input
                    type="text"
                    className="input-box"
                    value={scoreThreshold}
                    onChange={(e) => setScoreThreshold(Number(e.target.value))}
                  />
              </div>
            </div>
            <div className="criteria-item">
            <label>With Curator badge</label>
                <div className="input-group">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="curator-badge-switch" 
                      checked={isCuratorBadgeFilterEnabled}
                      onChange={() => setIsCuratorBadgeFilterEnabled(!isCuratorBadgeFilterEnabled)}
                    />
                    <label htmlFor="curator-badge-switch"></label>
                  </div>
                </div>
            </div>
            <div className="criteria-item">
              <label># of Proof of Watch collected</label>
              <div className="input-group">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="proof-watched-switch" 
                      checked={isProofOfWatchedFilterEnabled}
                      onChange={() => setIsProofOfWatchedFilterEnabled(!isProofOfWatchedFilterEnabled)}
                    />
                    <label htmlFor="proof-watched-switch"></label>
                  </div>
                  <input
                    type="text"
                    className="input-box"
                    value={proofOfWatchedCount}
                    onChange={(e) => setProofOfWatchedCount(Number(e.target.value))}
                    disabled={!isProofOfWatchedFilterEnabled}
                  />
                </div>
            </div>
            <button className="search-button" onClick={fetchLeaderboardData}>Search</button>
          </div>
          <div className="result-container">
          <h3>Result ({results.length})</h3>
            <div className="result">
              {results.map((user, index) => (
                <img key={index} src={user.Icon} alt={user.name} title={user.name} className="user-icon" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2>2. Choose actions</h2>
        <div className="actions">
          <button className="drop-tickets-button">Drop</button>
          <button className="direct-messages-button">Direct messages</button>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;

