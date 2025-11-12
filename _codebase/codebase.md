# Project Export

## Project Statistics

- Total files: 130

## Folder Structure

```
.env.example
.github
  copilot-instructions.md
.gitignore
.vercelignore
app
  animations.css
  api
    auth
      [...nextauth]
        route.ts
    certificates
      register
        route.ts
      route.ts
      verify
        route.ts
    students
      route.ts
  certificates
    create
      page.tsx
    view
      [id]
        page.tsx
    [id]
      page.tsx
  dashboard
    page.tsx
  ErrorBoundary.tsx
  favicon.ico
  glass-effects.css
  globals.css
  layout.tsx
  loading.tsx
  login
    page.tsx
  page.tsx
  providers.tsx
  theme-colors.css
  utilities.css
  verify
    page.tsx
components.json
contracts
  .gitignore
  contracts
    CertiChain.sol
  hardhat.config.ts
  ignition
    modules
      CertiChain.ts
  package.json
  README.md
  scripts
    send-op-tx.ts
  server
    addCertificate.ts
    addIssuer.ts
    index.ts
  Smart Contract.md
  tsconfig.json
core
  repositories
    blockchain.repository.ts
    certificate.repository.ts
    user.repository.ts
  services
    certificate.service.ts
    user.service.ts
eslint.config.mjs
lib
  abi
    CertiChain.json
  auth.ts
  db.ts
  ipfs.ts
LICENSE
middleware.ts
next.config.ts
package.json
postcss.config.mjs
prisma
  schema.prisma
  seed.ts
prisma.config.ts
PRISMA_GUIDE.MD
public
  file.svg
  globe.svg
  next.svg
  pdfjs
    pdf.worker.legacy.min.mjs
    pdf.worker.min.mjs
  vercel.svg
  window.svg
README.md
src
  auth.ts
  components
    CertificateCard.tsx
    CertificateDisplay.tsx
    CertificateForm.tsx
    CertificateList.tsx
    CTA.tsx
    dashboard
      CertificateListSection.tsx
      HolderDashboard.tsx
      IssuerDashboard.tsx
    Features.tsx
    FilePreview.tsx
    Footer.tsx
    GlobalLogoutOverlay.tsx
    Header.tsx
    Hero.tsx
    Layout.tsx
    Login.tsx
    Navigation.tsx
    Process.tsx
    QRDisplay.tsx
    RoleRouteGuard.tsx
    RoleSwitcher.tsx
    StatisticsCards.tsx
    ui
      badge.tsx
      button.tsx
      card.tsx
      dropdown-menu.tsx
      input.tsx
      navigation-menu.tsx
      pagination.tsx
      progress.tsx
      select.tsx
      separator.tsx
      textarea.tsx
    UserMenu.tsx
    VerifyResult.tsx
  hooks
    useAuth.ts
    useCertificates.ts
    useRole.ts
    useUpload.ts
    useVerify.ts
  lib
    api.ts
    utils.ts
  state
    data.ts
    ui.ts
  types
    certificate.ts
    pdfjs.d.ts
    role.ts
    user.ts
test-auth-simple.ts
test-auth.ts
TEST_AUTH.md
tsconfig.json
types
  next-auth.d.ts
utils
  config.ts
_docs_FE
  askToFE.md
  FE_AUTH_GUIDE.md
  MIDDLEWARE_GUIDE.md
  README_AUTH.md
_docs_fixed
  README.md
_flow_instructions
  BE Flow.md
  FE Flow.md
  SmartContract Flow.md
  _frontendflow.json

```

### .env.example

*(Unsupported file type)*

### .github\copilot-instructions.md

```md
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
  ipfsCid: "Qm...",
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

```

### .gitignore

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
/.history

/app/generated/prisma

```

### .vercelignore

*(Unsupported file type)*

### app\animations.css

```css
/* Custom animations keyframes */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}


```

### app\api\auth\[...nextauth]\route.ts

```ts
// app/api/auth/[...nextauth]/route.ts
// NextAuth v4 API Route Handler
export { GET, POST } from "@/src/auth";

```

### app\api\certificates\register\route.ts

```ts
import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { BlockchainService } from "@/core/repositories/blockchain.repository";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json(
        {
          error: "Certificate ID is required",
          step: "validation",
        },
        { status: 400 }
      );
    }

    // Find the certificate
    const certificate = await certificateRepo.findById(
      certificateId.toString()
    );
    // Validate
    if (!certificate) {
      return NextResponse.json(
        {
          error: "Certificate not found",
          step: "database_lookup",
          certificateId,
        },
        { status: 404 }
      );
    }

    // Register on blockchain
    const blockchainTx = await blockchainService.registerOnChain(
      certificate.fileHash
    );

    // Update the status to verified
    await certificateRepo.updateStatus(
      certificateId.toString(),
      "verified",
      blockchainTx
    );

    return NextResponse.json({
      status: "success",
      message: "Certificate registered on blockchain",
      txHash: blockchainTx,
      certificateId: certificateId,
      certificate: {
        id: certificate.id,
        fileHash: certificate.fileHash,
      },
    });
  } catch (error) {
    // Return detailed error information
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const errorName = error instanceof Error ? error.name : "UnknownError";

    return NextResponse.json(
      {
        error: errorMessage,
        errorName,
        errorType: typeof error,
        step: "blockchain_registration",
        details:
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack?.split("\n").slice(0, 5).join("\n"), // First 5 lines of stack
              }
            : String(error),
      },
      { status: 500 }
    );
  }
}

```

### app\api\certificates\route.ts

```ts
import { CertificateService } from "@/core/services/certificate.service";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const certificateService = new CertificateService();

export async function POST(request: Request) {
  try {
    // Xác thực người dùng với NextAuth
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    // Kiểm tra role - CHỈ ADMIN mới được tạo certificate
    const currentUser = await prisma.user.findFirst({
      where: { id: parseInt(session.user.id) },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User không tồn tại." },
        { status: 404 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Chỉ Admin mới có thể tạo certificate." },
        { status: 403 }
      );
    }

    // Get form data from request
    const data = await request.formData();
    // Extract data from form data
    const file = data.get("file") as File | null;
    const studentName = data.get("studentName") as string | null;
    const studentId = data.get("studentId") as string | null;
    const courseName = data.get("courseName") as string | null;

    // Validate inputs
    if (!file || !studentName || !studentId || !courseName) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu bắt buộc." },
        { status: 400 }
      );
    }

    // Tìm user theo studentId
    const student = await prisma.user.findFirst({
      where: { studentId: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: `Không tìm thấy sinh viên với student ID: ${studentId}` },
        { status: 404 }
      );
    }

    // Call service to create certificate
    const result = await certificateService.createCertificate({
      file,
      studentName,
      studentId,
      courseName,
      userId: student.id, // Sử dụng userId của sinh viên được tạo certificate
    });

    // return response
    return NextResponse.json(
      {
        status: result.status,
        fileHash: result.fileHash,
        ipfsCid: result.ipfsCid,
        certificateId: result.id,
        ipfsUrl: result.url, // Thêm URL này cho FE dùng luôn
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(console.error("Lỗi tại POST /api/certificates:", error));

    return NextResponse.json({ error: "Lỗi máy chủ nội bộ." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Xác thực người dùng
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Vui lòng đăng nhập." },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findFirst({
      where: { id: parseInt(session.user.id) },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User không tồn tại." },
        { status: 404 }
      );
    }

    // Get pagination params from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let certificates;
    let total;

    // ADMIN: Xem tất cả certificates
    if (currentUser.role === "ADMIN") {
      [certificates, total] = await Promise.all([
        prisma.certificate.findMany({
          skip,
          take: limit,
          orderBy: { issuedAt: "desc" },
          include: { student: true },
        }),
        prisma.certificate.count(),
      ]);
    }
    // STUDENT: Chỉ xem certificates của chính mình
    else {
      [certificates, total] = await Promise.all([
        prisma.certificate.findMany({
          where: { userId: currentUser.id },
          skip,
          take: limit,
          orderBy: { issuedAt: "desc" },
          include: { student: true },
        }),
        prisma.certificate.count({
          where: { userId: currentUser.id },
        }),
      ]);
    }

    // Map certificates to ensure consistent format
    const mappedCertificates = certificates.map(cert => ({
      ...cert,
      transactionHash: cert.blockchainTx, // Add alias for compatibility
    }));

    return NextResponse.json({
      data: mappedCertificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

```

### app\api\certificates\verify\route.ts

```ts
import { NextResponse } from "next/server";
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { BlockchainService } from "@/core/repositories/blockchain.repository";

const certificateRepo = new CertificateRepository();
const blockchainService = new BlockchainService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash"); // can be fileHash or blockchainTx

    if (!hash) {
      return NextResponse.json(
        { error: "Hash parameter is required" },
        { status: 400 }
      );
    }

    // 2 OPT: By file hash and by blockchain/ transaction hash
    let certificate = await certificateRepo.findByHash(hash);
    if (!certificate) {
      certificate = await certificateRepo.findByTxHash(hash);
    }

    // Validate certificate data layer 1: DATABASE - OFFchain
    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: "Certificate not found",
        hash: hash,
      });
    }

    //  Standard check form data response
    if (!certificate.student) {
      return NextResponse.json({
        verified: false,
        message: "Student information not found",
        hash: hash,
      });
    }

    // Find certificate on blockchain using fileHash
    const certOnChain = await blockchainService.verifyOnChain(
      certificate.fileHash
    );

    // ----- Validate certificate data layer 2: ONCHAIN -----
    if (
      !certOnChain.isValid ||
      certOnChain.issuerAddress.toLowerCase() !==
        certificate.issuerAddress.toLowerCase()
    ) {
      return NextResponse.json({
        verified: false,
        message: "Certificate is invalid on blockchain!",
        hash: hash,
      });
    }

    // Return verification result
    return NextResponse.json({
      verified: certOnChain.isValid,
      certificate: {
        id: certificate.id, // Add certificate ID for navigation
        studentName: certificate.student.studentName,
        studentId: certificate.student.studentId,
        courseName: certificate.courseName,
        issuedAt: certOnChain.issuedAt, // onChain data
        status: certificate.status,
        issuerAddress: certOnChain.issuerAddress, // onChain data
        ipfsCid: certificate.ipfsCid,
        blockchainTx: certificate.blockchainTx,
      },
      hash: hash, // file hash
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

```

### app\api\students\route.ts

```ts
import { UserService } from "@/core/services/user.service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const userService = new UserService();
export async function GET() {
  // Xác thực người dùng với NextAuth
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized - Vui lòng đăng nhập." },
      { status: 401 }
    );
  }

  // Kiểm tra role - CHỈ ADMIN mới được tạo certificate
  const currentUser = await prisma.user.findFirst({
    where: { id: parseInt(session.user.id) },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User không tồn tại." }, { status: 404 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Chỉ Admin mới có thể GET Student list." },
      { status: 403 }
    );
  }

  const users = await userService.getAllStudents();
  return NextResponse.json(users);
}

```

### app\certificates\create\page.tsx

```tsx
'use client';

import { CertificateForm } from '@/src/components/CertificateForm';
import { Layout } from '@/src/components/Layout';
import { useCreateCertificate } from '@/src/hooks/useCertificates';
import { CreateCertificateRequest } from '@/src/types/certificate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCertificatePage() {
  const router = useRouter();
  const createMutation = useCreateCertificate();
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (data: CreateCertificateRequest) => {
    try {
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await createMutation.mutateAsync(data);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create certificate:', error);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden px-6 py-6 md:py-8 min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background decorative shapes - matching Landing/Hero design */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Soft radial gradient overlay */}
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
          
          {/* Top-left blurred circle */}
          <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
          
          {/* Bottom-right blurred circle */}
          <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
          
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10 w-full">
          {/* Page Header */}
          <div className="text-center mb-6 md:mb-8 animate-fade-in-up">
            <h1 className="flex flex-wrap text-3xl md:text-4xl font-bold mb-2 text-vietnamese items-center justify-center">
              Tạo <span className="flex flex-wrap text-gradient-primary px-2">chứng chỉ</span> mới
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Tạo và đăng ký chứng chỉ mới trên blockchain với IPFS và Base Sepolia
            </p>
          </div>

          {/* Certificate Form */}
          <div className="animate-fade-in">
            <CertificateForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
              progress={progress}
            />
          </div>

          {/* Error Display */}
          {createMutation.error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg shadow-lg-primary animate-fade-in">
              <h3 className="text-red-800 dark:text-red-400 font-semibold text-base mb-1">
                Lỗi tạo chứng chỉ
              </h3>
              <p className="text-red-600 dark:text-red-300 text-xs md:text-sm">
                {createMutation.error.message || 'Có lỗi xảy ra khi tạo chứng chỉ. Vui lòng thử lại.'}
              </p>
            </div>
          )}

          {/* Success Message */}
          {createMutation.isSuccess && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg shadow-lg-primary animate-fade-in">
              <h3 className="text-green-800 dark:text-green-400 font-semibold text-base mb-1">
                Tạo chứng chỉ thành công!
              </h3>
              <p className="text-green-600 dark:text-green-300 text-xs md:text-sm">
                Chứng chỉ đã được tạo và sẽ được chuyển hướng đến dashboard...
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

```

### app\certificates\view\[id]\page.tsx

```tsx
'use client';

import { CertificateDisplay } from '@/src/components/CertificateDisplay';
import { Layout } from '@/src/components/Layout';
import { Button } from '@/src/components/ui/button';
import { useCertificate } from '@/src/hooks/useCertificates';
import { ArrowLeft } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';

export default function CertificateViewPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: certificate, isLoading, error } = useCertificate(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải thông tin chứng chỉ...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !certificate) {
    notFound();
  }

  // Use transaction hash if available, otherwise fallback to file hash
  const verificationHash = certificate.transactionHash || certificate.fileHash;
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify?hash=${verificationHash}` 
    : '';

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        {/* Certificate Display */}
        <div className="mb-8">
          <CertificateDisplay 
            certificate={certificate}
            verificationUrl={verificationUrl}
          />
        </div>
      </div>
    </Layout>
  );
}

```

### app\certificates\[id]\page.tsx

```tsx
'use client';

import { Layout } from '@/src/components/Layout';
import { QRDisplay } from '@/src/components/QRDisplay';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificate } from '@/src/hooks/useCertificates';
import { formatDate } from '@/src/lib/utils';
import { ArrowLeft, Calendar, CheckCircle2, Copy, ExternalLink, FileText, GraduationCap, Hash, Share2, User } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CertificateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: certificate, isLoading, error } = useCertificate(id);
  
  // ✅ All hooks must be called before any conditional returns
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải thông tin chứng chỉ...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !certificate) {
    notFound();
  }

  // Use transaction hash if available, fallback to file hash
  const verificationHash = certificate.transactionHash || certificate.fileHash;
  const verificationUrl = `${window.location.origin}/verify?hash=${verificationHash}`;
  const txHash = certificate.transactionHash || certificate.blockchainTx;
  const hasTransaction = !!txHash;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header with Back Button and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push(`/certificates/view/${id}`)}
              className="gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Xem chứng chỉ
            </Button>

            {certificate.ipfsCid && (
              <Button
                variant="ghost"
                onClick={() => window.open(`https://ipfs.io/ipfs/${certificate.ipfsCid}`, '_blank')}
                className="gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                File gốc
              </Button>
            )}

            {txHash && (
              <Button
                variant="ghost"
                onClick={() => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')}
                className="gap-2 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Etherscan
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => navigator.share({ 
                title: 'Chứng chỉ CertiChain',
                text: `Chứng chỉ ${certificate.courseName} của ${certificate.student?.studentName || 'N/A'}`,
                url: verificationUrl 
              })}
              className="gap-2 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-white/60 dark:border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{certificate.courseName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Certificate Details</p>
                  </div>
                  {hasTransaction && (
                    <Badge className="bg-green-600 text-white border-0 gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      On-chain
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Student & Date Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Card */}
              <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">Thông tin sinh viên</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground mb-1">
                    {certificate.student?.studentName || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MSSV: {certificate.student?.studentId || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              {/* Date Card */}
              <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ngày xác thực</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">
                    {formatDate(certificate.issuedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {certificate.status === 'verified' ? 'Đã xác thực' : 'Chờ xác thực'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Hash Information */}
            <Card className="glass-effect border-2 border-white/60 dark:border-white/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Mã băm chứng chỉ</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Hash */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    File Hash
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono bg-background/60 p-3 rounded-lg break-all">
                      {certificate.fileHash}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(certificate.fileHash, 'fileHash')}
                      className="flex-shrink-0"
                    >
                      {copiedField === 'fileHash' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Transaction Hash */}
                {txHash && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Transaction Hash
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono bg-green-600/10 text-green-700 dark:text-green-400 p-3 rounded-lg break-all">
                        {txHash}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(txHash, 'txHash')}
                        className="flex-shrink-0"
                      >
                        {copiedField === 'txHash' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-6">
            {hasTransaction ? (
              /* QR Code - On-chain */
              <QRDisplay
                value={verificationUrl}
                title="Mã QR xác minh"
                description="Quét để xác minh on-chain"
                size={220}
              />
            ) : (
              /* Alternative UI - Pending */
              <Card className="glass-effect border-2 border-orange-500/30 bg-orange-500/5">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Hash className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Chưa đăng ký on-chain</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Chứng chỉ này chưa được đăng ký lên blockchain
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                    <p className="text-xs text-muted-foreground mb-2">File Hash</p>
                    <code className="text-xs font-mono break-all block text-orange-700 dark:text-orange-400">
                      {certificate.fileHash}
                    </code>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      Mã QR sẽ khả dụng sau khi đăng ký on-chain
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

```

### app\dashboard\page.tsx

```tsx
'use client';

import { Layout } from '@/src/components/Layout';
import { HolderDashboard } from '@/src/components/dashboard/HolderDashboard';
import { IssuerDashboard } from '@/src/components/dashboard/IssuerDashboard';
import { useAuth } from '@/src/hooks/useAuth';

export default function DashboardPage() {
  const { roleContext, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    if (!roleContext) return null;

    switch (roleContext.role) {
      case 'issuer':
        return <IssuerDashboard />;
      case 'holder':
        return <HolderDashboard />;
      default:
        return <IssuerDashboard />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {renderDashboard()}
      </div>
    </Layout>
  );
}
```

### app\ErrorBoundary.tsx

```tsx
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Đã xảy ra lỗi
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Ứng dụng gặp lỗi không mong muốn. Vui lòng tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tải lại trang
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

```

### app\favicon.ico

*(Unsupported file type)*

### app\glass-effects.css

```css
/* Glass morphism effects */

/* Base glass effect - neutral/white */
.glass-effect {
  background: oklch(1 0 0 / 0.8);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgb(206, 206, 206);
}

.dark .glass-effect {
  background: oklch(0.12 0.01 106.423 / 0.8);
  border: 1px solid rgb(51, 51, 51);
}

/* Glass effect with primary color tint */
.glass-primary {
  background: oklch(0.52 0.18 253 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.52 0.18 253 / 0.3);
}

.dark .glass-primary {
  background: oklch(0.62 0.18 253 / 0.85);
  border: 1px solid oklch(0.62 0.18 253 / 0.3);
}

/* Glass effect with blue tint */
.glass-blue {
  background: oklch(0.5 0.15 240 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.5 0.15 240 / 0.3);
}

.dark .glass-blue {
  background: oklch(0.6 0.15 240 / 0.85);
  border: 1px solid oklch(0.6 0.15 240 / 0.3);
}

/* Glass effect with purple tint */
.glass-purple {
  background: oklch(0.5 0.15 270 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.5 0.15 270 / 0.3);
}

.dark .glass-purple {
  background: oklch(0.6 0.15 270 / 0.85);
  border: 1px solid oklch(0.6 0.15 270 / 0.3);
}

/* Glass effect with cyan tint */
.glass-cyan {
  background: oklch(0.5 0.15 200 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.5 0.15 200 / 0.3);
}

.dark .glass-cyan {
  background: oklch(0.6 0.15 200 / 0.85);
  border: 1px solid oklch(0.6 0.15 200 / 0.3);
}

/* Glass effect with green tint */
.glass-green {
  background: oklch(0.5 0.15 142 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.5 0.15 142 / 0.3);
}

.dark .glass-green {
  background: oklch(0.6 0.15 142 / 0.85);
  border: 1px solid oklch(0.6 0.15 142 / 0.3);
}

/* Glass effect with orange tint */
.glass-orange {
  background: oklch(0.65 0.15 75 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.65 0.15 75 / 0.3);
}

.dark .glass-orange {
  background: oklch(0.75 0.15 75 / 0.85);
  border: 1px solid oklch(0.75 0.15 75 / 0.3);
}

/* Glass effect with pink tint */
.glass-pink {
  background: oklch(0.6 0.15 320 / 0.85);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.6 0.15 320 / 0.3);
}

.dark .glass-pink {
  background: oklch(0.7 0.15 320 / 0.85);
  border: 1px solid oklch(0.7 0.15 320 / 0.3);
}


```

### app\globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Geologica:wght@100;300;400;500;600;700;800;900&family=Quicksand:wght@300;400;500;600;700&family=Fairplay+Display:wght@400;500&display=swap');
@import "tailwindcss";
@import "tw-animate-css";
@import "./theme-colors.css";
@import "./glass-effects.css";
@import "./animations.css";
@import "./utilities.css";

@layer base {
  * {
    border-color: var(--border);
    outline-color: var(--ring);
  }
  
  *:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  
  /* Vietnamese text support - System fonts with great Vietnamese support */
  :lang(vi) {
    font-variant-east-asian: normal;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1, "pnum" 1, "tnum" 0, "onum" 1, "lnum" 0, "dlig" 1;
  }
  
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif;
    line-height: 1.6;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Geologica', sans-serif;
    line-height: 1.2;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  
  h1 {
    font-size: 2.25rem;
  }
  
  h2 {
    font-size: 1.875rem;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  /* Links */
  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  a:hover {
    color: var(--ring);
  }
  
  /* Sections */
  section {
    width: 100%;
    min-height: fit-content;
    box-sizing: border-box;
    display: block;
  }
  
  /* Container */
  .container {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
  }
  
  @media (min-width: 640px) {
    .container {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    h1 {
      font-size: 2.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    .container {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    
    h1 {
      font-size: 3rem;
    }
  }
}

```

### app\layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./ErrorBoundary";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CertiChain - Hệ thống xác thực chứng chỉ dựa trên blockchain",
  description:
    "CertiChain là hệ thống xác thực chứng chỉ dựa trên blockchain, kết hợp IPFS để lưu trữ và Base Sepolia để xác minh. Dự án gồm dashboard quản trị cho nhà trường, giao diện người dùng cho sinh viên, và trang xác minh công khai cho nhà tuyển dụng.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // Lấy session ở Server

  return (
    <html lang="vi">
      <body className={`antialiased`}>
        <ErrorBoundary>
          <Providers session={session}>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

```

### app\loading.tsx

```tsx
"use client";

import { Footer } from '@/src/components/Footer';
import { Header } from '@/src/components/Header';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return (
      <div className="h-screen w-full flex flex-col">
        <Header />
        <main className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
          {/* Background - mimic Hero decorative shapes */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
            <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          {/* Foreground content - perfectly centered */}
          <div className="text-center px-6 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient-primary mb-6">CertiChain</h2>
            <p className="text-lg md:text-xl text-muted-foreground">Đang tải nội dung, vui lòng đợi trong giây lát...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}



```

### app\login\page.tsx

```tsx
import { Login } from '@/src/components/Login';
import { Layout } from '@/src/components/Layout';

export default function LoginPage() {
  return (
    <Layout>
      <Login />
    </Layout>
  );
}


```

### app\page.tsx

```tsx
import { CTA } from '@/src/components/CTA';
import { Features } from '@/src/components/Features';
import { Hero } from '@/src/components/Hero';
import { Layout } from '@/src/components/Layout';
import { Process } from '@/src/components/Process';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <Process />
      <CTA />
    </Layout>
  );
}

```

### app\providers.tsx

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useState } from "react";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}

```

### app\theme-colors.css

```css
/* CSS Custom Properties - Theme Colors */

:root {
  /* === DIMENSION === */
  --radius: 0.625rem;
  
  /* === LIGHT MODE - PRIMARY COLORS === */
  --background: oklch(0.99 0.005 106.423);
  --foreground: oklch(0.15 0.01 106.423);
  --card: oklch(0.98 0.01 106.423);
  --card-foreground: oklch(0.15 0.01 106.423);
  --popover: oklch(0.98 0.01 106.423);
  --popover-foreground: oklch(0.15 0.01 106.423);
  
  /* === LIGHT MODE - BRAND COLOR (FACEBOOK BLUE) === */
  --primary: oklch(0.52 0.18 253);
  --primary-foreground: oklch(0.98 0.005 106.423);
  
  /* === LIGHT MODE - SECONDARY COLORS === */
  --secondary: oklch(0.95 0.01 106.423);
  --secondary-foreground: oklch(0.25 0.01 106.423);
  --accent: oklch(0.92 0.02 106.423);
  --accent-foreground: oklch(0.25 0.01 106.423);
  
  /* === LIGHT MODE - STATE COLORS === */
  --success: oklch(0.5 0.15 142);
  --success-foreground: oklch(0.98 0.005 106.423);
  --warning: oklch(0.65 0.15 75);
  --warning-foreground: oklch(0.98 0.005 106.423);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.98 0.005 106.423);
  
  /* === LIGHT MODE - UI ELEMENTS === */
  --muted: oklch(0.96 0.005 106.423);
  --muted-foreground: oklch(0.5 0.01 106.423);
  --border: oklch(0.92 0.005 106.423);
  --input: oklch(0.92 0.005 106.423);
  --ring: oklch(0.55 0.15 240);
  
  /* === LIGHT MODE - CHART COLORS === */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  /* === DARK MODE - PRIMARY COLORS === */
  --background: oklch(0.08 0.01 106.423);
  --foreground: oklch(0.95 0.005 106.423);
  --card: oklch(0.15 0.01 106.423);
  --card-foreground: oklch(0.95 0.005 106.423);
  --popover: oklch(0.15 0.01 106.423);
  --popover-foreground: oklch(0.95 0.005 106.423);
  
  /* === DARK MODE - BRAND COLOR (FACEBOOK BLUE - BRIGHTER) === */
  --primary: oklch(0.62 0.18 253);
  --primary-foreground: oklch(0.08 0.01 106.423);
  
  /* === DARK MODE - SECONDARY COLORS === */
  --secondary: oklch(0.18 0.01 106.423);
  --secondary-foreground: oklch(0.95 0.005 106.423);
  --accent: oklch(0.22 0.02 106.423);
  --accent-foreground: oklch(0.95 0.005 106.423);
  
  /* === DARK MODE - STATE COLORS === */
  --success: oklch(0.65 0.15 142);
  --success-foreground: oklch(0.08 0.01 106.423);
  --warning: oklch(0.75 0.15 75);
  --warning-foreground: oklch(0.08 0.01 106.423);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.95 0.005 106.423);
  
  /* === DARK MODE - UI ELEMENTS === */
  --muted: oklch(0.15 0.01 106.423);
  --muted-foreground: oklch(0.65 0.01 106.423);
  --border: oklch(0.2 0.01 106.423);
  --input: oklch(0.18 0.01 106.423);
  --ring: oklch(0.65 0.15 240);
  
  /* === DARK MODE - CHART COLORS === */
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}


```

### app\utilities.css

```css
/* Custom utility classes */

@layer utilities {
  /* Text & Typography */
  .text-vietnamese {
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1, "pnum" 1, "tnum" 0, "onum" 1, "lnum" 0, "dlig" 1;
  }
  
  /* Font families */
  .font-geologica {
    font-family: 'Geologica', sans-serif;
  }
  
  .font-quicksand {
    font-family: 'Quicksand', sans-serif;
  }
  
  .font-fairplay {
    font-family: 'Fairplay Display', serif;
  }
  
  /* Gradient backgrounds - Primary */
  .bg-gradient-primary {
    background: linear-gradient(135deg, oklch(0.52 0.18 253) 0%, oklch(0.48 0.19 258) 100%);
  }
  
  .dark .bg-gradient-primary {
    background: linear-gradient(135deg, oklch(0.62 0.18 253) 0%, oklch(0.58 0.19 258) 100%);
  }
  
  /* Text gradient - Smooth transition */
  .text-gradient-primary {
    background: linear-gradient(90deg, oklch(0.52 0.18 253) 0%, oklch(0.48 0.19 258) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: block;
  }
  
  .dark .text-gradient-primary {
    background: linear-gradient(90deg, oklch(0.62 0.18 253) 0%, oklch(0.58 0.19 258) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* Gradient backgrounds - Secondary */
  .bg-gradient-secondary {
    background: linear-gradient(135deg, oklch(0.95 0.01 106.423) 0%, oklch(0.92 0.02 106.423) 100%);
  }
  
  .dark .bg-gradient-secondary {
    background: linear-gradient(135deg, oklch(0.18 0.01 106.423) 0%, oklch(0.22 0.02 106.423) 100%);
  }
  
  /* Gradient backgrounds - Success */
  .bg-gradient-success {
    background: linear-gradient(135deg, oklch(0.5 0.15 142) 0%, oklch(0.4 0.15 142) 100%);
  }
  
  .dark .bg-gradient-success {
    background: linear-gradient(135deg, oklch(0.65 0.15 142) 0%, oklch(0.55 0.15 142) 100%);
  }
  
  /* Enhanced shadows */
  .shadow-primary {
    box-shadow: 0 4px 14px 0 oklch(0.52 0.18 253 / 0.15);
  }
  
  .dark .shadow-primary {
    box-shadow: 0 4px 14px 0 oklch(0.62 0.18 253 / 0.2);
  }
  
  .shadow-card {
    box-shadow: 0 2px 8px 0 oklch(0.15 0.01 106.423 / 0.08);
  }
  
  .dark .shadow-card {
    box-shadow: 0 2px 8px 0 oklch(0 0 0 / 0.3);
  }
  
  .shadow-lg-primary {
    box-shadow: 0 10px 30px -5px oklch(0.52 0.18 253 / 0.2);
  }
  
  .dark .shadow-lg-primary {
    box-shadow: 0 10px 30px -5px oklch(0.62 0.18 253 / 0.25);
  }
  
  /* Backdrop blur effects */
  .backdrop-blur-sm {
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  
  .backdrop-blur-md {
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }
  
  .backdrop-blur-lg {
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }
  
  /* Enhanced dropdown styles */
  .dropdown-content {
    background: oklch(0.99 0.005 106.423 / 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid oklch(0.92 0.005 106.423 / 0.3);
    box-shadow: 0 10px 25px -5px oklch(0.15 0.01 106.423 / 0.1), 0 4px 6px -2px oklch(0.15 0.01 106.423 / 0.05);
  }

  .dark .dropdown-content {
    background: oklch(0.08 0.01 106.423 / 0.95);
    border: 1px solid oklch(0.2 0.01 106.423 / 0.3);
    box-shadow: 0 10px 25px -5px oklch(0 0 0 / 0.3), 0 4px 6px -2px oklch(0 0 0 / 0.1);
  }

  .dropdown-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dropdown-item:hover {
    background-color: oklch(0.52 0.18 253 / 0.1);
    color: oklch(0.52 0.18 253);
  }

  .dark .dropdown-item:hover {
    background-color: oklch(0.62 0.18 253 / 0.1);
    color: oklch(0.62 0.18 253);
  }
  
  /* Badge variants */
  .badge-primary {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
  
  .badge-success {
    background-color: var(--success);
    color: var(--success-foreground);
  }
  
  .badge-warning {
    background-color: var(--warning);
    color: var(--warning-foreground);
  }
  
  .badge-info {
    background-color: var(--info);
    color: var(--info-foreground);
  }
  
  /* Button hover effects */
  .btn-hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .btn-hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px 0 oklch(0.52 0.18 253 / 0.15);
  }
  
  /* Card hover effects */
  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px -5px oklch(0.52 0.18 253 / 0.2);
  }
  
  .dark .card-hover:hover {
    box-shadow: 0 10px 30px -5px oklch(0.62 0.18 253 / 0.25);
  }
  
  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-in-out;
  }
  
  .animate-fade-in-down {
    animation: fadeInDown 0.5s ease-in-out;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-in-out;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-in-out;
  }
  
  .animate-bounce-in {
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  /* Responsive text sizing */
  .text-responsive-h1 {
    font-size: clamp(1.75rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.2;
  }
  
  .text-responsive-h2 {
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 600;
    line-height: 1.3;
  }
  
  .text-responsive-h3 {
    font-size: clamp(1.25rem, 3vw, 1.875rem);
    font-weight: 600;
    line-height: 1.4;
  }
  
  /* Utility classes for common patterns */
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .grid-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .grid-auto-sm {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .grid-auto-lg {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--background);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
  }
  
  /* Line clamp utilities */
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  /* Navbar specific styles */
  .navbar-link {
    position: relative;
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: oklch(0.4 0.01 106.423);
  }

  .dark .navbar-link {
    color: oklch(0.8 0.005 106.423);
  }

  .navbar-link:hover {
    color: var(--primary);
    transform: translateY(-1px);
  }

  .navbar-link.active {
    color: var(--primary);
    font-weight: 700;
  }

  .navbar-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary) 0%, oklch(0.48 0.19 258) 100%);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }

  .navbar-link:hover::after,
  .navbar-link.active::after {
    width: 100%;
  }

  /* Compact navbar for medium screens */
  .navbar-link-compact {
    position: relative;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: oklch(0.4 0.01 106.423);
  }

  .dark .navbar-link-compact {
    color: oklch(0.8 0.005 106.423);
  }

  .navbar-link-compact:hover {
    color: var(--primary);
    background-color: var(--primary)/10;
    transform: translateY(-1px);
  }

  .navbar-link-compact.active {
    color: var(--primary);
    background-color: var(--primary)/10;
  }

  /* Hover text tooltip */
  .navbar-text-hover {
    z-index: 50;
  }

  .dark .navbar-text-hover {
    background-color: oklch(0.15 0.01 106.423);
    border-color: oklch(0.25 0.01 106.423);
  }

  /* UserMenu dropdown trigger indicator */
  .usermenu-trigger {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .usermenu-trigger:hover {
    color: var(--primary) !important;
    transform: translateY(-1px) !important;
    background-color: transparent !important;
    scale: 1 !important;
  }
  
  .usermenu-trigger::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary) 0%, oklch(0.48 0.19 258) 100%);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
  }
  
  .usermenu-trigger:hover::after {
    width: 100%;
  }
  
  .usermenu-trigger[data-state="open"] {
    color: var(--primary) !important;
  }
  .usermenu-trigger[data-state="open"]::after {
    width: 100%;
  }

  /* Enhanced navbar background */
  .navbar-background {
    background: oklch(0.99 0.005 106.423 / 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid oklch(0.92 0.005 106.423 / 0.5);
  }

  .dark .navbar-background {
    background: oklch(0.08 0.01 106.423 / 0.95);
    border-bottom: 1px solid oklch(0.2 0.01 106.423 / 0.5);
  }
}


```

### app\verify\page.tsx

```tsx
'use client';

import { Layout } from '@/src/components/Layout';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { VerifyResult } from '@/src/components/VerifyResult';
import { useVerifyCertificate } from '@/src/hooks/useVerify';
import { Hash, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  
  // Parse hash from URL and determine its type
  const hashFromUrl = searchParams.get('hash') || '';
  const initialHashData = useMemo(() => {
    if (!hashFromUrl) return { hash: '', searchHash: '', hashType: 'auto' as const };
    
    const trimmed = hashFromUrl.trim();
    if (trimmed.startsWith('0x') && trimmed.length === 66) {
      return { hash: trimmed, searchHash: trimmed, hashType: 'tx' as const };
    } else if (trimmed.length === 64) {
      return { hash: trimmed, searchHash: trimmed, hashType: 'file' as const };
    }
    return { hash: trimmed, searchHash: '', hashType: 'auto' as const };
  }, [hashFromUrl]);
  
  const [hash, setHash] = useState(initialHashData.hash);
  const [searchHash, setSearchHash] = useState(initialHashData.searchHash);
  const [hashType, setHashType] = useState<'auto' | 'file' | 'tx'>(initialHashData.hashType);
  const resultRef = useRef<HTMLDivElement | null>(null);
  
  const { data: verifyResult, isLoading, error } = useVerifyCertificate(searchHash);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = hash.trim();
    if (trimmed) {
      // Detect hash type automatically
      // Transaction hash: 0x + 64 hex chars (66 total)
      // File hash: 64 hex chars (with or without 0x)
      if (trimmed.startsWith('0x') && trimmed.length === 66) {
        setHashType('tx');
        setSearchHash(trimmed); // Keep 0x for tx hash
      } else if (trimmed.length === 64) {
        setHashType('file');
        setSearchHash(trimmed);
      } else if (trimmed.startsWith('0x') && trimmed.length === 66) {
        // Could be file hash with 0x prefix
        setHashType('file');
        setSearchHash(trimmed.slice(2));
      } else {
        alert('Invalid hash format. Please enter a valid file hash (64 chars) or transaction hash (0x + 64 chars)');
        return;
      }
    }
  };


  // Smooth scroll to result section whenever a new search is triggered
  useEffect(() => {
    if (searchHash && resultRef.current) {
      const el = resultRef.current;
      const headerOffset = 64; // approx h-16 sticky header
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [searchHash]);

  return (
    <Layout>
      <section className="relative overflow-hidden px-6 bg-background min-h-screen flex items-start md:items-center py-16">
        {/* Decorative background shapes (same style direction as Hero) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="container mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gradient-primary">
              Xác minh chứng chỉ
            </h1>
            {/* Verified circular badge */}
            <span className="inline-flex items-center justify-center self-center translate-y-[2px]">
              <svg width="46" height="46" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
                <defs>
                  <linearGradient id="badgeBlue" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="var(--primary)"/>
                    <stop offset="100%" stop-color="oklch(0.48 0.19 258)"/>
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="20" fill="url(#badgeBlue)" />
                <path d="M15.5 22.5l4.5 4.5L28.5 18.5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500" />
          <p className="mt-4 text-base md:text-lg">
            Nhập transaction hash hoặc file hash để xác minh chứng chỉ
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleVerify} className="space-y-4 bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 rounded-2xl p-6 shadow-lg">
            {/* Search bar */}
            <div className="relative">
              <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-md shadow-sm px-3 py-1">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nhập transaction hash (0x...) hoặc file hash"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus:outline-none h-12 px-2"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? 'Đang xác minh...' : 'Tìm' }
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                💡 Transaction hash: 0x... (66 ký tự) | File hash: 64 ký tự hex
              </p>
              {hashType !== 'auto' && (
                <p className="mt-1 text-xs text-blue-600 text-center">
                  🔍 Đang tìm kiếm theo: {hashType === 'tx' ? 'Transaction Hash' : 'File Hash'}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Verification Result Section (full viewport height) */}
        {searchHash && (
          <section ref={resultRef} id="verify-result" className="w-full min-h-screen flex items-start md:items-center scroll-mt-20 py-12">
            <div className="w-full">
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang xác minh chứng chỉ...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12 max-w-2xl mx-auto">
                <div className="text-red-600 mb-4">
                  <p className="text-lg font-semibold">Lỗi xác minh</p>
                  <p className="text-sm">Không thể xác minh chứng chỉ. Vui lòng kiểm tra lại hash.</p>
                </div>
                <Button onClick={() => setSearchHash('')} variant="outline" className="transition-transform hover:scale-105 active:scale-95">
                  Thử lại
                </Button>
              </div>
            )}

            {verifyResult && !isLoading && !error && (
              <div className="max-w-6xl mx-auto">
                <VerifyResult data={verifyResult} hash={searchHash} />
              </div>
            )}
            </div>
          </section>
        )}

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>Transaction Hash</strong>: Dùng mã giao dịch (0x...) sau khi đăng ký on-chain</p>
            <p>2. <strong>File Hash</strong>: Dùng mã hash của file PDF chứng chỉ</p>
            <p>3. Dán hash vào ô tìm kiếm và nhấn Tìm</p>
            <p>4. Kết quả sẽ hiển thị thông tin chi tiết và trạng thái xác thực</p>
          </div>
        </div>
        </div>
      </section>
    </Layout>
  );
}

```

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}

```

### contracts\.gitignore

```gitignore
# Node modules
/node_modules

# Compilation output
/dist

# pnpm deploy output
/bundle

# Hardhat Build Artifacts
/artifacts

# Hardhat compilation (v2) support directory
/cache

# Typechain output
/types

# Hardhat coverage reports
/coverage

# Hardhat deployment files
/ignition/deployments

```

### contracts\contracts\CertiChain.sol

*(Unsupported file type)*

### contracts\hardhat.config.ts

```ts
import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";

import dotenv from "dotenv";
dotenv.config();

// Kiểm tra biến môi trường và ném lỗi nếu chúng không được đặt
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

if (!SEPOLIA_RPC_URL) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!SEPOLIA_PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY in .env");

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  chainDescriptors: {
    11155111: {
      name: "sepolia",
      blockExplorers: {
        etherscan: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
          apiUrl: "https://api.etherscan.io/v2/api",
        },
      },
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
};

export default config;

```

### contracts\ignition\modules\CertiChain.ts

```ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertiChainSCModule", (m) => {
  const certiChain = m.contract("CertiChain");

  return { certiChain };
});

```

### contracts\package.json

```json
{
  "name": "contracts",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "@nomicfoundation/hardhat-ignition": "^3.0.3",
    "@nomicfoundation/hardhat-toolbox-viem": "^5.0.0",
    "@types/node": "^22.18.13",
    "forge-std": "github:foundry-rs/forge-std#v1.9.4",
    "hardhat": "^3.0.9",
    "typescript": "~5.8.0",
    "viem": "^2.38.5"
  },
  "dependencies": {
    "dotenv": "^17.2.3"
  }
}

```

### contracts\README.md

```md
npx hardhat build

contracts\artifacts\contracts\Counter.sol\Counter.json

npx hardhat ignition deploy --network sepolia  ignition/modules/Counter.ts

\CertiChain\contracts\server>npx tsx index.ts


npx hardhat verify --network sepolia 0x5c4D0616C5Ae8AC949741C5De86E996fa4D63c25

xóa thư mục deployments trước khi deploy lại
```

### contracts\scripts\send-op-tx.ts

```ts
import { network } from "hardhat";

const { viem } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

console.log("Sending transaction using the OP chain type");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Sending 1 wei from", senderClient.account.address, "to itself");

const l1Gas = await publicClient.estimateL1Gas({
  account: senderClient.account.address,
  to: senderClient.account.address,
  value: 1n,
});

console.log("Estimated L1 gas:", l1Gas);

console.log("Sending L2 transaction");
const tx = await senderClient.sendTransaction({
  to: senderClient.account.address,
  value: 1n,
});

await publicClient.waitForTransactionReceipt({ hash: tx });

console.log("Transaction sent successfully");

```

### contracts\server\addCertificate.ts

```ts
//====================
// npx tsx server/addCertificate.ts
// Đăng ký tất cả mock certificates lên blockchain
//====================

import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
let PK = process.env.PRIVATE_KEY;
const CONTRACT = "0xF82d44De7D594f8d47c38a2c7208Fac85554C0d8";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// Đảm bảo private key có prefix 0x
if (!PK.startsWith("0x")) {
  PK = `0x${PK}`;
}

// ABI for CertiChain contract
const ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "_fileHash", type: "bytes32" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "certificates",
    outputs: [
      { internalType: "bytes32", name: "studentIdHash", type: "bytes32" },
      { internalType: "address", name: "issuer", type: "address" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "bool", name: "isValid", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isAuthorizedIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "fileHash", type: "bytes32" },
      { indexed: true, internalType: "address", name: "issuer", type: "address" },
      { indexed: false, internalType: "bytes32", name: "studentidHash", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "issuedAt", type: "uint256" },
    ],
    name: "CertificateRegistered",
    type: "event",
  },
] as const;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC),
});

