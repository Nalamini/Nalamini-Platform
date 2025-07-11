import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Leaf, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FarmerProductListing, GroceryProduct } from "@shared/schema";

// Define the form schema
const formSchema = z.object({
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number",
  }),
  unit: z.string().min(1, "Unit is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isOrganic: z.boolean().default(false),
  selfDelivery: z.boolean().default(false),
  transportAgentRequired: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Type for the listing with product details
interface ListingWithProduct extends FarmerProductListing {
  product?: GroceryProduct;
}

export default function EditFarmerProductPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  // Fetch the product listing
  const { data: listing, isLoading, isError, error } = useQuery<ListingWithProduct>({
    queryKey: [`/api/farmer-products/${id}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/farmer-products/${id}?includeProduct=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch product listing');
      }
      return await response.json();
    },
    enabled: !!id,
  });

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: '',
      quantity: '',
      unit: '',
      description: '',
      imageUrl: '',
      isOrganic: false,
      selfDelivery: false,
      transportAgentRequired: true,
    },
  });

  // Update form values when listing data is loaded
  useEffect(() => {
    if (listing) {
      form.reset({
        price: listing.price.toString(),
        quantity: listing.quantity.toString(),
        unit: listing.unit,
        description: listing.description || '',
        imageUrl: listing.imageUrl || '',
        isOrganic: listing.isOrganic || false,
        selfDelivery: listing.selfDelivery || false,
        transportAgentRequired: listing.transportAgentRequired || true,
      });
    }
  }, [listing, form]);

  // Update listing mutation
  const updateListing = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("PUT", `/api/farmer-products/${id}`, {
        ...data,
        price: parseFloat(data.price),
        quantity: parseFloat(data.quantity),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product listing");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product listing updated",
        description: "Your product listing has been updated and is pending admin approval.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/farmer-products/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-products/my-listings'] });
      navigate('/farmer/my-listings');
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update product listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submit handler
  const onSubmit = (data: FormValues) => {
    updateListing.mutate(data);
  };

  if (!user || user.userType !== 'provider') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only registered farmers can edit product listings. If you are a farmer, please make sure you're logged in with your provider account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading product listing...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Product Listing</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/farmer/my-listings')}>
          Back to My Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Edit Product Listing</CardTitle>
                  <CardDescription>
                    Update your product listing for {listing?.product?.name || "this product"}
                  </CardDescription>
                </div>
                {listing?.status && (
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                    listing.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <h3 className="text-blue-800 font-semibold text-sm">Important Note</h3>
                    <p className="text-blue-600 text-xs mt-1">
                      After editing, your product will require admin approval again before it appears in the store.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-700">Product Information</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {listing?.product?.name || "Product"}{" "}
                        {listing?.product?.category ? `(${listing.product.category})` : ""}
                      </p>
                    </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                placeholder="Enter price per unit" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                placeholder="Enter available quantity" 
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
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit of Measurement</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., kg, gram, dozen, piece" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product (freshness, quality, etc.)" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Paste image URL here" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="isOrganic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="flex items-center">
                                <Leaf className="h-4 w-4 mr-1 text-green-600" />
                                Organic Product
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                This product is grown organically without pesticides
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selfDelivery"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Self Delivery</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                You can deliver the product yourself
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="transportAgentRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Transport Required</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                You need a transport agent to deliver
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/farmer/my-listings')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateListing.isPending}
                    >
                      {updateListing.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Product"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  {listing?.imageUrl ? (
                    <img 
                      src={listing.imageUrl} 
                      alt={listing?.product?.name || "Product"} 
                      className="object-cover w-full h-full" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold">{listing?.product?.name || "Product"}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {listing?.product?.description || "No description available"}
                  </p>
                </div>
                
                {listing?.status === 'rejected' && listing.adminNotes && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-medium text-red-800">Admin Notes:</h4>
                    <p className="text-sm text-red-700 mt-1">{listing.adminNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}