import NextAuth from "next-auth";
import { query } from "./db";
import { idGenerator } from "./id-generator";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: authConfig.providers, // Explicitly pass providers again if spread doesn't catch them due to strictness
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      console.log("-----------------------------------------");
      console.log("AUTH START: signIn callback triggered");
      console.log("User Email:", user.email);
      
      if (!user.email) {
        console.error("AUTH ERROR: No email provided in user object");
        return false;
      }

      try {
        // 1. Check if user exists using Raw SQL
        console.log("DB CHECK START: querying users table for", user.email);
        const userResult = await query("SELECT * FROM users WHERE email = $1", [user.email]);
        console.log("DB CHECK END: Found rows:", userResult.rowCount);
        
        if (userResult.rowCount === 0) {
          console.log("USER CREATION: User not found, creating new user...");
          
          // 2. If not, create a new user with Snowflake ID
          let newId;
          try {
             newId = idGenerator.nextId().toString(); // Convert to String for safety
             console.log("ID GENERATION: Generated new ID:", newId);
          } catch (idError) {
             console.error("ID GENERATION ERROR:", idError);
             throw idError; // Re-throw to be caught by outer catch
          }

          const role = user.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'READER';
          console.log("ROLE ASSIGNMENT: Assigned role:", role);
          
          console.log("DB INSERT START: Inserting new user record...");
          await query(
            "INSERT INTO users (id, email, name, role) VALUES ($1, $2, $3, $4)",
            [newId, user.email, user.name, role]
          );
          console.log("DB INSERT END: User created successfully");
        } else {
          console.log("USER FOUND: User already exists, proceeding...");
        }

        console.log("AUTH SUCCESS: signIn callback completed");
        console.log("-----------------------------------------");
        return true;
      } catch (error) {
        console.error("-----------------------------------------");
        console.error("CRITICAL AUTH ERROR at signIn callback:", error);
        console.error("Stack Trace:", error instanceof Error ? error.stack : "No stack trace");
        console.error("-----------------------------------------");
        return false;
      }
    },
    async session({ session }) {
      try {
        if (session.user?.email) {
          const userResult = await query("SELECT id, role FROM users WHERE email = $1", [session.user.email]);
          if (userResult.rowCount && userResult.rowCount > 0) {
            session.user.id = userResult.rows[0].id.toString();
            session.user.role = userResult.rows[0].role;
          }
        }
      } catch (e) {
        console.error("Session callback error:", e);
      }
      return session;
    },
  },
});