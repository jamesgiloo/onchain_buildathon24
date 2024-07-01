// src/utils/getAttestationDetails.js
import { getUser } from '../data/userAddressMap';
import getAttestationsData from './getAttestationsData';
import { schemaIdList } from '../data/EASSchemaId';

const leaderboardLink = "https://www.stack.so/leaderboard/leaderboard-40a3-78225-2781"

const getAttestationDetails = async (director, contractAddress) => {
  try {
    const attestationRecords = await Promise.all(
      schemaIdList.map(async ({ name, schemaId }) => {
        const attestations = await getAttestationsData(name, contractAddress);
        return attestations.map(attestation => ({
          schemaName: name,
          ...attestation
        }));
      })
    );

    const sortedAttestations = attestationRecords.flat().sort((a, b) => parseInt(b.time) - parseInt(a.time));

    return sortedAttestations.map(detail => {
      const user = getUser(detail.recipient);
      let message = '';
      switch(detail.schemaName) {
        case 'curatorLevel':
          message = `${user.name} received a Curator badge. (<a href="https://base-sepolia.easscan.org/attestation/view/${detail.uid}" target="_blank">record</a>).`;
          break;
        case 'curatorPoint':
          message = `${user.name} received 5 G points. (<a href="${leaderboardLink}" target="_blank">leaderboard</a>)`;
          break;
        case 'purchaserPoint':
          message = `${user.name} received 50 G points. (<a href="${leaderboardLink}" target="_blank">leaderboard</a>)`;
          break;
        case 'directorPoint':
          message = `${user.name} received 15 G points. (<a href="${leaderboardLink}" target="_blank">leaderboard</a>)`;
          break;
        case 'curatorRevenue':
          message = user.name === director
            ? `${user.name} received 4.75 USDC. (<a href="https://sepolia.basescan.org/address/${detail.recipient}" target="_blank">tx</a>)`
            : `${user.name} (curator) received 0.25 USDC. (<a href="https://sepolia.basescan.org/address/${detail.recipient}" target="_blank">tx</a>)`;
          break;
        case 'purchaseTicket':
          message = `${user.name} purchased 1 ticket. (<a href="https://sepolia.basescan.org/address/${detail.recipient}" target="_blank">tx</a>)`;
          break;
        case 'proofOfWatched':
          message = `${user.name} received a Proof of Watch. (<a href="https://base-sepolia.easscan.org/attestation/view/${detail.uid}" target="_blank">record</a>)`;
          break;
        default:
          message = '';
      }
      return { ...detail, message };
    });
  } catch (error) {
    console.error('Error fetching attestation details:', error);
    return [];
  }
};

export default getAttestationDetails;
