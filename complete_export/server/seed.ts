import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  console.log("Starting database seeding...");
  
  // Check if admin user exists
  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
  
  let adminId: number;
  
  if (existingAdmin.length === 0) {
    console.log("Admin user not found, creating...");
    
    // Create admin user
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin123"),
      fullName: "System Administrator",
      email: "admin@tnservices.com",
      userType: "admin",
      phone: "9876543210",
      walletBalance: 50000, // Start with a large balance for testing
      createdAt: new Date()
    }).returning({ id: users.id });
    
    adminId = adminUser.id;
    console.log("Admin user created successfully with ID:", adminId);
  } else {
    adminId = existingAdmin[0].id;
    console.log("Admin user already exists with ID:", adminId);
  }
  
  // Tamil Nadu districts with their taluks
  const districtTaluks = {
    "Ariyalur": ["Ariyalur", "Senthurai", "Udayarpalayam"],
    "Chengalpathu": ["Chengalpathu", "Thiruporur", "Tambaram", "Vandalur", "Maduranntakam", "Cheyyur"],
    "Chennai": ["Chennai North", "Chennai South", "Chennai East", "Chennai West"],
    "Coimbatore": ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Valparai"],
    "Cuddalore": ["Cuddalore", "Penruti", "Chidambaram", "Virudhachalam", "Kattumannarkoil", "Kurinjipadi", "Bhuvanagiri", "Srimushnam", "Veppur"],
    "Dharmapuri": ["Dharmapuri", "Hosur", "Palacode", "Pannagaram", "Pappireddipatti", "Karimangalam", "Nallampatti"],
    "Dindigul": ["Dindigul", "Palani", "Oddanchatram", "Vedasandur", "Kodaikanal", "Natham", "Nilakottai", "Athoor", "Battagundu"],
    "Erode": ["Erode", "Perundurai", "Gobichettipalayam", "Sathyamangalam", "Bhavani", "Anthiyur", "Modakuruchi", "Kodumudi"],
    "Kallakurichi": ["Kallakurichi", "Sankarapuram", "Chinnasalem", "Ulundurpet", "Tirukoiyur", "Rishivandiyam"],
    "Kanchipuram": ["Kanchipuram", "Uthiramerur", "Walajabad", "Sriperumbudur"],
    "Kanyakumari": ["Agastheeswaram", "Thovalai", "Kalkulam", "Vilavancode"],
    "Karur": ["Karur", "Aravakuruchi", "Krishnarayapuram", "Kulithalai", "Kadavur", "Manmangalam"],
    "Krishnagiri": ["Krishnagiri", "Hosur", "Pochampalli", "Uthangarai", "Denkanikotai", "Shoolagiri", "Bargur"],
    "Madurai": ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Thirumangalam", "Usilampatti", "Vadipatti", "Pariayur"],
    "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Kuthalam", "Tharangambadi"],
    "Nagapattinam": ["Nagapattinam", "Tharangambadi", "Kilvelur", "Vedaranyam", "Sirkazhi"],
    "Namakkal": ["Namakkal", "Rasipuram", "Tiruchengode", "Kumarapalayam", "Paramathivelur", "Sendamangalam", "Mohanur"],
    "Nilgiris": ["Ooty", "Coonoor", "Kotagiri", "Gudalur", "Pandalur"],
    "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"],
    "Pudukkottai": ["Pudukkottai", "Thirumayam", "Aranthangi", "Karambakudi", "Iluppur", "Gandarvakottai", "Kalathur", "Manamelkudi", "Ponamaravathi", "Avudaiyarkoil"],
    "Ramanathapuram": ["Ramanathapuram", "Paramakudi", "Tiruvadanai", "Mudukulathur", "Kamudi", "Rameshwaram", "Mandapam"],
    "Ranipet": ["Arcot", "Arakkonam", "Walajah", "Nemili", "Sholinganur", "Ranipet"],
    "Salem": ["Salem", "Omalur", "Mettur", "Edappadi", "Attur", "Sarkari", "Gangavalli", "Yercaud", "Pethanaikenpalayam", "Vazhapadi"],
    "Sivaganga": ["Sivaganga", "Karaikudi", "Manamadurai", "Tirupathur", "Ilayangudi", "Kalaiyarkoil", "Devakottai", "Singampunari"],
    "Tenkasi": ["Tenkasi", "Shenkottai", "Sankarankoil", "Sivagiri", "Kadayanallur", "V. K Padur", "Alangulam", "Veerakeralampudur"],
    "Thanjavur": ["Thanjavur", "Pattukottai", "Kumbakonam", "Orathanadu", "Thiruvidaimarudur", "Peravurani", "Ruvaiyaru", "Boothalur"],
    "Theni": ["Theni", "Periyakulam", "Andipatti", "Bodinayakanur", "Uthamapalayam", "Chinnamanur"],
    "Thoothukudi": ["Thoothukudi", "Ettayapuram", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikundam", "Tiruchendur", "Vilathikulam"],
    "Thiruchirappalli": ["Trichy West", "Trichy East", "Lalgudi", "Manapparai", "Manachanallur", "Musiri", "Srirangam", "Thiruvverumbur", "Thottiyam", "Thuraiyur"],
    "Tirunelveli": ["Tirunelveli", "Ambasamudram", "Nanguneri", "Palayamkottai", "Radhapuram", "Sankarankoil", "Tenkasi", "Veerakeralampudur"],
    "Tirupathur": ["Tirupathur", "Ambur", "Vaniyambadi", "Natrampalli"],
    "Tirupur": ["Tirupur North", "Tirupur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Udumalaipettai"],
    "Tiruvallur": ["Tiruvallur", "Poonamallee", "Gummidipoondi", "Pallipattu", "Ponneri", "Uthukottai", "Avadi", "R. K. Pet", "Tiruttani"],
    "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Vandavasi", "Chengani", "Kalasapakkam", "Chelpet"],
    "Tiruvarur": ["Tiruvarur", "Kodavasal", "Manargidi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Valangaiman"],
    "Vellore": ["Vellore", "Katpadi", "Gudiyatham", "Arakkonam", "Walajapet"],
    "Villupuram": ["Villupuram", "Gingee", "Kandachipuram", "Sankarapuram", "Tindivanam", "Ulundurpet", "Vanur"],
    "Virudhunagar": ["Virudhunagar", "Aruppukottai", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli"]
  };
  
  // Create branch managers for each district and taluk managers reporting to them
  console.log("Checking for branch managers and taluk managers...");
  
  for (const [district, taluks] of Object.entries(districtTaluks)) {
    // Format district name for usernames and emails
    const districtFormatted = district.toLowerCase().replace(/ /g, '_');
    const branchManagerUsername = `bm_${districtFormatted}`;
    
    // Check if this branch manager already exists
    let existingBM = await db.select().from(users).where(eq(users.username, branchManagerUsername));
    let branchManagerId: number;
    
    if (existingBM.length === 0) {
      console.log(`Creating branch manager for ${district}...`);
      
      // Create a default password: district name + "123"
      const password = `${districtFormatted}123`;
      
      // Create branch manager
      const [branchManager] = await db.insert(users).values({
        username: branchManagerUsername,
        password: await hashPassword(password),
        fullName: `${district} Branch Manager`,
        email: `branchmanager.${districtFormatted}@tnservices.com`,
        userType: "branch_manager",
        parentId: adminId, // Branch managers report to admin
        district: district,
        phone: `98765${Math.floor(10000 + Math.random() * 90000)}`, // Random 10-digit phone number
        walletBalance: 10000, // Starting balance for branch managers
        createdAt: new Date()
      }).returning({ id: users.id });
      
      branchManagerId = branchManager.id;
      console.log(`Branch manager for ${district} created with ID: ${branchManagerId}`);
    } else {
      branchManagerId = existingBM[0].id;
      console.log(`Branch manager for ${district} already exists with ID: ${branchManagerId}`);
    }
    
    // Now create taluk managers for each taluk in this district
    console.log(`Checking taluk managers for ${district}...`);
    
    for (const taluk of taluks) {
      // Format taluk name for usernames and emails
      const talukFormatted = taluk.toLowerCase().replace(/ /g, '_');
      const talukManagerUsername = `tm_${districtFormatted}_${talukFormatted}`;
      
      // Check if this taluk manager already exists
      const existingTM = await db.select().from(users).where(eq(users.username, talukManagerUsername));
      
      if (existingTM.length === 0) {
        console.log(`Creating taluk manager for ${taluk}, ${district}...`);
        
        // Create a default password: taluk name + "123"
        const password = `${talukFormatted}123`;
        
        // Create taluk manager
        await db.insert(users).values({
          username: talukManagerUsername,
          password: await hashPassword(password),
          fullName: `${taluk} Taluk Manager`,
          email: `talukmanager.${talukFormatted}@tnservices.com`,
          userType: "taluk_manager",
          parentId: branchManagerId, // Taluk managers report to their district's branch manager
          district: district,
          taluk: taluk,
          phone: `97865${Math.floor(10000 + Math.random() * 90000)}`, // Random 10-digit phone number
          walletBalance: 5000, // Starting balance for taluk managers
          createdAt: new Date()
        });
        
        console.log(`Taluk manager for ${taluk}, ${district} created successfully!`);
      } else {
        console.log(`Taluk manager for ${taluk}, ${district} already exists.`);
      }
    }
  }
  
  console.log("Database seeding completed successfully!");
}