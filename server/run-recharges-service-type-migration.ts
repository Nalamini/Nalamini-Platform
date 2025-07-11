import { execSync } from "child_process";

// Run the migration script
try {
  console.log("Running recharges service type migration script...");
  execSync("npx tsx server/migrate-recharges-service-type.ts", { stdio: "inherit" });
  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}