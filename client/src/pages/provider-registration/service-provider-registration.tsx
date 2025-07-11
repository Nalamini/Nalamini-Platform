import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Leaf,
  Factory,
  Recycle,
  Calendar,
  Car,
  Truck,
  Plane,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const serviceProviderSchema = z.object({
  providerType: z.string().min(1, "Provider type is required"),
  businessName: z.string().min(1, "Business name is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

const providerTypes = [
  {
    id: "farmer",
    name: "Farmer",
    icon: <Leaf className="w-6 h-6" />,
    description: "Agricultural producers selling crops, vegetables, fruits, and organic products",
    categories: ["Vegetables", "Fruits", "Grains", "Organic Products", "Dairy Products"]
  },
  {
    id: "manufacturer",
    name: "Manufacturer",
    icon: <Factory className="w-6 h-6" />,
    description: "Product manufacturers and industrial suppliers",
    categories: ["Food Products", "Textiles", "Electronics", "Industrial Goods", "Consumer Products"]
  },
  {
    id: "recycling_agent",
    name: "Recycling Agent",
    icon: <Recycle className="w-6 h-6" />,
    description: "Waste collection and recycling service providers",
    categories: ["Paper Recycling", "Plastic Recycling", "Metal Recycling", "Electronic Waste", "Organic Waste"]
  },
  {
    id: "booking_agent",
    name: "Booking Agent",
    icon: <Calendar className="w-6 h-6" />,
    description: "Travel and accommodation booking services",
    categories: ["Flight Booking", "Hotel Booking", "Bus Booking", "Train Booking", "Tour Packages"]
  },
  {
    id: "rental_provider",
    name: "Rental Provider",
    icon: <Car className="w-6 h-6" />,
    description: "Equipment and vehicle rental services",
    categories: ["Vehicle Rental", "Equipment Rental", "Tools Rental", "Machinery Rental", "Event Equipment"]
  },
  {
    id: "transport_service",
    name: "Transport Service",
    icon: <Truck className="w-6 h-6" />,
    description: "Goods transportation and logistics services",
    categories: ["Local Transport", "Long Distance", "Express Delivery", "Bulk Transport", "Specialized Transport"]
  },
  {
    id: "taxi_service",
    name: "Taxi Service",
    icon: <Plane className="w-6 h-6" />,
    description: "Passenger transportation services",
    categories: ["City Taxi", "Airport Transfer", "Outstation", "Emergency Transport", "Luxury Cars"]
  }
];

const districts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
  "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar"
];

export default function ServiceProviderRegistration() {
  const [selectedProviderType, setSelectedProviderType] = useState<string>("farmer");
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      providerType: selectedProviderType,
      businessName: "",
      phone: "",
      email: "",
      district: "",
      address: "",
      description: "",
    },
  });

  // Check existing registration status
  const { data: existingRegistration } = useQuery({
    queryKey: ["/api/provider/registration-status"],
    enabled: !!user,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormData) => {
      const res = await apiRequest("POST", "/api/provider/register", {
        ...data,
        providerType: selectedProviderType
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Submitted",
        description: "Your service provider registration has been submitted for admin review.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to submit registration",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceProviderFormData) => {
    registerMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      case "approved":
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="w-3 h-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  // Show existing registration status if user has already registered
  if (existingRegistration) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              Service Provider Registration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Provider Type</label>
                <p className="text-sm mt-1">{providerTypes.find(t => t.id === existingRegistration.providerType)?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="text-sm mt-1">{existingRegistration.businessName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(existingRegistration.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                <p className="text-sm mt-1">{new Date(existingRegistration.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {existingRegistration.adminNotes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                <div className="bg-muted p-3 rounded-lg text-sm mt-1">
                  {existingRegistration.adminNotes}
                </div>
              </div>
            )}

            {existingRegistration.status === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Congratulations! Your registration is approved.</h3>
                <p className="text-sm text-green-700">You can now start adding products to your catalog.</p>
              </div>
            )}

            {existingRegistration.status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Registration Under Review</h3>
                <p className="text-sm text-yellow-700">Your registration is being reviewed by our admin team. You'll be notified once it's processed.</p>
              </div>
            )}

            {existingRegistration.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Registration Rejected</h3>
                <p className="text-sm text-red-700">Please review the admin notes above and contact support if you need assistance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Become a Service Provider</h1>
        <p className="text-muted-foreground">Choose your service category and register to start offering your products and services</p>
      </div>

      <Tabs value={selectedProviderType} onValueChange={setSelectedProviderType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {providerTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="flex flex-col items-center gap-1 p-3">
              {type.icon}
              <span className="text-xs">{type.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {providerTypes.map((type) => (
          <TabsContent key={type.id} value={type.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provider Type Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {type.icon}
                    {type.name} Registration
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">What you can offer:</h4>
                      <div className="flex flex-wrap gap-2">
                        {type.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Benefits of Registration:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Reach customers across Tamil Nadu</li>
                        <li>• Manage your product catalog online</li>
                        <li>• Get commission on sales</li>
                        <li>• Access to marketing support</li>
                        <li>• Direct customer communication</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Registration Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Business Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Contact Information</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          We'll use your account details (username: {user?.username}) for communication and verification.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              District
                            </FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                  <option key={district} value={district}>
                                    {district}
                                  </option>
                                ))}
                              </select>
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
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter your complete business address"
                                rows={3}
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
                            <FormLabel>Business Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Briefly describe your business and what you offer"
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Help customers understand your business better
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}