import { z } from "zod";
import { useQuery } from "@tanstack/react-query"; 
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import ProviderRegistrationForm, { 
  baseProviderSchema 
} from "@/components/provider-registration/registration-form";
import { apiRequest } from "@/lib/queryClient";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

// Farm type options
const farmTypeOptions = [
  "Organic", "Conventional", "Mixed Farming", "Hydroponics",
  "Permaculture", "Terrace Farming", "Agroforestry", "Other"
];

// Farmer-specific schema
const farmerSchema = baseProviderSchema.extend({
  farmSize: z.string().optional(),
  farmType: z.string().optional(),
  primaryProducts: z.string().min(3, { message: "Please specify your primary products" }),
  cultivationSeason: z.string().optional(),
  supportsDelivery: z.boolean().default(false),
});

// Default values for the form
const defaultValues = {
  businessName: "",
  address: "",
  district: "",
  taluk: "",
  pincode: "",
  phone: "",
  email: "",
  description: "",
  farmSize: "",
  farmType: "",
  primaryProducts: "",
  cultivationSeason: "",
  supportsDelivery: false,
};

export default function FarmerRegistrationPage() {
  const { user } = useAuth();
  
  // Define user and service provider types
  interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string | null;
    userType: string;
    walletBalance: number;
  }
  
  interface ServiceProvider {
    id: number;
    userId: number;
    providerType: string;
    businessName: string | null;
    address: string;
    district: string;
    taluk: string;
    pincode: string;
    phone: string;
    email: string | null;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Check if the current user is a valid user type to become a service provider
  const isValidForProviderRegistration = user?.userType === 'customer' || user?.userType === 'provider';
  
  // Fetch existing service provider registration if any
  const { data: existingProvider, isLoading: providerLoading } = useQuery<ServiceProvider>({
    queryKey: [`/api/service-providers/user/${user?.id}`],
    enabled: !!user?.id,
  });
  
  // Handler for submitting farmer-specific details
  const submitFarmerDetails = async (serviceProviderId: number, data: any) => {
    const detailData = {
      serviceProviderId,
      farmSize: data.farmSize,
      farmType: data.farmType,
      primaryProducts: data.primaryProducts,
      cultivationSeason: data.cultivationSeason,
      supportsDelivery: data.supportsDelivery,
    };

    const detailRes = await apiRequest("POST", "/api/farmer-details", detailData);
    
    if (!detailRes.ok) {
      const errorData = await detailRes.json();
      throw new Error(errorData.message || "Failed to register farmer details");
    }
    
    return await detailRes.json();
  };

  // Extra fields specific to farmers
  const extraFields = (
    <div className="space-y-6 border-t pt-6 mt-6">
      <h3 className="text-lg font-medium">Farmer-Specific Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="farmSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Size (in acres/hectares)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 5 acres" />
              </FormControl>
              <FormDescription>Optional: Indicate the size of your farm</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="farmType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormDescription>Optional: The type of farming you practice</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="primaryProducts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Products</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Rice, Vegetables, Fruits" />
              </FormControl>
              <FormDescription>List your main agricultural products</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="cultivationSeason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cultivation Season</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Kharif, Rabi, Year-round" />
              </FormControl>
              <FormDescription>Optional: When you typically cultivate your crops</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
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
              <FormLabel>Supports Delivery</FormLabel>
              <FormDescription>
                Check this if you can deliver your products to customers directly
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  // Show loading state while checking for existing registration
  if (providerLoading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-gray-600">Checking registration status...</p>
        </div>
      </div>
    );
  }

  // If already registered as a service provider
  if (existingProvider) {
    return (
      <div className="container py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Already Registered</CardTitle>
              <CardDescription>
                You are already registered as a service provider.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Exists</AlertTitle>
                <AlertDescription>
                  You are already registered as a {existingProvider.providerType.replace('_', ' ')}. 
                  You cannot register for multiple provider types with the same account.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium mb-2">Your Options:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>Return to the main registration page to view your provider details</li>
                  <li>Go to your dashboard to continue using the platform</li>
                  <li>Contact support if you need to change your provider type</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t py-4 bg-gray-50">
              <Link href="/provider-registration">
                <Button variant="outline" className="mr-2 w-full md:w-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  View My Registration
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full md:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // If user is not a valid type for provider registration (not a customer)
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

  // If not registered and is a valid user type, show the registration form
  return (
    <ProviderRegistrationForm
      title="Farmer Registration"
      description="Join our platform as a farmer to sell your produce directly to consumers"
      providerType="farmer"
      schema={farmerSchema}
      defaultValues={defaultValues}
      extraFields={extraFields}
      submitHandler={submitFarmerDetails}
    />
  );
}