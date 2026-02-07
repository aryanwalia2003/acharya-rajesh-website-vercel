import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [Google],
  callbacks: {
    // We can add simple authorized callback here if needed, 
    // but for now we keep it empty or minimal to avoid DB calls.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/admin") || 
                               nextUrl.pathname.startsWith("/book");

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
