import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Package, Search, Filter, Leaf, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerGroceryBrowse() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Fetch grocery categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/grocery/categories"],
  });

  // Fetch grocery subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["/api/grocery/subcategories"],
  });

  // Fetch grocery products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/grocery/products"],
  });

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Filter only approved and active products
  const approvedProducts = Array.isArray(products) ? products.filter((product: any) => 
    product.adminApproved === true && product.status === "active"
  ) : [];

  // Filter products based on category, subcategory, and search
  const filteredProducts = approvedProducts.filter((product: any) => {
    const matchesCategory = selectedCategory === "all" || product.categoryId === parseInt(selectedCategory);
    const matchesSubcategory = selectedSubcategory === "all" || product.subcategoryId === parseInt(selectedSubcategory);
    const matchesSearch = searchQuery === "" || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "name":
        return a.name?.localeCompare(b.name) || 0;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Get subcategories for selected category
  const filteredSubcategories = selectedCategory === "all" 
    ? subcategories 
    : subcategories.filter((sub: any) => sub.parentCategoryId === parseInt(selectedCategory));

  const isLoading = categoriesLoading || subcategoriesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading grocery products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Grocery Marketplace</h1>
        <p className="text-gray-600 text-lg">Discover fresh, quality products from local farmers and trusted providers</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubcategory("all"); // Reset subcategory when category changes
          }}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subcategory Filter */}
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {filteredSubcategories.map((subcategory: any) => (
                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price">Price Low-High</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Categories Overview */}
      {categories.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id.toString());
                  setSelectedSubcategory("all");
                }}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedCategory === category.id.toString()
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {approvedProducts.filter((p: any) => p.categoryId === category.id).length} items
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {sortedProducts.length} of {approvedProducts.length} products
          {selectedCategory !== "all" && ` in ${categories.find((c: any) => c.id.toString() === selectedCategory)?.name}`}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">
            {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
            {selectedCategory !== "all" && <Badge variant="outline">Category</Badge>}
            {selectedSubcategory !== "all" && <Badge variant="outline">Subcategory</Badge>}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? `No products match "${searchQuery}"`
                : "No approved products available with the selected filters."
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedSubcategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>
              
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
                  {product.isOrganic && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                      <Leaf className="h-3 w-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                </div>
                
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price and Stock */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.price}
                      </span>
                      {product.discountedPrice && product.discountedPrice < product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.discountedPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      per {product.unit || 'unit'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    {product.district && (
                      <span className="text-muted-foreground">{product.district}</span>
                    )}
                  </div>
                </div>

                {/* Provider Info */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Sold by Provider #{product.providerId}
                </div>

                {/* Delivery Options */}
                {product.deliveryOption && (
                  <div className="flex items-center gap-1 text-xs">
                    <Badge variant="outline" className="text-xs">
                      {product.deliveryOption === 'both' ? 'Pickup & Delivery' : 
                       product.deliveryOption === 'direct' ? 'Direct Pickup' : 
                       'Service Delivery'}
                    </Badge>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}