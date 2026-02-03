import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { user, account, session, verification } from "../db/schema/index.js";

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
        imageCldPubId: {
            type: 'string', required: false, input: true,
        },
    }
  }
});