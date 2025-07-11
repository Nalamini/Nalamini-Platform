import { scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

async function checkPassword() {
  const storedPassword = "83c2fd4dccd552a2d3a8380b628522935f50689bc4e4c5d175978033061c6e95fc80fe40c536e90ec0c0c7dd4abc0a3707b1aca8553445a4f4c01e8e0cbde782.69247bdf6267fd7a17fcaa42574d3e26";
  
  // Try different password combinations
  const passwords = ["Coimbatore123", "coimbatore123", "password123", "admin123"];
  
  for (const pwd of passwords) {
    const isMatch = await comparePasswords(pwd, storedPassword);
    console.log(`Password "${pwd}": ${isMatch ? "MATCH" : "No match"}`);
  }
}

checkPassword().catch(console.error);