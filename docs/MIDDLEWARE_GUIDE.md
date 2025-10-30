# 🛡️ Middleware - Route Protection

## Overview

File `middleware.ts` ở **root của project** xử lý authentication và authorization cho tất cả routes.

**Location:** `w:\WorkSpace_IT\_nextjs\certi_chain\middleware.ts`

---

## Features

### 🔐 Authentication Protection

- Redirect to `/login` if accessing protected routes without authentication
- Redirect to `/dashboard` if accessing `/login` while already logged in

### 👤 Role-Based Access Control

- **ADMIN only**: `/certificates/create`
- **All authenticated users**: `/dashboard`, `/certificates/view`
- **Public**: `/`, `/login`, `/verify/*`

---

## Route Configuration

### Public Routes (No Auth Required)

```typescript
✅ /                      // Homepage
✅ /login                 // Login page
✅ /verify/*              // Certificate verification pages
✅ /api/certificates/verify // Verification API
```

### Protected Routes (Auth Required)

```typescript
🔐 /dashboard             // All authenticated users
🔐 /certificates/view/*   // All authenticated users
```

### Admin-Only Routes

```typescript
👑 /certificates/create   // ADMIN only
```

---

## How It Works

### Flow Diagram

```text
User Request
    ↓
Middleware Check
    ↓
Is authenticated? → No → Redirect to /login
    ↓ Yes
Is admin-only route? → Yes → Is ADMIN? → No → Redirect to /dashboard
    ↓ No                       ↓ Yes
Allow access              Allow access
```

### Code Logic

```typescript
// 1. Get JWT token from cookies
const token = await getToken({ req: request });

// 2. Check if protected route
if (isProtectedPath && !token) {
  // Redirect to login with callback URL
  return redirect("/login?callbackUrl=/dashboard");
}

// 3. Check admin-only routes
if (isAdminPath && token.user?.role !== "ADMIN") {
  // Redirect non-admin to dashboard
  return redirect("/dashboard");
}

// 4. Allow access
return NextResponse.next();
```

---

## Testing

### Test as STUDENT

```bash
# Login
Username: httt22002
Password: sinooStu

# Try to access routes
✅ GET /dashboard              → Success (200)
✅ GET /certificates/view/1    → Success (200)
❌ GET /certificates/create    → Redirect to /dashboard
❌ GET /login                  → Redirect to /dashboard (already logged in)
```

### Test as ADMIN

```bash
# Login
Username: admin
Password: sinooAd

# Try to access routes
✅ GET /dashboard              → Success (200)
✅ GET /certificates/create    → Success (200)
✅ GET /certificates/view/1    → Success (200)
❌ GET /login                  → Redirect to /dashboard (already logged in)
```

### Test Unauthenticated

```bash
# No login (no session)

# Try to access routes
✅ GET /                       → Success (public)
✅ GET /login                  → Success (public)
✅ GET /verify/abc123          → Success (public)
❌ GET /dashboard              → Redirect to /login?callbackUrl=/dashboard
❌ GET /certificates/create    → Redirect to /login?callbackUrl=/certificates/create
```

---

## Matcher Configuration

Middleware processes these paths:

```typescript
matcher: [
  "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|api/certificates/verify).*)"
]
```

### Excluded Paths (Middleware SKIPS these)

```text
❌ /api/auth/*               // NextAuth routes
❌ /_next/static/*          // Static files
❌ /_next/image/*           // Image optimization
❌ /favicon.ico             // Favicon
❌ /api/certificates/verify // Public verification API
❌ /public/*                // Public folder
```

---

### Callback URL Feature

When redirecting to login, middleware saves the original URL:

```text
User tries: /certificates/create
           ↓
Redirect: /login?callbackUrl=/certificates/create
           ↓
After login: Redirect back to /certificates/create
```

### Frontend Implementation

```tsx
// pages/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLogin = async (username: string, password: string) => {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push(callbackUrl); // Redirect to original URL
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleLogin(
        formData.get("username") as string,
        formData.get("password") as string
      );
    }}>
      <input name="username" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Debugging

### Check if middleware is running

Add console.log:

```typescript
export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware:", request.nextUrl.pathname);
  
  const token = await getToken({ req: request });
  console.log("🔐 Token:", token ? "✅ Found" : "❌ None");
  
  // ... rest of code
}
```

### Common Issues

#### 1. Infinite redirect loop

**Problem:** Redirecting to a path that middleware also protects

**Solution:** Make sure redirect target is public or excluded from matcher

```typescript
// ❌ Bad: Redirects to protected path
return NextResponse.redirect(new URL("/dashboard", request.url));

// ✅ Good: Redirects to public path
return NextResponse.redirect(new URL("/login", request.url));
```

#### 2. Middleware not running

**Problem:** Path excluded from matcher

**Solution:** Check matcher configuration

```typescript
// Add your path to matcher
matcher: [
  "/your-path/:path*",
  "/((?!api/auth|_next).*)"
]
```

#### 3. Token not found

**Problem:** NEXTAUTH_SECRET not set or incorrect

**Solution:** Check `.env` file

```env
NEXTAUTH_SECRET=your-secret-here
```

---

## Customization

### Add New Protected Route

```typescript
const isProtectedPath =
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/certificates/create") ||
  pathname.startsWith("/certificates/view") ||
  pathname.startsWith("/your-new-route"); // ← Add here
```

### Add New Public Route

Simply don't add it to protected paths, or explicitly handle it:

```typescript
// Allow public access
if (pathname.startsWith("/your-public-route")) {
  return NextResponse.next();
}
```

### Add New Admin-Only Route

```typescript
const isAdminPath =
  pathname.startsWith("/certificates/create") ||
  pathname.startsWith("/admin"); // ← Add here

if (isAdminPath && token?.user?.role !== "ADMIN") {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

---

## Security Best Practices

### ✅ DO

- Always check authentication before authorization
- Use `getToken()` from `next-auth/jwt`
- Store secret in environment variables
- Log access attempts for debugging
- Validate token signature

### ❌ DON'T

- Don't trust client-side auth state alone
- Don't expose sensitive routes in matcher
- Don't hardcode secrets
- Don't skip token validation
- Don't create redirect loops

---

## Next.js 15 Compatibility

This middleware is compatible with:

- ✅ Next.js 15 App Router
- ✅ NextAuth v4
- ✅ Turbopack (dev mode)
- ✅ Server Components
- ✅ Client Components

---

## Related Documentation

- [Authentication Guide](./FE_AUTH_GUIDE.md)
- [Certificate API](./FE_CERTIFICATE_API.md)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth JWT Docs](https://next-auth.js.org/configuration/nextjs#middleware)

---

**File Location:** `middleware.ts` (root of project)  
**Last Updated:** October 30, 2025
