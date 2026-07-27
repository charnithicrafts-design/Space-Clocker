import { createAuthClient } from "better-auth/react";

// For Vercel deployments, we can typically just let it detect the base URL,
// but for local dev we explicitly set it.
export const authClient = createAuthClient({
    baseURL: typeof window !== "undefined" ? window.location.origin : import.meta.env.VITE_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut } = authClient;
