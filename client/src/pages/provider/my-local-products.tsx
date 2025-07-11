import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useProviderAccess } from "@/hooks/use-provider-access";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Plus
} from "lucide-react";

export default function MyLocalProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const providerAccess = useProviderAccess();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch manufacturer's local products
  const { data: products, isLoading, isError, error, refetch } = useQuery<any[]>({
    queryKey: ['/api/local-products/my-products'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/local-products/my-products");
      if (!response.ok) {
        throw new Error('Failed to fetch your local products');
      }
      return await response.json();
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/local-products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Local product deleted",
        description: "Your local product has been deleted successfully.",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete local product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter products based on active tab
  const filteredProducts = products?.filter(product => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return product.status === "pending";
    if (activeTab === "approved") return product.status === "approved";
    if (activeTab === "rejected") return product.status === "rejected";
    return true;
  }) || [];

  // Get status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this local product?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!user || (user.userType !== 'service_provider') || !providerAccess.canAccessLocalProducts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only registered manufacturers can view their local products</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you are a manufacturer, please log in to view your local products.</p>
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
          <h1 className="text-3xl font-bold">My Local Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your local products and track their approval status
          </p>
        </div>
        <Button onClick={() => navigate('/provider/add-local-product')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Products
            {products && <Badge variant="secondary">{products.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending
            {products && <Badge variant="secondary">{products.filter(p => p.status === 'pending').length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved
            {products && <Badge variant="secondary">{products.filter(p => p.status === 'approved').length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rejected
            {products && <Badge variant="secondary">{products.filter(p => p.status === 'rejected').length}</Badge>}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : "Failed to load your local products"}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "all" ? "No local products yet" : `No ${activeTab} products`}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "all" 
                ? "Start selling by adding your first local product"
                : `You don't have any ${activeTab} products at the moment`
              }
            </p>
            {activeTab === "all" && (
              <Button onClick={() => navigate('/provider/add-local-product')}>
                <Package className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.name || "Product"}</CardTitle>
                    <CardDescription>
                      {product.description || "No description available"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(product.status)}
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name || "Product"} 
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">
                      ₹{product.price}
                      {product.discountedPrice && product.discountedPrice < product.price && (
                        <span className="ml-2 text-sm text-green-600">
                          (₹{product.discountedPrice} after discount)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className="font-medium">{product.stockQuantity || 0} {product.unit}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1 mt-3">
                  {product.status === 'pending' && (
                    <p className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-3 w-3" />
                      Awaiting admin approval
                    </p>
                  )}
                  <p>Category: {product.category}</p>
                  <p>District: {product.district}</p>
                  <p>Added on: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/provider/edit-local-product/${product.id}`)}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}