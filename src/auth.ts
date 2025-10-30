import { prisma } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

const db = prisma;

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  // -- SESSION
  session: {
    strategy: "jwt", // IF don't adapter, must to use "jwt"
  },

  // -- PROVIDERS
  providers: [
    Credentials({
      // Define fields
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },

      async authorize(credentials) {
        // Check valid credentials
        const parsedCredentials = z
          .object({
            username: z.string().min(3),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          // Get user from username

          const user = await db.user.findFirst({
            where: { username: username },
          });

          if (!user) return null;

          // check password
          const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (isPasswordValid)
            return {
              id: user.id.toString(),
              username: user.username,
              role: user.role,
            };
        }

        return null;
      },
    }),
  ],

  // -- CALLBACKS
  callbacks: {
    // jwt callback
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    // session callback
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export for API route
export { handler as GET, handler as POST };
