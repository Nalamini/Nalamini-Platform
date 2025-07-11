import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Users, Building, UserPlus, MapPin, CheckCircle, Globe, Award, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type NavigationStep = 'role-selection' | 'district-selection' | 'taluk-selection' | 'pincode-selection' | 'service-selection';
type RoleType = 'branch_manager' | 'taluk_manager' | 'pincode_agent' | 'service_provider';

// Nomination form schema
const nominationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  roleType: z.string(),
  location: z.string(),
  serviceType: z.string().optional(),
});

// Service provider types
const SERVICE_TYPES = [
  { id: 'farmer', name: 'Farmers', icon: '🌾', description: 'Agricultural services and products' },
  { id: 'manufacturer', name: 'Manufacturers', icon: '🏭', description: 'Local product manufacturing' },
  { id: 'booking_agent', name: 'Booking Agents', icon: '📋', description: 'Service booking coordination' },
  { id: 'rental_agent', name: 'Rental Agents', icon: '🔑', description: 'Equipment and vehicle rentals' },
  { id: 'transport_agent', name: 'Transport Agents', icon: '🚛', description: 'Logistics and transportation' },
  { id: 'taxi_agent', name: 'Taxi Agents', icon: '🚕', description: 'Taxi and ride services' },
  { id: 'recycling_agent', name: 'Recycling Agents', icon: '♻️', description: 'Waste management and recycling' },
];

// Tamil Nadu districts (using authentic data)
const TN_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tirupur", "Tiruvallur", 
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar"
];

