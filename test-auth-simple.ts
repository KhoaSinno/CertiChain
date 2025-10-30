/**
 * Test đơn giản: Verify user trong database
 * Chạy: npx tsx test-auth-simple.ts
 */

import "dotenv/config"; // Load environment variables
import { prisma } from "./lib/db";
import bcrypt from "bcrypt";

async function testUserLogin() {
  console.log("🔐 === TEST USER AUTHENTICATION ===\n");

  const testUsername = "httt22002";
  const testPassword = "sinooStu";
  const expectedHash =
    "$2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe";

  try {
    // 1. Tìm user trong database
    console.log("1️⃣ Searching for user:", testUsername);
    const user = await prisma.user.findFirst({
      where: { username: testUsername },
    });

    if (!user) {
      console.error("❌ User not found!");
      return;
    }

    console.log("✅ User found:");
    console.log("   - ID:", user.id);
    console.log("   - Username:", user.username);
    console.log("   - Role:", user.role);
    console.log("   - Password Hash:", user.passwordHash);

    // 2. Verify password hash matches
    console.log("\n2️⃣ Verifying password hash...");
    if (user.passwordHash === expectedHash) {
      console.log("✅ Password hash matches expected hash");
    } else {
      console.log("⚠️  Password hash is different from expected");
      console.log("   Expected:", expectedHash);
      console.log("   Got:", user.passwordHash);
    }

    // 3. Test bcrypt comparison với plain password
    console.log("\n3️⃣ Testing password verification with bcrypt...");
    const isPasswordValid = await bcrypt.compare(
      testPassword,
      user.passwordHash
    );

    if (isPasswordValid) {
      console.log("✅ Password verification SUCCESS!");
      console.log("   Plain password 'sinooStu' matches the hash");
    } else {
      console.log("❌ Password verification FAILED!");
      console.log("   Plain password 'sinooStu' does NOT match the hash");
    }

    // 4. Test với wrong password
    console.log("\n4️⃣ Testing with wrong password...");
    const wrongPasswordTest = await bcrypt.compare(
      "wrongpassword",
      user.passwordHash
    );

    if (!wrongPasswordTest) {
      console.log("✅ Wrong password correctly rejected");
    } else {
      console.log("❌ Wrong password was incorrectly accepted!");
    }

    // 5. Summary
    console.log("\n📊 === TEST SUMMARY ===");
    console.log("Username:", testUsername);
    console.log("Password:", testPassword);
    console.log(
      "Authentication:",
      isPasswordValid ? "✅ WOULD SUCCEED" : "❌ WOULD FAIL"
    );

    // 6. Lấy certificates của user này
    console.log("\n📜 Certificates for this user:");
    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        studentName: true,
        courseName: true,
        status: true,
        issuedAt: true,
      },
    });

    if (certificates.length > 0) {
      certificates.forEach((cert, index) => {
        console.log(
          `   ${index + 1}. ${cert.studentName} - ${cert.courseName} (${
            cert.status
          })`
        );
      });
    } else {
      console.log("   No certificates found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Bonus: Test all seeded users
async function testAllUsers() {
  console.log("\n👥 === ALL USERS IN DATABASE ===\n");

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        passwordHash: true,
        _count: {
          select: { certificates: true },
        },
      },
    });

    console.log(`Found ${users.length} users:\n`);

    for (const user of users) {
      console.log(`🔹 ${user.username}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Certificates: ${user._count.certificates}`);
      console.log(`   Hash: ${user.passwordHash.substring(0, 20)}...`);

      // Test với password "sinooStu" cho students, "sinooAd" cho admin
      const testPass = user.role === "ADMIN" ? "sinooAd" : "sinooStu";
      const isValid = await bcrypt.compare(testPass, user.passwordHash);
      console.log(`   Test password "${testPass}": ${isValid ? "✅" : "❌"}`);
      console.log();
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
console.log("🚀 Starting Database Authentication Tests...\n");

testUserLogin()
  .then(() => testAllUsers())
  .then(() => {
    console.log("✅ All tests completed!");
  })
  .catch(console.error);
