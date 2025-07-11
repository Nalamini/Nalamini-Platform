import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FarmerProductListing, GroceryProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, ShoppingCart, Truck, Check, Tag, 
  AlertTriangle, X, ShoppingBasket, Pencil, Eye
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

// Type for the listing with product details
interface ListingWithProduct extends FarmerProductListing {
  product?: GroceryProduct;
}

export default function MyFarmListingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch farmer's provider products
  const { data: listings, isLoading, isError, error, refetch } = useQuery<any[]>({
    queryKey: ['/api/provider/products'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/provider/products");
      if (!response.ok) {
        throw new Error('Failed to fetch your product listings');
      }
      return await response.json();
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/provider/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product listing deleted",
        description: "Your product listing has been deleted successfully.",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter listings based on active tab
  const filteredListings = listings?.filter(listing => {
    if (activeTab === "all") return true;
    return listing.status === activeTab;
  });

  // Status badge formatter with improved null/undefined handling
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
        Unknown
      </Badge>
    );
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending Approval
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product listing?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!user || (user.userType !== 'service_provider')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only registered farmers can view their product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you are a farmer, please log in to view your product listings.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/auth')}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Product Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage your product listings and track their approval status
          </p>
        </div>
        <Button onClick={() => navigate('/farmer/add-product')}>
          <ShoppingBasket className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Listings
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400"></span>
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400"></span>
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your product listings...</span>
        </div>
      ) : isError ? (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{(error as Error).message}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      ) : filteredListings && filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.productName || "Product"}</CardTitle>
                    <CardDescription>
                      {listing.description || "No description available"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {listing.imageUrl ? (
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.productName || "Product"} 
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                    <ShoppingBasket className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">₹{listing.price}/{listing.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Quantity</p>
                    <p className="font-medium">{listing.stockQuantity || 0} {listing.unit}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1 mt-3">
                  {listing.status === 'pending' && (
                    <p className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-3 w-3" />
                      Awaiting admin approval
                    </p>
                  )}
                  <p>Category: {listing.categoryName}</p>
                  <p>Added on: {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/farmer/edit-product/${listing.id}`)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(listing.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <ShoppingBasket className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No product listings found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "You haven't added any product listings yet."
                  : `You don't have any ${activeTab} product listings.`}
              </p>
              <Button onClick={() => navigate('/farmer/add-product')}>
                Add Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}