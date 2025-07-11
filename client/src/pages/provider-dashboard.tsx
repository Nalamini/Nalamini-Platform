import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProviderAccess } from "@/hooks/use-provider-access";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Plus, Package, Edit, Trash2, Eye, Store, TrendingUp, Users, ShoppingCart } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  discountedPrice: z.number().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  isOrganic: z.boolean().default(false),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  deliveryOption: z.enum(["direct", "service", "both"]).default("both"),
  availableAreas: z.string().optional()
});

type ProductForm = z.infer<typeof productSchema>;

const categories = [
  "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Dairy", "Oils", "Beverages",
  "Snacks", "Sweets", "Meat", "Fish", "Bakery", "Others"
];

const units = ["kg", "g", "l", "ml", "pcs", "dozen", "bunch", "packet"];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const providerAccess = useProviderAccess();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Fetch provider's products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/provider/products"],
    enabled: !!user,
  });

  // Fetch provider stats
  const { data: stats } = useQuery({
    queryKey: ["/api/provider/stats"],
    enabled: !!user,
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      discountedPrice: undefined,
      stock: 0,
      unit: "kg",
      isOrganic: false,
      imageUrl: "",
      deliveryOption: "both",
      availableAreas: ""
    }
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      console.log("Sending product data:", data);
      
      // Create a grocery product first, then create a farmer listing
      const groceryProductData = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        discountedPrice: data.discountedPrice,
        stock: data.stock,
        unit: data.unit,
        isOrganic: data.isOrganic,
        imageUrl: data.imageUrl,
        deliveryOption: data.deliveryOption,
        availableAreas: data.availableAreas
      };
      
      // First create the grocery product
      const groceryResponse = await apiRequest("POST", "/api/grocery/product", groceryProductData);
      const groceryProduct = await groceryResponse.json();
      
      // Then create the farmer product listing
      const listingData = {
        groceryProductId: groceryProduct.id,
        pricePerUnit: data.price,
        availableQuantity: data.stock,
        description: data.description,
        isOrganic: data.isOrganic
      };
      
      const response = await apiRequest("POST", "/api/farmer-products", listingData);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned invalid response");
      }
    },
    onSuccess: () => {
      toast({
        title: "Product Added Successfully",
        description: "Your product has been added to the marketplace.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/stats"] });
      setIsAddingProduct(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Product creation error:", error);
      toast({
        title: "Error Adding Product",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductForm }) => {
      const response = await apiRequest("PUT", `/api/provider/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product Updated Successfully",
        description: "Your product has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/products"] });
      setEditingProduct(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Product",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/provider/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Product has been removed from the marketplace.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Product",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      addProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountedPrice: product.discountedPrice || undefined,
      stock: product.stock,
      unit: product.unit,
      isOrganic: product.isOrganic || false,
      imageUrl: product.imageUrl || "",
      deliveryOption: product.deliveryOption || "both",
      availableAreas: product.availableAreas || ""
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const cancelForm = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
    form.reset();
  };

  if (!user || user.userType !== "service_provider") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Access denied. This page is only available for service providers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show different dashboard based on provider type
  if (providerAccess.canAccessRentalServices) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Rental Services Dashboard Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rental Provider Dashboard</h1>
            <p className="text-muted-foreground">Manage your rental equipment and track your business</p>
          </div>
          <Link href="/provider/rental-equipment">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Manage Equipment
            </Button>
          </Link>
        </div>

        {/* Rental Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Available for rent</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Currently rented</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Rental customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for Rental Providers */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your rental business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/provider/rental-equipment">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Manage Equipment</h3>
                        <p className="text-sm text-muted-foreground">Add, edit, or remove rental equipment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">View Bookings</h3>
                      <p className="text-sm text-muted-foreground">Track active and upcoming rentals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Customer Reviews</h3>
                      <p className="text-sm text-muted-foreground">See customer feedback and ratings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default grocery provider dashboard
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and track your business</p>
        </div>
        <Button 
          onClick={() => setIsAddingProduct(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Add/Edit Product Form */}
          {isAddingProduct && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </CardTitle>
                <CardDescription>
                  {editingProduct 
                    ? "Update your product information"
                    : "Add a new product to your marketplace listing"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price (₹) - Optional</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0.00" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Product Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="url" 
                                placeholder="https://example.com/image.jpg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button 
                        type="submit"
                        disabled={addProductMutation.isPending || updateProductMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {addProductMutation.isPending || updateProductMutation.isPending
                          ? "Saving..." 
                          : editingProduct ? "Update Product" : "Add Product"
                        }
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={cancelForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>
                Manage your product listings and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="text-center py-4">Loading products...</div>
              ) : !products || products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first product to the marketplace
                  </p>
                  <Button 
                    onClick={() => setIsAddingProduct(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.unit}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₹{product.price}</div>
                            {product.discountedPrice && (
                              <div className="text-sm text-green-600">
                                Sale: ₹{product.discountedPrice}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status || "active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Track orders for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Orders tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                View your business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}