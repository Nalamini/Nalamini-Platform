/**
 * Helper module for dealing with oil subcategories consistently
 * This provides a reliable way to access oil subcategories regardless of auth state
 */

import { queryClient } from "./queryClient";

/**
 * Oil subcategories data with fallback options
 */
export const DEFAULT_OIL_SUBCATEGORIES = [
  { id: 5, name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg", parentCategoryId: 4 },
  { id: 6, name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg", parentCategoryId: 4 },
  { id: 7, name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg", parentCategoryId: 4 },
  { id: 11, name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg", parentCategoryId: 4 }
];

/**
 * Check if the given category ID represents the oils category
 */
export function isOilsCategory(categoryId: string | number | null): boolean {
  if (!categoryId) return false;
  return categoryId === 4 || categoryId === '4';
}

/**
 * Fetch the oil subcategories directly, bypassing React Query
 * This is useful for ensuring we always have the data regardless of auth state
 */
export async function fetchOilSubcategories(): Promise<any[]> {
  try {
    console.log("🛢️ Directly fetching oil subcategories from dedicated endpoint to bypass caching...");
    // Use the dedicated public endpoint we created to avoid route conflicts
    const response = await fetch('/api/grocery/subcategories-public?parentCategoryId=4');
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`Found ${data.length} oil subcategories from API`);
      
      // Update React Query cache with this fresh data for consistent access
      queryClient.setQueryData(["/api/grocery/subcategories", '4'], data);
      queryClient.setQueryData(["/api/grocery/subcategories", 4], data);
      
      // Set a global variable for oils fallback
      if (typeof window !== 'undefined') {
        window.oilSubcategories = data;
      }
      
      return data;
    } else {
      console.warn("API returned empty or invalid oil subcategories data");
      return DEFAULT_OIL_SUBCATEGORIES;
    }
  } catch (error) {
    console.error(`Error fetching oil subcategories: ${error}`);
    return DEFAULT_OIL_SUBCATEGORIES;
  }
}

/**
 * Get oil subcategories from all possible sources, prioritizing fresh data
 */
export function getOilSubcategories(): any[] {
  // Try to get from React Query cache first (most up-to-date if available)
  const fromCache = queryClient.getQueryData(["/api/grocery/subcategories", '4']) ||
                   queryClient.getQueryData(["/api/grocery/subcategories", 4]);
  
  if (Array.isArray(fromCache) && fromCache.length > 0) {
    return fromCache;
  }
  
  // Try global variable next (persists between renders)
  if (typeof window !== 'undefined' && 
      window.oilSubcategories && 
      Array.isArray(window.oilSubcategories) && 
      window.oilSubcategories.length > 0) {
    return window.oilSubcategories;
  }
  
  // Fallback to hardcoded defaults
  return DEFAULT_OIL_SUBCATEGORIES;
}