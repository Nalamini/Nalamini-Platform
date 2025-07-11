import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  district: z.string().min(1, "District is required"),
  taluk: z.string().min(1, "Taluk is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  userType: z.string().default("customer"),
  providerType: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.userType === "service_provider") {
    return data.providerType && data.businessName;
  }
  return true;
}, {
  message: "Provider type and business name are required for service providers",
  path: ["providerType"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [registrationType, setRegistrationType] = useState<"customer" | "provider" | "manager">("customer");
  const [managerType, setManagerType] = useState<"branch_manager" | "taluk_manager" | "service_agent">("branch_manager");
  
  // Check if we're coming from the landing page with a parameter to register as provider or manager
  useEffect(() => {
    // We can't directly access router state with wouter, but we can check URL search params
    const params = new URLSearchParams(window.location.search);
    const registerAs = params.get("registerAs");
    
    if (registerAs === "provider") {
      setRegistrationType("provider");
      setActiveTab("register");
    } else if (registerAs === "manager") {
      setRegistrationType("manager");
      setActiveTab("register");
    }
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      // Redirect based on user type
      if (user.userType === "provider") {
        navigate("/provider-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      district: "",
      taluk: "",
      pincode: "",
      userType: "customer",
      providerType: "",
      businessName: "",
      businessDescription: "",
    },
  });

  function onLoginSubmit(values: LoginValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterValues) {
    // Add empty email and phone for backend compatibility
    const registrationData = {
      ...values,
      email: "", // Will be collected later when needed
      phone: "" // Will be collected later when needed
    };
    
    // Handle different registrations based on the type
    if (registrationType === "manager") {
      // Redirect to the new dedicated manager registration flow
      navigate('/manager-registration');
      return;
    } else {
      // Regular customer or provider registration
      const userData = {
        ...registrationData,
        userType: registrationType === "provider" ? "service_provider" : registrationType
      };
      
      // Mutation will handle redirection in its onSuccess callback
      registerMutation.mutate(userData);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-50">
      {/* Left column with form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-primary mb-2">NALAMINI Service Platform</h1>
            <p className="text-neutral-600 mb-4">
              One platform for all services across Tamil Nadu
            </p>
            

          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <p className="text-sm text-neutral-500 text-center">
                    Don't have an account?{" "}
                    <Button variant="link" onClick={() => setActiveTab("register")} className="p-0">
                      Register here
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Register for a new account to access TN Services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Account type selection */}
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">I want to register as:</div>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center transition-all ${
                          registrationType === "customer"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setRegistrationType("customer")}
                      >
                        <div className="p-3 rounded-full bg-primary/10 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <span className="font-medium">Customer</span>
                        <span className="text-xs text-gray-500 text-center mt-1">Use services and make payments</span>
                      </div>
                      
                      <div
                        className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center transition-all ${
                          registrationType === "provider"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setRegistrationType("provider")}
                      >
                        <div className="p-3 rounded-full bg-primary/10 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                            <path d="M13 5v2"></path>
                            <path d="M13 17v2"></path>
                            <path d="M13 11v2"></path>
                          </svg>
                        </div>
                        <span className="font-medium">Service Provider</span>
                        <span className="text-xs text-gray-500 text-center mt-1">Offer services on the platform</span>
                      </div>
                      
                      <div
                        className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center transition-all ${
                          registrationType === "manager"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setRegistrationType("manager")}
                      >
                        <div className="p-3 rounded-full bg-blue-100 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <span className="font-medium">Managerial Associate</span>
                        <span className="text-xs text-gray-500 text-center mt-1">Join our management team</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Manager Registration - Only show if manager is selected */}
                  {registrationType === "manager" && (
                    <div className="mb-6">
                      <div className="text-sm font-medium mb-2">Enhanced Managerial Registration</div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <div className="text-blue-800 mb-3 font-medium">
                          We've enhanced our managerial associate registration process!
                        </div>
                        <p className="text-blue-700 mb-4">
                          To provide a better experience and collect all the necessary information, 
                          we've created a dedicated registration process for managerial associates.
                        </p>
                        <Button 
                          onClick={() => {
                            navigate('/manager-registration');
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue to Manager Registration
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
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
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Location Information Section - Crucial for commission distribution */}
                      <div className="mt-6 mb-4 border-t pt-4">
                        <h3 className="text-md font-semibold mb-2">Location Information</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This information helps us connect you with the right service agents in your area
                        </p>
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District</FormLabel>
                            <FormControl>
                              <Input placeholder="Your district (e.g., Chennai, Coimbatore)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="taluk"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Taluk</FormLabel>
                            <FormControl>
                              <Input placeholder="Your taluk" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="6-digit pincode" maxLength={6} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Service Provider Information Section */}
                      {registrationType === "provider" && (
                        <div className="mt-6 mb-4 border-t pt-4">
                          <h3 className="text-md font-semibold mb-2">Business Information</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Tell us about your business to get started as a service provider
                          </p>
                          
                          <div className="space-y-4">
                            <FormField
                              control={registerForm.control}
                              name="providerType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Provider Type</FormLabel>
                                  <FormControl>
                                    <select 
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                      {...field}
                                    >
                                      <option value="">Select provider type</option>
                                      <option value="farmer">Farmer</option>
                                      <option value="manufacturer">Manufacturer</option>
                                      <option value="booking_agent">Booking Agent</option>
                                      <option value="rental_agent">Rental Agent</option>
                                      <option value="transport_service">Transport Service</option>
                                      <option value="taxi_service">Taxi Service</option>
                                      <option value="recycling_agent">Recycling Agent</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="businessName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Business Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your business name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="businessDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Business Description (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Briefly describe your business" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className={`w-full ${registrationType === "manager" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          registrationType === "customer" 
                            ? "Create Customer Account" 
                            : registrationType === "provider"
                              ? "Create Service Provider Account"
                              : "Submit Managerial Application"
                        )}
                      </Button>
                      
                      {registrationType === "provider" && (
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          After registration, you'll be directed to set up your service provider profile
                        </div>
                      )}
                      
                      {registrationType === "manager" && (
                        <div className="mt-2 text-xs text-gray-500 text-center">
                          Your application will be reviewed by our admin team. Once approved, you will receive your login credentials via email.
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <p className="text-sm text-neutral-500 text-center">
                    Already have an account?{" "}
                    <Button variant="link" onClick={() => setActiveTab("login")} className="p-0">
                      Sign in
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right column with YouTube video */}
      <div className="flex-1 hidden lg:flex bg-gradient-to-br from-primary to-primary/80 p-6">
        <div className="max-w-2xl mx-auto self-center w-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-white">Welcome to NALAMINI Service Platform</h2>
            <p className="text-lg text-white/90 mb-6">
              Watch our platform overview to understand how NALAMINI connects communities across Tamil Nadu with essential services
            </p>
          </div>

          {/* YouTube Video Integration */}
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl mb-6">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="NALAMINI Service Platform Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Platform Demo</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Mobile Recharge</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Travel Services</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Grocery Shopping</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Local Products</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 text-sm">
              Experience seamless service delivery across Tamil Nadu with our comprehensive platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
