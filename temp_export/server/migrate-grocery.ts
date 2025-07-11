import { db } from "./db";
import { sql } from "drizzle-orm";

async function migrateGroceryProducts() {
  console.log("Migrating grocery_products table...");
  
  try {
    // Check if columns already exist to avoid errors
    const tableInfo = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'grocery_products'
    `);
    
    const columns = tableInfo.rows.map((row: any) => row.column_name);
    
    // Add imageUrl column if it doesn't exist
    if (!columns.includes('image_url')) {
      await db.execute(sql`
        ALTER TABLE grocery_products 
        ADD COLUMN image_url TEXT
      `);
      console.log("Added image_url column");
    }
    
    // Add deliveryOption column if it doesn't exist
    if (!columns.includes('delivery_option')) {
      await db.execute(sql`
        ALTER TABLE grocery_products 
        ADD COLUMN delivery_option TEXT DEFAULT 'both'
      `);
      console.log("Added delivery_option column");
    }
    
    // Add availableAreas column if it doesn't exist
    if (!columns.includes('available_areas')) {
      await db.execute(sql`
        ALTER TABLE grocery_products 
        ADD COLUMN available_areas TEXT
      `);
      console.log("Added available_areas column");
    }
    
    // Add status column if it doesn't exist
    if (!columns.includes('status')) {
      await db.execute(sql`
        ALTER TABLE grocery_products 
        ADD COLUMN status TEXT DEFAULT 'active'
      `);
      console.log("Added status column");
    }
    
    console.log("Grocery products table migration completed successfully");
  } catch (error) {
    console.error("Grocery products migration failed:", error);
    throw error;
  }
}

async function createGroceryCategoriesTable() {
  console.log("Creating grocery_categories table if it doesn't exist...");
  
  try {
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'grocery_categories'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      await db.execute(sql`
        CREATE TABLE grocery_categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          icon TEXT,
          color TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          display_order INTEGER,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Created grocery_categories table");
    } else {
      console.log("grocery_categories table already exists");
      
      // Check if status column exists
      const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'grocery_categories'
      `);
      
      const columnNames = columns.rows.map((row: any) => row.column_name);
      
      if (!columnNames.includes('status')) {
        await db.execute(sql`
          ALTER TABLE grocery_categories 
          ADD COLUMN status TEXT DEFAULT 'active'
        `);
        console.log("Added status column to grocery_categories table");
      }
    }
  } catch (error) {
    console.error("Creating grocery_categories table failed:", error);
    throw error;
  }
}

async function createGrocerySubCategoriesTable() {
  console.log("Creating grocery_subcategories table if it doesn't exist...");
  
  try {
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'grocery_subcategories'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      await db.execute(sql`
        CREATE TABLE grocery_subcategories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          parent_category_id INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          display_order INTEGER,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Created grocery_subcategories table");
    } else {
      console.log("grocery_subcategories table already exists");
      
      // Check if status column exists
      const columns = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'grocery_subcategories'
      `);
      
      const columnNames = columns.rows.map((row: any) => row.column_name);
      
      if (!columnNames.includes('status')) {
        await db.execute(sql`
          ALTER TABLE grocery_subcategories 
          ADD COLUMN status TEXT DEFAULT 'active'
        `);
        console.log("Added status column to grocery_subcategories table");
      }
    }
  } catch (error) {
    console.error("Creating grocery_subcategories table failed:", error);
    throw error;
  }
}

// Run the migrations
async function runAllMigrations() {
  try {
    await createGroceryCategoriesTable();
    await createGrocerySubCategoriesTable();
    await migrateGroceryProducts();
    console.log("All grocery migrations completed successfully");
  } catch (error) {
    console.error("Migration process failed:", error);
    throw error;
  }
}

runAllMigrations()
  .then(() => {
    console.log("All migrations completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration process failed:", error);
    process.exit(1);
  });