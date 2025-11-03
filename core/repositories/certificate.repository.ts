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
    return prisma.certificate.findMany({
      include: { student: true },
    });
  }

  // -- FIND CERTIFICATE BY ID --
  async findById(id: string): Promise<Certificate | null> {
    return prisma.certificate.findUnique({
      where: { id: Number(id) },
      include: { student: true },
    });
  }

  // -- FIND BY HASH --
  async findByHash(txtHash: string): Promise<Certificate | null> {
    return prisma.certificate.findFirst({
      where: { blockchainTx: txtHash },
      include: { student: true },
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
