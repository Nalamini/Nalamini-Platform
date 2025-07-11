import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";

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
import { 
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Common district options for all manager types
export const districtOptions = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri",
  "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
  "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
  "Thanjavur", "Theni", "Tiruchirapalli", "Tirunelveli", "Tirupattur", "Tiruppur",
  "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

// Employment type options for manager registration forms
export const employmentTypeOptions = [
  "Full-time", "Part-time", "Weekends Only", "Evenings Only", "Flexible Hours"
];

// Education level options for manager registration forms
export const educationLevelOptions = [
  "10th Pass", "12th Pass", "Diploma", "Bachelor's Degree", "Master's Degree", "Ph.D", "Other"
];

// Base schema for common fields in all manager forms
export const baseManagerSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  district: z.string({ required_error: "Please select a district" }),
  currentOccupation: z.string().min(2, { message: "Current occupation is required" }),
  employmentType: z.string({ required_error: "Please select employment type" }),
  educationLevel: z.string().optional(),
  experience: z.string().optional(),
  notes: z.string().optional(),
});

// Props for the ManagerRegistrationForm component
interface ManagerRegistrationFormProps {
  managerType: string;
  additionalFields?: React.ReactNode;
  formSchema: any;
  defaultValues: any;
  onSubmit: (values: any) => void;
  title: string;
  description: string;
  iconComponent?: React.ReactNode;
}

export default function ManagerRegistrationForm({
  managerType,
  additionalFields,
  formSchema,
  defaultValues,
  onSubmit,
  title,
  description,
  iconComponent
}: ManagerRegistrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add the manager type to the submitted values
      const applicationData = {
        ...values,
        managerType,
        status: "pending",
        notes: values.notes || `Applied for ${managerType.replace('_', ' ')} position`
      };
      
      // Send the application to our API endpoint
      const response = await fetch('/api/manager-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully. We'll review it shortly.",
          variant: "default",
        });
      } else {
        setError(data.message || "Failed to submit application. Please try again.");
        toast({
          title: "Submission Failed",
          description: data.message || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError("An unexpected error occurred. Please try again later.");
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submission was successful, show a success message
  if (isSuccess) {
    return (
      <div className="container py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Application Submitted Successfully!</CardTitle>
                <CardDescription className="text-green-700 mt-2">
                  Thank you for applying to be a {managerType.replace('_', ' ')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your application has been received and will be reviewed by our admin team. We'll contact you via the email you provided about the status of your application.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                    <li>Our admin team will review your application</li>
                    <li>Your application will be either approved or rejected based on our current needs</li>
                    <li>You'll receive an email notification about the decision</li>
                    <li>If approved, you'll receive login credentials to access your managerial dashboard</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t py-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/manager-registration">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Registration Options
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/manager-registration">
            <Button variant="ghost" className="pl-0 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registration Options
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-md border-0">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center">
              {iconComponent && (
                <div className="mr-4 bg-white p-3 rounded-md shadow-sm">
                  {iconComponent}
                </div>
              )}
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your personal details to apply
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
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
                        <FormLabel>Email Address*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
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
                        <FormLabel>District*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a district" />
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
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your complete address" 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Occupation*</FormLabel>
                        <FormControl>
                          <Input placeholder="What do you currently do?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Employment Type*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypeOptions.map((type) => (
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="educationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationLevelOptions.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
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
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl>
                          <Input placeholder="Years of relevant experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional fields specific to the manager type */}
                {additionalFields}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information you'd like to share with us" 
                          className="resize-none min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username*</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be your login username
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password*</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Choose a secure password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}