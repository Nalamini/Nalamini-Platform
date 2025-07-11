import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Eye, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FarmerProductApprovals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Check user authorization
  if (!user || user.userType !== "admin") {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p>Only administrators can access the product approval panel.</p>
        </div>
      </div>
    );
  }

  // Fetch pending grocery products (adminApproved = false)
  const { data: pendingProducts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/grocery/products/pending"],
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ productId, approved }: { productId: number; approved: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/grocery/products/${productId}/approval`, {
        adminApproved: approved,
        status: approved ? "active" : "inactive"
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: `Product ${variables.approved ? "approved" : "rejected"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product approval status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (productId: number) => {
    approvalMutation.mutate({ productId, approved: true });
  };

  const handleReject = (productId: number) => {
    approvalMutation.mutate({ productId, approved: false });
  };

  const getProviderName = (product: any) => {
    return product.providerName || `Provider ID: ${product.providerId}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Farmer Product Approvals</h1>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Farmer Product Approvals</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingProducts.length} Pending
        </Badge>
      </div>

      {pendingProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All farmer products have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProducts.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending Review
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">by {getProviderName(product)}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="font-semibold">₹{product.price} per {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span>{product.stock} {product.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">District:</span>
                    <span className="text-sm">{product.district}</span>
                  </div>
                  {product.isOrganic && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Organic
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{selectedProduct?.name}</DialogTitle>
                        <DialogDescription>
                          Product details for review
                        </DialogDescription>
                      </DialogHeader>
                      {selectedProduct && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-gray-600">{selectedProduct.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Price</h4>
                              <p>₹{selectedProduct.price} per {selectedProduct.unit}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Stock</h4>
                              <p>{selectedProduct.stock} {selectedProduct.unit}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">District</h4>
                              <p>{selectedProduct.district}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Delivery</h4>
                              <p className="capitalize">{selectedProduct.deliveryOption}</p>
                            </div>
                          </div>
                          {selectedProduct.imageUrl && (
                            <div>
                              <h4 className="font-semibold mb-2">Product Image</h4>
                              <img 
                                src={selectedProduct.imageUrl} 
                                alt={selectedProduct.name}
                                className="max-w-full h-48 object-cover rounded-md border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleApprove(product.id)}
                    disabled={approvalMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleReject(product.id)}
                    disabled={approvalMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}