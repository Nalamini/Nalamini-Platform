import { db } from './db';
import { users } from '@shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'testuser'));
    
    if (existingUser.length > 0) {
      console.log('Test user already exists with ID:', existingUser[0].id);
      return;
    }
    
    // Create test user
    const [testUser] = await db.insert(users).values({
      username: "testuser",
      password: await hashPassword("testuser123"),
      fullName: "Test User",
      email: "testuser@tnservices.com",
      userType: "customer",
      phone: "9876543210",
      pincode: "600001", // Assign to Chennai North area
      district: "Chennai", 
      walletBalance: 25, // Initial wallet balance for testing
      createdAt: new Date()
    }).returning();

    console.log('Test user created successfully with ID:', testUser.id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit();
  }
}

createTestUser();