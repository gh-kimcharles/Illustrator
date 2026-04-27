import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

// prisma update version: v7 to v5, auth remains v4
export const authOptions: NextAuthOptions = {
  // use prisma as the session/account store
  // for OAuth account linking,
  // but know that credentials sessions are JWT only.
  adapter: PrismaAdapter(prisma),

  // use JWT strategy
  session: { strategy: "jwt" },

  // custom pages
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },

  providers: [
    // credentials (email and password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // no user found or no password (OAuth-only account)
        if (!user || !user.password) return null;

        // compare submitted password against stored bcrypt hash
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatch) return null;

        // return the user object - NextAuth puts this in the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),

    // Google OAuth
    // add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local to activate.
    // get credentials: https://console.cloud.google.com/apis/credentials
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    // embed user.id into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // expose token.id as session.user.id
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
