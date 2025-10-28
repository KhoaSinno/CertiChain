import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

// RPC URL for Base Sepolia
const RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 
  'https://base-sepolia.g.alchemy.com/v2/demo';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'CertiChain',
        url: 'https://certichain.edu.vn',
        iconUrl: 'https://certichain.edu.vn/logo.png',
      },
    }),
  ],
  transports: {
    [baseSepolia.id]: http(RPC_URL),
  },
});

// Smart contract ABI (placeholder for now)
export const CERTIFICATE_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: '_fileHash', type: 'bytes32' },
      { internalType: 'string', name: '_ipfsHash', type: 'string' },
      { internalType: 'bytes32', name: '_studentIdHash', type: 'bytes32' },
    ],
    name: 'registerCertificate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_fileHash', type: 'bytes32' }],
    name: 'getCertificate',
    outputs: [
      { internalType: 'address', name: 'issuer', type: 'address' },
      { internalType: 'string', name: 'ipfsHash', type: 'string' },
      { internalType: 'uint256', name: 'issuedAt', type: 'uint256' },
      { internalType: 'bytes32', name: 'studentIdHash', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_fileHash', type: 'bytes32' }],
    name: 'verifyCertificate',
    outputs: [
      { internalType: 'bool', name: 'isVerified', type: 'bool' },
      { internalType: 'address', name: 'issuer', type: 'address' },
      { internalType: 'string', name: 'ipfsHash', type: 'string' },
      { internalType: 'uint256', name: 'issuedAt', type: 'uint256' },
      { internalType: 'bytes32', name: 'studentIdHash', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract address trên Base Sepolia (sẽ được deploy)
export const CERTIFICATE_REGISTRY_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`; // Placeholder

// Chain configuration
export const CHAIN_CONFIG = {
  id: baseSepolia.id,
  name: baseSepolia.name,
  nativeCurrency: baseSepolia.nativeCurrency,
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
  blockExplorers: baseSepolia.blockExplorers,
};