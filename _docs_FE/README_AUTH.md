# 📚 Authentication Documentation

## Available Guides

### 🚀 [Quick Start Guide](./QUICK_START_AUTH.md)

**5-minute setup** - Copy-paste examples cho các use cases phổ biến nhất.

**Best for:** Bắt đầu nhanh, cần implement login/logout basic.

---

### 📖 [Complete FE Guide](./FE_AUTH_GUIDE.md)

**Comprehensive documentation** - Hướng dẫn chi tiết về authentication patterns, best practices, troubleshooting.

**Best for:** Hiểu sâu về authentication flow, advanced patterns, production setup.

---

### 🧪 [Testing Guide](../TEST_AUTH.md)

**Testing documentation** - Hướng dẫn test authentication qua script và browser.

**Best for:** QA, testing authentication functionality.

---

## Quick Reference

### Authentication Files Structure

```
certi_chain/
├── src/
│   └── auth.ts                    # NextAuth configuration
├── lib/
│   └── auth.ts                    # Server-side auth helper
├── types/
│   └── next-auth.d.ts            # TypeScript type definitions
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts              # NextAuth API route
│   ├── layout.tsx                # Root layout with SessionProvider
│   └── providers.tsx             # Client-side providers
├── test-auth.ts                  # Auth API test script
└── test-auth-simple.ts           # Database auth test script
```

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://...
```

### Test Credentials

| Username | Password | Role |
|----------|----------|------|
| httt22002 | sinooStu | STUDENT |
| admin | sinooAd | ADMIN |

---

## Choose Your Path

### 👨‍💻 I'm a Frontend Developer

→ Start with [Quick Start Guide](./QUICK_START_AUTH.md)  
→ Reference [Complete FE Guide](./FE_AUTH_GUIDE.md) when needed

### 🧪 I'm Testing Authentication

→ Use [Testing Guide](../TEST_AUTH.md)  
→ Run test scripts: `npx tsx test-auth.ts`

### 🏗️ I'm Setting Up Production

→ Read [Complete FE Guide](./FE_AUTH_GUIDE.md)  
→ Focus on "Best Practices" and "Protected Routes" sections

---

## Common Tasks

### Login User

```tsx
import { signIn } from "next-auth/react";

await signIn("credentials", {
  username: "httt22002",
  password: "sinooStu",
  redirect: false,
});
```

### Check Auth Status

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
```

### Logout User

```tsx
import { signOut } from "next-auth/react";

await signOut({ redirect: false });
```

### Protect Server Component

```tsx
import { auth } from "@/lib/auth";

const session = await auth();
if (!session) redirect("/login");
```

---

## Need Help?

1. Check [Quick Start](./QUICK_START_AUTH.md) for examples
2. Read [Complete Guide](./FE_AUTH_GUIDE.md) for details
3. See [Testing Guide](../TEST_AUTH.md) for troubleshooting
4. Check browser console for errors
5. Verify environment variables in `.env`

---

**Last Updated:** October 30, 2025
