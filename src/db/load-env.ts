import { existsSync } from "node:fs";

const ENV_FILE = ".env.local";

/**
 * Resolves DATABASE_URL for tooling that runs outside Next.js
 * (drizzle-kit, seed script). Locally it comes from `.env.local`;
 * in CI the file is absent and the variable is set in the environment.
 * Variables already present in the environment are never overwritten.
 */
export function loadDatabaseUrl(): string {
  if (existsSync(ENV_FILE)) {
    process.loadEnvFile(ENV_FILE);
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      `DATABASE_URL is not set. Add it to ${ENV_FILE} or the environment.`,
    );
  }
  return url;
}
