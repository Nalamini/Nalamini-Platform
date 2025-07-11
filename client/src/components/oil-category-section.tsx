import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { isOilsCategory } from "@/lib/oil-category-helper";
import { fetchOilSubcategories } from "@/lib/category-helper";
import { useEffect } from "react";

interface OilCategorySectionProps {
  onSelectSubcategory: (id: string | null) => void;
  activeSubcategory: string | null;
  isVisible: boolean;
}

/**
 * This component specifically handles displaying oil subcategories
 * in a prominent, visual way when the oils category is active
 */
export default function OilCategorySection({ 
  onSelectSubcategory, 
  activeSubcategory,
  isVisible 
}: OilCategorySectionProps) {
  // Fetch oil subcategories directly when the component becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchOilSubcategories()
        .then(data => {
          console.log("🛢️ Oil subcategories prefetched for display:", data.length);
        })
        .catch(err => {
          console.error("Failed to prefetch oil subcategories:", err);
        });
    }
  }, [isVisible]);

  // Oil subcategories query with type assertion for safety
  const { data: subcategories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/grocery/subcategories", "4"],
    enabled: isVisible,
  });

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Oil Types</h2>
      <p className="text-gray-500 mb-4">Select an oil type to see products from that category:</p>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 h-32 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {subcategories.map((subcategory: any) => {
            const isActive = activeSubcategory === subcategory.id.toString();
            
            // Determine the color/style for each oil type
            let bgColor = "bg-gray-50";
            let icon = "🛢️";
            
            const name = subcategory.name.toLowerCase();
            if (name.includes('coconut')) {
              bgColor = "bg-amber-50";
              icon = "🥥";
            } else if (name.includes('groundnut') || name.includes('peanut')) {
              bgColor = "bg-yellow-50";
              icon = "🥜";
            } else if (name.includes('olive')) {
              bgColor = "bg-green-50";
              icon = "🫒";
            } else if (name.includes('palm')) {
              bgColor = "bg-orange-50";
              icon = "🌴";
            }
            
            return (
              <Card 
                key={subcategory.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary/70 shadow-sm' : ''}`}
                onClick={() => onSelectSubcategory(isActive ? null : subcategory.id.toString())}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-12 h-12 ${bgColor} flex items-center justify-center rounded-full text-2xl`}>
                    {icon}
                  </div>
                  <div className={`ml-2 font-medium ${isActive ? 'text-primary' : 'text-gray-800'}`}>
                    {subcategory.name}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Select to see all {subcategory.name.toLowerCase()} products
                </p>
                {isActive && (
                  <div className="mt-2 text-xs text-primary">
                    ✓ Currently viewing
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}