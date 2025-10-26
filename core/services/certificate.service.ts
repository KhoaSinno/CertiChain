import { pinata } from "@/utils/config";
import { CertificateRepository } from "../repositories/certificate.repository";
import crypto from "crypto";

type CertificateUploadInput = {
  file: File;
  studentName: string;
  studentId: string;
  courseName: string;
};

export const certSha256 = (buffer: Buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

export class CertificateService {
  private certRepo = new CertificateRepository();

  // -- UPLOAD + IPFS FILE --
  async createCertificate({
    file,
    studentName,
    studentId,
    courseName,
  }: CertificateUploadInput) {
    // Upload file to IPFS
    const fileHash = certSha256(Buffer.from(await file.arrayBuffer()));
    const studentIdHash = certSha256(Buffer.from(studentId));

    const { cid } = await pinata.upload.public.file(file);
    const url = await pinata.gateways.public.convert(cid);
    const issuerAddress = process.env.ISSUER_WALLET!;

    const cert = await this.certRepo.create({
      studentName,
      courseName,
      fileHash,
      ipfsCid: cid,
      studentIdHash,
      issuerAddress,
    });

    // return NextResponse.json(url, { status: 200 });

    return { id: cert.id, fileHash, ipfsCid: cid, url, status: cert.status };
  }
}
