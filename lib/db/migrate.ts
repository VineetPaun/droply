import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DB url is not in .env");
}

async function runMigration() {
    try {
        const sql = neon(process.env.DATABASE_URL!)
        const db = drizzle(sql)
        await migrate(db, {migrationsFolder: "./drizzle"})
        console.log("All micrations are succcessfullydone");
    } catch (error) {
        console.log(error);
        console.log("All micrations are succcessfullydone");
        process.exit(1)
    }
}

runMigration()