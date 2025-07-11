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
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  district: z.string().min(1, "District is required"),
  taluk: z.string().min(1, "Taluk is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  userType: z.string().default("customer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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

  // Redirect if user is already logged in, except to provider registration page
  useEffect(() => {
    // Only redirect the user if they're logged in and we're on the auth page
    if (user) {
      navigate("/");
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
      email: "",
      phone: "",
      district: "",
      taluk: "",
      pincode: "",
      userType: "customer", // Add default userType to match schema
    },
  });

  function onLoginSubmit(values: LoginValues) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterValues) {
    // Handle different registrations based on the type
    if (registrationType === "manager") {
      // Redirect to the new dedicated manager registration flow
      navigate('/manager-registration');
      return;
    } else {
      // Regular customer or provider registration
      const userData = {
        ...values,
        userType: registrationType
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
            <h1 className="text-3xl font-bold text-primary mb-2">TN Services Platform</h1>
            <p className="text-neutral-600 mb-4">
              One platform for all services across Tamil Nadu
            </p>
            
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mb-2">
              <div className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-primary hover:bg-primary/5 border-2"
                  onClick={() => { setRegistrationType("provider"); setActiveTab("register"); }}
                >
                  Register as Service Provider
                </Button>
              </div>
              <div className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => { window.open('/provider-directory', '_blank'); }}
                >
                  Browse Service Providers
                </Button>
              </div>
            </div>
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
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
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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

      {/* Right column with details */}
      <div className="flex-1 hidden lg:flex bg-primary p-8 text-white">
        <div className="max-w-lg mx-auto self-center">
          <h2 className="text-4xl font-bold mb-6">Welcome to TN Services Platform</h2>
          <p className="text-lg mb-8">
            A comprehensive platform that offers various services to the
            people of Tamil Nadu, managed by a hierarchical team across all districts.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="2"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Mobile Recharges & Bills</h3>
                <p className="text-white/80">
                  Quick and easy payment for mobile recharges and various utility bills.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Rental Services</h3>
                <p className="text-white/80">
                  Rent a wide range of tools, equipment, and other essentials as needed.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="6" height="16" x="4" y="4" rx="2"></rect>
                  <rect width="6" height="9" x="14" y="11" rx="2"></rect>
                  <path d="M22 11h-6"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Farm Fresh Groceries</h3>
                <p className="text-white/80">
                  Direct farm-to-consumer grocery products sourced from local farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
