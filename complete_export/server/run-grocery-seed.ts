import { seedGroceryProducts } from "./seed-grocery";

// Execute the seeding
seedGroceryProducts()
  .then(() => {
    console.log("Grocery products seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding grocery products:", error);
    process.exit(1);
  });