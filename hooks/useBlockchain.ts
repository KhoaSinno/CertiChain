import { CERTIFICATE_REGISTRY_ABI, CERTIFICATE_REGISTRY_ADDRESS } from '@/lib/wagmiConfig';
import { useUIStore } from '@/state/ui';
import React from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

export function useBlockchain() {
  const { address, isConnected } = useAccount();
  const { setWalletConnected } = useUIStore();

  // Update wallet connection status
  React.useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected, setWalletConnected]);

  return {
    address,
    isConnected,
    truncatedAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '',
  };
}

export function useRegisterCertificate() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const registerCertificate = async (
    fileHash: string,
    ipfsHash: string,
    studentIdHash: string
  ) => {
    try {
      await writeContract({
        address: CERTIFICATE_REGISTRY_ADDRESS,
        abi: CERTIFICATE_REGISTRY_ABI,
        functionName: 'registerCertificate',
        args: [fileHash, ipfsHash, studentIdHash],
      });
    } catch (err) {
      console.error('Error registering certificate:', err);
      throw err;
    }
  };

  return {
    registerCertificate,
    isPending,
    error,
    transactionHash: data,
  };
}

export function useVerifyCertificate(fileHash: string) {
  const { data, isLoading, error } = useReadContract({
    address: CERTIFICATE_REGISTRY_ADDRESS,
    abi: CERTIFICATE_REGISTRY_ABI,
    functionName: 'verifyCertificate',
    args: [fileHash],
    query: {
      enabled: !!fileHash,
    },
  });

  return {
    verificationResult: data,
    isLoading,
    error,
  };
}

export function useGetCertificate(fileHash: string) {
  const { data, isLoading, error } = useReadContract({
    address: CERTIFICATE_REGISTRY_ADDRESS,
    abi: CERTIFICATE_REGISTRY_ABI,
    functionName: 'getCertificate',
    args: [fileHash],
    query: {
      enabled: !!fileHash,
    },
  });

  return {
    certificate: data,
    isLoading,
    error,
  };
}
