import { useState, useEffect } from "react";
import { fetchSubcategoriesForCategory, getSubcategoriesForCategory } from "@/lib/category-helper";

// Interface for the component props
interface CategorySubcategoriesDirectProps {
  categoryId: string | number | null;
  onSelect: (id: string | null) => void;
  activeSubcategory: string | null;
}

/**
 * Direct subcategory component that uses the category-helper to ensure subcategories display
 * This component bypasses React Query and uses direct API calls to ensure reliability
 */
export default function CategorySubcategoriesDirect({ 
  categoryId, 
  onSelect, 
  activeSubcategory 
}: CategorySubcategoriesDirectProps) {
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  
  // Fetch subcategories directly via API when categoryId changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setLoading(false);
      return;
    }
    
    console.log(`[CategoryDirect] Attempting to load subcategories for category ${categoryId}`);
    
    // First use any existing data while we load
    const initialData = getSubcategoriesForCategory(categoryId);
    console.log(`[CategoryDirect] Initial data from cache for category ${categoryId}:`, initialData);
    setSubcategories(initialData);
    
    // Then fetch fresh data directly from the API
    setLoading(true);
    console.log(`[CategoryDirect] Fetching fresh data for category ${categoryId} from API`);
    
    // Use direct fetch to bypass any caching
    const timestamp = new Date().getTime();
    const url = `/api/grocery/subcategories-public?parentCategoryId=${categoryId}&_=${timestamp}`;
    console.log(`[CategoryDirect] Making direct API request to: ${url}`);
    
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(response => {
        console.log(`[CategoryDirect] API response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        return response.json();
      })
      .then(freshData => {
        console.log(`[CategoryDirect] API response data for category ${categoryId}:`, freshData);
        if (freshData && freshData.length > 0) {
          console.log(`[CategoryDirect] ✅ Loaded ${freshData.length} subcategories for category ${categoryId}`);
          setSubcategories(freshData);
        } else {
          console.warn(`[CategoryDirect] ⚠️ No subcategories found for category ${categoryId}`);
        }
      })
      .catch(error => {
        console.error(`[CategoryDirect] ❌ Error loading subcategories: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);
  
  // Default colors for different subcategories - for visual variety
  const defaultColors = [
    "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-red-100", 
    "bg-purple-100", "bg-orange-100", "bg-teal-100", "bg-indigo-100"
  ];
  
  // Process subcategories for display
  console.log(`[CategoryDirect] Processing ${subcategories.length} subcategories for display for category ${categoryId}`);
  
  const displaySubcategories = subcategories.map((sub, index) => {
    console.log(`[CategoryDirect] Processing subcategory: ${sub.id} - ${sub.name}`);
    return {
      ...sub,
      id: sub.id.toString(),
      icon: sub.icon || "📦",
      color: sub.color || defaultColors[index % defaultColors.length] 
    };
  });

  console.log(`[CategoryDirect] Final displaySubcategories for category ${categoryId}:`, displaySubcategories);

  // If category is null, don't show anything
  if (!categoryId) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      {loading && subcategories.length === 0 ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {displaySubcategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {displaySubcategories.map((subcat) => (
                <button
                  key={subcat.id}
                  className={`
                    flex items-center w-full text-left p-2 text-sm rounded-md transition-all
                    ${activeSubcategory === subcat.id 
                      ? "ring-1 ring-primary bg-primary/5 shadow-sm" 
                      : `${subcat.color} hover:brightness-95`}
                  `}
                  onClick={() => {
                    console.log(`Selected subcategory: ${subcat.name} (ID: ${subcat.id})`);
                    onSelect(activeSubcategory === subcat.id ? null : subcat.id);
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
                      <span className="mr-3 text-xl p-2 bg-white rounded-full shadow-sm" role="img" aria-label={subcat.name}>
                        {subcat.icon}
                      </span>
                    )}
                    <div>
                      <span className={`font-medium ${activeSubcategory === subcat.id ? "text-primary" : ""}`}>
                        {subcat.name}
                      </span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Click to view all {subcat.name.toLowerCase()} products
                      </div>
                    </div>
                  </div>
                  {activeSubcategory === subcat.id && (
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