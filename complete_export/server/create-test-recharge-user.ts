import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db, pool } from "./db";
import { users, transactions } from "../shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, "testuser")).execute();
    
    if (existingUser.length > 0) {
      console.log("Test user already exists with ID:", existingUser[0].id);
      
      // Update password if needed
      await db
        .update(users)
        .set({
          password: await hashPassword("testuser123")
        })
        .where(eq(users.id, existingUser[0].id))
        .execute();
      
      console.log("Updated test user password");
      
      // Add wallet balance if needed
      const existingBalance = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, existingUser[0].id))
        .execute();
      
      if (existingBalance.length === 0) {
        // Add 1000 rupees to wallet
        await db.insert(transactions).values({
          userId: existingUser[0].id,
          amount: 1000,
          type: "credit",
          description: "Initial wallet balance for testing",
          status: "completed",
          serviceType: "wallet"
        }).execute();
        
        console.log("Added 1000 rupees to test user wallet");
      } else {
        console.log("Test user already has wallet transactions");
      }
      
      return;
    }
    
    // Create test user if it doesn't exist
    const [newUser] = await db
      .insert(users)
      .values({
        username: "testuser",
        password: await hashPassword("testuser123"),
        email: "testuser@example.com",
        phone: "9876543210",
        userType: "user",
        district: "Chennai",
        address: "123 Test Street, Chennai",
        pincode: "600001",
        status: "active"
      })
      .returning();
    
    console.log("Created test user with ID:", newUser.id);
    
    // Add 1000 rupees to wallet
    await db.insert(transactions).values({
      userId: newUser.id,
      amount: 1000,
      type: "credit",
      description: "Initial wallet balance for testing",
      status: "completed",
      serviceType: "wallet"
    }).execute();
    
    console.log("Added 1000 rupees to test user wallet");
    
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createTestUser()
  .then(() => {
    console.log("Test user setup completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test user setup failed:", error);
    process.exit(1);
  });