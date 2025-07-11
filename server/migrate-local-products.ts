import { db } from "./db";
import { sql } from "drizzle-orm";

async function migrateLocalProducts() {
  console.log("Starting local products migration...");

  try {
    // Check if availableAreas column exists
    const availableAreasExists = await doesColumnExist('local_products', 'available_areas');
    if (!availableAreasExists) {
      console.log("Adding availableAreas column to local_products table...");
      await db.execute(sql`
        ALTER TABLE local_products
        ADD COLUMN IF NOT EXISTS available_areas TEXT
      `);
    }

    // Check if imageUrl column exists
    const imageUrlExists = await doesColumnExist('local_products', 'image_url');
    if (!imageUrlExists) {
      console.log("Adding imageUrl column to local_products table...");
      await db.execute(sql`
        ALTER TABLE local_products
        ADD COLUMN IF NOT EXISTS image_url TEXT
      `);
    }

    // Check if deliveryOption column exists
    const deliveryOptionExists = await doesColumnExist('local_products', 'delivery_option');
    if (!deliveryOptionExists) {
      console.log("Adding deliveryOption column to local_products table...");
      await db.execute(sql`
        ALTER TABLE local_products
        ADD COLUMN IF NOT EXISTS delivery_option TEXT
      `);
    }

    // Check if status column exists
    const statusExists = await doesColumnExist('local_products', 'status');
    if (!statusExists) {
      console.log("Adding status column to local_products table...");
      await db.execute(sql`
        ALTER TABLE local_products
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
      `);
    }

    // Update all existing products to have status = 'active' if status is null
    await db.execute(sql`
      UPDATE local_products
      SET status = 'active'
      WHERE status IS NULL
    `);

    console.log("Local products migration completed successfully!");
  } catch (error) {
    console.error("Error during local products migration:", error);
    throw error;
  }
}

async function doesColumnExist(tableName: string, columnName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND column_name = ${columnName}
    )
  `);
  
  // Debug the result structure
  console.log("Column check result:", JSON.stringify(result.rows[0]));
  
  // Return true or false based on the exists property
  return result.rows[0]?.exists === 't' || result.rows[0]?.exists === true;
}

// When running this file directly, run the migration
// File is top-level so will execute immediately when imported directly
export { migrateLocalProducts };