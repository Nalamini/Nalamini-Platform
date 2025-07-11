import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter, ShoppingCart, MapPin, Package, Star } from "lucide-react";
import { GroceryProduct, GroceryCategory, GrocerySubCategory } from "@shared/schema";

export default function GroceryBrowse() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [showOrganic, setShowOrganic] = useState<boolean | undefined>(undefined);

  // Fetch categories (public endpoint)
  const { data: categories, isLoading: categoriesLoading } = useQuery<GroceryCategory[]>({
    queryKey: ["/api/grocery/categories"],
  });

  // Fetch subcategories (public endpoint)
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery<GrocerySubCategory[]>({
    queryKey: ["/api/grocery/subcategories"],
  });

  // Fetch products - only admin-approved and active ones
  const { data: products, isLoading: productsLoading } = useQuery<GroceryProduct[]>({
    queryKey: ["/api/grocery/products", { adminApproved: true, status: "active" }],
  });

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search term filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory && product.categoryId !== parseInt(selectedCategory)) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory && product.subcategoryId !== parseInt(selectedSubcategory)) {
        return false;
      }

      // District filter
      if (selectedDistrict && product.district !== selectedDistrict) {
        return false;
      }

      // Organic filter
      if (showOrganic !== undefined && product.isOrganic !== showOrganic) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedDistrict, showOrganic]);

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory || !subcategories) return [];
    return subcategories.filter(sub => sub.parentCategoryId === parseInt(selectedCategory));
  }, [selectedCategory, subcategories]);

  // Get unique districts from products
  const availableDistricts = useMemo(() => {
    if (!products) return [];
    const districts = [...new Set(products.map(p => p.district))].sort();
    return districts;
  }, [products]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedCategory]);

  if (categoriesLoading || subcategoriesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Grocery Products</h1>
        <p className="text-muted-foreground">
          Browse fresh, local grocery products from verified providers
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories?.filter(cat => cat.isActive).map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategory</label>
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subcategories</SelectItem>
                  {availableSubcategories.filter(sub => sub.isActive).map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All districts</SelectItem>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showOrganic === true ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOrganic(showOrganic === true ? undefined : true)}
            >
              <Star className="w-4 h-4 mr-1" />
              Organic Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedSubcategory("");
                setSelectedDistrict("");
                setShowOrganic(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Products ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters or search terms to find products.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {product.isOrganic && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      <Star className="w-3 h-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.price}/{product.unit}
                      </span>
                      {product.discountedPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.discountedPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.district}
                    </div>
                    
                    <div className="text-sm">
                      Stock: {product.stock} {product.unit}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}