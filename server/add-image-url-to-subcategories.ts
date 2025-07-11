import { db } from './db';
import { sql } from 'drizzle-orm';

async function addImageUrlToSubcategories() {
  try {
    // Check if image_url column exists
    const columnExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'grocery_subcategories' AND column_name = 'image_url'
      );
    `);
    
    if (!columnExists.rows[0].exists) {
      console.log("Adding image_url column to grocery_subcategories table...");
      await db.execute(sql`
        ALTER TABLE grocery_subcategories 
        ADD COLUMN image_url TEXT;
      `);
      console.log("Successfully added image_url column to grocery_subcategories table");
    } else {
      console.log("image_url column already exists in grocery_subcategories table");
    }
  } catch (error) {
    console.error("Error adding image_url column:", error);
    throw error;
  }
}

// Run the migration
addImageUrlToSubcategories()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
