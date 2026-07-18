import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
}

// We use the non-pooling URL for migrations, but pooling is fine for the app.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("CRITICAL ERROR: DATABASE_URL is not set in environment!");
} else {
  console.log("Database connection string initialized. Length:", connectionString.length);
}

// Disable prefetch as it is not supported for "Transaction" pool mode 
export const client = postgres(connectionString as string, { 
  prepare: false,
  ssl: 'require' 
});
export const db = drizzle(client);