const account = privateKeyToAccount(PK as `0x${string}`);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC),
  account,
});

// Mock data từ seed.ts - Chỉ cần 2 trường: fileHash và studentIdHash
const MOCK_CERTIFICATES = [
  {
    fileHash: "2efb9c8e48e3ae48c92778cf08fcea01ba8091cfdbacd2609d97747db3b34001",
    studentIdHash: "2ab654b93d08a274e519d869fd164c93f0f8138599b197d25017fc4b5958db59",
  },
  {
    fileHash: "24d3300b4cb276e7110527d6d5e7f3856c5b2f049c9ccc5a9d3080d9b610b11b",
    studentIdHash: "eb6afd674b0616f0f157e35e6bb1803851fc1f35fd9cd09a75b48354d20fc006",
  },
  {
    fileHash: "cbddcf032651fc6983fb61ccbceb226e1e436dd41f697e9692f17377eb8d6e78",
    studentIdHash: "f78435b92de21febe98363e42450e3c48160ab9f3a7146e6ca1c48e231cd2176",
  },
  {
    fileHash: "fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b",
    studentIdHash: "e7eafed3add7ae685ae04713ff89c478154376f4a5bcdc41de76bff21c3bd330",
  },
  {
    fileHash: "d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321",
    studentIdHash: "8f8e0df7774fb61d4262e042a32a40ec2654dd39eb78eb9ef49cf6b27ed14882",
  },
  {
    fileHash: "33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a",
    studentIdHash: "4ae408c677ee1cca73e698acb95e77cb59aa2cdef732a74d63dc2350a7b4c817",
  },
  {
    fileHash: "f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a",
    studentIdHash: "43d42268c0a21fef6b08ae2f1f3752245fec0ae6588856c2a99dade001786605",
  },
  {
    fileHash: "146687b95c77271ad1e4922a3999bf857ba69b87a5ca5c37eb723dbda0350c04",
    studentIdHash: "2a797aae79685d9f7fe5229ef4e43765ee8d7485bd7d06297904c7042ab84ec7",
  },
];

async function registerCertificate(
  fileHash: string,
  studentIdHash: string,
  index: number
) {
  // Thêm 0x prefix nếu chưa có
  const formattedFileHash = fileHash.startsWith("0x") ? fileHash : `0x${fileHash}`;
  const formattedStudentIdHash = studentIdHash.startsWith("0x")
    ? studentIdHash
    : `0x${studentIdHash}`;

  console.log(`\n📜 Certificate #${index + 1}`);
  console.log(`   File hash: ${formattedFileHash.slice(0, 10)}...`);
  console.log(`   Student ID hash: ${formattedStudentIdHash.slice(0, 10)}...`);

  // Kiểm tra đã tồn tại chưa
  try {
    const existing = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "certificates",
      args: [formattedFileHash as `0x${string}`],
    });

    if (Number(existing[2]) !== 0) {
      console.log(`   ⚠️  Đã tồn tại (issued at ${new Date(Number(existing[2]) * 1000).toLocaleString()})`);
      return { success: false, reason: "already_exists", txHash: null };
    }
  } catch {
    // Certificate chưa tồn tại, tiếp tục
  }

  // Đăng ký lên blockchain
  try {
    const txHash = await walletClient.writeContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "registerCertificate",
      args: [formattedFileHash as `0x${string}`, formattedStudentIdHash as `0x${string}`],
    });

    console.log(`   ⏳ Tx hash: ${txHash}`);

    // Chờ confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (receipt.status === "success") {
      console.log(`   ✅ Success (block ${receipt.blockNumber}, gas: ${receipt.gasUsed})`);
      return { success: true, txHash, blockNumber: receipt.blockNumber };
    } else {
      console.log(`   ❌ Failed`);
      return { success: false, reason: "tx_failed", txHash };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
    return { success: false, reason: "error", txHash: null };
  }
}

async function main() {
  console.log("=== Register Mock Certificates to Blockchain ===");
  console.log(`Issuer: ${account.address}`);
  console.log(`Contract: ${CONTRACT}`);
  console.log(`Total certificates: ${MOCK_CERTIFICATES.length}`);

  // Kiểm tra issuer có authorized không
  console.log("\n[1] Kiểm tra quyền issuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [account.address],
  });

  if (!isAuthorized) {
    throw new Error(
      "❌ Account này chưa được authorize làm issuer! Chạy: npx tsx server/addIssuer.ts authorize <address>"
    );
  }
  console.log("✅ Account là issuer hợp lệ");

  // Đăng ký từng certificate
  console.log("\n[2] Bắt đầu đăng ký certificates...");
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    txHashes: [] as string[],
  };

  for (let i = 0; i < MOCK_CERTIFICATES.length; i++) {
    const cert = MOCK_CERTIFICATES[i];
    console.log(`\n--- Certificate ${i + 1}/${MOCK_CERTIFICATES.length} ---`);

    const result = await registerCertificate(
      cert.fileHash,
      cert.studentIdHash,
      i
    );

    if (result.success) {
      results.success++;
      if (result.txHash) results.txHashes.push(result.txHash);
    } else if (result.reason === "already_exists") {
      results.skipped++;
    } else {
      results.failed++;
    }

    // Delay để tránh rate limit
    if (i < MOCK_CERTIFICATES.length - 1) {
      console.log("   ⏸️  Đợi 2 giây...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Tổng kết
  console.log("\n=== Tổng kết ===");
  console.log(`✅ Thành công: ${results.success}`);
  console.log(`⚠️  Đã tồn tại (bỏ qua): ${results.skipped}`);
  console.log(`❌ Thất bại: ${results.failed}`);
  console.log(`📝 Tổng cộng: ${MOCK_CERTIFICATES.length}`);

  if (results.txHashes.length > 0) {
    console.log("\n📋 Transaction hashes:");
    results.txHashes.forEach((hash, idx) => {
      console.log(`   ${idx + 1}. ${hash}`);
      console.log(`      https://sepolia.etherscan.io/tx/${hash}`);
    });
  }

  console.log("\n✨ Hoàn tất!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

```

### contracts\server\addIssuer.ts

```ts
//====================
// npx tsx server/addIssuer.ts
//npx tsx server/addIssuer.ts authorize 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
// npx tsx server/addIssuer.ts revoke 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
// npx tsx server/addIssuer.ts check 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
//====================

import "dotenv/config";
import { createPublicClient, createWalletClient, getAddress, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
let PK = process.env.PRIVATE_KEY;
const CONTRACT = "0xF82d44De7D594f8d47c38a2c7208Fac85554C0d8";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// Đảm bảo private key có prefix 0x
if (!PK.startsWith("0x")) {
  PK = `0x${PK}`;
}

// ABI cho CertiChain contract (chỉ cần functions liên quan đến issuer)
const ABI = [
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "authorizeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "revokeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isAuthorizedIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "issuerAddress", type: "address" },
    ],
    name: "IssuerAuthorized",
    type: "event",
  },
] as const;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC),
});

const account = privateKeyToAccount(PK as `0x${string}`);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC),
  account,
});

async function authorizeIssuer(issuerAddress: string) {
  console.log("=== Authorize Issuer ===");
  console.log("Contract Owner (your wallet):", account.address);
  
  // Chuẩn hóa địa chỉ issuer
  const normalizedAddress = getAddress(issuerAddress);
  console.log("Issuer address to authorize:", normalizedAddress);

  // 1. Kiểm tra bạn có phải owner không
  console.log("\n[1] Kiểm tra quyền owner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  console.log("Contract owner:", owner);
  
  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error("❌ Bạn không phải contract owner! Chỉ owner mới có thể thêm issuer.");
  }
  console.log("✅ Bạn là owner, có thể thêm issuer");

  // 2. Kiểm tra issuer đã được authorize chưa
  console.log("\n[2] Kiểm tra trạng thái hiện tại của issuer...");
  const isCurrentlyAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  
  if (isCurrentlyAuthorized) {
    console.log("⚠️  Issuer này đã được authorize rồi!");
    return;
  }
  console.log("Issuer chưa được authorize, đang thêm...");

  // 3. Authorize issuer
  console.log("\n[3] Gửi transaction authorize issuer...");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "authorizeIssuer",
    args: [normalizedAddress],
  });
  console.log("Tx hash:", txHash);

  // 4. Chờ transaction được mine
  console.log("\n[4] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Block number:", receipt.blockNumber);
  console.log("Status:", receipt.status === "success" ? "✅ Success" : "❌ Failed");
  console.log("Gas used:", receipt.gasUsed.toString());

  // 5. Parse event
  if (receipt.logs && receipt.logs.length > 0) {
    console.log("\n[5] Event logs:");
    receipt.logs.forEach((log, idx) => {
      console.log(`Log ${idx}:`, {
        address: log.address,
        topics: log.topics,
      });
    });
  }

  // 6. Verify lại
  console.log("\n[6] Verify issuer đã được authorize...");
  const isNowAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  console.log("Is now authorized?", isNowAuthorized ? "✅ Yes" : "❌ No");

  console.log("\n=== Hoàn tất ===");
  console.log(`Issuer ${normalizedAddress} đã được thêm vào hệ thống!`);
}

async function revokeIssuer(issuerAddress: string) {
  console.log("=== Revoke Issuer ===");
  console.log("Contract Owner (your wallet):", account.address);
  
  const normalizedAddress = getAddress(issuerAddress);
  console.log("Issuer address to revoke:", normalizedAddress);

  // 1. Kiểm tra owner
  console.log("\n[1] Kiểm tra quyền owner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  
  if (owner.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error("❌ Bạn không phải contract owner!");
  }
  console.log("✅ Bạn là owner");

  // 2. Kiểm tra issuer có authorized không
  console.log("\n[2] Kiểm tra trạng thái issuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  
  if (!isAuthorized) {
    console.log("⚠️  Issuer này chưa được authorize!");
    return;
  }

  // 3. Revoke issuer
  console.log("\n[3] Gửi transaction revoke issuer...");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "revokeIssuer",
    args: [normalizedAddress],
  });
  console.log("Tx hash:", txHash);

  // 4. Chờ transaction
  console.log("\n[4] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Status:", receipt.status === "success" ? "✅ Success" : "❌ Failed");

  // 5. Verify
  console.log("\n[5] Verify issuer đã bị revoke...");
  const isStillAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });
  console.log("Is still authorized?", isStillAuthorized ? "⚠️  Yes" : "✅ No (revoked)");

  console.log("\n=== Hoàn tất ===");
}

async function checkIssuer(issuerAddress: string) {
  const normalizedAddress = getAddress(issuerAddress);
  console.log("=== Check Issuer Status ===");
  console.log("Issuer address:", normalizedAddress);

  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [normalizedAddress],
  });

  console.log("\nStatus:", isAuthorized ? "✅ Authorized" : "❌ Not authorized");
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const address = args[1];

  if (!command) {
    console.log(`
Usage:
  npx tsx server/addIssuer.ts authorize <address>  - Thêm issuer mới
  npx tsx server/addIssuer.ts revoke <address>     - Thu hồi quyền issuer
  npx tsx server/addIssuer.ts check <address>      - Kiểm tra trạng thái issuer

Examples:
  npx tsx server/addIssuer.ts authorize 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
  npx tsx server/addIssuer.ts check 0x742d35Cc6634C0532925a3b844Bc9e7595f0beb0
    `);
    process.exit(0);
  }

  if (!address && command !== "help") {
    console.error("❌ Thiếu địa chỉ issuer!");
    process.exit(1);
  }

  switch (command) {
    case "authorize":
    case "add":
      await authorizeIssuer(address);
      break;
    case "revoke":
    case "remove":
      await revokeIssuer(address);
      break;
    case "check":
    case "status":
      await checkIssuer(address);
      break;
    default:
      console.error("❌ Command không hợp lệ:", command);
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

```

### contracts\server\index.ts

```ts
//====================
// npx tsx index.ts
//====================

import crypto from "crypto";
import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const RPC = process.env.SEPOLIA_RPC_URL;
let PK = process.env.PRIVATE_KEY;
const CONTRACT = "0xF82d44De7D594f8d47c38a2c7208Fac85554C0d8";

if (!RPC) throw new Error("Missing SEPOLIA_RPC_URL in .env");
if (!PK) throw new Error("Missing PRIVATE_KEY in .env");
if (!CONTRACT) throw new Error("Missing CONTRACT_ADDRESS in .env");

// Đảm bảo private key có prefix 0x
if (!PK.startsWith("0x")) {
  PK = `0x${PK}`;
}

// ABI for CertiChain contract (updated to match CertiChain.sol)
const ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "_fileHash", type: "bytes32" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
    ],
    name: "registerCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_fileHash", type: "bytes32" }],
    name: "verifyCertificate",
    outputs: [
      { internalType: "address", name: "_issuer", type: "address" },
      { internalType: "uint256", name: "_isssedAt", type: "uint256" },
      { internalType: "bytes32", name: "_studentIdHash", type: "bytes32" },
      { internalType: "bool", name: "_isValid", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "authorizeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_issuerAddress", type: "address" }],
    name: "revokeIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isAuthorizedIssuer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "certificates",
    outputs: [
      { internalType: "bytes32", name: "studentIdHash", type: "bytes32" },
      { internalType: "address", name: "issuer", type: "address" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "bool", name: "isValid", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "fileHash", type: "bytes32" },
      { indexed: true, internalType: "address", name: "issuer", type: "address" },
      { indexed: false, internalType: "bytes32", name: "studentidHash", type: "bytes32" },
      { indexed: false, internalType: "uint256", name: "issuedAt", type: "uint256" },
    ],
    name: "CertificateRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "issuerAddress", type: "address" },
    ],
    name: "IssuerAuthorized",
    type: "event",
  },
] as const;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC),
});

const account = privateKeyToAccount(PK as `0x${string}`);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC),
  account,
});

// Helper: tạo bytes32 hash từ string
function sha256ToBytes32(input: string): `0x${string}` {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return `0x${hash}` as `0x${string}`;
}

// Mock data
const MOCK_FILE_CONTENT = "Chung chi tot nghiep - Nguyen Van A - Blockchain Fundamentals - 2025";
const MOCK_STUDENT_ID = "SV123456";
const MOCK_IPFS_CID = "QmXyz123MockCIDForDemoPurpose";

async function main() {
  console.log("=== CertiChain Demo - Test ABI ===");
  console.log("Địa chỉ ví issuer:", account.address);
  
  // 1. Đọc owner của contract
  console.log("\n[1] Đọc contractOwner...");
  const owner = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "contractOwner",
  });
  console.log("Owner:", owner);

  // 2. Kiểm tra account hiện tại có phải authorized issuer không
  console.log("\n[2] Kiểm tra isAuthorizedIssuer...");
  const isAuthorized = await publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "isAuthorizedIssuer",
    args: [account.address],
  });
  console.log("Account này là issuer hợp lệ?", isAuthorized);

  // 3. Tạo mock hash từ mock data
  console.log("\n[3] Tạo mock hash...");
  const fileHash = sha256ToBytes32(MOCK_FILE_CONTENT);
  const studentIdHash = sha256ToBytes32(MOCK_STUDENT_ID);
  console.log("File hash (mock):", fileHash);
  console.log("Student ID hash (mock):", studentIdHash);
  console.log("IPFS CID (mock):", MOCK_IPFS_CID);

  // 4. Đăng ký chứng chỉ (registerCertificate)
  console.log("\n[4] Đăng ký chứng chỉ lên blockchain...");
  console.log("Note: IPFS CID không lưu trên blockchain, chỉ lưu trong database");
  const txHash = await walletClient.writeContract({
    address: CONTRACT as `0x${string}`,
    abi: ABI,
    functionName: "registerCertificate",
    args: [fileHash, studentIdHash],
  });
  console.log("Tx hash:", txHash);

  // 5. Chờ transaction được mine
  console.log("\n[5] Chờ transaction được mine...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("Block number:", receipt.blockNumber);
  console.log("Status:", receipt.status);
  console.log("Gas used:", receipt.gasUsed.toString());

  // 6. Parse event CertificateRegistered từ logs
  console.log("\n[6] Parse event từ transaction logs...");
  if (receipt.logs && receipt.logs.length > 0) {
    console.log("Số lượng logs:", receipt.logs.length);
    receipt.logs.forEach((log, idx) => {
      console.log(`Log ${idx}:`, {
        address: log.address,
        topics: log.topics,
      });
    });
  }

  // 7. Xác minh chứng chỉ (verifyCertificate)
  console.log("\n[7] Xác minh chứng chỉ vừa đăng ký...");
  try {
    const cert = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "verifyCertificate",
      args: [fileHash],
    });
    
    console.log("\n=== Thông tin chứng chỉ (từ blockchain) ===");
    console.log("Issuer:", cert[0]);
    console.log("Issued At:", new Date(Number(cert[1]) * 1000).toLocaleString());
    console.log("Student ID Hash:", cert[2]);
    console.log("Is Valid:", cert[3]);
    console.log("\n✅ Chứng chỉ hợp lệ!");
    console.log(`Note: IPFS CID (${MOCK_IPFS_CID}) được lưu trong database, không trên blockchain`);
  } catch (e) {
    console.error("❌ Lỗi khi xác minh:", e instanceof Error ? e.message : String(e));
  }

  // 8. Mock verify với hash không tồn tại
  console.log("\n[8] Test verify với hash không tồn tại...");
  const fakeHash = sha256ToBytes32("fake_certificate_content");
  try {
    await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: ABI,
      functionName: "verifyCertificate",
      args: [fakeHash],
    });
    console.log("Không nên đến đây!");
  } catch (e) {
    console.log("✅ Đúng rồi - contract revert với hash không tồn tại");
    const msg = e instanceof Error ? e.message : String(e);
    console.log("Error message:", msg.split('\n')[0]);
  }

  console.log("\n=== Demo hoàn tất ===");
}

main().catch((e) => { console.error(e); process.exit(1); });


```

### contracts\Smart Contract.md

```md
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CertificateVerifier
 * @dev Hợp đồng thông minh để đăng ký và xác minh chứng chỉ giáo dục sử dụng Blockchain và IPFS.
 * Được thiết kế để chạy trên mạng EVM (như Base Sepolia).
 */
