import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db, pool } from "./db";
import { users, serviceProviders, farmerDetails } from "../shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestFarmer() {
  try {
    console.log("Starting test farmer creation process...");
    
    // 1. Check if test farmer already exists
    const existingUser = await db.select().from(users).where(eq(users.username, "testfarmer")).execute();
    
    let userId: number;
    
    if (existingUser.length > 0) {
      console.log("Test farmer user already exists with ID:", existingUser[0].id);
      userId = existingUser[0].id;
      
      // Update password if needed
      await db
        .update(users)
        .set({
          password: await hashPassword("farmer123")
        })
        .where(eq(users.id, userId))
        .execute();
      
      console.log("Updated test farmer password");
    } else {
      // 2. Create test farmer user if it doesn't exist
      const [newUser] = await db
        .insert(users)
        .values({
          username: "testfarmer",
          password: await hashPassword("farmer123"),
          email: "testfarmer@example.com",
          phone: "9876543211",
          userType: "provider", // Important: farmers have userType="provider" with providerType="farmer"
          district: "Chennai",
          address: "123 Farm Street, Chennai",
          pincode: "600001",
          status: "active",
          fullName: "Test Farmer"
        })
        .returning();
      
      console.log("Created test farmer user with ID:", newUser.id);
      userId = newUser.id;
    }
    
    // 3. Check if service provider record exists
    let providerId: number;
    const existingProvider = await db.select()
      .from(serviceProviders)
      .where(eq(serviceProviders.userId, userId))
      .execute();
    
    if (existingProvider.length > 0) {
      console.log("Test farmer provider already exists with ID:", existingProvider[0].id);
      providerId = existingProvider[0].id;
      
      // Update provider type to ensure it's a farmer
      await db
        .update(serviceProviders)
        .set({ 
          providerType: "farmer",
          status: "approved",
          verificationStatus: "verified"
        })
        .where(eq(serviceProviders.id, providerId))
        .execute();
      
      console.log("Updated service provider record");
    } else {
      // 4. Create service provider record
      const [newProvider] = await db
        .insert(serviceProviders)
        .values({
          userId: userId,
          providerType: "farmer",
          businessName: "Test Farm",
          address: "123 Farm Street, Chennai",
          district: "Chennai",
          taluk: "Chennai South",
          pincode: "600001",
          phone: "9876543211",
          email: "testfarmer@example.com",
          description: "A test farm for development",
          status: "approved",
          verificationStatus: "verified"
        })
        .returning();
      
      console.log("Created service provider record with ID:", newProvider.id);
      providerId = newProvider.id;
    }
    
    // 5. Check if farmer details exist
    const existingDetails = await db
      .select()
      .from(farmerDetails)
      .where(eq(farmerDetails.serviceProviderId, providerId))
      .execute();
    
    if (existingDetails.length > 0) {
      console.log("Farmer details already exist with ID:", existingDetails[0].id);
      
      // Update farmer details
      await db
        .update(farmerDetails)
        .set({
          primaryProducts: "Fruits, Vegetables",
          supportsDelivery: true
        })
        .where(eq(farmerDetails.id, existingDetails[0].id))
        .execute();
      
      console.log("Updated farmer details");
    } else {
      // 6. Create farmer details
      const [newDetails] = await db
        .insert(farmerDetails)
        .values({
          serviceProviderId: providerId,
          farmSize: "5",
          farmType: "organic",
          primaryProducts: "Fruits, Vegetables",
          cultivationSeason: "year-round",
          operatingHours: "8:00 AM - 5:00 PM",
          supportsDelivery: true
        })
        .returning();
      
      console.log("Created farmer details with ID:", newDetails.id);
    }
    
    console.log("Test farmer setup completed successfully");
    console.log("Login credentials: testfarmer/farmer123");
    
  } catch (error) {
    console.error("Error creating test farmer:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createTestFarmer()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test farmer setup failed:", error);
    process.exit(1);
  });