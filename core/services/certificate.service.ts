import { pinata } from "@/utils/config";
import { CertificateRepository } from "../repositories/certificate.repository";
import crypto from "crypto";
import { UserService } from "./user.service";
import { BlockchainService } from "../repositories/blockchain.repository";

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
  private userService = new UserService();
  private blockchainService = new BlockchainService();

  // -- UPLOAD + IPFS FILE --
  async createCertificate({
    file,
    // studentName,
    // studentId,
    courseName,
    userId,
  }: CertificateUploadInput) {
    // Check student exist
    const student = await this.userService.getUserById(userId);
    if (!student) {
      throw new Error("Student not found");
    }

    // HASH FILE
    const fileHash = certSha256(Buffer.from(await file.arrayBuffer()));

    // ✅ CHECK DUPLICATE CERTIFICATE
    const existingCert = await this.certRepo.findByHash(fileHash);
    if (existingCert) {
      throw new Error(
        `Certificate already exists with ID: ${existingCert.id}. This file has been uploaded before.`
      );
    }

    // file IPFS upload
    const { cid: fileCID } = await pinata.upload.public.file(file);
    const fileURL = await pinata.gateways.public.convert(fileCID);
    console.log("📄 File URL:", fileURL);
    // METADATA JSON upload
    const { cid: metadataCID } = await pinata.upload.public.json({
      name: `Certificate: ${courseName} - KDN Team`,
      // description: `Official blockchain certificate issued by KDN Business.`,
      // external_url: fileURL, // Change it to website URL verify + Put var in .env
      image: fileURL, // file PDF (IPFS gateway link)
      attributes: [
        { trait_type: "Course Name", value: courseName },
        { trait_type: "Student Name", value: student.studentName },
        { trait_type: "Student ID", value: student.studentId },
        { trait_type: "Issuer", value: process.env.ISSUER_WALLET },
        { trait_type: "Issued At", value: new Date().toISOString() },
        { trait_type: "File Hash", value: fileHash },
      ],
    });

    const metadataURL = await pinata.gateways.public.convert(metadataCID);
    console.log("📝 Metadata URL:", metadataURL);

    const issuerAddress = process.env.ISSUER_WALLET!;

    // DB store certificate
    const cert = await this.certRepo.createWithUserId({
      courseName,
      fileHash,
      ipfsFile: fileURL, // MOCK test
      issuerAddress,
      userId,
      ipfsMetadata: metadataURL,
      // status: "verified",
    });

    // Call store onchain // TODO: Add more metadata urls if needed
    const registerTx = await this.blockchainService.registerOnChain(fileHash);

    // Update the status to verified
    await this.certRepo.updateStatus(
      cert.id.toString(),
      "verified",
      registerTx
    );

    // call function blockchainService => mint nft
    const txNFT = await this.blockchainService.mintCertificate(
      fileHash,
      `ipfs://${metadataCID}`
    );

    console.log("Tokens mint", txNFT);

    return {
      id: cert.id,
      fileHash,
      ipfsFile: fileURL,
      fileURL,
      status: cert.status,
      metadataURL,
    };
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
