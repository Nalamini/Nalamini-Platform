import { db, pool } from "./db";
import { commissionConfigs, users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Test script to check if commission configs are working properly
 */
async function testCommissionConfigs() {
  console.log("Testing commission configurations...");
  
  // Check if commission_configs table exists
  try {
    const configs = await db.select().from(commissionConfigs);
    console.log(`Found ${configs.length} commission configs:`);
    
    configs.forEach(config => {
      console.log(`- Service Type: ${config.serviceType}`);
      console.log(`  Provider: ${config.provider || 'N/A'}`);
      console.log(`  Commission Rates: Admin (${config.adminCommission}%), Branch (${config.branchManagerCommission}%), Taluk (${config.talukManagerCommission}%), Agent (${config.serviceAgentCommission}%), User (${config.registeredUserCommission}%)`);
      console.log(`  Total Commission: ${config.totalCommission}%`);
      console.log(`  Active: ${config.isActive}`);
      console.log(`  Created: ${config.createdAt}`);
      console.log('-----------------------------------');
    });
    
    // Check test user wallet balance
    const [testUser] = await db.select().from(users).where(eq(users.username, 'testuser'));
    console.log(`Test User Wallet Balance: ₹${testUser?.walletBalance || 0}`);
    
    // Check service agent wallet balance
    const [serviceAgent] = await db.select().from(users).where(eq(users.username, 'sa_chennai_chennai_north_600001'));
    console.log(`Service Agent Wallet Balance: ₹${serviceAgent?.walletBalance || 0}`);
    
    // Check taluk manager wallet balance
    const [talukManager] = await db.select().from(users).where(eq(users.username, 'tm_chennai_chennai_north'));
    console.log(`Taluk Manager Wallet Balance: ₹${talukManager?.walletBalance || 0}`);
    
    // Check branch manager wallet balance
    const [branchManager] = await db.select().from(users).where(eq(users.username, 'bm_chennai'));
    console.log(`Branch Manager Wallet Balance: ₹${branchManager?.walletBalance || 0}`);
    
    // Check admin wallet balance
    const [admin] = await db.select().from(users).where(eq(users.username, 'admin'));
    console.log(`Admin Wallet Balance: ₹${admin?.walletBalance || 0}`);
    
  } catch (error) {
    console.error("Error testing commission configs:", error);
  } finally {
    await pool.end();
  }
}

// Run the test
testCommissionConfigs();