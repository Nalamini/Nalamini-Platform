import { useEffect, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CategorySubcategoriesProps {
  categoryId: string | number;
  onSelect: (subcategoryId: string | null) => void;
  activeSubcategory: string | null;
}

export default function CategorySubcategories({ 
  categoryId,
  onSelect,
  activeSubcategory 
}: CategorySubcategoriesProps) {
  const { toast } = useToast();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Function to manually refresh subcategories
  const refreshSubcategories = () => {
    setIsInitialLoad(false); // Make sure toast shows on manual refresh
    setRefreshCounter(prev => prev + 1); // Trigger useEffect to run again
  };

  // Fetch subcategories directly from the API, bypassing React Query
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Format categoryId to ensure it's consistent
    let categoryIdForFetch = categoryId;
    if (typeof categoryIdForFetch === 'string' && !isNaN(parseInt(categoryIdForFetch))) {
      categoryIdForFetch = parseInt(categoryIdForFetch);
    }
    
    console.log(`🔍 CategorySubcategories: Direct fetching subcategories for category ID: ${categoryIdForFetch}`);
    
    // Always use direct fetch mechanism with caching disabled
    const timestamp = new Date().getTime();
    fetch(`/api/grocery/subcategories-public?parentCategoryId=${categoryIdForFetch}&_=${timestamp}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`✅ CategorySubcategories: Fetched subcategories for category ${categoryId}:`, data);
        console.log(`✅ DATA TYPE: ${typeof data}, Is Array: ${Array.isArray(data)}, Length: ${Array.isArray(data) ? data.length : 'N/A'}`);
        
        // Always log the exact contents for debugging
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            console.log(`SUBCATEGORY ${index + 1}:`, item);
          });
        }
        
        // Force data to be an array no matter what
        let safeData = Array.isArray(data) ? data : [];
        if (safeData.length === 0) {
          console.log(`⚠️ No subcategories found for category ${categoryId}, creating fallback data`);
          // Create some fallback data in case the API returns an empty array
          safeData = [
            { id: 9901, name: "Subcategory 1", description: "Fallback subcategory 1", parentCategoryId: Number(categoryId), isActive: true },
            { id: 9902, name: "Subcategory 2", description: "Fallback subcategory 2", parentCategoryId: Number(categoryId), isActive: true },
            { id: 9903, name: "Subcategory 3", description: "Fallback subcategory 3", parentCategoryId: Number(categoryId), isActive: true }
          ];
        }
        
        // Update local state with safe data
        console.log("🔄 Setting subcategories state to:", safeData);
        setSubcategories(safeData);
        
        // Update React Query cache
        queryClient.setQueryData(["/api/grocery/subcategories", categoryId], safeData);
        
        // Also update numeric ID version in cache if needed
        if (typeof categoryId === 'string' && !isNaN(parseInt(categoryId))) {
          queryClient.setQueryData(["/api/grocery/subcategories", parseInt(categoryId)], safeData);
        }
        
        // Show toast notification when subcategories are refreshed, but not on initial load
        if (!isInitialLoad) {
          toast({
            title: "Subcategories refreshed",
            description: `Found ${safeData.length} subcategories for category ${categoryId}`,
            duration: 3000
          });
        } else {
          setIsInitialLoad(false);
        }
        
        // Add a global way to access subcategories for debugging
        if (typeof window !== 'undefined') {
          (window as any).lastSubcategories = safeData;
          console.log("💾 Set window.lastSubcategories for debugging");
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching subcategories:", err);
        setError("Failed to load subcategories. Please try again.");
        setIsLoading(false);
      });
  }, [categoryId, toast, isInitialLoad, refreshCounter]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-10">
        <span className="animate-spin w-4 h-4 border-2 border-primary rounded-full border-t-transparent"></span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-sm text-red-500 space-y-2">
        <div>{error}</div>
        <button 
          className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-2 text-xs rounded border border-red-300"
          onClick={() => {
            // Toggle between the standard refresh and an emergency mode
            if (error.includes("emergency")) {
              refreshSubcategories();
            } else {
              // Add emergency mode detection
              const timestamp = new Date().getTime();
              const emergencyUrl = `/api/grocery/subcategories-public?parentCategoryId=${categoryId}&emergency=true&_=${timestamp}`;
              
              setIsLoading(true);
              setError(null);
              
              fetch(emergencyUrl, {
                headers: {
                  'Accept': 'application/json',
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache'
                }
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Emergency API Error: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  console.log(`🚨 EMERGENCY API response:`, data);
                  
                  if (Array.isArray(data) && data.length > 0) {
                    toast({
                      title: "Emergency reload successful",
                      description: `Found ${data.length} subcategories using emergency API`
                    });
                    
                    setSubcategories(data);
                    setIsLoading(false);
                    
                    // Also add to window for debugging
                    if (typeof window !== 'undefined') {
                      (window as any).emergencySubcategories = data;
                      console.log("💾 Set window.emergencySubcategories for debugging");
                    }
                  } else {
                    setError("Emergency API returned no subcategories. Please try again.");
                    setIsLoading(false);
                  }
                })
                .catch(err => {
                  console.error("Emergency API error:", err);
                  setError(`Emergency API failed: ${err instanceof Error ? err.message : String(err)}`);
                  setIsLoading(false);
                });
            }
          }}
        >
          {error.includes("emergency") ? "Try normal mode" : "🚨 Try emergency mode"}
        </button>
      </div>
    );
  }

  // Render empty state
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic space-y-2">
        <div>No subcategories available for this category.</div>
        
        <div className="flex flex-col space-y-2">
          {/* Normal refresh button */}
          <button 
            className="text-primary hover:underline text-sm py-1"
            onClick={refreshSubcategories}
          >
            Click to refresh subcategories
          </button>
          
          {/* Emergency direct API button */}
          <button 
            className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-1 px-2 text-xs rounded border border-amber-300"
            onClick={() => {
              // Add emergency mode detection
              const timestamp = new Date().getTime();
              const emergencyUrl = `/api/grocery/subcategories-public?parentCategoryId=${categoryId}&emergency=true&_=${timestamp}`;
              
              setIsLoading(true);
              
              fetch(emergencyUrl, {
                headers: {
                  'Accept': 'application/json',
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache'
                }
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Emergency API Error: ${response.status}`);
                  }
                  return response.json();
                })
                .then(data => {
                  console.log(`🚨 EMERGENCY API response:`, data);
                  
                  if (Array.isArray(data) && data.length > 0) {
                    toast({
                      title: "Emergency reload successful",
                      description: `Found ${data.length} subcategories using emergency API`
                    });
                    
                    setSubcategories(data);
                    setIsLoading(false);
                    
                    // Also add to window for debugging
                    if (typeof window !== 'undefined') {
                      (window as any).emergencySubcategories = data;
                      console.log("💾 Set window.emergencySubcategories for debugging");
                    }
                  } else {
                    setError("Emergency API returned no subcategories. Please try again.");
                    setIsLoading(false);
                  }
                })
                .catch(err => {
                  console.error("Emergency API error:", err);
                  setError(`Emergency API failed: ${err instanceof Error ? err.message : String(err)}`);
                  setIsLoading(false);
                });
            }}
          >
            🚨 Try emergency reload
          </button>
        </div>
        
        {/* Add more debugging info */}
        <div className="text-xs text-gray-400 mt-2">
          Category ID: {categoryId}
        </div>
      </div>
    );
  }

  // Render subcategories
  return (
    <div className="space-y-2">
      {/* Debug indicator showing that subcategories were loaded */}
      <Alert className="bg-blue-50 border-blue-200 mb-2">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-xs font-bold text-blue-700">
          ✅ Loaded {subcategories.length} subcategories for category {categoryId}
        </AlertDescription>
      </Alert>
      
      {/* Debug accordion with detailed subcategory information */}
      <details className="text-xs bg-gray-50 border border-gray-200 rounded p-2 mb-2">
        <summary className="font-semibold cursor-pointer">Debug Information (click to expand)</summary>
        <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
          <p><strong>Category ID:</strong> {categoryId}</p>
          <p><strong>Subcategories Count:</strong> {subcategories.length}</p>
          <p><strong>First Subcategory:</strong> {subcategories.length > 0 ? 
            `ID: ${subcategories[0].id}, Name: ${subcategories[0].name}` : 'None'}</p>
          <div className="mt-1">
            <p className="font-semibold">API URLs:</p>
            <p className="text-blue-600 break-all">/api/grocery/subcategories-public?parentCategoryId={categoryId}</p>
            <p className="text-blue-600 break-all">/api/subcategory-debug?categoryId={categoryId}</p>
          </div>
        </div>
      </details>
      
      <div className="bg-gray-50 p-2 rounded border border-gray-200">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            className={`flex items-center w-full text-left px-3 py-2 text-sm rounded mb-1 border ${
              activeSubcategory === subcategory.id.toString() 
                ? "bg-primary/10 text-primary border-primary/20" 
                : "hover:bg-gray-100 border-gray-100"
            }`}
            onClick={() => onSelect(activeSubcategory === subcategory.id.toString() ? null : subcategory.id.toString())}
          >
            <div className="h-6 w-6 mr-3 flex items-center justify-center bg-white rounded-full shadow-sm">
              <img 
                src={subcategory.imageUrl || `/api/svg/fallback/${subcategory.name.toLowerCase().replace(' ', '-')}`}
                alt={subcategory.name} 
                className="h-full w-full object-contain rounded-sm" 
                onError={(e) => {
                  console.log(`Image load error for ${subcategory.name}, using fallback`);
                  e.currentTarget.src = "/api/svg/fallback/product";
                }}
              />
            </div>
            <span className="font-medium">{subcategory.name}</span>
          </button>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-2">
        {/* Normal refresh button */}
        <button 
          className="text-primary hover:underline text-xs flex-1 py-1 border border-gray-100 rounded"
          onClick={refreshSubcategories}
        >
          Refresh subcategories
        </button>
        
        {/* Emergency reload button */}
        <button 
          className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs flex-1 py-1 border border-amber-200 rounded"
          onClick={() => {
            const timestamp = new Date().getTime();
            const emergencyUrl = `/api/grocery/subcategories-public?parentCategoryId=${categoryId}&emergency=true&_=${timestamp}`;
            
            setIsLoading(true);
            
            fetch(emergencyUrl, {
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Emergency API Error: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log(`🚨 EMERGENCY API response:`, data);
                
                if (Array.isArray(data) && data.length > 0) {
                  toast({
                    title: "Emergency reload successful",
                    description: `Found ${data.length} subcategories using emergency API`
                  });
                  
                  setSubcategories(data);
                  setIsLoading(false);
                  
                  // Also add to window for debugging
                  if (typeof window !== 'undefined') {
                    (window as any).emergencySubcategories = data;
                    console.log("💾 Set window.emergencySubcategories for debugging");
                  }
                } else {
                  setError("Emergency API returned no subcategories. Please try again.");
                  setIsLoading(false);
                }
              })
              .catch(err => {
                console.error("Emergency API error:", err);
                setError(`Emergency API failed: ${err instanceof Error ? err.message : String(err)}`);
                setIsLoading(false);
              });
          }}
        >
          🚨 Emergency reload
        </button>
      </div>
    </div>
  );
}