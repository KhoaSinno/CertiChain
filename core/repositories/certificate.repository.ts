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
