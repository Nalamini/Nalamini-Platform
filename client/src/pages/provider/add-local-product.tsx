import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useProviderAccess } from "@/hooks/use-provider-access";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Package, 
  Upload, 
  IndianRupee, 
  MapPin, 
  Info,
  Plus,
  Check
} from "lucide-react";

const addLocalProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional(),
  price: z.string().min(1, "Price is required").transform(val => parseFloat(val)),
  discountedPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  specifications: z.string().min(5, "Specifications are required"),
  stockQuantity: z.string().min(1, "Stock quantity is required").transform(val => parseInt(val)),
  unit: z.string().min(1, "Unit is required"),
  district: z.string().min(1, "District is required"),
  availableAreas: z.string().min(1, "Available areas are required"),
  imageUrl: z.string().optional(),
});

type AddLocalProductFormData = z.infer<typeof addLocalProductSchema>;

export default function AddLocalProduct() {
  const { user } = useAuth();
  const providerAccess = useProviderAccess();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const form = useForm<AddLocalProductFormData>({
    resolver: zodResolver(addLocalProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      specifications: "",
      unit: "piece",
      district: user?.district || "",
      availableAreas: "",
      imageUrl: "",
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/admin/local-product-categories"],
  });

  // Fetch subcategories
  const { data: allSubcategories = [] } = useQuery({
    queryKey: ["/api/admin/local-product-subcategories"],
  });

  // Filter subcategories based on selected category
  const subcategories = allSubcategories.filter(
    (sub: any) => sub.parentCategoryId === parseInt(selectedCategory)
  );

  const addProductMutation = useMutation({
    mutationFn: async (data: AddLocalProductFormData) => {
      const response = await apiRequest("POST", "/api/provider/local-products", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Local product added successfully and submitted for review.",
      });
      form.reset();
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["/api/provider/local-products"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddLocalProductFormData) => {
    addProductMutation.mutate(data);
  };

  useEffect(() => {
    const categoryId = form.watch("categoryId");
    setSelectedCategory(categoryId);
    if (categoryId !== selectedCategory) {
      form.setValue("subcategoryId", "");
    }
  }, [form.watch("categoryId")]);

  // Access control for manufacturers only
  if (!user || (user.userType !== 'service_provider') || !providerAccess.canAccessLocalProducts) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only registered manufacturers can add local products</CardDescription>
          </CardHeader>
          <CardContent>
            <p>If you are a manufacturer, please ensure you are logged in with the correct account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Add Local Product
        </h1>
        <p className="text-gray-600">
          Add your local products to reach customers across Tamil Nadu. Products will be reviewed before going live.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Provide detailed information about your local product. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Handwoven Cotton Saree" {...field} />
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
                      <FormLabel>Unit *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="gram">Gram</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="meter">Meter</SelectItem>
                          <SelectItem value="pair">Pair</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product, its unique features, and what makes it special..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description to help customers understand your product better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specifications *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Material, dimensions, weight, color options, care instructions, etc..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include technical details, materials, dimensions, and other specifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: any) => (
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

                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedCategory || subcategories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory: any) => (
                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {!selectedCategory ? "Select a category first" : 
                         subcategories.length === 0 ? "No subcategories available" :
                         "Optional: Choose a more specific subcategory"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Pricing and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹) *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-10"
                            {...field} 
                          />
                        </div>
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
                      <FormLabel>Discounted Price (₹)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Optional: Offer a special price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Available quantity
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="e.g., Chennai"
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Areas *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Chennai, Kanchipuram, Tiruvallur"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Areas where this product can be delivered (comma-separated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="https://example.com/product-image.jpg"
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Optional: Provide a direct URL to your product image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Review Process</h4>
                    <p className="text-sm text-blue-700">
                      Your product will be reviewed by our admin team before it goes live. 
                      You'll receive a notification once the review is complete. This usually takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={addProductMutation.isPending}
                  className="flex-1 md:flex-none"
                >
                  {addProductMutation.isPending ? (
                    "Adding Product..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Local Product
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedCategory("");
                  }}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}