/**
 * Dedicated module for oil subcategories to ensure they're always available
 */

// Define the type for consistency
export interface OilSubcategory {
  id: number;
  name: string;
  imageUrl: string;
  parentCategoryId: number;
  isActive?: boolean;
}

// Fallback subcategories in case API fails
const FALLBACK_OIL_SUBCATEGORIES: OilSubcategory[] = [
  { id: 5, name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg", parentCategoryId: 4 },
  { id: 6, name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg", parentCategoryId: 4 },
  { id: 7, name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg", parentCategoryId: 4 },
  { id: 11, name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg", parentCategoryId: 4 }
];

// Fetches oil subcategories from dedicated endpoint
export async function fetchOilSubcategories(): Promise<OilSubcategory[]> {
  try {
    console.log("Fetching oil subcategories from dedicated endpoint");
    const response = await fetch("/api/grocery/oil-subcategories");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} oil subcategories from API`);
    return data;
  } catch (error) {
    console.error("Error fetching oil subcategories:", error);
    console.log("Using fallback oil subcategories");
    return FALLBACK_OIL_SUBCATEGORIES;
  }
}

// Check if a category is the oils category
export function isOilsCategory(categoryId: string | number | null | undefined): boolean {
  if (!categoryId) return false;
  
  const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
  return id === 4;
}