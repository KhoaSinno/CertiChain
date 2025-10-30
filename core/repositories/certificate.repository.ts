// QUERY DATABASE FOR CERTIFICATES

import { prisma } from "@/lib/db";
import type { Prisma, Certificate } from "@/app/generated/prisma/client";

const db = prisma;

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
  async findAll(): Promise<Certificate[]> {
    return prisma.certificate.findMany();
  }

  // -- FIND CERTIFICATE BY ID --
  async findById(id: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({
      where: { id: Number(id) },
    });
  }

  // -- FIND BY HASH --
  async findByHash(fileHash: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({
      where: { fileHash },
    });
  }

  // -- UPDATE CERTIFICATE STATUS --
  async updateStatus(
    id: string,
    status: string,
    blockchainTx: string
  ): Promise<Certificate | null> {
    return prisma.certificate.update({
      where: { id: Number(id) },
      data: { status, blockchainTx },
    });
  }
}
