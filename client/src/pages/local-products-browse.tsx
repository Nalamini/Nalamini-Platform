import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Package, Star, Filter, Search, ShoppingCart, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LocalProductCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface LocalProductSubCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface LocalProduct {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  manufacturerId?: number;
  adminApproved?: boolean;
  description?: string;
  specifications?: Record<string, any>;
  price?: number;
  discountedPrice?: number;
  stock?: number;
  district?: string;
  imageUrl?: string;
  deliveryOption?: string;
  availableAreas?: string;
  status?: string;
}

export default function LocalProductsBrowse() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});

  const { toast } = useToast();

  // Fetch local product categories - EXACT SAME PATTERN AS RENTAL
  const { data: categories = [] } = useQuery<LocalProductCategory[]>({
    queryKey: ["/api/local-product-categories"],
  });

  // Fetch local product subcategories - EXACT SAME PATTERN AS RENTAL
  const { data: subcategories = [] } = useQuery<LocalProductSubCategory[]>({
    queryKey: ["/api/local-product-subcategories"],
  });

  // Fetch all local products - EXACT SAME PATTERN AS RENTAL
  const { data: allProducts = [], isLoading } = useQuery<LocalProduct[]>({
    queryKey: ["/api/local-product-views"],
    onSuccess: (data) => {
      console.log("Products received:", data);
      data.forEach(product => {
        console.log(`Product: ${product.name}, category: ${product.category}, subcategory: ${product.subcategory}`);
      });
    }
  });

  // Filter subcategories based on selected category
  const filteredSubcategories = selectedCategory === "all" 
    ? subcategories 
    : subcategories.filter(sub => sub.parentCategoryId.toString() === selectedCategory);

  // Filter products based on selected filters - EXACT SAME PATTERN AS RENTAL
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === categories.find(c => c.id.toString() === selectedCategory)?.name;
    const matchesSubcategory = selectedSubcategory === "all" || 
      product.subcategory === subcategories.find(s => s.id.toString() === selectedSubcategory)?.name;
    
    // Debug logging
    if (selectedSubcategory !== "all") {
      const expectedSubcategoryName = subcategories.find(s => s.id.toString() === selectedSubcategory)?.name;
      console.log(`Filtering: product.subcategory="${product.subcategory}", selectedSubcategory="${selectedSubcategory}", expectedName="${expectedSubcategoryName}", matches=${matchesSubcategory}`);
    }
    const matchesSearch = searchTerm === "" || product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === "all" || product.district === selectedDistrict;
    const matchesDelivery = deliveryFilter === "all" || product.deliveryOption === deliveryFilter;
    
    let matchesPrice = true;
    if (priceRange !== "all" && product.price) {
      const price = product.discountedPrice || product.price;
      switch (priceRange) {
        case "0-100":
          matchesPrice = price <= 100;
          break;
        case "100-500":
          matchesPrice = price > 100 && price <= 500;
          break;
        case "500-1000":
          matchesPrice = price > 500 && price <= 1000;
          break;
        case "1000+":
          matchesPrice = price > 1000;
          break;
      }
    }
    
    return matchesCategory && matchesSubcategory && matchesSearch && matchesDistrict && matchesDelivery && matchesPrice;
  });

  // Get unique districts for filter
  const districts = Array.from(new Set(allProducts.map(p => p.district).filter(Boolean)));

  // Add to cart function
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await apiRequest("POST", "/api/local-product-cart", {
        productId,
        quantity
      });
      
      setCartItems(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + quantity
      }));
      
      queryClient.invalidateQueries({ queryKey: ["/api/local-product-cart"] });
      
      toast({
        title: "Added to Cart",
        description: "Product added to your cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      try {
        await apiRequest("DELETE", `/api/local-product-cart/${productId}`);
        const updatedItems = { ...cartItems };
        delete updatedItems[productId];
        setCartItems(updatedItems);
        queryClient.invalidateQueries({ queryKey: ["/api/local-product-cart"] });
        toast({
          title: "Removed from Cart",
          description: "Product removed from your cart",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove product from cart",
          variant: "destructive",
        });
      }
    } else {
      try {
        await apiRequest("PUT", `/api/local-product-cart/${productId}`, {
          quantity: newQuantity
        });
        setCartItems(prev => ({
          ...prev,
          [productId]: newQuantity
        }));
        queryClient.invalidateQueries({ queryKey: ["/api/local-product-cart"] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update cart quantity",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Local Products</h1>
            <p className="text-gray-600">Browse authentic local products from verified providers</p>
          </div>
        </div>

        {/* Filters - EXACT SAME PATTERN AS RENTAL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedSubcategory("all"); // Reset subcategory when category changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategory</label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {filteredSubcategories.map(subcategory => (
                      <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">₹0 - ₹100</SelectItem>
                    <SelectItem value="100-500">₹100 - ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="1000+">₹1,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery</label>
                <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Options</SelectItem>
                    <SelectItem value="direct">Direct Only</SelectItem>
                    <SelectItem value="service">Service Only</SelectItem>
                    <SelectItem value="both">Both Options</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Products Grid - EXACT SAME PATTERN AS RENTAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {product.stock && product.stock > 0 ? (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    In Stock ({product.stock})
                  </Badge>
                ) : (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{product.district}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.discountedPrice && product.price && product.discountedPrice < product.price ? (
                        <>
                          <span className="text-lg font-bold text-green-600">
                            ₹{product.discountedPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price || 0}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      View Details
                    </Button>
                    
                    {cartItems[product.id] ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{cartItems[product.id]}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                          disabled={!product.stock || cartItems[product.id] >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        disabled={!product.stock || product.stock <= 0}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Product Detail Dialog - EXACT SAME PATTERN AS RENTAL */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                Product details and specifications
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedProduct.imageUrl && (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Price</h4>
                  <div className="flex items-center gap-2">
                    {selectedProduct.discountedPrice && selectedProduct.price && selectedProduct.discountedPrice < selectedProduct.price ? (
                      <>
                        <span className="text-xl font-bold text-green-600">
                          ₹{selectedProduct.discountedPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{selectedProduct.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-gray-900">
                        ₹{selectedProduct.price || 0}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Stock</h4>
                  <p className="text-gray-600">{selectedProduct.stock || 0} units available</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{selectedProduct.district}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery</h4>
                  <p className="text-gray-600 capitalize">{selectedProduct.deliveryOption || 'Contact seller'}</p>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
              )}
              
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-sm text-gray-600 capitalize">{key}:</span>
                        <span className="text-sm text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
                {cartItems[selectedProduct.id] ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => updateCartQuantity(selectedProduct.id, cartItems[selectedProduct.id] - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{cartItems[selectedProduct.id]}</span>
                    <Button
                      variant="outline"
                      onClick={() => updateCartQuantity(selectedProduct.id, cartItems[selectedProduct.id] + 1)}
                      disabled={!selectedProduct.stock || cartItems[selectedProduct.id] >= selectedProduct.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(selectedProduct.id)}
                    disabled={!selectedProduct.stock || selectedProduct.stock <= 0}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}