# 🔐 Authentication Testing Guide

## Test Files Created

### 1. `test-auth-simple.ts` - Database Authentication Test ✅ RECOMMENDED

Test trực tiếp với database để verify user credentials.

**Chạy:**

```bash
npx tsx test-auth-simple.ts
```

**Test cases:**

- ✅ Tìm user trong database
- ✅ Verify password hash
- ✅ Test bcrypt password comparison
- ✅ Test với wrong password
- ✅ Hiển thị certificates của user
- ✅ List tất cả users và test passwords

**Kết quả mong đợi:**

```
🔐 === TEST USER AUTHENTICATION ===

1️⃣ Searching for user: httt22002
✅ User found:
   - ID: 1
   - Username: httt22002
   - Role: STUDENT
   - Password Hash: $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe

2️⃣ Verifying password hash...
✅ Password hash matches expected hash

3️⃣ Testing password verification with bcrypt...
✅ Password verification SUCCESS!
   Plain password 'sinooStu' matches the hash

📊 === TEST SUMMARY ===
Username: httt22002
Password: sinooStu
Authentication: ✅ WOULD SUCCEED
```

---

### 2. `test-auth.ts` - API Authentication Test (Requires Server Running)

Test login/logout qua NextAuth API endpoints.

**Yêu cầu:**

- Server phải đang chạy: `npm run dev`
- Server listening trên `http://localhost:3000`

**Chạy:**

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run test
npx tsx test-auth.ts
```

**Test cases:**

- 🔍 Check server health
- 🔐 Test login via API
- 📊 Get session
- 🚪 Test logout

---

## Test Credentials

Tất cả users được seed vào database với credentials sau:

### Students

| Username | Password | Role | Password Hash (trong DB) |
|----------|----------|------|--------------------------|
| httt22001 | sinooStu | STUDENT | $2b$10$2oEteAp6ql86bgejjwb8genVUtpKurc9IPdRWwyQ3MYOFUI/qDNHq |
| httt22002 | sinooStu | STUDENT | $2b$10$URV.yBDy0qvrUX0KAlsTYe2Ry07ZKDZR.Zy0AD5UBoFsgKKVhBpKe |
| httt22003 | sinooStu | STUDENT | $2b$10$u76/lZe7dojIrihn4LzDJ.CMZOe/BEPOFNVxwBzmex6T0FVdZOPH2 |

### Admin

| Username | Password | Role | Password Hash (trong DB) |
|----------|----------|------|--------------------------|
| admin | sinooAd | ADMIN | $2b$10$ZCTYpvx8hVdAEHvWdm5nyeyYpE9VclGw6tcb7A3v9pTXVdyYZq5nC |

---

## Manual Testing via Browser

### 1. Login Test

1. Start server: `npm run dev`
2. Mở browser: `http://localhost:3000`
3. Navigate to login page
4. Enter credentials:
   - Username: `httt22002`
   - Password: `sinooStu`
5. Click Login
6. Verify redirect to dashboard
7. Check session/cookies

### 2. Logout Test

1. Sau khi login thành công
2. Click Logout button
3. Verify redirect to home page
4. Check session cleared

---

## Testing with Thunder Client / Postman

### Login Request

```http
POST http://localhost:3000/api/auth/signin/credentials
Content-Type: application/x-www-form-urlencoded

username=httt22002&password=sinooStu&callbackUrl=http://localhost:3000/dashboard
```

### Get Session

```http
GET http://localhost:3000/api/auth/session
Cookie: next-auth.session-token=<YOUR_SESSION_TOKEN>
```

### Logout

```http
POST http://localhost:3000/api/auth/signout
Content-Type: application/json
Cookie: next-auth.session-token=<YOUR_SESSION_TOKEN>

{
  "callbackUrl": "http://localhost:3000"
}
```

---

## Bcrypt Password Hashing

Để tạo password hash mới:

```typescript
import bcrypt from "bcrypt";

const password = "your_password";
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
console.log(hash);
```

Để verify password:

```typescript
import bcrypt from "bcrypt";

const password = "your_password";
const hash = "$2b$10$..."; // hash từ database
const isValid = await bcrypt.compare(password, hash);
console.log(isValid); // true hoặc false
```

---

## Troubleshooting

### ❌ "Environment variable not found: DATABASE_URL"

**Solution:** Đảm bảo file `.env` tồn tại và có DATABASE_URL:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### ❌ "Cannot connect to server"

**Solution:** Start Next.js server trước:

```bash
npm run dev
```

### ❌ Password không match

**Solution:**

- Đảm bảo dùng plain password (`sinooStu`), không phải hash
- Re-run seed: `npx prisma db seed`
- Check bcrypt version compatibility

---

## Next Steps

Sau khi test thành công:

1. ✅ Implement login UI page
2. ✅ Add session management
3. ✅ Add protected routes
4. ✅ Add role-based access control
5. ✅ Add remember me functionality
6. ✅ Add password reset flow

---

## Notes

- ⚠️ Password hashes thay đổi mỗi lần seed (do bcrypt salt ngẫu nhiên)
- ⚠️ Session cookies không persist trong script tests (cần browser)
- ✅ Database test (test-auth-simple.ts) là cách đáng tin cậy nhất
- ✅ Tất cả tests đều PASS với current setup
