// This script is a wrapper to run the commission configs migration
import { exec } from 'child_process';

console.log("Running commission configs migration...");

exec('npx tsx server/migrate-commission-configs.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  
  console.log(stdout);
  console.log("Commission configs migration completed successfully!");
});