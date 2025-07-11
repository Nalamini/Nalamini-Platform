import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { GroceryProduct } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  ShoppingCart,
  Filter,
  Leaf,
  Store,
  ArrowRight,
  Heart,
  Check,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft, 
  Clock,
  Percent,
  Home,
  Plus,
  Minus,
  Truck,
  ListFilter,
  X,
  ShoppingBag,
  Tag
} from "lucide-react";

// Icons for categories (will be assigned based on category name)
const categoryIcons: Record<string, { icon: string, color: string }> = {
  "vegetables": { icon: "🥦", color: "bg-green-100 text-green-800" },
  "fruits": { icon: "🍎", color: "bg-red-100 text-red-800" },
  "dairy": { icon: "🥛", color: "bg-blue-100 text-blue-800" },
  "grains": { icon: "🌾", color: "bg-amber-100 text-amber-800" },
  "oils": { icon: "🫙", color: "bg-yellow-100 text-yellow-800" },
  "spices": { icon: "🌶️", color: "bg-orange-100 text-orange-800" },
  "organic": { icon: "🍃", color: "bg-emerald-100 text-emerald-800" },
  "local": { icon: "🏠", color: "bg-purple-100 text-purple-800" },
  "default": { icon: "🛒", color: "bg-gray-100 text-gray-800" }
};

// Get icon and color for a category by name
const getCategoryDisplay = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();
  
  // Check for partial matches first
  for (const [key, value] of Object.entries(categoryIcons)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  
  // Default icon if no match
  return categoryIcons.default;
};

