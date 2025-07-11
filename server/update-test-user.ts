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

async function updateTestUser() {
  try {
    // Update test user
    const [updatedUser] = await db.update(users)
      .set({
        password: await hashPassword("testuser123"),
        email: "testuser@tnservices.com",
        fullName: "Test User",
        pincode: "600001", // Assign to Chennai North area
        district: "Chennai",
        userType: "customer", // Ensure proper user type is set
        walletBalance: 25
      })
      .where(eq(users.username, "testuser"))
      .returning();

    console.log('Test user updated successfully with ID:', updatedUser.id);
    console.log('New wallet balance:', updatedUser.walletBalance);
  } catch (error) {
    console.error('Error updating test user:', error);
  } finally {
    process.exit();
  }
}

updateTestUser();