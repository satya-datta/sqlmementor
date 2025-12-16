import { createAuthClient } from '@neondatabase/neon-js/auth';

if (!import.meta.env.VITE_NEON_AUTH_URL) {
    throw new Error("Missing VITE_NEON_AUTH_URL environment variable");
}

export const authClient = createAuthClient(
    import.meta.env.VITE_NEON_AUTH_URL
);
