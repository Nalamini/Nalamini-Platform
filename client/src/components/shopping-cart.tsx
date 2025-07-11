import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart as CartIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  unit?: string;
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('groceryCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch product details for cart items
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/grocery/products/cart-items', cartItems.map(item => item.id).join(',')],
    enabled: cartItems.length > 0,
    queryFn: async () => {
      if (cartItems.length === 0) return [];
      // Use mock data for now
      return Promise.resolve(getMockProducts(cartItems.map(item => item.id)));
    }
  });

  // Mock function to get product details by IDs
  function getMockProducts(ids: number[]): Product[] {
    const mockProducts: Record<number, Product> = {
      1: { id: 1, name: 'Mango', price: 120, unit: 'kg', imageUrl: '/uploads/fallback/mango.svg' },
      2: { id: 2, name: 'Banana', price: 60, unit: 'dozen', imageUrl: '/uploads/fallback/banana.svg' },
      3: { id: 3, name: 'Strawberry', price: 250, unit: 'box', imageUrl: '/uploads/fallback/strawberry.svg' },
      4: { id: 4, name: 'Orange', price: 80, unit: 'kg', imageUrl: '/uploads/fallback/orange.svg' },
      5: { id: 5, name: 'Spinach', price: 30, unit: 'bunch', imageUrl: '/uploads/fallback/spinach.svg' },
      6: { id: 6, name: 'Carrot', price: 40, unit: 'kg', imageUrl: '/uploads/fallback/carrot.svg' },
      7: { id: 7, name: 'Bitter Gourd', price: 60, unit: 'kg', imageUrl: '/uploads/fallback/bitter-gourd.svg' },
      8: { id: 8, name: 'Full Cream Milk', price: 68, unit: 'liter', imageUrl: '/uploads/fallback/milk.svg' },
      9: { id: 9, name: 'Paneer', price: 300, unit: 'kg', imageUrl: '/uploads/fallback/paneer.svg' },
      10: { id: 10, name: 'Greek Yogurt', price: 120, unit: '500g', imageUrl: '/uploads/fallback/yogurt.svg' },
      11: { id: 11, name: 'Extra Virgin Olive Oil', price: 750, unit: 'liter', imageUrl: '/uploads/fallback/olive-oil.svg' },
      12: { id: 12, name: 'Cold Pressed Coconut Oil', price: 280, unit: 'liter', imageUrl: '/uploads/fallback/coconut-oil.svg' },
      13: { id: 13, name: 'Cold Pressed Groundnut Oil', price: 220, unit: 'liter', imageUrl: '/uploads/fallback/groundnut-oil.svg' },
      14: { id: 14, name: 'Ponni Rice', price: 80, unit: 'kg', imageUrl: '/uploads/fallback/rice.svg' },
      15: { id: 15, name: 'Whole Wheat Flour', price: 60, unit: 'kg', imageUrl: '/uploads/fallback/wheat-flour.svg' },
      16: { id: 16, name: 'Ragi', price: 90, unit: 'kg', imageUrl: '/uploads/fallback/ragi.svg' },
      17: { id: 17, name: 'Cardamom', price: 1200, unit: 'kg', imageUrl: '/uploads/fallback/cardamom.svg' },
      18: { id: 18, name: 'Turmeric Powder', price: 280, unit: '500g', imageUrl: '/uploads/fallback/turmeric.svg' },
      19: { id: 19, name: 'Curry Leaves', price: 20, unit: 'bunch', imageUrl: '/uploads/fallback/curry-leaves.svg' },
    };
    
    return ids.map(id => mockProducts[id] || { 
      id, 
      name: `Product ${id}`, 
      price: 100,
      unit: 'item',
      imageUrl: '/uploads/fallback/default.svg'
    });
  }

  // Calculate total quantity and price
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // Update quantity helper functions
  const incrementQuantity = (productId: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decrementQuantity = (productId: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "Your shopping cart has been cleared",
    });
  };

  const checkout = () => {
    toast({
      title: "Checkout initiated",
      description: "Proceeding to checkout...",
    });
    // In a real app, this would redirect to a checkout page
    console.log("Checkout with items:", cartItems);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-full">
          <CartIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          <Badge variant="secondary" className="ml-1">
            {totalQuantity}
          </Badge>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="text-xl flex items-center">
            <CartIcon className="mr-2 h-5 w-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <CartIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add some products to your cart to see them here.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pt-4">
              <div className="space-y-4">
                {cartItems.map(item => {
                  const product = products.find(p => p.id === item.id);
                  if (!product) return null;
                  
                  return (
                    <Card key={item.id} className="p-3 flex items-center">
                      <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/uploads/fallback/default.svg";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <CartIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>₹{product.price}</span>
                          {product.unit && (
                            <span className="ml-1">/ {product.unit}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => decrementQuantity(item.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => incrementQuantity(item.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2 text-gray-500 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          
          {cartItems.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium">₹50.00</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span>₹{(totalPrice + 50).toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center gap-1"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
                
                <Button 
                  className="flex-1"
                  onClick={checkout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}