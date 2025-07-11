import { seedServiceAgents } from "./seed-service-agents";

// Run the seeding function
(async () => {
  try {
    console.log("Starting service agent seeding...");
    await seedServiceAgents();
    console.log("Service agent seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during service agent seeding:", error);
    process.exit(1);
  }
})();