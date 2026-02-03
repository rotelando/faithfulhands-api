import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { user, account, session, verification } from "../db/schema";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.FRONTEND_URL!],
  
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
        role: {
            type: 'string', required: true, defaultValue: 'staff', input: true,
        },
        imageCldPubId: {
            type: 'string', required: false, input: true,
        },
    }
  }
});