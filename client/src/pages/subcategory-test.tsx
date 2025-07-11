import { useState } from "react";
import DirectSubcategoryList from "@/components/direct-subcategory-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * A simple test page to verify our direct subcategory component is working
 */
export default function SubcategoryTestPage() {
  const [categoryId, setCategoryId] = useState<string | null>("4"); // Default to oils
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  
  // Array of available categories to test
  const categories = [
    { id: "1", name: "Fruits" },
    { id: "2", name: "Vegetables" },
    { id: "3", name: "Grains" },
    { id: "4", name: "Oils" },
  ];
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Subcategory Component Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Direct Subcategory Display</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">1. Select Category:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={categoryId === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCategoryId(cat.id);
                          setActiveSubcategory(null);
                        }}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">2. Available Subcategories:</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {categoryId ? (
                      <DirectSubcategoryList
                        categoryId={categoryId}
                        onSelect={setActiveSubcategory}
                        activeSubcategory={activeSubcategory}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Select a category first</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8 lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Active Category:</h3>
                    <pre className="bg-gray-100 p-2 rounded-md text-sm">
                      {categoryId || "null"}
                    </pre>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Selected Subcategory:</h3>
                    <pre className="bg-gray-100 p-2 rounded-md text-sm">
                      {activeSubcategory || "null"}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">API Endpoint:</h3>
                  <pre className="bg-gray-100 p-2 rounded-md text-sm whitespace-normal break-all">
                    {categoryId ? `/api/grocery/subcategories-public?parentCategoryId=${categoryId}` : "-"}
                  </pre>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (categoryId) {
                        window.open(`/api/grocery/subcategories-public?parentCategoryId=${categoryId}`, "_blank");
                      }
                    }}
                    disabled={!categoryId}
                  >
                    Test API Directly
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Request Flow:</h3>
                  <ol className="ml-5 text-sm space-y-1 list-decimal">
                    <li>Component makes direct API request to <code>/api/grocery/subcategories-public</code></li>
                    <li>Server looks up subcategories in the database</li>
                    <li>If subcategories are found, they are returned</li>
                    <li>If not found, hardcoded fallbacks are provided</li>
                    <li>Component displays the subcategories with images or icons</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}