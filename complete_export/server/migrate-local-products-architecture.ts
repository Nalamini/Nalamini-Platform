import { db } from "./db";
import { localProductBase, localProductDetails, localProducts } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

/**
 * This script migrates the local products architecture from a single table to a
 * two-table structure with separate base information and details.
 */
async function migrateLocalProductsArchitecture() {
  console.log("Starting local products architecture migration...");
  
  try {
    // Check if tables already exist
    try {
      const hasLocalProductBase = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'local_product_base'
        );
      `);
      
      const hasLocalProductDetails = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'local_product_details'
        );
      `);
      
      const baseTableExists = hasLocalProductBase.rows[0].exists === true;
      const detailsTableExists = hasLocalProductDetails.rows[0].exists === true;
      
      console.log(`Tables status: base=${baseTableExists}, details=${detailsTableExists}`);
      
      if (baseTableExists && detailsTableExists) {
        console.log("Migration already completed. Tables already exist.");
        return;
      }
    } catch (error) {
      console.log("Error checking tables existence, proceeding with migration:", error);
    }
    
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS local_product_base (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        manufacturer_id INTEGER,
        admin_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS local_product_details (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES local_product_base(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        specifications JSONB DEFAULT '{}' NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        discounted_price DOUBLE PRECISION,
        stock INTEGER NOT NULL,
        district TEXT NOT NULL,
        image_url TEXT,
        delivery_option TEXT DEFAULT 'both',
        available_areas TEXT,
        is_draft BOOLEAN DEFAULT true,
        status TEXT DEFAULT 'pending',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    console.log("Tables created successfully");
    
    // Check if there are existing local products to migrate
    const oldProducts = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'local_products'
      );
    `);
    
    // If old local_products table exists, migrate the data
    if (oldProducts.rows[0].exists === true) {
      console.log("Found old local_products table, migrating data...");
      
      // Get all products from the old table
      const products = await db.select().from(localProducts);
      console.log(`Found ${products.length} products to migrate`);
      
      // Migrate each product to the new structure
      for (const product of products) {
        // Insert into base table
        const [baseProduct] = await db.insert(localProductBase).values({
          id: product.id, // Maintain the same ID
          name: product.name,
          category: product.category,
          manufacturerId: product.manufacturerId,
          adminApproved: product.adminApproved ?? false,
          // Don't need to set createdAt/updatedAt as they default to NOW()
        }).returning();
        
        console.log(`Migrated base product: ${baseProduct.id} - ${baseProduct.name}`);
        
        // Type assertion to avoid TypeScript errors
        interface LegacyProduct {
          id: number;
          name: string;
          category: string;
          manufacturerId?: number;
          adminApproved?: boolean;
          description?: string;
          specifications?: Record<string, any>;
          price?: number;
          discountedPrice?: number;
          stock?: number;
          district?: string;
          imageUrl?: string;
          deliveryOption?: string;
          availableAreas?: string;
          status?: string;
        }
        
        const legacyProduct = product as unknown as LegacyProduct;
        
        // Insert into details table
        const [details] = await db.insert(localProductDetails).values({
          productId: baseProduct.id,
          description: legacyProduct.description || "",
          specifications: legacyProduct.specifications || {},
          price: legacyProduct.price || 0,
          discountedPrice: legacyProduct.discountedPrice,
          stock: legacyProduct.stock || 0,
          district: legacyProduct.district || "",
          imageUrl: legacyProduct.imageUrl,
          deliveryOption: legacyProduct.deliveryOption || "both",
          availableAreas: legacyProduct.availableAreas,
          isDraft: false, // Existing products are not drafts
          status: legacyProduct.status || "active"
        }).returning();
        
        console.log(`Migrated product details for: ${baseProduct.id} - ${baseProduct.name}`);
      }
      
      console.log(`Successfully migrated ${products.length} products to the new architecture`);
    } else {
      console.log("No old local_products table found, skipping data migration");
    }
    
    console.log("Local products architecture migration completed successfully!");
  } catch (error) {
    console.error("Error during local products architecture migration:", error);
    throw error;
  }
}

// Run the migration
migrateLocalProductsArchitecture()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });