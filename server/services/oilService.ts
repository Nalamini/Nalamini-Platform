/**
 * Dedicated service for oil subcategories to ensure maximum reliability
 */

// Define the type for oil subcategories for consistency
export interface OilSubcategory {
  id: number;
  name: string;
  imageUrl: string;
  parentCategoryId: number;
  isActive: boolean;
  description?: string;
  displayOrder?: number;
}

// Hard-coded list of oil subcategories for maximum reliability
const OIL_SUBCATEGORIES: OilSubcategory[] = [
  {
    id: 5,
    name: "Coconut oil",
    description: "Pure coconut oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 1,
    imageUrl: "/uploads/fallback/coconut-oil.svg",
  },
  {
    id: 6,
    name: "Groundnut oil",
    description: "High-quality groundnut oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 2,
    imageUrl: "/uploads/fallback/groundnut-oil.svg",
  },
  {
    id: 7,
    name: "Olive oil",
    description: "Premium olive oil",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 3,
    imageUrl: "/uploads/fallback/olive-oil.svg",
  },
  {
    id: 11,
    name: "Palm oil",
    description: "Palm oil for cooking",
    parentCategoryId: 4,
    isActive: true,
    displayOrder: 4,
    imageUrl: "/uploads/fallback/palm-oil.svg",
  }
];

/**
 * Get all oil subcategories - no database lookup required for maximum reliability
 */
export function getOilSubcategories(): OilSubcategory[] {
  return OIL_SUBCATEGORIES;
}

/**
 * Get oil subcategory by ID - no database lookup required for maximum reliability
 */
export function getOilSubcategoryById(id: number): OilSubcategory | undefined {
  return OIL_SUBCATEGORIES.find(sub => sub.id === id);
}