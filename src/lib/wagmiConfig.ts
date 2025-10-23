import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

// Base Sepolia RPC URL - sử dụng Alchemy hoặc Infura
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

// Smart Contract ABI cho Certificate Registry
export const CERTIFICATE_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'fileHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'ipfsHash', type: 'string', internalType: 'string' },
      { name: 'studentIdHash', type: 'bytes32', internalType: 'bytes32' },
    ],
    name: 'registerCertificate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'fileHash', type: 'bytes32', internalType: 'bytes32' }],
    name: 'verifyCertificate',
    outputs: [
      { name: 'isValid', type: 'bool', internalType: 'bool' },
      { name: 'issuer', type: 'address', internalType: 'address' },
      { name: 'ipfsHash', type: 'string', internalType: 'string' },
      { name: 'issuedAt', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'fileHash', type: 'bytes32', internalType: 'bytes32' }],
    name: 'getCertificate',
    outputs: [
      { name: 'isValid', type: 'bool', internalType: 'bool' },
      { name: 'issuer', type: 'address', internalType: 'address' },
      { name: 'ipfsHash', type: 'string', internalType: 'string' },
      { name: 'studentIdHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'issuedAt', type: 'uint256', internalType: 'uint256' },
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
  network: baseSepolia.network,
  nativeCurrency: baseSepolia.nativeCurrency,
  rpcUrls: {
    default: { http: [RPC_URL] },
    public: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;
