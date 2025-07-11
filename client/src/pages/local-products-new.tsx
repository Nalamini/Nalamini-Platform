import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, Package, MapPin, Truck, Star, Filter, Grid, List, Heart, ShoppingBag, Plus, Minus } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface LocalProduct {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  district: string;
  imageUrl?: string;
  deliveryOption: string;
  availableAreas?: string;
  manufacturerId?: number;
  specifications: Record<string, any>;
  status: string;
  adminApproved: boolean;
}

export default function LocalProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch local products using the working API
  const { data: products = [], isLoading: productsLoading } = useQuery<LocalProduct[]>({
    queryKey: ["/api/local/products"],
    enabled: true,
  });

  // Fetch categories 
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/local-product-categories"],
    enabled: true,
  });

  // Create category mapping from ID to name
  const categoryMap = categories.reduce((acc: Record<string, any>, cat: any) => {
    acc[cat.id.toString()] = cat;
    return acc;
  }, {});

  // Extract unique values for filters - map category IDs to names
  const availableCategories = Array.from(new Set(
    products.map(p => {
      const categoryData = categoryMap[p.category];
      return categoryData ? categoryData.name : p.category;
    }).filter(Boolean)
  ));
  const availableDistricts = Array.from(new Set(products.map(p => p.district).filter(Boolean)));

  const isLoading = productsLoading || categoriesLoading;

  // Debug logging
  console.log('Products data:', products);
  console.log('Categories data:', categories);
  console.log('Category map:', categoryMap);
  console.log('Available categories:', availableCategories);

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Get the category name for this product
    const productCategoryData = categoryMap[product.category];
    const productCategoryName = productCategoryData ? productCategoryData.name : product.category;
    
    const matchesCategory = selectedCategory === "all" || productCategoryName === selectedCategory;
    const matchesDistrict = selectedDistrict === "all" || product.district === selectedDistrict;
    
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  // Category mapping with icons (similar to grocery)
  const getCategoryDisplay = (categoryName: string) => {
    const categoryMap: Record<string, { icon: string; color: string }> = {
      "Textiles": { icon: "🧵", color: "bg-blue-100 text-blue-800" },
      "Handicrafts": { icon: "🎨", color: "bg-purple-100 text-purple-800" },
      "Food Products": { icon: "🍯", color: "bg-orange-100 text-orange-800" },
      "Spices": { icon: "🌶️", color: "bg-red-100 text-red-800" },
      "1": { icon: "🧵", color: "bg-blue-100 text-blue-800" }, // Fallback for ID
      "4": { icon: "🌶️", color: "bg-red-100 text-red-800" }, // Fallback for ID
    };
    
    return categoryMap[categoryName] || { icon: "📦", color: "bg-gray-100 text-gray-800" };
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDistrict("all");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Local Products</h1>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden col-span-12">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">District</label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24 bg-white rounded-lg border shadow-sm p-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">Categories</h4>
                  <div className="space-y-2">
                    <div
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                        selectedCategory === "all" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedCategory("all")}
                    >
                      <span className="text-sm">All Categories</span>
                    </div>
                    {availableCategories.map((category) => {
                      const display = getCategoryDisplay(category);
                      return (
                        <div
                          key={category}
                          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                            selectedCategory === category ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <span className="mr-2">{display.icon}</span>
                          <span className="text-sm">{category}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">Districts</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <div
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                        selectedDistrict === "all" ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDistrict("all")}
                    >
                      <span className="text-sm">All Districts</span>
                    </div>
                    {availableDistricts.map((district) => (
                      <div
                        key={district}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                          selectedDistrict === district ? "bg-primary/10 text-primary" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDistrict(district)}
                      >
                        <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="text-sm">{district}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => {
                  // Get the actual category data for this product
                  const productCategoryData = categoryMap[product.category];
                  const productCategoryName = productCategoryData ? productCategoryData.name : product.category;
                  const categoryDisplay = getCategoryDisplay(productCategoryName);
                  const finalPrice = product.discountedPrice || product.price;
                  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;

                  if (viewMode === "list") {
                    return (
                      <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={categoryDisplay.color}>
                                    {categoryDisplay.icon} {productCategoryName}
                                  </Badge>
                                  <Badge variant="outline">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {product.district}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  {hasDiscount && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{product.price}
                                    </span>
                                  )}
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{finalPrice}
                                  </span>
                                </div>
                                
                                <Button size="sm">
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  }

                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={categoryDisplay.color} variant="secondary">
                              {categoryDisplay.icon} {productCategoryName}
                            </Badge>
                          </div>
                          
                          <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {product.district}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              {hasDiscount && (
                                <span className="text-sm text-gray-500 line-through block">
                                  ₹{product.price}
                                </span>
                              )}
                              <span className="text-lg font-bold text-gray-900">
                                ₹{finalPrice}
                              </span>
                            </div>
                            
                            <Button size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}