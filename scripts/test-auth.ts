/**
 * Test script đơn giản cho Login/Logout
 * Chạy: npx tsx test-auth.ts
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface LoginResponse {
  ok: boolean;
  status: number;
  url?: string;
  error?: string;
}

async function testLogin() {
  console.log("\n🔐 === TEST LOGIN ===");
  console.log("Username: httt22002");
  console.log("Password: sinooStu (raw password, not hash)");

  try {
    // Call NextAuth API
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "httt22002",
        password: "sinooStu",
        csrfToken: "", // NextAuth có thể cần CSRF token
        callbackUrl: `${BASE_URL}/dashboard`,
        json: true,
      }),
    });

    console.log("\n📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);

    // Lấy cookies
    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("🍪 Cookies received:", cookies.substring(0, 100) + "...");
    }

    // Thử đọc response
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      console.log("📦 Response Data:", JSON.stringify(data, null, 2));
      return { ok: response.ok, status: response.status, cookies, data };
    } else {
      const text = await response.text();
      console.log("📄 Response Text:", text.substring(0, 200));
      return { ok: response.ok, status: response.status, cookies, text };
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

async function testLoginSimple() {
  console.log("\n🔐 === TEST LOGIN (Simple Form Data) ===");
  console.log("Username: httt22002");
  console.log("Password: sinooStu");

  try {
    // Sử dụng FormData như form HTML thông thường
    const formData = new URLSearchParams();
    formData.append("username", "httt22002");
    formData.append("password", "sinooStu");
    formData.append("callbackUrl", `${BASE_URL}/dashboard`);

    const response = await fetch(`${BASE_URL}/api/auth/signin/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      redirect: "manual", // Không tự động redirect
    });

    console.log("\n📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);
    console.log("🔗 Redirect Location:", response.headers.get("location"));

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log(
        "🍪 Session Cookie:",
        cookies.includes("next-auth.session-token")
      );
    }

    return { ok: response.ok, status: response.status, cookies };
  } catch (error) {
    console.error("❌ Login Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

async function testGetSession(sessionToken?: string) {
  console.log("\n🔍 === TEST GET SESSION ===");

  try {
    const headers: Record<string, string> = {};
    if (sessionToken) {
      headers["Cookie"] = `next-auth.session-token=${sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/auth/session`, {
      method: "GET",
      headers,
    });

    console.log("📊 Response Status:", response.status);
    const data = await response.json();
    console.log("📦 Session Data:", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("❌ Get Session Error:", error);
    return null;
  }
}

async function testLogout(sessionToken?: string) {
  console.log("\n🚪 === TEST LOGOUT ===");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers["Cookie"] = `next-auth.session-token=${sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/auth/signout`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        callbackUrl: `${BASE_URL}`,
      }),
    });

    console.log("📊 Response Status:", response.status);
    console.log("📊 Response OK:", response.ok);

    const cookies = response.headers.get("set-cookie");
    if (cookies) {
      console.log("🍪 Cookie cleared:", cookies.includes("Max-Age=0"));
    }

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return { ok: false, status: 500, error: String(error) };
  }
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting Authentication Tests...");
  console.log("🌐 Server:", BASE_URL);
  console.log("\n⚠️  Make sure your Next.js server is running: npm run dev");

  // Test 1: Check if server is running
  try {
    const healthCheck = await fetch(BASE_URL);
    if (!healthCheck.ok) {
      console.error(
        "\n❌ Server is not responding. Please start the server first."
      );
      return;
    }
    console.log("✅ Server is running");
  } catch (error) {
    console.error(
      "\n❌ Cannot connect to server. Please start the server first:"
    );
    console.error("   Run: npm run dev");
    return;
  }

  // Test 2: Get session (should be empty/unauthenticated)
  await testGetSession();

  // Test 3: Try login
  await testLoginSimple();

  // Test 4: Alternative login method
  await testLogin();

  // Test 5: Get session after login (should have user data)
  // Note: Trong môi trường test như này, session cookie có thể không persist
  // Cần test qua browser hoặc tools như Postman để test đầy đủ
  console.log("\n⚠️  Note: Session cookies may not persist in this script.");
  console.log(
    "   For full testing, use browser or tools like Postman/Thunder Client"
  );

  // Test 6: Logout
  await testLogout();

  console.log("\n✅ All tests completed!");
  console.log("\n📝 Credentials used:");
  console.log("   Username: httt22002");
  console.log("   Password: sinooStu");
  console.log(
    "   Password Hash (in DB): $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe"
  );
}

// Run tests
runTests().catch(console.error);
