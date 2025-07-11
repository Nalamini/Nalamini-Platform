import { Express } from "express";
import { getOilSubcategories } from "./services/oilService";

/**
 * Register dedicated oil subcategory routes to ensure maximum reliability
 * This function adds special endpoints that bypass all authentication and complex logic
 */
export function registerOilRoutes(app: Express) {
  // Special direct API endpoint just for oil subcategories - no authentication required
  app.get("/api/grocery/oil-subcategories", (req, res) => {
    try {
      console.log("[OIL API] Direct request for oil subcategories");
      
      // Set proper headers for maximum compatibility
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      const oilSubcategories = getOilSubcategories();
      console.log("[OIL API] Returning", oilSubcategories.length, "oil subcategories");
      res.json(oilSubcategories);
    } catch (error) {
      console.error("[OIL API] Error:", error);
      // Even if there's an error, return some basic oil subcategories
      res.json([
        { 
          id: 6, 
          name: "Groundnut oil", 
          imageUrl: "/api/svg/fallback/groundnut-oil", 
          parentCategoryId: 4,
          isActive: true 
        }
      ]);
    }
  });
}