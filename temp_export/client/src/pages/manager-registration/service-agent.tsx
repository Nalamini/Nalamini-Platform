import { z } from "zod";
import { useQuery } from "@tanstack/react-query"; 
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import ManagerRegistrationForm, { 
  baseManagerSchema,
  districtOptions
} from "@/components/manager-registration/registration-form";
import { apiRequest } from "@/lib/queryClient";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import { useState } from "react";

// District to taluk mappings (partial list for important districts)
const districtTalukMapping: Record<string, string[]> = {
  "Chennai": ["Chennai North", "Chennai South", "Chennai East", "Chennai West", "Chennai Central"],
  "Coimbatore": ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Valparai"],
  "Madurai": ["Madurai North", "Madurai South", "Madurai East", "Madurai West", "Melur", "Peraiyur", "Usilampatti", "Vadipatti"],
  "Salem": ["Salem", "Attur", "Edapadi", "Gangavalli", "Mettur", "Omalur", "Sankari", "Vazhapadi", "Yercaud"],
  "Tirupur": ["Tirupur North", "Tirupur South", "Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Udumalaipettai"],
  // Add more districts as needed
};

// Service-agent-specific schema
const serviceAgentSchema = baseManagerSchema.extend({
  taluk: z.string().min(1, { message: "Please select a taluk" }),
  pincode: z.string().min(6, { message: "Please enter a valid 6-digit pincode" }),
  vehicleOwned: z.string().optional(),
  hasSmartphone: z.boolean().default(true),
  servicePreferences: z.string().optional(),
});

// Default values for the form
const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  district: "",
  taluk: "",
  pincode: "",
  currentOccupation: "",
  employmentType: "",
  educationLevel: "",
  experience: "",
  username: "",
  password: "",
  vehicleOwned: "",
  hasSmartphone: true,
  servicePreferences: "",
  notes: ""
};

// Vehicle options for service agents
const vehicleOptions = [
  "None", "Bicycle", "Motorcycle/Scooter", "Car", "Auto-rickshaw", "Other"
];

export default function ServiceAgentRegistration() {
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableTaluks, setAvailableTaluks] = useState<string[]>([]);
  
  // Function to handle district selection and update available taluks
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    if (district && districtTalukMapping[district]) {
      setAvailableTaluks(districtTalukMapping[district]);
    } else {
      setAvailableTaluks([]);
    }
  };
  
  // Function to handle form submission
  const handleSubmit = (values: any) => {
    console.log("Service Agent application:", values);
    // The actual submission is handled in the ManagerRegistrationForm component
  };

  // Additional fields specific to service agents
  const additionalFields = (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Service Agent Specific Information</h3>
      
      <FormField
        name="district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District*</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                handleDistrictChange(value);
              }} 
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
            <FormDescription>
              Select the district where you want to work
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="taluk"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taluk*</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={availableTaluks.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={
                    availableTaluks.length === 0 
                      ? "Select a district first" 
                      : "Select a taluk"
                  } />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableTaluks.map((taluk) => (
                  <SelectItem key={taluk} value={taluk}>
                    {taluk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the taluk you want to serve
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode*</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your area pincode"
                {...field}
                maxLength={6}
              />
            </FormControl>
            <FormDescription>
              Service agents operate within a specific pincode area
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="vehicleOwned"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Owned</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehicleOptions.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Having a vehicle helps in providing services efficiently
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="hasSmartphone"
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
                I have a smartphone with internet
              </FormLabel>
              <FormDescription>
                A smartphone is required to access our service agent app
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        name="servicePreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Preferences</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Which services are you most interested in providing? (e.g., Recharges, Bookings, Deliveries)"
                className="resize-none min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Let us know which services you're most comfortable providing
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <ManagerRegistrationForm
      managerType="service_agent"
      additionalFields={additionalFields}
      formSchema={serviceAgentSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      title="Service Agent Application"
      description="Apply to become a service agent and provide direct service support to customers."
      iconComponent={<Users className="h-6 w-6 text-orange-600" />}
    />
  );
}