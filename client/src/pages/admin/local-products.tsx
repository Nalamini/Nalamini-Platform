import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, XCircle, Clock, Package, Trash2 } from "lucide-react";

interface LocalProduct {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  discountedPrice?: number;
  district: string;
  imageUrl?: string;
  deliveryOption: string;
  availableAreas?: string;
  status: string;
  isDraft: boolean;
  adminApproved: boolean;
  manufacturerId?: number;
  createdAt: string;
  updatedAt: string;
  specifications?: any;
  stock: number;
}

export default function LocalProductsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch pending products
  const { data: pendingProducts = [], isLoading: pendingLoading } = useQuery<LocalProduct[]>({
    queryKey: ["/api/admin/pending-local-products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/pending-local-products");
      return res.json();
    }
  });

  // Fetch all products for the "all" tab
  const { data: allProducts = [], isLoading: allLoading } = useQuery<LocalProduct[]>({
    queryKey: ["/api/local-product-views", "all"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/local-product-views?adminApproved=true&adminApproved=false");
      return res.json();
    }
  });

  // Approve product mutation
  const approveMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", `/api/admin/local-products/${productId}/approve`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Approved",
        description: "The product has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-local-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/local-product-views"] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve product",
        variant: "destructive",
      });
    },
  });

  // Reject product mutation
  const rejectMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", `/api/admin/local-products/${productId}/reject`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Rejected",
        description: "The product has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-local-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/local-product-views"] });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/local-products/${productId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-local-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/local-product-views"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (productId: number) => {
    approveMutation.mutate(productId);
  };

  const handleReject = (productId: number) => {
    rejectMutation.mutate(productId);
  };

  const handleDelete = (productId: number) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteMutation.mutate(productId);
    }
  };

  const ProductCard = ({ product }: { product: LocalProduct }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>
              {product.category} {product.subcategory && `• ${product.subcategory}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {product.adminApproved ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            <Badge variant="outline">
              {product.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <div className="space-y-1">
              <p className="text-sm"><strong>Price:</strong> ₹{product.price}</p>
              {product.discountedPrice && (
                <p className="text-sm"><strong>Discounted Price:</strong> ₹{product.discountedPrice}</p>
              )}
              <p className="text-sm"><strong>Stock:</strong> {product.stock}</p>
              <p className="text-sm"><strong>District:</strong> {product.district}</p>
              <p className="text-sm"><strong>Delivery:</strong> {product.deliveryOption}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Created: {new Date(product.createdAt).toLocaleDateString()}
            </p>
            {product.availableAreas && (
              <p className="text-sm"><strong>Available Areas:</strong> {product.availableAreas}</p>
            )}
            <div className="flex gap-2 mt-4">
              {!product.adminApproved && (
                <>
                  <Button
                    onClick={() => handleApprove(product.id)}
                    disabled={approveMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(product.id)}
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Button
                onClick={() => handleDelete(product.id)}
                disabled={deleteMutation.isPending}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Local Products Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending Approval ({pendingProducts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Products ({allProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Products Pending Approval</CardTitle>
              <CardDescription>
                Review and approve products submitted by service providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading pending products...</p>
                </div>
              ) : pendingProducts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No products pending approval</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>
                View all products in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading products...</p>
                </div>
              ) : allProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}