export default function OpportunitiesForum() {
  const [currentStep, setCurrentStep] = useState<NavigationStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedTaluk, setSelectedTaluk] = useState<string | null>(null);
  const [selectedPincode, setSelectedPincode] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showNominationForm, setShowNominationForm] = useState(false);
  const { toast } = useToast();

  // Fetch taluks for selected district
  const { data: taluks = [] } = useQuery({
    queryKey: ['/api/taluks', selectedDistrict],
    queryFn: () => apiRequest('GET', `/api/taluks?district=${selectedDistrict}`).then(res => res.json()),
    enabled: !!selectedDistrict,
  });

  // Fetch pincodes for selected taluk
  const { data: pincodes = [] } = useQuery({
    queryKey: ['/api/pincodes', selectedTaluk],
    queryFn: () => apiRequest('GET', `/api/pincodes?taluk=${selectedTaluk}&district=${selectedDistrict}`).then(res => res.json()),
    enabled: !!selectedTaluk && !!selectedDistrict,
  });

  const form = useForm({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      roleType: "",
      location: "",
      serviceType: "",
    },
  });

  const submitNomination = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/nominations', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Nomination Submitted Successfully!",
        description: "Your application has been sent to the admin for review.",
      });
      setShowNominationForm(false);
      resetNavigation();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetNavigation = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
    setSelectedDistrict(null);
    setSelectedTaluk(null);
    setSelectedPincode(null);
    setSelectedService(null);
    form.reset();
  };

  const handleRoleSelection = (role: RoleType) => {
    setSelectedRole(role);
    setCurrentStep('district-selection');
  };

  const handleDistrictSelection = (district: string) => {
    setSelectedDistrict(district);
    if (selectedRole === 'branch_manager') {
      openNominationForm();
    } else {
      setCurrentStep('taluk-selection');
    }
  };

  const handleTalukSelection = (taluk: string) => {
    setSelectedTaluk(taluk);
    if (selectedRole === 'taluk_manager') {
      openNominationForm();
    } else {
      setCurrentStep('pincode-selection');
    }
  };

  const handlePincodeSelection = (pincode: string) => {
    setSelectedPincode(pincode);
    if (selectedRole === 'pincode_agent') {
      openNominationForm();
    } else if (selectedRole === 'service_provider') {
      setCurrentStep('service-selection');
    }
  };

  const handleServiceSelection = (service: string) => {
    setSelectedService(service);
    openNominationForm();
  };

  const openNominationForm = () => {
    const location = selectedRole === 'branch_manager' 
      ? selectedDistrict
      : selectedRole === 'taluk_manager'
      ? `${selectedTaluk}, ${selectedDistrict}`
      : `${selectedPincode}, ${selectedTaluk}, ${selectedDistrict}`;
    
    form.setValue('roleType', selectedRole || '');
    form.setValue('location', location || '');
    form.setValue('serviceType', selectedService || '');
    setShowNominationForm(true);
  };

  const onSubmit = (data: any) => {
    submitNomination.mutate(data);
  };

  const goBack = () => {
    if (currentStep === 'district-selection') {
      setCurrentStep('role-selection');
      setSelectedRole(null);
    } else if (currentStep === 'taluk-selection') {
      setCurrentStep('district-selection');
      setSelectedDistrict(null);
    } else if (currentStep === 'pincode-selection') {
      setCurrentStep('taluk-selection');
      setSelectedTaluk(null);
    } else if (currentStep === 'service-selection') {
      setCurrentStep('pincode-selection');
      setSelectedPincode(null);
    }
  };

  const getBreadcrumb = () => {
    const parts = [];
    if (selectedRole) {
      parts.push(selectedRole.replace('_', ' ').toUpperCase());
    }
    if (selectedDistrict) parts.push(selectedDistrict);
    if (selectedTaluk) parts.push(selectedTaluk);
    if (selectedPincode) parts.push(selectedPincode);
    if (selectedService) parts.push(selectedService);
    return parts.join(' → ');
  };

  // Role Selection Step
  if (currentStep === 'role-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nalamini Opportunities Forum
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our growing network of service coordinators and providers across Tamil Nadu. 
              Select your preferred role to explore opportunities in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500"
              onClick={() => handleRoleSelection('branch_manager')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Branch Manager</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Oversee operations across an entire district</p>
                <Badge variant="secondary" className="mb-2">District Level</Badge>
                <p className="text-sm text-gray-500">38 Districts Available</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500"
              onClick={() => handleRoleSelection('taluk_manager')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Taluk Manager</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Manage services within a taluk</p>
                <Badge variant="secondary" className="mb-2">Taluk Level</Badge>
                <p className="text-sm text-gray-500">Multiple Taluks Available</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500"
              onClick={() => handleRoleSelection('pincode_agent')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Pincode Agent</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Coordinate services in specific pincode areas</p>
                <Badge variant="secondary" className="mb-2">Pincode Level</Badge>
                <p className="text-sm text-gray-500">Local Area Coverage</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500"
              onClick={() => handleRoleSelection('service_provider')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Provide specialized services to customers</p>
                <Badge variant="secondary" className="mb-2">Service Level</Badge>
                <p className="text-sm text-gray-500">7 Service Types</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Select Role
                </span>
                <span className="text-gray-400">→</span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Choose Location
                </span>
                <span className="text-gray-400">→</span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Nominate Yourself
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // District Selection Step
  if (currentStep === 'district-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select District</h1>
              <p className="text-gray-600 mt-1">{getBreadcrumb()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TN_DISTRICTS.map((district) => (
              <Card
                key={district}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500"
                onClick={() => handleDistrictSelection(district)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{district}</h3>
                  <Button
                    className="mt-3 w-full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDistrictSelection(district);
                    }}
                  >
                    Nominate Yourself
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Taluk Selection Step
  if (currentStep === 'taluk-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select Taluk in {selectedDistrict}</h1>
              <p className="text-gray-600 mt-1">{getBreadcrumb()}</p>
            </div>
          </div>

          {taluks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading taluks for {selectedDistrict}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {taluks.map((taluk: any) => (
                <Card
                  key={taluk.name}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500"
                  onClick={() => handleTalukSelection(taluk.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{taluk.name}</h3>
                    <Button
                      className="mt-3 w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTalukSelection(taluk.name);
                      }}
                    >
                      Nominate Yourself
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pincode Selection Step
  if (currentStep === 'pincode-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select Pincode in {selectedTaluk}</h1>
              <p className="text-gray-600 mt-1">{getBreadcrumb()}</p>
            </div>
          </div>

          {pincodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading pincodes for {selectedTaluk}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pincodes.map((pincode: any) => (
                <Card
                  key={pincode}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500"
                  onClick={() => handlePincodeSelection(pincode)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{pincode}</h3>
                    <Button
                      className="mt-2 w-full"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePincodeSelection(pincode);
                      }}
                    >
                      Nominate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Service Selection Step
  if (currentStep === 'service-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select Service Type</h1>
              <p className="text-gray-600 mt-1">{getBreadcrumb()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_TYPES.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500"
                onClick={() => handleServiceSelection(service.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceSelection(service.name);
                    }}
                  >
                    Nominate Yourself
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Nomination Form Dialog
  return (
    <>
      <Dialog open={showNominationForm} onOpenChange={setShowNominationForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Your Nomination</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Selected Position</label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  <div><strong>Role:</strong> {selectedRole?.replace('_', ' ').toUpperCase()}</div>
                  <div><strong>Location:</strong> {form.getValues('location')}</div>
                  {selectedService && <div><strong>Service:</strong> {selectedService}</div>}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNominationForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={submitNomination.isPending}
                >
                  {submitNomination.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}