// Banners for carousel
const bannerImages = [
  {
    title: "Farm Fresh Fruits & Vegetables",
    subtitle: "Directly from farmers to your doorstep",
    cta: "Shop Now",
    bgClass: "bg-gradient-to-r from-green-500 to-emerald-700",
    iconClass: "🥕 🥦 🍎 🍇"
  },
  {
    title: "Organic Products",
    subtitle: "Pesticide-free, naturally grown products",
    cta: "Explore Organic",
    bgClass: "bg-gradient-to-r from-amber-500 to-yellow-700",
    iconClass: "🌱 🍃 🥬 🍏"
  },
  {
    title: "Special Discounts",
    subtitle: "Up to 30% off on selected items",
    cta: "View Offers",
    bgClass: "bg-gradient-to-r from-blue-500 to-indigo-700",
    iconClass: "🏷️ 💰 🔖 🎁"
  }
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Utility function to calculate discount percentage
const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number) => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default function GroceryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showOrganic, setShowOrganic] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  
  // Load cart from localStorage on component mount
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
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Query to fetch grocery products
  const { 
    data: products, 
    isLoading: isLoadingProducts,
    isError: isErrorProducts
  } = useQuery<GroceryProduct[]>({
    queryKey: ["/api/grocery/products"],
    enabled: true,
  });
  
  // Query to fetch admin-created categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories
  } = useQuery({
    queryKey: ["/api/grocery/categories"],
    enabled: true,
  });
  
  // Query to fetch farmer products that have been approved by admin
  const {
    data: farmerProducts,
    isLoading: isLoadingFarmerProducts,
    isError: isErrorFarmerProducts
  } = useQuery({
    queryKey: ["/api/farmer-products"],
    queryFn: async () => {
      const response = await fetch('/api/farmer-products?status=approved&includeProduct=true');
      if (!response.ok) {
        throw new Error('Failed to fetch approved farmer products');
      }
      return await response.json();
    },
  });
  
  // Combine admin product listing with approved farmer products
  const allProducts = useMemo(() => {
    if (!products) return [];
    
    const adminProducts = products;
    
    // Format farmer products to match the grocery product format
    const approvedFarmerProducts = (farmerProducts || [])
      .filter(fp => fp.status === 'approved')
      .map(fp => {
        const farmerId = fp.farmerId;
        const farmerName = fp.farmerName || 'Local Farmer';
        const sourceDistrict = fp.sourceDistrict || '';
        
        return {
          id: `farmer-${fp.id}`,
          name: fp.product?.name || 'Unknown Product',
          category: fp.product?.category || 'local',
          description: fp.description || '',
          price: fp.price,
          isOrganic: fp.isOrganic || false,
          // Add farmer-specific fields
          farmerId,
          farmerName,
          sourceDistrict,
          isFarmerProduct: true,
          // Original listing data
          originalListing: fp
        };
      });
    
    return [...adminProducts, ...approvedFarmerProducts];
  }, [products, farmerProducts]);
  
  // Loading and error states
  const isLoading = isLoadingProducts || isLoadingCategories || isLoadingFarmerProducts;
  const isError = isErrorProducts || isErrorCategories || isErrorFarmerProducts;
  
  // Define grocery product form schema
  const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    price: z.coerce.number().min(1, "Price must be at least ₹1"),
    discountedPrice: z.coerce.number().optional().nullable(),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    unit: z.string().min(1, "Unit is required (e.g., kg, pcs)"),
    isOrganic: z.boolean().default(false),
    district: z.string().min(1, "District is required"),
    imageUrl: z.string().optional().nullable(),
    deliveryOption: z.string().optional().nullable(),
    availableAreas: z.string().optional().nullable(),
    status: z.string().default("active"),
  });
  
  type ProductFormValues = z.infer<typeof productSchema>;
  
  // Edit product mutation
  const editProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductFormValues }) => {
      const res = await apiRequest("PATCH", `/api/grocery/products/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/grocery/products"] });
      setEditProductId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/grocery/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/grocery/products"] });
      setShowDeleteConfirm(false);
      setDeleteProductId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete all products mutation
  const deleteAllProductsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/admin/grocery/products-all`);
    },
    onSuccess: () => {
      toast({
        title: "All products deleted",
        description: "All grocery products have been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/grocery/products"] });
      setShowDeleteAllConfirm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete all products. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // State for edit/delete functionality
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Get unique districts from all products (admin + farmer products)
  const availableDistricts = useMemo(() => {
    if (!allProducts.length) return [];
    
    // Collect all district values from both regular products and farmer products
    const districts = new Set<string>();
    
    allProducts.forEach(product => {
      if (product.district) {
        districts.add(product.district);
      }
      if (product.sourceDistrict) {
        districts.add(product.sourceDistrict);
      }
    });
    
    return Array.from(districts);
  }, [allProducts]);

  // Filter products based on active filters
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    const matchesCategory = 
      activeCategory === "all" || 
      (activeCategory === "organic" && product.isOrganic) ||
      (typeof product.category === 'object' && product.category?.id?.toString() === activeCategory) ||
      (typeof product.category === 'string' && product.category.toLowerCase() === activeCategory.toLowerCase());
    
    // Subcategory/Product type filter (if applicable)
    const matchesSubcategory = !activeSubcategory || 
      product.name.toLowerCase() === activeSubcategory.toLowerCase() || 
      product.description?.toLowerCase().includes(activeSubcategory.toLowerCase());
    
    // Search filter  
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Price range filter
    const matchesPriceRange = 
      (product.discountedPrice || product.price) >= priceRange[0] && 
      (product.discountedPrice || product.price) <= priceRange[1];
    
    // Organic filter
    const matchesOrganic = !showOrganic || product.isOrganic;
    
    // District filter
    const matchesDistrict = selectedDistricts.length === 0 || 
      (product.district && selectedDistricts.includes(product.district)) ||
      (product.sourceDistrict && selectedDistricts.includes(product.sourceDistrict));
    
    return matchesCategory && matchesSubcategory && matchesSearch && 
           matchesPriceRange && matchesOrganic && matchesDistrict;
  });

  // Sort products based on selection
  const sortedProducts = filteredProducts ? [...filteredProducts].sort((a, b) => {
    const priceA = a.discountedPrice || a.price;
    const priceB = b.discountedPrice || b.price;
    
    switch(sortOrder) {
      case "price-low-high":
        return priceA - priceB;
      case "price-high-low":
        return priceB - priceA;
      case "discount":
        const discountA = a.discountedPrice ? (a.price - a.discountedPrice) / a.price : 0;
        const discountB = b.discountedPrice ? (b.price - b.discountedPrice) / b.price : 0;
        return discountB - discountA;
      default: // featured
        return 0; // Maintain original order
    }
  }) : [];

  // Calculate cart total
  const getCartTotal = () => {
    if (!products) return 0;
    
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) return total;
      
      const price = product.discountedPrice || product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Add to cart function
  const addToCart = (productId: number) => {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
    
    toast({
      title: "Product added to cart",
      description: "Item has been added to your shopping cart.",
    });
  };

  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    
    toast({
      title: "Product removed from cart",
      description: "Item has been removed from your shopping cart.",
    });
  };

  // Update cart quantity
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  // Get quantity of item in cart
  const getCartItemQuantity = (productId: number) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Checkout function
  const checkout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Proceeding to checkout",
      description: "You'll be redirected to the payment page.",
    });
    
    // In a real app, redirect to checkout page
    // navigate('/checkout');
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory("all");
    setActiveSubcategory(null);
    setSearchTerm("");
    setPriceRange([0, 5000]);
    setShowOrganic(false);
    setSelectedDistricts([]);
    setSortOrder("featured");
    setShowFilters(false);
  };

  // Toggle district selection
  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(selectedDistricts.filter(d => d !== district));
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center text-sm text-gray-500">
            <Home className="h-3 w-3 mr-1" />
            <span>Home</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="font-medium text-primary">Grocery</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Top Header with Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Grocery Store</h1>
            <p className="text-sm text-gray-500 mt-1">Fresh produce from farms to your doorstep</p>
            
            {/* Admin actions */}
            {user && user.userType === "admin" && (
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={() => setAddProductOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Product
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50" 
                  onClick={() => setShowDeleteAllConfirm(true)}
                >
                  <X className="h-3 w-3 mr-1" /> Delete All Products
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:w-1/3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products..."
                className="pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-white" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Button variant="outline" size="icon" onClick={() => navigate('/grocery/cart')}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Banners Carousel */}
        <div className="mb-8 relative rounded-lg overflow-hidden">
          {bannerImages.map((banner, index) => (
            <div 
              key={index} 
              className={`rounded-lg transition-opacity duration-500 ${
                index === currentBanner ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            >
              <div className={`${banner.bgClass} p-6 md:p-10 rounded-lg`}>
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-2">{banner.title}</h2>
                    <p className="text-white/80 text-sm md:text-base mb-4">{banner.subtitle}</p>
                    <Button className="bg-white text-primary hover:bg-white/90">
                      {banner.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-4xl md:text-6xl">{banner.iconClass}</div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 text-white hover:bg-white/50 hover:text-primary"
            onClick={() => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 text-white hover:bg-white/50 hover:text-primary"
            onClick={() => setCurrentBanner((prev) => (prev + 1) % bannerImages.length)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentBanner ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </div>

        {/* Quick Access Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {/* All Products Category */}
            <button
              key="all"
              className={`group flex flex-col items-center p-4 rounded-lg border transition-all ${
                activeCategory === "all" 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
              onClick={() => {
                setActiveCategory("all");
                setActiveSubcategory(null);
              }}
            >
              <div className={`text-3xl mb-2 ${activeCategory === "all" ? "scale-110" : ""} transition-transform`}>
                🛒
              </div>
              <span className={`text-xs font-medium ${
                activeCategory === "all" ? "text-primary" : "text-gray-700"
              }`}>
                All Products
              </span>
            </button>
            
            {/* Organic Products Category */}
            <button
              key="organic"
              className={`group flex flex-col items-center p-4 rounded-lg border transition-all ${
                activeCategory === "organic" 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
              onClick={() => {
                setActiveCategory("organic");
                setActiveSubcategory(null);
              }}
            >
              <div className={`text-3xl mb-2 ${activeCategory === "organic" ? "scale-110" : ""} transition-transform`}>
                🍃
              </div>
              <span className={`text-xs font-medium ${
                activeCategory === "organic" ? "text-primary" : "text-gray-700"
              }`}>
                Organic
              </span>
            </button>
            
            {/* Admin-created Categories */}
            {categories?.map((category) => {
              const categoryDisplay = getCategoryDisplay(category.name);
              return (
                <button
                  key={category.id}
                  className={`group flex flex-col items-center p-4 rounded-lg border transition-all ${
                    activeCategory === category.id.toString() 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id.toString());
                    setActiveSubcategory(null);
                  }}
                >
                  <div className={`text-3xl mb-2 ${category.id.toString() === activeCategory ? "scale-110" : ""} transition-transform`}>
                    {categoryDisplay.icon}
                  </div>
                  <span className={`text-xs font-medium ${
                    activeCategory === category.id.toString() ? "text-primary" : "text-gray-700"
                  }`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Layout with Filters and Products */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filters Sidebar - Mobile Drawer */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowFilters(false)}>
              <div 
                className="absolute right-0 top-0 bottom-0 w-4/5 max-w-xs bg-white p-4 overflow-y-auto z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Mobile Filters */}
                <div className="space-y-6">
                  {/* Same filter content as desktop - dynamic product types */}
                  {activeCategory !== "all" && activeCategory !== "organic" && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Product Types</h4>
                      <div className="space-y-1">
                        {Array.from(new Set(
                          allProducts
                            .filter(p => 
                              activeCategory === p.category || 
                              (typeof p.category === 'object' && p.category?.id?.toString() === activeCategory)
                            )
                            .map(p => p.name)
                        )).map((productName) => (
                          <button
                            key={productName}
                            className={`block w-full text-left px-2 py-1 text-sm rounded ${
                              activeSubcategory === productName ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveSubcategory(activeSubcategory === productName ? null : productName)}
                          >
                            {productName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Organic Only</h4>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="organic-mobile"
                        checked={showOrganic}
                        onChange={() => setShowOrganic(!showOrganic)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="organic-mobile" className="ml-2 text-sm">
                        Show organic products only
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Source Districts</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {availableDistricts.map((district) => (
                        <div key={district} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`district-${district}-mobile`}
                            checked={selectedDistricts.includes(district)}
                            onChange={() => toggleDistrict(district)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`district-${district}-mobile`} className="ml-2 text-sm">
                            {district}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
          
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
                
                {/* Sub-Categories based on products for the selected category */}
                {activeCategory !== "all" && activeCategory !== "organic" && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Product Types</h4>
                    <div className="space-y-1">
                      {/* Get unique product names for the selected category */}
                      {Array.from(new Set(
                        allProducts
                          .filter(p => 
                            activeCategory === p.category || 
                            (typeof p.category === 'object' && p.category?.id?.toString() === activeCategory)
                          )
                          .map(p => p.name)
                      )).map((productName) => (
                        <button
                          key={productName}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            activeSubcategory === productName ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                          }`}
                          onClick={() => setActiveSubcategory(activeSubcategory === productName ? null : productName)}
                        >
                          {productName}
                        </button>
                      ))}
                    </div>
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
            {/* Active Filters & Sorting Display */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {activeCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {activeCategory}
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
                    {activeSubcategory}
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
                        
                        {/* Admin actions - edit & delete */}
                        {user && user.userType === "admin" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full bg-white/80 border text-gray-700 hover:text-blue-500 hover:bg-white"
                              onClick={() => setEditProductId(product.id)}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                <path d="m15 5 4 4"/>
                              </svg>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full bg-white/80 border text-gray-700 hover:text-red-500 hover:bg-white"
                              onClick={() => {
                                setDeleteProductId(product.id);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" x2="10" y1="11" y2="17"/>
                                <line x1="14" x2="14" y1="11" y2="17"/>
                              </svg>
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {/* Organic badge */}
                      {product.isOrganic && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            <Leaf className="h-3 w-3 mr-1" />
                            Organic
                          </Badge>
                        </div>
                      )}
                      
                      {/* Discount badge */}
                      {product.discountedPrice && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-red-500 hover:bg-red-600">
                            <Percent className="h-3 w-3 mr-1" />
                            {calculateDiscountPercentage(product.price, product.discountedPrice)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="py-3 px-3 flex-grow flex flex-col">
                      <div className="mb-auto">
                        <div className="text-xs text-gray-500 mb-1">
                          {product.category}
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <div className="text-xs text-gray-500 mb-2 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.district}
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center">
                            <span>{product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            {product.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-end mb-2">
                          <div className="text-primary font-bold">
                            {formatCurrency(product.discountedPrice || product.price)}
                          </div>
                          {product.discountedPrice && (
                            <div className="text-xs text-gray-500 line-through ml-2">
                              {formatCurrency(product.price)}
                            </div>
                          )}
                        </div>

                        {getCartItemQuantity(product.id) > 0 ? (
                          <div className="flex items-center justify-between">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(product.id, getCartItemQuantity(product.id) - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium">
                              {getCartItemQuantity(product.id)}
                            </span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(product.id, getCartItemQuantity(product.id) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="secondary" 
                            className="w-full h-8 text-xs"
                            onClick={() => addToCart(product.id)}
                            disabled={product.stock <= 0}
                          >
                            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center h-64 bg-white rounded-lg border">
                <div className="flex flex-col items-center p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-500 max-w-md mb-4">
                    {searchTerm
                      ? `We couldn't find any products matching "${searchTerm}"`
                      : "No products match your current filters."}
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-500">
                  Same-day delivery available for orders placed before 2 PM
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Farm Fresh</h3>
                <p className="text-sm text-gray-500">
                  Products sourced directly from local farmers
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Best Prices</h3>
                <p className="text-sm text-gray-500">
                  Competitive pricing with regular discounts and offers
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mini Cart (Fixed Bottom on Mobile) */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)} items
                </div>
                <div className="text-primary font-bold">
                  {formatCurrency(getCartTotal())}
                </div>
              </div>
              <Button onClick={checkout} className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Edit Product Dialog */}
      {editProductId && products && (
        <Dialog open={editProductId !== null} onOpenChange={() => setEditProductId(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product details below.
              </DialogDescription>
            </DialogHeader>
            
            {(() => {
              const product = products.find((p) => p.id === editProductId);
              if (!product) return null;
              
              const form = useForm<ProductFormValues>({
                resolver: zodResolver(productSchema),
                defaultValues: {
                  name: product.name,
                  description: product.description,
                  category: product.category,
                  subcategory: product.subcategory || undefined,
                  price: product.price,
                  discountedPrice: product.discountedPrice || undefined,
                  stock: product.stock,
                  unit: product.unit,
                  isOrganic: product.isOrganic,
                  district: product.district,
                  imageUrl: product.imageUrl || undefined,
                  deliveryOption: product.deliveryOption || undefined,
                  availableAreas: product.availableAreas || undefined,
                  status: product.status || "active",
                },
              });
              
              const onSubmit = (data: ProductFormValues) => {
                editProductMutation.mutate({ id: editProductId, data });
              };
              
              return (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.keys(subCategories).map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {form.watch("category") && 
                                    subCategories[form.watch("category") as keyof typeof subCategories]?.map((sub) => (
                                      <SelectItem key={sub} value={sub}>
                                        {sub}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter district" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discountedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price (₹) (Optional)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="kg, pcs, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deliveryOption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Option (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Standard, Express, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isOrganic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Organic Product</FormLabel>
                              <FormDescription>
                                Mark this product as organically grown
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description"
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availableAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Areas (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter areas where this product is available"
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditProductId(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={editProductMutation.isPending}
                      >
                        {editProductMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteProductId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteProductId && deleteProductMutation.mutate(deleteProductId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Products Confirmation Dialog */}
      <AlertDialog open={showDeleteAllConfirm} onOpenChange={setShowDeleteAllConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Products?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all grocery products from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteAllProductsMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAllProductsMutation.isPending}
            >
              {deleteAllProductsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting All...
                </>
              ) : (
                "Delete All"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}