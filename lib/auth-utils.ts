import { auth } from "@/lib/auth";

/**
 * Shared utility to check if the current user is an Admin.
 * Can be used in Server Components, Server Actions, and API Routes.
 */
export async function isAdmin() {
  const session = await auth();
  
  // Checks if user exists and has the ADMIN role
  return session?.user?.role === 'ADMIN';
}

/**
 * Optional: Get the current user ID (Snowflake) safely as a string
 */
export async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}