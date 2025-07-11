import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertGroceryProductSchema } from "@shared/schema";
import { Package, ArrowLeft } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof insertGroceryProductSchema>;

interface GroceryCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface GrocerySubCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number;
  isActive: boolean;
}

export default function GroceryProductForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Check authorization
  if (!user || (user.userType !== "service_provider" && user.userType !== "farmer")) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p>Only service providers and farmers can add grocery products.</p>
      </div>
    );
  }

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<GroceryCategory[]>({
    queryKey: ["/api/grocery/categories"],
  });

  // Fetch subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<GrocerySubCategory[]>({
    queryKey: ["/api/grocery/subcategories"],
  });

  // Filter subcategories by selected category
  const filteredSubcategories = selectedCategoryId 
    ? subcategories.filter(sub => sub.parentCategoryId === selectedCategoryId && sub.isActive)
    : [];

  const form = useForm<FormData>({
    resolver: zodResolver(insertGroceryProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      subcategoryId: undefined,
      providerId: user.id,
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
      setLocation("/provider/dashboard");
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
    data.providerId = user.id;
    createProductMutation.mutate(data);
  };

  const handleCategoryChange = (categoryId: string) => {
    const id = parseInt(categoryId);
    setSelectedCategoryId(id);
    form.setValue("categoryId", id);
    form.setValue("subcategoryId", undefined);
  };

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading categories and subcategories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLocation("/provider/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Add Grocery Product</h1>
        </div>
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
                      <Select onValueChange={handleCategoryChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
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
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        disabled={!selectedCategoryId || filteredSubcategories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSubcategories.map((subcategory) => (
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
                      <FormLabel>Price (₹) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
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
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="gram">Gram (g)</SelectItem>
                          <SelectItem value="liter">Liter (l)</SelectItem>
                          <SelectItem value="ml">Milliliter (ml)</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="packet">Packet</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup Only</SelectItem>
                          <SelectItem value="delivery">Delivery Only</SelectItem>
                          <SelectItem value="both">Both Pickup & Delivery</SelectItem>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product, its quality, origin, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
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
                      <Textarea 
                        placeholder="List areas where you can deliver or customers can pickup"
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
                      <Input 
                        placeholder="https://example.com/product-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Organic */}
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
                      <FormLabel>Organic Product</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check this if your product is organically grown/produced
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/provider/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}