import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ShieldAlert, Package, ArrowLeft } from "lucide-react";

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  categoryId: z.number().optional(),
  subcategoryId: z.number().optional(),
  price: z.coerce.number().min(0).optional(), // Making price optional
  discountedPrice: z.coerce.number().min(0).optional(),
  farmerId: z.number().optional(),
  stock: z.coerce.number().min(0, { message: "Stock must be 0 or greater" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  isOrganic: z.boolean().default(false),
  district: z.string().min(1, { message: "District is required" }),
  taluk: z.string().optional(), // Added taluk field
  pincode: z.string().optional(), // Added pincode field
  imageUrl: z.string().optional(),
  deliveryOption: z.string().default("both"),
  availableAreas: z.string().optional(),
  status: z.string().default("active"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function GroceryProductsNewPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [uploading, setUploading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Check if user is admin
  const isAdmin = user?.userType === "admin";
  
  // Set up form
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
      taluk: "",
      pincode: "",
      deliveryOption: "both", 
      status: "active"
    },
  });

  // Fetch categories for dropdown
  const { 
    data: categories,
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ["/api/admin/grocery/categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/grocery/categories", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });
  
  // Fetch subcategories for dropdown based on selected category
  const { 
    data: subcategories,
    isLoading: subcategoriesLoading 
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

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/admin/grocery/products", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/products"] });
      navigate("/admin/grocery/products");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create product",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    createMutation.mutate(data);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    form.setValue("category", categoryId);
    const category = categories?.find((c: any) => c.id.toString() === categoryId);
    if (category) {
      setSelectedCategoryId(category.id);
      form.setValue("categoryId", category.id);
    }
  };

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      form.setValue('imageUrl', data.imageUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
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
      </div>
    );
  }

  // Main content with product form
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new grocery product</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/grocery/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Fill in the details below to add a new product to your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading categories...</span>
                      </div>
                    ) : categories?.length > 0 ? (
                      categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">
                        No categories found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("price")}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("discountedPrice")}
                />
                {form.formState.errors.discountedPrice && (
                  <p className="text-sm text-destructive">{form.formState.errors.discountedPrice.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
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
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="l">Liter (l)</SelectItem>
                    <SelectItem value="ml">Milliliter (ml)</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
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
                  placeholder="Enter district"
                  {...form.register("district")}
                />
                {form.formState.errors.district && (
                  <p className="text-sm text-destructive">{form.formState.errors.district.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taluk">Taluk</Label>
                <Input
                  id="taluk"
                  placeholder="Enter taluk"
                  {...form.register("taluk")}
                />
                {form.formState.errors.taluk && (
                  <p className="text-sm text-destructive">{form.formState.errors.taluk.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code</Label>
                <Input
                  id="pincode"
                  placeholder="Enter PIN code"
                  maxLength={6}
                  {...form.register("pincode")}
                />
                {form.formState.errors.pincode && (
                  <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>
                )}
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
                    <SelectItem value="direct">Direct Delivery Only</SelectItem>
                    <SelectItem value="service">Service Agent Only</SelectItem>
                    <SelectItem value="both">Both Options</SelectItem>
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
              
              <div className="flex items-center space-x-2 pt-6">
                <Switch 
                  id="isOrganic" 
                  checked={form.watch("isOrganic")}
                  onCheckedChange={(checked) => form.setValue("isOrganic", checked)}
                />
                <Label htmlFor="isOrganic">Organic Product</Label>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {form.watch("imageUrl") && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">Image uploaded successfully!</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate("/admin/grocery/products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}