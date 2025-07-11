import { Express } from "express";
import { db } from "./db";
import { grocerySubCategories } from "@shared/schema";
import { eq } from "drizzle-orm";

// Hardcoded fallback subcategories for critical categories
const DEFAULT_SUBCATEGORIES: Record<string, any[]> = {
  // Category 1: Fruits
  "1": [
    { id: 1, name: "Apples", imageUrl: "/api/svg/fallback/apple", parentCategoryId: 1, isActive: true },
    { id: 2, name: "Bananas", imageUrl: "/api/svg/fallback/banana", parentCategoryId: 1, isActive: true },
    { id: 3, name: "Oranges", imageUrl: "/api/svg/fallback/orange", parentCategoryId: 1, isActive: true },
    { id: 4, name: "Berries", imageUrl: "/api/svg/fallback/berry", parentCategoryId: 1, isActive: true }
  ],
  
  // Category 2: Vegetables
  "2": [
    { id: 8, name: "Leafy Greens", imageUrl: "/api/svg/fallback/leafy-green", parentCategoryId: 2, isActive: true },
    { id: 9, name: "Root Vegetables", imageUrl: "/api/svg/fallback/root-vegetable", parentCategoryId: 2, isActive: true },
    { id: 10, name: "Gourds", imageUrl: "/api/svg/fallback/gourd", parentCategoryId: 2, isActive: true }
  ],
  
  // Category 3: Grains
  "3": [
    { id: 12, name: "Rice", imageUrl: "/api/svg/fallback/rice", parentCategoryId: 3, isActive: true },
    { id: 13, name: "Wheat", imageUrl: "/api/svg/fallback/wheat", parentCategoryId: 3, isActive: true },
    { id: 14, name: "Millets", imageUrl: "/api/svg/fallback/millet", parentCategoryId: 3, isActive: true }
  ],
  
  // Category 4: Oils (mirror from oil-category-helper.ts)
  "4": [
    { id: 5, name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 6, name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 7, name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg", parentCategoryId: 4, isActive: true },
    { id: 11, name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg", parentCategoryId: 4, isActive: true }
  ]
};

/**
 * Register dedicated subcategory routes to ensure maximum reliability
 * This function adds special endpoints that bypass all authentication and complex logic
 */
export function registerSubcategoryRoutes(app: Express) {
  // Public endpoint for subcategories that doesn't require authentication
  app.get("/api/grocery/subcategories-public", async (req, res) => {
    try {
      const parentCategoryId = req.query.parentCategoryId;
      
      if (!parentCategoryId) {
        return res.status(400).json({ error: "Missing parentCategoryId parameter" });
      }
      
      console.log(`[SUBCATEGORY API] Request for subcategories of category ${parentCategoryId}`);
      
      // Set proper headers for maximum compatibility
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      // Query the database for subcategories
      const subcategories = await db.select().from(grocerySubCategories)
        .where(eq(grocerySubCategories.parentCategoryId, Number(parentCategoryId)))
        .orderBy(grocerySubCategories.displayOrder);
      
      if (subcategories && subcategories.length > 0) {
        console.log(`[SUBCATEGORY API] Found ${subcategories.length} subcategories for parentCategoryId ${parentCategoryId}`);
        return res.json(subcategories);
      }
      
      // If no subcategories were found, use fallback data
      console.log(`[SUBCATEGORY API] No subcategories found for category ${parentCategoryId}, using fallbacks`);
      const fallbacks = DEFAULT_SUBCATEGORIES[parentCategoryId.toString()] || [];
      
      return res.json(fallbacks);
    } catch (error) {
      console.error(`[SUBCATEGORY API] Error:`, error);
      
      // Even if there's an error, return fallback subcategories if we have them for this category
      const categoryId = req.query.parentCategoryId?.toString() || '';
      const fallbacks = DEFAULT_SUBCATEGORIES[categoryId] || [];
      
      res.json(fallbacks);
    }
  });
  
  // Special SVG fallback endpoint that returns simple SVG images for categories without images
  app.get("/api/svg/fallback/:name", (req, res) => {
    const name = req.params.name.toLowerCase();
    let color = "#4CAF50"; // Default green
    let content = "";
    
    // Customize SVG based on product type
    switch(name) {
      case "apple":
        color = "#e53935"; // Red
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "banana":
        color = "#FFD600"; // Yellow
        content = `<path d="M30,20 C90,20 70,80 30,80 Z" fill="${color}" stroke="#5D4037" stroke-width="2" />`;
        break;
      case "orange":
        color = "#FF9800"; // Orange
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "berry":
        color = "#8E24AA"; // Purple
        content = `<circle cx="50" cy="50" r="40" fill="${color}" />`;
        break;
      case "leafy-green":
        color = "#66BB6A"; // Green
        content = `<path d="M30,50 C30,20 70,20 70,50 C70,80 30,80 30,50 Z" fill="${color}" />`;
        break;
      case "root-vegetable":
        color = "#FF7043"; // Orange-brown
        content = `<path d="M50,30 L60,60 L50,80 L40,60 Z" fill="${color}" />`;
        break;
      case "gourd":
        color = "#26A69A"; // Teal
        content = `<ellipse cx="50" cy="50" rx="30" ry="40" fill="${color}" />`;
        break;
      case "rice":
        color = "#F5F5F5"; // White
        content = `<rect x="30" y="30" width="40" height="40" fill="${color}" stroke="#BDBDBD" stroke-width="1" />`;
        break;
      case "wheat":
        color = "#FFA000"; // Amber
        content = `<path d="M50,20 L50,80 M40,30 L50,20 L60,30 M35,50 L50,40 L65,50 M30,70 L50,60 L70,70" stroke="${color}" stroke-width="3" />`;
        break;
      case "millet":
        color = "#FFB74D"; // Light orange
        content = `<circle cx="50" cy="50" r="25" fill="${color}" />
                   <circle cx="35" cy="35" r="8" fill="${color}" />
                   <circle cx="65" cy="35" r="8" fill="${color}" />
                   <circle cx="35" cy="65" r="8" fill="${color}" />
                   <circle cx="65" cy="65" r="8" fill="${color}" />`;
        break;
      case "groundnut-oil":
        color = "#D7CCC8"; // Brown-ish
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "olive-oil":
        color = "#9CCC65"; // Light green
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "coconut-oil":
        color = "#BCAAA4"; // Light brown
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      case "palm-oil":
        color = "#FFCA28"; // Amber
        content = `<rect x="30" y="30" width="40" height="50" rx="5" fill="${color}" />
                   <rect x="40" y="25" width="20" height="10" rx="3" fill="${color}" />`;
        break;
      default:
        // Generic product icon
        color = "#90CAF9"; // Light blue
        content = `<rect x="30" y="30" width="40" height="40" rx="5" fill="${color}" />`;
    }
    
    // Create a simple SVG as a fallback
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        ${content}
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });
}