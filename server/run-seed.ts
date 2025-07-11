import { seedDatabase } from "./seed";

// Run the seed function
(async () => {
  try {
    console.log("Starting database seeding...");
    await seedDatabase();
    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
})();