contract CertificateVerifier {
    // Cấu trúc dữ liệu để lưu trữ thông tin chứng chỉ
    struct Certificate {
        bytes32 ipfsCID;         // Content Identifier của file chứng chỉ trên IPFS (dạng bytes32) //==đổi thành string để lưu CID dài hơn
        bytes32 studentIdHash;   // Mã sinh viên đã được băm (hash)
        address issuer;          // Địa chỉ ví của nhà trường (Issuer)
        uint256 issuedAt;        // Dấu thời gian (timestamp) của block khi chứng chỉ được phát hành
        bool isValid;            // Đảm bảo struct được khởi tạo
    }

    // Ánh xạ (Mapping) để lưu trữ thông tin chi tiết của chứng chỉ
    // Key: SHA-256 Hash của file chứng chỉ (fileHash)
    // Value: Struct Certificate chứa dữ liệu đã lưu trữ
    mapping(bytes32 => Certificate) public certificates;

    // Ánh xạ để theo dõi các Nhà trường (Issuer) hợp lệ
    // Key: Địa chỉ ví của trường
    // Value: true nếu là Issuer hợp lệ
    mapping(address => bool) public isAuthorizedIssuer;

    // Địa chỉ người triển khai hợp đồng (Contract Owner)
    address public contractOwner;

    // --- Events (Sự kiện) ---
    // Sự kiện được phát ra khi chứng chỉ mới được đăng ký
    event CertificateRegistered(
        bytes32 indexed fileHash,
        address indexed issuer,
        bytes32 ipfsCID,
        bytes32 studentIdHash,
        uint256 issuedAt
    );

    // Sự kiện được phát ra khi một Issuer mới được cấp phép
    event IssuerAuthorized(address indexed issuerAddress);

    // --- Modifiers (Bộ điều chỉnh) ---
    // Yêu cầu người gọi là Chủ sở hữu hợp đồng //==xài Ownable của OpenZeppelin sẽ hay hơn
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only the contract owner can call this function.");
        _;
    }

    // Yêu cầu người gọi là Issuer hợp lệ
    modifier onlyAuthorizedIssuer() {
        require(isAuthorizedIssuer[msg.sender], "Only an authorized issuer can issue certificates.");
        _;
    }

    // --- Constructor (Hàm khởi tạo) ---
    constructor() {
        contractOwner = msg.sender;
        // Tự động thêm người triển khai hợp đồng làm Issuer đầu tiên
        isAuthorizedIssuer[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    // --- Chức năng Quản lý Issuer ---

    /**
     * @dev Thêm một địa chỉ mới vào danh sách Issuer hợp lệ. Chỉ Owner có thể gọi.
     * @param _issuerAddress Địa chỉ ví của nhà trường cần cấp phép.
     */
    function authorizeIssuer(address _issuerAddress) public onlyOwner {
        require(_issuerAddress != address(0), "Invalid address.");
        isAuthorizedIssuer[_issuerAddress] = true;
        emit IssuerAuthorized(_issuerAddress);
    }

    /**
     * @dev Thu hồi quyền Issuer của một địa chỉ. Chỉ Owner có thể gọi.
     * @param _issuerAddress Địa chỉ ví của nhà trường cần thu hồi quyền.
     */
    function revokeIssuer(address _issuerAddress) public onlyOwner {
        require(_issuerAddress != address(0), "Invalid address.");
        isAuthorizedIssuer[_issuerAddress] = false;
    }

    // --- Chức năng Phát hành Chứng chỉ (Bước 1) ---

    /**
     * @dev Nhà trường gọi hàm này để đăng ký một chứng chỉ mới lên blockchain.
     * @param _fileHash SHA-256 Hash của file chứng chỉ PDF/Image. (32 bytes)
     * @param _ipfsCID CID của file chứng chỉ trên IPFS. (Nên chuyển đổi sang bytes32 trước khi gọi)
     * @param _studentIdHash Hash của Mã sinh viên (hoặc thông tin sinh viên quan trọng khác). (32 bytes)
     */
    function registerCertificate(
        bytes32 _fileHash,
        bytes32 _ipfsCID,
        bytes32 _studentIdHash
    ) public onlyAuthorizedIssuer {
        // Đảm bảo chứng chỉ với hash này chưa từng được phát hành
        require(certificates[_fileHash].issuedAt == 0, "Certificate already registered.");
        
        // Lưu trữ thông tin chứng chỉ
        certificates[_fileHash] = Certificate(
            _ipfsCID,
            _studentIdHash,
            msg.sender,         // Địa chỉ người gửi (Nhà trường)
            block.timestamp,    // Dấu thời gian phát hành
            true
        );

        // Phát ra sự kiện để các dịch vụ ngoài (API backend) có thể theo dõi và phản hồi
        emit CertificateRegistered(
            _fileHash,
            msg.sender,
            _ipfsCID,
            _studentIdHash,
            block.timestamp
        );
    }

    // --- Chức năng Xác minh Chứng chỉ (Bước 3) ---

    /**
     * @dev Mọi người có thể gọi hàm này để kiểm tra thông tin của một chứng chỉ.
     * @param _fileHash SHA-256 Hash của file chứng chỉ cần xác minh.
     * @return 
     * _ipfsCID: CID IPFS của file gốc
     * _issuer: Địa chỉ ví của nhà trường đã phát hành
     * _issuedAt: Thời điểm chứng chỉ được phát hành
     * _studentIdHash: Mã sinh viên đã được băm (dùng để khớp/kiểm tra nội bộ)
     */
    function verifyCertificate(bytes32 _fileHash) 
        public 
        view 
        returns (
            bytes32 _ipfsCID, 
            address _issuer, 
            uint256 _issuedAt, 
            bytes32 _studentIdHash
        ) 
    {
        // Lấy dữ liệu từ ánh xạ
        Certificate memory cert = certificates[_fileHash];

        // Kiểm tra xem chứng chỉ có tồn tại hay không
        // Nếu issuedAt là 0, chứng chỉ chưa được đăng ký
        require(cert.issuedAt != 0 && cert.isValid, "Certificate not found or invalid."); 

        // Trả về thông tin
        return (
            cert.ipfsCID,
            cert.issuer,
            cert.issuedAt,
            cert.studentIdHash
        );
    }

    //== thêm chức năng hủy chứng chỉ (revoke) nếu cần thiết => Issuer có thể thu hồi chứng chỉ đã phát hành

    
}
```

### contracts\tsconfig.json

```json
/* Based on https://github.com/tsconfig/bases/blob/501da2bcd640cf95c95805783e1012b992338f28/bases/node22.json */
{
  "compilerOptions": {
    "lib": ["es2023"],
    "module": "node16",
    "target": "es2022",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node16",
    "outDir": "dist"
  }
}

```

### core\repositories\blockchain.repository.ts

```ts
// CALL SMART CONTRACT FUNCTION
import CertiChainAbi from "@/lib/abi/CertiChain.json";
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

type VerifyCertificateOutput = {
  issuerAddress: Address;
  issuedAt: Date;
  isValid: boolean;
};

// 2. Lấy các biến môi trường
const RPC_URL = process.env.BASE_RPC;
const ADMIN_PRIVATE_KEY = process.env.PRIVATE_KEY as Address | undefined; // viem cần kiểu `0x...`
const CONTRACT_ADDRESS = CertiChainAbi.contractAddress as Address | undefined;
const ABI = CertiChainAbi.abi as Abi;

// Check empty env vars
if (!RPC_URL || !ADMIN_PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing required environment variables for blockchain");
}

// create admin account from private key
const adminAccount = privateKeyToAccount(ADMIN_PRIVATE_KEY);

// create public and wallet clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

// create wallet client to sign transactions
const walletClient = createWalletClient({
  account: adminAccount,
  chain: sepolia,
  transport: http(RPC_URL),
});

/**
 * Convert SHA-256 hash string to bytes32 format (0x + 64 hex chars)
 */
function normalizeHashToBytes32(hash: string): Hex {
  // Remove any existing 0x prefix
  const cleanHash = hash.replace(/^0x/, "");

  // Ensure it's exactly 64 hex characters
  if (cleanHash.length !== 64) {
    throw new Error(
      `Invalid hash length: expected 64 chars, got ${cleanHash.length}`
    );
  }

  // Validate hex format
  if (!/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
    throw new Error("Hash contains invalid hex characters");
  }

  return `0x${cleanHash}` as Hex;
}

export class BlockchainService {
  /**
   * Call the smart contract to register a certificate on the blockchain
   */

  async registerOnChain(
    fileHash: string,
    // ipfsHash: string,
    // studentIdHash: string
  ) {
    try {
      console.log("Đang gọi Smart Contract (viem): registerCertificate()...");

      // Normalize hashes to bytes32 format
      const normalizedFileHash = normalizeHashToBytes32(fileHash);
      
      // TODO: FIX THIS LATER
      // const normalizedStudentIdHash = normalizeHashToBytes32(fileHash);

      const { request } = await publicClient.simulateContract({
        account: adminAccount,
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "registerCertificate",
        args: [normalizedFileHash],
      });
      const txHash = await walletClient.writeContract(request);

      console.log("Giao dịch đã được gửi, đang chờ xác nhận...");
      console.log("Transaction Hash:", txHash);

      // (Optional: wait transation to verify success)
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Transaction success:", transaction);

      return txHash;
    } catch (error) {
      console.log("Error somethings when call contract with VIEM", error);
      throw new Error("Blockchain registration failed");
    }
  }

  async verifyOnChain(fileHash: string): Promise<VerifyCertificateOutput> {
    try {
      // Normalize hash before verification
      const normalizedFileHash = normalizeHashToBytes32(fileHash);

      const certVerified = (await publicClient.readContract({
        address: CONTRACT_ADDRESS as Address,
        abi: ABI,
        functionName: "verifyCertificate",
        args: [normalizedFileHash],
      })) as [Address, bigint, boolean];

      return {
        issuerAddress: certVerified[0],
        issuedAt: new Date(Number(certVerified[1]) * 1000),
        isValid: certVerified[2],
      };
    } catch (error) {
      console.log("Verify error with server: ", error);
      throw new Error("Blockchain verification failed");
    }
  }
  
}

```

### core\repositories\certificate.repository.ts

```ts
// QUERY DATABASE FOR CERTIFICATES

import { prisma } from "@/lib/db";
import type { Prisma, Certificate, User } from "@/app/generated/prisma/client";

const db = prisma;

// Type for Certificate with Student included
export type CertificateWithStudent = Certificate & {
  student: User;
};

export class CertificateRepository {
  // -- CREATE CERTIFICATE --
  async create(data: Prisma.CertificateCreateInput): Promise<Certificate> {
    return db.certificate.create({
      data,
    });
  }

  // -- CREATE CERTIFICATE WITH USER ID --
  async createWithUserId(
    data: Omit<Prisma.CertificateCreateInput, "student"> & { userId: number }
  ): Promise<Certificate> {
    const { userId, ...certificateData } = data;
    return db.certificate.create({
      data: {
        ...certificateData,
        student: {
          connect: { id: userId },
        },
      },
    });
  }

  // -- FIND ALL CERTIFICATES --
  async findAll(): Promise<CertificateWithStudent[]> {
    return prisma.certificate.findMany({
      include: { student: true },
    });
  }

  // -- FIND CERTIFICATE BY ID --
  async findById(id: string): Promise<CertificateWithStudent | null> {
    return prisma.certificate.findUnique({
      where: { id: Number(id) },
      include: { student: true },
    });
  }

  // -- FIND BY FILE HASH --
  async findByHash(fileHash: string): Promise<CertificateWithStudent | null> {
    // Normalize hash: remove 0x prefix if exists
    const normalizedHash = fileHash.toLowerCase().replace(/^0x/, "");

    return prisma.certificate.findFirst({
      where: { fileHash: normalizedHash },
      include: { student: true },
    });
  }

  // -- FIND BY BLOCKCHAIN TX HASH --
  async findByTxHash(txHash: string): Promise<CertificateWithStudent | null> {
    // Try to find with original hash first (might have 0x prefix)
    let cert = await prisma.certificate.findFirst({
      where: { blockchainTx: txHash },
      include: { student: true },
    });

    // If not found, try with normalized hash (remove 0x)
    if (!cert) {
      const normalizedHash = txHash.toLowerCase().replace(/^0x/, "");
      cert = await prisma.certificate.findFirst({
        where: { blockchainTx: normalizedHash },
        include: { student: true },
      });
    }

    // If still not found, try adding 0x prefix
    if (!cert && !txHash.startsWith("0x")) {
      cert = await prisma.certificate.findFirst({
        where: { blockchainTx: `0x${txHash}` },
        include: { student: true },
      });
    }

    return cert;
  }

  // -- UPDATE CERTIFICATE STATUS --
  async updateStatus(
    id: string,
    status: string,
    blockchainTx: string
  ): Promise<CertificateWithStudent | null> {
    return prisma.certificate.update({
      where: { id: Number(id) },
      data: { status, blockchainTx },
      include: { student: true },
    });
  }

  // -- FIND USER BY CERTIFICATE ID --
  async findUserByCertificateId(certificateId: string) {
    return prisma.certificate
      .findUnique({
        where: { id: Number(certificateId) },
      })
      .student();
  }
}

```

### core\repositories\user.repository.ts

```ts
import { prisma } from "@/lib/db";

const db = prisma;
export class UserRepository {
  async findUserById(userId: string) {
    return db.user.findUnique({
      where: { id: Number(userId) },
    });
  }

  //   async createUser(userData: any) {
  //     return db.user.create({
  //       data: userData,
  //     });
  //   }

  //   async updateUser(userId: string, userData: any) {
  //     return db.user.update({
  //       where: { id: Number(userId) },
  //       data: userData,
  //     });
  //   }

  //   async deleteUser(userId: string) {
  //     return db.user.delete({
  //       where: { id: Number(userId) },
  //     });
  //   }

  async findAllUsers() {
    return db.user.findMany();
  }

  async findAllStudents() {
    return db.user.findMany({
      where: { role: "STUDENT" },
    });
  }
}

```

### core\services\certificate.service.ts

```ts
import { pinata } from "@/utils/config";
import { CertificateRepository } from "../repositories/certificate.repository";
import crypto from "crypto";

type CertificateUploadInput = {
  file: File;
  studentName: string;
  studentId: string;
  courseName: string;
  userId: number;
};

export const certSha256 = (buffer: Buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

export class CertificateService {
  private certRepo = new CertificateRepository();

  // -- UPLOAD + IPFS FILE --
  async createCertificate({
    file,
    // studentName,
    // studentId,
    courseName,
    userId,
  }: CertificateUploadInput) {
    // Upload file to IPFS
    const fileHash = certSha256(Buffer.from(await file.arrayBuffer()));
    // const studentIdHash = certSha256(
    //   Buffer.from(studentId + studentName + courseName)
    // );

    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);
    const issuerAddress = process.env.ISSUER_WALLET!;

    const cert = await this.certRepo.createWithUserId({
      courseName,
      fileHash,
      ipfsCid: cid,
      issuerAddress,
      userId,
    });

    // return NextResponse.json(url, { status: 200 });

    return { id: cert.id, fileHash, ipfsCid: cid, url, status: cert.status };
  }

  // -- GET USER BY CERTIFICATE ID --
  async getUserByCertificateId(certificateId: string) {
    const user = await this.certRepo.findUserByCertificateId(certificateId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

```

### core\services\user.service.ts

```ts
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();
export class UserService {
  async getUserById(userId: string) {
    return userRepository.findUserById(userId);
  }

  async getAllUsers() {
    return userRepository.findAllUsers();
  }

  async getAllStudents() {
    return userRepository.findAllStudents();
  }
}

```

### eslint.config.mjs

*(Unsupported file type)*

### lib\abi\CertiChain.json

```json
{
    "_format": "hh3-artifact-1",
    "contractName": "CertiChain",
    "sourceName": "contracts/CertiChain.sol",
    "contractAddress": "0x9C114C532f34f2eEa48fF9Ed2Bea5111f22F1099",
    "abi": [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "bytes32",
                    "name": "fileHash",
                    "type": "bytes32"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "issuer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "issuedAt",
                    "type": "uint256"
                }
            ],
            "name": "CertificateRegistered",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "issuerAddress",
                    "type": "address"
                }
            ],
            "name": "IssuerAuthorized",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_issuerAddress",
                    "type": "address"
                }
            ],
            "name": "authorizeIssuer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "certificates",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "issuer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "issuedAt",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isValid",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "contractOwner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "isAuthorizedIssuer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_fileHash",
                    "type": "bytes32"
                }
            ],
            "name": "registerCertificate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_issuerAddress",
                    "type": "address"
                }
            ],
            "name": "revokeIssuer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_fileHash",
                    "type": "bytes32"
                }
            ],
            "name": "verifyCertificate",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "_issuer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_isssedAt",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "_isValid",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    "linkReferences": {},
    "deployedLinkReferences": {},
    "immutableReferences": {},
    "inputSourceName": "project/contracts/CertiChain.sol",
    "buildInfoId": "solc-0_8_28-98a5633abecd0bdf7386daf3acfd835c9f675a3c"
}
```

### lib\auth.ts

```ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/auth";

/**
 * Get server-side session in Server Components or API Routes
 * Usage: const session = await auth();
 */
export async function auth() {
  return await getServerSession(authOptions);
}

```

### lib\db.ts

```ts

import { PrismaClient } from "../app/generated/prisma/client"; // app\generated\prisma\client.ts


const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### lib\ipfs.ts

```ts

```

### LICENSE

*(Unsupported file type)*

### middleware.ts

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Auth pages (redirect to dashboard if already logged in)
  const isAuthPage = pathname.startsWith("/login");

  // Protected paths that require authentication
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/certificates/create") ||
    pathname.startsWith("/certificates/view");

  // Admin-only paths
  const isAdminPath = pathname.startsWith("/certificates/create");

  // Redirect to login if accessing protected page without auth
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing login page while authenticated
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check admin-only routes
  if (isAdminPath && token) {
    if (token.user?.role !== "ADMIN") {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|api/certificates/verify).*)",
  ],
};

```

### next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Empty turbopack config to silence the warning
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Fix for PDF.js in Node.js environment
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf.min.mjs',
      };
    }
    
    return config;
  },
};

export default nextConfig;

```

### package.json

```json
{
  "name": "certi_chain",
  "version": "0.1.0",
  "private": true,
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "install:all": "npm install --legacy-peer-deps"
  },
  "dependencies": {
    "@prisma/client": "^6.18.0",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@tanstack/react-query": "^5.90.5",
    "bcrypt": "^6.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.3",
    "ethers": "^6.15.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.546.0",
    "next": "16.0.0",
    "next-auth": "^4.24.13",
    "pdfjs-dist": "^5.4.394",
    "pinata": "^2.5.1",
    "qrcode.react": "^4.2.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-pdf": "^10.2.0",
    "tailwind-merge": "^3.3.1",
    "viem": "^2.38.5",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcrypt": "^6.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.0",
    "ignore-loader": "^0.1.2",
    "prisma": "^6.18.0",
    "tailwindcss": "^4",
    "ts-node": "^10.9.2",
    "tsx": "^4.20.6",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}

```

### postcss.config.mjs

*(Unsupported file type)*

### prisma\schema.prisma

*(Unsupported file type)*

### prisma\seed.ts

```ts
import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

async function main() {
  console.log("Cleaning data ...");
  await prisma.certificate.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding data ...");
  // Hash passwords với bcrypt
  const saltRounds = 10;

  // Tạo users với password được hash
  const users = await Promise.all([
    prisma.user.create({
      data: {
        studentName: "Danica Jane Maglayo",
        studentId: "httt22001",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Jennifer Benbow",
        studentId: "httt22002",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Liang Shu-Hsiang",
        studentId: "httt22008",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Mariah Smith",
        studentId: "httt22004",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Peter Baker",
        studentId: "httt22005",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Willie Smith",
        studentId: "httt22006",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Nguyễn Hữu Hoàn Thiện",
        studentId: "httt22007",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        studentName: "Nguyễn Thành Đạt",
        studentId: "httt22003",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),

    // Tạo thêm user ADMIN
    prisma.user.create({
      data: {
        studentName: "School's Admin",
        studentId: "admin",
        passwordHash: await bcrypt.hash("sinooAd", saltRounds),
        role: "ADMIN",
      },
    }),
  ]);

  console.log("Seeded Users:", users);

  // Tạo certificates với userId từ users đã tạo
  const certificates = await prisma.certificate.createMany({
    data: [
      {
        courseName: "Certificate of Getting Ready for the CPA Board Exam",
        fileHash:
          "2efb9c8e48e3ae48c92778cf08fcea01ba8091cfdbacd2609d97747db3b34001",
        ipfsCid: "bafybeibrhlewfkp7uxs7luzgxsg4bhbey5dfapw47aypzbsgtxwbqs3bbu",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[0].id, // httt22001
      },
      {
        courseName: "Certificate of Achievement in Blockchain",
        fileHash:
          "24d3300b4cb276e7110527d6d5e7f3856c5b2f049c9ccc5a9d3080d9b610b11b",
        ipfsCid: "bafkreibe2myawtfso3trcbjh23k6p44fnrns6be4ttgfvhjqqdm3mefrdm",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[1].id, // httt22002
      },
      {
        courseName: "Certificate of Getting Ready for the CPA Board Exam",
        fileHash:
          "cbddcf032651fc6983fb61ccbceb226e1e436dd41f697e9692f17377eb8d6e78",
        ipfsCid: "bafkreigl3xhqgjsr7ruyh63bzs6owitodzbw3va7nf7jnexron36xdlopa",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[2].id, // httt22003
      },
      {
        courseName: "Toeic Certificate",
        fileHash:
          "fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b",
        ipfsCid: "bafybeiewbaqggkvurvlj5onej2bsdtmu6kgsregi777f2w7lj7jse6z4re",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[3].id, // Gán cho user thứ 4
      },
      {
        courseName: "Certificate of Achievement in Blockchain",
        fileHash:
          "d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321",
        ipfsCid: "bafkreiguruyzoorgo377lfndusvsy2uhgvmjxa6zwlagdhyw45td4tkdee",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[4].id, // Gán cho user thứ 5
      },
      {
        courseName: "Certificate of The best Employee learn Blockchain",
        fileHash:
          "33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a",
        ipfsCid:
          "bafkreibtyoj5zsniyaqq2sdzrswhipsxigvb3hihj5kuzjh5kuzjh5x7efivdvni",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[5].id, // Gán cho user thứ 6
      },
      {
        courseName: "Certificate of Completion CraftMyPDF education program",
        fileHash:
          "f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a",
        ipfsCid: "bafkreihrha7jr7t2edcrzxmoilwpkzt4tuuvcd5yjxtv4pskw2limhpnhi",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[6].id, // Gán cho user thứ 7
      },
      // {
      //   courseName: "Vstep Certificate",
      //   fileHash:
      //     "146687b95c77271ad1e4922a3999bf857ba69b87a5ca5c37eb723dbda0350c04",
      //   ipfsCid: "bafkreiaum2d3sxdxe4nndzesfi4ztp4fpotjxb5fzjodp23shw62animaq",
      //   issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
      //   blockchainTx: "", // empty because not yet registered
      //   status: "pending",
      //   issuedAt: new Date(),
      //   userId: users[7].id, // Gán cho user thứ 8
      // },
      {
        courseName: "The best student of the year certificate",
        fileHash:
          "7e0dc866e2870a67a4d37189ec57a819467c63711202008b6f1b437255874368",
        ipfsCid: "bafybeicfx2eq3ctrysypp2yahjk3utfb62in6i2flkibgyqf75dgfimk4m",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx:
          "0x1021a9642622445cbea10af15f1c2350ab3edce3d966a8aa6af32d036b210045",
        status: "verified",
        issuedAt: new Date(),
        userId: users[7].id, // Gán cho user thứ 9
      },
    ],
  });
  console.log("Seeded certificates:", certificates);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

```

### prisma.config.ts

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

```

### PRISMA_GUIDE.MD

```MD
# Prisma guide

```bash
npx prisma db push
```

## Production command

```bash
npx prisma db seed
```

```bash
# OPTION with dev
npx prisma migrate dev
```

```

### public\file.svg

*(Unsupported file type)*

### public\globe.svg

*(Unsupported file type)*

### public\next.svg

*(Unsupported file type)*

### public\pdfjs\pdf.worker.legacy.min.mjs

*(Unsupported file type)*

### public\pdfjs\pdf.worker.min.mjs

*(Unsupported file type)*

### public\vercel.svg

*(Unsupported file type)*

### public\window.svg

*(Unsupported file type)*

### README.md

```md
<!-- Luồng hệ thống xác thực chứng chỉ, nhà trường sẽ đảm bảo chứng chỉ cho sv, bất cứ người nào cũng có thể xác thực chứng chỉ đó là sự thật, sinh viên và nhà trường cần đăng nhập đẻ có thể quản lý chứng chỉ của bản thân:

Admin upoad: họ tên, mssv, tên khóa học + file chứng chỉ(này lên ipfs) => Các thông tin còn lại thì lưu database và lúc này data:
```
Certificate {
  id           	Tự tăng
  studentName   Đã có
  studentIdHash hash dựa trên: certSha256(Buffer.from(studentId + studentName + courseName));
  courseName    Đã có
  fileHash      Đã có hash từ nội dung file được đẩy lên
  ipfsCid       cid từ pinata trả về
  issuerAddress Đã cố định
  blockchainTx  null, chưa có vì chưa thực hiện verify
  status        pending khi mới tạo, verified và failed thì trả về khi thực hiện verify onchain
  issuedAt      Đã có khi tạo thành công

  // Relations
  userId Đã query vào bảng User với trường studentId raw lúc chưa hash
}
``` 

Lúc này student có tài khoản trước đó rồi, login vào thấy được các chứng chỉ của mình, lưu ý là chỉ xem.

Sau đó admin có nhiệm vụ là verify, thực hiện đẩy lên blockchain với các thông tin: fileHash, studentIdHash (Là ở đây tôi có thể thay thế studentIdHash thành studentId được không). Nếu thành công sẽ cập nhật status = verified (failed nếu thất bại), blockchainTx = transactionHash 

Người interviewer có thể verify hay bất cứ người nào mà không cần login. Người này chỉ cần nhập cái mã file hash dô (Có thể bằng link hoặc qr cho tiện). Lúc này quan trọng đó là nếu như smartContract xác thực thành công thì trả về ok (Có thể kèm data một số trường cần thiết) hoặc thất bại

    // "contractAddress": "0xF82d44De7D594f8d47c38a2c7208Fac85554C0d8",

 -->

# **🎓 CertiChain – Hệ thống Xác thực Chứng chỉ Giáo dục trên Blockchain**

**Blockchain + IPFS 2025**

---

## 📚 Quick Links

- 📖 [**Complete Auth Guide**](./docs/FE_AUTH_GUIDE.md) - Comprehensive documentation
- 🧪 [**Testing Guide**](./TEST_AUTH.md) - How to test authentication

---

## **🧭 1\. Mục tiêu nghiệp vụ**

Hệ thống được xây dựng nhằm **tự động hóa và phi tập trung hóa quy trình xác thực chứng chỉ giáo dục**, giúp:

- Nhà trường có thể phát hành chứng chỉ kỹ thuật số **minh bạch, không thể giả mạo**.

- Sinh viên có thể **chứng minh năng lực học tập** của mình chỉ bằng một đường link hoặc mã QR.

- Nhà tuyển dụng có thể **xác thực độc lập** chứng chỉ đó mà **không cần liên hệ trực tiếp với trường**.

Toàn bộ quy trình vận hành dựa trên **Blockchain (Base chain)** và **IPFS (phi tập trung)**, đảm bảo tính **bất biến, minh bạch, và kiểm chứng công khai**.

---

## **👥 2\. Các vai trò trong hệ thống**

| Vai trò | Mô tả | Quyền hạn / Trách nhiệm |
| ----- | ----- | ----- |
| 🏫 **Nhà trường (Issuer)** | Cơ quan phát hành chứng chỉ, chịu trách nhiệm xác thực thông tin sinh viên và cấp chứng chỉ lên blockchain. | \- Xác minh danh tính sinh viên.- Tạo, ký và upload chứng chỉ lên hệ thống.- Chịu chi phí giao dịch (gas fee) để ghi dữ liệu lên blockchain.- Cung cấp đường link hoặc mã QR cho sinh viên. |
| 👩‍🎓 **Sinh viên (Guest/Holder)** | Người sở hữu chứng chỉ kỹ thuật số. Không cần tài khoản hay ví, chỉ sử dụng link hoặc QR để chia sẻ chứng chỉ trong hồ sơ cá nhân. | \- Nhận link hoặc mã QR từ nhà trường.- Dán link đó vào CV, portfolio, hoặc profile cá nhân.- Không thể chỉnh sửa hay giả mạo chứng chỉ đã phát hành. |
| 🏢 **Nhà tuyển dụng (Verifier)** | Bên thứ ba có nhu cầu xác thực chứng chỉ của ứng viên. Không cần tài khoản, chỉ cần truy cập link để kiểm tra tính hợp lệ. | \- Scan QR hoặc truy cập link chứng chỉ.- Hệ thống tự động xác minh on-chain: kiểm tra **issuer hợp lệ** và **thông tin sinh viên**.- Nhận kết quả xác thực “Valid / Invalid”. |

---

## **⚙️ 3\. Quy trình nghiệp vụ tổng quát**

### **Bước 1\. Nhà trường phát hành chứng chỉ**

1. Nhà trường đăng nhập hệ thống (Next.js admin portal).

2. Nhập thông tin sinh viên và khóa học (tên, mã sinh viên, ngành học, ngày cấp...).

3. Upload file chứng chỉ (PDF hoặc ảnh).

4. Hệ thống:

   - Sinh `SHA-256 hash` từ file PDF.

   - Upload file lên **IPFS** → nhận **CID (Content Identifier)**.

   - Gọi smart contract `registerCertificate(hash, CID, studentIdHash)` trên **mạng Base Sepolia**.

5. Smart contract lưu trữ:

   - Hash chứng chỉ (fileHash).

   - CID (vị trí lưu trữ phi tập trung).

   - Địa chỉ ví của nhà trường (issuer).

   - Dấu thời gian phát hành (`block.timestamp`).

💰 **Nhà trường chịu chi phí giao dịch (gas fee)** cho mỗi chứng chỉ được phát hành.

---

### **Bước 2\. Sinh viên nhận chứng chỉ số**

1. Sau khi chứng chỉ được ghi lên blockchain, hệ thống tạo:

Link công khai:

 <https://verify.edu.vn/certificates/\><certificate\_id\>

-
  - Hoặc mã QR tương ứng.

2. Sinh viên (guest account) nhận link/QR từ trường (qua email, LMS, hoặc dashboard).

3. Sinh viên chèn link hoặc QR đó vào hồ sơ cá nhân, portfolio, hoặc CV.

👉 Không cần tài khoản, không cần ví — chỉ cần copy link.

---

### **Bước 3\. Nhà tuyển dụng xác thực chứng chỉ**

1. Nhà tuyển dụng truy cập link hoặc quét QR code trên CV của ứng viên.

2. Hệ thống frontend gọi API `/api/verify?hash=<fileHash>`.

3. API truy vấn smart contract:

   - Kiểm tra xem hash có tồn tại trên blockchain hay không.

   - Lấy thông tin: `issuer`, `ipfsCID`, `issuedAt`, `studentIdHash`.

