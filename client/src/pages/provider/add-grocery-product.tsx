import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertGroceryProductSchema, GroceryCategory, GrocerySubCategory } from "@shared/schema";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Package, Plus } from "lucide-react";
import { useLocation } from "wouter";

type FormData = z.infer<typeof insertGroceryProductSchema>;

export default function AddGroceryProduct() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Check user authorization
  if (!user || (user.userType !== "service_provider")) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p>Only service providers and farmers can add grocery products.</p>
        </div>
      </div>
    );
  }

  // Fetch categories (public endpoint)
  const { data: categories, isLoading: categoriesLoading } = useQuery<GroceryCategory[]>({
    queryKey: ["/api/grocery/categories"],
  });

  // Fetch subcategories (public endpoint)
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery<GrocerySubCategory[]>({
    queryKey: ["/api/grocery/subcategories"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(insertGroceryProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      subcategoryId: undefined,
      providerId: user?.id || 0,
      price: 0,
      discountedPrice: undefined,
      stock: 0,
      unit: "kg",
      isOrganic: false,
      district: "",
      imageUrl: "",
      deliveryOption: "both",
      availableAreas: "",
      status: "pending"
    }
  });

  // Available subcategories based on selected category
  const availableSubcategories = subcategories?.filter(
    sub => {
      const categoryId = parseInt(selectedCategory);
      console.log('Filtering subcategories:', {
        subcategory: sub.name,
        parentCategoryId: sub.parentCategoryId,
        selectedCategoryId: categoryId,
        isActive: sub.isActive,
        matches: sub.parentCategoryId === categoryId && sub.isActive
      });
      return sub.parentCategoryId === categoryId && sub.isActive;
    }
  ) || [];

  console.log('Available subcategories for category', selectedCategory, ':', availableSubcategories);

  // Reset subcategory when category changes
  useEffect(() => {
    form.setValue("subcategoryId", undefined);
  }, [selectedCategory, form]);

  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/provider/grocery/products", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Grocery product created successfully and submitted for admin approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/grocery/products"] });
      setLocation("/provider/my-grocery-products");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create grocery product.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Ensure providerId is set
    data.providerId = user.id;
    createProductMutation.mutate(data);
  };

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-border mx-auto mb-2" />
          <p>Loading categories and subcategories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Add Grocery Product</h1>
      </div>
      
      <p className="text-muted-foreground">
        Create a new grocery product for customers to purchase. Your product will need admin approval before it becomes visible to customers.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Organic Basmati Rice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select 
                        value={field.value ? field.value.toString() : ""} 
                        onValueChange={(value) => {
                          const numValue = parseInt(value);
                          field.onChange(numValue);
                          setSelectedCategory(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.filter(cat => cat.isActive).map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subcategory */}
                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select 
                        value={field.value ? field.value.toString() : ""} 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !selectedCategory 
                                ? "Select category first" 
                                : availableSubcategories.length === 0 
                                  ? "No subcategories available" 
                                  : "Select subcategory (optional)"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">No subcategory</SelectItem>
                          {availableSubcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Unit (₹) *</FormLabel>
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

                {/* Discounted Price */}
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Optional discount price" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        If provided, this will be shown as a discounted price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
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

                {/* Unit */}
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="l">Liter (l)</SelectItem>
                          <SelectItem value="ml">Milliliter (ml)</SelectItem>
                          <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* District */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Chennai" {...field} />
                      </FormControl>
                      <FormDescription>
                        District where the product is sourced/produced
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Option */}
                <FormField
                  control={form.control}
                  name="deliveryOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Option *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="direct">Direct Delivery Only</SelectItem>
                          <SelectItem value="service">Through Service Agents Only</SelectItem>
                          <SelectItem value="both">Both Options Available</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product, its quality, origin, and any special features..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/product-image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image of your product (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Available Areas */}
              <FormField
                control={form.control}
                name="availableAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Areas</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chennai, Coimbatore, Madurai" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of areas where you can deliver (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Organic Checkbox */}
              <FormField
                control={form.control}
                name="isOrganic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        This is an organic product
                      </FormLabel>
                      <FormDescription>
                        Check this if your product is certified organic or grown using organic methods
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={createProductMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  {createProductMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>
                    {createProductMutation.isPending ? "Creating..." : "Create Product"}
                  </span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/provider/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}