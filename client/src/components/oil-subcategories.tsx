import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Interface for the component props
interface OilSubcategoriesProps {
  onSelect: (id: string | null) => void;
  activeSubcategory: string | null;
}

// Create a simplified version of the oil subcategories component
export default function OilSubcategories({ onSelect, activeSubcategory }: OilSubcategoriesProps) {
  // Query for oil subcategories
  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ["/api/grocery/subcategories", "4"],
    enabled: true,
  });
  
  // Fallback oil types with emoji icons - only used if API call fails
  const fallbackOilTypes = [
    { id: "5", name: "Coconut oil", icon: "🥥", color: "bg-amber-100", imageUrl: "/uploads/fallback/coconut-oil.svg" },
    { id: "6", name: "Groundnut oil", icon: "🥜", color: "bg-yellow-100", imageUrl: "/uploads/fallback/groundnut-oil.svg" },
    { id: "7", name: "Olive oil", icon: "🫒", color: "bg-green-100", imageUrl: "/uploads/fallback/olive-oil.svg" },
    { id: "11", name: "Palm oil", icon: "🌴", color: "bg-orange-100", imageUrl: "/uploads/fallback/palm-oil.svg" }
  ];
  
  // Combine real subcategories with fallback data for display
  const oilTypes = subcategories && subcategories.length > 0
    ? subcategories.map((sub: any) => {
        const fallback = fallbackOilTypes.find(f => f.id === sub.id.toString());
        return {
          ...sub,
          id: sub.id.toString(),
          icon: fallback?.icon || "🛢️",
          color: fallback?.color || "bg-gray-100"
        };
      })
    : fallbackOilTypes;

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2">
            {oilTypes.map((oil) => (
              <button
                key={oil.id}
                className={`
                  flex items-center w-full text-left p-2 text-sm rounded-md transition-all
                  ${activeSubcategory === oil.id 
                    ? "ring-1 ring-primary bg-primary/5 shadow-sm" 
                    : `${oil.color} hover:brightness-95`}
                `}
                onClick={() => {
                  console.log(`Selected oil: ${oil.name} (ID: ${oil.id})`);
                  onSelect(activeSubcategory === oil.id ? null : oil.id);
                }}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl p-2 bg-white rounded-full shadow-sm" role="img" aria-label={oil.name}>
                    {oil.icon}
                  </span>
                  <div>
                    <span className={`font-medium ${activeSubcategory === oil.id ? "text-primary" : ""}`}>
                      {oil.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Click to view all {oil.name.toLowerCase()} products
                    </div>
                  </div>
                </div>
                {activeSubcategory === oil.id && (
                  <div className="flex-shrink-0 ml-2 text-primary">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          
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