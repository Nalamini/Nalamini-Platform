import { db } from "./db";
import { users } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestCustomer() {
  try {
    // Check if test customer already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "customer"),
    });

    if (existingUser) {
      console.log("Test customer already exists with ID:", existingUser.id);
      return;
    }

    // Create test customer
    const hashedPassword = await hashPassword("customer123");
    
    const [newUser] = await db
      .insert(users)
      .values({
        username: "customer",
        password: hashedPassword,
        fullName: "Test Customer",
        userType: "customer",
        email: "customer@test.com",
        phone: "9876543210",
        district: "Chennai",
        taluk: "Chennai",
        pincode: "600001",
      })
      .returning();

    console.log("Test customer created successfully!");
    console.log("Username: customer");
    console.log("Password: customer123");
    console.log("User ID:", newUser.id);
    
  } catch (error) {
    console.error("Error creating test customer:", error);
  }
}

createTestCustomer();