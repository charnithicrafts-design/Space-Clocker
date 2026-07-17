import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

export default defineConfig({
  schema: "./api/db/schema.ts",
  out: "./api/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
});
