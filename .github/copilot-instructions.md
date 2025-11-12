# CertiChain Development Guide

## Architecture Overview

CertiChain is a blockchain-based certificate verification system using **Next.js 15 App Router + Prisma + Base Sepolia + IPFS (Pinata)**. The system enables educational institutions to issue tamper-proof digital certificates that can be independently verified by employers.

### Core Components

- **Frontend**: Next.js 15 with App Router (`/app` directory structure)
- **Backend**: Next.js API routes with service/repository pattern in `/core`
- **Database**: PostgreSQL with Prisma ORM (custom output to `/app/generated/prisma`)
- **Blockchain**: Base Sepolia network integration with ethers.js
- **Storage**: IPFS via Pinata SDK for decentralized file storage
- **Auth**: Environment-based issuer wallet system

### Data Flow Architecture

1. **Certificate Creation**: File → SHA-256 hash → IPFS upload → DB storage (pending)
2. **Blockchain Registration**: Smart contract call → on-chain proof → DB status update (verified)
3. **Public Verification**: Hash lookup → blockchain verification → IPFS file retrieval

## Key Patterns & Conventions

### Service Layer Pattern

Services in `/core/services/` handle business logic. Always use the repository pattern:

```typescript
// Service coordinates between repositories and external APIs
export class CertificateService {
  private certRepo = new CertificateRepository();

  async createCertificate(input: CertificateUploadInput) {
    const fileHash = certSha256(Buffer.from(await file.arrayBuffer()));
    // Upload to IPFS first, then save to DB
  }
}
```

### Repository Pattern

Repositories in `/core/repositories/` encapsulate database operations:

```typescript
// All DB queries go through repositories
export class CertificateRepository {
  async findByHash(fileHash: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({ where: { fileHash } });
  }
}
```

### Prisma Configuration

- Custom output path: `../app/generated/prisma` (not default node_modules)
- Import from: `@/app/generated/prisma/client`
- Singleton pattern in `/lib/db.ts` prevents connection issues

### IPFS Integration

Always use Pinata SDK through `/utils/config.ts`:

```typescript
const { cid } = await pinata.upload.public.file(file);
const url = await pinata.gateways.public.convert(cid);
```

## Development Workflows

### Local Setup

```bash
npm install
npx prisma generate  # Generate client to app/generated/prisma
npx prisma db push   # Sync schema to database
npm run dev          # Start development server
```

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npx prisma generate` to update client
3. Run `npx prisma db push` for development or `npx prisma migrate dev` for production

### Environment Variables Required

```env
DATABASE_URL=          # PostgreSQL connection
DIRECT_URL=           # Direct DB connection (for migrations)
PINATA_JWT=           # Pinata API key for IPFS
NEXT_PUBLIC_GATEWAY_URL= # Pinata gateway URL
ISSUER_WALLET=        # University wallet address
```

## API Conventions

### Route Structure

- `/api/certificates` - Main CRUD operations
- `/api/certificates/register` - Blockchain registration
- `/api/certificates/verify` - Public verification endpoint

### Request/Response Patterns

```typescript
// Always use FormData for file uploads
const data = await request.formData();
const file = data.get("file") as File;

// Standardized error responses
return NextResponse.json({ error: "Error message" }, { status: 400 });

// Consistent success responses
return NextResponse.json({
  status: "pending",
  fileHash: "0xabc...",
  ipfsFile: "Qm...",
  certificateId: 1,
});
```

## File Organization

### App Router Structure

```
app/
├── api/certificates/          # Backend API routes
├── dashboard/                 # Institution management UI
├── certificates/[id]/         # Certificate detail pages
├── verify/[hash]/            # Public verification pages
└── globals.css               # Tailwind base styles
```

### Core Business Logic

```
core/
├── services/                 # Business logic layer
├── repositories/            # Data access layer
└── [future: blockchain/]    # Smart contract interactions
```

## Critical Integration Points

### Blockchain Integration

- Uses Base Sepolia testnet
- Smart contract handles `registerCertificate()` and `verifyCertificate()`
- Ethers.js for contract interaction (not wagmi hooks in backend)

### IPFS Storage

- All files uploaded to Pinata IPFS
- CID stored in database for retrieval
- Public gateways used for verification

### Hash-Based Verification

- SHA-256 file hashing for integrity
- Student ID hashing for privacy
- Hash serves as primary verification key

## Testing & Debugging

### Common Issues

- Prisma client path: Check `/app/generated/prisma` exists after `prisma generate`
- IPFS uploads: Verify PINATA_JWT and gateway URL configuration
- Database connections: Use DIRECT_URL for migrations, DATABASE_URL for queries

### Useful Commands

```bash
npx prisma studio           # Database GUI
npx prisma db seed         # Run seed data
npm run lint              # ESLint checking
```

## Security Considerations

- Student IDs are hashed before storage (privacy)
- File integrity verified through SHA-256 hashing
- Issuer wallet controls certificate authenticity
- No sensitive data stored on blockchain (only hashes/CIDs)
