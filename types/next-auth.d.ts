import { DefaultSession } from "next-auth";

// declare custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // include session.user.id
    } & DefaultSession["user"];
  }
}
