import { storage } from "./storage";

const defaultTaxiCategories = [
  {
    name: "Two Wheeler",
    description: "Motorcycle/Scooter taxi service for quick city transport",
    basePrice: 15,
    pricePerKm: 5,
    waitingChargePerMinute: 1.5,
    maxPassengers: 1
  },
  {
    name: "Three Wheeler", 
    description: "Auto-rickshaw service for short to medium distance travel",
    basePrice: 25,
    pricePerKm: 8,
    waitingChargePerMinute: 2,
    maxPassengers: 3
  },
  {
    name: "4 Seaters",
    description: "Compact car taxi service for small families or groups",
    basePrice: 40,
    pricePerKm: 12,
    waitingChargePerMinute: 3,
    maxPassengers: 4
  },
  {
    name: "6 Seaters",
    description: "SUV/MPV taxi service for larger families and luggage",
    basePrice: 60,
    pricePerKm: 15,
    waitingChargePerMinute: 4,
    maxPassengers: 6
  },
  {
    name: "12 Seaters",
    description: "Mini-bus taxi service for groups and events",
    basePrice: 120,
    pricePerKm: 25,
    waitingChargePerMinute: 8,
    maxPassengers: 12
  }
];

async function seedTaxiCategories() {
  console.log("Seeding taxi categories...");
  
  try {
    // Check if categories already exist
    const existingCategories = await storage.getTaxiCategories();
    
    if (existingCategories.length === 0) {
      for (const categoryData of defaultTaxiCategories) {
        await storage.createTaxiCategory(categoryData);
        console.log(`Created taxi category: ${categoryData.name}`);
      }
      console.log("Taxi categories seeded successfully!");
    } else {
      console.log("Taxi categories already exist, skipping seed...");
    }
    
  } catch (error) {
    console.error("Error seeding taxi categories:", error);
  }
}

seedTaxiCategories();