import { pool } from "./db";

async function fixCommissionTransactions() {
  try {
    console.log("Starting migration: Fix commission_transactions table...");
    
    // Check if the amount field already has values
    const checkResult = await pool.query(`
      SELECT COUNT(*) FROM commission_transactions WHERE amount IS NULL;
    `);
    
    const nullAmountCount = parseInt(checkResult.rows[0].count);
    console.log(`Found ${nullAmountCount} transactions with NULL amount.`);
    
    if (nullAmountCount > 0) {
      // Update amount field to be equal to commissionAmount for existing records
      await pool.query(`
        UPDATE commission_transactions 
        SET amount = commission_amount 
        WHERE amount IS NULL;
      `);
      console.log("Updated amount field for existing transactions.");
    }
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error fixing commission transactions:", error);
  }
}

// Run the migration
fixCommissionTransactions().then(() => {
  console.log("Commission transactions fix completed");
  process.exit(0);
}).catch(err => {
  console.error("Error in commission transactions fix:", err);
  process.exit(1);
});