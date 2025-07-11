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

// Additional schema for rental provider-specific fields
const rentalProviderSchema = baseProviderSchema.extend({
  itemCategories: z.string().min(1, { message: "Item categories are required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  rentalTerms: z.string().min(1, { message: "Rental terms are required" }),
  securityDepositTerms: z.string().min(1, { message: "Security deposit terms are required" }),
  // Bank details
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  ifscCode: z.string().min(1, { message: "IFSC code is required" }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
});

export default function RentalProviderPage() {
  const { toast } = useToast();

  // Handle submission of rental provider details
  const handleSubmitRentalProvider = async (serviceProviderId: number, data: any) => {
    try {
      console.log("Submitting rental provider data:", { serviceProviderId, ...data });
      
      // Format bank details
      const bankDetails = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
      };

      // Create rental provider details
      const rentalProviderData = {
        serviceProviderId,
        itemCategories: data.itemCategories,
        operatingHours: data.operatingHours,
        rentalTerms: data.rentalTerms,
        securityDepositTerms: data.securityDepositTerms,
        bankDetails
      };

      const res = await apiRequest("POST", "/api/rental-provider-details", rentalProviderData);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create rental provider details");
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Error creating rental provider details:", error);
      toast({
        title: "Error Creating Rental Provider Details",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Extra fields for the rental provider form
  const RentalProviderFields = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Rental Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="itemCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Categories</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Construction Equipment, Electronics, Furniture"
                />
              </FormControl>
              <FormDescription>
                List the categories of items you rent out, separated by commas
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
                    <SelectItem value="24_hours">24 Hours</SelectItem>
                    <SelectItem value="business_hours">Business Hours (9 AM - 6 PM)</SelectItem>
                    <SelectItem value="extended_hours">Extended Hours (8 AM - 8 PM)</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="rentalTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rental Terms</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your rental terms and conditions"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="securityDepositTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Deposit Terms</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe your security deposit requirements and refund policies"
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
      title="Rental Provider Registration"
      description="Register as a rental provider to offer rental services for equipment, vehicles, and more through our platform."
      providerType="rental_provider"
      schema={rentalProviderSchema}
      defaultValues={{
        itemCategories: "",
        operatingHours: "",
        rentalTerms: "",
        securityDepositTerms: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      }}
      extraFields={<RentalProviderFields />}
      submitHandler={handleSubmitRentalProvider}
    />
  );
}