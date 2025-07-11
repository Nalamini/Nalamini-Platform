import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Search, Filter, ShoppingCart, ArrowRight, Store, AlertCircle, 
  Loader2, Check, X, ListFilter, Heart, Leaf, Plus, Minus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OilSubcategories from "@/components/oil-subcategories";
import OilCategorySection from "@/components/oil-category-section";
import SimpleSubcategories from "@/components/simple-subcategories";
import DirectSubcategoryList from "@/components/direct-subcategory-list";
import { isOilsCategory } from "@/lib/oil-category-helper";
import { fetchSubcategoriesForCategory, fetchOilSubcategories } from "@/lib/category-helper";

import {
  Card, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetTrigger,
} from "@/components/ui/sheet";

// Banner images for carousel
const bannerImages = [
  {
    src: "https://placehold.co/800x300/e4f2ff/0f59aa?text=Fresh+Groceries",
    alt: "Fresh groceries banner"
  },
  {
    src: "https://placehold.co/800x300/fcf4e6/ce7316?text=Organic+Products",
    alt: "Organic products banner"
  },
  {
    src: "https://placehold.co/800x300/f0f9e8/367c2b?text=Local+Produce",
    alt: "Local produce banner"
  },
];

// Dummy product data
const allProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: 1, // Vegetables
    price: 40,
    originalPrice: 50,
    organic: true,
    district: "Chennai",
  },
  {
    id: 2,
    name: "Bananas",
    category: 2, // Fruits
    price: 60,
    originalPrice: 60,
    organic: false,
    district: "Coimbatore",
  },
  {
    id: 3,
    name: "Organic Spinach",
    category: 1, // Vegetables
    price: 35,
    originalPrice: 45,
    organic: true,
    district: "Madurai",
  },
  {
    id: 4,
    name: "Coconut Oil",
    category: 4, // Oils
    subcategory: 5, // Coconut oil
    price: 150,
    originalPrice: 180,
    organic: false,
    district: "Thanjavur",
  },
  {
    id: 5,
    name: "Groundnut Oil",
    category: 4, // Oils
    subcategory: 6, // Groundnut oil
    price: 120,
    originalPrice: 135,
    organic: false,
    district: "Tiruchirappalli",
  },
  {
    id: 6,
    name: "Olive Oil",
    category: 4, // Oils
    subcategory: 7, // Olive oil
    price: 350,
    originalPrice: 350,
    organic: true,
    district: "Chennai",
  },
  {
    id: 7,
    name: "White Rice",
    category: 3, // Grains
    price: 65,
    originalPrice: 70,
    organic: false,
    district: "Coimbatore",
  },
  {
    id: 8,
    name: "Brown Rice",
    category: 3, // Grains
    price: 75,
    originalPrice: 85,
    organic: true,
    district: "Madurai",
  },
];

// Helper function to get subcategory display properties
const getSubcategoryDisplay = (subcategory: any) => {
  if (!subcategory) return { icon: "📦", color: "bg-gray-200" };
  
  // Handle oils category specifically
  if (subcategory.parentCategoryId === 4) {
    const name = subcategory.name.toLowerCase();
    if (name.includes('coconut')) {
      return { icon: null, color: "bg-amber-100", imageUrl: subcategory.imageUrl || "/uploads/fallback/coconut-oil.svg" };
    } else if (name.includes('groundnut') || name.includes('peanut')) {
      return { icon: null, color: "bg-yellow-100", imageUrl: subcategory.imageUrl || "/uploads/fallback/groundnut-oil.svg" };
    } else if (name.includes('olive')) {
      return { icon: null, color: "bg-green-100", imageUrl: subcategory.imageUrl || "/uploads/fallback/olive-oil.svg" };
    } else if (name.includes('palm')) {
      return { icon: null, color: "bg-orange-100", imageUrl: subcategory.imageUrl || "/uploads/fallback/palm-oil.svg" };
    }
  }
  
  return { icon: "📦", color: "bg-gray-200" };
};

