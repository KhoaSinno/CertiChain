import { CERTIFICATE_REGISTRY_ABI, CERTIFICATE_REGISTRY_ADDRESS } from '@/src/lib/wagmiConfig';
import { useUIStore } from '@/src/state/ui';
import React from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

export function useBlockchain() {
  const { address, isConnected } = useAccount();
  const { setWalletConnected } = useUIStore();

  React.useEffect(() => {
    setWalletConnected(isConnected);
  }, [isConnected, setWalletConnected]);

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';

  return {
    address,
    isConnected,
    truncatedAddress,
  };
}

export function useRegisterCertificate() {
  const { writeContract, isPending, error, data } = useWriteContract();

  const registerCertificate = async (
    fileHash: `0x${string}`,
    ipfsHash: string,
    studentIdHash: `0x${string}`
  ) => {
    try {
      await writeContract({
        address: CERTIFICATE_REGISTRY_ADDRESS as `0x${string}`,
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

export function useVerifyCertificate(fileHash: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: CERTIFICATE_REGISTRY_ADDRESS as `0x${string}`,
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

export function useGetCertificate(fileHash: `0x${string}`) {
  const { data, isLoading, error } = useReadContract({
    address: CERTIFICATE_REGISTRY_ADDRESS as `0x${string}`,
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