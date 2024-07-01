import { getDefaultConfig } from '@rainbow-me/rainbowkit';
// import { type Chain } from 'viem'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  baseSepolia
} from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public'

const gilooWeb3Project = {
  id: 8453,
  name: 'giloo-web3-project',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.tenderly.co/fork/000e7289-6fd3-477b-b571-b93858ef763c'] },
  },
}

export const config = getDefaultConfig({
  appName: 'giloo web3 project',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    baseSepolia,
    sepolia,
    // base,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [baseSepolia] : []),
  ],
});