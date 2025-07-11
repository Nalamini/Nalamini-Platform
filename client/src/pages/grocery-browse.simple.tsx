import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Types
interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

interface Subcategory {
  id: number;
  name: string;
  description?: string;
  parentCategoryId: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId?: number;
  subcategoryId?: number;
  price: number;
  unit?: string;
  imageUrl?: string;
}

export default function GroceryBrowsePage() {
  // State for selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Categories query
  const {
    data: categories = [] as Category[],
    isLoading: isLoadingCategories,
  } = useQuery<Category[]>({
    queryKey: ["/api/grocery/categories"],
    enabled: true,
  });

  // Subcategories query - only enabled when a category is selected
  const {
    data: subcategories = [] as Subcategory[],
    isLoading: isLoadingSubcategories,
  } = useQuery<Subcategory[]>({
    queryKey: ["/api/grocery/subcategories-public", selectedCategory],
    enabled: !!selectedCategory,
  });

  // Products query - enabled when either category or subcategory is selected
  const {
    data: products = [] as Product[],
    isLoading: isLoadingProducts,
  } = useQuery<Product[]>({
    queryKey: ["/api/grocery/products", selectedCategory, selectedSubcategory],
    enabled: !!selectedCategory || !!selectedSubcategory,
  });

  // Filtered products based on selection
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    // Filter by subcategory if selected
    if (selectedSubcategory && product.subcategoryId?.toString() !== selectedSubcategory) {
      return false;
    }
    
    // Filter by category if selected and no subcategory filter
    if (selectedCategory && !selectedSubcategory && product.categoryId?.toString() !== selectedCategory) {
      return false;
    }
    
    return true;
  }) : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Simple Grocery Browse</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Categories Column */}
        <div className="border p-4 h-screen overflow-auto">
          <h2 className="text-xl font-bold mb-4 bg-blue-500 text-white p-2">CATEGORIES</h2>
          {isLoadingCategories ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {Array.isArray(categories) && categories.map((category) => (
                <div 
                  key={category.id}
                  className={`p-2 cursor-pointer ${selectedCategory === category.id.toString() ? 'bg-blue-100 font-bold border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setSelectedCategory(category.id.toString());
                    setSelectedSubcategory(null);
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Subcategories Column */}
        <div className="border p-4 h-screen overflow-auto">
          <h2 className="text-xl font-bold mb-4 bg-green-500 text-white p-2">SUBCATEGORIES</h2>
          {!selectedCategory ? (
            <div className="text-center p-4 text-gray-500">
              Please select a category first
            </div>
          ) : isLoadingSubcategories ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : Array.isArray(subcategories) && subcategories.length > 0 ? (
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className={`p-2 cursor-pointer ${selectedSubcategory === subcategory.id.toString() ? 'bg-green-100 font-bold border-l-4 border-green-500' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedSubcategory(subcategory.id.toString())}
                >
                  {subcategory.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500">
              No subcategories found
            </div>
          )}
        </div>
        
        {/* Products Column */}
        <div className="border p-4 h-screen overflow-auto">
          <h2 className="text-xl font-bold mb-4 bg-red-500 text-white p-2">PRODUCTS</h2>
          {isLoadingProducts ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No products found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="border p-2"
                >
                  <h3 className="font-bold">{product.name}</h3>
                  <p>Price: ₹{product.price}</p>
                  {product.unit && <p>Unit: {product.unit}</p>}
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}