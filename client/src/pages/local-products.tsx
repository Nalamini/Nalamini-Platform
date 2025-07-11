import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch local product categories
  const { data: localCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/local-product-categories"],
  });

  // Fetch local products from manufacturers (public endpoint)
  const { data: products = [], isLoading } = useQuery<LocalProduct[]>({
    queryKey: ["/api/local/products"],
  });

  // Get unique categories, subcategories, and districts from actual products
  const productCategories = Array.from(new Set(products.map(p => p.category)));
  const allSubcategories = Array.from(new Set(products.map(p => p.subcategory).filter(Boolean)));
  const subcategoriesForCategory = selectedCategory === "all" 
    ? allSubcategories 
    : Array.from(new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory).filter(Boolean)));
  const districts = Array.from(new Set(products.map(p => p.district)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || product.subcategory === selectedSubcategory;
    const matchesDistrict = selectedDistrict === "all" || product.district === selectedDistrict;
    const isAvailable = product.adminApproved && product.status === "active" && product.stock > 0;
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesDistrict && isAvailable;
  });

  // Add to cart
  const addToCart = (product: LocalProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { productId: product.id, product, quantity: 1 }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Update cart quantity
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/local-product-orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your local product order has been placed successfully!",
      });
      setCart([]);
      setShowCart(false);
      queryClient.invalidateQueries({ queryKey: ["/api/local-product-orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.discountedPrice || item.product.price
      })),
      totalAmount: cartTotal,
      deliveryAddress: user.district || "",
    };

    placeOrderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Local Products</h1>
            <p className="text-gray-600 mt-1">Discover authentic products from Tamil Nadu manufacturers</p>
          </div>
          <Button 
            onClick={() => setShowCart(!showCart)}
            className="relative"
            variant={showCart ? "default" : "outline"}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cart.length})
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for local products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubcategory("all"); // Reset subcategory when category changes
          }}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {subcategoriesForCategory.map(subcategory => (
                <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Products Grid */}
        <div className={`${showCart ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {product.discountedPrice && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{product.district}</span>
                      <Badge variant="outline" className="ml-auto">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {product.deliveryOption === "both" ? "Pickup & Delivery" : 
                         product.deliveryOption === "direct" ? "Direct Pickup" : "Service Delivery"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ₹{product.discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {product.stock} in stock
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        {showCart && (
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          <p className="text-gray-600 text-xs">
                            ₹{(item.product.discountedPrice || item.product.price).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-semibold text-lg mb-4">
                        <span>Total:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={handlePlaceOrder}
                        className="w-full"
                        disabled={placeOrderMutation.isPending}
                      >
                        {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}