API trả về kết quả xác thực:

 {  
  "verified": true,  
  "issuer": "0x123...abc",  
  "student": "hashed\_student\_id",  
  "ipfs\_cid": "QmXyz...",  
  "issued\_at": "2025-10-22"  
}

4.
5. Frontend hiển thị:

   - ✅ “Certificate Verified — Issued by University of ABC”

   - Xem file chứng chỉ gốc tại: `https://ipfs.io/ipfs/QmXyz...`

   - Xem giao dịch on-chain trên BaseScan.

---

## **🧱 4\. Luồng nghiệp vụ (Business Sequence)**

sequenceDiagram  
    participant Issuer as Nhà Trường  
    participant IPFS as IPFS Network  
    participant Blockchain as Base Blockchain  
    participant Student as Sinh Viên  
    participant Employer as Nhà Tuyển Dụng

    Issuer-\>\>IPFS: Upload chứng chỉ (PDF) → nhận CID  
    Issuer-\>\>Blockchain: registerCertificate(hash, CID, studentIdHash)  
    Blockchain--\>\>Issuer: Trả về txHash \+ timestamp  
    Issuer--\>\>Student: Cung cấp link / QR code chứng chỉ  
    Student-\>\>Employer: Dán link chứng chỉ vào CV  
    Employer-\>\>Blockchain: verifyCertificate(hash)  
    Blockchain--\>\>Employer: Trả về issuer \+ CID \+ issuedAt  
    Employer-\>\>IPFS: Mở file chứng chỉ theo CID  
    Employer--\>\>Employer: So sánh thông tin → ✅ "Verified"

---

## **📊 5\. Giá trị nghiệp vụ**

| Lợi ích | Mô tả |
| ----- | ----- |
| 🔒 **Chống giả mạo** | Chứng chỉ được xác thực công khai bằng hash và CID, không thể sửa đổi hay xoá bỏ. |
| ⚙️ **Tự động hóa xác thực** | Nhà tuyển dụng chỉ cần quét mã, hệ thống tự kiểm tra on-chain, không cần xác nhận thủ công. |
| 🌐 **Minh bạch & phi tập trung** | Không phụ thuộc vào cơ sở dữ liệu riêng của trường — bất kỳ ai cũng có thể xác thực trên blockchain. |
| 📎 **Dễ tích hợp với hệ thống hiện có** | Có thể nhúng link xác thực vào LMS, CV điện tử, hoặc ứng dụng HR. |
| 💰 **Chi phí thấp, duy trì lâu dài** | Nhà trường chỉ tốn phí on-chain 1 lần duy nhất khi phát hành. |

---

## **🧩 6\. Tổng kết logic nghiệp vụ**

| Thành phần | Vai trò | Hành động | Kết quả |
| ----- | ----- | ----- | ----- |
| **Nhà trường** | Issuer | Upload & ghi chứng chỉ lên blockchain | Giao dịch bất biến (proof-of-issue) |
| **Sinh viên** | Holder | Nhận link chứng chỉ | Có thể chia sẻ dễ dàng |
| **Nhà tuyển dụng** | Verifier | Quét QR hoặc truy cập link | Xác minh tính hợp lệ và xuất xứ |

---

## **⚙️ 7\. Điểm nổi bật trong phiên bản này**

- **Không cần sinh viên có ví hoặc đăng ký blockchain.**

- **Nhà trường đóng vai trò duy nhất phát hành on-chain** → tránh giả mạo.

- **Nhà tuyển dụng có thể xác minh độc lập** mà không cần tin vào server của trường.

- **Sử dụng IPFS \+ Base Chain** → dữ liệu phân tán, bất biến, rẻ và minh bạch.

---

## **🧠 Tóm tắt nói ngắn gọn (cho phần giới thiệu báo cáo):**

“Hệ thống của chúng tôi cho phép các cơ sở đào tạo phát hành chứng chỉ kỹ thuật số lưu trữ trên IPFS, đồng thời ghi lại dấu vết xác thực trên blockchain Base. Sinh viên có thể sử dụng đường link hoặc mã QR của chứng chỉ này để đính kèm vào hồ sơ cá nhân. Nhà tuyển dụng chỉ cần quét QR hoặc truy cập link là có thể xác minh ngay lập tức tính hợp lệ và nguồn gốc của chứng chỉ mà không cần liên hệ với nhà trường. Toàn bộ quá trình xác thực được đảm bảo minh bạch, phi tập trung và không thể bị chỉnh sửa.”

```

### src\auth.ts

```ts
import { prisma } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

