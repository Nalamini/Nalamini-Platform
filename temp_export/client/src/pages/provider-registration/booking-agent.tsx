import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import ProviderRegistrationForm, { baseProviderSchema } from "@/components/provider-registration/registration-form";
import {
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
import { Textarea } from "@/components/ui/textarea";

// Additional schema for booking agent-specific fields
const bookingAgentSchema = baseProviderSchema.extend({
  serviceTypes: z.string().min(1, { message: "Service types are required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  yearsOfExperience: z.string().min(1, { message: "Years of experience is required" }),
  preferredProviders: z.string().optional(),
  // Bank details
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  ifscCode: z.string().min(1, { message: "IFSC code is required" }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
});

export default function BookingAgentPage() {
  const { toast } = useToast();

  // Handle submission of booking agent details
  const handleSubmitBookingAgent = async (serviceProviderId: number, data: any) => {
    try {
      console.log("Submitting booking agent data:", { serviceProviderId, ...data });
      
      // Format bank details
      const bankDetails = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
      };

      // Create booking agent details
      const bookingAgentData = {
        serviceProviderId,
        serviceTypes: data.serviceTypes,
        operatingHours: data.operatingHours,
        yearsOfExperience: data.yearsOfExperience,
        preferredProviders: data.preferredProviders || "",
        bankDetails
      };

      const res = await apiRequest("POST", "/api/booking-agent-details", bookingAgentData);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create booking agent details");
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Error creating booking agent details:", error);
      toast({
        title: "Error Creating Booking Agent Details",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Extra fields for the booking agent form
  const BookingAgentFields = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Booking Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="serviceTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Types</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="flights">Flights</SelectItem>
                    <SelectItem value="buses">Buses</SelectItem>
                    <SelectItem value="trains">Trains</SelectItem>
                    <SelectItem value="vacation_packages">Vacation Packages</SelectItem>
                    <SelectItem value="all">All Services</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="operatingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating Hours</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operating hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24_hours">24 Hours</SelectItem>
                    <SelectItem value="business_hours">Business Hours (9 AM - 6 PM)</SelectItem>
                    <SelectItem value="extended_hours">Extended Hours (8 AM - 10 PM)</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="preferredProviders"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Providers (Optional)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., MakeMyTrip, IRCTC, Cleartrip"
                />
              </FormControl>
              <FormDescription>
                List your preferred travel/accommodation providers, separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h3 className="text-lg font-medium mt-8">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  return (
    <ProviderRegistrationForm
      title="Booking Agent Registration"
      description="Register as a booking agent to offer travel and accommodation booking services through our platform."
      providerType="booking_agent"
      schema={bookingAgentSchema}
      defaultValues={{
        serviceTypes: "",
        operatingHours: "",
        yearsOfExperience: "",
        preferredProviders: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      }}
      extraFields={<BookingAgentFields />}
      submitHandler={handleSubmitBookingAgent}
    />
  );
}