export default function GroceryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [showOrganic, setShowOrganic] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  
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
    
    // Set up banner rotation
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Effect for saving cart to localStorage
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Store all subcategories in a local state object by category ID
  const [allSubcategoriesMap, setAllSubcategoriesMap] = useState<Record<string, any[]>>({});
  
  // Function to load subcategories for a specific category ID
  const loadSubcategoriesForCategory = (categoryId: string | number) => {
    console.log(`🔄 Loading subcategories for category ${categoryId}...`);
    
    // Use our helper function from category-helper.ts
    return fetchSubcategoriesForCategory(categoryId)
      .then(data => {
        console.log(`✅ Loaded ${data.length} subcategories for category ${categoryId}`);
        
        // Update our local state map with the new subcategories
        setAllSubcategoriesMap(prev => ({
          ...prev,
          [categoryId]: data
        }));
        
        return data;
      })
      .catch(error => {
        console.error(`❌ Failed to load subcategories for category ${categoryId}:`, error);
        return null;
      });
  };
  
  // Load all subcategories on page load to ensure they're always available
  useEffect(() => {
    console.log("📊 Loading all subcategories on page load");
    
    // Common categories we need to prefetch
    const importantCategoryIds = [1, 2, 3, 4]; // Fruits, Vegetables, Grains, Oils
    
    // Wait for the component to finish mounting
    setTimeout(() => {
      // Fetch all important categories
      Promise.all(
        importantCategoryIds.map(categoryId => loadSubcategoriesForCategory(categoryId))
      ).then(results => {
        console.log(`📊 Preloaded subcategories for ${importantCategoryIds.length} categories`);
        
        // Make window variable available for debugging
        if (typeof window !== 'undefined') {
          (window as any).refreshSubcategories = (categoryId: number) => {
            loadSubcategoriesForCategory(categoryId);
            return `Refreshed subcategories for category ${categoryId}`;
          };
        }
      });
    }, 500); // Small delay to ensure page is ready
  }, []);

  // Special effect for oil subcategories when oils category is selected
  useEffect(() => {
    if (isOilsCategory(activeCategory)) {
      console.log("🛢️ Oils category selected - fetching subcategories directly");
      fetchOilSubcategories()
        .then(data => {
          console.log(`✅ Successfully loaded ${data.length} oil subcategories`);
          // Ensure the category is selected
          if (activeCategory !== "4") {
            setActiveCategory("4");
          }
        })
        .catch(error => {
          console.error("❌ Error loading oil subcategories:", error);
        });
    }
  }, [activeCategory]);
  
  // Categories query
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["/api/grocery/categories"],
    enabled: true,
  });
  
  // Subcategories query based on active category
  const {
    data: subcategories = [],
    isLoading: isLoadingSubcategories,
  } = useQuery({
    queryKey: ["/api/grocery/subcategories", activeCategory],
    enabled: activeCategory !== "all" && activeCategory !== "organic",
  });
  
  // Reset filter values
  const resetFilters = () => {
    setActiveCategory("all");
    setActiveSubcategory(null);
    setSearchTerm("");
    setSortOrder("featured");
    setShowOrganic(false);
    setSelectedDistricts([]);
  };
  
  // Refresh grocery data - fetches latest categories and subcategories
  const refreshGroceryData = () => {
    console.log("🔄 Refreshing grocery categories and subcategories");
    
    // Invalidate all categories and general subcategories
    queryClient.invalidateQueries({ queryKey: ["/api/grocery/categories"] });
    queryClient.invalidateQueries({ queryKey: ["/api/grocery/subcategories"] });
    
    // Invalidate all specific subcategory queries for every category
    if (categories && Array.isArray(categories)) {
      // Force refresh for all categories
      categories.forEach((category: any) => {
        if (category && category.id) {
          // Clear cache for both string and number versions of the ID
          queryClient.invalidateQueries({ queryKey: ["/api/grocery/subcategories", category.id.toString()] });
          queryClient.invalidateQueries({ queryKey: ["/api/grocery/subcategories", category.id] });
          
          // Force a direct fetch for the active category
          if (activeCategory === category.id.toString()) {
            // Use our helper function for direct fetch
            fetchSubcategoriesForCategory(category.id)
              .then(data => {
                console.log(`✅ Manual refresh: Fetched ${data.length} subcategories for category ${category.id}`);
              })
              .catch(err => console.error("Error manually refreshing subcategories:", err));
          }
        }
      });
    }
    
    // Additional direct fetch for oils category to ensure it's always refreshed
    if (isOilsCategory(activeCategory)) {
      fetchOilSubcategories()
        .then(data => {
          console.log(`✅ Refresh: Loaded ${data.length} oil subcategories`);
        })
        .catch(error => {
          console.error("❌ Error refreshing oil subcategories:", error);
        });
    }
    
    // Also refresh products if needed
    queryClient.invalidateQueries({ queryKey: ["/api/grocery/products"] });
    
    toast({
      title: "Data refreshed",
      description: "Latest categories, subcategories, and products have been loaded",
    });
  };
  
  // Toggle district selection
  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(selectedDistricts.filter(d => d !== district));
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };
  
  // Get all available districts from products
  const availableDistricts = Array.from(new Set(allProducts.map(p => p.district)));
  
  // Process products based on filters
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (activeCategory !== "all" && activeCategory !== "organic") {
      const productCategory = typeof product.category === 'object' 
        ? product.category?.id?.toString()
        : product.category?.toString();
        
      if (productCategory !== activeCategory) {
        return false;
      }
    }
    
    // Subcategory filter
    if (activeSubcategory) {
      // Handle product subcategory field and name-based filtering
      if (product.subcategory) {
        if (product.subcategory.toString() !== activeSubcategory) {
          return false;
        }
      } else if (product.name !== activeSubcategory) {
        return false;
      }
    }
    
    // Organic filter
    if (showOrganic && !product.organic) {
      return false;
    }
    
    // District filter
    if (selectedDistricts.length > 0 && !selectedDistricts.includes(product.district)) {
      return false;
    }
    
    // Search term filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low-high") {
      return a.price - b.price;
    } else if (sortOrder === "price-high-low") {
      return b.price - a.price;
    } else if (sortOrder === "discount") {
      const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
      const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
      return discountB - discountA;
    }
    // Default: featured - no specific order, could use popularity metrics in a real app
    return 0;
  });
  
  // Cart management
  const getItemQuantity = (id: number) => {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  };
  
  const addToCart = (id: number) => {
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { id, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: "Item added to your shopping cart.",
    });
  };
  
  const decreaseQuantity = (id: number) => {
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
      if (existingItem.quantity === 1) {
        setCartItems(cartItems.filter(item => item.id !== id));
      } else {
        setCartItems(cartItems.map(item => 
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        ));
      }
    }
  };
  
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Loading state
  const isLoading = isLoadingCategories;
  
  // Error state
  const isError = false; // Would be based on query error states in a real app
  
  return (
    <div className="container mx-auto px-4 py-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Grocery Store</h1>
            <p className="text-gray-500 mt-1">Shop for fresh produce and local goods</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="relative"
              onClick={() => navigate("/grocery/cart")}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getTotalCartItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {getTotalCartItems()}
                </Badge>
              )}
            </Button>
            
            {/* Refresh button for data refresh */}
            <Button
              variant="outline"
              className="text-primary hover:text-primary/80"
              onClick={refreshGroceryData}
              title="Refresh to see latest updates to categories, subcategories, and products"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 mr-1"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              Refresh Data
            </Button>
            
            {/* Testing Tools */}
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                window.open("/subcategory-test", "_blank");
              }}
              title="Open subcategory testing page"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 mr-1"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Test Subcategories
            </Button>
            
            {/* Force Reload button for complete page refresh */}
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
              title="Force a complete page reload to refresh everything"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 mr-1"
              >
                <path d="M2 12A10 10 0 1 0 12 2v10Z"></path>
              </svg>
              Hard Refresh
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="sm:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>
                  {/* Mobile filters content would go here */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search for products..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Banners Carousel */}
        <div className="relative rounded-lg overflow-hidden h-[200px]">
          {bannerImages.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                <div className="text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">Fresh & Healthy</h2>
                  <p className="mb-4">Shop from our wide range of products</p>
                  <Button 
                    variant="default" 
                    className="bg-white text-gray-800 hover:bg-gray-100"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentBanner ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory("all")}
          >
            All Products
          </Button>
          
          <Button
            variant={activeCategory === "organic" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              setActiveCategory("organic");
              setShowOrganic(true);
            }}
          >
            <Leaf className="h-4 w-4 mr-2 text-green-600" />
            Organic
          </Button>
          
          {!isLoadingCategories && categories && categories.length > 0 && 
            categories.map((category: any) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id.toString() ? "default" : "outline"}
                className="rounded-full whitespace-nowrap"
                onClick={() => {
                  setActiveCategory(category.id.toString());
                  setActiveSubcategory(null);
                }}
              >
                {category.name}
              </Button>
            ))
          }
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2">
          <div className="sticky top-20 bg-white rounded-lg border shadow-sm p-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold flex items-center">
                  <ListFilter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <Button 
                  variant="ghost" 
                  className="h-7 text-xs px-2"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
              
              <Separator />
              
              {/* Sub-Categories section */}
              {/* Subcategories Section */}
              {activeCategory !== "all" && activeCategory !== "organic" && (
                <div className="mb-6">
                  <h4 className="font-medium text-base mb-3 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 text-primary"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Subcategories
                  </h4>
                  
                  {isOilsCategory(activeCategory) ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      <div className="text-sm text-primary font-medium mb-2">Oil Types:</div>
                      <DirectSubcategoryList
                        categoryId={activeCategory}
                        onSelect={setActiveSubcategory} 
                        activeSubcategory={activeSubcategory}
                      />
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-md p-3">
                      {/* Use our direct subcategory list component */}
                      <DirectSubcategoryList
                        categoryId={activeCategory}
                        onSelect={setActiveSubcategory}
                        activeSubcategory={activeSubcategory}
                      />
                      
                      {/* Troubleshooting tools in a collapsed accordion - always available */}
                      <details className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                        <summary className="font-medium cursor-pointer text-blue-800">Troubleshooting Tools</summary>
                        <div className="mt-2 space-y-2">
                          <p><strong>Category ID:</strong> {activeCategory}</p>
                          <p><strong>Selected Subcategory:</strong> {activeSubcategory || 'None'}</p>
                          
                          <div className="flex space-x-2 mt-2">
                            <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs"
                              onClick={() => {
                                const categoryId = activeCategory;
                                loadSubcategoriesForCategory(categoryId)
                                  .then(data => {
                                    if (data) {
                                      toast({
                                        title: "Subcategories loaded",
                                        description: `Loaded ${data.length} subcategories for category ${categoryId}`,
                                      });
                                    } else {
                                      toast({
                                        title: "Failed to load subcategories",
                                        description: "Try the hard reload option",
                                        variant: "destructive",
                                      });
                                    }
                                  });
                              }}
                            >
                              Reload Current Category
                            </button>
                            
                            <button 
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-xs"
                              onClick={() => {
                                window.location.reload();
                              }}
                            >
                              Hard Reload
                            </button>
                          </div>
                          
                          <div className="mt-3 border border-blue-200 rounded p-2">
                            <p className="text-xs font-medium text-blue-800 mb-1">Quick Load Specific Category:</p>
                            <div className="grid grid-cols-2 gap-1">
                              {[1, 2, 3, 4].map(catId => (
                                <button
                                  key={catId}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded"
                                  onClick={() => loadSubcategoriesForCategory(catId)}
                                >
                                  Load Category {catId}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                  <Separator className="mt-4" />
                </div>
              )}
              
              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-sm mb-2">Sort By</h4>
                <div className="space-y-1">
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                      sortOrder === "featured" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSortOrder("featured")}
                  >
                    Featured
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                      sortOrder === "price-low-high" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSortOrder("price-low-high")}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                      sortOrder === "price-high-low" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSortOrder("price-high-low")}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm rounded ${
                      sortOrder === "discount" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSortOrder("discount")}
                  >
                    Discount %
                  </button>
                </div>
              </div>
              
              <Separator />
              
              {/* Organic Filter */}
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="organic-filter"
                    checked={showOrganic}
                    onChange={() => setShowOrganic(!showOrganic)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="organic-filter" className="ml-2 text-sm flex items-center">
                    <Leaf className="h-3 w-3 mr-1 text-green-600" />
                    Organic Only
                  </label>
                </div>
              </div>
              
              <Separator />
              
              {/* District Filter */}
              <div>
                <h4 className="font-medium text-sm mb-2">Source Districts</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {availableDistricts.map((district) => (
                    <div key={district} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`district-${district}`}
                        checked={selectedDistricts.includes(district)}
                        onChange={() => toggleDistrict(district)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`district-${district}`} className="ml-2 text-sm">
                        {district}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-9 lg:col-span-10">
          {/* Oil Subcategories Section - shows prominently when Oils category is selected */}
          {isOilsCategory(activeCategory) && (
            <OilCategorySection 
              onSelectSubcategory={setActiveSubcategory} 
              activeSubcategory={activeSubcategory}
              isVisible={isOilsCategory(activeCategory)}
            />
          )}
          
          {/* Active Filters & Sorting Display */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {activeCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {activeCategory === "organic" ? "Organic" : 
                    categories?.find((c: any) => c.id.toString() === activeCategory)?.name || activeCategory}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setActiveCategory("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {activeSubcategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {subcategories?.find((s: any) => s.id.toString() === activeSubcategory)?.name || activeSubcategory}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setActiveSubcategory(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {showOrganic && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setShowOrganic(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedDistricts.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Districts: {selectedDistricts.length}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setSelectedDistricts([])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {(activeCategory !== "all" || activeSubcategory || showOrganic || selectedDistricts.length > 0) && (
                <Button 
                  variant="ghost" 
                  className="h-7 text-xs px-2"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {sortedProducts?.length} products
            </div>
          </div>
          
          {/* Products Display */}
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="w-full flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                <p className="text-gray-700 font-medium">Failed to load products</p>
                <p className="text-gray-500 mt-1">Please try again later</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : sortedProducts && sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                  <div className="relative bg-gray-50 pt-[100%]">
                    {/* Image would go here in a real app */}
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                      <Store className="h-12 w-12 text-primary/40" />
                    </div>
                    
                    {/* Quick view & wishlist */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full bg-white/80 border text-gray-700 hover:text-primary hover:bg-white"
                        onClick={() => navigate(`/grocery/product/${product.id}`)}
                      >
                        <Search className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full bg-white/80 border text-gray-700 hover:text-rose-500 hover:bg-white"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.organic && (
                        <Badge className="bg-green-500 hover:bg-green-600 px-2 py-1">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </Badge>
                      )}
                      
                      {product.price < product.originalPrice && (
                        <Badge className="bg-red-500 hover:bg-red-600 px-2 py-1">
                          {Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% Off
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="py-3 px-3 flex-grow flex flex-col">
                    <div className="mb-auto">
                      <div className="text-sm text-gray-500 mb-1">
                        {product.district} • {
                          typeof product.category === 'object' 
                            ? product.category?.name
                            : categories?.find((c: any) => c.id === product.category)?.name || 'Category'
                        }
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-semibold">₹{product.price}</span>
                        {product.price < product.originalPrice && (
                          <span className="text-gray-500 text-sm line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      {getItemQuantity(product.id) === 0 ? (
                        <Button
                          className="w-full"
                          onClick={() => addToCart(product.id)}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => decreaseQuantity(product.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium">
                            {getItemQuantity(product.id)}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => addToCart(product.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
              <Button onClick={resetFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}