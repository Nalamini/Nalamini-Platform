import React, { useRef, useState } from "react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Updated schema for taxi provider-specific fields based on new requirements
const taxiProviderSchema = baseProviderSchema.extend({
  // Removing description requirement as per new specs
  description: z.string().optional(),
  // Vehicle type options updated as per requirements
  vehicleTypes: z.string().min(1, { message: "Vehicle type is required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  // License and vehicle-related fields
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  aadharVerified: z.boolean().default(false),
  panCardNumber: z.string().min(10, { message: "Valid PAN card number is required" })
    .max(10, { message: "PAN card should be 10 characters" }),
  vehicleRegistrationNumber: z.string().min(1, { message: "Vehicle registration number is required" }),
  vehicleInsuranceDetails: z.string().min(1, { message: "Vehicle insurance details are required" }),
  vehiclePermitDetails: z.string().min(1, { message: "Vehicle permit details are required" }),
  // Bank details
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  ifscCode: z.string().min(1, { message: "IFSC code is required" }),
  accountHolderName: z.string().min(1, { message: "Account holder name is required" }),
});

export default function TaxiProviderPage() {
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const licenseDocInputRef = useRef<HTMLInputElement>(null);
  const aadharDocInputRef = useRef<HTMLInputElement>(null);
  const panCardDocInputRef = useRef<HTMLInputElement>(null);
  const vehicleRegDocInputRef = useRef<HTMLInputElement>(null);
  const vehicleInsuranceDocInputRef = useRef<HTMLInputElement>(null);
  const vehiclePermitDocInputRef = useRef<HTMLInputElement>(null);

  // Handle submission of taxi provider details
  const handleSubmitTaxiProvider = async (serviceProviderId: number, data: any) => {
    try {
      console.log("Submitting taxi provider data:", { serviceProviderId, ...data });
      
      // Format bank details
      const bankDetails = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        accountHolderName: data.accountHolderName,
      };

      // Document references (in a real implementation, these would be file URLs)
      const documents = {
        photo: data.photo || null,
        licenseDoc: data.licenseDoc || null,
        aadharDoc: data.aadharDoc || null,
        panCardDoc: data.panCardDoc || null,
        vehicleRegDoc: data.vehicleRegDoc || null,
        vehicleInsuranceDoc: data.vehicleInsuranceDoc || null,
        vehiclePermitDoc: data.vehiclePermitDoc || null,
      };

      // Create taxi provider details
      const taxiProviderData = {
        serviceProviderId,
        vehicleTypes: data.vehicleTypes,
        operatingHours: data.operatingHours,
        licenseNumber: data.licenseNumber,
        dateOfBirth: data.dateOfBirth,
        aadharVerified: data.aadharVerified,
        panCardNumber: data.panCardNumber,
        vehicleRegistrationNumber: data.vehicleRegistrationNumber,
        vehicleInsuranceDetails: data.vehicleInsuranceDetails,
        vehiclePermitDetails: data.vehiclePermitDetails,
        bankDetails,
        documents,
        approvalStatus: "pending", // Initial approval status
      };

      const res = await apiRequest("POST", "/api/taxi-provider-details", taxiProviderData);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create taxi provider details");
      }
      
      return await res.json();
    } catch (error: any) {
      console.error("Error creating taxi provider details:", error);
      toast({
        title: "Error Creating Taxi Provider Details",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Document Upload Component with actual implementation
  const DocumentUploadField = ({ label, description, inputRef, name, form }: { 
    label: string, 
    description?: string, 
    inputRef: React.RefObject<HTMLInputElement>,
    name: string,
    form: any
  }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setFileName(file.name);
      setIsUploading(true);
      setUploadError(null);
      
      try {
        // Create form data for upload
        const formData = new FormData();
        formData.append('document', file);
        
        // Convert document type to API endpoint format
        const docTypeMap: Record<string, string> = {
          'photo': 'photo',
          'licenseDoc': 'license', 
          'aadharDoc': 'aadhar',
          'panCardDoc': 'pancard',
          'vehicleRegDoc': 'vehicle_registration',
          'vehicleInsuranceDoc': 'vehicle_insurance',
          'vehiclePermitDoc': 'vehicle_permit'
        };
        
        const docType = docTypeMap[name] || name;
        
        // Upload the document
        const response = await fetch(`/api/taxi-provider/upload/${docType}`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }
        
        const result = await response.json();
        
        // Update the form with the file path
        form.setValue(name, result.filePath);
        
        console.log(`Document uploaded successfully: ${name} -> ${result.filePath}`);
      } catch (error: any) {
        console.error('Document upload error:', error);
        setUploadError(error.message || 'Failed to upload document');
      } finally {
        setIsUploading(false);
      }
    };
    
    return (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        {description && <FormDescription>{description}</FormDescription>}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            accept="image/*, application/pdf"
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
          <span className="text-sm text-muted-foreground" id={`${name}-filename`}>
            {fileName || 'No file selected'}
          </span>
        </div>
        {uploadError && (
          <p className="text-sm text-red-500 mt-1">{uploadError}</p>
        )}
        <FormMessage />
      </FormItem>
    );
  };

  // Extra fields for the taxi provider form
  const TaxiProviderFields = ({ form }: { form: any }) => (
    <div className="space-y-8">
      <h3 className="text-lg font-medium">Taxi Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="vehicleTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                    <SelectItem value="intercity">Intercity</SelectItem>
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
      </div>

      <h3 className="text-lg font-medium mt-8">Driver Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your driver's license number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="panCardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Card Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your PAN card number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="aadharVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Aadhar Verification
                </FormLabel>
                <FormDescription>
                  I confirm that my Aadhar verification has been completed.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <h3 className="text-lg font-medium mt-8">Vehicle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="vehicleRegistrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Registration Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter vehicle registration number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="vehicleInsuranceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Insurance Details</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter vehicle insurance details" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="vehiclePermitDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Permit Details</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter vehicle permit details" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h3 className="text-lg font-medium mt-8">Document Uploads</h3>
      <div className="grid grid-cols-1 gap-6">
        <DocumentUploadField 
          label="Profile Photo" 
          description="Upload a clear photo of yourself" 
          inputRef={photoInputRef}
          name="photo"
          form={form}
        />
        
        <DocumentUploadField 
          label="License Document" 
          description="Upload both sides of your driving license" 
          inputRef={licenseDocInputRef}
          name="licenseDoc"
          form={form}
        />
        
        <DocumentUploadField 
          label="Aadhar Card" 
          description="Upload both sides of your Aadhar card" 
          inputRef={aadharDocInputRef}
          name="aadharDoc"
          form={form}
        />
        
        <DocumentUploadField 
          label="PAN Card" 
          description="Upload your PAN card" 
          inputRef={panCardDocInputRef}
          name="panCardDoc"
          form={form}
        />
        
        <DocumentUploadField 
          label="Vehicle Registration" 
          description="Upload vehicle registration document" 
          inputRef={vehicleRegDocInputRef}
          name="vehicleRegDoc"
          form={form}
        />
        
        <DocumentUploadField 
          label="Vehicle Insurance" 
          description="Upload vehicle insurance policy document" 
          inputRef={vehicleInsuranceDocInputRef}
          name="vehicleInsuranceDoc"
          form={form}
        />
        
        <DocumentUploadField 
          label="Vehicle Permit" 
          description="Upload vehicle permit document" 
          inputRef={vehiclePermitDocInputRef}
          name="vehiclePermitDoc"
          form={form}
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

      <div className="mt-8 bg-muted p-4 rounded-md">
        <h4 className="text-md font-medium mb-2">Approval Process</h4>
        <p className="text-sm text-muted-foreground">
          Your application will go through the following approval stages:
        </p>
        <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
          <li>Initial verification by pincode agent</li>
          <li>Review by taluk manager</li>
          <li>Final resolution by branch manager</li>
          <li>Final approval by admin</li>
        </ol>
        <p className="text-sm text-muted-foreground mt-2">
          Once approved, you will receive a notification and your service will be available in the platform.
        </p>
      </div>
    </div>
  );

  const renderExtraFields = (form: any): React.ReactNode => {
    return <TaxiProviderFields form={form} />;
  };

  return (
    <ProviderRegistrationForm
      title="Taxi Provider Registration"
      description="Register as a driver to offer transportation services through our platform."
      providerType="taxi_provider"
      schema={taxiProviderSchema}
      defaultValues={{
        vehicleTypes: "",
        operatingHours: "",
        licenseNumber: "",
        dateOfBirth: "",
        aadharVerified: false,
        panCardNumber: "",
        vehicleRegistrationNumber: "",
        vehicleInsuranceDetails: "",
        vehiclePermitDetails: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        // Document fields with initial empty values
        photo: "",
        licenseDoc: "",
        aadharDoc: "",
        panCardDoc: "",
        vehicleRegDoc: "",
        vehicleInsuranceDoc: "",
        vehiclePermitDoc: "",
      }}
      extraFields={renderExtraFields}
      submitHandler={handleSubmitTaxiProvider}
    />
  );
}