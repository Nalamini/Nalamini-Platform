import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Edit, Trash2, Eye } from "lucide-react";

export default function MyGroceryProducts() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Check user authorization
  if (!user || user.userType !== "service_provider") {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p>Only service providers can view their grocery products.</p>
        </div>
      </div>
    );
  }

  // Fetch provider's grocery products
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/provider/grocery/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/provider/grocery/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/grocery/products"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const getStatusBadge = (status: string, adminApproved: boolean) => {
    if (!adminApproved) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Approval</Badge>;
    }
    if (status === "active") {
      return <Badge variant="default" className="bg-green-600">Active</Badge>;
    }
    if (status === "inactive") {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Grocery Products</h1>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Grocery Products</h1>
        <Button asChild>
          <a href="/provider/add-grocery-product">Add New Product</a>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-4">You haven't added any grocery products.</p>
          <Button asChild>
            <a href="/provider/add-grocery-product">Add Your First Product</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {getStatusBadge(product.status, product.adminApproved)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500 ml-1">per {product.unit}</span>
                  </div>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
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