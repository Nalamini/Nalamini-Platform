import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  Factory, 
  Ticket, 
  Car, 
  Truck, 
  Package2, 
  Recycle,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ProviderRegistrationPage() {
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
  const isValidForProviderRegistration = user?.userType === 'customer';
  
  // Fetch existing service provider registration if any
  const { data: existingProvider, isLoading } = useQuery<ServiceProvider>({
    queryKey: [`/api/service-providers/user/${user?.id}`],
    enabled: !!user?.id,
  });
  
  const providerTypes = [
    {
      id: "farmer",
      name: "Farmer Registration",
      description: "Register as a farmer to sell your farm produce directly to consumers",
      icon: <Sprout className="h-8 w-8 mb-4 text-green-600" />,
      route: "/provider-registration/farmer"
    },
    {
      id: "manufacturer",
      name: "Manufacturer Registration",
      description: "Join as a manufacturer to reach more customers for your products",
      icon: <Factory className="h-8 w-8 mb-4 text-blue-600" />,
      route: "/provider-registration/manufacturer"
    },
    {
      id: "booking_agent",
      name: "Booking Agent Registration",
      description: "Register as a booking agent for travel, accommodation, and more",
      icon: <Ticket className="h-8 w-8 mb-4 text-purple-600" />,
      route: "/provider-registration/booking-agent"
    },
    {
      id: "taxi_provider",
      name: "Taxi Provider Registration",
      description: "Join our network of taxi providers to grow your business",
      icon: <Car className="h-8 w-8 mb-4 text-yellow-600" />,
      route: "/provider-registration/taxi-provider"
    },
    {
      id: "transportation_agent",
      name: "Transportation Agent Registration",
      description: "Register as a transportation service for logistics and delivery",
      icon: <Truck className="h-8 w-8 mb-4 text-red-600" />,
      route: "/provider-registration/transportation-agent"
    },
    {
      id: "rental_provider",
      name: "Rental Provider Registration",
      description: "Join as a rental provider for equipment, vehicles, and more",
      icon: <Package2 className="h-8 w-8 mb-4 text-orange-600" />,
      route: "/provider-registration/rental-provider"
    },
    {
      id: "recycling_agent",
      name: "Recycling Agent Registration",
      description: "Register as a recycling agent to help promote sustainability",
      icon: <Recycle className="h-8 w-8 mb-4 text-emerald-600" />,
      route: "/provider-registration/recycling-agent"
    }
  ];
  
  // Function to render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-gray-600">Checking registration status...</p>
        </div>
      </div>
    );
  }

  // If user is already registered as a service provider
  if (existingProvider) {
    const providerType = providerTypes.find(p => p.id === existingProvider.providerType);

    return (
      <div className="container py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Service Provider Registration</h1>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Already Registered as a Service Provider</span>
            </div>
          </div>
          
          <Card className="mb-8 shadow-md border-0">
            <CardHeader className="bg-primary/5 border-b border-primary/20">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="bg-primary/10 p-4 rounded-md mb-4 md:mb-0">
                  {providerType && providerType.icon}
                </div>
                <div className="md:ml-4">
                  <CardTitle className="text-xl md:text-2xl">{existingProvider.businessName || "Your Business"}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                      <Badge variant="outline" className="py-1 px-3">
                        <span className="capitalize">{existingProvider.providerType.replace(/_/g, ' ')}</span>
                      </Badge>
                      {renderStatusBadge(existingProvider.status)}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Business Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-primary mb-3">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Business Name</h4>
                      <p className="text-base">{existingProvider.businessName || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h4>
                      <p className="text-base">{new Date(existingProvider.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                      <p className="text-base">{existingProvider.description || "No description provided"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-primary mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                      <p className="text-base">{existingProvider.email || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                      <p className="text-base">{existingProvider.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Address Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-primary mb-3">Location Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                      <p className="text-base">{existingProvider.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">District</h4>
                      <p className="text-base">{existingProvider.district}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Taluk</h4>
                      <p className="text-base">{existingProvider.taluk}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Pincode</h4>
                      <p className="text-base">{existingProvider.pincode}</p>
                    </div>
                  </div>
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
                This area is only available for regular users/customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="text-gray-700">
                  Your account type ({user.userType}) cannot register as a service provider. This functionality is reserved for regular customer accounts.
                </p>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium mb-2">Account Types Explained:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><strong>Admin, Branch Managers, Taluk Managers:</strong> Managerial roles that handle oversight and approvals</li>
                    <li><strong>Service Agents:</strong> Representatives assigned to specific areas</li>
                    <li><strong>Customers:</strong> Regular users who can register as service providers</li>
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

  // If user is not registered yet and is a valid user type, show the registration options
  return (
    <div className="container py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Get Associated with Us</h1>
        <p className="text-gray-600 mb-8">
          Choose the type of service provider you want to register as. Each registration is tailored 
          to your specific business type to help you get the most out of our platform.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerTypes.map((provider) => (
            <Card key={provider.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col items-center">
                  {provider.icon}
                  <CardTitle className="text-center">{provider.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-center">
                  {provider.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="justify-center pt-0">
                <Link href={provider.route}>
                  <Button className="w-full">
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}