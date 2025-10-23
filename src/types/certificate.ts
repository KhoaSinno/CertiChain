export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  fileHash: string;
  ipfsHash: string;
  issuer: string;
  issuedAt: Date;
  status: 'pending' | 'verified';
  transactionHash?: string;
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
}
