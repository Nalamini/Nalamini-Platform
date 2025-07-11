/**
 * Helper module for dealing with all categories consistently
 * This provides a reliable way to access subcategories regardless of auth state
 */

import { queryClient } from "./queryClient";

/**
 * Fallback subcategories data for important categories
 */
export const DEFAULT_SUBCATEGORIES: Record<string, any[]> = {
  // Category 1: Fruits
  "1": [
    { id: 1, name: "Apples", imageUrl: "/api/svg/fallback/apple", parentCategoryId: 1 },
    { id: 2, name: "Bananas", imageUrl: "/api/svg/fallback/banana", parentCategoryId: 1 },
    { id: 3, name: "Oranges", imageUrl: "/api/svg/fallback/orange", parentCategoryId: 1 },
    { id: 4, name: "Berries", imageUrl: "/api/svg/fallback/berry", parentCategoryId: 1 }
  ],
  
  // Category 2: Vegetables
  "2": [
    { id: 8, name: "Leafy Greens", imageUrl: "/api/svg/fallback/leafy-green", parentCategoryId: 2 },
    { id: 9, name: "Root Vegetables", imageUrl: "/api/svg/fallback/root-vegetable", parentCategoryId: 2 },
    { id: 10, name: "Gourds", imageUrl: "/api/svg/fallback/gourd", parentCategoryId: 2 }
  ],
  
  // Category 3: Grains
  "3": [
    { id: 12, name: "Rice", imageUrl: "/api/svg/fallback/rice", parentCategoryId: 3 },
    { id: 13, name: "Wheat", imageUrl: "/api/svg/fallback/wheat", parentCategoryId: 3 },
    { id: 14, name: "Millets", imageUrl: "/api/svg/fallback/millet", parentCategoryId: 3 }
  ],
  
  // Category 4: Oils (mirror from oil-category-helper.ts)
  "4": [
    { id: 5, name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg", parentCategoryId: 4 },
    { id: 6, name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg", parentCategoryId: 4 },
    { id: 7, name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg", parentCategoryId: 4 },
    { id: 11, name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg", parentCategoryId: 4 }
  ]
};

/**
 * Fetch the subcategories directly for any category, bypassing React Query
 * This is useful for ensuring we always have the data regardless of auth state
 */
export async function fetchSubcategoriesForCategory(categoryId: string | number): Promise<any[]> {
  try {
    console.log(`🔍 [CategoryHelper] Directly fetching subcategories for category ${categoryId} from dedicated endpoint...`);
    const timestamp = new Date().getTime(); // Add timestamp to prevent caching
    
    // Use the dedicated public endpoint to avoid route conflicts
    const url = `/api/grocery/subcategories-public?parentCategoryId=${categoryId}&_=${timestamp}`;
    console.log(`🌐 [CategoryHelper] Making request to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    console.log(`📥 [CategoryHelper] API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📊 [CategoryHelper] Raw API response data:`, data);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`✅ [CategoryHelper] Found ${data.length} subcategories for category ${categoryId} from API`);
      
      // Update React Query cache with this fresh data for consistent access
      queryClient.setQueryData(["/api/grocery/subcategories", categoryId.toString()], data);
      queryClient.setQueryData(["/api/grocery/subcategories", Number(categoryId)], data);
      
      // Set a global variable for fallback
      if (typeof window !== 'undefined') {
        if (!window.subcategoriesMap) {
          window.subcategoriesMap = {};
        }
        window.subcategoriesMap[categoryId] = data;
        console.log(`💾 [CategoryHelper] Updated global window.subcategoriesMap[${categoryId}]`);
      }
      
      return data;
    } else {
      console.warn(`⚠️ [CategoryHelper] API returned empty or invalid subcategories data for category ${categoryId}`);
      const fallbackData = DEFAULT_SUBCATEGORIES[categoryId.toString()] || [];
      console.log(`🔄 [CategoryHelper] Using fallback data:`, fallbackData);
      return fallbackData;
    }
  } catch (error) {
    console.error(`❌ [CategoryHelper] Error fetching subcategories for category ${categoryId}: ${error}`);
    const fallbackData = DEFAULT_SUBCATEGORIES[categoryId.toString()] || [];
    console.log(`🔄 [CategoryHelper] Using fallback data after error:`, fallbackData);
    return fallbackData;
  }
}

/**
 * Get subcategories from all possible sources, prioritizing fresh data
 */
export function getSubcategoriesForCategory(categoryId: string | number): any[] {
  const categoryIdStr = categoryId.toString();
  
  // Try to get from React Query cache first (most up-to-date if available)
  const fromCache = queryClient.getQueryData(["/api/grocery/subcategories", categoryIdStr]) ||
                   queryClient.getQueryData(["/api/grocery/subcategories", Number(categoryId)]);
  
  if (Array.isArray(fromCache) && fromCache.length > 0) {
    return fromCache;
  }
  
  // Try global variable next (persists between renders)
  if (typeof window !== 'undefined' && 
      window.subcategoriesMap && 
      window.subcategoriesMap[categoryIdStr] && 
      Array.isArray(window.subcategoriesMap[categoryIdStr]) && 
      window.subcategoriesMap[categoryIdStr].length > 0) {
    return window.subcategoriesMap[categoryIdStr];
  }
  
  // Fallback to hardcoded defaults
  return DEFAULT_SUBCATEGORIES[categoryIdStr] || [];
}

/**
 * Fetch the oil subcategories directly, bypassing React Query
 * This is useful for ensuring we always have the data regardless of auth state
 */
export async function fetchOilSubcategories(): Promise<any[]> {
  try {
    console.log("🛢️ [CategoryHelper] Directly fetching oil subcategories from dedicated endpoint to bypass caching...");
    const timestamp = new Date().getTime(); // Add timestamp to prevent caching
    
    // Use the dedicated public endpoint we created to avoid route conflicts
    const response = await fetch(`/api/grocery/subcategories-public?parentCategoryId=4&_=${timestamp}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`✅ [CategoryHelper] Found ${data.length} oil subcategories from API`);
      
      // Update React Query cache with this fresh data for consistent access
      queryClient.setQueryData(["/api/grocery/subcategories", '4'], data);
      queryClient.setQueryData(["/api/grocery/subcategories", 4], data);
      
      // Set a global variable for oils fallback
      if (typeof window !== 'undefined') {
        window.oilSubcategories = data;
        // Also update the subcategoriesMap
        if (!window.subcategoriesMap) {
          window.subcategoriesMap = {};
        }
        window.subcategoriesMap['4'] = data;
      }
      
      return data;
    } else {
      console.warn("⚠️ [CategoryHelper] API returned empty or invalid oil subcategories data");
      return DEFAULT_SUBCATEGORIES["4"] || [];
    }
  } catch (error) {
    console.error(`❌ [CategoryHelper] Error fetching oil subcategories: ${error}`);
    return DEFAULT_SUBCATEGORIES["4"] || [];
  }
}

// Add TypeScript declaration to make window.subcategoriesMap available globally
declare global {
  interface Window {
    subcategoriesMap?: Record<string, any[]>;
    oilSubcategories?: any[];
  }
}