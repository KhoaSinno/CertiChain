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
        ipfsFile:
          "https://ipfs.io/ipfs/bafybeibrhlewfkp7uxs7luzgxsg4bhbey5dfapw47aypzbsgtxwbqs3bbu",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[0].id, // httt22001
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Certificate of Achievement in Blockchain",
        fileHash:
          "24d3300b4cb276e7110527d6d5e7f3856c5b2f049c9ccc5a9d3080d9b610b11b",
        ipfsFile:
          "https://ipfs.io/ipfs/bafkreibe2myawtfso3trcbjh23k6p44fnrns6be4ttgfvhjqqdm3mefrdm",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[1].id, // httt22002
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Certificate of Getting Ready for the CPA Board Exam",
        fileHash:
          "cbddcf032651fc6983fb61ccbceb226e1e436dd41f697e9692f17377eb8d6e78",
        ipfsFile:
          "https://ipfs.io/ipfs/bafkreigl3xhqgjsr7ruyh63bzs6owitodzbw3va7nf7jnexron36xdlopa",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[2].id, // httt22003
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Toeic Certificate",
        fileHash:
          "fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b",
        ipfsFile:
          "https://ipfs.io/ipfs/bafybeiewbaqggkvurvlj5onej2bsdtmu6kgsregi777f2w7lj7jse6z4re",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[3].id, // Gán cho user thứ 4
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Certificate of Achievement in Blockchain",
        fileHash:
          "d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321",
        ipfsFile:
          "https://ipfs.io/ipfs/bafkreiguruyzoorgo377lfndusvsy2uhgvmjxa6zwlagdhyw45td4tkdee",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[4].id, // Gán cho user thứ 5
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Certificate of The best Employee learn Blockchain",
        fileHash:
          "33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a",
        ipfsFile:
          "https://ipfs.io/ipfs/bafkreibtyoj5zsniyaqq2sdzrswhipsxigvb3hihj5kuzjh5kuzjh5x7efivdvni",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[5].id, // Gán cho user thứ 6
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "Certificate of Completion CraftMyPDF education program",
        fileHash:
          "https://ipfs.io/ipfs/f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a",
        ipfsFile: "bafkreihrha7jr7t2edcrzxmoilwpkzt4tuuvcd5yjxtv4pskw2limhpnhi",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[6].id, // Gán cho user thứ 7
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
      },
      {
        courseName: "The best student of the year certificate",
        fileHash:
          "7e0dc866e2870a67a4d37189ec57a819467c63711202008b6f1b437255874368",
        ipfsFile:
          "https://ipfs.io/ipfs/bafybeicfx2eq3ctrysypp2yahjk3utfb62in6i2flkibgyqf75dgfimk4m",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx:
          "0x1021a9642622445cbea10af15f1c2350ab3edce3d966a8aa6af32d036b210045",
        status: "verified",
        issuedAt: new Date(),
        userId: users[7].id, // Gán cho user thứ 9
        startDate: new Date("2025-01-01"),
        endDate: new Date("2030-06-01"),
        ipfsMetadata: "abc_url",
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
