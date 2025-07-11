import { db, pool } from "./db";
import { recharges } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Add missing columns to the recharges table
 */
async function migrateRecharges() {
  try {
    console.log('Checking recharges table columns...');
    
    // Check if processed_by column exists
    const hasProcessedBy = await doesColumnExist('recharges', 'processed_by');
    if (!hasProcessedBy) {
      console.log('Adding processed_by column to recharges table');
      await pool.query(`
        ALTER TABLE recharges 
        ADD COLUMN processed_by INTEGER
      `);
    } else {
      console.log('processed_by column already exists');
    }
    
    // Check if commission columns exist
    const hasCommissionPercent = await doesColumnExist('recharges', 'total_commission_percent');
    if (!hasCommissionPercent) {
      console.log('Adding total_commission_percent column to recharges table');
      await pool.query(`
        ALTER TABLE recharges 
        ADD COLUMN total_commission_percent DOUBLE PRECISION
      `);
    } else {
      console.log('total_commission_percent column already exists');
    }
    
    const hasCommissionAmount = await doesColumnExist('recharges', 'total_commission_amount');
    if (!hasCommissionAmount) {
      console.log('Adding total_commission_amount column to recharges table');
      await pool.query(`
        ALTER TABLE recharges 
        ADD COLUMN total_commission_amount DOUBLE PRECISION
      `);
    } else {
      console.log('total_commission_amount column already exists');
    }
    
    const hasCommissionConfigId = await doesColumnExist('recharges', 'commission_config_id');
    if (!hasCommissionConfigId) {
      console.log('Adding commission_config_id column to recharges table');
      await pool.query(`
        ALTER TABLE recharges 
        ADD COLUMN commission_config_id INTEGER
      `);
    } else {
      console.log('commission_config_id column already exists');
    }
    
    // Check if completed_at column exists
    const hasCompletedAt = await doesColumnExist('recharges', 'completed_at');
    if (!hasCompletedAt) {
      console.log('Adding completed_at column to recharges table');
      await pool.query(`
        ALTER TABLE recharges 
        ADD COLUMN completed_at TIMESTAMP
      `);
    } else {
      console.log('completed_at column already exists');
    }
    
    console.log('Recharges table migration completed successfully.');
  } catch (error) {
    console.error('Error migrating recharges table:', error);
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
    WHERE table_name = $1
    AND column_name = $2
  `, [tableName, columnName]);
  
  return result.rows.length > 0;
}

async function main() {
  try {
    console.log('Starting recharges table migration...');
    await migrateRecharges();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();