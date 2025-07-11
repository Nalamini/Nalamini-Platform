import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Edit, Trash2, Package, AlertCircle, ShieldAlert, Trash, Image, Upload } from "lucide-react";

// Define GroceryProduct type
type GroceryProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  categoryId?: number;
  subcategoryId?: number;
  price: number;
  discountedPrice?: number;
  farmerId?: number;
  stock: number;
  unit: string;
  isOrganic: boolean;
  district: string;
  imageUrl?: string;
  deliveryOption: string;
  availableAreas?: string;
  status: string;
  createdAt: string;
};

// Form schema for creating/editing a product
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  categoryId: z.number().optional(),
  subcategoryId: z.number().optional(),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  discountedPrice: z.coerce.number().min(0).optional(),
  farmerId: z.number().optional(),
  stock: z.coerce.number().min(0, { message: "Stock must be 0 or greater" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  isOrganic: z.boolean().default(false),
  district: z.string().min(1, { message: "District is required" }),
  imageUrl: z.string().optional(),
  deliveryOption: z.string().default("both"),
  availableAreas: z.string().optional(),
  status: z.string().default("active"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function GroceryProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  // Check if user is admin and show appropriate message if not
  const isAdmin = user?.userType === "admin";
  
  // Fetch grocery products
  const { 
    data: products, 
    isLoading, 
    error,
    isError
  } = useQuery<GroceryProduct[]>({
    queryKey: ["/api/admin/grocery/products", filterStatus, filterCategory],
    queryFn: async () => {
      try {
        let url = "/api/admin/grocery/products";
        const params = new URLSearchParams();
        
        if (filterStatus) {
          params.append("status", filterStatus);
        }
        
        if (filterCategory) {
          params.append("category", filterCategory);
        }
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
        
        console.log("DEBUG: Fetching products from:", url);
        const response = await fetch(url, { credentials: "include" });
        console.log("DEBUG: Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("DEBUG: API Error:", errorText);
          throw new Error(`Failed to fetch products: ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log("DEBUG: Products response data:", responseData);
        console.log("DEBUG: Products response type:", typeof responseData);
        console.log("DEBUG: Is response array?", Array.isArray(responseData));
        
        if (Array.isArray(responseData) && responseData.length > 0) {
          console.log("DEBUG: First product:", responseData[0]);
        } else {
          console.log("DEBUG: Empty products array or not an array");
        }
        
        return responseData;
      } catch (err) {
        console.error("DEBUG: Error in queryFn:", err);
        throw err;
      }
    },
    retry: false // Disable retries to see the error clearly
  });
  
  // Fetch categories for dropdown
  const { 
    data: categories 
  } = useQuery({
    queryKey: ["/api/admin/grocery/categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/grocery/categories", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });
  
  // Fetch subcategories for dropdown based on selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const { 
    data: subcategories 
  } = useQuery({
    queryKey: ["/api/admin/grocery/subcategories", selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      
      const res = await fetch(`/api/admin/grocery/subcategories?parentCategoryId=${selectedCategoryId}`, { 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
    enabled: !!selectedCategoryId
  });
  
  // Form for creating/editing products
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      unit: "kg",
      isOrganic: false,
      district: "",
      deliveryOption: "both",
      status: "active"
    }
  });
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isProductDialogOpen && selectedProduct) {
      // Set form values from selected product for editing
      form.reset({
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        subcategory: selectedProduct.subcategory,
        categoryId: selectedProduct.categoryId,
        subcategoryId: selectedProduct.subcategoryId,
        price: selectedProduct.price,
        discountedPrice: selectedProduct.discountedPrice,
        farmerId: selectedProduct.farmerId,
        stock: selectedProduct.stock,
        unit: selectedProduct.unit,
        isOrganic: selectedProduct.isOrganic,
        district: selectedProduct.district,
        imageUrl: selectedProduct.imageUrl,
        deliveryOption: selectedProduct.deliveryOption,
        availableAreas: selectedProduct.availableAreas,
        status: selectedProduct.status
      });
      
      if (selectedProduct.categoryId) {
        setSelectedCategoryId(selectedProduct.categoryId);
      }
      
      // Clear the uploadedImage state since we're using the existing image URL
      setUploadedImage(null);
    } else if (!isProductDialogOpen) {
      // Reset form when dialog closes
      form.reset();
      setSelectedCategoryId(null);
      setUploadedImage(null);
    }
  }, [isProductDialogOpen, selectedProduct, form]);
  
  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // If we have an uploaded image file, handle it differently
      if (uploadedImage) {
        // Create FormData to send the file
        const formData = new FormData();
        
        // Add all the product data as JSON
        formData.append('productData', JSON.stringify(data));
        
        // Add the file
        formData.append('productImage', uploadedImage);
        
        // Use fetch directly instead of apiRequest to handle FormData
        const response = await fetch('/api/admin/grocery/products/with-image', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to create product');
        }
        
        return response.json();
      }
      
      // Otherwise use the regular apiRequest
      const res = await apiRequest("POST", "/api/admin/grocery/products", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products"] });
      setIsProductDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create product",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductFormValues }) => {
      // If we have an uploaded image file, handle it differently
      if (uploadedImage) {
        // Create FormData to send the file
        const formData = new FormData();
        
        // Add all the product data as JSON
        formData.append('productData', JSON.stringify(data));
        
        // Add the file
        formData.append('productImage', uploadedImage);
        
        // Use fetch directly instead of apiRequest to handle FormData
        const response = await fetch(`/api/admin/grocery/products/${id}/with-image`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to update product');
        }
        
        return response.json();
      }
      
      // Otherwise use the regular apiRequest
      const res = await apiRequest("PUT", `/api/admin/grocery/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products"] });
      setIsProductDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update product",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/grocery/products/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete product",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  // Delete all products mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/admin/grocery/products-all");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "All products deleted",
        description: "All grocery products have been successfully removed",
      });
      // Also clear any grocery cart data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('groceryCart');
      }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products"] });
      setIsDeleteAllDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete all products",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Open product dialog for creating a new product
  const [, navigate] = useLocation();
  
  const handleAddProduct = () => {
    navigate("/admin/grocery/products-new");
  };
  
  // Open product dialog for editing an existing product
  const handleEditProduct = (product: GroceryProduct) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteConfirmation = (product: GroceryProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle category change to update subcategories
  const handleCategoryChange = (categoryId: string) => {
    form.setValue("category", categoryId);
    const category = categories?.find((c: any) => c.id.toString() === categoryId);
    if (category) {
      setSelectedCategoryId(category.id);
      form.setValue("categoryId", category.id);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {!isAdmin ? (
        <div className="flex flex-col items-center justify-center py-10">
          <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Administrator Access Required</h2>
          <p className="text-center text-muted-foreground max-w-md mb-6">
            You need administrator privileges to access this page. Please contact system admin if you believe you should have access.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Grocery Products Management</h1>
              <p className="text-muted-foreground">Manage grocery products inventory</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteAllDialogOpen(true)}
                disabled={products?.length === 0}
              >
                <Trash className="mr-2 h-4 w-4" /> Remove All Products
              </Button>
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={filterStatus || 'all-statuses'} 
                    onValueChange={(value) => setFilterStatus(value === 'all-statuses' ? null : value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={filterCategory || 'all-categories'} 
                    onValueChange={(value) => setFilterCategory(value === 'all-categories' ? null : value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All categories</SelectItem>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Grocery Products</CardTitle>
              <CardDescription>
                Manage your grocery products inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex justify-center items-center py-10 flex-col">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-center text-muted-foreground">Failed to load products. Please try again.</p>
                  <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-md max-w-2xl overflow-auto text-sm">
                    <pre className="whitespace-pre-wrap">
                      <code>{error.toString()}</code>
                    </pre>
                  </div>
                </div>
              ) : products?.length === 0 ? (
                <div className="flex justify-center items-center py-10 flex-col">
                  <Package className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">No products found.</p>
                  <Button variant="outline" className="mt-4" onClick={handleAddProduct}>
                    Add your first product
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.discountedPrice ? (
                              <div>
                                <span className="line-through text-muted-foreground">
                                  ₹{product.price.toFixed(2)}
                                </span>
                                <span className="ml-2 font-medium">
                                  ₹{product.discountedPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span>₹{product.price.toFixed(2)}</span>
                            )}
                          </TableCell>
                          <TableCell>{product.stock} {product.unit}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : product.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteConfirmation(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Product Dialog */}
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct 
                    ? "Update the details of an existing product" 
                    : "Fill in the details to add a new product"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.watch("categoryId")?.toString() || ""}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={form.watch("subcategoryId")?.toString() || ""}
                      onValueChange={(value) => {
                        form.setValue("subcategoryId", Number(value));
                        const subcategory = subcategories?.find((s: any) => s.id.toString() === value);
                        if (subcategory) {
                          form.setValue("subcategory", subcategory.name);
                        }
                      }}
                      disabled={!selectedCategoryId || !subcategories?.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories?.map((subcategory: any) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      {...form.register("price")}
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">Discounted Price (₹) (Optional)</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      step="0.01"
                      placeholder="Enter discounted price"
                      {...form.register("discountedPrice")}
                    />
                    {form.formState.errors.discountedPrice && (
                      <p className="text-sm text-destructive">{form.formState.errors.discountedPrice.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="Enter available stock"
                      {...form.register("stock")}
                    />
                    {form.formState.errors.stock && (
                      <p className="text-sm text-destructive">{form.formState.errors.stock.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={form.watch("unit")}
                      onValueChange={(value) => form.setValue("unit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="l">Liter (l)</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.unit && (
                      <p className="text-sm text-destructive">{form.formState.errors.unit.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="Enter source district"
                      {...form.register("district")}
                    />
                    {form.formState.errors.district && (
                      <p className="text-sm text-destructive">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUpload">Product Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Store the actual file for upload
                              setUploadedImage(file);
                              
                              // Create a URL for preview only
                              const fileUrl = URL.createObjectURL(file);
                              
                              // Update the form with preview URL (not used for actual upload)
                              form.setValue("imageUrl", fileUrl);
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: JPG, PNG, GIF. Max size: 5MB
                        </p>
                      </div>
                      {form.watch("imageUrl") && (
                        <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                          <img 
                            src={form.watch("imageUrl")} 
                            alt="Product preview" 
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-foreground/10 p-1 backdrop-blur-sm"
                            onClick={() => {
                              form.setValue("imageUrl", "");
                              setUploadedImage(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <Input
                      id="imageUrl"
                      type="hidden"
                      {...form.register("imageUrl")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryOption">Delivery Option</Label>
                    <Select
                      value={form.watch("deliveryOption")}
                      onValueChange={(value) => form.setValue("deliveryOption", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct only</SelectItem>
                        <SelectItem value="service">Service only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    className="min-h-[100px]"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="availableAreas">Available Areas (Optional)</Label>
                  <Textarea
                    id="availableAreas"
                    placeholder="Enter comma-separated list of areas where this product is available"
                    className="min-h-[60px]"
                    {...form.register("availableAreas")}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOrganic"
                    checked={form.watch("isOrganic")}
                    onCheckedChange={(checked) => form.setValue("isOrganic", checked)}
                  />
                  <Label htmlFor="isOrganic">Organic Product</Label>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsProductDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {selectedProduct ? "Update Product" : "Create Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will deactivate the product "{selectedProduct?.name}". 
                  The product will be marked as inactive but remain in the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => selectedProduct && deleteMutation.mutate(selectedProduct.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Deactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {/* Delete All Products Confirmation Dialog */}
          <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove All Products</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete ALL products from the database and clear
                  any grocery carts in localStorage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteAllMutation.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteAllMutation.isPending}
                >
                  {deleteAllMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing All Products...</>
                  ) : (
                    "Yes, Remove All Products"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}