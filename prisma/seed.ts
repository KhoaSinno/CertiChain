import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

async function main() {
  // Hash passwords với bcrypt
  const saltRounds = 10;

  // Tạo users với password được hash
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "httt22001",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        username: "httt22002",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        username: "httt22003",
        passwordHash: await bcrypt.hash("sinooStu", saltRounds),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        username: "admin",
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
        studentName: "Danica Jane Maglayo",
        studentIdHash:
          "2ab654b93d08a274e519d869fd164c93f0f8138599b197d25017fc4b5958db59", // httt22001
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
        studentName: "Jane Doe",
        studentIdHash:
          "eb6afd674b0616f0f157e35e6bb1803851fc1f35fd9cd09a75b48354d20fc006", // httt22002
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
        studentName: "Jennifer Benbow",
        studentIdHash:
          "f78435b92de21febe98363e42450e3c48160ab9f3a7146e6ca1c48e231cd2176", // httt22003
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
        studentName: "Liang Shu-Hsiang",
        studentIdHash:
          "e7eafed3add7ae685ae04713ff89c478154376f4a5bcdc41de76bff21c3bd330", // httt22004
        courseName: "Toeic Certificate",
        fileHash:
          "fc085bee6fa69a7fd8a93b25c75162acf7ebc9c5c0ee563d822d4a1683cc7f8b",
        ipfsCid: "bafybeiewbaqggkvurvlj5onej2bsdtmu6kgsregi777f2w7lj7jse6z4re",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[0].id, // Gán cho user đầu tiên
      },
      {
        studentName: "Mariah Smith",
        studentIdHash:
          "8f8e0df7774fb61d4262e042a32a40ec2654dd39eb78eb9ef49cf6b27ed14882", // httt22005
        courseName: "Certificate of Achievement in Blockchain",
        fileHash:
          "d48d31973a2676fff595a3a4ab2c6a8735589b83d9b2c0619f16e7663e4d4321",
        ipfsCid: "bafkreiguruyzoorgo377lfndusvsy2uhgvmjxa6zwlagdhyw45td4tkdee",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[1].id, // Gán cho user thứ 2
      },
      {
        studentName: "Peter Baker",
        studentIdHash:
          "4ae408c677ee1cca73e698acb95e77cb59aa2cdef732a74d63dc2350a7b4c817", // httt22006
        courseName: "Certificate of The best Employee learn Blockchain",
        fileHash:
          "33c393dcc9a8c0210d48798cac743e5741aa1d9d074f554ca4fdbfc85454756a",
        ipfsCid:
          "bafkreibtyoj5zsniyaqq2sdzrswhipsxigvb3hihj5kuzjh5kuzjh5x7efivdvni",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[2].id, // Gán cho user thứ 3
      },
      {
        studentName: "Willie Smith",
        studentIdHash:
          "43d42268c0a21fef6b08ae2f1f3752245fec0ae6588856c2a99dade001786605", // httt22007
        courseName: "Certificate of Completion CraftMyPDF education program",
        fileHash:
          "f1383e98fe7a20c51cdd8e42ecf5667c9d29510fb84de75e3e4ab696861ded3a",
        ipfsCid: "bafkreihrha7jr7t2edcrzxmoilwpkzt4tuuvcd5yjxtv4pskw2limhpnhi",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[0].id, // Gán cho user đầu tiên
      },
      {
        studentName: "Nguyễn Hữu Hoàn Thiện",
        studentIdHash:
          "2a797aae79685d9f7fe5229ef4e43765ee8d7485bd7d06297904c7042ab84ec7", // httt22008
        courseName: "Vstep Certificate",
        fileHash:
          "146687b95c77271ad1e4922a3999bf857ba69b87a5ca5c37eb723dbda0350c04",
        ipfsCid: "bafkreiaum2d3sxdxe4nndzesfi4ztp4fpotjxb5fzjodp23shw62animaq",
        issuerAddress: "0xbEb7518cD8F8f096A23426AE3c8a9d778b4CBf00",
        blockchainTx: "", // empty because not yet registered
        status: "pending",
        issuedAt: new Date(),
        userId: users[1].id, // Gán cho user thứ 2
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
