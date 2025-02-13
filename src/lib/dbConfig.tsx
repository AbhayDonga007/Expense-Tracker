import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@/schema"

const sql = neon("postgresql://neondb_owner:npg_dNP5Sab6psmi@ep-lingering-lab-a8595r7g-pooler.eastus2.azure.neon.tech/expense-tracker?sslmode=require");
export const db = drizzle(sql,{schema});