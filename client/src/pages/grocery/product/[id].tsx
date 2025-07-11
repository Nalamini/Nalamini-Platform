import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useRoute } from "wouter";
import { GroceryProduct } from "@/types";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  ShoppingCart,
  ChevronRight,
  Leaf,
  Store,
  Truck,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Heart,
  Share2,
  Plus,
  Minus,
  Package,
  Percent
} from "lucide-react";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Calculate discount percentage
const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number) => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default function ProductDetailPage() {
  const [, params] = useRoute("/grocery/product/:id");
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('groceryCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // If product is already in cart, set initial quantity to match
        if (params?.id) {
          const productId = parseInt(params.id);
          const cartItem = parsedCart.find((item: any) => item.id === productId);
          if (cartItem) {
            setQuantity(cartItem.quantity);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, [params]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Get product ID from URL
  const productId = params?.id ? parseInt(params.id) : null;
  
  // Query to fetch product details
  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery<GroceryProduct>({
    queryKey: ["/api/grocery/product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await fetch(`/api/grocery/product/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return response.json();
    },
    enabled: !!productId,
  });
  
  // Query to fetch related products
  const { data: relatedProducts } = useQuery<GroceryProduct[]>({
    queryKey: ["/api/grocery/products"],
    enabled: !!product,
    select: (data) => 
      data
        .filter(p => 
          p.id !== productId && 
          (p.category === product?.category || p.district === product?.district)
        )
        .slice(0, 4)
  });
  
  // Add to cart function
  const addToCart = () => {
    if (!product) return;
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity = quantity;
      setCartItems(updatedCart);
    } else {
      // Add new item
      setCartItems([...cartItems, { id: product.id, quantity }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
    });
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-medium text-gray-900">Loading product details...</h2>
        </div>
      </div>
    );
  }
  
  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find the product you're looking for. It may have been removed or is temporarily unavailable.
          </p>
          <Button onClick={() => navigate("/grocery")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Grocery Store
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center text-sm text-gray-500">
            <Home className="h-3 w-3 mr-1" />
            <span>Home</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate("/grocery")}>Grocery</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="cursor-pointer hover:text-primary" onClick={() => navigate("/grocery")}>
              {product.category}
            </span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="font-medium text-primary line-clamp-1 max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 text-gray-600"
          onClick={() => navigate("/grocery")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Grocery Store
        </Button>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              {/* Image placeholder */}
              <div className="w-full h-full flex items-center justify-center">
                <Store className="h-24 w-24 text-gray-300" />
              </div>
              
              {/* Organic badge */}
              {product.isOrganic && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                </div>
              )}
              
              {/* Discount badge */}
              {product.discountedPrice && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 hover:bg-red-600">
                    <Percent className="h-3 w-3 mr-1" />
                    {calculateDiscountPercentage(product.price, product.discountedPrice)}% OFF
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Sourced from {product.district}</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(product.discountedPrice || product.price)}
                </span>
                {product.discountedPrice && (
                  <span className="text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {product.discountedPrice && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Save {formatCurrency(product.price - product.discountedPrice)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Price per {product.unit}
              </p>
            </div>
            
            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className={`text-sm ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"} font-medium flex items-center`}>
                  {product.stock > 10 
                    ? <><ShieldCheck className="h-4 w-4 mr-1" /> In Stock</> 
                    : product.stock > 0 
                      ? <><AlertCircle className="h-4 w-4 mr-1" /> Only {product.stock} left</> 
                      : <><AlertCircle className="h-4 w-4 mr-1" /> Out of Stock</>}
                </span>
              </div>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <p className="font-medium text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-md rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-10 w-16 flex items-center justify-center border-y border-gray-200">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-r-md rounded-l-none"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="flex gap-4 mb-8">
                <Button 
                  className="flex-1 md:flex-none md:w-1/2"
                  onClick={addToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="secondary"
                  className="flex-1 md:flex-none md:w-1/3"
                  onClick={() => {
                    addToCart();
                    navigate("/grocery/cart");
                  }}
                >
                  Buy Now
                </Button>
              </div>
            )}
            
            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Free delivery</p>
                    <p className="text-xs text-gray-500">On orders above ₹400</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Same day delivery</p>
                    <p className="text-xs text-gray-500">Order before 2 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Secure packaging</p>
                    <p className="text-xs text-gray-500">Safe and hygienic packing of all products</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Product Description</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                
                <h3 className="font-medium mb-2">Product Information</h3>
                <ul className="text-sm space-y-2">
                  <li className="grid grid-cols-2">
                    <span className="text-gray-500">Category:</span>
                    <span>{product.category}</span>
                  </li>
                  <li className="grid grid-cols-2">
                    <span className="text-gray-500">Weight/Volume:</span>
                    <span>1 {product.unit}</span>
                  </li>
                  <li className="grid grid-cols-2">
                    <span className="text-gray-500">Organic:</span>
                    <span>{product.isOrganic ? "Yes" : "No"}</span>
                  </li>
                  <li className="grid grid-cols-2">
                    <span className="text-gray-500">Source:</span>
                    <span>{product.district}, Tamil Nadu</span>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="nutrition" className="bg-white p-4 rounded-lg border">
                <div className="text-center py-8">
                  <div className="mb-4 text-gray-400">
                    <Package className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="font-medium text-gray-700 mb-2">Nutrition Information</h3>
                  <p className="text-sm text-gray-500">
                    Nutritional information for this product will be available soon.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="bg-white p-4 rounded-lg border">
                <div className="text-center py-8">
                  <div className="mb-4 text-gray-400">
                    <Star className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="font-medium text-gray-700 mb-2">No Reviews Yet</h3>
                  <p className="text-sm text-gray-500">
                    Be the first to review this product.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Card 
                  key={related.id} 
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/grocery/product/${related.id}`)}
                >
                  <div className="relative h-40 bg-gray-50">
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="h-10 w-10 text-gray-300" />
                    </div>
                    
                    {/* Organic badge */}
                    {related.isOrganic && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <Leaf className="h-2.5 w-2.5 mr-1" />
                          Organic
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{related.name}</h3>
                    <div className="text-xs text-gray-500 mb-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {related.district}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-primary font-medium text-sm">
                          {formatCurrency(related.discountedPrice || related.price)}
                        </div>
                        {related.discountedPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatCurrency(related.price)}
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newCartItems = [...cartItems];
                          const existingItem = newCartItems.find(item => item.id === related.id);
                          
                          if (existingItem) {
                            existingItem.quantity += 1;
                          } else {
                            newCartItems.push({ id: related.id, quantity: 1 });
                          }
                          
                          setCartItems(newCartItems);
                          toast({
                            title: "Added to cart",
                            description: "Item has been added to your cart."
                          });
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}