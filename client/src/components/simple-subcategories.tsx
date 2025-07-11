import { useState, useEffect } from "react";

interface SimpleSubcategoriesProps {
  categoryId: string | number | null;
  onSelect: (id: string | null) => void;
  activeSubcategory: string | null;
}

interface SubcategoryItem {
  id: number | string;
  name: string;
  imageUrl?: string;
}

export default function SimpleSubcategories({
  categoryId,
  onSelect,
  activeSubcategory
}: SimpleSubcategoriesProps) {
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  
  // Hardcoded subcategories for each category based on what we know works
  const hardcodedSubcategories: Record<string, SubcategoryItem[]> = {
    // Fruits (category 1)
    "1": [
      { id: "10", name: "Pineapple", imageUrl: "/uploads/fallback/pineapple.svg" }
    ],
    // Vegetables (category 2)
    "2": [
      { id: "8", name: "Beetroot", imageUrl: "/uploads/fallback/beetroot.svg" },
      { id: "9", name: "Broccoli", imageUrl: "/uploads/fallback/broccoli.svg" },
      { id: "13", name: "Potato", imageUrl: "/uploads/fallback/potato.svg" },
      { id: "14", name: "Spinach", imageUrl: "/uploads/fallback/spinach.svg" },
      { id: "15", name: "Tomato", imageUrl: "/uploads/fallback/tomato.svg" },
      { id: "16", name: "Onion", imageUrl: "/uploads/fallback/onion.svg" },
      { id: "17", name: "Carrot", imageUrl: "/uploads/fallback/carrot.svg" },
      { id: "18", name: "Cucumber", imageUrl: "/uploads/fallback/cucumber.svg" }
    ],
    // Grains (category 3)
    "3": [
      { id: "12", name: "Rice", imageUrl: "/uploads/fallback/rice.svg" },
      { id: "19", name: "Wheat", imageUrl: "/uploads/fallback/wheat.svg" },
      { id: "20", name: "Oats", imageUrl: "/uploads/fallback/oats.svg" }
    ],
    // Oils (category 4)
    "4": [
      { id: "5", name: "Coconut oil", imageUrl: "/uploads/fallback/coconut-oil.svg" },
      { id: "6", name: "Groundnut oil", imageUrl: "/uploads/fallback/groundnut-oil.svg" },
      { id: "7", name: "Olive oil", imageUrl: "/uploads/fallback/olive-oil.svg" },
      { id: "11", name: "Palm oil", imageUrl: "/uploads/fallback/palm-oil.svg" }
    ]
  };
  
  // Effect to load subcategories when categoryId changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    setLoading(true);
    
    // First try to load from hardcoded data
    const categoryKey = categoryId.toString();
    if (hardcodedSubcategories[categoryKey]) {
      console.log(`[SimpleSubcategories] Using hardcoded data for category ${categoryId}`);
      setSubcategories(hardcodedSubcategories[categoryKey]);
      setLoading(false);
      return;
    }
    
    // Fallback to API call if we don't have hardcoded data
    console.log(`[SimpleSubcategories] Fetching subcategories for category ${categoryId}`);
    
    const timestamp = new Date().getTime();
    fetch(`/api/grocery/subcategories-public?parentCategoryId=${categoryId}&_=${timestamp}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(`[SimpleSubcategories] API returned ${data.length} subcategories`);
      if (data && Array.isArray(data) && data.length > 0) {
        setSubcategories(data);
      } else {
        setSubcategories([]);
      }
    })
    .catch(error => {
      console.error(`[SimpleSubcategories] API error:`, error);
      setSubcategories([]);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [categoryId]);
  
  // Default colors for visual variety
  const bgColors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-red-100", 
                   "bg-purple-100", "bg-orange-100", "bg-teal-100", "bg-indigo-100"];
  
  // If no category is selected, don't show anything
  if (!categoryId) {
    return null;
  }

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {subcategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {subcategories.map((subcat, index) => (
                <button
                  key={subcat.id}
                  className={`
                    flex items-center w-full text-left p-2 text-sm rounded-md transition-all
                    ${activeSubcategory === subcat.id.toString() 
                      ? "ring-1 ring-primary bg-primary/5 shadow-sm" 
                      : `${bgColors[index % bgColors.length]} hover:brightness-95`}
                  `}
                  onClick={() => {
                    console.log(`Selected subcategory: ${subcat.name} (ID: ${subcat.id})`);
                    onSelect(activeSubcategory === subcat.id.toString() ? null : subcat.id.toString());
                  }}
                >
                  <div className="flex items-center flex-1">
                    {subcat.imageUrl ? (
                      <img 
                        src={subcat.imageUrl} 
                        alt={subcat.name} 
                        className="w-8 h-8 mr-3 bg-white rounded-full p-1 shadow-sm object-contain"
                      />
                    ) : (
                      <span className="mr-3 text-xl p-2 bg-white rounded-full shadow-sm">
                        📦
                      </span>
                    )}
                    <div>
                      <span className={`font-medium ${activeSubcategory === subcat.id.toString() ? "text-primary" : ""}`}>
                        {subcat.name}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Click to view all {subcat.name.toLowerCase()} products
                      </div>
                    </div>
                  </div>
                  {activeSubcategory === subcat.id.toString() && (
                    <div className="flex-shrink-0 ml-2 text-primary">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No subcategories available for this category
            </div>
          )}
          
          {/* Clear selection button */}
          {activeSubcategory && (
            <button 
              onClick={() => onSelect(null)}
              className="text-xs text-primary hover:text-primary/70 underline mt-1 block w-full text-center"
            >
              Clear selection
            </button>
          )}
        </>
      )}
    </div>
  );
}