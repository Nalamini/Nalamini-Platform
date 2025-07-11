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

// Additional schema for recycling agent-specific fields
const recyclingAgentSchema = baseProviderSchema.extend({
  materialTypes: z.string().min(1, { message: "Material types are required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  pricingPolicy: z.string().min(1, { message: "Pricing policy is required" }),
  processingCapacity: z.string().min(1, { message: "Processing capacity is required" }),
  // Bank details
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  ifscCode: z.string().min(1, { message: "IFSC code is required" }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
});

export default function RecyclingAgentPage() {
  const { toast } = useToast();

  // Handle submission of recycling agent details
  const handleSubmitRecyclingAgent = async (serviceProviderId: number, data: any) => {
    try {
      console.log("Submitting recycling agent data:", { serviceProviderId, ...data });
      
      // Format bank details
      const bankDetails = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
      };

      // Create recycling agent details
      const recyclingAgentData = {
        serviceProviderId,
        materialTypes: data.materialTypes,
        operatingHours: data.operatingHours,
        pricingPolicy: data.pricingPolicy,
        processingCapacity: data.processingCapacity,
        bankDetails
      };

      const res = await apiRequest("POST", "/api/recycling-agent-details", recyclingAgentData);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create recycling agent details");
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Error creating recycling agent details:", error);
      toast({
        title: "Error Creating Recycling Agent Details",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Extra fields for the recycling agent form
  const RecyclingAgentFields = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Recycling Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="materialTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Types</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Paper, Plastic, Metal, E-waste"
                />
              </FormControl>
              <FormDescription>
                List the materials you recycle, separated by commas
              </FormDescription>
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
                    <SelectItem value="business_hours">Business Hours (9 AM - 6 PM)</SelectItem>
                    <SelectItem value="extended_hours">Extended Hours (8 AM - 8 PM)</SelectItem>
                    <SelectItem value="24_hours">24 Hours</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="processingCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Capacity</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., 500 kg per day"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="pricingPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Policy</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your pricing structure for different materials"
                  className="min-h-[120px]"
                />
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
      title="Recycling Agent Registration"
      description="Register as a recycling agent to help promote sustainability through our platform."
      providerType="recycling_agent"
      schema={recyclingAgentSchema}
      defaultValues={{
        materialTypes: "",
        operatingHours: "",
        pricingPolicy: "",
        processingCapacity: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      }}
      extraFields={<RecyclingAgentFields />}
      submitHandler={handleSubmitRecyclingAgent}
    />
  );
}