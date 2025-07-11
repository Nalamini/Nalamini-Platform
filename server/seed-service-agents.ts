import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// This type defines the structure for pincode data by district and taluk
type PincodeData = {
  [district: string]: {
    [taluk: string]: string[];
  };
};

/**
 * Seed service agents for each pincode
 */
export async function seedServiceAgents() {
  console.log("Starting service agent seeding...");
  
  // Tamil Nadu pincodes organized by district and taluk
  const pincodeData: PincodeData = {
    "Chennai": {
      "Chennai North": ["600001", "600002", "600003", "600004", "600005", "600010", "600021", "600081"],
      "Chennai East": ["600006", "600007", "600008", "600009", "600014", "600020", "600079", "600080"],
      "Chennai South": ["600011", "600012", "600013", "600015", "600016", "600017", "600018", "600019", "600022", "600083", "600085", "600086", "600087", "600088", "600090", "600091"],
      "Chennai West": ["600023", "600024", "600025", "600026", "600028", "600029", "600030", "600040", "600089", "600092", "600093", "600094", "600095", "600096", "600097", "600098", "600099", "600100"]
    },
    "Coimbatore": {
      "Coimbatore North": ["641001", "641002", "641003", "641006", "641009", "641012", "641046"],
      "Coimbatore South": ["641004", "641005", "641007", "641008", "641010", "641011", "641013", "641014"],
      "Mettupalayam": ["641301", "641302", "641303", "641304", "641305"],
      "Pollachi": ["642001", "642002", "642004", "642005", "642006"],
      "Valparai": ["642127"],
      "Sulur": ["641401", "641402", "641405", "641406"]
    },
    "Madurai": {
      "Madurai North": ["625001", "625002", "625009", "625010", "625011", "625012", "625014", "625016"],
      "Madurai South": ["625003", "625004", "625005", "625006", "625007", "625008", "625013", "625015", "625017"],
      "Madurai East": ["625020", "625021", "625022", "625104", "625105"],
      "Madurai West": ["625030", "625031", "625104", "625106", "625107"],
      "Vadipatti": ["625218", "625222"],
      "Usilampatti": ["625532", "625535", "625536", "625538"],
      "Pariayur": ["625703", "625705"],
      "Thirumangalam": ["625706", "625707", "625708"]
    },
    "Ariyalur": {
      "Ariyalur": ["621704", "621705", "621731", "621719", "621715"],
      "Senthurai": ["621714", "621713", "621718", "621716", "621717"],
      "Udayarpalayam": ["621804", "621801", "621802", "621803", "621805", "621806", "621708", "621707"]
    },
    "Ranipet": {
      "Arcot": ["632503", "632506", "632507", "632511", "632504", "632509", "632510", "632508", "632512", "632513", "632514", "632515", "632516", "632517", "632518", "632519", "632520", "632521"],
      "Arakkonam": ["631001", "631002", "631003", "631004", "631006", "631101", "631151", "631152"],
      "Walajah": ["632401", "632513"],
      "Ranipet": ["632401", "632402", "632403", "632404", "632405", "632406", "632407", "632408", "632409"]
    },
    "Nilgiris": {
      "Ooty": ["643001", "643003", "643004"],
      "Coonoor": ["643101", "643202", "643102", "643231", "643221"],
      "Kotagiri": ["643217", "643216", "643201", "643214", "643103", "643236", "643242"],
      "Gudalur": ["643211", "643212", "643205", "643207", "643253", "643228", "643226", "643240", "643241", "643212", "643224", "643220", "643211", "643225"],
      "Pandalur": ["643233", "643220", "643239", "643225"]
    },
    "Ramanathapuram": {
      "Ramanathapuram": ["623501", "623502", "623517", "623519", "623523", "623409"],
      "Paramakudi": ["623707", "623701", "623703", "623702", "623704"],
      "Tiruvadanai": ["623407", "623514", "623518", "623526", "623534"],
      "Mudukulathur": ["623603", "623704", "623120", "623115", "623703"],
      "Kamudi": ["623603", "623608", "623601", "623707", "623528"],
      "Kadaladi": ["623703", "623120", "623407", "623409"],
      "Rameshwaram": ["623526", "623519", "623518", "623534"],
      "Mandapam": ["623518", "623519", "623526", "623534"]
    },
    "Pudukkottai": {
      "Pudukkottai": ["622001", "622003", "622005"],
      "Thirumayam": ["622507", "621308", "621312", "622201", "622506", "622505", "622209", "622503", "622401", "622402"],
      "Aranthangi": ["614616", "614617", "614622"],
      "Karambakudi": ["622302"],
      "Iluppur": ["622102"],
      "Gandarvakottai": ["613301", "622203", "621305", "621308", "621312", "614902"],
      "Kalathur": ["614804", "613402", "614602", "614701", "612101", "612103", "612105", "612104", "612106", "612501", "612503", "612101", "612204"],
      "Manamelkudi": ["614620", "614619", "614621", "614622", "614624", "614625", "614629", "614630", "612631", "612632", "612633", "612634", "612635"],
      "Ponamaravathi": ["622407"],
      "Avudaiyarkoil": ["614618", "614629", "622204", "622202", "622205"]
    },
    "Perambalur": {
      "Perambalur": ["621101", "621102", "621103", "621104", "621106", "621107", "621109", "621113", "621115", "621116", "621117", "621118", "621212", "621219", "621220"],
      "Kunnam": ["621708", "621108", "621115", "621113", "621114", "621118", "621717"],
      "Veppanthattai": ["621110"]
    },
    "Namakkal": {
      "Namakkal": ["637001", "637017", "637015", "637013", "637020", "637207", "637013", "637405", "637003", "637411", "637021", "637018", "637020"],
      "Rasipuram": ["637408", "637503", "637411", "637020", "637017", "637020", "637018", "637021", "637015", "637013", "637019", "637003", "637405", "637017"],
      "Tiruchengode": ["637211", "638008", "637410", "637209", "637202", "637205", "637183", "637503", "637304", "637006", "637007", "637408", "637301", "637211", "637505"],
      "Kumarapalayam": ["637209"],
      "Paramathivelur": ["637207", "638182", "637204", "637213", "637201", "637203", "637208"],
      "Sendamangalam": ["637409", "637404", "637405", "637402", "637411"]
    },
    "Kanchipuram": {
      "Kanchipuram": ["631501", "631561", "631603", "631601", "631606", "631502"],
      "Uthiramerur": ["633406", "633107", "633106", "633314", "633107"],
      "Walajabad": ["631605"],
      "Sriperumbudur": ["602105"],
      "Kundrathur": ["600069", "600128", "600122", "600116", "600056", "600122", "600116", "600122"]
    },
    "Dharmapuri": {
      "Dharmapuri": ["636701", "636705", "636807", "636704", "636205", "636302", "636804", "636803", "636352", "636701", "636303"],
      "Harur": ["636903", "636906", "636902", "635202", "636305"],
      "Palacode": ["636808"],
      "Pennagaram": ["636810"],
      "Pappireddipatti": ["636905"],
      "Karimangalam": ["635111", "635202", "635305"],
      "Nallampalli": ["636807"]
    },
    "Dindigul": {
      "Dindigul": ["624001", "624003", "624004", "624301", "624302", "624702", "624003", "624002", "624622", "624204", "624308", "624705", "624614", "624612", "614215", "624215", "624703", "624615", "624711", "624202", "624306", "624621", "624619", "624212", "624103", "624616", "624617", "624619", "624101", "624618", "624206"],
      "Palani": ["624601", "624618", "624613", "624610", "624621"],
      "Oddanchatram": ["624619"],
      "Vedasandur": ["624710"],
      "Kodaikanal": ["624101", "624103", "624202", "624216", "624212"],
      "Natham": ["624401", "624403", "624402"],
      "Nilakottai": ["624208"],
      "Athoor": ["624701", "624616", "624204"],
      "Battagundu": ["624202"]
    },
    "Erode": {
      "Erode": ["638001", "638002", "638003", "638004", "638005", "638007", "638009"],
      "Perundurai": ["638052"],
      "Gobichettipalayam": ["638452", "638503", "638458", "638505", "638110", "638476", "638505", "638453", "638458", "638457", "638462", "638315"],
      "Sathyamangalam": ["638401"],
      "Bhavani": ["638301", "638502", "638454", "638001", "638011", "638501", "638455", "638457", "638453", "638109", "638752", "638462", "638151", "638315", "638101", "638506", "638103", "638115", "638503", "638051", "638301", "638007", "638504", "638051", "638002", "638505", "638104", "638316", "638458", "638009", "638004", "638311", "638102", "638751", "638312", "638153", "638110", "638112", "638452", "638476", "638056", "638454", "638503", "638104", "638052", "638462", "638107", "638314"],
      "Modakuruchi": ["638104"]
    }
  };

  // Seed service agents for each pincode
  let totalAgentsCreated = 0;
  let totalAgentsAlreadyExist = 0;

  for (const [district, taluks] of Object.entries(pincodeData)) {
    console.log(`Processing district: ${district}`);
    
    // Get taluk managers for this district
    const talukManagers = await db.select()
      .from(users)
      .where(
        and(
          eq(users.district, district),
          eq(users.userType, "taluk_manager")
        )
      );
    
    // Create a map of taluk name to taluk manager ID for easy lookup
    const talukManagerMap = new Map<string, number>();
    for (const manager of talukManagers) {
      if (manager.taluk) {
        talukManagerMap.set(manager.taluk.toLowerCase(), manager.id);
      }
    }
    
    // Process each taluk in the district
    for (const [taluk, pincodes] of Object.entries(taluks)) {
      // Find the taluk manager for this taluk
      const talukFormatted = taluk.toLowerCase();
      let talukManagerId = talukManagerMap.get(talukFormatted);
      
      if (!talukManagerId) {
        console.log(`Warning: No taluk manager found for ${taluk} in ${district}, creating one...`);
        
        // Find the branch manager for this district
        const [branchManager] = await db.select()
          .from(users)
          .where(
            and(
              eq(users.district, district),
              eq(users.userType, "branch_manager")
            )
          );
          
        if (!branchManager) {
          console.log(`Error: No branch manager found for ${district}. Skipping this taluk.`);
          continue;
        }
        
        // Create the taluk manager
        const formattedTaluk = taluk.toLowerCase().replace(/ /g, '_');
        const districtFormatted = district.toLowerCase().replace(/ /g, '_');
        const username = `tm_${districtFormatted}_${formattedTaluk}`;
        const password = `${formattedTaluk}123`;
        
        try {
          const [newTalukManager] = await db.insert(users)
            .values({
              username,
              password: await hashPassword(password),
              fullName: `${taluk}, ${district} Taluk Manager`,
              email: `${username}@tnservices.com`,
              userType: "taluk_manager",
              parentId: branchManager.id,
              district,
              taluk,
              walletBalance: 5000,
              createdAt: new Date()
            })
            .returning();
          
          console.log(`Created taluk manager ${username} with ID: ${newTalukManager.id}`);
          talukManagerId = newTalukManager.id;
        } catch (error) {
          console.error(`Error creating taluk manager for ${taluk}, ${district}:`, error);
          continue;
        }
      }
      
      console.log(`Processing taluk: ${taluk} under manager ID: ${talukManagerId}`);
      
      // Process each pincode in the taluk
      for (const pincode of pincodes) {
        // Format the username: sa_district_taluk_pincode
        const districtFormatted = district.toLowerCase().replace(/ /g, '_');
        const username = `sa_${districtFormatted}_${talukFormatted.replace(/ /g, '_')}_${pincode}`;
        
        // Check if service agent already exists
        const existingAgent = await db.select()
          .from(users)
          .where(eq(users.username, username));
        
        if (existingAgent.length === 0) {
          // Create a default password: pincode + "123"
          const password = `${pincode}123`;
          
          try {
            // Create service agent
            await db.insert(users).values({
              username: username,
              password: await hashPassword(password),
              fullName: `${taluk} ${pincode} Service Agent`,
              email: `serviceagent.${pincode}@tnservices.com`,
              userType: "service_agent",
              parentId: talukManagerId, // Service agents report to their taluk manager
              district: district,
              taluk: taluk,
              pincode: pincode,
              phone: `73715${Math.floor(10000 + Math.random() * 90000)}`, // Random 10-digit phone number
              walletBalance: 2000, // Starting balance for service agents
              createdAt: new Date()
            });
            
            totalAgentsCreated++;
            if (totalAgentsCreated % 50 === 0) {
              console.log(`Created ${totalAgentsCreated} service agents so far...`);
            }
          } catch (error) {
            console.error(`Error creating service agent for pincode ${pincode} in ${taluk}, ${district}:`, error);
          }
        } else {
          totalAgentsAlreadyExist++;
        }
      }
    }
  }
  
  console.log(`Service agent seeding completed!`);
  console.log(`Created ${totalAgentsCreated} new service agents`);
  console.log(`${totalAgentsAlreadyExist} service agents already existed`);
}

// This is now an ES module so we don't use require.main check
// The actual execution is in run-service-agent-seed.ts