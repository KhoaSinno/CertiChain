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
