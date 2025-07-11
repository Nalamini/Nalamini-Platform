import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Form schema for product details
const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  discountedPrice: z.coerce.number().positive("Discounted price must be positive").optional().or(z.literal("")),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
  district: z.string().min(1, "District is required"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  deliveryOption: z.enum(["direct", "service", "both"]),
  availableAreas: z.string().optional(),
  isDraft: z.boolean().default(true),
});

export default function LocalProductDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const productId = parseInt(id);

  // Fetch the base product information
  const { data: baseProduct, isLoading: isLoadingBase } = useQuery({
    queryKey: [`/api/admin/local-product-bases/${productId}`],
    queryFn: async () => {
      const res = await fetch(`/api/admin/local-product-bases/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch base product");
      return res.json();
    },
  });

  // Check if details already exist
  const { data: existingDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`/api/admin/local-product-details/${productId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/admin/local-product-details/${productId}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      } catch (error) {
        // If 404, details don't exist yet, which is fine
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      price: 0,
      discountedPrice: "",
      stock: 0,
      district: "",
      imageUrl: "",
      deliveryOption: "both",
      availableAreas: "",
      isDraft: true,
    },
  });

  // Update form values if details exist
  useEffect(() => {
    if (existingDetails) {
      form.reset({
        description: existingDetails.description || "",
        price: existingDetails.price || 0,
        discountedPrice: existingDetails.discountedPrice || "",
        stock: existingDetails.stock || 0,
        district: existingDetails.district || "",
        imageUrl: existingDetails.imageUrl || "",
        deliveryOption: existingDetails.deliveryOption || "both",
        availableAreas: existingDetails.availableAreas || "",
        isDraft: existingDetails.isDraft ?? true,
      });
    }
  }, [existingDetails, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      if (existingDetails) {
        // Update existing details
        await apiRequest(
          "PUT",
          `/api/admin/local-product-details/${existingDetails.id}`,
          values
        );

        toast({
          title: "Product details updated",
          description: "The product details have been updated successfully.",
        });
      } else {
        // Create new details
        await apiRequest(
          "POST",
          "/api/admin/local-product-details",
          {
            ...values,
            productId,
          }
        );

        toast({
          title: "Product details added",
          description: "The product details have been added successfully.",
        });
      }

      // Navigate back to product list
      navigate("/admin/local-products");
    } catch (error) {
      console.error("Error saving product details:", error);
      toast({
        variant: "destructive",
        title: "Failed to save product details",
        description: "An error occurred while saving the product details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle publishing product (setting isDraft to false)
  const handlePublish = async () => {
    if (!baseProduct) return;

    try {
      await apiRequest("POST", `/api/admin/local-products/${productId}/publish`);
      toast({
        title: "Product published",
        description: "The product has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/local-product-details/${productId}`] });
      navigate("/admin/local-products");
    } catch (error) {
      console.error("Error publishing product:", error);
      toast({
        variant: "destructive",
        title: "Failed to publish product",
        description: "An error occurred while publishing the product.",
      });
    }
  };

  if (isLoadingBase || isLoadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!baseProduct) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/admin/local-products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/admin/local-products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <div className="flex items-center">
          <h1 className="text-3xl font-bold mr-4">
            {existingDetails ? "Edit" : "Add"} Product Details
          </h1>
          <Badge variant="outline" className="ml-2">
            {baseProduct.adminApproved ? "Approved" : "Pending Approval"}
          </Badge>
          {existingDetails?.isDraft && (
            <Badge variant="secondary" className="ml-2">
              Draft
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          Product: {baseProduct.name} (Category: {baseProduct.category})
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Step 2: Product Details</CardTitle>
          <CardDescription>
            Add detailed information about the product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a detailed description of the product"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Regular price</FormDescription>
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
                        <Input
                          type="number"
                          placeholder="Enter discounted price (optional)"
                          step="0.01"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Special or sale price (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter stock quantity"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Available quantity</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                          <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                          <SelectItem value="Madurai">Madurai</SelectItem>
                          <SelectItem value="Trichy">Trichy</SelectItem>
                          <SelectItem value="Salem">Salem</SelectItem>
                          <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                          <SelectItem value="Erode">Erode</SelectItem>
                          <SelectItem value="Vellore">Vellore</SelectItem>
                          <SelectItem value="Thanjavur">Thanjavur</SelectItem>
                          <SelectItem value="Dindigul">Dindigul</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        District where the product is produced/available
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
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter image URL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an image of the product (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Options</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="direct">
                          Direct (manufacturer delivers)
                        </SelectItem>
                        <SelectItem value="service">
                          Service (our service agents deliver)
                        </SelectItem>
                        <SelectItem value="both">
                          Both options available
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How the product will be delivered
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Areas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter comma-separated areas (pincodes, city names)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Areas where the product is available (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDraft"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Save as Draft</FormLabel>
                      <FormDescription>
                        Save as a draft to edit later before publishing
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-between pt-6 px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/local-products")}
                >
                  Cancel
                </Button>
                <div className="space-x-2">
                  {existingDetails && existingDetails.isDraft && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handlePublish}
                      disabled={isSubmitting}
                    >
                      Publish
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Details"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}