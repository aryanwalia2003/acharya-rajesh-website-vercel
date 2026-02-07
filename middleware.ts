import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

// Define which paths trigger the middleware
export const config = {
  matcher: ["/admin/:path*", "/book/:path*"],
};