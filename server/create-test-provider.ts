import { db } from "./db";
import { users, serviceProviders } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestProvider() {
  try {
    // Check if test provider already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, "testprovider"))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("Test provider already exists with username: testprovider");
      return;
    }

    // Create the user account
    const hashedPassword = await hashPassword("provider123");
    
    const [newUser] = await db
      .insert(users)
      .values({
        username: "testprovider",
        password: hashedPassword,
        fullName: "Test Provider",
        email: "testprovider@example.com",
        userType: "service_provider",
        district: "Chennai"
      })
      .returning();

    console.log("Created test user:", newUser);

    // Create the service provider registration
    const [newProvider] = await db
      .insert(serviceProviders)
      .values({
        phone: "9876543210",
        district: "Chennai",
        taluk: "Chennai",
        pincode: "600001",
        businessName: "Test Grocery Provider",
        businessAddress: "123 Test Street, Chennai",
        providerType: "farmer",
        status: "approved"
      })
      .returning();

    console.log("Created test service provider:", newProvider);
    console.log("\nTest provider credentials:");
    console.log("Username: testprovider");
    console.log("Password: provider123");
    console.log("Status: approved");

  } catch (error) {
    console.error("Error creating test provider:", error);
  }
}

createTestProvider().then(() => {
  console.log("Test provider creation completed");
  process.exit(0);
}).catch((error) => {
  console.error("Failed to create test provider:", error);
  process.exit(1);
});