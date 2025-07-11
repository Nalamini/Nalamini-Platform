import { pool } from './db';

/**
 * This script adds the necessary tables for farmer product listings
 */
async function main() {
  console.log('Starting migration for farmer product listing tables...');
  
  // Create farmer product listings table
  await createFarmerProductListingsTable();
  
  // Create delivery areas table
  await createDeliveryAreasTable();
  
  // Create product requests table
  await createProductRequestsTable();
  
  // Create grocery orders table
  await createGroceryOrdersTable();
  
  // Create grocery order items table
  await createGroceryOrderItemsTable();
  
  console.log('Migration completed successfully!');
}

async function createFarmerProductListingsTable() {
  console.log('Creating farmer_product_listings table...');
  
  try {
    // Check if table already exists
    const checkTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'farmer_product_listings'
      );
    `);
    
    if (checkTableExists.rows[0].exists) {
      console.log('farmer_product_listings table already exists, skipping creation.');
      return;
    }
    
    // Create table
    await pool.query(`
      CREATE TABLE farmer_product_listings (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER NOT NULL,
        grocery_product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        unit TEXT NOT NULL,
        image_url TEXT,
        transport_agent_required BOOLEAN DEFAULT TRUE,
        self_delivery BOOLEAN DEFAULT FALSE,
        is_organic BOOLEAN DEFAULT FALSE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('farmer_product_listings table created successfully!');
  } catch (error) {
    console.error('Error creating farmer_product_listings table:', error);
    throw error;
  }
}

async function createDeliveryAreasTable() {
  console.log('Creating delivery_areas table...');
  
  try {
    // Check if table already exists
    const checkTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'delivery_areas'
      );
    `);
    
    if (checkTableExists.rows[0].exists) {
      console.log('delivery_areas table already exists, skipping creation.');
      return;
    }
    
    // Create table
    await pool.query(`
      CREATE TABLE delivery_areas (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL,
        district TEXT NOT NULL,
        taluk TEXT NOT NULL,
        pincode TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('delivery_areas table created successfully!');
  } catch (error) {
    console.error('Error creating delivery_areas table:', error);
    throw error;
  }
}

async function createProductRequestsTable() {
  console.log('Creating product_requests table...');
  
  try {
    // Check if table already exists
    const checkTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_requests'
      );
    `);
    
    if (checkTableExists.rows[0].exists) {
      console.log('product_requests table already exists, skipping creation.');
      return;
    }
    
    // Create table
    await pool.query(`
      CREATE TABLE product_requests (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER NOT NULL,
        requested_product_name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        unit TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('product_requests table created successfully!');
  } catch (error) {
    console.error('Error creating product_requests table:', error);
    throw error;
  }
}

async function createGroceryOrdersTable() {
  console.log('Creating grocery_orders table...');
  
  try {
    // Check if table already exists
    const checkTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'grocery_orders'
      );
    `);
    
    if (checkTableExists.rows[0].exists) {
      console.log('grocery_orders table already exists, skipping creation.');
      return;
    }
    
    // Create table
    await pool.query(`
      CREATE TABLE grocery_orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        total_amount DOUBLE PRECISION NOT NULL,
        shipping_address TEXT NOT NULL,
        district TEXT NOT NULL,
        taluk TEXT NOT NULL,
        pincode TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        pincode_agent_id INTEGER,
        transport_agent_id INTEGER,
        delivery_fee DOUBLE PRECISION DEFAULT 0,
        payment_method TEXT DEFAULT 'cash',
        payment_status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
    `);
    
    console.log('grocery_orders table created successfully!');
  } catch (error) {
    console.error('Error creating grocery_orders table:', error);
    throw error;
  }
}

async function createGroceryOrderItemsTable() {
  console.log('Creating grocery_order_items table...');
  
  try {
    // Check if table already exists
    const checkTableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'grocery_order_items'
      );
    `);
    
    if (checkTableExists.rows[0].exists) {
      console.log('grocery_order_items table already exists, skipping creation.');
      return;
    }
    
    // Create table
    await pool.query(`
      CREATE TABLE grocery_order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        farmer_product_listing_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DOUBLE PRECISION NOT NULL,
        subtotal DOUBLE PRECISION NOT NULL,
        status TEXT DEFAULT 'pending',
        farmer_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('grocery_order_items table created successfully!');
  } catch (error) {
    console.error('Error creating grocery_order_items table:', error);
    throw error;
  }
}

// Run migration
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error during migration:', error);
    process.exit(1);
  });