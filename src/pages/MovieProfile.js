// src/pages/MovieProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import ERC721ABI from '../contracts/ERC721ABI.json';
import ERC20ABI from '../contracts/ERC20ABI.json';
import getTicketIcon from '../assets/GetTicket.svg';
import playIcon from '../assets/Play.svg';
import playingIcon from '../assets/Playing.svg';
import approveIcon from '../assets/Approve.svg';
import referralLinkIcon from '../assets/RefferalLink.svg';
import { tokenAddress } from '../data/contractAddress';
import { getUser } from '../data/userAddressMap';
import getAttestationsData from '../utils/getAttestationsData';
import getAttestationDetails from '../utils/getAttestationDetails';
import './MovieProfile.css';
import { getLeaderboard, addPoint } from '../utils/stack';


const MovieProfile = () => {
  const { contractAddress } = useParams();
  const { address, isConnected } = useAccount();
  const [baseURI, setBaseURI] = useState('');
  const [nftData, setNftData] = useState({ name: '', imgURL: '', description: '' });
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [director, setDirector] = useState(null);
  const [price, setPrice] = useState(0);
  const [curator, setCurator] = useState(null);
  const [allowance, setAllowance] = useState(0);
  const [watchedIcons, setWatchedIcons] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [attestationMessages, setAttestationMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [haveTicket, setHaveTicket] = useState(false);
  const { 
    data: hash, 
    error,
    isPending,
    writeContract 
} = useWriteContract();

    const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referrer = params.get('curator');
    setCurator(referrer);
  }, [location]);

  const { data } = useReadContract({
        abi: ERC721ABI,
        address: contractAddress,
        functionName: 'baseURI',
        // args: ["0x9A3B3874CBA4E850F8859Ba763386ad3B6917E39"],
    });

    useEffect(() => {
        setBaseURI(data);
      }, [data]);

  useEffect(() => {
    if (baseURI) {
      const fetchNftData = async () => {
        try {
          const response = await fetch(baseURI);
          const data = await response.json();
          setNftData({
            name: data.name,
            imgURL: data.image,
            description: data.description,
            tags: data.tags,
          });
        } catch (error) {
          console.error('Error fetching NFT data:', error);
        }
      };

      fetchNftData();
    }
  }, [baseURI, contractAddress]);

  useEffect(() => {
    const fetchAttestations = async () => {
      const messages = await getAttestationDetails(director, contractAddress);
      setAttestationMessages(messages);
    };
  
    fetchAttestations();
  }, []);

  const { data: haveTicketData } = useReadContract({
    address: contractAddress,
    abi: ERC721ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  useEffect(() => {
    if (haveTicketData) {
        setHaveTicket(haveTicketData > 0 ? true : false);
    }
  }, [haveTicketData]);

  const { data: directorData } = useReadContract({
    address: contractAddress,
    abi: ERC721ABI,
    functionName: 'director',
  });

  useEffect(() => {
    if (directorData) {
        setDirector(getUser(directorData).name);
    }
  }, [directorData]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        const leaderboardData = data.leaderboard.map(item => {
          const user = getUser(item.address);
          return { ...item, ...user };
        });
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const { data: priceData } = useReadContract({
    address: contractAddress,
    abi: ERC721ABI,
    functionName: 'price',
  });

  useEffect(() => {
    if (priceData) {
        setPrice(parseInt(priceData) / 1000000);
    }
  }, [priceData]);

  const { data: allowanceData } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: [address, contractAddress],
  });

  useEffect(() => {
    if (allowanceData) {
      setAllowance(allowanceData);
    }
  }, [allowanceData]);

  const { data: totalEarnedData } = useReadContract({
    address: contractAddress,
    abi: ERC721ABI,
    functionName: 'revenue',
    args: [directorData],
  });

  useEffect(() => {
    if (totalEarnedData) {
        setTotalEarned(parseInt(totalEarnedData) / 1000000);
    }
  }, [totalEarnedData]);

  useEffect(() => {
    const fetchAttestations = async () => {
      const attestations = await getAttestationsData("proofOfWatched", contractAddress);
      const uniqueRecipients = new Set();
      const uniqueIcons = attestations
        .map(attestation => {
          if (uniqueRecipients.has(attestation.recipient)) {
            return null;
          } else {
            uniqueRecipients.add(attestation.recipient);
            const user = getUser(attestation.recipient);
            return user ? user.Icon : null;
          }
        })
        .filter(icon => icon !== null);
      setWatchedIcons(uniqueIcons);
    };
  
    fetchAttestations();
}, [contractAddress]);

  const handleApprove = async () => {
    writeContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [contractAddress, 5000000000],
    })
    console.log(error);
  };

  const handleBuyTicket = async () => {
    writeContract({
        address: contractAddress,
        abi: ERC721ABI,
        functionName: 'mint',
        args: curator ? [address, curator] : [address],
        // value:1000000000000
    })
    console.log(error);
    if(!error){
        addPoint("purchaseTicket", address, 50);
      if(curator){
          addPoint("purchaseTicket", curator, 5);
      }
      addPoint("purchaseTicket", directorData, 15);
    }
};

const handleReferralLink = () => {
    const referralLink = `${window.location.origin}/movie-profile/${contractAddress}?curator=${address}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 3000);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }

  return (
    <div className="movie-profile">
      <div className="movie-header">
        <div className="movie-image-container">
          <img src={nftData.imgURL} alt={nftData.name} className="movie-image" />
          <button className="play-button">
            <img src={haveTicket ? playingIcon : playIcon} alt="Play" />
          </button>
          <div className="movie-actions">
            {allowance >= 5000000 ? (
              <button className="get-ticket-button" onClick={handleBuyTicket}>
                <img src={getTicketIcon} alt="Get Ticket" />
              </button>
            ) : (
              <button className="get-ticket-button" onClick={handleApprove}>
                <img src={getTicketIcon} alt="Approve" />
              </button>
            )}
            <button className="referral-link-button" onClick={handleReferralLink}>
              <img src={referralLinkIcon} alt="Referral Link" />
            </button>
          </div>
        </div>
        {showCopyMessage && (
          <div className="copy-message">
            Copy curator link finish!
          </div>
        )}
      </div>
      <div className="movie-details">
        <h1 className="movie-title">{nftData.name}</h1>
        <h2 className="movie-director">Director: {director}</h2>
        <p className="movie-genre">{nftData.tags}</p>
        <p className="movie-price">{price} USDC/ticket</p>
        <div className="movie-info">
          <div className="movie-description">
            <h3>Proof of Watch <span><a href="https://base-sepolia.easscan.org/schema/view/0x1322773af553519857376e6d0498d7d7361c3afad989c75e6658b64e63b0ad21" target="_blank">(record)</a></span></h3>
            <div className="watched-icons">
              {watchedIcons.map((icon, index) => (
                <img key={index} src={icon} alt="User Icon" className="user-icon" />
              ))}
            </div>
            <br/>
            <h3>History</h3>
            <div className="history-messages">
              {attestationMessages.map((message, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: message.message }} />
              ))}
            </div>
          </div>
          <div className="movie-sidebar">
            <h3 className="creator-total-earned">Creator total earned</h3>
            <p className="total-earned-amount">${totalEarned} USDC</p>
            <div className="leaderboard-section">
              <h3>G Points leaderboard</h3>
              <div className="leaderboard">
                {leaderboard.map((entry, index) => (
                  <div key={index} className={`leaderboard-entry ${index % 2 === 0 ? 'grey-background' : ''}`}>
                    <img src={entry.Icon} alt={entry.name} className="leaderboard-icon" />
                    <span className="leaderboard-name">{entry.name}</span>
                    <span className="leaderboard-points">{entry.points} G</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieProfile;
