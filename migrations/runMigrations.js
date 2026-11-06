import db from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    try {
        const migrationsDir = __dirname;
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            console.log(`Running migration: ${file}`);
            await db.query(sql);
            console.log(`✅ Completed: ${file}`);
        }

        console.log('All migrations completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error.message);
    } finally {
        await db.end();
    }
}

runMigrations();
