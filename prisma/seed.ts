import { prisma } from "../lib/db";

async function main() {
  const certificate = await prisma.certificate.create({
    data: {
      studentName: "John Doe",
      studentIdHash: "hashed_student_id",
      courseName: "Blockchain Basics",
      fileHash: "unique_file_hash",
      ipfsCid: "ipfs_cid",
      issuerAddress: "issuer_address",
      blockchainTx: "blockchain_transaction_id",
      status: "pending",
      issuedAt: new Date(),
    },
  });
  console.log("Seeded certificate:", certificate);
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
