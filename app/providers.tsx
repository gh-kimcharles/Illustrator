"use client";

import { SessionProvider } from "next-auth/react";

// move: useSession() in all client components
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
