import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/models.ts",
  out: "./public/migrations",
  dialect: "postgresql",
});
