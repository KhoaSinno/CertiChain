import type { Certificate } from '@/src/types/certificate';
// API Certificate (Prisma) shape returned by our Next API
type ApiCertificate = {
  id: number;
  studentName: string;
  studentIdHash: string;
  courseName: string;
  fileHash: string;
  ipfsCid: string;
  issuerAddress: string;
  blockchainTx: string | null;
  status: 'pending' | 'verified' | 'failed' | string;
  issuedAt: string;
};

// Map API certificate (Prisma model) to FE certificate type
function mapApiCertificateToClient(apiCert: ApiCertificate): Certificate {
  return {
    id: String(apiCert.id),
    studentName: apiCert.studentName,
    studentId: '',
    courseName: apiCert.courseName,
    fileHash: apiCert.fileHash,
    ipfsHash: apiCert.ipfsCid,
    issuer: apiCert.issuerAddress,
    issuedAt: new Date(apiCert.issuedAt),
    status: apiCert.status === 'verified' ? 'verified' : 'pending',
    transactionHash: apiCert.blockchainTx ?? undefined,
    isVerified: apiCert.status === 'verified',
  };
}

export const api = {
  certificates: {
    // POST /api/certificates
    create: async (data: FormData) => {
      const response = await fetch(`/api/certificates`, {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        throw new Error('Failed to create certificate');
      }
      // Return raw creation response as provided by API spec
      // { status, fileHash, ipfsCid, certificateId, ipfsUrl }
      return response.json();
    },

    // GET /api/certificates
    getAll: async (): Promise<Certificate[]> => {
      const response = await fetch(`/api/certificates`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }
      const list: ApiCertificate[] = await response.json();
      return Array.isArray(list) ? list.map(mapApiCertificateToClient) : [];
    },

    // GET (not implemented server route by id; we can filter client-side when needed)
    getById: async (id: string): Promise<Certificate> => {
      const response = await fetch(`/api/certificates`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }
      const list: ApiCertificate[] = await response.json();
      const found = Array.isArray(list)
        ? list.find((c: ApiCertificate) => String(c.id) === String(id))
        : null;
      if (!found) {
        throw new Error('Certificate not found');
      }
      return mapApiCertificateToClient(found);
    },

    // POST /api/certificates/register
    register: async (certificateId: string) => {
      const response = await fetch(`/api/certificates/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId }),
      });
      if (!response.ok) {
        throw new Error('Failed to register certificate');
      }
      return response.json();
    },

    // GET /api/certificates/verify?hash=...
    verify: async (hash: string) => {
      const response = await fetch(`/api/certificates/verify?hash=${encodeURIComponent(hash)}`);
      if (!response.ok) {
        throw new Error('Failed to verify certificate');
      }
      return response.json();
    },
  },
};
