import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Loader2, 
  AlertCircle, 
  Search, 
  X,
  ChevronRight,
  Filter,
  Tag,
  Leaf,
  MapPin,
  ShoppingBag,
  Check
} from "lucide-react";

// Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Category {
  id: number;
  name: string;
  isActive: boolean;
  displayOrder?: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Subcategory {
  id: number;
  name: string;
  description?: string;
  parentCategoryId: number;
  isActive: boolean;
  displayOrder?: number;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId?: number;
  subcategoryId?: number;
  price: number;
  discountedPrice?: number;
  stock?: number;
  unit?: string;
  isOrganic?: boolean;
  district?: string;
  imageUrl?: string;
  deliveryOption?: string;
  availableAreas?: string;
  status?: string;
  categoryName?: string;
  subcategoryName?: string;
  farmerId?: number;
  discount?: number;
}

export default function GroceryBrowsePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  
  // Effect for loading cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('groceryCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);
  
  // Effect for saving cart to localStorage
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Categories query
  const {
    data: categories = [] as Category[],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ["/api/grocery/categories"],
    enabled: true,
  });

  // Subcategories query - only enabled when a category is selected
  const {
    data: subcategories = [] as Subcategory[],
    isLoading: isLoadingSubcategories,
    isError: isSubcategoriesError,
  } = useQuery<Subcategory[]>({
    queryKey: ["/api/grocery/subcategories-public", selectedCategory],
    enabled: !!selectedCategory,
  });

  // Products query - enabled when either category or subcategory is selected
  const {
    data: products = [] as Product[],
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["/api/grocery/products", selectedCategory, selectedSubcategory],
    enabled: !!selectedCategory || !!selectedSubcategory,
  });

  // Filtered products based on search and selection
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    // Filter by search term
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
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

  // Add to cart function
  const addToCart = (productId: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: productId, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: "Item has been added to your shopping cart",
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchTerm("");
  };

  // Get category and subcategory names for display
  const categoryName = selectedCategory 
    ? categories.find(c => c.id.toString() === selectedCategory)?.name 
    : null;
  
  const subcategoryName = selectedSubcategory 
    ? subcategories.find(s => s.id.toString() === selectedSubcategory)?.name 
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search and cart */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Grocery Shopping</h1>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 pr-10 py-2 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                <Badge variant="secondary" className="ml-1">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with 3-column layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Browse Products</h2>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm">
            <button 
              className={`hover:underline ${!selectedCategory ? 'font-semibold text-primary' : 'text-gray-600'}`}
              onClick={clearSelections}
            >
              All Categories
            </button>
            
            {categoryName && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                <button 
                  className={`hover:underline ${!selectedSubcategory ? 'font-semibold text-primary' : 'text-gray-600'}`}
                  onClick={() => setSelectedSubcategory(null)}
                >
                  {categoryName}
                </button>
              </>
            )}
            
            {subcategoryName && (
              <>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                <span className="font-semibold text-primary">{subcategoryName}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">1</span>
                  Categories
                </h3>
              </div>
              
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                {isLoadingCategories ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : isCategoriesError ? (
                  <div className="text-center p-4 text-sm text-red-500">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                    <p>Failed to load categories</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id.toString()
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id.toString());
                          setSelectedSubcategory(null);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="flex-1">{category.name}</span>
                          {selectedCategory === category.id.toString() && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Subcategories Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center">
                  <span className="bg-green-100 text-green-800 p-1 rounded mr-2">2</span>
                  Subcategories
                </h3>
              </div>
              
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                {!selectedCategory ? (
                  <div className="text-center p-6 text-gray-500">
                    <p className="text-sm">Please select a category first</p>
                  </div>
                ) : isLoadingSubcategories ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : isSubcategoriesError ? (
                  <div className="text-center p-4 text-sm text-red-500">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                    <p>Failed to load subcategories</p>
                  </div>
                ) : subcategories.length > 0 ? (
                  <div className="space-y-1">
                    {subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedSubcategory === subcategory.id.toString()
                            ? 'bg-green-100 text-green-800'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedSubcategory(subcategory.id.toString())}
                      >
                        <div className="flex items-center">
                          <span className="flex-1">{subcategory.name}</span>
                          {selectedSubcategory === subcategory.id.toString() && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <p className="text-sm">No subcategories found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Products Column */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-amber-100 text-amber-800 p-1 rounded mr-2">3</span>
                    Products
                  </div>
                  <Badge variant="outline">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </Badge>
                </h3>
              </div>
              
              <div className="p-4">
                {isLoadingProducts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : isProductsError ? (
                  <div className="text-center py-8 text-red-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Failed to load products</p>
                  </div>
                ) : !selectedCategory ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Please select a category to view products</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No products found</p>
                    <p className="text-sm text-gray-400 mt-1">Try selecting a different category or subcategory</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                        <div className="flex items-start">
                          <div className="w-24 h-24 bg-gray-100 relative flex-shrink-0">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/uploads/fallback/default.svg";
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ShoppingBag className="h-8 w-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          
                          <div className="p-3 flex-1">
                            <div className="flex flex-col h-full">
                              <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                              
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {product.unit && (
                                  <Badge variant="secondary" className="text-xs">
                                    {product.unit}
                                  </Badge>
                                )}
                                
                                {product.isOrganic && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                    <Leaf className="h-3 w-3 mr-1" />
                                    Organic
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="mt-auto pt-2 flex justify-between items-center">
                                <div className="text-sm font-semibold">
                                  ₹{product.discountedPrice || product.price}
                                </div>
                                
                                <Button 
                                  size="sm"
                                  className="h-8 px-3"
                                  onClick={() => addToCart(product.id)}
                                >
                                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}