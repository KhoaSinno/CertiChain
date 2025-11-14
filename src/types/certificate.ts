export interface Certificate {
  id: number; // ✅ Changed from string to number (matches Prisma Int)
  courseName: string;
  fileHash: string;
  ipfsFile: string; // ✅ Changed from ipfsHash to ipfsFile (matches schema)
  issuerAddress: string; // ✅ Changed from issuer to issuerAddress
  issuedAt: Date;
  status: "verified" | "pending" | "failed"; // ✅ Added "failed" status
  blockchainTx?: string; // ✅ Added blockchainTx field
  mintTx?: string; // ✅ Added mintTx field (NFT mint transaction hash)
  tokenId?: string | number; // ✅ Added tokenId field (NFT token ID)
  userId?: number; // ✅ Added userId field
  student?: {
    id: number; // ✅ Changed from string to number
    studentId: string;
    studentName: string;
  };
  // Legacy support for old field names and flattened structure
  studentName?: string; // Flattened from verify API
  studentId?: string; // Flattened from verify API
  transactionHash?: string; // Alias for blockchainTx
  isVerified?: boolean; // Computed from status
}

export interface CreateCertificateRequest {
  studentName: string;
  studentId: string;
  courseName: string;
  file: File;
}

export interface VerifyResult {
  verified: boolean;
  certificate?: Certificate;
  issuer?: string;
  issuedAt?: Date;
  transactionHash?: string;
  mintTx?: string; // NFT mint transaction hash
  tokenId?: string; // NFT token ID
  error?: string;
}
