import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Check, X, Edit, Eye, Trash } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LocalProductView } from "@shared/schema";

export default function AdminLocalProducts() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch all local products
  const { data: products, isLoading, error: queryError } = useQuery<LocalProductView[]>({
    queryKey: ['/api/admin/local-products', categoryFilter, statusFilter, activeTab],
    queryFn: async () => {
      console.log("Starting to fetch local products...");
      try {
        const params = new URLSearchParams();
        if (categoryFilter) params.append('category', categoryFilter);
        if (statusFilter) params.append('status', statusFilter);
        
        // Handle tabs for different statuses
        if (activeTab === 'pending-approval') {
          params.append('adminApproved', 'false');
          params.append('isDraft', 'false');
        } else if (activeTab === 'drafts') {
          params.append('isDraft', 'true');
        } else if (activeTab === 'approved') {
          params.append('adminApproved', 'true');
        }
        
        const url = `/api/admin/local-products?${params.toString()}`;
        console.log("Making API request to:", url);
        
        const response = await apiRequest('GET', url);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Loaded products:", data);
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        // Show toast notification with error
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        return [];
      }
    }
  });

  // Filter products by search term
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveProduct = async (productId: number) => {
    try {
      await apiRequest('POST', `/api/admin/local-products/${productId}/approve`);
      toast({
        title: "Product Approved",
        description: "The product has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/local-products'] });
    } catch (error) {
      console.error("Error approving product:", error);
      toast({
        variant: "destructive",
        title: "Failed to approve product",
        description: "An error occurred while approving the product.",
      });
    }
  };

  const handlePublishProduct = async (productId: number) => {
    try {
      await apiRequest('POST', `/api/admin/local-products/${productId}/publish`);
      toast({
        title: "Product Published",
        description: "The product has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/local-products'] });
    } catch (error) {
      console.error("Error publishing product:", error);
      toast({
        variant: "destructive",
        title: "Failed to publish product",
        description: "An error occurred while publishing the product.",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to deactivate this product?')) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/local-products/${productId}`);
      toast({
        title: "Product Deactivated",
        description: "The product has been deactivated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/local-products'] });
    } catch (error) {
      console.error("Error deactivating product:", error);
      toast({
        variant: "destructive",
        title: "Failed to deactivate product",
        description: "An error occurred while deactivating the product.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Local Products Management</h1>
        <Button onClick={() => navigate("/admin/local-products/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter local products by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name, category or district"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="handicrafts">Handicrafts</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="food">Food Products</SelectItem>
                  <SelectItem value="cosmetics">Cosmetics</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="pottery">Pottery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {isLoading ? "Loading products..." : `${filteredProducts?.length || 0} products found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          ₹{product.discountedPrice || product.price}
                          {product.discountedPrice && (
                            <span className="line-through text-muted-foreground ml-2">
                              ₹{product.price}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "pending"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {product.status}
                          </Badge>
                          {product.isDraft && (
                            <Badge variant="secondary" className="ml-2">
                              Draft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{product.district}</TableCell>
                        <TableCell>
                          {product.adminApproved ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => navigate(`/admin/local-products/${product.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/admin/local-products/${product.id}/edit`)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!product.adminApproved && !product.isDraft && (
                                <DropdownMenuItem
                                  onClick={() => handleApproveProduct(product.id)}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {product.isDraft && (
                                <DropdownMenuItem
                                  onClick={() => handlePublishProduct(product.id)}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}