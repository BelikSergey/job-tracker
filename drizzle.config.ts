import { defineConfig } from "drizzle-kit";
import { loadDatabaseUrl } from "./src/db/load-env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: loadDatabaseUrl(),
  },
  strict: true,
  verbose: true,
});
