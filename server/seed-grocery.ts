import { db } from "./db";
import { groceryProducts, insertGroceryProductSchema } from "../shared/schema";
import { z } from "zod";

type InsertGroceryProduct = z.infer<typeof insertGroceryProductSchema>;

export async function seedGroceryProducts() {
  console.log("Seeding grocery products...");
  
  const products: InsertGroceryProduct[] = [
    {
      name: "Organic Tomatoes",
      description: "Fresh, pesticide-free tomatoes grown organically in Tamil Nadu.",
      category: "Vegetables",
      price: 60.00,
      discountedPrice: 50.00,
      farmerId: 1,
      stock: 100,
      unit: "kg",
      isOrganic: true,
      district: "Chennai"
    },
    {
      name: "Baby Potatoes",
      description: "Small, tender potatoes perfect for curries and roasting.",
      category: "Vegetables",
      price: 40.00,
      stock: 150,
      unit: "kg",
      isOrganic: false,
      district: "Coimbatore"
    },
    {
      name: "Green Chillies",
      description: "Spicy green chillies for adding heat to your dishes.",
      category: "Vegetables",
      price: 30.00,
      discountedPrice: 25.00,
      stock: 80,
      unit: "100g",
      isOrganic: false,
      district: "Madurai"
    },
    {
      name: "Organic Spinach",
      description: "Nutrient-rich organic spinach leaves, freshly harvested.",
      category: "Vegetables",
      price: 35.00,
      stock: 70,
      unit: "bunch",
      isOrganic: true,
      district: "Salem"
    },
    {
      name: "Red Onions",
      description: "Medium-sized red onions with a pungent flavor.",
      category: "Vegetables",
      price: 45.00,
      stock: 200,
      unit: "kg",
      isOrganic: false,
      district: "Tirunelveli"
    },
    {
      name: "Sweet Corn",
      description: "Fresh sweet corn cobs, perfect for grilling or boiling.",
      category: "Vegetables",
      price: 20.00,
      discountedPrice: 15.00,
      stock: 120,
      unit: "piece",
      isOrganic: false,
      district: "Erode"
    },
    {
      name: "Organic Carrots",
      description: "Crunchy organic carrots rich in beta-carotene.",
      category: "Vegetables",
      price: 55.00,
      stock: 90,
      unit: "kg",
      isOrganic: true,
      district: "Vellore"
    },
    {
      name: "Alphonso Mangoes",
      description: "Premium Alphonso mangoes known for their sweet flavor and aroma.",
      category: "Fruits",
      price: 300.00,
      discountedPrice: 250.00,
      stock: 50,
      unit: "kg",
      isOrganic: false,
      district: "Chennai"
    },
    {
      name: "Organic Bananas",
      description: "Naturally ripened organic bananas, rich in potassium.",
      category: "Fruits",
      price: 70.00,
      stock: 150,
      unit: "dozen",
      isOrganic: true,
      district: "Kanyakumari"
    },
    {
      name: "Watermelon",
      description: "Large, juicy watermelons perfect for summer refreshment.",
      category: "Fruits",
      price: 80.00,
      stock: 30,
      unit: "piece",
      isOrganic: false,
      district: "Madurai"
    },
    {
      name: "Green Apples",
      description: "Crisp and tart green apples, great for snacking or baking.",
      category: "Fruits",
      price: 180.00,
      discountedPrice: 150.00,
      stock: 100,
      unit: "kg",
      isOrganic: false,
      district: "Ooty"
    },
    {
      name: "Sweet Lime",
      description: "Refreshing sweet limes packed with vitamin C.",
      category: "Fruits",
      price: 90.00,
      stock: 80,
      unit: "kg",
      isOrganic: false,
      district: "Coimbatore"
    },
    {
      name: "Organic Strawberries",
      description: "Juicy organic strawberries, perfect for desserts or fresh consumption.",
      category: "Fruits",
      price: 250.00,
      discountedPrice: 220.00,
      stock: 40,
      unit: "250g",
      isOrganic: true,
      district: "Ooty"
    },
    {
      name: "Fresh Coconut",
      description: "Young coconuts with sweet water and tender meat.",
      category: "Fruits",
      price: 40.00,
      stock: 100,
      unit: "piece",
      isOrganic: false,
      district: "Kanyakumari"
    },
    {
      name: "Toned Milk",
      description: "Pasteurized toned milk with 3% fat content.",
      category: "Dairy",
      price: 50.00,
      stock: 200,
      unit: "liter",
      isOrganic: false,
      district: "Salem"
    },
    {
      name: "Organic Cow Ghee",
      description: "Pure organic cow ghee made using traditional methods.",
      category: "Dairy",
      price: 650.00,
      discountedPrice: 600.00,
      stock: 50,
      unit: "500g",
      isOrganic: true,
      district: "Erode"
    },
    {
      name: "Fresh Paneer",
      description: "Soft, protein-rich cottage cheese made fresh daily.",
      category: "Dairy",
      price: 280.00,
      stock: 60,
      unit: "500g",
      isOrganic: false,
      district: "Chennai"
    },
    {
      name: "Farm Fresh Curd",
      description: "Creamy, probiotic-rich curd made from pasteurized milk.",
      category: "Dairy",
      price: 40.00,
      stock: 100,
      unit: "500g",
      isOrganic: false,
      district: "Coimbatore"
    },
    {
      name: "Parmesan Cheese",
      description: "Aged Parmesan cheese, perfect for pasta and salads.",
      category: "Dairy",
      price: 350.00,
      stock: 30,
      unit: "200g",
      isOrganic: false,
      district: "Chennai"
    },
    {
      name: "Basmati Rice",
      description: "Premium long-grain basmati rice with a distinct aroma.",
      category: "Grains",
      price: 120.00,
      stock: 150,
      unit: "kg",
      isOrganic: false,
      district: "Thanjavur"
    },
    {
      name: "Organic Brown Rice",
      description: "Nutrient-rich organic brown rice, high in fiber.",
      category: "Grains",
      price: 140.00,
      discountedPrice: 125.00,
      stock: 100,
      unit: "kg",
      isOrganic: true,
      district: "Thanjavur"
    },
    {
      name: "Toor Dal",
      description: "Split pigeon peas used in traditional Indian dishes.",
      category: "Grains",
      price: 110.00,
      stock: 120,
      unit: "kg",
      isOrganic: false,
      district: "Madurai"
    },
    {
      name: "Organic Quinoa",
      description: "Protein-packed organic quinoa seeds, a superfood alternative to rice.",
      category: "Grains",
      price: 280.00,
      discountedPrice: 250.00,
      stock: 50,
      unit: "500g",
      isOrganic: true,
      district: "Chennai"
    },
    {
      name: "Whole Wheat Flour",
      description: "Stone-ground whole wheat flour for healthier rotis and bread.",
      category: "Grains",
      price: 60.00,
      stock: 200,
      unit: "kg",
      isOrganic: false,
      district: "Coimbatore"
    },
    {
      name: "Cold Pressed Coconut Oil",
      description: "Pure virgin coconut oil extracted using cold-press method.",
      category: "Oils",
      price: 280.00,
      stock: 70,
      unit: "500ml",
      isOrganic: false,
      district: "Kanyakumari"
    },
    {
      name: "Organic Sesame Oil",
      description: "Traditionally extracted organic sesame oil for authentic flavor.",
      category: "Oils",
      price: 320.00,
      discountedPrice: 290.00,
      stock: 60,
      unit: "500ml",
      isOrganic: true,
      district: "Thanjavur"
    },
    {
      name: "Groundnut Oil",
      description: "Refined groundnut oil with a high smoking point, ideal for frying.",
      category: "Oils",
      price: 180.00,
      stock: 100,
      unit: "liter",
      isOrganic: false,
      district: "Salem"
    },
    {
      name: "Olive Oil",
      description: "Extra virgin olive oil imported from Mediterranean regions.",
      category: "Oils",
      price: 550.00,
      discountedPrice: 499.00,
      stock: 40,
      unit: "500ml",
      isOrganic: false,
      district: "Chennai"
    },
    {
      name: "Red Chilli Powder",
      description: "Vibrant, spicy red chilli powder for adding heat to dishes.",
      category: "Spices",
      price: 80.00,
      stock: 120,
      unit: "100g",
      isOrganic: false,
      district: "Madurai"
    },
    {
      name: "Organic Turmeric Powder",
      description: "Pure organic turmeric powder with high curcumin content.",
      category: "Spices",
      price: 65.00,
      discountedPrice: 55.00,
      stock: 150,
      unit: "100g",
      isOrganic: true,
      district: "Erode"
    },
    {
      name: "Coriander Seeds",
      description: "Aromatic whole coriander seeds for grinding or tempering.",
      category: "Spices",
      price: 45.00,
      stock: 100,
      unit: "100g",
      isOrganic: false,
      district: "Coimbatore"
    },
    {
      name: "Black Pepper",
      description: "Strong and pungent black peppercorns for added spice.",
      category: "Spices",
      price: 120.00,
      stock: 80,
      unit: "100g",
      isOrganic: false,
      district: "Wayanad"
    },
    {
      name: "Cardamom",
      description: "Fragrant green cardamom pods for sweet and savory dishes.",
      category: "Spices",
      price: 250.00,
      stock: 50,
      unit: "50g",
      isOrganic: false,
      district: "Idukki"
    },
    {
      name: "Organic Moringa Powder",
      description: "Nutrient-dense organic moringa leaf powder, a natural superfood.",
      category: "Organic",
      price: 180.00,
      discountedPrice: 150.00,
      stock: 40,
      unit: "100g",
      isOrganic: true,
      district: "Salem"
    },
    {
      name: "Organic Jaggery",
      description: "Unrefined organic jaggery made from sugarcane juice.",
      category: "Organic",
      price: 90.00,
      stock: 100,
      unit: "500g",
      isOrganic: true,
      district: "Erode"
    },
    {
      name: "Organic Black Rice",
      description: "Exotic black rice rich in antioxidants and nutty in flavor.",
      category: "Organic",
      price: 220.00,
      stock: 60,
      unit: "500g",
      isOrganic: true,
      district: "Thanjavur"
    },
    {
      name: "Organic Virgin Coconut Oil",
      description: "Cold-pressed virgin coconut oil from organic coconuts.",
      category: "Organic",
      price: 350.00,
      discountedPrice: 310.00,
      stock: 50,
      unit: "500ml",
      isOrganic: true,
      district: "Kanyakumari"
    },
    {
      name: "Organic Raw Honey",
      description: "Unprocessed wild forest honey collected ethically.",
      category: "Organic",
      price: 450.00,
      stock: 40,
      unit: "500g",
      isOrganic: true,
      district: "Nilgiris"
    }
  ];

  // Check if products already exist
  const existingProducts = await db.select().from(groceryProducts);
  
  if (existingProducts.length > 0) {
    console.log(`${existingProducts.length} grocery products already exist in database.`);
    return;
  }
  
  // Insert all products
  await db.insert(groceryProducts).values(products);
  
  console.log(`Seeded ${products.length} grocery products successfully!`);
}