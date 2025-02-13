import  dotenv  from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
  dialect: "postgresql",  
  schema: "./src/schema.ts",
//   driver: "pg",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_dNP5Sab6psmi@ep-lingering-lab-a8595r7g-pooler.eastus2.azure.neon.tech/expense-tracker?sslmode=require",
  },
  out: "./drizzle",
});
