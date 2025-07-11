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

// Additional schema for transportation agent-specific fields
const transportationAgentSchema = baseProviderSchema.extend({
  vehicleTypes: z.string().min(1, { message: "Vehicle types are required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  servicesOffered: z.string().min(1, { message: "Services offered are required" }),
  coverageAreas: z.string().min(1, { message: "Coverage areas are required" }),
  maxCapacity: z.string().min(1, { message: "Maximum capacity is required" }),
  // Bank details
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  ifscCode: z.string().min(1, { message: "IFSC code is required" }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
});

export default function TransportationAgentPage() {
  const { toast } = useToast();

  // Handle submission of transportation agent details
  const handleSubmitTransportationAgent = async (serviceProviderId: number, data: any) => {
    try {
      console.log("Submitting transportation agent data:", { serviceProviderId, ...data });
      
      // Format bank details
      const bankDetails = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
      };

      // Create transportation agent details
      const transportationAgentData = {
        serviceProviderId,
        vehicleTypes: data.vehicleTypes,
        operatingHours: data.operatingHours,
        servicesOffered: data.servicesOffered,
        coverageAreas: data.coverageAreas,
        maxCapacity: data.maxCapacity,
        bankDetails
      };

      const res = await apiRequest("POST", "/api/transportation-agent-details", transportationAgentData);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create transportation agent details");
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Error creating transportation agent details:", error);
      toast({
        title: "Error Creating Transportation Agent Details",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Extra fields for the transportation agent form
  const TransportationAgentFields = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Transportation Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="vehicleTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Types</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cargo_van">Cargo Van</SelectItem>
                    <SelectItem value="mini_truck">Mini Truck</SelectItem>
                    <SelectItem value="lorry">Lorry</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="mixed_fleet">Mixed Fleet</SelectItem>
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
                    <SelectItem value="day_only">Day Only (6 AM - 8 PM)</SelectItem>
                    <SelectItem value="night_only">Night Only (8 PM - 6 AM)</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="servicesOffered"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services Offered</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Long-distance, Local moving, Express delivery"
                />
              </FormControl>
              <FormDescription>
                List the services you offer, separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="coverageAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coverage Areas</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Chennai, Coimbatore, Salem, Madurai"
                />
              </FormControl>
              <FormDescription>
                List the areas you cover, separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="maxCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Capacity</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 5 tons" />
              </FormControl>
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
      title="Transportation Agent Registration"
      description="Register as a transportation agent to offer logistics and delivery services through our platform."
      providerType="transportation_agent"
      schema={transportationAgentSchema}
      defaultValues={{
        vehicleTypes: "",
        operatingHours: "",
        servicesOffered: "",
        coverageAreas: "",
        maxCapacity: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      }}
      extraFields={<TransportationAgentFields />}
      submitHandler={handleSubmitTransportationAgent}
    />
  );
}