import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertFarmerProductListingSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Leaf,
  Check,
  X,
  ShoppingBasket,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the form schema extending the base schema
const formSchema = insertFarmerProductListingSchema.extend({
  groceryProductId: z.coerce.number().positive({
    message: "Please select a product",
  }),
  price: z.coerce
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  quantity: z.coerce
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  district: z.string().optional(),
  taluk: z.string().optional(),
  pincode: z.string().optional(),
  addDeliveryArea: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddFarmerProductPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<{ [district: string]: string[] }>({});
  const [pincodes, setPincodes] = useState<{ [taluk: string]: string[] }>({});
  const [deliveryAreas, setDeliveryAreas] = useState<
    Array<{ district: string; taluk: string; pincode: string }>
  >([]);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groceryProductId: 0,
      price: "",
      quantity: "",
      unit: "kg",
      transportAgentRequired: true,
      selfDelivery: false,
      isOrganic: false,
      imageUrl: "",
      district: "",
      taluk: "",
      pincode: "",
      addDeliveryArea: false,
    },
  });

  // Fetch grocery products for farmer to choose from
  const { data: groceryProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/grocery/products"],
    queryFn: async () => {
      const response = await fetch("/api/grocery/products?status=active");
      if (!response.ok) {
        throw new Error("Failed to fetch grocery products");
      }
      return response.json();
    },
  });

  // Fetch district, taluk, and pincode data for delivery areas
  useEffect(() => {
    // This would ideally be from an API, but for now we'll use some sample data
    const districtData = [
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Nagapattinam",
    ];

    const talukData: { [district: string]: string[] } = {
      Chennai: [
        "Chennai North",
        "Chennai South",
        "Chennai East",
        "Chennai West",
      ],
      Coimbatore: [
        "Coimbatore North",
        "Coimbatore South",
        "Mettupalayam",
        "Pollachi",
      ],
      Madurai: [
        "Madurai East",
        "Madurai West",
        "Melur",
        "Peraiyur",
        "Thirumangalam",
        "Usilampatti",
      ],
    };

    const pincodeData: { [taluk: string]: string[] } = {
      "Chennai North": ["600001", "600002", "600003"],
      "Chennai South": ["600004", "600005", "600006"],
      "Coimbatore North": ["641001", "641002", "641003"],
      "Coimbatore South": ["641004", "641005", "641006"],
      "Madurai East": ["625001", "625002"],
      "Madurai West": ["625003", "625004"],
    };

    setDistricts(districtData);
    setTaluks(talukData);
    setPincodes(pincodeData);
  }, []);

  // Handle adding a delivery area
  const handleAddDeliveryArea = () => {
    const district = form.getValues("district");
    const taluk = form.getValues("taluk");
    const pincode = form.getValues("pincode");

    if (!district || !taluk || !pincode) {
      toast({
        title: "Missing information",
        description: "Please select district, taluk, and pincode",
        variant: "destructive",
      });
      return;
    }

    // Check if this area is already added
    const isDuplicate = deliveryAreas.some(
      (area) =>
        area.district === district &&
        area.taluk === taluk &&
        area.pincode === pincode,
    );

    if (isDuplicate) {
      toast({
        title: "Already added",
        description: "This delivery area has already been added",
        variant: "destructive",
      });
      return;
    }

    setDeliveryAreas([...deliveryAreas, { district, taluk, pincode }]);

    // Reset the values
    form.setValue("district", "");
    form.setValue("taluk", "");
    form.setValue("pincode", "");
  };

  // Remove a delivery area
  const removeDeliveryArea = (index: number) => {
    const newAreas = [...deliveryAreas];
    newAreas.splice(index, 1);
    setDeliveryAreas(newAreas);
  };

  // Create product listing mutation
  const createListing = useMutation({
    mutationFn: async (data: any) => {
      console.log("Submitting farmer product data:", data);
      try {
        const response = await apiRequest("POST", "/api/farmer-products", data);
        console.log("Server response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          throw new Error(
            errorData.message || "Failed to create product listing",
          );
        }

        const result = await response.json();
        console.log("Server success response:", result);
        return result;
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Product listing created",
        description: "Your product has been submitted for approval",
      });

      // Reset form and delivery areas
      form.reset();
      setDeliveryAreas([]);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-products"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    try {
      if (
        form.formState.errors &&
        Object.keys(form.formState.errors).length > 0
      ) {
        console.warn("Form has validation errors:", form.formState.errors);
        toast({
          title: "Validation errors",
          description: "Please fix the errors in the form before submitting",
          variant: "destructive",
        });
        return;
      }

      // Create a clean submission object with proper types
      const submitData = {
        groceryProductId: Number(data.groceryProductId),
        price: Number(data.price),
        quantity: Number(data.quantity),
        unit: data.unit,
        transportAgentRequired: Boolean(data.transportAgentRequired),
        selfDelivery: Boolean(data.selfDelivery),
        isOrganic: Boolean(data.isOrganic),
        imageUrl: data.imageUrl || undefined,
      };

      // Add delivery areas only if we have some
      if (deliveryAreas.length > 0) {
        Object.assign(submitData, { deliveryAreas });
      }

      console.log("Validated form data:", data);
      console.log("Submitting farmer product data:", submitData);

      // Submit to API
      createListing.mutate(submitData);
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        title: "Submission error",
        description:
          error.message || "There was a problem submitting your form",
        variant: "destructive",
      });
    }
  };

  if (!user || user.userType !== "provider") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only registered farmers can add product listings. If you are a
            farmer, please make sure you're logged in with your provider
            account.
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
          Add Your Farm Product
        </h1>
        <p className="text-gray-600 mt-2">
          List your agricultural products for sale on our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Enter the details about the product you want to sell
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Product Selection */}
                  <FormField
                    control={form.control}
                    name="groceryProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Product to Sell</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productsLoading ? (
                              <div className="flex items-center justify-center py-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Loading products...</span>
                              </div>
                            ) : groceryProducts &&
                              groceryProducts.length > 0 ? (
                              groceryProducts.map((product: any) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="py-2 px-2 text-sm">
                                No products available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 100" {...field} />
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
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Unit Selection */}
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit of Measurement</FormLabel>
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

                  {/* Delivery Options */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Delivery Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <FormLabel>Need Transport Agent</FormLabel>
                              <p className="text-sm text-gray-500">
                                The customer will need to arrange transport
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
                              <p className="text-sm text-gray-500">
                                You'll deliver the product yourself
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Organic Certification */}
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
                          <FormLabel>Organically Grown</FormLabel>
                          <p className="text-sm text-gray-500">
                            Check if your product is grown using organic methods
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Image URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Provide a URL to an image of your product. If left
                          empty, the default image for this product category
                          will be used.
                        </p>
                      </FormItem>
                    )}
                  />

                  {/* Delivery Areas */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Delivery Areas</h3>

                    <FormField
                      control={form.control}
                      name="addDeliveryArea"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Specify Delivery Areas</FormLabel>
                            <p className="text-sm text-gray-500">
                              Add specific districts, taluks, and pincodes where
                              you can deliver your products
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("addDeliveryArea") && (
                      <div className="space-y-4 p-4 border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue("taluk", "");
                                    form.setValue("pincode", "");
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {districts.map((district) => (
                                      <SelectItem
                                        key={district}
                                        value={district}
                                      >
                                        {district}
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
                            name="taluk"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Taluk</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue("pincode", "");
                                  }}
                                  value={field.value}
                                  disabled={!form.watch("district")}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select taluk" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {form.watch("district") &&
                                    taluks[form.watch("district") as string] ? (
                                      taluks[
                                        form.watch("district") as string
                                      ].map((taluk: string) => (
                                        <SelectItem key={taluk} value={taluk}>
                                          {taluk}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="py-2 px-2 text-sm">
                                        No taluks available
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!form.watch("taluk")}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select pincode" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {form.watch("taluk") &&
                                    pincodes[form.watch("taluk") as string] ? (
                                      pincodes[
                                        form.watch("taluk") as string
                                      ].map((pincode: string) => (
                                        <SelectItem
                                          key={pincode}
                                          value={pincode}
                                        >
                                          {pincode}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="py-2 px-2 text-sm">
                                        No pincodes available
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddDeliveryArea}
                          >
                            Add Delivery Area
                          </Button>
                        </div>

                        {deliveryAreas.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">
                              Added Delivery Areas:
                            </h4>
                            <div className="space-y-2">
                              {deliveryAreas.map((area, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                                >
                                  <span>
                                    {area.district}, {area.taluk},{" "}
                                    {area.pincode}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeDeliveryArea(index)}
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createListing.isPending}
                    >
                      {createListing.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit for Approval"
                      )}
                    </Button>

                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        console.log("Current form values:", form.getValues());
                        toast({
                          title: "Form data logged",
                          description: "Check browser console for form data",
                        });
                      }}
                    >
                      Debug: Log Form Data
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Approval Process</h3>
                <p className="text-sm text-gray-500">
                  All product listings require admin approval before being
                  visible to customers.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Pricing Guidelines</h3>
                <p className="text-sm text-gray-500">
                  Set competitive prices based on quality, quantity, and market
                  rates.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Delivery Options</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <p className="text-sm text-gray-500">
                      Self Delivery: You deliver the product yourself
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <p className="text-sm text-gray-500">
                      Transport Agent: Customer arranges transport
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Don't see your product?</h3>
                <p className="text-sm text-gray-500">
                  If the product you want to sell isn't listed, you can request
                  it to be added by the admin.
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    (window.location.href = "/farmer/request-product")
                  }
                >
                  <ShoppingBasket className="mr-2 h-4 w-4" />
                  Request New Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
