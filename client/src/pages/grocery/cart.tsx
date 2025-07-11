import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { GroceryProduct } from "@/types";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  Store,
  Leaf,
  MapPin,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Home,
  ChevronRight,
  ArrowRight,
  Tag,
  X
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

export default function CartPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<{id: number, quantity: number}[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  
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
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Query to fetch grocery products
  const { 
    data: products,
    isLoading,
    isError
  } = useQuery<GroceryProduct[]>({
    queryKey: ["/api/grocery/products"],
    enabled: true,
  });
  
  // Get cart products with details
  const cartProducts = cartItems.map(item => {
    const product = products?.find(p => p.id === item.id);
    return {
      ...item,
      product,
    };
  }).filter(item => item.product !== undefined);
  
  // Calculate subtotal
  const subtotal = cartProducts.reduce((total, item) => {
    const price = item.product!.discountedPrice || item.product!.price;
    return total + (price * item.quantity);
  }, 0);
  
  // Calculate delivery fee (free over ₹400)
  const deliveryFee = subtotal > 400 ? 0 : 40;
  
  // Apply promotion code
  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'WELCOME10') {
        const discountAmount = subtotal * 0.1; // 10% discount
        setDiscount(discountAmount);
        toast({
          title: "Promotion applied!",
          description: "10% discount has been applied to your order.",
        });
      } else if (promoCode.toUpperCase() === 'FREESHIP') {
        setDiscount(deliveryFee);
        toast({
          title: "Promotion applied!",
          description: "Free shipping has been applied to your order.",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "The promotion code you entered is invalid or expired.",
          variant: "destructive",
        });
      }
      setIsApplyingPromo(false);
    }, 1000);
  };
  
  // Remove promotion
  const removePromotion = () => {
    setPromoCode('');
    setDiscount(0);
    toast({
      title: "Promotion removed",
      description: "The promotion code has been removed from your order.",
    });
  };
  
  // Calculate total
  const total = subtotal + deliveryFee - discount;

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products?.find(p => p.id === productId);
    
    if (product) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      if (newQuantity > product.stock) {
        toast({
          title: "Limited stock",
          description: `Only ${product.stock} units available.`,
          variant: "destructive",
        });
        newQuantity = product.stock;
      }
      
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };
  
  // Proceed to checkout
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
      title: "Checkout initiated",
      description: "This is a demo. In a real app, you would proceed to payment.",
    });
    
    // Clear cart after successful checkout
    // setCartItems([]);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-medium text-gray-900">Loading your cart...</h2>
        </div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
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
              <span className="font-medium text-primary">Shopping Cart</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items to your cart yet.
              Browse our products and find something you'd like!
            </p>
            <Button size="lg" onClick={() => navigate("/grocery")}>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
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
            <span className="font-medium text-primary">Shopping Cart</span>
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
          Continue Shopping
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="border-b p-4">
                <CardTitle className="text-lg">Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartProducts.map(({ id, quantity, product }) => (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                                <Store className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <div className="font-medium line-clamp-1">{product!.name}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {product!.district}
                                </div>
                                {product!.isOrganic && (
                                  <div className="text-xs flex items-center text-green-600 mt-1">
                                    <Leaf className="h-3 w-3 mr-1" />
                                    Organic
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product!.discountedPrice || product!.price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(id, quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="w-10 text-center">{quantity}</div>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateQuantity(id, quantity + 1)}
                                disabled={quantity >= product!.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency((product!.discountedPrice || product!.price) * quantity)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => removeFromCart(id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 flex justify-between">
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => setCartItems([])}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => navigate("/grocery")}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add More Items
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader className="border-b p-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        Discount
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 ml-1 p-0" 
                          onClick={removePromotion}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Including all taxes
                  </p>
                </div>
                
                {/* Promotion Code */}
                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Apply Promotion Code</p>
                  <div className="flex mb-1">
                    <Input 
                      className="rounded-r-none"
                      placeholder="Enter promotion code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isApplyingPromo || discount > 0}
                    />
                    <Button 
                      className="rounded-l-none"
                      onClick={applyPromoCode}
                      disabled={!promoCode || isApplyingPromo || discount > 0}
                    >
                      {isApplyingPromo ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    Try "WELCOME10" for 10% off or "FREESHIP" for free delivery
                  </div>
                </div>
                
                {/* Checkout Button */}
                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={checkout}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
            
            {/* Delivery Notice */}
            <Card className="mt-4 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-3">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Eco-Friendly Packaging</h3>
                    <p className="text-xs text-green-700 mt-1">
                      All our deliveries are made with eco-friendly packaging materials, minimizing environmental impact.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}