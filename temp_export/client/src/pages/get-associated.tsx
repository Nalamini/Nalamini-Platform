import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the base schema for service provider registration
const baseProviderSchema = z.object({
  businessName: z.string().min(3, { message: "Business name must be at least 3 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  district: z.string().min(2, { message: "District is required" }),
  taluk: z.string().min(2, { message: "Taluk is required" }),
  pincode: z.string().min(6, { message: "Valid pincode is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }).optional(),
  description: z.string().min(10, { message: "Please provide a brief description" }),
  providerType: z.string(),
});

// Define specific schemas for each provider type
const farmerSchema = baseProviderSchema.extend({
  farmSize: z.string().optional(),
  farmType: z.string().optional(),
  primaryProducts: z.string(),
  cultivationSeason: z.string().optional(),
  supportsDelivery: z.boolean().default(false),
});

const manufacturerSchema = baseProviderSchema.extend({
  productCategories: z.string(),
  businessType: z.string(),
  establishmentYear: z.string().optional(),
  supportsDelivery: z.boolean().default(false),
});

const bookingAgentSchema = baseProviderSchema.extend({
  serviceTypes: z.string(),
  operatingHours: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  preferredProviders: z.string().optional(),
});

const taxiProviderSchema = baseProviderSchema.extend({
  vehicleTypes: z.string(),
  operatingHours: z.string().optional(),
  fleetSize: z.string().optional(),
  driversCount: z.string().optional(),
});

const transportationAgentSchema = baseProviderSchema.extend({
  vehicleTypes: z.string(),
  operatingHours: z.string().optional(),
  servicesOffered: z.string(),
  coverageAreas: z.string(),
  maxCapacity: z.string().optional(),
});

const rentalProviderSchema = baseProviderSchema.extend({
  itemCategories: z.string(),
  operatingHours: z.string().optional(),
  rentalTerms: z.string(),
  securityDepositTerms: z.string().optional(),
});

const recyclingAgentSchema = baseProviderSchema.extend({
  materialTypes: z.string(),
  operatingHours: z.string().optional(),
  pricingPolicy: z.string(),
  processingCapacity: z.string().optional(),
});

// Convert object values to array for rendering form fields
const districtOptions = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli",
  "Salem", "Tirunelveli", "Tiruppur", "Vellore",
  "Erode", "Thoothukkudi", "Dindigul", "Thanjavur",
  "Ranipet", "Sivakasi", "Karur", "Udhagamandalam",
  "Hosur", "Nagercoil", "Kancheepuram", "Kumarapalayam"
];

const farmTypeOptions = [
  "Organic", "Conventional", "Mixed Farming", "Hydroponics",
  "Permaculture", "Terrace Farming", "Agroforestry", "Other"
];

const productCategoryOptions = [
  "Vegetables", "Fruits", "Grains", "Dairy",
  "Meat", "Spices", "Handicrafts", "Textiles",
  "Home Decor", "Cosmetics", "Food Products", "Other"
];

const serviceTypeOptions = [
  "Bus Booking", "Flight Booking", "Train Booking",
  "Hotel Booking", "Recharge Services", "Package Tours",
  "Vehicle Rental", "Other"
];

const vehicleTypeOptions = [
  "Hatchback", "Sedan", "SUV", "Luxury Car",
  "Mini Van", "Bus", "Two Wheeler", "Other"
];

const materialTypeOptions = [
  "Aluminum", "Copper", "Brass", "Plastic",
  "Paper", "Glass", "E-Waste", "Other"
];

export default function GetAssociatedPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<"form" | "success" | "error">("form");
  
  // Get the provider type from URL query parameter
  const [location] = useLocation();
  
  // Extract provider type directly from URL parameter
  const queryParams = new URLSearchParams(location.split('?')[1] || '');
  const typeFromURL = queryParams.get('type');
  
  // Set active provider type based on URL parameter or default to "farmer"
  const [activeProviderType, setActiveProviderType] = useState(typeFromURL || "farmer");
  
  // Redirect to the specific provider registration page
  useEffect(() => {
    // Log the initial redirection attempt
    console.log("ATTEMPTING REDIRECTION - Current Provider Type:", activeProviderType);
    
    // Map of provider types to their specific registration page routes
    const providerToRouteMap: Record<string, string> = {
      "farmer": "/provider-registration/farmer",
      "manufacturer": "/provider-registration/manufacturer",
      "taxi_provider": "/provider-registration/taxi-provider",
      "booking_agent": "/provider-registration/booking-agent",
      "transportation_agent": "/provider-registration/transportation-agent",
      "rental_provider": "/provider-registration/rental-provider",
      "recycling_agent": "/provider-registration/recycling-agent"
    };
    
    // Get the route for the active provider type
    const targetRoute = providerToRouteMap[activeProviderType];
    console.log("Target route for redirection:", targetRoute);
    
    // If we have a valid route, redirect to it
    if (targetRoute) {
      console.log("REDIRECTING to:", targetRoute);
      // Use a short timeout to ensure this code runs after all state updates
      setTimeout(() => {
        window.location.href = targetRoute;
      }, 100);
    }
  }, [activeProviderType]);
  
  // Listen for URL changes and update provider type
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const type = params.get('type');
    if (type) {
      setActiveProviderType(type);
    }
  }, [location]);
  
  // Check if the current user is a valid user type to become a service provider
  const isValidForProviderRegistration = user?.userType === 'customer' || user?.userType === 'provider';

  // Create a form for the active provider type
  const form = useForm<any>({
    resolver: zodResolver(
      activeProviderType === "farmer" ? farmerSchema :
      activeProviderType === "manufacturer" ? manufacturerSchema :
      activeProviderType === "booking_agent" ? bookingAgentSchema :
      activeProviderType === "taxi_provider" ? taxiProviderSchema :
      activeProviderType === "transportation_agent" ? transportationAgentSchema :
      activeProviderType === "rental_provider" ? rentalProviderSchema :
      recyclingAgentSchema
    ),
    defaultValues: {
      providerType: activeProviderType,
      businessName: "",
      address: "",
      district: "",
      taluk: "",
      pincode: "",
      phone: "",
      email: "",
      description: "",
      supportsDelivery: false,
    },
  });
  
  // Update form resolver when activeProviderType changes
  useEffect(() => {
    form.reset({
      providerType: activeProviderType,
      businessName: "",
      address: "",
      district: "",
      taluk: "",
      pincode: "",
      phone: "",
      email: "",
      description: "",
      supportsDelivery: false,
    });
  }, [activeProviderType, form]);

  // Handle provider type change
  const handleProviderTypeChange = (value: string) => {
    setActiveProviderType(value);
    form.reset({
      ...form.getValues(),
      providerType: value,
    });
  };

  // Mutation for submitting the service provider registration
  const createProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create the service provider record
      const providerRes = await apiRequest("POST", "/api/service-providers", {
        ...data,
        userId: user?.id,
        status: "pending"
      });

      if (!providerRes.ok) {
        throw new Error("Failed to register service provider");
      }

      const provider = await providerRes.json();

      // Then create the specific provider detail record
      const detailData: any = {};
      
      // Add fields based on provider type
      if (activeProviderType === "farmer") {
        detailData.farmSize = data.farmSize;
        detailData.farmType = data.farmType;
        detailData.primaryProducts = data.primaryProducts;
        detailData.cultivationSeason = data.cultivationSeason;
        detailData.supportsDelivery = data.supportsDelivery;
        
        const detailRes = await apiRequest("POST", "/api/farmer-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register farmer details");
        }
      } else if (activeProviderType === "manufacturer") {
        detailData.productCategories = data.productCategories;
        detailData.businessType = data.businessType;
        detailData.establishmentYear = data.establishmentYear;
        detailData.supportsDelivery = data.supportsDelivery;
        
        const detailRes = await apiRequest("POST", "/api/manufacturer-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register manufacturer details");
        }
      } else if (activeProviderType === "booking_agent") {
        detailData.serviceTypes = data.serviceTypes;
        detailData.operatingHours = data.operatingHours;
        detailData.yearsOfExperience = data.yearsOfExperience;
        detailData.preferredProviders = data.preferredProviders;
        
        const detailRes = await apiRequest("POST", "/api/booking-agent-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register booking agent details");
        }
      } else if (activeProviderType === "taxi_provider") {
        detailData.vehicleTypes = data.vehicleTypes;
        detailData.operatingHours = data.operatingHours;
        detailData.fleetSize = data.fleetSize;
        detailData.driversCount = data.driversCount;
        
        const detailRes = await apiRequest("POST", "/api/taxi-provider-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register taxi provider details");
        }
      } else if (activeProviderType === "transportation_agent") {
        detailData.vehicleTypes = data.vehicleTypes;
        detailData.operatingHours = data.operatingHours;
        detailData.servicesOffered = data.servicesOffered;
        detailData.coverageAreas = data.coverageAreas;
        detailData.maxCapacity = data.maxCapacity;
        
        const detailRes = await apiRequest("POST", "/api/transportation-agent-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register transportation agent details");
        }
      } else if (activeProviderType === "rental_provider") {
        detailData.itemCategories = data.itemCategories;
        detailData.operatingHours = data.operatingHours;
        detailData.rentalTerms = data.rentalTerms;
        detailData.securityDepositTerms = data.securityDepositTerms;
        
        const detailRes = await apiRequest("POST", "/api/rental-provider-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register rental provider details");
        }
      } else if (activeProviderType === "recycling_agent") {
        detailData.materialTypes = data.materialTypes;
        detailData.operatingHours = data.operatingHours;
        detailData.pricingPolicy = data.pricingPolicy;
        detailData.processingCapacity = data.processingCapacity;
        
        const detailRes = await apiRequest("POST", "/api/recycling-agent-details", {
          ...detailData,
          serviceProviderId: provider.id
        });
        
        if (!detailRes.ok) {
          throw new Error("Failed to register recycling agent details");
        }
      }

      return provider;
    },
    onSuccess: () => {
      setFormStep("success");
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers"] });
    },
    onError: (error) => {
      setFormStep("error");
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    createProviderMutation.mutate(data);
  };

  if (formStep === "success") {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-center text-gray-600 mb-6 max-w-lg">
              Your service provider registration has been submitted successfully. Our team will review your application and get back to you soon.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setFormStep("form")}>Register Another Provider</Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (formStep === "error") {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Registration Failed</h2>
            <p className="text-center text-gray-600 mb-6 max-w-lg">
              There was an error processing your registration. Please try again or contact support if the issue persists.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setFormStep("form")}>Try Again</Button>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not a valid type for provider registration
  if (user && !isValidForProviderRegistration) {
    return (
      <div className="container py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Access Restricted
              </CardTitle>
              <CardDescription className="text-amber-700">
                This area is only available for regular users or service providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-700">
                  Your account type ({user.userType}) cannot register as a service provider. This functionality is reserved for customer or provider accounts.
                </p>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium mb-2">Account Types Explained:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Admin, Branch Managers, Taluk Managers:</strong> Managerial roles that handle oversight and approvals</li>
                    <li><strong>Service Agents:</strong> Representatives assigned to specific areas</li>
                    <li><strong>Customers/Providers:</strong> Regular users who can register as service providers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t py-4 bg-gray-50">
              <Link href="/">
                <Button variant="default" className="w-full md:w-auto">
                  Back to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Get the title and description based on provider type
  const getProviderTitle = () => {
    switch(activeProviderType) {
      case "farmer": return "Farmer Registration";
      case "manufacturer": return "Manufacturer Registration";
      case "booking_agent": return "Booking Agent Registration";
      case "taxi_provider": return "Taxi Provider Registration";
      case "transportation_agent": return "Transportation Agent Registration";
      case "rental_provider": return "Rental Provider Registration";
      case "recycling_agent": return "Recycling Agent Registration";
      default: return "Service Provider Registration";
    }
  };
  
  const getProviderDescription = () => {
    switch(activeProviderType) {
      case "farmer": 
        return "Register as a farmer to sell your farm produce directly to consumers";
      case "manufacturer": 
        return "Join as a manufacturer to reach more customers for your products";
      case "booking_agent": 
        return "Register as a booking agent for travel, accommodation, and more";
      case "taxi_provider": 
        return "Join our network of taxi providers to grow your business";
      case "transportation_agent": 
        return "Register as a transportation service for logistics and delivery";
      case "rental_provider": 
        return "Join as a rental provider for equipment, vehicles, and more";
      case "recycling_agent": 
        return "Register as a recycling agent to help promote sustainability";
      default: 
        return "Register as a service provider to join our platform and reach more customers";
    }
  };
  
  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{getProviderTitle()}</CardTitle>
          <CardDescription>
            {getProviderDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                          {districtOptions.map((district) => (
                            <SelectItem key={district} value={district}>
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input {...field} />
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
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your business, services offered, and key information" 
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditionally show fields based on provider type */}
              {activeProviderType === "farmer" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="farmType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select farm type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {farmTypeOptions.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                      name="farmSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Size (in acres)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryProducts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Products</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Vegetables, Fruits, Rice, Wheat"
                            />
                          </FormControl>
                          <FormDescription>
                            List the main products you grow, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cultivationSeason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cultivation Season</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Year-round, Summer, Monsoon" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="supportsDelivery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Support Delivery</FormLabel>
                          <FormDescription>
                            Check this if you can deliver products to customers
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {activeProviderType === "manufacturer" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Small Scale, Cottage Industry" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="establishmentYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Establishment</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productCategories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Categories</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Textiles, Handicrafts, Food Products"
                            />
                          </FormControl>
                          <FormDescription>
                            List your main product categories, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="supportsDelivery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Support Delivery</FormLabel>
                          <FormDescription>
                            Check this if you can deliver products to customers
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {activeProviderType === "booking_agent" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Types</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Bus, Flight, Hotel, Train"
                            />
                          </FormControl>
                          <FormDescription>
                            List the booking services you offer, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 9 AM - 6 PM, Monday to Friday" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredProviders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Providers</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., MakeMyTrip, Cleartrip, RedBus" />
                          </FormControl>
                          <FormDescription>
                            List your preferred service providers, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {activeProviderType === "taxi_provider" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vehicleTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Types</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Sedan, SUV, Hatchback"
                            />
                          </FormControl>
                          <FormDescription>
                            List the types of vehicles you offer, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 24x7, 6 AM - 10 PM" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fleetSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fleet Size</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormDescription>
                            The number of vehicles in your fleet
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driversCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Drivers</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {activeProviderType === "transportation_agent" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vehicleTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicle Types</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Truck, Van, Mini-truck"
                            />
                          </FormControl>
                          <FormDescription>
                            List the types of vehicles you offer, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 24x7, 8 AM - 8 PM" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="servicesOffered"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services Offered</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Freight, Moving, Logistics" />
                          </FormControl>
                          <FormDescription>
                            List the services you offer, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverageAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coverage Areas</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Chennai, Coimbatore, Madurai" />
                          </FormControl>
                          <FormDescription>
                            List the areas you serve, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Capacity</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 5000 kg, 10 tons" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {activeProviderType === "rental_provider" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="itemCategories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Categories</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Construction Equipment, Electronics, Furniture"
                            />
                          </FormControl>
                          <FormDescription>
                            List the categories of items you rent out, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 9 AM - 6 PM, Monday to Saturday" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rentalTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rental Terms</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Daily, Weekly, Monthly" />
                          </FormControl>
                          <FormDescription>
                            List your rental terms, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="securityDepositTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit Terms</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 50% of item value, Fixed amount of 5000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {activeProviderType === "recycling_agent" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="materialTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Types</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Paper, Plastic, E-waste, Metal"
                            />
                          </FormControl>
                          <FormDescription>
                            List the types of materials you collect, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 8 AM - 5 PM, Monday to Friday" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricingPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pricing Policy</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Per kg, Fixed rates by material type" />
                          </FormControl>
                          <FormDescription>
                            Describe how you price your recycling services
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="processingCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Capacity</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 100 kg per day" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={createProviderMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {createProviderMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Registration
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}