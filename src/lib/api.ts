import type { Certificate } from "@/src/types/certificate";

// API Certificate (Prisma) shape returned by our Next API
type ApiCertificate = {
  id: number;
  courseName: string;
  fileHash: string;
  ipfsFile: string;
  issuerAddress: string;
  blockchainTx: string | null;
  mintTx: string | null; // NFT mint transaction hash
  tokenId: string | number | bigint | null; // NFT token ID
  status: "pending" | "verified" | "failed" | string;
  issuedAt: string;
  userId: number;
  student: {
    id: number;
    studentId: string;
    studentName: string;
  };
};

// Map API certificate (Prisma model) to FE certificate type
function mapApiCertificateToClient(apiCert: ApiCertificate): Certificate {
  return {
    id: apiCert.id,
    courseName: apiCert.courseName,
    fileHash: apiCert.fileHash,
    ipfsFile: apiCert.ipfsFile,
    issuerAddress: apiCert.issuerAddress,
    issuedAt: new Date(apiCert.issuedAt),
    status:
      apiCert.status === "verified"
        ? "verified"
        : apiCert.status === "failed"
        ? "failed"
        : "pending",
    blockchainTx: apiCert.blockchainTx ?? undefined,
    mintTx: apiCert.mintTx ?? undefined,
    tokenId: apiCert.tokenId ? String(apiCert.tokenId) : undefined,
    userId: apiCert.userId,
    student: {
      id: apiCert.student.id,
      studentId: apiCert.student.studentId,
      studentName: apiCert.student.studentName,
    },
    // Legacy support
    transactionHash: apiCert.blockchainTx ?? undefined,
    isVerified: apiCert.status === "verified",
  };
}

export const api = {
  certificates: {
    // POST /api/certificates
    create: async (data: FormData) => {
      const response = await fetch(`/api/certificates`, {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to create certificate");
      }
      // Return raw creation response as provided by API spec
      // { status, fileHash, ipfsFile, certificateId, ipfsUrl }
      return response.json();
    },

    // GET /api/certificates
    getAll: async (
      page = 1,
      limit = 10
    ): Promise<{
      data: Certificate[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> => {
      const response = await fetch(
        `/api/certificates?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const result = await response.json();

      // Handle both old and new response formats
      if (Array.isArray(result)) {
        // Old format: just array of certificates
        return {
          data: result.map(mapApiCertificateToClient),
          pagination: {
            page: 1,
            limit: result.length,
            total: result.length,
            totalPages: 1,
          },
        };
      }

      // New format: { data, pagination }
      return {
        data: result.data.map(mapApiCertificateToClient),
        pagination: result.pagination,
      };
    },

    // GET by ID - fetch all and filter client-side
    getById: async (id: string): Promise<Certificate> => {
      // Fetch with high limit to get all certificates
      const response = await fetch(`/api/certificates?page=1&limit=1000`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const result = await response.json();

      let certificates: ApiCertificate[];

      // Handle both old and new response formats
      if (Array.isArray(result)) {
        certificates = result;
      } else if (result.data && Array.isArray(result.data)) {
        certificates = result.data;
      } else {
        throw new Error("Invalid response format");
      }

      const found = certificates.find(
        (c: ApiCertificate) => String(c.id) === String(id)
      );

      if (!found) {
        throw new Error("Certificate not found");
      }

      return mapApiCertificateToClient(found);
    },

    // POST /api/certificates/register
    register: async (certificateId: string) => {
      const response = await fetch(`/api/certificates/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });
      if (!response.ok) {
        throw new Error("Failed to register certificate");
      }
      return response.json();
    },

    // GET /api/certificates/verify?hash=...
    verify: async (hash: string) => {
      const response = await fetch(
        `/api/certificates/verify?hash=${encodeURIComponent(hash)}`
      );
      if (!response.ok) {
        throw new Error("Failed to verify certificate");
      }
      return response.json();
    },
  },
};