const db = prisma;

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // -- SESSION
  session: {
    strategy: "jwt", // IF don't adapter, must to use "jwt"
  },

  // -- PROVIDERS
  providers: [
    Credentials({
      // Define fields
      credentials: {
        studentId: {
          label: "Student ID",
          type: "text",
          placeholder: "your studentId",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },

      async authorize(credentials) {
        // Check valid credentials
        const parsedCredentials = z
          .object({
            studentId: z.string().min(3),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { studentId, password } = parsedCredentials.data;
          // Get user from studentId

          const user = await db.user.findFirst({
            where: { studentId: studentId },
          });

          if (!user) return null;

          // check password
          const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (isPasswordValid)
            return {
              id: user.id.toString(),
              studentId: user.studentId,
              role: user.role,
            };
        }

        return null;
      },
    }),
  ],

  // -- CALLBACKS
  callbacks: {
    // jwt callback
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    // session callback
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export for API route
export { handler as GET, handler as POST };

```

### src\components\CertificateCard.tsx

```tsx
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatDate, truncateAddress } from "@/src/lib/utils";
import { Certificate } from "@/src/types/certificate";
import {
  Calendar,
  Copy,
  ExternalLink,
  GraduationCap,
  User,
} from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  onView?: () => void;
  onRegister?: () => void;
  onCopy?: () => void;
  isRegistering?: boolean;
}

export function CertificateCard({
  certificate,
  onView,
  onRegister,
  onCopy,
  isRegistering = false,
}: CertificateCardProps) {
  const isPending = certificate.status === "pending";

  // Check transaction hash (support both transactionHash and blockchainTx field names)
  const txHash = certificate.transactionHash || certificate.blockchainTx;
  const hasTransaction = !!txHash;

  // ✅ Safety check: Return early if student data is missing
  if (!certificate.student) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <p className="text-red-600 dark:text-red-400 font-medium">
          ⚠️ Thiếu thông tin sinh viên
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Certificate ID: {certificate.id}
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col bg-white/70 dark:bg-white/10 backdrop-blur-xl border-2 border-white/60 dark:border-white/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-white/80 dark:hover:border-white/40">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 min-h-[3.5rem]">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
              {certificate.courseName}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Hash Info & Date - Cùng hàng */}
        <div className="flex flex-wrap gap-2">
          {/* Date Badge */}
          <Badge
            variant="secondary"
            className="gap-1.5 bg-indigo-600/90 text-white border-0"
          >
            <Calendar className="h-3 w-3" />
            {formatDate(certificate.issuedAt)}
          </Badge>

          {/* Hash Badge - Thay đổi theo trạng thái */}
          {hasTransaction ? (
            // On-chain: Hiển thị transaction hash màu xanh
            <Badge
              variant="secondary"
              className="gap-1.5 font-mono text-xs bg-green-600/90 hover:bg-green-700/90 text-white border-0"
            >
              <span className="opacity-90">Hash:</span>
              {truncateAddress(txHash)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(txHash);
                  if (onCopy) onCopy();
                }}
                className="h-4 w-4 p-0 hover:bg-white/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </Badge>
          ) : (
            // Pending: Hiển thị "Chờ xác thực" màu cam
            <Badge
              variant="secondary"
              className="gap-1.5 font-mono text-xs bg-orange-500/90 text-white border-0"
            >
              <span className="opacity-90">Hash:</span>
              Chờ xác thực
            </Badge>
          )}
        </div>

        {/* Student Info Card */}
        <div className="glass-effect rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground leading-tight">
                {certificate.student.studentName || ""}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                {certificate.student.studentId || ""}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="flex-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Chi tiết
          </Button>

          {hasTransaction ? (
            <div className="flex-1 flex items-center justify-center text-green-600 dark:text-green-400 rounded-md px-3 py-2 text-sm font-medium">
              ✓ Đã xác thực
            </div>
          ) : isPending && onRegister ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegister}
              disabled={isRegistering}
              className="flex-1 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-purple-600"
            >
              {isRegistering ? "Đang đăng ký..." : "Đăng ký on-chain"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

```

### src\components\CertificateDisplay.tsx

```tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { Certificate } from "@/src/types/certificate";
import { Download, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
interface CertificateDisplayProps {
  certificate: Certificate;
  verificationUrl?: string;
}

export function CertificateDisplay({
  certificate,
  verificationUrl,
}: CertificateDisplayProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    if (navigator.share && verificationUrl) {
      navigator.share({
        title: `Chứng chỉ ${certificate.courseName}`,
        text: `Chứng chỉ ${certificate.courseName} của ${
          certificate.student?.studentName || "N/A"
        }`,
        url: verificationUrl,
      });
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end mb-6">
        <Button
          variant="outline"
          className="gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <Download className="h-4 w-4" />
          Tải PDF
        </Button>

        {verificationUrl && (
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
        )}
      </div>

      {/* Certificate Display - Print styling */}
      <div className="hidden print:block">
        <style jsx>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
      </div>

      {/* Certificate Content */}
      <div
        ref={componentRef}
        className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-8 border-blue-900 rounded-2xl shadow-2xl overflow-hidden relative mx-auto my-0 py-7.5 px-12.5"
        style={{
          width: "297mm", // A4 landscape width
          minHeight: "210mm", // A4 landscape height
        }}
      >
        {/* Guilloche Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
          >
            <defs>
              {/* Guilloche pattern */}
              <pattern
                id="guilloche"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="2"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <path
                  d="M 10 50 Q 50 10, 90 50 T 10 50"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                  fill="none"
                />
                <path
                  d="M 10 50 Q 50 90, 90 50 T 10 50"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                  fill="none"
                />
              </pattern>

              {/* Wave lines pattern */}
              <pattern
                id="waves"
                x="0"
                y="0"
                width="200"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 25 Q 50 15, 100 25 T 200 25"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M 0 25 Q 50 35, 100 25 T 200 25"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
              </pattern>

              {/* Diagonal lines */}
              <pattern
                id="diagonal"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="50"
                  y2="50"
                  stroke="#1e40af"
                  strokeWidth="0.2"
                  opacity="0.2"
                />
              </pattern>
            </defs>

            {/* Apply patterns */}
            <rect width="100%" height="100%" fill="url(#guilloche)" />
            <rect width="100%" height="100%" fill="url(#waves)" />
            <rect width="100%" height="100%" fill="url(#diagonal)" />

            {/* Decorative corners */}
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="calc(100% - 20)"
              cy="20"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="20"
              cy="calc(100% - 20)"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />
            <circle
              cx="calc(100% - 20)"
              cy="calc(100% - 20)"
              r="15"
              fill="none"
              stroke="#1e40af"
              strokeWidth="1"
              opacity="0.2"
            />

            {/* Border decorations */}
            <rect
              x="10"
              y="10"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="calc(100% - 40)"
              y="10"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="10"
              y="calc(100% - 13)"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
            <rect
              x="calc(100% - 40)"
              y="calc(100% - 13)"
              width="30"
              height="3"
              fill="#1e40af"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Content wrapper with z-index */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
              <div className="h-3 w-3 bg-blue-900 rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-blue-900 mb-3">
              CHỨNG CHỈ HOÀN THÀNH
            </h1>
            <h2 className="text-3xl font-semibold text-blue-700">
              CERTIFICATE OF COMPLETION
            </h2>
          </div>

          {/* Decorative Border */}
          <div className="border-2 border-blue-900 my-6"></div>

          {/* Main Content */}
          <div className="text-center mb-6">
            <p className="text-xl mb-5">
              Hội đồng công nhận chứng chỉ CertiChain xác nhận rằng
            </p>

            <div className="my-6">
              <h3 className="text-6xl font-bold text-blue-900 mb-5 tracking-wide">
                {certificate.student?.studentName?.toUpperCase() || "N/A"}
              </h3>
              <p className="text-xl text-gray-600 font-medium">
                Mã sinh viên: {certificate.student?.studentId || "N/A"}
              </p>
            </div>

            <p className="text-xl mb-3 font-medium">đã hoàn thành khóa học</p>

            <h4 className="text-4xl font-bold text-blue-700 mb-6 px-12">
              {certificate.courseName}
            </h4>
          </div>

          {/* Footer - Compact layout */}
          <div className="mt-auto">
            <div className="border-t-2 border-blue-900 pt-6">
              <div className="flex items-center justify-between">
                {/* Left - Issuer */}
                <div className="flex-1 text-left">
                  <div className="border-b-2 border-blue-900 mb-2 w-32"></div>
                  <p className="text-sm font-semibold text-gray-700">
                    NGƯỜI PHÁT HÀNH
                  </p>
                  {certificate.issuerAddress && (
                    <p className="text-xs text-gray-600 mt-1 font-mono">
                      {certificate.issuerAddress}
                    </p>
                  )}
                </div>

                {/* Center - QR Code */}
                {verificationUrl && (
                  <div className="border-3 border-blue-900 p-2 bg-white flex-shrink-0">
                    <QRCodeCanvas
                      value={verificationUrl}
                      size={100}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                )}

                {/* Right - Issue Date */}
                <div className="flex-1 text-right">
                  <div className="border-b-2 border-blue-900 mb-2 w-32 ml-auto"></div>
                  <p className="text-sm font-semibold text-gray-700">
                    NGÀY XÁC THỰC
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {certificate.issuedAt.toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Verification URL */}
              {verificationUrl && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-600 mb-1">Xác minh tại:</p>
                  <a 
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-700 hover:text-blue-900 underline underline-offset-2 break-all inline-block transition-colors"
                  >
                    {verificationUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* CertiChain Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Powered by{" "}
              <span className="font-bold text-blue-700">CertiChain</span> -
              Blockchain Verification System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

```

### src\components\CertificateForm.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { CreateCertificateRequest } from '@/src/types/certificate';
import { AlertCircle, BookOpen, FileText, Upload, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FilePreview } from './FilePreview';

interface Student {
  id: number;
  studentId: string;
  studentName: string;
}

interface CertificateFormProps {
  onSubmit: (data: CreateCertificateRequest) => void;
  isLoading?: boolean;
  progress?: number;
  className?: string;
}

export function CertificateForm({ 
  onSubmit, 
  isLoading = false, 
  progress = 0,
  className = "" 
}: CertificateFormProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseName: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch students list on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudentsError('Không thể tải danh sách sinh viên');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isImage: file.type.startsWith('image/'),
        isPDF: file.type === 'application/pdf'
      });
      setSelectedFile(file);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      console.log('File dropped:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isImage: file.type.startsWith('image/'),
        isPDF: file.type === 'application/pdf'
      });
      setSelectedFile(file);
    } else {
      console.log('Invalid file type dropped:', file?.type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && formData.studentName && formData.studentId && formData.courseName) {
      onSubmit({
        ...formData,
        file: selectedFile
      });
    }
  };

  const isFormValid = selectedFile && formData.studentName && formData.studentId && formData.courseName;

  return (
    <Card className={`w-full mx-auto bg-background/60 backdrop-blur-md border-border/50 shadow-lg-primary transition-all duration-500 ${className}`}>
      <CardHeader className="pb-4 pt-4 px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          Tạo chứng chỉ mới
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - File Upload */}
          <div className="space-y-3">
            <label className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              File chứng chỉ (PDF/Image)
            </label>
            
            {selectedFile ? (
              <FilePreview
                file={selectedFile}
                onRemove={handleFileRemove}
                onReplace={handleFileReplace}
                className="min-h-[250px]"
              />
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-lg text-center h-90 transition-all duration-300 cursor-pointer group min-h-[250px] flex items-center justify-center ${
                  dragActive 
                    ? 'border-primary bg-primary/10 scale-[1.02]' 
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload PDF or image file"
                />
                
                <div className="space-y-3 w-full">
                  <Upload className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  <p className="text-sm md:text-base">
                    Kéo thả file vào đây hoặc{' '}
                    <span className="text-primary font-semibold underline decoration-2 underline-offset-2">chọn file</span>
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Chấp nhận PDF hoặc hình ảnh (JPG, PNG), tối đa 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-4 md:space-y-6 flex flex-col">
            {/* Student Selection */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Chọn sinh viên
              </label>
              
              {isLoadingStudents ? (
                <div className="h-10 md:h-11 rounded-md border bg-muted animate-pulse flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Đang tải...</span>
                </div>
              ) : studentsError ? (
                <div className="p-3 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs text-red-600">{studentsError}</span>
                </div>
              ) : (
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => {
                    const student = students.find(s => s.studentId === value);
                    if (student) {
                      setFormData(prev => ({
                        ...prev,
                        studentId: student.studentId,
                        studentName: student.studentName
                      }));
                      setSearchQuery('');
                      setIsSelectOpen(false);
                    }
                  }}
                  open={isSelectOpen}
                  onOpenChange={setIsSelectOpen}
                >
                  <SelectTrigger className="h-10 md:h-11">
                    <SelectValue placeholder="Tìm kiếm sinh viên..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 sticky top-0 bg-popover z-10">
                      <input
                        type="text"
                        placeholder="Tìm theo tên hoặc mã sinh viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredStudents.length === 0 ? (
                        <div className="p-3 text-sm text-center text-muted-foreground">
                          {searchQuery ? 'Không tìm thấy sinh viên' : 'Không có sinh viên nào'}
                        </div>
                      ) : (
                        filteredStudents.map((student) => (
                          <SelectItem key={student.id} value={student.studentId}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{student.studentName}</span>
                              <span className="text-xs text-muted-foreground">({student.studentId})</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Course Information */}
            <div className="space-y-2">
              <label className="text-sm md:text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Tên khóa học
              </label>
              <Textarea
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="Nhập tên khóa học hoặc chương trình đào tạo"
                rows={3}
                className="text-sm md:text-base resize-none"
                required
              />
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex justify-between text-sm md:text-base font-medium">
                  <span className="text-foreground">Đang xử lý...</span>
                  <span className="text-primary font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </div>
            )}

            {/* Submit Button - Styled with gradient blue glass effect */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full h-11 md:h-12 text-sm text-white md:text-base font-semibold btn-hover-lift bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                'Tạo chứng chỉ'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

```

### src\components\CertificateList.tsx

```tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Pagination } from "@/src/components/ui/pagination";
import { Certificate } from "@/src/types/certificate";
import { GraduationCap, Search } from "lucide-react";
import { useState } from "react";
import { CertificateCard } from "./CertificateCard";

interface CertificateListProps {
  certificates: Certificate[];
  onView?: (certificate: Certificate) => void;
  onRegister?: (certificate: Certificate) => void;
  onCopy?: (hash: string) => void;
  className?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export function CertificateList({
  certificates,
  onView,
  onRegister,
  onCopy,
  className = "",
  pagination,
  onPageChange,
}: CertificateListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "pending"
  >("all");

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.student?.studentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || cert.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const verifiedCount = certificates.filter(
    (c) => c.status === "verified"
  ).length;
  const pendingCount = certificates.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Danh sách chứng chỉ</h2>
            <p className="text-sm text-muted-foreground">
              {certificates.length} chứng chỉ • {verifiedCount} đã xác thực •{" "}
              {pendingCount} chờ xác thực
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên sinh viên, khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            Tất cả ({certificates.length})
          </Button>
          <Button
            variant={filterStatus === "verified" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("verified")}
          >
            Đã xác thực ({verifiedCount})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Chờ xác thực ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Certificate Grid */}
      {filteredCertificates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => onView?.(certificate)}
                onRegister={() => onRegister?.(certificate)}
                onCopy={() => onCopy?.(certificate.fileHash)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              className="mt-6"
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterStatus !== "all"
                ? "Không tìm thấy chứng chỉ"
                : "Chưa có chứng chỉ nào"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Bắt đầu tạo chứng chỉ đầu tiên của bạn"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button>Tạo chứng chỉ đầu tiên</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```

### src\components\CTA.tsx

```tsx
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { GraduationCap, Shield } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern - Concentric circles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,theme(colors.primary-foreground/10)_1px,transparent_1px),radial-gradient(circle_at_80%_80%,theme(colors.primary-foreground/10)_1px,transparent_1px)] [background-size:40px_40px,60px_60px]" />
        
        {/* Animated rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary-foreground/10 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary-foreground/15 rounded-full animate-ping [animation-duration:4s] [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary-foreground/20 rounded-full animate-ping [animation-duration:5s] [animation-delay:2s]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl animate-pulse [animation-delay:0s]" />
        <div className="absolute top-32 right-32 w-32 h-32 bg-primary-foreground/8 rounded-full blur-2xl animate-pulse [animation-delay:1.5s]" />
        <div className="absolute bottom-24 left-1/3 w-20 h-20 bg-primary-foreground/6 rounded-full blur-lg animate-pulse [animation-delay:3s]" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/5 via-transparent to-primary-foreground/10" />
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Tham gia hàng ngàn trường học và doanh nghiệp đã tin tưởng CertiChain 
          để quản lý chứng chỉ một cách minh bạch và hiệu quả.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" variant="secondary">
            <Link href="/dashboard">
              <GraduationCap className="mr-2 h-5 w-5" />
              Dành cho nhà trường
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link href="/verify">
              <Shield className="mr-2 h-5 w-5" />
              Xác minh như khách (không cần tài khoản)
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-80">Chứng chỉ đã phát hành</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-80">Trường học tham gia</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-sm opacity-80">Độ chính xác xác thực</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

```

### src\components\dashboard\CertificateListSection.tsx

```tsx
'use client';

import { CertificateCard } from '@/src/components/CertificateCard';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Pagination } from '@/src/components/ui/pagination';
import { Certificate } from '@/src/types/certificate';
import { FileText, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CertificateListSectionProps {
  certificates: Certificate[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  onRegisterOnChain?: (certificateId: string) => void;
  registeringIds?: Set<string>;
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function CertificateListSection({
  certificates,
  pagination,
  isLoading,
  error,
  onPageChange,
  limit,
  setLimit,
  onRegisterOnChain,
  registeringIds = new Set(),
  title = 'Danh sách chứng chỉ',
  description = 'Danh sách các chứng chỉ',
  emptyMessage = 'Không có chứng chỉ nào',
}: CertificateListSectionProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Client-side filtering based on status
  const filteredCertificates = statusFilter === 'all'
    ? certificates
    : certificates.filter(cert =>
        statusFilter === 'verified' ? cert.status === 'verified' : cert.status === 'pending'
      );

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      {/* Background effects - Nhẹ nhàng */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
        <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gradient-to-br from-primary/15 via-blue-400/10 to-purple-400/8 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-500/15 via-fuchsia-400/10 to-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400/8 to-blue-500/8 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {/* Filter & Pagination Controls */}
          {pagination && (
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border-2 border-white/60 dark:border-white/30 shadow-lg rounded-lg px-3 py-2">
              <div className="flex items-center gap-3">
                {/* Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-white/50 dark:hover:bg-white/10"
                    >
                      <Filter className="h-4 w-4 mr-1.5" />
                      Lọc
                      {statusFilter !== 'all' && (
                        <Badge className="ml-1.5 bg-primary/90 text-white text-xs px-1.5 py-0 h-4">1</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'verified' | 'pending')}>
                      <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="verified">Đã xác thực</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pending">Chờ xác thực</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Số lượng/trang</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); onPageChange(1); }}>
                      <DropdownMenuRadioItem value="5">5 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="10">10 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="20">20 mục</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="50">50 mục</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Divider */}
                <div className="h-6 w-px bg-white/40 dark:bg-white/20" />

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                  className="m-0"
                />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Đang tải danh sách chứng chỉ...</div>
        )}
        {error && (
          <div className="text-sm text-red-600">Không thể tải chứng chỉ. Vui lòng thử lại.</div>
        )}
        {!isLoading && !error && filteredCertificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
            {statusFilter !== 'all' && <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => router.push(`/certificates/${certificate.id}`)}
                onRegister={onRegisterOnChain && certificate.status === 'pending' ? () => onRegisterOnChain(certificate.id.toString()) : undefined}
                isRegistering={registeringIds.has(certificate.id.toString())}
                onCopy={() => {
                  navigator.clipboard.writeText(certificate.fileHash);
                  alert('Đã copy hash!');
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

### src\components\dashboard\HolderDashboard.tsx

```tsx
'use client';

import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { FileText, Share2 } from 'lucide-react';
import { CertificateListSection } from './CertificateListSection';

export function HolderDashboard() {
  const { certificates, pagination, isLoading, error, setPage, limit, setLimit } = useCertificates(1, 10);
  
  // Filter certificates for current user (in real app, this would be based on user context)
  const myCertificates = certificates || [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
          <p className="text-destructive">Lỗi khi tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Chứng chỉ của tôi</h1>
        <p className="text-muted-foreground">
          Xem và quản lý các chứng chỉ đã được cấp
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chứng chỉ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCertificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Đã được cấp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <Badge variant="default" className="w-fit">Verified</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {myCertificates.filter(c => c.status === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Trên blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có thể chia sẻ</CardTitle>
            <Share2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{myCertificates.length}</div>
            <p className="text-xs text-muted-foreground">
              Link & QR Code
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Certificates */}
      <CertificateListSection
        certificates={myCertificates}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        limit={limit}
        setLimit={setLimit}
        title="Danh sách chứng chỉ"
        description="Các chứng chỉ đã được cấp cho bạn"
        emptyMessage="Liên hệ nhà trường để được cấp chứng chỉ"
      />

      {/* Verification Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn xác minh</CardTitle>
          <CardDescription>
            Cách nhà tuyển dụng có thể xác minh chứng chỉ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>• Chia sẻ link xác minh hoặc QR code với nhà tuyển dụng</p>
            <p>• Nhà tuyển dụng sẽ truy cập link để xác minh tính hợp lệ</p>
            <p>• Kết quả xác minh sẽ hiển thị thông tin chi tiết và trạng thái</p>
            <p>• Tất cả dữ liệu được lưu trữ an toàn trên blockchain</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```

### src\components\dashboard\IssuerDashboard.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useCertificates } from '@/src/hooks/useCertificates';
import { api } from '@/src/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CertificateListSection } from './CertificateListSection';

export function IssuerDashboard() {
  const { certificates, allCertificates, pagination, isLoading, error, setPage, limit, setLimit } = useCertificates(1, 10);
  const queryClient = useQueryClient();
  const [registeringIds, setRegisteringIds] = useState<Set<string>>(new Set());

  // Statistics
  const totalCertificates = pagination?.total || allCertificates.length;
  const verifiedCount = allCertificates.filter(c => c.status === 'verified').length;
  const pendingCount = allCertificates.filter(c => c.status === 'pending').length;
  const verificationRate = verifiedCount + pendingCount > 0 
    ? Math.round((verifiedCount / (verifiedCount + pendingCount)) * 100) 
    : 0;

  const handleRegisterOnChain = async (certificateId: string) => {
    try {
      setRegisteringIds(prev => new Set(prev).add(certificateId));
      
      const response = await api.certificates.register(certificateId);
      
      // Refresh certificates list
      await queryClient.invalidateQueries({ queryKey: ['certificates'] });
      
      alert(`✅ Đăng ký thành công!\n\nTransaction Hash: ${response.txHash}`);
    } catch (error) {
      let errorMessage = 'Không thể đăng ký chứng chỉ lên blockchain.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setRegisteringIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(certificateId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Nhà trường</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả chứng chỉ đã phát hành
          </p>
        </div>
        <Link href="/certificates/create">
          <Button 
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Tạo chứng chỉ mới
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chứng chỉ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Đã phát hành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác thực</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground">
              Trên blockchain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xác thực</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Cần đăng ký on-chain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ xác thực</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{verificationRate}%</div>
            <p className="text-xs text-muted-foreground">
              Hiệu quả xác thực
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates */}
      <CertificateListSection
        certificates={certificates}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={setPage}
        limit={limit}
        setLimit={setLimit}
        onRegisterOnChain={handleRegisterOnChain}
        registeringIds={registeringIds}
        title="Danh sách chứng chỉ"
        description="Danh sách các chứng chỉ đã tạo và trạng thái của chúng"
        emptyMessage="Không có chứng chỉ nào"
      />
    </div>
  );
}

```

### src\components\Features.tsx

```tsx
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { CheckCircle, Database, Globe, Lock, Shield, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Chống giả mạo',
      description: 'Chứng chỉ được xác thực công khai bằng hash và CID, không thể sửa đổi hay xoá bỏ.',
      badge: 'Bảo mật'
    },
    {
      icon: Zap,
      title: 'Xác minh tức thì (guest)',
      description: 'Nhà tuyển dụng truy cập /verify hoặc quét QR, hệ thống tự kiểm tra on-chain — không cần đăng nhập.',
      badge: 'Hiệu quả'
    },
    {
      icon: Globe,
      title: 'Minh bạch & phi tập trung',
      description: 'Không phụ thuộc vào cơ sở dữ liệu riêng của trường — bất kỳ ai cũng có thể xác thực trên blockchain.',
      badge: 'Minh bạch'
    },
    {
      icon: Database,
      title: 'Dễ tích hợp',
      description: 'Có thể nhúng link xác thực vào LMS, CV điện tử, hoặc ứng dụng HR.',
      badge: 'Linh hoạt'
    },
    {
      icon: Lock,
      title: 'Chi phí thấp',
      description: 'Nhà trường chỉ tốn phí on-chain 1 lần duy nhất khi phát hành.',
      badge: 'Tiết kiệm'
    },
    {
      icon: CheckCircle,
      title: 'Kiểm chứng công khai',
      description: 'Toàn bộ quy trình vận hành dựa trên Blockchain và IPFS, đảm bảo tính bất biến.',
      badge: 'Đáng tin cậy'
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern - Diagonal stripes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-60 [background:linear-gradient(45deg,theme(colors.primary/8)_25%,transparent_25%,transparent_75%,theme(colors.primary/8)_75%),linear-gradient(-45deg,theme(colors.primary/8)_25%,transparent_25%,transparent_75%,theme(colors.primary/8)_75%)] [background-size:20px_20px]" />
        
        {/* Larger geometric shapes */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary/15 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-40 right-20 w-20 h-20 bg-blue-400/25 rounded-lg rotate-45 blur-sm animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-purple-400/20 rounded-full blur-sm animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-fuchsia-400/25 rounded-lg rotate-12 blur-sm animate-pulse [animation-delay:0.5s]" />
        
        {/* Additional pattern overlay */}
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_25%_25%,theme(colors.blue-400/10)_2px,transparent_2px)] [background-size:40px_40px]" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-400/8" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tại sao chọn CertiChain?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Giải pháp toàn diện cho việc quản lý và xác thực chứng chỉ trong thời đại số
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="h-full bg-background/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="opacity-80">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base opacity-90">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

```

### src\components\FilePreview.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { FileText, Image as ImageIcon, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Dynamic import PDF.js only on client-side
let pdfjs: typeof import('pdfjs-dist') | null = null;

// Initialize PDF.js worker only on client-side
const initializePdfJs = async () => {
  if (typeof window !== 'undefined' && !pdfjs) {
    pdfjs = await import('pdfjs-dist');
    // Use legacy worker to avoid DOMMatrix issues
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.legacy.min.mjs';
  }
  return pdfjs;
};

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onReplace: () => void;
  className?: string;
}

export function FilePreview({ file, onRemove, onReplace, className = "" }: FilePreviewProps) {
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [pdfThumbnail, setPdfThumbnail] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  console.log('FilePreview - File info:', {
    name: file.name,
    type: file.type,
    size: file.size,
    isPDF,
    isImage
  });

  // Generate real PDF thumbnail using PDF.js
  const generatePdfThumbnail = useCallback(async () => {
    try {
      setIsGeneratingThumbnail(true);
      console.log('Starting PDF thumbnail generation...');
      
      // Initialize PDF.js dynamically
      const pdfjsLib = await initializePdfJs();
      if (!pdfjsLib) {
        throw new Error('Failed to initialize PDF.js');
      }
      
      console.log('PDF.js version:', pdfjsLib.version);
      console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
      
      // Convert file to ArrayBuffer
      console.log('Converting file to ArrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer size:', arrayBuffer.byteLength);
      
      // Load PDF document
      console.log('Loading PDF document...');
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully');
      
      // Get first page
      console.log('Getting first page...');
      const page = await pdf.getPage(1);
      console.log('Page loaded');
      
      // Set up canvas with proper scale
      const scale = 1.0; // Start with smaller scale for testing
      const viewport = page.getViewport({ scale });
      console.log('Viewport size:', viewport.width, 'x', viewport.height);
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Limit canvas size to prevent memory issues
      const maxWidth = 400;
      const maxHeight = 600;
      const actualScale = Math.min(
        maxWidth / viewport.width,
        maxHeight / viewport.height,
        scale
      );
      
      const scaledViewport = page.getViewport({ scale: actualScale });
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      console.log('Canvas size:', canvas.width, 'x', canvas.height);
      
      if (context) {
        // Set white background
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Render page to canvas
        console.log('Rendering page to canvas...');
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        };
        
        await page.render(renderContext).promise;
        console.log('Page rendered successfully');
        
        // Convert to data URL
        const thumbnailDataUrl = canvas.toDataURL('image/png', 0.8);
        setPdfThumbnail(thumbnailDataUrl);
        console.log('PDF thumbnail generated successfully, size:', thumbnailDataUrl.length);
      } else {
        throw new Error('Could not get canvas context');
      }
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      console.error('Error details:', error);
      
      // Fallback: create a simple PDF icon preview
      console.log('Creating fallback PDF preview...');
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 400;
        
        if (ctx) {
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Border
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          
          // PDF icon area
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(20, 20, canvas.width - 40, 60);
          
          // "PDF" text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('PDF', canvas.width / 2, 55);
          
          // Document lines
          ctx.fillStyle = '#6b7280';
          for (let i = 0; i < 12; i++) {
            const y = 100 + i * 20;
            const width = Math.random() * 120 + 100;
            ctx.fillRect(40, y, width, 6);
          }
          
          const fallbackDataUrl = canvas.toDataURL('image/png');
          setPdfThumbnail(fallbackDataUrl);
          console.log('Fallback PDF preview created');
        }
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        setPdfThumbnail('');
      }
    } finally {
      setIsGeneratingThumbnail(false);
    }
  }, [file]);

  // Create preview URL for images using FileReader
  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          console.log('FileReader loaded data URL');
          setPreviewUrl(result);
        }
      };
      reader.onerror = () => {
        console.error('FileReader error');
      };
      reader.readAsDataURL(file);
    } else if (isPDF) {
      // Generate PDF thumbnail
      generatePdfThumbnail();
    }
  }, [file, isImage, isPDF, generatePdfThumbnail]);

  // No cleanup needed for data URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        console.log('Cleaning up preview URL');
        setPreviewUrl('');
      }
    };
  }, [previewUrl]);

  return (
    <div className={`relative border-2 border-primary/30 rounded-lg bg-background/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${className}`}>
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={onReplace}
          className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border border-gray-300 shadow-xl transition-all duration-200 hover:scale-105"
          title="Chọn file khác"
        >
          <RotateCcw className="h-3 w-3 text-gray-700" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemove}
          className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 shadow-xl transition-all duration-200 hover:scale-105"
          title="Xóa file"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>

      {/* Preview Content */}
      <div className="space-y-3">
        {/* Preview Area */}
        <div className="min-h-[200px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/30">
          {isImage && previewUrl ? (
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[300px] object-contain rounded-md shadow-sm"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onLoad={() => {
                  console.log('Image loaded successfully:', previewUrl);
                }}
                onError={(e) => {
                  console.error('Failed to load image preview:', e);
                  console.error('Preview URL:', previewUrl);
                }}
              />
            </div>
          ) : isPDF ? (
            <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4">
              {isGeneratingThumbnail ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm font-medium text-foreground">Đang tạo thumbnail...</p>
                </div>
              ) : pdfThumbnail ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pdfThumbnail}
                    alt="PDF Thumbnail"
                    className="max-w-full max-h-[300px] object-contain rounded-md shadow-lg border border-border/20"
                  />
                  <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                    PDF
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <FileText className="h-16 w-16 text-primary mb-4" />
                  <p className="text-sm font-medium text-foreground">PDF Thumbnail</p>
                  <p className="text-xs text-muted-foreground mt-1">Đang tạo thumbnail...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground">File Preview</p>
              <p className="text-xs text-muted-foreground mt-1">Không thể xem trước file này</p>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="space-y-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            {isPDF ? (
              <FileText className="h-4 w-4 text-primary" />
            ) : (
              <ImageIcon className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>Loại: {file.type || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### src\components\Footer.tsx

```tsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { Github, GraduationCap, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CertiChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hệ thống xác thực chứng chỉ dựa trên blockchain, 
              kết hợp IPFS để lưu trữ và Ethereum Sepolia để xác minh.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link href="/certificates/create" className="text-muted-foreground hover:text-primary">
                    Tạo chứng chỉ
                  </Link>
                </li>
              )}
              <li>
                <Link href="/verify" className="text-muted-foreground hover:text-primary">
                  Xác minh
                </Link>
              </li>
            </ul>
          </div>

          {/* Actors */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Đối tượng sử dụng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🏫 Nhà trường (Issuer)</li>
              <li>👩‍🎓 Sinh viên (Holder)</li>
              <li>🏢 Nhà tuyển dụng (Guest Verify)</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kết nối</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 CertiChain. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

```

### src\components\GlobalLogoutOverlay.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';

export function GlobalLogoutOverlay() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleLogoutStart = () => {
      setIsRedirecting(true);
    };

    // Listen for custom logout event
    window.addEventListener('logout:start', handleLogoutStart);

    return () => {
      window.removeEventListener('logout:start', handleLogoutStart);
    };
  }, []);

  if (!isRedirecting) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* Background decorative shapes - matching Hero design */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft radial gradient overlay */}
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
        {/* Top-left blurred circle */}
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
        {/* Bottom-right blurred circle */}
        <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
      {/* Loading content */}
      <div className="text-center px-6 max-w-md relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-gradient-primary mb-4">CertiChain</h2>
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-lg text-muted-foreground">Đang đăng xuất...</p>
      </div>
    </div>
  );
}


```

### src\components\Header.tsx

```tsx
'use client';

import { UserMenu } from '@/src/components/UserMenu';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/hooks/useAuth';
import { GraduationCap, Home, LayoutDashboard, Menu, PlusCircle, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { roleContext } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', roles: ['issuer', 'holder'], icon: Home },
    { name: 'Dashboard', href: '/dashboard', roles: ['issuer', 'holder'], icon: LayoutDashboard },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', roles: ['issuer'], icon: PlusCircle },
    { name: 'Xác minh', href: '/verify', roles: ['issuer', 'holder'], icon: ShieldCheck },
  ];

  // Always show Home + Verify links (public), filter rest based on role
  const homeLink = allNavigation[0];
  const verifyLink = allNavigation[3]; // Xác minh - always public
  const protectedNavigation = allNavigation.slice(1, 3); // Dashboard, Tạo chứng chỉ
  
  const filteredProtectedNavigation = roleContext 
    ? protectedNavigation.filter(item => item.roles.includes(roleContext.role))
    : [];
  
  const navigation = roleContext 
    ? [homeLink, ...filteredProtectedNavigation, verifyLink]
    : [homeLink, verifyLink]; // Always show home + verify even when not authenticated

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6 flex justify-between h-16 items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertiChain</span>
          </Link>
        </div>

        {/* Right: Desktop Navigation + User Menu + Mobile Menu Button */}
        <div className="flex items-center space-x-6">
          {/* Full Navigation for large screens */}
          <nav className="hidden lg:flex items-center space-x-8 flex-nowrap">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-link whitespace-nowrap flex items-center gap-2 ${isActive ? 'active' : ''}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Compact Navigation for medium screens (icons only with text on hover) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-2 flex-nowrap">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`navbar-link-compact group relative flex items-center ${isActive ? 'active' : ''}`}
                  title={item.name}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {/* Text appears on hover as tooltip */}
                  <span className="navbar-text-hover absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-background border rounded-md shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu - always visible on desktop */}
          <div className="hidden md:flex">
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
          <nav className="container px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-3 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {/* User Menu in mobile */}
            <div className="border-t pt-3 mt-3">
              <div className="px-3">
                <UserMenu />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

```

### src\components\Hero.tsx

```tsx
import { Badge } from '@/src/components/ui/badge';
import { GraduationCap, Shield, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 bg-background flex items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft radial gradient overlay */}
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />

        {/* Top-left blurred circle */}
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />

        {/* Bottom-right blurred circle */}
        <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">
        <Badge variant="secondary" className="mb-4 bg-primary text-primary-foreground shadow-primary">
          🚀 Blockchain + IPFS 2025
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-vietnamese leading-tight">
          Hệ thống xác thực chứng chỉ
          <br />
          <span className="text-gradient-primary font-bold">dựa trên blockchain</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          CertiChain kết hợp IPFS để lưu trữ và Base Sepolia để xác minh, 
          đảm bảo tính minh bạch, bất biến và không thể giả mạo.
        </p>

        {/* Action buttons removed as requested */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">🏫 Nhà trường</h3>
            <p className="text-muted-foreground text-vietnamese">
              Tạo và phát hành chứng chỉ kỹ thuật số minh bạch
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">👩‍🎓 Sinh viên</h3>
            <p className="text-muted-foreground text-vietnamese">
              Chia sẻ chứng chỉ dễ dàng với link hoặc QR code
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">🏢 Nhà tuyển dụng</h3>
            <p className="text-muted-foreground text-vietnamese">
              Xác minh chứng chỉ độc lập, không cần liên hệ trường
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

```

### src\components\Layout.tsx

```tsx
'use client';

import { Footer } from './Footer';
import { GlobalLogoutOverlay } from './GlobalLogoutOverlay';
import { Header } from './Header';
import { RoleRouteGuard } from './RoleRouteGuard';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalLogoutOverlay />
      <div className="min-h-screen flex flex-col w-full m-0 p-0">
        <Header />
        <RoleRouteGuard />
        <main className="flex-1 w-full m-0 p-0">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

```

### src\components\Login.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { ArrowLeft, Lock, Mail, Shield, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      // TODO: Implement forgot password functionality
      setError('Chức năng đặt lại mật khẩu sẽ được tích hợp sau');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        studentId,
        password,
        redirect: false, // Manual redirect
      });

      if (result?.error) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      } else if (result?.ok) {
        // Login successful - show redirecting state
        setIsRedirecting(true);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsForgotPassword(true);
    setError('');
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setEmail('');
    setError('');
  };

  // Show loading overlay when redirecting after successful login
  if (isRedirecting) {
    return (
      <section className="relative overflow-hidden px-6 bg-background flex items-center justify-center min-h-[calc(100vh-16rem)] py-20">
        {/* Background decorative shapes - matching Hero design */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Soft radial gradient overlay */}
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />
          {/* Top-left blurred circle */}
          <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />
          {/* Bottom-right blurred circle */}
          <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        {/* Loading content */}
        <div className="text-center px-6 max-w-md relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-gradient-primary mb-4">CertiChain</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-lg text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 bg-background flex items-center justify-center min-h-[calc(100vh-16rem)] py-20">
      {/* Background decorative shapes - matching Hero design */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft radial gradient overlay */}
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />

        {/* Top-left blurred circle */}
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />

        {/* Bottom-right blurred circle */}
        <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="container mx-auto px-6 w-full max-w-md relative z-10">
        {/* Title */}
        <div className="text-center mb-8 transition-all duration-500">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 text-vietnamese transition-all duration-500 ${
            isForgotPassword ? 'transform scale-95 opacity-90' : ''
          }`}>
            {isForgotPassword ? 'Đặt lại mật khẩu' : 'Đăng nhập'}
          </h1>
          <p className="text-muted-foreground text-vietnamese transition-all duration-500">
            {isForgotPassword 
              ? 'Nhập email của bạn để nhận link đặt lại mật khẩu' 
              : 'Hệ thống xác thực chứng chỉ dựa trên blockchain'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg-primary transition-all duration-500">
          <CardHeader className="transition-all duration-500">
            <CardTitle className="text-2xl text-center transition-all duration-500">
              {isForgotPassword ? 'Đặt lại mật khẩu' : 'Chào mừng trở lại'}
            </CardTitle>
            <CardDescription className="text-center transition-all duration-500">
              {isForgotPassword 
                ? 'Chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn' 
                : 'Nhập thông tin tài khoản để tiếp tục'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isForgotPassword ? (
              // Login Form
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Username Field */}
                <div className="space-y-2 transition-all duration-500">
                  <label htmlFor="studentId" className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Tên đăng nhập
                  </label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2 transition-all duration-500">
                  <label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Mật khẩu
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold glass-primary text-white hover:opacity-95 shadow-primary hover:shadow-lg-primary transition-all border-0 disabled:opacity-50"
                  size="lg"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>
            ) : (
              // Forgot Password Form
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                {/* Email Field */}
                <div className="space-y-2 transition-all duration-500">
                  <label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold glass-primary text-white hover:opacity-95 shadow-primary hover:shadow-lg-primary transition-all border-0"
                  size="lg"
                >
                  Gửi link đặt lại mật khẩu
                </Button>
              </form>
            )}

            {/* Additional Links */}
            <div className="mt-6 space-y-3 transition-all duration-500">
              {!isForgotPassword && (
                <div className="text-center">
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
              
              {!isForgotPassword && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Hoặc
                    </span>
                  </div>
                </div>
              )}

              {!isForgotPassword && (
                <div className="flex items-center justify-center gap-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Xác minh chứng chỉ không cần đăng nhập
                  </span>
                </div>
              )}

              {isForgotPassword && (
                <div className="text-center">
                  <button
                    onClick={handleBackToLogin}
                    className="text-sm text-primary hover:underline font-medium flex items-center gap-2 mx-auto transition-all duration-200 hover:gap-3"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại đăng nhập
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


```

### src\components\Navigation.tsx

```tsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { cn } from '@/src/lib/utils';
import { Home, LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();
  const { roleContext } = useAuth();

  const allNavigation = [
    { name: 'Trang chủ', href: '/', description: 'Giới thiệu hệ thống', roles: ['issuer', 'holder'], icon: Home },
    { name: 'Dashboard', href: '/dashboard', description: 'Quản lý chứng chỉ', roles: ['issuer', 'holder'], icon: LayoutDashboard },
    { name: 'Tạo chứng chỉ', href: '/certificates/create', description: 'Tạo chứng chỉ mới', roles: ['issuer'], icon: PlusCircle },
    { name: 'Xác minh', href: '/verify', description: 'Xác minh chứng chỉ', roles: ['issuer', 'holder'], icon: ShieldCheck },
  ];

  // Always show Home + Verify links (public), filter rest based on role
  const homeLink = allNavigation[0];
  const verifyLink = allNavigation[3]; // Xác minh - always public
  const protectedNavigation = allNavigation.slice(1, 3); // Dashboard, Tạo chứng chỉ
  
  const filteredProtectedNavigation = roleContext 
    ? protectedNavigation.filter(item => item.roles.includes(roleContext.role))
    : [];
  
  const navigation = roleContext 
    ? [homeLink, ...filteredProtectedNavigation, verifyLink]
    : [homeLink, verifyLink]; // Always show home + verify even when not authenticated

  return (
    <nav className={cn('flex space-x-8', className)}>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`navbar-link ${isActive ? 'active' : ''} flex items-center gap-2`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

```

### src\components\Process.tsx

```tsx
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';
import { GraduationCap, Shield, Users } from 'lucide-react';

export function Process() {
  const steps = [
    {
      step: 1,
      title: 'Nhà trường phát hành',
      description: 'Upload file chứng chỉ, hệ thống tự động tạo hash và upload lên IPFS',
      icon: GraduationCap,
      details: [
        'Nhập thông tin sinh viên và khóa học',
        'Upload file PDF chứng chỉ',
        'Hệ thống sinh SHA-256 hash',
        'Upload lên IPFS → nhận CID',
        'Ghi lên blockchain Base Sepolia'
      ]
    },
    {
      step: 2,
      title: 'Sinh viên nhận chứng chỉ',
      description: 'Nhận link hoặc QR code để chia sẻ trong hồ sơ cá nhân',
      icon: Users,
      details: [
        'Nhận link công khai từ trường',
        'Copy link hoặc QR code',
        'Chèn vào CV, portfolio',
        'Không cần tài khoản hay ví',
        'Chia sẻ dễ dàng'
      ]
    },
    {
      step: 3,
      title: 'Nhà tuyển dụng xác minh',
      description: 'Quét QR hoặc truy cập link để xác minh tính hợp lệ',
      icon: Shield,
      details: [
        'Truy cập link hoặc quét QR',
        'Hệ thống kiểm tra on-chain',
        'Xác minh issuer và thông tin',
        'Hiển thị kết quả xác thực',
        'Xem file gốc trên IPFS'
      ]
    }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
    {/* Background Pattern - Dense dots (no hexagon) */}
      <div className="absolute inset-0 -z-10">
      {/* Dense dot grid (two layers offset to increase density) */}
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,theme(colors.primary/18)_1.5px,transparent_1.5px),radial-gradient(circle,theme(colors.primary/22)_1px,transparent_1px)] [background-size:24px_24px,24px_24px] [background-position:0_0,12px_12px]" />
        
        {/* Subtle wave gradients */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/6 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-24 bg-gradient-to-t from-blue-400/6 to-transparent" />
        
      {/* Floating elements */}
      <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-primary/30 rounded-full animate-pulse [animation-delay:0s]" />
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-400/40 rounded-full animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-purple-400/40 rounded-full animate-pulse [animation-delay:1s]" />
      <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-fuchsia-400/40 rounded-full animate-pulse [animation-delay:2.5s]" />
        
        {/* Light overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-blue-400/3" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quy trình hoạt động
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quy trình đơn giản, minh bạch và hiệu quả cho tất cả các bên liên quan
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-0 h-0 border-l-4 border-l-border border-t-4 border-t-transparent border-b-4 border-b-transparent -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-0 h-0 border-l-4 border-l-border border-t-4 border-t-transparent border-b-4 border-b-transparent -translate-y-1/2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <Badge variant="outline" className="mb-2 opacity-80">
                          Bước {step.step}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground opacity-90">{step.description}</p>
                      </div>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="opacity-90">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

```

### src\components\QRDisplay.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { copyToClipboard } from '@/src/lib/utils';
import { Copy, Download, Share2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';

interface QRDisplayProps {
  value: string;
  title?: string;
  description?: string;
  size?: number;
  className?: string;
}

export function QRDisplay({ 
  value, 
  title = "Mã QR chứng chỉ",
  description = "Quét mã QR để xác minh chứng chỉ",
  size = 200,
  className = ""
}: QRDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Get the QR code canvas element
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `certificate-qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Failed to download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chứng chỉ CertiChain',
          text: 'Xác minh chứng chỉ của tôi',
          url: value,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copy
      await handleCopy();
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-muted">
          <QRCodeCanvas
            value={value}
            size={size}
            level="M"
            includeMargin={true}
          />
        </div>

        {/* URL Display */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Link xác minh</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 break-all block transition-colors"
          >
            {value}
          </a>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Đang tải...' : 'Tải xuống'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

```

### src\components\RoleRouteGuard.tsx

```tsx
'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  issuer: '/dashboard',
  holder: '/dashboard',
};

function isAllowed(pathname: string, role: string) {
  const rules: Array<{ pattern: RegExp; roles: string[] }> = [
    { pattern: /^\/?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/login(\/.*)?$/, roles: ['issuer', 'holder'] }, // Login page is public
    { pattern: /^\/dashboard(\/.*)?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/certificates\/create(\/.*)?$/, roles: ['issuer'] },
    // Verify is public for all roles/guests, so always allowed
    { pattern: /^\/verify(\/.*)?$/, roles: ['issuer', 'holder'] },
    { pattern: /^\/certificates(\/.*)?$/, roles: ['issuer', 'holder'] },
  ];

  for (const rule of rules) {
    if (rule.pattern.test(pathname)) {
      return rule.roles.includes(role);
    }
  }
  return true;
}

/**
 * Role Route Guard - Navigates users based on their role
 * Note: This is a CLIENT-SIDE guard for UX. Real protection is in middleware.ts
 */
export function RoleRouteGuard() {
  const { roleContext, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !roleContext || !pathname) return;
    if (!isAllowed(pathname, roleContext.role)) {
      const redirectTo = ROLE_DEFAULT_ROUTE[roleContext.role] || '/';
      router.replace(redirectTo);
    }
  }, [isLoading, roleContext, pathname, router]);

  return null;
}



```

### src\components\RoleSwitcher.tsx

```tsx
'use client';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu';
import { useRole } from '@/src/hooks/useRole';
import { UserRole } from '@/src/types/role';
import { Building2, Cog, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

const ROLE_CONFIG = {
  issuer: {
    label: 'Nhà trường',
    icon: Building2,
    description: 'Tạo và quản lý chứng chỉ',
    color: 'bg-blue-100 text-blue-800',
  },
  holder: {
    label: 'Sinh viên',
    icon: User,
    description: 'Xem và chia sẻ chứng chỉ',
    color: 'bg-green-100 text-green-800',
  },
};

export function RoleSwitcher() {
  const { roleContext, switchRole } = useRole();

  if (!roleContext) return null;

  const currentRole = ROLE_CONFIG[roleContext.role];
  const CurrentIcon = currentRole.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md p-2"
        >
          <CurrentIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64" avoidCollisions={true}>
        {/* Account section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Tài khoản</p>
        </div>
        <DropdownMenuItem asChild className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <Cog className="h-4 w-4" />
          Cài đặt
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Role section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">Chuyển vai trò</p>
        </div>
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const RoleIcon = config.icon;
          const isActive = role === roleContext.role;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role as UserRole)}
              className="flex items-center gap-2 p-2.5 font-semibold text-foreground"
            >
              <RoleIcon className="h-4 w-4" />
              <span className="flex-1">{config.label}</span>
              {isActive && (
                <Badge variant="secondary" className="text-xs">Hiện tại</Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

```

### src\components\StatisticsCards.tsx

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Certificate } from '@/src/types/certificate';
import { CheckCircle, Clock, GraduationCap, TrendingUp } from 'lucide-react';

interface StatisticsCardsProps {
  certificates: Certificate[];
  className?: string;
}

export function StatisticsCards({ certificates, className = "" }: StatisticsCardsProps) {
  const totalCertificates = certificates.length;
  const verifiedCertificates = certificates.filter(c => c.status === 'verified').length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;
  const verificationRate = totalCertificates > 0 ? (verifiedCertificates / totalCertificates * 100).toFixed(1) : '0';

  const stats = [
    {
      title: 'Tổng chứng chỉ',
      value: totalCertificates,
      icon: GraduationCap,
      description: 'Đã phát hành',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Đã xác thực',
      value: verifiedCertificates,
      icon: CheckCircle,
      description: 'Trên blockchain',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      title: 'Chờ xác thực',
      value: pendingCertificates,
      icon: Clock,
      description: 'Cần đăng ký',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      title: 'Tỷ lệ xác thực',
      value: `${verificationRate}%`,
      icon: TrendingUp,
      description: 'Thành công',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

```

### src\components\ui\badge.tsx

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }


```

### src\components\ui\button.tsx

```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:border-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }


```

### src\components\ui\card.tsx

```tsx
import * as React from "react"

import { cn } from "@/src/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }


```

### src\components\ui\dropdown-menu.tsx

```tsx
"use client"

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "dropdown-content z-[9999] min-w-[10rem] overflow-hidden rounded-md p-1",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "dropdown-content z-[9999] min-w-[10rem] overflow-hidden rounded-md p-1",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "dropdown-item relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger
}


```

### src\components\ui\input.tsx

```tsx
import * as React from "react"

import { cn } from "@/src/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


```

### src\components\ui\navigation-menu.tsx

```tsx
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
    NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport
}


```

### src\components\ui\pagination.tsx

```tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0"
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="h-8 w-8 p-0"
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      {/* Page Info */}
      <span className="text-sm text-muted-foreground ml-4">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
}

```

### src\components\ui\progress.tsx

```tsx
import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }


```

### src\components\ui\select.tsx

```tsx
"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background backdrop-blur-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all hover:bg-background hover:border-primary/50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover backdrop-blur-xl text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 transition-all duration-200",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-primary/10 focus:text-primary focus:scale-[1.02] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-all duration-150 hover:bg-primary/10 hover:text-primary hover:scale-[1.02]",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue
}


```

### src\components\ui\separator.tsx

```tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }


```

### src\components\ui\textarea.tsx

```tsx
import * as React from "react"

import { cn } from "@/src/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }


```

### src\components\UserMenu.tsx

```tsx
"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/hooks/useAuth";
import { Building2, Cog, LogIn, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ROLE_CONFIG = {
  issuer: {
    label: "Nhà trường",
    icon: Building2,
    color: "bg-blue-100 text-blue-800",
  },
  holder: {
    label: "Sinh viên",
    icon: User,
    color: "bg-green-100 text-green-800",
  },
};

export function UserMenu() {
  const { roleContext, session, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Show minimal loading indicator when logging out
  if (isLoggingOut) {
    return (
      <div className="h-10 w-10 rounded-md bg-muted animate-pulse flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  // Show login button if not authenticated, but NOT on login page
  if (!isAuthenticated && !isLoading && !isLoginPage) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Đăng nhập
        </Link>
      </Button>
    );
  }

  // Don't show anything on login page if not authenticated
  if (!isAuthenticated && !isLoading && isLoginPage) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />;
  }

  // Show menu if authenticated
  if (!roleContext || !session) return null;

  const currentRole = ROLE_CONFIG[roleContext.role];
  const CurrentIcon = currentRole.icon;
  const UserBadge = currentRole.label;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Dispatch event to show global logout overlay
    window.dispatchEvent(new CustomEvent("logout:start"));
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="usermenu-trigger relative h-10 px-2 md:px-3 gap-2"
        >
          {/* Icon - shown on all screens */}
          <CurrentIcon className="h-5 w-5 flex-shrink-0" />

          {/* Desktop: Two-line layout with icon */}
          <div className="hidden md:flex flex-col items-start gap-0 leading-tight">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {UserBadge}
            </span>
            <span className="font-semibold text-sm">
              {session.user.studentId}
            </span>
          </div>

          {/* Mobile: Hide text, only show icon */}
          <span className="md:hidden sr-only">{session.user.studentId}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64"
        avoidCollisions={true}
        collisionPadding={8}
        sticky="always"
        onInteractOutside={(e) => {
          // Only close when clicking outside, not on scroll
          if (e.type === 'pointerdown') {
            return; // Allow default close behavior
          }
          e.preventDefault(); // Prevent close on other interactions like scroll
        }}
      >
        {/* Account section */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">
            Tài khoản
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {session.user.studentId}
          </p>
        </div>
        <DropdownMenuSeparator />

        {/* Role info */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-gradient-primary">
            Vai trò hiện tại
          </p>
          <div className="flex items-center gap-2 mt-1">
            <CurrentIcon className="h-4 w-4" />
            <span className="text-sm">{currentRole.label}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              Đang hoạt động
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem className="flex items-center gap-2 p-2.5 font-semibold text-foreground">
          <Cog className="h-4 w-4" />
          Cài đặt
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 p-2.5 font-semibold text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

```

### src\components\VerifyResult.tsx

```tsx
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatDate } from "@/src/lib/utils";
import { VerifyResult as VerifyResultType } from "@/src/types/certificate";
import {
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  Eye,
  GraduationCap,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VerifyResultProps {
  data: VerifyResultType;
  hash: string;
  className?: string;
}

export function VerifyResult({
  data,
  hash,
  className = "",
}: VerifyResultProps) {
  const isVerified = data.verified;
  const certificate = data.certificate;
  const router = useRouter();

  const handleViewCertificate = () => {
    if (certificate) router.push(`/certificates/view/${certificate.id}`);
  };

  // Invalid state (nicer card)
  if (!isVerified || !certificate) {
    return (
      <div className={`w-full ${className}`}>
        <Card className="border-red-200/50 bg-red-50/60 supports-[backdrop-filter]:bg-red-50/40 backdrop-blur-md">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-600 shadow-lg flex items-center justify-center">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-red-700">
                Chứng chỉ không hợp lệ
              </h3>
              <p className="text-sm text-red-600/80">
                Không tìm thấy thông tin tương ứng với mã đã nhập. Vui lòng kiểm
                tra lại transaction hash.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">
                Đã kiểm tra hash:
                <code className="ml-2 px-2 py-1 bg-white/70 rounded font-mono">
                  {hash}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid state (banner + glass details)
  return (
    <div className={`w-full ${className}`}>
      {/* Status banner */}
      <div className="mb-4 rounded-2xl p-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs opacity-90">Trạng thái xác minh</p>
              <h4 className="text-lg font-bold leading-tight">
                Chứng chỉ hợp lệ
              </h4>
            </div>
          </div>
          <Badge className="bg-white text-blue-600">Verified</Badge>
        </div>
      </div>

      {/* Details card */}
      <Card className="bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur-md border border-border/40 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Thông tin chứng chỉ</CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleViewCertificate}
                size="sm"
                className="gap-1.5"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Xem chứng chỉ</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Course Name - Prominent */}
          <div className="relative overflow-hidden rounded-lg p-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-primary/20 rounded-full blur-2xl -z-10" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Khóa học
                </h4>
              </div>
              <p className="text-lg font-bold text-foreground leading-tight mb-3">{certificate.courseName}</p>
              
              {/* Student & Date Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/20">
                <Badge className="gap-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-primary dark:text-primary-foreground border border-primary/30 py-1.5 px-3 backdrop-blur-sm">
                  <User className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    {certificate.student?.studentName || certificate.studentName || "N/A"}
                    {(certificate.student?.studentId || certificate.studentId) && (
                      <span className="opacity-75"> | {certificate.student?.studentId || certificate.studentId}</span>
                    )}
                  </span>
                </Badge>
                <Badge className="gap-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-primary dark:text-primary-foreground border border-primary/30 py-1.5 px-3 backdrop-blur-sm">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    {formatDate(certificate.issuedAt)}
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Transaction Hash Badge */}
          {(certificate.transactionHash || certificate.blockchainTx) && (
            <div className="bg-green-600 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Transaction Hash
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(certificate.transactionHash || certificate.blockchainTx || '')}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Badge 
                    className="bg-white/20 hover:bg-white/30 text-white border-0 py-1 px-2 cursor-pointer transition-colors gap-1"
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${
                          certificate.transactionHash || certificate.blockchainTx
                        }`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                    Etherscan
                  </Badge>
                </div>
              </div>
              <code className="text-xs text-white/90 break-all block font-mono">
                {certificate.transactionHash || certificate.blockchainTx}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footnote */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted-foreground">
          Kết quả xác minh được lấy từ blockchain Ethereum Sepolia
        </p>
      </div>
    </div>
  );
}

```

### src\hooks\useAuth.ts

```ts
'use client';

import { ROLE_PERMISSIONS, RoleContext, UserRole } from '@/src/types/role';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

/**
 * Custom hook that wraps NextAuth useSession and provides role context
 * Replaces the old useRole hook that used localStorage
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Map NextAuth role to UserRole
  const userRole = useMemo(() => {
    if (!session?.user?.role) return null;
    
    // Map ADMIN -> issuer, STUDENT -> holder
    const roleMap: Record<string, UserRole> = {
      ADMIN: 'issuer',
      STUDENT: 'holder',
    };
    
    return roleMap[session.user.role] || null;
  }, [session?.user?.role]);

  // Build role context
  const roleContext = useMemo<RoleContext | null>(() => {
    if (!isAuthenticated || !session?.user || !userRole) {
      return null;
    }

    return {
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole],
      userInfo: {
        name: session.user.studentId || '',
        organization: session.user.studentId || '',
        walletAddress: undefined, // Add wallet if needed later
      },
    };
  }, [isAuthenticated, session, userRole]);

  return {
    session,
    roleContext,
    isLoading,
    isAuthenticated,
    user: session?.user,
  };
}


```

### src\hooks\useCertificates.ts

```ts
import { api } from "@/src/lib/api";
import { useDataStore } from "@/src/state/data";
import { CreateCertificateRequest } from "@/src/types/certificate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useCertificates(initialPage = 1, initialLimit = 10) {
  const { searchTerm, filterStatus } = useDataStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const { data, isLoading, error } = useQuery({
    queryKey: ["certificates", page, limit],
    queryFn: () => api.certificates.getAll(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update Zustand store when data changes (only if not using pagination filtering)
  // Since we're using server-side pagination, we rely on data?.data directly
  const currentCertificates = data?.data || [];

  const filteredCertificates = currentCertificates.filter((cert) => {
    const matchesSearch =
      cert.student?.studentName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && cert.status === "verified") ||
      (filterStatus === "pending" && cert.status === "pending");
    return matchesSearch && matchesStatus;
  });

  return {
    certificates: filteredCertificates,
    allCertificates: currentCertificates, // Return all for statistics
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["certificates"] }),
  };
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: ["certificates", id],
    queryFn: () => api.certificates.getById(id),
    enabled: !!id,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const {
    /* addCertificate */
  } = useDataStore();

  return useMutation({
    mutationFn: (data: CreateCertificateRequest) => {
      // Convert CreateCertificateRequest to FormData
      const formData = new FormData();
      formData.append("studentName", data.studentName);
      formData.append("studentId", data.studentId);
      formData.append("courseName", data.courseName);
      formData.append("file", data.file);
      return api.certificates.create(formData);
    },
    onSuccess: () => {
      // Refresh certificates list; creation response is not a full Certificate entity
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

export function useRegisterCertificate() {
  const queryClient = useQueryClient();
  const { updateCertificate } = useDataStore();

  return useMutation({
    mutationFn: async (certificateId: string) => {
      // Backend API handles blockchain registration via ethers.js
      return api.certificates.register(certificateId);
    },
    onSuccess: (updatedCert) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      updateCertificate(updatedCert);
    },
  });
}

```

### src\hooks\useRole.ts

```ts
'use client';

import { ROLE_PERMISSIONS, RoleContext, UserRole } from '@/src/types/role';
import { useEffect, useState } from 'react';

// Mock function - trong thực tế sẽ lấy từ authentication context
const getCurrentUserRole = (): UserRole => {
  // Map legacy 'verifier' to guest flow: default to 'holder'
  const saved = localStorage.getItem('userRole');
  if (saved === 'verifier') return 'holder';
  if (saved === 'issuer' || saved === 'holder') return saved as UserRole;
  return 'issuer';
};

const getCurrentUserInfo = () => {
  // Mock user info - trong thực tế sẽ lấy từ auth context
  return {
    name: 'Trường Đại học ABC',
    organization: 'Đại học ABC',
    walletAddress: '0x1234...5678',
  };
};

export function useRole() {
  const [roleContext, setRoleContext] = useState<RoleContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = getCurrentUserRole();
    const userInfo = getCurrentUserInfo();
    const permissions = ROLE_PERMISSIONS[role];

    setRoleContext({
      role,
      permissions,
      userInfo,
    });
    setIsLoading(false);
  }, []);

  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' && e.newValue) {
        const newRole = e.newValue as UserRole;
        const userInfo = getCurrentUserInfo();
        const permissions = ROLE_PERMISSIONS[newRole];

        setRoleContext({
          role: newRole,
          permissions,
          userInfo,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom roleChanged events to force update within the same tab
  useEffect(() => {
    const handleRoleChanged = (e: Event) => {
      const detail = (e as CustomEvent<UserRole>).detail;
      if (detail) {
        const newRole = detail as UserRole;
        const userInfo = getCurrentUserInfo();
        const permissions = ROLE_PERMISSIONS[newRole];
        setRoleContext({
          role: newRole,
          permissions,
          userInfo,
        });
      }
    };

    window.addEventListener('roleChanged', handleRoleChanged as EventListener);
    return () => window.removeEventListener('roleChanged', handleRoleChanged as EventListener);
  }, []);

  const switchRole = (newRole: UserRole) => {
    localStorage.setItem('userRole', newRole);
    const userInfo = getCurrentUserInfo();
    const permissions = ROLE_PERMISSIONS[newRole];

    setRoleContext({
      role: newRole,
      permissions,
      userInfo,
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: newRole }));
  };

  return {
    roleContext,
    isLoading,
    switchRole,
  };
}

```

### src\hooks\useUpload.ts

```ts
import { useState } from 'react';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });

  const uploadFile = async (file: File): Promise<{ hash: string; ipfsHash: string }> => {
    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return { ...prev, progress: 90 };
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      
      // Generate mock hash and IPFS hash
      const hash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const ipfsHash = `Qm${Math.random().toString(16).substr(2, 64)}`;

      setUploadProgress({ progress: 100, status: 'success' });

      return { hash, ipfsHash };
    } catch (error) {
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
      throw error;
    }
  };

  const resetUpload = () => {
    setUploadProgress({ progress: 0, status: 'idle' });
  };

  return {
    uploadProgress,
    uploadFile,
    resetUpload
  };
}

```

### src\hooks\useVerify.ts

```ts
import { api } from '@/src/lib/api';
import { VerifyResult } from '@/src/types/certificate';
import { useQuery } from '@tanstack/react-query';

// Query keys
export const verifyKeys = {
  all: ['verify'] as const,
  verify: (hash: string) => [...verifyKeys.all, 'verify', hash] as const,
};

export function useVerifyCertificate(hash: string) {
  return useQuery({
    queryKey: verifyKeys.verify(hash),
    queryFn: async (): Promise<VerifyResult> => api.certificates.verify(hash),
    enabled: !!hash && hash.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

```

### src\lib\api.ts

```ts
import type { Certificate } from "@/src/types/certificate";

// API Certificate (Prisma) shape returned by our Next API
type ApiCertificate = {
  id: number;
  courseName: string;
  fileHash: string;
  ipfsCid: string;
  issuerAddress: string;
  blockchainTx: string | null;
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
    ipfsCid: apiCert.ipfsCid,
    issuerAddress: apiCert.issuerAddress,
    issuedAt: new Date(apiCert.issuedAt),
    status:
      apiCert.status === "verified"
        ? "verified"
        : apiCert.status === "failed"
        ? "failed"
        : "pending",
    blockchainTx: apiCert.blockchainTx ?? undefined,
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
      // { status, fileHash, ipfsCid, certificateId, ipfsUrl }
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

```

### src\lib\utils.ts

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
```

### src\state\data.ts

```ts
import { Certificate } from "@/src/types/certificate";
import { create } from "zustand";

interface DataState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  searchTerm: string;
  filterStatus: "all" | "verified" | "pending";
  setCertificates: (certs: Certificate[]) => void;
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (cert: Certificate) => void;
  removeCertificate: (id: string) => void;
  setSelectedCertificate: (cert: Certificate | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterStatus: (status: "all" | "verified" | "pending") => void;
  clearData: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  certificates: [],
  selectedCertificate: null,
  searchTerm: "",
  filterStatus: "all",
  setCertificates: (certs) => set({ certificates: certs }),
  addCertificate: (cert) =>
    set((state) => ({ certificates: [...state.certificates, cert] })),
  updateCertificate: (updatedCert) =>
    set((state) => ({
      certificates: state.certificates.map((cert) =>
        cert.id === updatedCert.id ? updatedCert : cert
      ),
      selectedCertificate:
        state.selectedCertificate?.id === updatedCert.id
          ? updatedCert
          : state.selectedCertificate,
    })),
  removeCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter(
        (cert) => cert.id.toString() !== id
      ),
      selectedCertificate:
        state.selectedCertificate?.id.toString() === id
          ? null
          : state.selectedCertificate,
    })),
  setSelectedCertificate: (cert) => set({ selectedCertificate: cert }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  clearData: () =>
    set({
      certificates: [],
      selectedCertificate: null,
      searchTerm: "",
      filterStatus: "all",
    }),
}));

```

### src\state\ui.ts

```ts
import { create } from 'zustand';

interface UIState {
  walletConnected: boolean;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  verificationResult: any;
  setWalletConnected: (connected: boolean) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'success' | 'error') => void;
  setVerificationResult: (result: any) => void;
}

export const useUIStore = create<UIState>((set) => ({
  walletConnected: false,
  uploadStatus: 'idle',
  verificationResult: null,
  setWalletConnected: (connected) => set({ walletConnected: connected }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  setVerificationResult: (result) => set({ verificationResult: result }),
}));
```

### src\types\certificate.ts

```ts
export interface Certificate {
  id: number; // ✅ Changed from string to number (matches Prisma Int)
  courseName: string;
  fileHash: string;
  ipfsCid: string; // ✅ Changed from ipfsHash to ipfsCid (matches schema)
  issuerAddress: string; // ✅ Changed from issuer to issuerAddress
  issuedAt: Date;
  status: "verified" | "pending" | "failed"; // ✅ Added "failed" status
  blockchainTx?: string; // ✅ Added blockchainTx field
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
  error?: string;
}

```

### src\types\pdfjs.d.ts

```ts
declare module 'pdfjs-dist' {
  export interface PageViewport {
    width: number;
    height: number;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PageViewport;
    render(renderContext: RenderParameters): {
      promise: Promise<void>;
    };
  }

  export interface PDFDocumentProxy {
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface LoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export interface RenderParameters {
    canvasContext: CanvasRenderingContext2D;
    viewport: PageViewport;
    canvas: HTMLCanvasElement;
  }

  export function getDocument(params: { data: ArrayBuffer }): LoadingTask;

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export const version: string;
}
```

### src\types\role.ts

```ts
export type UserRole = 'issuer' | 'holder';

export interface RolePermissions {
  canCreate: boolean;
  canViewAll: boolean;
  canVerify: boolean;
  canRegisterOnChain: boolean;
  canViewOwn: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  issuer: {
    canCreate: true,
    canViewAll: true,
    canVerify: false,
    canRegisterOnChain: true,
    canViewOwn: false,
  },
  holder: {
    canCreate: false,
    canViewAll: false,
    canVerify: false,
    canRegisterOnChain: false,
    canViewOwn: true,
  },
};

export interface RoleContext {
  role: UserRole;
  permissions: RolePermissions;
  userInfo?: {
    name: string;
    organization?: string;
    walletAddress?: string;
  };
}

```

### src\types\user.ts

```ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'issuer' | 'holder';
  walletAddress?: string;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### test-auth-simple.ts

```ts
/**
 * Test đơn giản: Verify user trong database
 * Chạy: npx tsx test-auth-simple.ts
 */

import "dotenv/config"; // Load environment variables
import { prisma } from "./lib/db";
import bcrypt from "bcrypt";

async function testUserLogin() {
  console.log("🔐 === TEST USER AUTHENTICATION ===\n");

  const testUsername = "httt22002";
  const testPassword = "sinooStu";
  const expectedHash =
    "$2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe";

  try {
    // 1. Tìm user trong database
    console.log("1️⃣ Searching for user:", testUsername);
    const user = await prisma.user.findFirst({
      where: { studentId: testUsername },
    });

    if (!user) {
      console.error("❌ User not found!");
      return;
    }

    console.log("✅ User found:");
    console.log("   - ID:", user.id);
    console.log("   - Username:", user.studentId);
    console.log("   - Role:", user.role);
    console.log("   - Password Hash:", user.passwordHash);

    // 2. Verify password hash matches
    console.log("\n2️⃣ Verifying password hash...");
    if (user.passwordHash === expectedHash) {
      console.log("✅ Password hash matches expected hash");
    } else {
      console.log("⚠️  Password hash is different from expected");
      console.log("   Expected:", expectedHash);
      console.log("   Got:", user.passwordHash);
    }

    // 3. Test bcrypt comparison với plain password
    console.log("\n3️⃣ Testing password verification with bcrypt...");
    const isPasswordValid = await bcrypt.compare(
      testPassword,
      user.passwordHash
    );

    if (isPasswordValid) {
      console.log("✅ Password verification SUCCESS!");
      console.log("   Plain password 'sinooStu' matches the hash");
    } else {
      console.log("❌ Password verification FAILED!");
      console.log("   Plain password 'sinooStu' does NOT match the hash");
    }

    // 4. Test với wrong password
    console.log("\n4️⃣ Testing with wrong password...");
    const wrongPasswordTest = await bcrypt.compare(
      "wrongpassword",
      user.passwordHash
    );

    if (!wrongPasswordTest) {
      console.log("✅ Wrong password correctly rejected");
    } else {
      console.log("❌ Wrong password was incorrectly accepted!");
    }

    // 5. Summary
    console.log("\n📊 === TEST SUMMARY ===");
    console.log("Username:", testUsername);
    console.log("Password:", testPassword);
    console.log(
      "Authentication:",
      isPasswordValid ? "✅ WOULD SUCCEED" : "❌ WOULD FAIL"
    );

    // 6. Lấy certificates của user này
    console.log("\n📜 Certificates for this user:");
    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        courseName: true,
        status: true,
        issuedAt: true,
      },
    });

    // search user by certificate id
    const userCerti = await prisma.user.findFirst({
      where: { certificates: { some: { id: certificates[0].id } } },
    });

    if (certificates.length > 0) {
      certificates.forEach((cert, index) => {
        console.log(
          `   ${index + 1}. ${userCerti?.studentName} - ${cert.courseName} (${
            cert.status
          })`
        );
      });
    } else {
      console.log("   No certificates found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Bonus: Test all seeded users
async function testAllUsers() {
  console.log("\n👥 === ALL USERS IN DATABASE ===\n");

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        studentId: true,
        role: true,
        passwordHash: true,
        _count: {
          select: { certificates: true },
        },
      },
    });

    console.log(`Found ${users.length} users:\n`);

    for (const user of users) {
      console.log(`🔹 ${user.studentId}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Certificates: ${user._count.certificates}`);
      console.log(`   Hash: ${user.passwordHash.substring(0, 20)}...`);

      // Test với password "sinooStu" cho students, "sinooAd" cho admin
      const testPass = user.role === "ADMIN" ? "sinooAd" : "sinooStu";
      const isValid = await bcrypt.compare(testPass, user.passwordHash);
      console.log(`   Test password "${testPass}": ${isValid ? "✅" : "❌"}`);
      console.log();
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
console.log("🚀 Starting Database Authentication Tests...\n");

testUserLogin()
  .then(() => testAllUsers())
  .then(() => {
    console.log("✅ All tests completed!");
  })
  .catch(console.error);

```

### test-auth.ts

```ts
/**
 * Test script đơn giản cho Login/Logout
 * Chạy: npx tsx test-auth.ts
 */

const BASE_URL = "http://localhost:3000";

interface LoginResponse {
  ok: boolean;
  status: number;
  url?: string;
  error?: string;
}

async function testLogin() {
  console.log("\n🔐 === TEST LOGIN ===");
  console.log("Username: httt22002");
  console.log("Password: sinooStu (raw password, not hash)");

  try {
    // Call NextAuth API
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "httt22002",
        password: "sinooStu",
        csrfToken: "", // NextAuth có thể cần CSRF token
        callbackUrl: `${BASE_URL}/dashboard`,
        json: true,
      }),
    });

    console.log("\n📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);

    // Lấy cookies
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("🍪 Cookies received:", cookies.substring(0, 100) + "...");
    }

    // Thử đọc response
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      console.log("📦 Response Data:", JSON.stringify(data, null, 2));
      return { ok: response.ok, status: response.status, cookies, data };
    } else {
      const text = await response.text();
      console.log("📄 Response Text:", text.substring(0, 200));
      return { ok: response.ok, status: response.status, cookies, text };
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

async function testLoginSimple() {
  console.log("\n🔐 === TEST LOGIN (Simple Form Data) ===");
  console.log("Username: httt22002");
  console.log("Password: sinooStu");

  try {
    // Sử dụng FormData như form HTML thông thường
    const formData = new URLSearchParams();
    formData.append("username", "httt22002");
    formData.append("password", "sinooStu");
    formData.append("callbackUrl", `${BASE_URL}/dashboard`);

    const response = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      redirect: "manual", // Không tự động redirect
    });

    console.log("\n📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);
    console.log("🔗 Redirect Location:", response.headers.get("location"));

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log(
        "🍪 Session Cookie:",
        cookies.includes("next-auth.session-token")
      );
    }

    return { ok: response.ok, status: response.status, cookies };
  } catch (error) {
    console.error("❌ Login Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

async function testGetSession(sessionToken?: string) {
  console.log("\n🔍 === TEST GET SESSION ===");

  try {
    const headers: Record<string, string> = {};
    if (sessionToken) {
      headers["Cookie"] = `next-auth.session-token=${sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/auth/session`, {
      method: "GET",
      headers,
    });

    console.log("📊 Response Status:", response.status);
    const data = await response.json();
    console.log("📦 Session Data:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("❌ Get Session Error:", error);
    return null;
  }
}

async function testLogout(sessionToken?: string) {
  console.log("\n🚪 === TEST LOGOUT ===");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers["Cookie"] = `next-auth.session-token=${sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/auth/signout`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        callbackUrl: `${BASE_URL}`,
      }),
    });

    console.log("📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("🍪 Cookie cleared:", cookies.includes("Max-Age=0"));
    }

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting Authentication Tests...");
  console.log("🌐 Server:", BASE_URL);
  console.log("\n⚠️  Make sure your Next.js server is running: npm run dev");

  // Test 1: Check if server is running
  try {
    const healthCheck = await fetch(BASE_URL);
    if (!healthCheck.ok) {
      console.error(
        "\n❌ Server is not responding. Please start the server first."
      );
      return;
    }
    console.log("✅ Server is running");
  } catch (error) {
    console.error(
      "\n❌ Cannot connect to server. Please start the server first:"
    );
    console.error("   Run: npm run dev");
    return;
  }

  // Test 2: Get session (should be empty/unauthenticated)
  await testGetSession();

  // Test 3: Try login
  await testLoginSimple();

  // Test 4: Alternative login method
  await testLogin();

  // Test 5: Get session after login (should have user data)
  // Note: Trong môi trường test như này, session cookie có thể không persist
  // Cần test qua browser hoặc tools như Postman để test đầy đủ
  console.log("\n⚠️  Note: Session cookies may not persist in this script.");
  console.log(
    "   For full testing, use browser or tools like Postman/Thunder Client"
  );

  // Test 6: Logout
  await testLogout();

  console.log("\n✅ All tests completed!");
  console.log("\n📝 Credentials used:");
  console.log("   Username: httt22002");
  console.log("   Password: sinooStu");
  console.log(
    "   Password Hash (in DB): $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe"
  );
}

// Run tests
runTests().catch(console.error);

```

### TEST_AUTH.md

```md
# 🔐 Authentication Testing Guide

## Test Files Created

### 1. `test-auth-simple.ts` - Database Authentication Test ✅ RECOMMENDED

Test trực tiếp với database để verify user credentials.

**Chạy:**

```bash
npx tsx test-auth-simple.ts
```

**Test cases:**

- ✅ Tìm user trong database
- ✅ Verify password hash
- ✅ Test bcrypt password comparison
- ✅ Test với wrong password
- ✅ Hiển thị certificates của user
- ✅ List tất cả users và test passwords

**Kết quả mong đợi:**

```
🔐 === TEST USER AUTHENTICATION ===

1️⃣ Searching for user: httt22002
✅ User found:
   - ID: 1
   - Username: httt22002
   - Role: STUDENT
   - Password Hash: $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe

2️⃣ Verifying password hash...
✅ Password hash matches expected hash

3️⃣ Testing password verification with bcrypt...
✅ Password verification SUCCESS!
   Plain password 'sinooStu' matches the hash

📊 === TEST SUMMARY ===
Username: httt22002
Password: sinooStu
Authentication: ✅ WOULD SUCCEED
```

---

### 2. `test-auth.ts` - API Authentication Test (Requires Server Running)

Test login/logout qua NextAuth API endpoints.

**Yêu cầu:**

- Server phải đang chạy: `npm run dev`
- Server listening trên `http://localhost:3000`

**Chạy:**

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run test
npx tsx test-auth.ts
```

**Test cases:**

- 🔍 Check server health
- 🔐 Test login via API
- 📊 Get session
- 🚪 Test logout

---

## Test Credentials

Tất cả users được seed vào database với credentials sau:

### Students

| Username | Password | Role | Password Hash (trong DB) |
|----------|----------|------|--------------------------|
| httt22001 | sinooStu | STUDENT | $2b$10$2oEteAp6ql86bgejjwb8genVUtpKurc9IPdRWwyQ3MYOFUI/qDNHq |
| httt22002 | sinooStu | STUDENT | $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe |
| httt22003 | sinooStu | STUDENT | $2b$10$u76/lZe7dojIrihn4LzDJ.CMZOe/BEPOFNVxwBzmex6T0FVdZOPH2 |

### Admin

| Username | Password | Role | Password Hash (trong DB) |
|----------|----------|------|--------------------------|
| admin | sinooAd | ADMIN | $2b$10$ZCTYpvx8hVdAEHvWdm5nyeyYpE9VclGw6tcb7A3v9pTXVdyYZq5nC |

---

## Manual Testing via Browser

### 1. Login Test

1. Start server: `npm run dev`
2. Mở browser: `http://localhost:3000`
3. Navigate to login page
4. Enter credentials:
   - Username: `httt22002`
   - Password: `sinooStu`
5. Click Login
6. Verify redirect to dashboard
7. Check session/cookies

### 2. Logout Test

1. Sau khi login thành công
2. Click Logout button
3. Verify redirect to home page
4. Check session cleared

---

## Testing with Thunder Client / Postman

### Login Request

```http
POST http://localhost:3000/api/auth/signin/credentials
Content-Type: application/x-www-form-urlencoded

username=httt22002&password=sinooStu&callbackUrl=http://localhost:3000/dashboard
```

### Get Session

```http
GET http://localhost:3000/api/auth/session
Cookie: next-auth.session-token=<YOUR_SESSION_TOKEN>
```

### Logout

```http
POST http://localhost:3000/api/auth/signout
Content-Type: application/json
Cookie: next-auth.session-token=<YOUR_SESSION_TOKEN>

{
  "callbackUrl": "http://localhost:3000"
}
```

---

## Bcrypt Password Hashing

Để tạo password hash mới:

```typescript
import bcrypt from "bcrypt";

const password = "your_password";
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
console.log(hash);
```

Để verify password:

```typescript
import bcrypt from "bcrypt";

const password = "your_password";
const hash = "$2b$10$..."; // hash từ database
const isValid = await bcrypt.compare(password, hash);
console.log(isValid); // true hoặc false
```

---

## Troubleshooting

### ❌ "Environment variable not found: DATABASE_URL"

**Solution:** Đảm bảo file `.env` tồn tại và có DATABASE_URL:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### ❌ "Cannot connect to server"

**Solution:** Start Next.js server trước:

```bash
npm run dev
```

### ❌ Password không match

**Solution:**

- Đảm bảo dùng plain password (`sinooStu`), không phải hash
- Re-run seed: `npx prisma db seed`
- Check bcrypt version compatibility

---

## Next Steps

Sau khi test thành công:

1. ✅ Implement login UI page
2. ✅ Add session management
3. ✅ Add protected routes
4. ✅ Add role-based access control
5. ✅ Add remember me functionality
6. ✅ Add password reset flow

---

## Notes

- ⚠️ Password hashes thay đổi mỗi lần seed (do bcrypt salt ngẫu nhiên)
- ⚠️ Session cookies không persist trong script tests (cần browser)
- ✅ Database test (test-auth-simple.ts) là cách đáng tin cậy nhất
- ✅ Tất cả tests đều PASS với current setup

```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    ".next\\dev/types/**/*.ts",
    ".next\\dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "contracts/**/*"
  ]
}

```

### types\next-auth.d.ts

```ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      studentId: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    studentId: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user?: {
      id: string;
      studentId: string;
      role: string;
    };
  }
}

```

### utils\config.ts

```ts
"server only";

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

```

### _docs_FE\askToFE.md

```md
# Ask to FE update

- dùng mạng Sepolia testnet
- thêm login cho nhà trường, username + password
- jwt vs authentication

# ======== API mapping: ========

# GET: /api/certificate/

## Response

```bash
[
    {
        status: string;
        id: number;
        studentName: string;
        courseName: string;
        fileHash: string;
        ipfsCid: string;
        issuerAddress: string;
        blockchainTx: string | null;
        issuedAt: Date;
    },
    {
        status: string;
        id: number;
        studentName: string;
        courseName: string;
        fileHash: string;
        ipfsCid: string;
        issuerAddress: string;
        blockchainTx: string | null;
        issuedAt: Date;
    },
...

]

```

# POST: /api/certificate/

## payload

```bash
{
  file: File;
  studentName: string;
  studentId: string;
  courseName: string;
};

```

## Response

```bash
{
    status: string;
    fileHash: string; // as efb4a5be48895fe42a447dc80651303e862b1311fc81be6bc8e9e41941b9853b
    ipfsCid: string; // as bafkreihpwss34sejl7scurd5zadfcmb6qyvrgep4qg7gxshj4qmudomfhm
    certificateId: number;
    ipfsUrl: string;
}

```

# POST: /api/certificate/register

## payload

```bash
{
certificateId: string
};

```

## Response

```bash
{
      status: string // as "success" | "failed",
      message: string // as "Certificate registered on blockchain",
      txHash: string // as "0x983403024893"
      certificateId: string
}
```

# GET: /api/certificates/verify?hash=efb4a5be48895fe42a447dc80651303e862b1311fc81be6bc8e9e41941b9853b

## Response

```bash
{
    verified: boolean;
    certificate: {
        studentName: string;
        courseName: string;
        issuedAt: Date;
        status: string;
        issuerAddress: string;
        ipfsCid: string;
        blockchainTx: string | null;
    };
    hash: string;
}
```

# ======== Code deploy template: ========

## Dashboard: `app/dashboard/page.tsx`

```bash
import { CertificateRepository } from "@/core/repositories/certificate.repository";

export default async function DashboardPage() {
  const certificateRepo = new CertificateRepository();
  const certificates = await certificateRepo.findAll();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Certificate Dashboard</h1>
        <a
          href="/certificates/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Create New Certificate
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Certificates</h2>
        </div>

        {certificates.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>
              No certificates found. Create your first certificate to get
              started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issued
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          certificate.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {certificate.issuedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a
                        href={`/certificates/${certificate.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                      <a
                        href={`/verify/${certificate.fileHash}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Verify
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

```

## Create new certificate: `app/certificates/create/page.tsx`

```bash
"use client";

import { useState } from "react";

export default function CreateCertificatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const error = await response.json();
        alert("Error: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      alert("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              ✅ Certificate Created Successfully!
            </h1>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Certificate ID:
                </span>
                <span className="ml-2 text-gray-900">
                  {result.certificateId}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">File Hash:</span>
                <code className="ml-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {result.fileHash}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">IPFS CID:</span>
                <code className="ml-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {result.ipfsCid}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  {result.status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700 mb-2">Next steps:</p>
              <ol className="text-sm text-green-700 space-y-1 ml-4">
                <li>
                  1. Register certificate on blockchain (requires wallet
                  connection)
                </li>
                <li>2. Share verification link with student</li>
              </ol>
            </div>

            <div className="mt-6 flex space-x-4">
              <a
                href={`/certificates/${result.certificateId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                View Certificate
              </a>
              <a
                href="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Certificate</h1>
          <p className="text-gray-600 mt-2">
            Upload and create a blockchain-backed certificate
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="studentName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student Name *
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student full name"
            />
          </div>

          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student ID *
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student ID number"
            />
          </div>

          <div>
            <label
              htmlFor="courseName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course or program name"
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Certificate File *
            </label>
            <input
              type="file"
              id="file"
              name="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <a
              href="/dashboard"
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium"
            >
              {isLoading ? "Creating..." : "Create Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

```

## Certificate detail: `app/certificates/[id]/page.tsx`

```bash
import { CertificateRepository } from "@/core/repositories/certificate.repository";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;
  const certificateRepo = new CertificateRepository();

  const certificate = await certificateRepo.findById(id);

  if (!certificate) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Certificate Details</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {certificate.studentName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {certificate.courseName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                certificate.status === "verified"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {certificate.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              File Hash
            </label>
            <p className="mt-1 text-sm text-gray-900 font-mono break-all">
              {certificate.fileHash}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              IPFS CID
            </label>
            <p className="mt-1 text-sm text-gray-900 font-mono break-all">
              {certificate.ipfsCid}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issued At
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {certificate.issuedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Share Certificate</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Verification Link:
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                /verify/{certificate.fileHash}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## Check verify: `app/verify/[hash]/page.tsx`

```bash
import { CertificateRepository } from "@/core/repositories/certificate.repository";

interface PageProps {
  params: Promise<{ hash: string }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { hash } = await params;
  const certificateRepo = new CertificateRepository();

  const certificate = await certificateRepo.findByHash(hash);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Certificate Verification
        </h1>

        {certificate ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-green-800">
                  ✅ Certificate Verified
                </h2>
                <p className="text-sm text-green-700">
                  This certificate is authentic and valid
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Student:</span>
                <span className="ml-2 text-gray-900">
                  {certificate.studentName}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Course:</span>
                <span className="ml-2 text-gray-900">
                  {certificate.courseName}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Issued:</span>
                <span className="ml-2 text-gray-900">
                  {certificate.issuedAt.toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    certificate.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {certificate.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">IPFS:</span>
                <a
                  href={`https://ipfs.io/ipfs/${certificate.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-mono break-all"
                >
                  {certificate.ipfsCid}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-red-800">
                  ❌ Certificate Not Found
                </h2>
                <p className="text-sm text-red-700">
                  This certificate hash is not valid or does not exist
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium">Searched hash:</p>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-xs font-mono break-all">
                {hash}
              </code>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by blockchain technology for tamper-proof verification
          </p>
        </div>
      </div>
    </div>
  );
}


```

```

### _docs_FE\FE_AUTH_GUIDE.md

```md
# 🔐 Frontend Authentication Guide - CertiChain

Hướng dẫn sử dụng NextAuth v4 authentication trong CertiChain cho Frontend Engineers.

---

## 📋 Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Authentication Flow](#authentication-flow)
3. [Client-Side Usage](#client-side-usage)
4. [Server-Side Usage](#server-side-usage)
5. [Protected Routes](#protected-routes)
6. [API Calls with Auth](#api-calls-with-auth)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Setup & Configuration

### Environment Variables

Đảm bảo `.env` có các biến sau:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=/UzmHcSefmOLGniBRvGXcmVKj9o4DgaZPmF3QBUnNPI=
DATABASE_URL=postgresql://...
```

### User Credentials (Development)

| Username | Password | Role | User ID |
|----------|----------|------|---------|
| httt22001 | sinooStu | STUDENT | 4 |
| httt22002 | sinooStu | STUDENT | 1 |
| httt22003 | sinooStu | STUDENT | 2 |
| admin | sinooAd | ADMIN | 3 |

---

## Authentication Flow

```mermaid
graph TD
    A[User visits site] --> B{Has session?}
    B -->|Yes| C[Show authenticated UI]
    B -->|No| D[Show login form]
    D --> E[Submit credentials]
    E --> F[POST /api/auth/signin/credentials]
    F --> G{Valid?}
    G -->|Yes| H[Set session cookie]
    G -->|No| I[Show error]
    H --> C
```

---

## Client-Side Usage

### 1. Get Session in Client Component

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.username}!</h1>
      <p>Role: {session?.user?.role}</p>
      <p>User ID: {session?.user?.id}</p>
    </div>
  );
}
```

### 2. Login Component

```tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // Don't auto-redirect
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else if (result?.ok) {
        // Login successful
        router.push("/dashboard");
        router.refresh(); // Refresh server components
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 3. Logout Component

```tsx
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false, // Don't auto-redirect
    });
    router.push("/");
    router.refresh();
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

### 4. Conditional Rendering Based on Auth

```tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav>
      {status === "authenticated" ? (
        <>
          <span>Hello, {session.user.username}</span>
          <Link href="/dashboard">Dashboard</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
```

---

## Server-Side Usage

### 1. Get Session in Server Component

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.username}!</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### 2. Get Session in API Route

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Use session.user.id, session.user.role, etc.
  return NextResponse.json({
    userId: session.user.id,
    username: session.user.username,
    role: session.user.role,
  });
}
```

### 3. Role-Based Access Control

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check if user is ADMIN
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Admin only" },
      { status: 403 }
    );
  }

  // Admin-only logic here
  return NextResponse.json({ success: true });
}
```

---

## Protected Routes

### Using Middleware (Recommended)

Create `middleware.ts` in root directory:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard") ||
                          request.nextUrl.pathname.startsWith("/certificates/create");

  // Redirect to login if accessing protected page without auth
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing auth page while authenticated
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/certificates/create/:path*", "/login", "/register"],
};
```

---

## API Calls with Auth

### Using fetch with Session

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function CreateCertificate() {
  const { data: session } = useSession();

  const createCertificate = async (formData: FormData) => {
    // Session cookie is automatically sent with fetch
    const response = await fetch("/api/certificates", {
      method: "POST",
      body: formData,
      // No need to manually add auth headers
      // NextAuth handles this via cookies
    });

    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/login";
      return;
    }

    const data = await response.json();
    return data;
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      createCertificate(formData);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Common Patterns

### 1. Check if User is Logged In

```tsx
"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "ADMIN",
    isStudent: session?.user?.role === "STUDENT",
  };
}

// Usage
function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <div>Welcome {user.username}</div>;
}
```

### 2. Require Authentication HOC

```tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);

    if (status === "loading") {
      return <div>Loading...</div>;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(function MyPage() {
  return <div>Protected content</div>;
});
```

### 3. Session Refresh

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, update } = useSession();

  const refreshSession = async () => {
    // Force session refresh from server
    await update();
  };

  return (
    <button onClick={refreshSession}>
      Refresh Session
    </button>
  );
}
```

---

## Troubleshooting

### Session is null/undefined

**Problem:** `useSession()` returns `null` or `undefined`

**Solutions:**

1. Đảm bảo component được wrap trong `<SessionProvider>`
2. Check `.env` có `NEXTAUTH_URL` và `NEXTAUTH_SECRET`
3. Clear cookies và login lại
4. Check server logs for errors

```bash
# Clear browser cookies
# Chrome: DevTools > Application > Cookies > Delete all
```

### 401 Unauthorized on API calls

**Problem:** API routes trả về 401 dù đã login

**Solutions:**

1. Đảm bảo cookies được gửi kèm request
2. Check `credentials: 'include'` nếu dùng external API
3. Verify session trong API route:

```typescript
const session = await auth();
console.log("Session:", session); // Debug
```

### Redirect loop after login

**Problem:** Sau khi login bị redirect liên tục

**Solutions:**

1. Check middleware config
2. Đảm bảo `redirect: false` trong `signIn()`
3. Manual navigation sau login:

```typescript
const result = await signIn("credentials", {
  username,
  password,
  redirect: false, // Important!
});

if (result?.ok) {
  router.push("/dashboard");
}
```

### Session not persisting

**Problem:** Session mất sau khi refresh page

**Solutions:**

1. Check cookie settings trong browser (allow cookies)
2. Verify `NEXTAUTH_URL` matches your domain
3. Check browser console for cookie errors
4. Ensure `strategy: "jwt"` in auth config

---

## TypeScript Types

### Session Type

```typescript
import { Session } from "next-auth";

// Session structure
interface Session {
  user: {
    id: string;
    username: string;
    role: "ADMIN" | "STUDENT";
  };
  expires: string;
}
```

### Custom Hook Type

```typescript
import { useSession } from "next-auth/react";

type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface UseAuthReturn {
  user: Session["user"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: AuthStatus;
}
```

---

## Testing Authentication

### Manual Browser Test

1. Start server: `npm run dev`
2. Open: `http://localhost:3000`
3. Login with: `httt22002` / `sinooStu`
4. Check DevTools > Application > Cookies for `next-auth.session-token`
5. Navigate to protected routes
6. Test logout

### Script Test

```bash
npx tsx test-auth.ts
```

### Database Test

```bash
npx tsx test-auth-simple.ts
```

---

## Best Practices

### ✅ DO

- Always use `redirect: false` trong `signIn()` để control navigation
- Check session status trước khi render protected content
- Handle loading states (show skeleton/spinner)
- Implement proper error handling
- Use `useSession()` trong Client Components
- Use `auth()` trong Server Components/API Routes
- Clear error messages on retry
- Validate forms before submission

### ❌ DON'T

- Don't store sensitive data in session (only id, username, role)
- Don't use `SessionProvider` trong Server Components
- Don't expose password hashes to frontend
- Don't skip redirect handling after login/logout
- Don't forget to handle session expiry
- Don't mix Client and Server auth methods

---

## Additional Resources

- [NextAuth.js v4 Documentation](https://next-auth.js.org/)
- [Next.js App Router Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [NextAuth JWT Strategy](https://next-auth.js.org/configuration/options#session)

---

## Quick Reference

### Import Statements

```typescript
// Client Components
import { useSession, signIn, signOut } from "next-auth/react";

// Server Components & API Routes
import { auth } from "@/lib/auth";

// Middleware
import { getToken } from "next-auth/jwt";
```

### Common Patterns

```typescript
// Check auth in Client Component
const { data: session, status } = useSession();

// Check auth in Server Component
const session = await auth();

// Login
await signIn("credentials", { username, password, redirect: false });

// Logout
await signOut({ redirect: false });

// Role check
session?.user?.role === "ADMIN"
```

---

**Document Version:** 1.0  
**Last Updated:** October 30, 2025  
**Author:** CertiChain Team

```

### _docs_FE\MIDDLEWARE_GUIDE.md

```md
# 🛡️ Middleware - Route Protection

## Overview

File `middleware.ts` ở **root của project** xử lý authentication và authorization cho tất cả routes.

**Location:** `w:\WorkSpace_IT\_nextjs\certi_chain\middleware.ts`

---

## Features

### 🔐 Authentication Protection

- Redirect to `/login` if accessing protected routes without authentication
- Redirect to `/dashboard` if accessing `/login` while already logged in

### 👤 Role-Based Access Control

- **ADMIN only**: `/certificates/create`
- **All authenticated users**: `/dashboard`, `/certificates/view`
- **Public**: `/`, `/login`, `/verify/*`

---

## Route Configuration

### Public Routes (No Auth Required)

```typescript
✅ /                      // Homepage
✅ /login                 // Login page
✅ /verify/*              // Certificate verification pages
✅ /api/certificates/verify // Verification API
```

### Protected Routes (Auth Required)

```typescript
🔐 /dashboard             // All authenticated users
🔐 /certificates/view/*   // All authenticated users
```

### Admin-Only Routes

```typescript
👑 /certificates/create   // ADMIN only
```

---

## How It Works

### Flow Diagram

```text
User Request
    ↓
Middleware Check
    ↓
Is authenticated? → No → Redirect to /login
    ↓ Yes
Is admin-only route? → Yes → Is ADMIN? → No → Redirect to /dashboard
    ↓ No                       ↓ Yes
Allow access              Allow access
```

### Code Logic

```typescript
// 1. Get JWT token from cookies
const token = await getToken({ req: request });

// 2. Check if protected route
if (isProtectedPath && !token) {
  // Redirect to login with callback URL
  return redirect("/login?callbackUrl=/dashboard");
}

// 3. Check admin-only routes
if (isAdminPath && token.user?.role !== "ADMIN") {
  // Redirect non-admin to dashboard
  return redirect("/dashboard");
}

// 4. Allow access
return NextResponse.next();
```

---

## Testing

### Test as STUDENT

```bash
# Login
Username: httt22002
Password: sinooStu

# Try to access routes
✅ GET /dashboard              → Success (200)
✅ GET /certificates/view/1    → Success (200)
❌ GET /certificates/create    → Redirect to /dashboard
❌ GET /login                  → Redirect to /dashboard (already logged in)
```

### Test as ADMIN

```bash
# Login
Username: admin
Password: sinooAd

# Try to access routes
✅ GET /dashboard              → Success (200)
✅ GET /certificates/create    → Success (200)
✅ GET /certificates/view/1    → Success (200)
❌ GET /login                  → Redirect to /dashboard (already logged in)
```

### Test Unauthenticated

```bash
# No login (no session)

# Try to access routes
✅ GET /                       → Success (public)
✅ GET /login                  → Success (public)
✅ GET /verify/abc123          → Success (public)
❌ GET /dashboard              → Redirect to /login?callbackUrl=/dashboard
❌ GET /certificates/create    → Redirect to /login?callbackUrl=/certificates/create
```

---

## Matcher Configuration

Middleware processes these paths:

```typescript
matcher: [
  "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|api/certificates/verify).*)"
]
```

### Excluded Paths (Middleware SKIPS these)

```text
❌ /api/auth/*               // NextAuth routes
❌ /_next/static/*          // Static files
❌ /_next/image/*           // Image optimization
❌ /favicon.ico             // Favicon
❌ /api/certificates/verify // Public verification API
❌ /public/*                // Public folder
```

---

### Callback URL Feature

When redirecting to login, middleware saves the original URL:

```text
User tries: /certificates/create
           ↓
Redirect: /login?callbackUrl=/certificates/create
           ↓
After login: Redirect back to /certificates/create
```

### Frontend Implementation

```tsx
// pages/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLogin = async (username: string, password: string) => {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl); // Redirect to original URL
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get("username") as string,
        formData.get("password") as string
      );
    }}>
      <input name="username" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Debugging

### Check if middleware is running

Add console.log:

```typescript
export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware:", request.nextUrl.pathname);
  
  const token = await getToken({ req: request });
  console.log("🔐 Token:", token ? "✅ Found" : "❌ None");
  
  // ... rest of code
}
```

### Common Issues

#### 1. Infinite redirect loop

**Problem:** Redirecting to a path that middleware also protects

**Solution:** Make sure redirect target is public or excluded from matcher

```typescript
// ❌ Bad: Redirects to protected path
return NextResponse.redirect(new URL("/dashboard", request.url));

// ✅ Good: Redirects to public path
return NextResponse.redirect(new URL("/login", request.url));
```

#### 2. Middleware not running

**Problem:** Path excluded from matcher

**Solution:** Check matcher configuration

```typescript
// Add your path to matcher
matcher: [
  "/your-path/:path*",
  "/((?!api/auth|_next).*)"
]
```

#### 3. Token not found

**Problem:** NEXTAUTH_SECRET not set or incorrect

**Solution:** Check `.env` file

```env
NEXTAUTH_SECRET=your-secret-here
```

---

## Customization

### Add New Protected Route

```typescript
const isProtectedPath =
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/certificates/create") ||
  pathname.startsWith("/certificates/view") ||
  pathname.startsWith("/your-new-route"); // ← Add here
```

### Add New Public Route

Simply don't add it to protected paths, or explicitly handle it:

```typescript
// Allow public access
if (pathname.startsWith("/your-public-route")) {
  return NextResponse.next();
}
```

### Add New Admin-Only Route

```typescript
const isAdminPath =
  pathname.startsWith("/certificates/create") ||
  pathname.startsWith("/admin"); // ← Add here

if (isAdminPath && token?.user?.role !== "ADMIN") {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

---

## Security Best Practices

### ✅ DO

- Always check authentication before authorization
- Use `getToken()` from `next-auth/jwt`
- Store secret in environment variables
- Log access attempts for debugging
- Validate token signature

### ❌ DON'T

- Don't trust client-side auth state alone
- Don't expose sensitive routes in matcher
- Don't hardcode secrets
- Don't skip token validation
- Don't create redirect loops

---

## Next.js 15 Compatibility

This middleware is compatible with:

- ✅ Next.js 15 App Router
- ✅ NextAuth v4
- ✅ Turbopack (dev mode)
- ✅ Server Components
- ✅ Client Components

---

## Related Documentation

- [Authentication Guide](./FE_AUTH_GUIDE.md)
- [Certificate API](./FE_CERTIFICATE_API.md)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth JWT Docs](https://next-auth.js.org/configuration/nextjs#middleware)

---

**File Location:** `middleware.ts` (root of project)  
**Last Updated:** October 30, 2025

```

### _docs_FE\README_AUTH.md

```md
# 📚 Authentication Documentation

## Available Guides

### 🚀 [Quick Start Guide](./QUICK_START_AUTH.md)

**5-minute setup** - Copy-paste examples cho các use cases phổ biến nhất.

**Best for:** Bắt đầu nhanh, cần implement login/logout basic.

---

### 📖 [Complete FE Guide](./FE_AUTH_GUIDE.md)

**Comprehensive documentation** - Hướng dẫn chi tiết về authentication patterns, best practices, troubleshooting.

**Best for:** Hiểu sâu về authentication flow, advanced patterns, production setup.

---

### 🧪 [Testing Guide](../TEST_AUTH.md)

**Testing documentation** - Hướng dẫn test authentication qua script và browser.

**Best for:** QA, testing authentication functionality.

---

## Quick Reference

### Authentication Files Structure

```
certi_chain/
├── src/
│   └── auth.ts                    # NextAuth configuration
├── lib/
│   └── auth.ts                    # Server-side auth helper
├── types/
│   └── next-auth.d.ts            # TypeScript type definitions
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts              # NextAuth API route
│   ├── layout.tsx                # Root layout with SessionProvider
│   └── providers.tsx             # Client-side providers
├── test-auth.ts                  # Auth API test script
└── test-auth-simple.ts           # Database auth test script
```

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://...
```

### Test Credentials

| Username | Password | Role |
|----------|----------|------|
| httt22002 | sinooStu | STUDENT |
| admin | sinooAd | ADMIN |

---

## Choose Your Path

### 👨‍💻 I'm a Frontend Developer

→ Start with [Quick Start Guide](./QUICK_START_AUTH.md)  
→ Reference [Complete FE Guide](./FE_AUTH_GUIDE.md) when needed

### 🧪 I'm Testing Authentication

→ Use [Testing Guide](../TEST_AUTH.md)  
→ Run test scripts: `npx tsx test-auth.ts`

### 🏗️ I'm Setting Up Production

→ Read [Complete FE Guide](./FE_AUTH_GUIDE.md)  
→ Focus on "Best Practices" and "Protected Routes" sections

---

## Common Tasks

### Login User

```tsx
import { signIn } from "next-auth/react";

await signIn("credentials", {
  username: "httt22002",
  password: "sinooStu",
  redirect: false,
});
```

### Check Auth Status

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
```

### Logout User

```tsx
import { signOut } from "next-auth/react";

await signOut({ redirect: false });
```

### Protect Server Component

```tsx
import { auth } from "@/lib/auth";

const session = await auth();
if (!session) redirect("/login");
```

---

## Need Help?

1. Check [Quick Start](./QUICK_START_AUTH.md) for examples
2. Read [Complete Guide](./FE_AUTH_GUIDE.md) for details
3. See [Testing Guide](../TEST_AUTH.md) for troubleshooting
4. Check browser console for errors
5. Verify environment variables in `.env`

---

**Last Updated:** October 30, 2025

```

### _docs_fixed\README.md

```md
# This is instruction to fix something

``` bash
note fix prisma run with seed.ts

npm i -D tsx

# in package.json
  

"prisma": {
    "seed": "tsx prisma/seed.ts"
  },


```

```

### _flow_instructions\BE Flow.md

```md
# **🧱 Backend Technical Flow – Blockchain Certificate Verification System (MVP 2025\)**

---

## **🧩 1\. Mục tiêu**

Xây dựng backend phục vụ cho 3 nhiệm vụ chính:

1. **Tạo và quản lý chứng chỉ off-chain**  
    → Lưu thông tin sinh viên, hash, IPFS CID vào Postgres (qua Prisma).

2. **Ghi chứng chỉ lên blockchain (on-chain proof)**  
    → Gọi smart contract `registerCertificate()` trên mạng Base Sepolia.

3. **Xác thực chứng chỉ công khai**  
    → Cung cấp API verify hash → so khớp dữ liệu blockchain.

---

## **⚙️ 2\. Công nghệ và môi trường**

| Thành phần | Công nghệ |
| ----- | ----- |
| Framework | Next.js 15 (App Router) – dùng chung cho FE & BE |
| ORM & DB | Prisma \+ PostgreSQL |
| Storage | IPFS (qua `web3.storage` SDK hoặc Pinata) |
| Blockchain | Base Sepolia \+ `ethers.js` (qua wagmi hoặc viem) |
| Hashing | Node.js `crypto` (SHA-256) |
| Auth (optional) | JWT hoặc Simple admin key |
| Deployment | Docker Compose \+ Vercel / Railway |

---

## **🧭 3\. Kiến trúc tổng thể Backend**

src/  
├── api/  
│   ├── certificates/  
│   │   ├── route.ts (POST, GET)  
│   │   ├── \[id\]/route.ts (GET)  
│   │   ├── register/route.ts (POST)  
│   │   └── verify/route.ts (GET)  
│   └── upload/route.ts  
│  
├── lib/  
│   ├── db.ts               → Prisma client  
│   ├── hash.ts             → SHA-256 function  
│   ├── ipfs.ts             → IPFS upload client  
│   ├── blockchain.ts       → Gọi contract registerCertificate  
│   └── utils.ts  
│  
├── prisma/  
│   └── schema.prisma  
│  
└── .env (DB\_URL, WEB3\_TOKEN, CONTRACT\_ADDRESS, PRIVATE\_KEY)

---

## **🧩 4\. Data Model (Prisma Schema)**

model Certificate {  
  id             Int      @id @default(autoincrement())  
  studentName    String  
  studentIdHash  String  
  courseName     String  
  fileHash       String   @unique  
  ipfsCid        String  
  issuerAddress  String  
  blockchainTx   String?  
  status         String   @default("pending") // pending | verified | failed  
  issuedAt       DateTime @default(now())  
}

---

## 

## **🔁 5\. Business Flow chi tiết (step-by-step)**

### **🧱 A. Upload & Register Certificate (Admin Flow)**

**API:** `POST /api/certificates`

**Luồng xử lý:**

1. **FE gửi form:**

   1. Tên sinh viên, mã sinh viên, tên khóa học

   2. File PDF chứng chỉ

2. **BE xử lý:**   
   1. Hash file bằng SHA-256

       import crypto from "crypto";

const fileBuffer \= await file.arrayBuffer();  
const hash \= crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex");

2. Upload file lên IPFS (`web3.storage`) → nhận `CID`

    const client \= new Web3Storage({ token: process.env.WEB3\_TOKEN });

const cid \= await client.put(\[file\]);

3. Hash mã sinh viên (ẩn danh hóa

 const studentIdHash \= crypto.createHash("sha256").update(studentId).digest("hex");

4. Lưu vào database (trạng thái `pending`)

await prisma.certificate.create({

  data: { studentName, courseName, fileHash: hash, ipfsCid: cid, studentIdHash, issuerAddress }  
});

5. Trả về JSON:

    {

  "status": "pending",  
  "fileHash": "0xabc123...",  
  "ipfsCid": "QmXYZ...",  
  "certificateId": 1  
}  
---

### **🧱 B. Ghi dữ liệu lên Blockchain (On-chain registration)**

**API:** `POST /api/certificates/register`

**Mục đích:** Trường xác thực chứng chỉ bằng cách ghi hash \+ CID lên blockchain.

**Input:**

{  
  "certificateId": 1  
}

**Luồng xử lý:**

1. Lấy record từ DB → `{ fileHash, ipfsCid, studentIdHash }`

Gọi smart contract (qua `ethers.js`):

 const provider \= new ethers.JsonRpcProvider(process.env.BASE\_RPC);  
const wallet \= new ethers.Wallet(process.env.PRIVATE\_KEY, provider);  
const contract \= new ethers.Contract(process.env.CONTRACT\_ADDRESS, abi, wallet);  
const tx \= await contract.registerCertificate(fileHash, ipfsCid, studentIdHash);  
const receipt \= await tx.wait();

2. Cập nhật DB:

    await prisma.certificate.update({

  where: { id: certificateId },  
  data: { blockchainTx: tx.hash, status: "verified" }  
});

3. Trả về JSON:

    {

  "status": "verified",  
  "txHash": "0xabc123...",  
  "explorer": "https://basescan.org/tx/0xabc123..."  
}

---

### **🧱 C. Lấy danh sách chứng chỉ (Dashboard)**

**API:** `GET /api/certificates`

**Mục đích:** Cho nhà trường hiển thị danh sách chứng chỉ đã phát hành.

**Output mẫu:**

\[  
  {  
    "id": 1,  
    "studentName": "Nguyen Van A",  
    "courseName": "Blockchain Fundamentals",  
    "fileHash": "0xabc123",  
    "status": "verified",  
    "issuedAt": "2025-10-22T09:00:00Z"  
  }  
\]

---

### **🧱 D. Xác thực chứng chỉ công khai (Verify Flow)**

**API:** `GET /api/certificates/verify?hash=<fileHash>`

**Luồng xử lý:**

1. Lấy dữ liệu off-chain trong DB (nếu có).

Gọi smart contract để kiểm tra:

 const cert \= await contract.verifyCertificate(fileHash);

2.   
3. So sánh:

   * Hash có tồn tại không?

   * Issuer có khớp với DB (địa chỉ trường) không?

Trả về kết quả:

 {  
  "verified": true,  
  "issuer": "0x123...",  
  "ipfsCid": "QmXyz...",  
  "txHash": "0xabc...",  
  "issuedAt": 1729555555,  
  "viewOnChain": "https://basescan.org/tx/0xabc..."  
}

4.   
5. Nếu không tồn tại → trả `verified: false`.

---

### **🧱 E. Upload lại file (optional)**

**API:** `POST /api/upload`  
 – Chỉ dùng cho các trường hợp cần re-upload chứng chỉ hoặc cập nhật IPFS.

---

## **🧩 6\. Tóm tắt API Table**

| API | Method | Vai trò | Mô tả |
| ----- | ----- | ----- | ----- |
| `/api/certificates` | `POST` | Nhà trường | Tạo chứng chỉ, hash \+ upload IPFS |
| `/api/certificates` | `GET` | Nhà trường | Lấy danh sách chứng chỉ |
| `/api/certificates/register` | `POST` | Nhà trường | Ghi chứng chỉ lên blockchain |
| `/api/certificates/[id]` | `GET` | FE | Lấy thông tin chứng chỉ cụ thể |
| `/api/certificates/verify` | `GET` | Công khai | Xác minh hash trên blockchain |
| `/api/upload` | `POST` | Nội bộ | Upload file và trả CID (nếu tách riêng IPFS service) |

---

## **🧠 7\. Xử lý bất đồng bộ / Job runner (optional)**

Nếu muốn tối ưu, bạn có thể dùng **background job** để:

* Tự động update status `pending → verified` khi có `txHash`.

* Dùng WebSocket / event listener theo dõi event `CertificateIssued` trong contract.

Ví dụ event watcher:

contract.on("CertificateIssued", async (hash, ipfsCid, issuer, timestamp) \=\> {  
  await prisma.certificate.updateMany({  
    where: { fileHash: hash },  
    data: { status: "verified" }  
  });  
});

---

## **🧰 8\. Biến môi trường cần thiết (.env)**

DATABASE\_URL=postgresql://user:password@host:port/db  
WEB3\_TOKEN=YOUR\_WEB3\_STORAGE\_TOKEN  
BASE\_RPC=https://base-sepolia.g.alchemy.com/v2/yourKey  
CONTRACT\_ADDRESS=0xYourContractAddress  
PRIVATE\_KEY=0xYourPrivateKey  
ISSUER\_WALLET=0xUniversityWallet

---

## **🚀 9\. Tóm tắt pipeline dữ liệu**

PDF → Hash (SHA256) → Upload IPFS (CID)  
   ↓  
Lưu DB (pending)  
   ↓  
Gọi contract registerCertificate(hash, CID, studentId)  
   ↓  
Base Sepolia ghi proof  
   ↓  
DB update status \= verified  
   ↓  
FE hiển thị QR \+ link verify

---

## **✅ 10\. Kết luận – Dev backend cần nắm rõ**

| Thành phần | Trách nhiệm |
| ----- | ----- |
| **API layer** | Tiếp nhận request, validate, trả JSON |
| **IPFS module** | Upload / lấy file |
| **Blockchain module** | Gọi contract, verify hash |
| **DB module (Prisma)** | Lưu và đồng bộ trạng thái |
| **Auth middleware (optional)** | Giới hạn ai có thể tạo chứng chỉ |


```

### _flow_instructions\FE Flow.md

```md
**Next.js 15 (App Router) \+ Tailwind \+ wagmi \+ Prisma \+ Base Sepolia \+ IPFS**.

---

# **🎨 Frontend Technical Flow – Blockchain Certificate Verification System (MVP 2025\)**

---

## **🧭 1\. Mục tiêu**

Frontend (Next.js) chịu trách nhiệm:

* Cung cấp giao diện cho **Nhà trường** (issuer) để upload, tạo, đăng ký chứng chỉ on-chain.

* Cung cấp giao diện công khai cho **Sinh viên** (holder) để xem & chia sẻ chứng chỉ.

* Cung cấp trang xác minh cho **Nhà tuyển dụng** (verifier) để quét QR / xác thực chứng chỉ.

👉 Mục tiêu là “frontend thông minh nhưng nhẹ” — kết nối trực tiếp cả **API backend** và **smart contract** thông qua **wagmi \+ ethers.js**.

---

## **⚙️ 2\. Tech Stack (FE)**

| Thành phần | Công nghệ |
| ----- | ----- |
| Framework | Next.js 15 (App Router) |
| UI | Tailwind CSS \+ shadcn/ui \+ QRCode.react |
| State | React Query (hoặc Zustand / useData store) |
| Wallet | wagmi \+ MetaMask \+ Base Sepolia |
| API | Axios (hoặc native fetch) |
| Blockchain | ethers.js (wagmi hooks) |
| Storage | web3.storage (thông qua backend) |
| Routing | App Router (`/app/*`) |
| Deploy | Vercel |

---

## **🧩 3\. Cấu trúc thư mục đề xuất**

src/  
├── app/  
│   ├── page.tsx                     \# Trang landing  
│   ├── dashboard/page.tsx           \# Trang quản lý chứng chỉ (Nhà trường)  
│   ├── certificates/create/page.tsx \# Form tạo chứng chỉ  
│   ├── certificates/\[id\]/page.tsx   \# Trang chi tiết chứng chỉ  
│   ├── verify/\[hash\]/page.tsx       \# Trang xác thực công khai  
│   └── layout.tsx                   \# Layout chính  
│  
├── components/  
│   ├── CertificateForm.tsx  
│   ├── CertificateCard.tsx  
│   ├── CertificateList.tsx  
│   ├── VerifyResult.tsx  
│   └── QRDisplay.tsx  
│  
├── hooks/  
│   ├── useCertificates.ts  
│   ├── useUpload.ts  
│   ├── useVerify.ts  
│   └── useBlockchain.ts  
│  
├── lib/  
│   ├── api.ts             \# axios instance  
│   ├── wagmiConfig.ts     \# cấu hình chain Base \+ connectors  
│   └── utils.ts  
│  
├── state/  
│   ├── ui.ts              \# modal, toast  
│   └── data.ts            \# react-query / zustand store  
│  
├── types/  
│   └── certificate.ts  
│  
└── public/  
    └── logo.png

---

## **🧭 4\. Các Actor và UI tương ứng**

| Actor | UI chính | Mô tả |
| ----- | ----- | ----- |
| 🏫 **Nhà trường** | `/dashboard` – quản lý danh sách chứng chỉ`/certificates/create` – form tạo mới | Tạo chứng chỉ, upload, ghi on-chain |
| 👩‍🎓 **Sinh viên** | `/certificates/[id]` – xem chi tiết, copy link, QR | Chia sẻ link hoặc QR |
| 🏢 **Nhà tuyển dụng** | `/verify/[hash]` – xác minh chứng chỉ | Quét QR / verify hash trực tiếp |

---

## **🔁 5\. Frontend Flow chi tiết (Step-by-Step)**

---

### **🧱 A. Trang “Create Certificate” – Upload & Lưu Off-chain**

**Đường dẫn:** `/certificates/create`

**Mục tiêu:** Nhà trường tạo chứng chỉ cho sinh viên.

#### **🧩 Quy trình:**

1. **Form nhập thông tin:**

   * Tên sinh viên

   * Mã sinh viên

   * Tên khóa học

   * Upload file PDF (Drag & Drop)

2. Khi nhấn “Tạo chứng chỉ”:

   * Gọi API `POST /api/certificates` (Backend xử lý hash \+ IPFS)

   * Hiển thị trạng thái “Đang upload…”

   * Sau khi API trả về → hiển thị preview \+ nút “Ghi lên blockchain”.

#### **🧠 Hooks/Logic:**

const { mutate: createCert } \= useMutation((data) \=\> api.post("/api/certificates", data));

#### **🧩 Kết quả:**

Hiển thị thông báo:

✅ Certificate created (pending on-chain)  
File Hash: 0x123abc...

---

### **🧱 B. Trang “Dashboard” – Danh sách chứng chỉ**

**Đường dẫn:** `/dashboard`

**Mục tiêu:** Hiển thị toàn bộ chứng chỉ của nhà trường, lọc theo trạng thái.

#### **🧩 Quy trình:**

1. FE gọi API `GET /api/certificates`.

2. Hiển thị danh sách bằng `CertificateList.tsx`:

   * Họ tên

   * Tên khóa học

   * Ngày cấp

   * Trạng thái: `pending` / `verified`

   * Nút “Đăng ký on-chain” (nếu pending).

#### **🧠 Hooks:**

const { data: certificates } \= useQuery(\["certificates"\], () \=\> api.get("/api/certificates"));

#### **🧩 Khi bấm “Đăng ký on-chain”:**

* FE gọi `POST /api/certificates/register` với `certificateId`.

* BE gọi smart contract → cập nhật trạng thái → FE refetch list.

---

### **🧱 C. Nhà trường ghi dữ liệu lên Blockchain**

**Kích hoạt từ UI Dashboard hoặc trang chi tiết.**

#### **🧩 Quy trình:**

1. User kết nối MetaMask (wagmi hook).

 const { connect, isConnected, address } \= useAccount();

2. FE hiển thị ví nhà trường đang dùng.

3. Khi nhấn “Register on-chain”:

   * Gọi API `/api/certificates/register` → trả `txHash`.

Hiển thị toast:

 🟢 Registered on Blockchain\!  
Tx: 0xabc123... (View on BaseScan)

4. 

---

### **🧱 D. Trang “Certificate Detail” – Sinh viên tra cứu chứng chỉ**

**Đường dẫn:** `/certificates/[id]`

#### **🧩 Quy trình:**

1. Gọi API `GET /api/certificates/[id]`.

2. Hiển thị:

   * Thông tin sinh viên, khóa học, hash.

   * Nút “Sao chép link / mã QR”.

3. Sinh viên bấm “Copy link” → copy đường dẫn `https://verify.edu.vn/verify/<hash>`.

4. Hoặc “Tải QR Code” → lưu ảnh QR từ component `QRCode.react`.

#### **🧠 Component:**

\<QRCode value={\`https://verify.edu.vn/verify/${fileHash}\`} size={180} /\>

---

### **🧱 E. Trang “Verify Certificate” – Nhà tuyển dụng xác minh**

**Đường dẫn:** `/verify/[hash]`

#### **🧩 Quy trình:**

1. Khi mở trang → FE gọi:

 *const { data } \= useQuery(\["verify", hash\], () \=\> api.get(\`/api/certificates/verify?hash=${hash}\`));*

2. Hiển thị:

   * Hash: `0xabc123...`

   * Trạng thái: ✅ Verified / ❌ Not Found

   * Issuer: `0x123...abc`

   * Ngày cấp: `22/10/2025`

   * Nút “Xem chứng chỉ trên IPFS” → `https://ipfs.io/ipfs/Qm123...`

   * Nút “Xem giao dịch trên BaseScan” → `https://basescan.org/tx/0xabc...`

#### **🧩 Component:**

{data.verified ? (  
  \<VerifiedBadge /\>  
) : (  
  \<UnverifiedAlert /\>  
)}

---

## **🧠 6\. React Query data flow**

| Hook | Chức năng | API |
| ----- | ----- | ----- |
| `useCertificates()` | Lấy danh sách chứng chỉ | GET /api/certificates |
| `useCreateCertificate()` | Tạo chứng chỉ mới | POST /api/certificates |
| `useRegisterCertificate()` | Ghi lên blockchain | POST /api/certificates/register |
| `useVerify(hash)` | Xác minh chứng chỉ | GET /api/certificates/verify?hash=... |

---

## **🧱 7\. UI State flow tổng quát**

\[Upload\] → “Đang xử lý hash & IPFS” → “Đã tạo (pending)”  
   ↓  
\[Register\] → “Đang gửi giao dịch” → “Đã verified ✅”  
   ↓  
\[Share link/QR\] → “Copied ✅”  
   ↓  
\[Verifier\] → “Verified ✅ / Invalid ❌”

---

## **🧩 8\. Thành phần UI chính**

| Component | Mô tả | Props |
| ----- | ----- | ----- |
| `CertificateForm` | Form upload, nhập thông tin chứng chỉ | onSubmit |
| `CertificateList` | Danh sách chứng chỉ (table hoặc grid) | certificates\[\] |
| `CertificateCard` | Thẻ hiển thị chứng chỉ riêng | certificate |
| `QRDisplay` | Tạo mã QR cho link verify | value |
| `VerifyResult` | Hiển thị kết quả xác thực on-chain | data |

---

## **🔗 9\. Tích hợp Blockchain (wagmi)**

**File:** `src/lib/wagmiConfig.ts`

import { createConfig, http } from "wagmi";  
import { baseSepolia } from "wagmi/chains";  
import { metaMask } from "wagmi/connectors";

export const config \= createConfig({  
  chains: \[baseSepolia\],  
  connectors: \[metaMask()\],  
  transports: {  
    \[baseSepolia.id\]: http("https://base-sepolia.g.alchemy.com/v2/yourKey")  
  }  
});

**Dùng trong component:**

const { connect, address } \= useAccount();  
const { writeContract } \= useWriteContract({  
  address: CONTRACT\_ADDRESS,  
  abi: CERT\_ABI,  
  functionName: "registerCertificate"  
});

---

## **📊 10\. Frontend Routing Flow Summary**

| Route | Vai trò | Mô tả |
| ----- | ----- | ----- |
| `/` | Landing page | Giới thiệu hệ thống |
| `/dashboard` | Nhà trường | Danh sách chứng chỉ |
| `/certificates/create` | Nhà trường | Tạo chứng chỉ, upload |
| `/certificates/[id]` | Sinh viên | Xem và copy link |
| `/verify/[hash]` | Nhà tuyển dụng | Xác minh chứng chỉ |

---

## **🧠 11\. Flow toàn cảnh Frontend (UI Logic)**

\[Upload chứng chỉ\]  
   ↓  
Call API → hash \+ IPFS → DB (pending)  
   ↓  
Hiển thị UI (status: pending)  
   ↓  
Nhấn “Đăng ký on-chain” → MetaMask popup  
   ↓  
Call API → ghi blockchain → status \= verified  
   ↓  
Sinh viên lấy link/QR chia sẻ  
   ↓  
Nhà tuyển dụng click verify → UI gọi /verify  
   ↓  
✅ Hiển thị “Valid Certificate – Issued by University”

---

## **✅ 12\. Tóm tắt nhiệm vụ cho FE dev**

| Hạng mục | Người phụ trách | Công việc |
| ----- | ----- | ----- |
| **UI/UX** | FE Lead | Tạo layout, modal, table |
| **API Integration** | FE \+ BE | Connect API `/certificates` và `/verify` |
| **Blockchain Hook** | FE | Thêm wagmi để call contract |
| **QR & Verify page** | FE | Hiển thị kết quả xác thực |
| **Testing \+ Toast UX** | FE | Thông báo trạng thái hành động |


```

### _flow_instructions\SmartContract Flow.md

```md
# **⚙️ Smart Contract Development & Testing Flow (Remix \+ Base Sepolia)**

### **Dự án: *Blockchain-Backed Certificate Verification System (Hybrid Edition)***

---

## **🧩 1\. Mục tiêu**

Smart contract chịu trách nhiệm:

* Lưu trữ thông tin **chứng chỉ giáo dục đã phát hành**: file hash, CID IPFS, issuer, thời gian, và mã sinh viên mã hóa.

* Cho phép **xác minh công khai** (verify) bất kỳ chứng chỉ nào dựa vào hash.

* Đảm bảo **bất biến, minh bạch, chống giả mạo** — không thể chỉnh sửa hoặc xóa.

---

## **🧭 2\. Môi trường và công cụ sử dụng**

| Thành phần | Công nghệ |
| ----- | ----- |
| IDE | [Remix IDE](https://remix.ethereum.org/) |
| Compiler | Solidity ^0.8.20 |
| Network | **Base Sepolia Testnet** |
| Wallet | MetaMask (đã cấu hình mạng Base Sepolia) |
| Test faucet | [https://faucet.triangleplatform.com/base/sepolia](https://faucet.triangleplatform.com/base/sepolia) |
| Explorer | [https://sepolia.basescan.org/](https://sepolia.basescan.org/) |

---

## **🧱 3\. Cấu trúc smart contract**

### **📄 File: `CertificateRegistry.sol`**

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

/// @title Certificate Registry for Educational Institutions  
/// @notice Lưu thông tin chứng chỉ giáo dục (hash \+ CID IPFS) lên Blockchain  
/// @dev Triển khai trên mạng Base Sepolia

contract CertificateRegistry {

    // Cấu trúc dữ liệu chứng chỉ  
    struct Certificate {  
        string ipfsCid;        // CID IPFS nơi lưu file PDF  
        bytes32 fileHash;      // Hash SHA-256 của file chứng chỉ  
        bytes32 studentIdHash; // Mã sinh viên đã hash  
        address issuer;        // Địa chỉ ví của nhà trường  
        uint256 issuedAt;      // Dấu thời gian phát hành  
    }

    // Mapping lưu chứng chỉ theo hash  
    mapping(bytes32 \=\> Certificate) public certificates;

    // Sự kiện phát hành chứng chỉ  
    event CertificateIssued(  
        bytes32 indexed fileHash,  
        string ipfsCid,  
        bytes32 indexed studentIdHash,  
        address indexed issuer,  
        uint256 issuedAt  
    );

    /// @notice Đăng ký chứng chỉ mới  
    /// @param \_hash Hash của file chứng chỉ  
    /// @param \_ipfsCid CID IPFS chứa chứng chỉ  
    /// @param \_studentIdHash Mã sinh viên đã hash (ẩn danh)  
    function registerCertificate(  
        bytes32 \_hash,  
        string memory \_ipfsCid,  
        bytes32 \_studentIdHash  
    ) external {  
        require(certificates\[\_hash\].issuedAt \== 0, "Certificate already exists");

        certificates\[\_hash\] \= Certificate({  
            ipfsCid: \_ipfsCid,  
            fileHash: \_hash,  
            studentIdHash: \_studentIdHash,  
            issuer: msg.sender,  
            issuedAt: block.timestamp  
        });

        emit CertificateIssued(\_hash, \_ipfsCid, \_studentIdHash, msg.sender, block.timestamp);  
    }

    /// @notice Kiểm tra chứng chỉ có tồn tại hay không  
    /// @param \_hash Hash của file chứng chỉ  
    /// @return Certificate struct (ipfsCid, issuer, issuedAt)  
    function verifyCertificate(bytes32 \_hash) external view returns (Certificate memory) {  
        require(certificates\[\_hash\].issuedAt \!= 0, "Certificate not found");  
        return certificates\[\_hash\];  
    }

    /// @notice Lấy địa chỉ người phát hành của chứng chỉ  
    function getIssuer(bytes32 \_hash) external view returns (address) {  
        return certificates\[\_hash\].issuer;  
    }

    /// @notice Kiểm tra nhanh chứng chỉ có tồn tại không (boolean)  
    function isRegistered(bytes32 \_hash) external view returns (bool) {  
        return certificates\[\_hash\].issuedAt \!= 0;  
    }  
}

---

## **🧩 4\. Quy trình thực hiện trên Remix**

### **🔧 Bước 1: Chuẩn bị môi trường**

1. Truy cập: [https://remix.ethereum.org](https://remix.ethereum.org/)

2. Tạo file `CertificateRegistry.sol` trong workspace.

3. Tự code \=\> code xịn hơn ở trên.

4. **Solidity Compile, deploy, test trên UI remix**

---

## **🔍 5\. Test chức năng trực tiếp trên Remix**

### **🧪 Test 1: Đăng ký chứng chỉ (registerCertificate)**

1. Mở phần “Deployed Contracts” → `registerCertificate`

Nhập:

 \_hash: 0x8a7f3c... (hash SHA-256 của file)  
\_ipfsCid: QmABC123xyz...  
\_studentIdHash: 0x3bd6f9...

2.   
3. Nhấn **transact** → ký giao dịch MetaMask

4. Xem kết quả:

   * Sự kiện `CertificateIssued` hiển thị trong Logs

   * `TxHash` có thể kiểm tra tại BaseScan

   * Gas tiêu tốn \~ 0.0003 ETH (≈ vài xu)

---

### **🧪 Test 2: Kiểm tra chứng chỉ (verifyCertificate)**

1. Copy lại `_hash` từ bước trước.

2. Nhập vào hàm `verifyCertificate(bytes32)`

3. Bấm **call**

Kết quả trả về:

 ipfsCid: QmABC123xyz...  
fileHash: 0x8a7f3c...  
studentIdHash: 0x3bd6f9...  
issuer: 0xYourUniversityWallet  
issuedAt: 1729592585

4. 

✅ → Nếu ra đúng dữ liệu, chứng chỉ đã được ghi thành công.

---

### **🧪 Test 3: Kiểm tra nhanh (isRegistered)**

1. Dán cùng hash vào `isRegistered(bytes32)`

2. Nếu trả `true` → chứng chỉ tồn tại.

---

### **🧪 Test 4: Lấy issuer (getIssuer)**

Nhập hash → trả về địa chỉ ví của trường.

---

## **🧱 6\. Tích hợp FE/BE sau khi test thành công**

| Thành phần | Mục tiêu | Thông tin cần cung cấp |
| ----- | ----- | ----- |
| **Backend** | Gọi hàm `registerCertificate()` khi trường bấm “Đăng ký on-chain” | `CONTRACT_ADDRESS`, `ABI`, `PRIVATE_KEY` |
| **Frontend** | Dùng wagmi để gọi hàm `verifyCertificate()` và hiển thị kết quả | `CONTRACT_ADDRESS`, `ABI` |

💡 Gợi ý: Export ABI từ Remix → paste vào file `src/lib/abi/CertificateRegistry.json`.

---

## **📘 7\. File ABI cần chia sẻ cho team**

Sau khi compile trên Remix, mở tab “Compilation Details” → copy JSON ABI, ví dụ:

\[  
  {  
    "inputs": \[  
      { "internalType": "bytes32", "name": "\_hash", "type": "bytes32" },  
      { "internalType": "string", "name": "\_ipfsCid", "type": "string" },  
      { "internalType": "bytes32", "name": "\_studentIdHash", "type": "bytes32" }  
    \],  
    "name": "registerCertificate",  
    "outputs": \[\],  
    "stateMutability": "nonpayable",  
    "type": "function"  
  },  
  {  
    "inputs": \[{ "internalType": "bytes32", "name": "\_hash", "type": "bytes32" }\],  
    "name": "verifyCertificate",  
    "outputs": \[  
      {  
        "components": \[  
          { "internalType": "string", "name": "ipfsCid", "type": "string" },  
          { "internalType": "bytes32", "name": "fileHash", "type": "bytes32" },  
          { "internalType": "bytes32", "name": "studentIdHash", "type": "bytes32" },  
          { "internalType": "address", "name": "issuer", "type": "address" },  
          { "internalType": "uint256", "name": "issuedAt", "type": "uint256" }  
        \],  
        "internalType": "struct CertificateRegistry.Certificate",  
        "name": "",  
        "type": "tuple"  
      }  
    \],  
    "stateMutability": "view",  
    "type": "function"  
  }  
\]

---

## **🧠 8\. Best Practices cho dev smart contract**

| Mục tiêu | Cách thực hiện |
| ----- | ----- |
| Tránh duplicate hash | `require(certificates[_hash].issuedAt == 0)` |
| Giảm phí gas | Dùng string thay vì bytes32 cho CID |
| Bảo mật | Chỉ cần public (ai cũng verify được), không cần owner-only |
| Log event để BE sync | `emit CertificateIssued` |
| Giữ backward compatibility | Không đổi mapping key, dùng version contract |

---

## **🧪 9\. Test case checklist**

| Test case | Input | Kết quả mong đợi |
| ----- | ----- | ----- |
| 1️⃣ Đăng ký chứng chỉ mới | Hash mới | `CertificateIssued` event emit |
| 2️⃣ Đăng ký trùng hash | Hash đã tồn tại | Revert `Certificate already exists` |
| 3️⃣ Verify chứng chỉ tồn tại | Hash đúng | Trả thông tin chính xác |
| 4️⃣ Verify chứng chỉ sai | Hash không tồn tại | Revert `Certificate not found` |
| 5️⃣ Kiểm tra issuer | Hash đúng | Trả địa chỉ đúng của trường |
| 6️⃣ Kiểm tra isRegistered | Hash đúng | True |
| 7️⃣ Kiểm tra gas cost | Hash mới | \< 100k gas |

---

## **🚀 10\. Kết quả cuối sau khi deploy**

* **Contract Address:** `0xABC...123`

* **Network:** Base Sepolia

* **Explorer:** [https://sepolia.basescan.org/address/0xABC...123](https://sepolia.basescan.org/address/0xABC...123)

* **Owner (issuer):** ví của trường

* **Event log:** `CertificateIssued` hiển thị tại tab Logs.

---

## **✅ Tóm tắt cho dev SC**

| Giai đoạn | Hành động | Mục tiêu |
| ----- | ----- | ----- |
| 1️⃣ Code contract | Viết, compile trong Remix | Chuẩn cấu trúc |
| 2️⃣ Deploy | Dùng MetaMask – Base Sepolia | Có contract address |
| 3️⃣ Test | Dùng hàm register / verify / isRegistered | Xác minh logic |
| 4️⃣ Export ABI | Dán cho BE & FE team | Đồng bộ API |
| 5️⃣ Ghi lại contract info | `.env` hoặc `README.md` | Team BE dùng deploy info |


```

### _flow_instructions\_frontendflow.json

```json
{
  "project": {
    "name": "CertiChain",
    "studio": "NKD Studio",
    "version": "v1.0.0",
    "date": "2025-10-23",
    "description": "CertiChain là hệ thống xác thực chứng chỉ dựa trên blockchain, kết hợp IPFS để lưu trữ và Base Sepolia để xác minh. Dự án gồm dashboard quản trị cho nhà trường, giao diện người dùng cho sinh viên, và trang xác minh công khai cho nhà tuyển dụng.",
    "objective": {
      "issuer": "Cung cấp giao diện cho Nhà trường để upload, tạo, đăng ký chứng chỉ on-chain",
      "holder": "Cung cấp giao diện công khai cho Sinh viên để xem & chia sẻ chứng chỉ",
      "verifier": "Cung cấp trang xác minh cho Nhà tuyển dụng để quét QR / xác thực chứng chỉ"
    },
    "architecture": "Frontend thông minh nhưng nhẹ — kết nối trực tiếp cả API backend và smart contract thông qua wagmi + ethers.js"
  },
  "techStack": {
    "framework": "Next.js 15 (App Router)",
    "ui": "Tailwind CSS + shadcn/ui + QRCode.react",
    "state": "React Query (TanStack Query) + Zustand",
    "wallet": "wagmi + MetaMask + Base Sepolia",
    "api": "Axios + native fetch",
    "blockchain": "ethers.js (via wagmi hooks)",
    "storage": "web3.storage (thông qua backend)",
    "database": "Prisma ORM",
    "routing": "App Router (/app/*)",
    "deploy": "Vercel"
  },
  "structure": {
    "src": {
      "app": [
        "page.tsx",
        "layout.tsx",
        "globals.css",
        "dashboard/page.tsx",
        "certificates/create/page.tsx",
        "certificates/[id]/page.tsx",
        "verify/[hash]/page.tsx"
      ],
      "components": [
        "CertificateForm.tsx",
        "CertificateCard.tsx",
        "CertificateList.tsx",
        "VerifyResult.tsx",
        "QRDisplay.tsx",
        "Header.tsx",
        "Footer.tsx"
      ],
      "hooks": [
        "useCertificates.ts",
        "useUpload.ts",
        "useVerify.ts",
        "useBlockchain.ts"
      ],
      "lib": [
        "api.ts",
        "wagmiConfig.ts",
        "utils.ts"
      ],
      "state": [
        "ui.ts",
        "data.ts"
      ],
      "types": [
        "certificate.ts",
        "user.ts"
      ]
    },
    "public": [
      "logo.png"
    ]
  },
  "actors": [
    {
      "name": "🏫 Nhà trường (Issuer)",
      "routes": ["/dashboard", "/certificates/create"],
      "description": "Tạo chứng chỉ, upload, ghi on-chain"
    },
    {
      "name": "👩‍🎓 Sinh viên (Holder)",
      "routes": ["/certificates/[id]"],
      "description": "Xem chi tiết, copy link, QR"
    },
    {
      "name": "🏢 Nhà tuyển dụng (Verifier)",
      "routes": ["/verify/[hash]"],
      "description": "Quét QR / verify hash trực tiếp"
    }
  ],
  "frontend": {
    "routes": [
      {
        "path": "/",
        "component": "LandingPage",
        "role": "Public",
        "description": "Giới thiệu hệ thống"
      },
      {
        "path": "/dashboard",
        "component": "DashboardPage",
        "role": "Issuer",
        "description": "Danh sách chứng chỉ, quản lý"
      },
      {
        "path": "/certificates/create",
        "component": "CreateCertificatePage",
        "role": "Issuer",
        "description": "Tạo chứng chỉ, upload"
      },
      {
        "path": "/certificates/[id]",
        "component": "CertificateDetailPage",
        "role": "Holder",
        "description": "Xem và copy link"
      },
      {
        "path": "/verify/[hash]",
        "component": "VerifyPage",
        "role": "Public",
        "description": "Xác minh chứng chỉ"
      }
    ],
    "states": [
      "walletConnected",
      "uploadStatus",
      "verificationResult",
      "certList",
      "userRole"
    ],
    "api_endpoints": [
      {
        "name": "createCertificate",
        "method": "POST",
        "path": "/api/certificates",
        "description": "Tạo chứng chỉ mới, upload IPFS, lưu hash"
      },
      {
        "name": "getCertificates",
        "method": "GET",
        "path": "/api/certificates",
        "description": "Lấy danh sách chứng chỉ của nhà trường"
      },
      {
        "name": "getCertificateDetail",
        "method": "GET",
        "path": "/api/certificates/[id]",
        "description": "Lấy chi tiết chứng chỉ"
      },
      {
        "name": "registerOnChain",
        "method": "POST",
        "path": "/api/certificates/register",
        "description": "Ghi chứng chỉ lên blockchain, tạo transaction"
      },
      {
        "name": "verifyCertificate",
        "method": "GET",
        "path": "/api/certificates/verify",
        "description": "Xác minh chứng chỉ dựa trên hash"
      }
    ],
    "data_flows": [
      "User selects certificate file → UploadForm → IPFS → returns hash",
      "Hash + metadata → Smart Contract write → transaction success → update UI state",
      "Verifier inputs hash → VerifyPanel → fetch contract data → display verification result",
      "Create Certificate Flow: Form submission → API POST /api/certificates → IPFS upload → returns hash → show preview → Register button",
      "Dashboard Flow: API GET /api/certificates → render CertificateList → filter by status (pending/verified) → Register on-chain action",
      "Certificate Detail Flow: API GET /api/certificates/[id] → show student info + QR code → copy link/share options",
      "Verify Flow: API GET /api/certificates/verify?hash=... → show verification result + issuer + date + IPFS/BaseScan links"
    ],
    "integration": {
      "wagmi": {
        "used_hooks": [
          "useAccount",
          "useContractWrite",
          "useContractRead"
        ],
        "network": "Base Sepolia Testnet",
        "config_file": "src/lib/wagmiConfig.ts"
      },
      "ipfs": {
        "provider": "Infura",
        "methods": [
          "uploadFile",
          "getFile"
        ],
        "returns": "IPFS hash (CID)"
      }
    },
    "ui_components": [
      {
        "name": "CertificateForm",
        "description": "Form upload, nhập thông tin chứng chỉ",
        "props": ["onSubmit"]
      },
      {
        "name": "CertificateList",
        "description": "Danh sách chứng chỉ (table hoặc grid)",
        "props": ["certificates[]"]
      },
      {
        "name": "CertificateCard",
        "description": "Thẻ hiển thị chứng chỉ riêng",
        "props": ["certificate"]
      },
      {
        "name": "QRDisplay",
        "description": "Tạo mã QR cho link verify",
        "props": ["value"]
      },
      {
        "name": "VerifyResult",
        "description": "Hiển thị kết quả xác thực on-chain",
        "props": ["data"]
      }
    ],
    "react_query_hooks": [
      {
        "name": "useCertificates",
        "functionality": "Lấy danh sách chứng chỉ",
        "api": "GET /api/certificates"
      },
      {
        "name": "useCreateCertificate",
        "functionality": "Tạo chứng chỉ mới",
        "api": "POST /api/certificates"
      },
      {
        "name": "useRegisterCertificate",
        "functionality": "Ghi lên blockchain",
        "api": "POST /api/certificates/register"
      },
      {
        "name": "useVerify",
        "functionality": "Xác minh chứng chỉ",
        "api": "GET /api/certificates/verify?hash=..."
      }
    ],
    "ui_logic": [
      "Nếu wallet chưa kết nối → hiện nút Connect Wallet",
      "Khi upload thành công → hiển thị hash + nút Verify",
      "Nếu verify thành công → hiện badge 'Verified on-chain'"
    ]
  },
  "ux_states": [
    "Idle",
    "Uploading",
    "UploadSuccess",
    "Verifying",
    "Verified",
    "Error"
  ],
  "frontend_flows": {
    "create_certificate": {
      "path": "/certificates/create",
      "role": "Issuer",
      "steps": [
        "Form nhập: Tên sinh viên, Mã sinh viên, Tên khóa học",
        "Upload file PDF (Drag & Drop)",
        "Khi nhấn 'Tạo chứng chỉ' → gọi API POST /api/certificates",
        "Hiển thị trạng thái 'Đang upload…'",
        "API trả về → hiển thị preview + nút 'Ghi lên blockchain'",
        "Hiển thị: ✅ Certificate created (pending on-chain), File Hash: 0x123abc..."
      ],
      "hooks": ["useCreateCertificate", "useMutation"]
    },
    "dashboard": {
      "path": "/dashboard",
      "role": "Issuer",
      "steps": [
        "FE gọi API GET /api/certificates",
        "Hiển thị danh sách: Họ tên, Tên khóa học, Ngày cấp, Trạng thái (pending/verified)",
        "Nút 'Đăng ký on-chain' (nếu pending)",
        "Khi bấm: FE gọi POST /api/certificates/register với certificateId",
        "BE gọi smart contract → cập nhật trạng thái → FE refetch list"
      ],
      "hooks": ["useCertificates", "useQuery", "useRegisterCertificate"]
    },
    "register_blockchain": {
      "path": "Dashboard hoặc Certificate Detail",
      "role": "Issuer",
      "steps": [
        "User kết nối MetaMask (wagmi hook useAccount)",
        "FE hiển thị ví nhà trường đang dùng",
        "Khi nhấn 'Register on-chain': gọi API /api/certificates/register → trả txHash",
        "Hiển thị toast: 🟢 Registered on Blockchain! Tx: 0xabc123... (View on BaseScan)"
      ],
      "hooks": ["useAccount", "useWriteContract", "useBlockchain"]
    },
    "certificate_detail": {
      "path": "/certificates/[id]",
      "role": "Holder",
      "steps": [
        "Gọi API GET /api/certificates/[id]",
        "Hiển thị: Thông tin sinh viên, khóa học, hash",
        "Nút 'Sao chép link' → copy đường dẫn https://verify.edu.vn/verify/<hash>",
        "Nút 'Tải QR Code' → lưu ảnh QR từ component QRCode.react",
        "Component: <QRCode value={`https://verify.edu.vn/verify/${fileHash}`} size={180} />"
      ],
      "hooks": ["useQuery"]
    },
    "verify_certificate": {
      "path": "/verify/[hash]",
      "role": "Verifier",
      "steps": [
        "Khi mở trang → FE gọi API GET /api/certificates/verify?hash=...",
        "Hiển thị: Hash, Trạng thái (✅ Verified / ❌ Not Found), Issuer, Ngày cấp",
        "Nút 'Xem chứng chỉ trên IPFS' → https://ipfs.io/ipfs/Qm123...",
        "Nút 'Xem giao dịch trên BaseScan' → https://basescan.org/tx/0xabc...",
        "Component: {data.verified ? <VerifiedBadge /> : <UnverifiedAlert />}"
      ],
      "hooks": ["useVerify", "useQuery"]
    }
  },
  "react_query_mapping": {
    "useCertificates": {
      "functionality": "Lấy danh sách chứng chỉ",
      "api": "GET /api/certificates"
    },
    "useCreateCertificate": {
      "functionality": "Tạo chứng chỉ mới",
      "api": "POST /api/certificates"
    },
    "useRegisterCertificate": {
      "functionality": "Ghi lên blockchain",
      "api": "POST /api/certificates/register"
    },
    "useVerify": {
      "functionality": "Xác minh chứng chỉ",
      "api": "GET /api/certificates/verify?hash=..."
    }
  },
  "wagmi_integration": {
    "config_file": "src/lib/wagmiConfig.ts",
    "example": "import { createConfig, http } from 'wagmi'; import { baseSepolia } from 'wagmi/chains'; import { metaMask } from 'wagmi/connectors'; export const config = createConfig({ chains: [baseSepolia], connectors: [metaMask()], transports: { [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/yourKey') } });",
    "hooks_usage": ["useAccount()", "useWriteContract()", "useContractRead()"]
  },
  "ui_state_flow": [
    "[Upload] → 'Đang xử lý hash & IPFS' → 'Đã tạo (pending)'",
    "[Register] → 'Đang gửi giao dịch' → 'Đã verified ✅'",
    "[Share link/QR] → 'Copied ✅'",
    "[Verifier] → 'Verified ✅ / Invalid ❌'"
  ],
  "notes": "File này giúp Agent hiểu toàn bộ flow frontend CertiChain để tự triển khai UI, kết nối IPFS và Base chain. Mọi thành phần đều tối ưu cho Next.js + wagmi + TypeScript. Bổ sung đầy đủ: Tech Stack chi tiết, 3 actors (Issuer/Holder/Verifier), 5 routes chính, React Query hooks, Wagmi integration, UX state flow, và Frontend flows chi tiết cho từng màn hình."
}
```
