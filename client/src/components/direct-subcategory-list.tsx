import { useEffect, useState } from "react";

interface DirectSubcategoryListProps {
  categoryId: string | number;
  onSelect: (id: string | null) => void;
  activeSubcategory: string | null;
}

// Hardcoded subcategories for each category to ensure reliable display
const HARDCODED_SUBCATEGORIES: Record<string, any[]> = {
  // Fruits (category 1)
  "1": [
    { id: "1", name: "Apples", displayColor: "bg-red-100" },
    { id: "2", name: "Bananas", displayColor: "bg-yellow-100" },
    { id: "3", name: "Oranges", displayColor: "bg-orange-100" },
    { id: "4", name: "Berries", displayColor: "bg-purple-100" }
  ],
  // Vegetables (category 2)
  "2": [
    { id: "8", name: "Leafy Greens", displayColor: "bg-green-100" },
    { id: "9", name: "Root Vegetables", displayColor: "bg-orange-100" },
    { id: "10", name: "Gourds", displayColor: "bg-green-100" }
  ],
  // Grains (category 3)
  "3": [
    { id: "12", name: "Rice", displayColor: "bg-amber-100" },
    { id: "13", name: "Wheat", displayColor: "bg-amber-200" },
    { id: "14", name: "Millets", displayColor: "bg-yellow-100" }
  ],
  // Oils (category 4)
  "4": [
    { id: "5", name: "Coconut Oil", displayColor: "bg-amber-100" },
    { id: "6", name: "Groundnut Oil", displayColor: "bg-yellow-100" },
    { id: "7", name: "Olive Oil", displayColor: "bg-green-100" },
    { id: "11", name: "Palm Oil", displayColor: "bg-orange-100" }
  ]
};

export default function DirectSubcategoryList({ 
  categoryId, 
  onSelect, 
  activeSubcategory 
}: DirectSubcategoryListProps) {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  
  // Load subcategories directly from hardcoded data when categoryId changes
  useEffect(() => {
    const categoryKey = categoryId?.toString();
    if (categoryKey && HARDCODED_SUBCATEGORIES[categoryKey]) {
      console.log(`📋 Using hardcoded subcategories for category ${categoryId}`);
      setSubcategories(HARDCODED_SUBCATEGORIES[categoryKey]);
    } else {
      console.log(`❌ No hardcoded subcategories for category ${categoryId}`);
      setSubcategories([]);
    }
  }, [categoryId]);
  
  if (!categoryId || subcategories.length === 0) {
    return (
      <p className="text-sm text-gray-500 p-2">No subcategories available</p>
    );
  }
  
  return (
    <div className="space-y-2">
      {subcategories.map((subcategory) => {
        const isActive = activeSubcategory === subcategory.id.toString();
        
        return (
          <button
            key={subcategory.id}
            onClick={() => onSelect(isActive ? null : subcategory.id.toString())}
            className={`w-full flex items-center p-3 rounded-md transition-all
              ${isActive 
                ? "ring-1 ring-primary shadow-sm bg-primary/5" 
                : `${subcategory.displayColor || "bg-gray-100"} hover:brightness-95`}
            `}
          >
            <div className="flex-1 text-left">
              <p className={`font-medium ${isActive ? "text-primary" : ""}`}>
                {subcategory.name}
              </p>
              <p className="text-xs text-gray-500">
                Select to view products
              </p>
            </div>
            {isActive && (
              <div className="flex-shrink-0 text-primary">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}