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
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Common district options for all provider types
export const districtOptions = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli",
  "Salem", "Tirunelveli", "Tiruppur", "Vellore",
  "Erode", "Thoothukkudi", "Dindigul", "Thanjavur",
  "Ranipet", "Sivakasi", "Karur", "Udhagamandalam",
  "Hosur", "Nagercoil", "Kancheepuram", "Kumarapalayam"
];

// Base schema for common fields in all provider forms
export const baseProviderSchema = z.object({
  businessName: z.string().min(3, { message: "Business name must be at least 3 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  district: z.string().min(2, { message: "District is required" }),
  description: z.string().min(10, { message: "Please provide a brief description" }),
  providerType: z.string(),
});

export type BaseProviderFormProps = {
  title: string;
  description: string;
  providerType: string;
  schema: z.ZodType<any>;
  defaultValues: Record<string, any>;
  extraFields: (form: any) => React.ReactNode;
  submitHandler: (serviceProviderId: number, data: any) => Promise<any>;
};

export default function ProviderRegistrationForm({
  title,
  description,
  providerType,
  schema,
  defaultValues,
  extraFields,
  submitHandler,
}: BaseProviderFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formStep, setFormStep] = useState<"form" | "success" | "error">("form");

  // Create form
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      providerType: providerType,
    },
  });

  // Mutation for submitting the service provider registration
  const createProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        // First create the service provider record with all required fields
        const providerData = {
          ...data,
          userId: user?.id,
          providerType: providerType, // Make sure provider type is passed
          status: "pending",
          verificationStatus: "pending",
          // Ensure all required fields from the schema are present
          operatingAreas: data.operatingAreas || [],
          website: data.website || "",
          documents: data.documents || [],
          verifiedBy: null
        };
        
        console.log("Sending provider data to API:", providerData);
        
        const providerRes = await apiRequest("POST", "/api/service-providers", providerData);

        if (!providerRes.ok) {
          const errorData = await providerRes.json();
          console.error("API error response:", errorData);
          throw new Error(errorData.message || "Failed to register service provider");
        }

        const provider = await providerRes.json();

        // Then create the specific provider detail record using the passed handler
        await submitHandler(provider.id, data);

        return provider;
      } catch (error: any) {
        throw new Error(error.message || "Registration failed");
      }
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
    // Log data to check what's being submitted
    console.log("Service provider form data:", data);
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
              <Link href="/provider-registration">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Provider Types
                </Button>
              </Link>
              <Link href="/">
                <Button>Return to Dashboard</Button>
              </Link>
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
              <Link href="/provider-registration">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Provider Types
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Link href="/provider-registration">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Provider Types
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        placeholder="Tell us about your business..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Provider-specific fields */}
              {extraFields(form)}

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={createProviderMutation.isPending}
                >
                  {createProviderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}