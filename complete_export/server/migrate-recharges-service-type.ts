import { db, pool } from "./db";

/**
 * Add the serviceType column to the recharges table
 */
async function migrateRechargesServiceType() {
  try {
    // Check if the serviceType column already exists
    const hasColumn = await doesColumnExist("recharges", "service_type");
    
    if (!hasColumn) {
      console.log("Adding service_type column to recharges table");
      await pool.query(`
        ALTER TABLE recharges
        ADD COLUMN service_type text DEFAULT 'mobile'
      `);
      console.log("Successfully added service_type column to recharges table");
    } else {
      console.log("service_type column already exists in recharges table");
    }
  } catch (error) {
    console.error("Error migrating recharges table:", error);
    throw error;
  }
}

/**
 * Helper function to check if a column exists in a table
 */
async function doesColumnExist(tableName: string, columnName: string): Promise<boolean> {
  const result = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1 AND column_name = $2
  `, [tableName, columnName]);
  
  return result.rows.length > 0;
}

async function main() {
  try {
    await migrateRechargesServiceType();
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();