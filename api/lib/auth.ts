import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-key-that-is-at-least-32-chars-long!",
  baseURL: process.env.BETTER_AUTH_URL || process.env.VITE_PUBLIC_APP_URL || "http://localhost:3000",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-client-id-needs-setup',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-client-secret-needs-setup',
    },
  },
  advanced: {
    // Allows preview deployments to work out of the box in Vercel
    crossSubDomainCookies: {
      enabled: true,
    },
  },
});
