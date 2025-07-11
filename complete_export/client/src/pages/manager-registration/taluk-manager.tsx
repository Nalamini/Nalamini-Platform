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
import { LandPlot } from "lucide-react";
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

// Taluk-manager-specific schema
const talukManagerSchema = baseManagerSchema.extend({
  taluk: z.string().min(1, { message: "Please select a taluk" }),
  localAreaKnowledge: z.string().min(1, { message: "Please describe your knowledge of the local area" }),
  canManageAgents: z.boolean().default(false),
});

// Default values for the form
const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  district: "",
  taluk: "",
  currentOccupation: "",
  employmentType: "",
  educationLevel: "",
  experience: "",
  username: "",
  password: "",
  localAreaKnowledge: "",
  canManageAgents: false,
  notes: ""
};

export default function TalukManagerRegistration() {
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
    console.log("Taluk Manager application:", values);
    // The actual submission is handled in the ManagerRegistrationForm component
  };

  // Additional fields specific to taluk managers
  const additionalFields = (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Taluk Manager Specific Information</h3>
      
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
              Select the taluk you want to manage
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="localAreaKnowledge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Local Area Knowledge*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your knowledge of and connection to the local area"
                className="resize-none min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              How familiar are you with the area? Do you live there or have connections?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="canManageAgents"
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
                Comfortable Managing Service Agents
              </FormLabel>
              <FormDescription>
                Taluk managers oversee multiple service agents in their area
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <ManagerRegistrationForm
      managerType="taluk_manager"
      additionalFields={additionalFields}
      formSchema={talukManagerSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      title="Taluk Manager Application"
      description="Apply to become a taluk manager and coordinate services within your taluk."
      iconComponent={<LandPlot className="h-6 w-6 text-green-600" />}
    />
  );
}