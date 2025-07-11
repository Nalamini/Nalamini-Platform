import { z } from "zod";
import { useQuery } from "@tanstack/react-query"; 
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import ManagerRegistrationForm, { 
  baseManagerSchema 
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
import { Building2 } from "lucide-react";

// Branch-manager-specific schema
const branchManagerSchema = baseManagerSchema.extend({
  leadershipExperience: z.string().min(1, { message: "Please provide your leadership experience" }),
  preferredDistricts: z.string().min(1, { message: "Please provide your preferred districts" }),
  canTravelRegularly: z.boolean().default(false),
});

// Default values for the form
const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  district: "",
  currentOccupation: "",
  employmentType: "",
  educationLevel: "",
  experience: "",
  username: "",
  password: "",
  leadershipExperience: "",
  preferredDistricts: "",
  canTravelRegularly: false,
  notes: ""
};

export default function BranchManagerRegistration() {
  const { user } = useAuth();
  
  // Function to handle form submission
  const handleSubmit = (values: any) => {
    console.log("Branch Manager application:", values);
    // The actual submission is handled in the ManagerRegistrationForm component
  };

  // Additional fields specific to branch managers
  const additionalFields = (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Branch Manager Specific Information</h3>
      
      <FormField
        name="leadershipExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leadership Experience*</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your leadership experience"
                className="resize-none min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Explain any previous leadership roles or experience managing teams
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="preferredDistricts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Districts*</FormLabel>
            <FormControl>
              <Input
                placeholder="List districts you'd prefer to manage"
                {...field}
              />
            </FormControl>
            <FormDescription>
              List 1-3 districts where you'd prefer to work, separated by commas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="canTravelRegularly"
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
                Available for Regular Travel
              </FormLabel>
              <FormDescription>
                Branch managers are required to travel within their district regularly
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <ManagerRegistrationForm
      managerType="branch_manager"
      additionalFields={additionalFields}
      formSchema={branchManagerSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      title="Branch Manager Application"
      description="Apply to become a branch manager and oversee operations at the district level."
      iconComponent={<Building2 className="h-6 w-6 text-blue-600" />}
    />
  );
}