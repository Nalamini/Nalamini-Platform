import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, Package, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    discountedPrice?: number;
    stock: number;
    district: string;
    imageUrl?: string;
    manufacturerId?: number;
  };
}

interface CheckoutForm {
  shippingAddress: string;
  district: string;
  taluk: string;
  pincode: string;
  paymentMethod: "cash" | "wallet" | "online";
  notes: string;
}

export default function LocalProductsCart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    shippingAddress: "",
    district: "",
    taluk: "",
    pincode: "",
    paymentMethod: "cash",
    notes: ""
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading, refetch } = useQuery<CartItem[]>({
    queryKey: ["/api/local-products/cart"],
    enabled: !!user
  });

  // Update cart item quantity
  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/local-products/cart/${productId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item.",
        variant: "destructive"
      });
    }
  });

  // Remove from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("DELETE", `/api/local-products/cart/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive"
      });
    }
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/local-products/cart");
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive"
      });
    }
  });

  // Create order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutForm) => {
      const response = await apiRequest("POST", "/api/local-products/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      setShowCheckout(false);
      setCheckoutForm({
        shippingAddress: "",
        district: "",
        taluk: "",
        pincode: "",
        paymentMethod: "cash",
        notes: ""
      });
      toast({
        title: "Order placed successfully",
        description: "Your order has been submitted and will be processed soon."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCartMutation.mutate(productId);
    } else {
      updateCartMutation.mutate({ productId, quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!checkoutForm.shippingAddress || !checkoutForm.district || !checkoutForm.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    createOrderMutation.mutate(checkoutForm);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary" className="ml-auto">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => window.history.back()}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Cart Items</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => clearCartMutation.mutate()}
                disabled={clearCartMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {cartItems.map((item) => {
              const price = item.product.discountedPrice || item.product.price;
              const originalPrice = item.product.price;
              const hasDiscount = item.product.discountedPrice && item.product.discountedPrice < originalPrice;
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                        <p className="text-sm text-muted-foreground">District: {item.product.district}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-lg">₹{price}</span>
                          {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCartMutation.mutate(item.productId)}
                          disabled={removeFromCartMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={updateCartMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={updateCartMutation.isPending || item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">₹{(price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.product.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
                
                {deliveryFee === 0 && subtotal >= 500 && (
                  <p className="text-sm text-green-600">
                    🎉 You saved ₹50 on delivery!
                  </p>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Checkout</DialogTitle>
                      <DialogDescription>
                        Please provide your delivery details to complete the order.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Shipping Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your complete address"
                          value={checkoutForm.shippingAddress}
                          onChange={(e) => setCheckoutForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="district">District *</Label>
                          <Input
                            id="district"
                            placeholder="District"
                            value={checkoutForm.district}
                            onChange={(e) => setCheckoutForm(prev => ({ ...prev, district: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="taluk">Taluk</Label>
                          <Input
                            id="taluk"
                            placeholder="Taluk"
                            value={checkoutForm.taluk}
                            onChange={(e) => setCheckoutForm(prev => ({ ...prev, taluk: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          placeholder="Pincode"
                          value={checkoutForm.pincode}
                          onChange={(e) => setCheckoutForm(prev => ({ ...prev, pincode: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="payment">Payment Method</Label>
                        <Select 
                          value={checkoutForm.paymentMethod} 
                          onValueChange={(value: "cash" | "wallet" | "online") => 
                            setCheckoutForm(prev => ({ ...prev, paymentMethod: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash on Delivery</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                            <SelectItem value="online">Online Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special instructions (optional)"
                          value={checkoutForm.notes}
                          onChange={(e) => setCheckoutForm(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-muted/50">
                        <h4 className="font-semibold mb-2">Order Total: ₹{total.toFixed(2)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cartItems.length} items • {deliveryFee === 0 ? 'Free delivery' : `₹${deliveryFee} delivery`}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handlePlaceOrder}
                        className="w-full"
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}