import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertProductRequestSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Leaf, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema extending the base schema
const formSchema = insertProductRequestSchema
  .omit({ farmerId: true, status: true, adminNotes: true })
  .extend({
    requestedProductName: z.string().min(3, {
      message: "Product name must be at least 3 characters",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),
  });

type FormValues = z.infer<typeof formSchema>;

export default function RequestProductPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestedProductName: "",
      description: "",
      category: "",
      unit: "kg",
      imageUrl: "",
    },
  });
  
  // Create product request mutation
  const createRequest = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/product-requests", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Product request submitted",
        description: "Your request has been submitted to the admin for review",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/product-requests'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    // Add farmerId to the data
    const submitData = {
      ...data,
      farmerId: user?.id,
    };
    
    createRequest.mutate(submitData);
  };

  if (!user || user.userType !== 'service_provider') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only registered farmers can request new products. If you are a farmer, please make sure you're logged in with your provider account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-600" />
          Request New Product
        </h1>
        <p className="text-gray-600 mt-2">
          Can't find the product you want to sell? Request it here and our admin will review it.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Product Request Form</CardTitle>
            <CardDescription>
              Please provide details about the product you'd like to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="requestedProductName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Organic Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="grains">Grains</SelectItem>
                          <SelectItem value="pulses">Pulses</SelectItem>
                          <SelectItem value="dairy">Dairy Products</SelectItem>
                          <SelectItem value="spices">Spices</SelectItem>
                          <SelectItem value="nuts">Nuts & Seeds</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the product, including varieties, qualities, etc." 
                          className="resize-none h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Unit Selection */}
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Unit of Measurement*</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="lb">Pound (lb)</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                          <SelectItem value="liter">Liter (L)</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <FormLabel>Sample Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        If you have a sample image of the product, please provide a URL
                      </p>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createRequest.isPending}
                >
                  {createRequest.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  * Required fields
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}