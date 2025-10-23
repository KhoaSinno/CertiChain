export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  fileHash: string;
  ipfsHash?: string;
  issuer?: string;
  issuedAt: Date;
  status: 'verified' | 'pending';
  transactionHash?: string;
  isVerified: boolean;
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
  error?: string;
}