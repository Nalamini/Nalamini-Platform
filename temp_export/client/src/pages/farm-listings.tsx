import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FarmerProductListing, GroceryProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Truck, Check, Tag } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Type for the listing with product details
interface ListingWithProduct extends FarmerProductListing {
  product?: GroceryProduct;
}

export default function FarmListingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  
  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('groceryCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groceryCart', JSON.stringify(cart));
  }, [cart]);

  // Fetch approved farmer product listings with their product details
  const { data: listings, isLoading, error } = useQuery<ListingWithProduct[]>({
    queryKey: ['/api/farmer-products'],
    queryFn: async () => {
      const response = await fetch('/api/farmer-products?status=approved&includeProduct=true');
      if (!response.ok) {
        throw new Error('Failed to fetch farmer product listings');
      }
      return response.json();
    }
  });

  const addToCart = (listing: ListingWithProduct) => {
    if (!listing.product) {
      toast({
        title: "Error",
        description: "Product information is missing",
        variant: "destructive"
      });
      return;
    }
    
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === listing.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, {
        id: listing.id,
        farmerId: listing.farmerId,
        productId: listing.groceryProductId,
        productName: listing.product.name,
        price: listing.price,
        unit: listing.unit,
        quantity: 1,
        imageUrl: listing.imageUrl || listing.product.imageUrl,
        farmerName: "Farmer", // This would ideally be fetched from farmer details
        transportAgentRequired: listing.transportAgentRequired
      }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${listing.product.name} has been added to your cart.`,
      variant: "default"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-red-800 font-semibold">Error Loading Listings</h2>
          <p className="text-red-600">{(error as Error).message}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Farm Fresh Products</h1>
          <p className="text-gray-600">
            Direct from local farmers to your doorstep
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/grocery/cart'}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({cart.length})</span>
          </Button>
        </div>
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                {listing.imageUrl || (listing.product && listing.product.imageUrl) ? (
                  <img 
                    src={listing.imageUrl || (listing.product && listing.product.imageUrl)} 
                    alt={listing.product?.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-400">No Image</p>
                  </div>
                )}
                {listing.isOrganic && (
                  <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800">
                    Organic
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle>{listing.product?.name}</CardTitle>
                <CardDescription>
                  {listing.product?.description || "Fresh farm product"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold">₹{listing.price} / {listing.unit}</p>
                  <Badge variant="outline" className="text-xs">
                    Qty: {listing.quantity} {listing.unit}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {listing.selfDelivery && (
                    <Badge variant="outline" className="flex items-center gap-1 text-green-700">
                      <Check className="h-3 w-3" /> 
                      Self Delivery
                    </Badge>
                  )}
                  {listing.transportAgentRequired && (
                    <Badge variant="outline" className="flex items-center gap-1 text-blue-700">
                      <Truck className="h-3 w-3" /> 
                      Transport Available
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(listing)}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-12 max-w-xl mx-auto">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-6">
              There are currently no farm products available. Please check back later.
            </p>
            {user?.userType === 'provider' && (
              <Button 
                variant="default" 
                onClick={() => window.location.href = '/farmer/add-product'}
              >
                Add Your Product
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}