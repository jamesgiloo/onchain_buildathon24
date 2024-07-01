// src/utils/getAttestationsData.js
import { getAttestations } from '@coinbase/onchainkit/identity';
import { baseSepolia } from 'viem/chains';
import { userList } from '../data/userAddressMap';
import { getSchemaId } from '../data/EASSchemaId';
import { useReadContract } from 'wagmi';
import indexerABI from '../contracts/indexerABI.json';
import EASABI from '../contracts/EASABI.json';
import { indexerAddress, EASAddress } from "../data/contractAddress";
// import { ethers } from "ethers";
const { ethers, JsonRpcProvider } = require("ethers")

const provider = new JsonRpcProvider("https://base-sepolia.infura.io/v3/9b2a8754f60f4498be8030a4707d380f");

const mapArrayToObject = (array) => ({
  uid: array[0],
  schema: array[1],
  time: array[2],
  expirationTime: array[3],
  revocationTime: array[4],
  refUID: array[5],
  recipient: array[6],
  attester: array[7],
  revocable: array[8],
  data: array[9],
});

const getAttestationsData = async (schemaName, contractAddress) => {
    try {
      const schemaId = getSchemaId(schemaName);
        
        const indexerContract = new ethers.Contract(indexerAddress, indexerABI, provider);
        const easContract = new ethers.Contract(EASAddress, EASABI, provider);

        const allAttestations = await Promise.all(
            userList.map(async (user) => {
                const length = await indexerContract.getSchemaAttesterRecipientAttestationUIDCount(schemaId, contractAddress, user.address);
                const attestationUIDs = await indexerContract.getSchemaAttesterRecipientAttestationUIDs(schemaId, contractAddress, user.address, 0, length, true);
                const attestationDetails = await Promise.all(
                    attestationUIDs.map(async (uid) => {
                        const attestation = await easContract.getAttestation(uid);
                        return mapArrayToObject(attestation);
                    })
                );

                return attestationDetails;
            })
        );

        return allAttestations.flat();

      } catch (error) {
        console.error('Error fetching attestations:', error);
        return [];
      }
};

export default getAttestationsData;
