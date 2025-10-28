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
        studentIdHash: string;
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
        studentIdHash: string;
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
