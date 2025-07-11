import { db, pool } from "./db";
import { commissionConfigs, commissionTransactions } from "@shared/schema";
import { DEFAULT_COMMISSION_RATES } from "./services/commissionService";

/**
 * Create the commission configurations table and add default configs
 */
async function migrateCommissionConfigs() {
  console.log("Checking if commission_configs table exists...");
  
  // Check if table exists
  const tableExists = await doesTableExist("commission_configs");
  
  if (!tableExists) {
    console.log("commission_configs table does not exist, creating it...");
    
    // Create the table using SQL since we need to create it from scratch
    await pool.query(`
      CREATE TABLE IF NOT EXISTS commission_configs (
        id SERIAL PRIMARY KEY,
        service_type TEXT NOT NULL,
        provider TEXT,
        admin_commission DOUBLE PRECISION NOT NULL DEFAULT 0.5,
        branch_manager_commission DOUBLE PRECISION NOT NULL DEFAULT 0.5,
        taluk_manager_commission DOUBLE PRECISION NOT NULL DEFAULT 1.0,
        service_agent_commission DOUBLE PRECISION NOT NULL DEFAULT 3.0,
        registered_user_commission DOUBLE PRECISION NOT NULL DEFAULT 1.0,
        total_commission DOUBLE PRECISION NOT NULL DEFAULT 6.0,
        start_date DATE,
        end_date DATE,
        is_peak_rate BOOLEAN DEFAULT FALSE,
        season_name TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("commission_configs table created successfully!");
  } else {
    console.log("commission_configs table already exists");
  }
  
  console.log("Checking if commission_transactions table exists...");
  const transactionsTableExists = await doesTableExist("commission_transactions");
  
  if (!transactionsTableExists) {
    console.log("commission_transactions table does not exist, creating it...");
    
    // Create the commission transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS commission_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        transaction_id INTEGER NOT NULL,
        amount DOUBLE PRECISION NOT NULL,
        commission_amount DOUBLE PRECISION NOT NULL,
        commission_rate DOUBLE PRECISION NOT NULL,
        transaction_amount DOUBLE PRECISION NOT NULL,
        provider TEXT,
        status TEXT DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("commission_transactions table created successfully!");
  } else {
    console.log("commission_transactions table already exists");
  }
  
  // Add default commission configs
  await createDefaultConfigs();
  
  console.log("Commission configuration migration completed successfully!");
}

/**
 * Create default commission configurations for all service types
 */
async function createDefaultConfigs() {
  const serviceTypes = ['recharge', 'booking', 'grocery', 'travel', 'rental', 'taxi', 'delivery'];
  
  for (const serviceType of serviceTypes) {
    // Check if config already exists for this service type
    const result = await pool.query(
      'SELECT * FROM commission_configs WHERE service_type = $1 AND is_active = TRUE',
      [serviceType]
    );
    
    if (result.rows.length === 0) {
      console.log(`Creating default commission config for ${serviceType}...`);
      
      // Insert default config
      await pool.query(
        `INSERT INTO commission_configs (
          service_type, 
          admin_commission, 
          branch_manager_commission, 
          taluk_manager_commission, 
          service_agent_commission, 
          registered_user_commission,
          total_commission
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          serviceType,
          DEFAULT_COMMISSION_RATES.admin,
          DEFAULT_COMMISSION_RATES.branch_manager,
          DEFAULT_COMMISSION_RATES.taluk_manager,
          DEFAULT_COMMISSION_RATES.service_agent,
          DEFAULT_COMMISSION_RATES.user,
          (
            DEFAULT_COMMISSION_RATES.admin +
            DEFAULT_COMMISSION_RATES.branch_manager +
            DEFAULT_COMMISSION_RATES.taluk_manager +
            DEFAULT_COMMISSION_RATES.service_agent +
            DEFAULT_COMMISSION_RATES.user
          )
        ]
      );
      
      console.log(`Default commission config for ${serviceType} created successfully!`);
    } else {
      console.log(`Commission config for ${serviceType} already exists, skipping...`);
    }
  }
}

/**
 * Helper function to check if a table exists
 */
async function doesTableExist(tableName: string): Promise<boolean> {
  const result = await pool.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)",
    [tableName]
  );
  return result.rows[0].exists;
}

/**
 * Main function to run the migration
 */
async function main() {
  try {
    await migrateCommissionConfigs();
  } catch (error) {
    console.error("Error during commission configs migration:", error);
    process.exit(1);
  } finally {
    // Close the database pool
    await pool.end();
  }
}

// Run the migration
main();