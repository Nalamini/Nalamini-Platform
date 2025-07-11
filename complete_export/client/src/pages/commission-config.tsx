import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Save, Percent, RefreshCw, Check, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertCommissionConfigSchema } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Extended zod schema with validation
const formSchema = insertCommissionConfigSchema.extend({
  adminCommission: z.number().min(0).max(10),
  branchManagerCommission: z.number().min(0).max(10),
  talukManagerCommission: z.number().min(0).max(10),
  serviceAgentCommission: z.number().min(0).max(10),
  registeredUserCommission: z.number().min(0).max(10),
  
  // Seasonal pricing fields
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  isPeakRate: z.boolean().optional().default(false),
  seasonName: z.string().nullable().optional(),
});

type CommissionConfig = {
  id: number;
  serviceType: string;
  provider: string | null;
  adminCommission: number;
  branchManagerCommission: number;
  talukManagerCommission: number;
  serviceAgentCommission: number;
  registeredUserCommission: number;
  totalCommission: number;
  startDate: Date | null;
  endDate: Date | null;
  isPeakRate: boolean;
  seasonName: string | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default function CommissionConfigPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<CommissionConfig | null>(null);
  
  // Check if user is admin
  if (user?.userType !== "admin") {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Fetch commission configurations
  const { data: configs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ["/api/commission/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commission/config");
      return response.json();
    },
  });

  // Create new commission config
  const createConfigMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/commission/config", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Commission configuration created",
        description: "The commission configuration has been successfully created.",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/commission/config"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create commission configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update commission config
  const updateConfigMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CommissionConfig> }) => {
      const response = await apiRequest("PATCH", `/api/commission/config/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Commission configuration updated",
        description: "The commission configuration has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commission/config"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update commission configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form for creating new commission config
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      provider: "",
      adminCommission: 0.5,
      branchManagerCommission: 0.5,
      talukManagerCommission: 1.0,
      serviceAgentCommission: 2.0,
      registeredUserCommission: 1.0,
      // Seasonal pricing defaults
      startDate: null,
      endDate: null,
      isPeakRate: false,
      seasonName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createConfigMutation.mutate(values);
  };

  const toggleActive = (config: CommissionConfig) => {
    updateConfigMutation.mutate({
      id: config.id,
      data: { isActive: !config.isActive }
    });
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Commission Configuration</h1>
          <p className="text-neutral-600 mt-1">
            Manage commission rates for different services and providers
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Commission Configuration</DialogTitle>
              <DialogDescription>
                Set up commission rates for different user types in the system
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="recharge">Mobile Recharge</SelectItem>
                          <SelectItem value="booking">Travel Booking</SelectItem>
                          <SelectItem value="rental">Equipment Rental</SelectItem>
                          <SelectItem value="taxi">Taxi Service</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="grocery">Grocery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of service this commission applies to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Airtel, Jio, etc." 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Specific service provider, leave empty for all providers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Seasonal Pricing Section */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="font-medium mb-2">Seasonal / Peak Pricing</h3>
                  <p className="text-sm text-neutral-600 mb-4">Configure special commission rates for peak periods or seasonal events</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="seasonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Season Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Diwali 2023" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Name of the season or promotional period
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPeakRate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-3 mt-6 rounded-lg border border-neutral-200">
                          <div className="space-y-0.5">
                            <FormLabel>Peak Rate</FormLabel>
                            <FormDescription>
                              Mark as a special rate for peak season
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null;
                                field.onChange(date);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            When this commission rate becomes active
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null;
                                field.onChange(date);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            When this commission rate expires
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adminCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Commission (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branchManagerCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Manager (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="talukManagerCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taluk Manager (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceAgentCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Agent (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registeredUserCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered User (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createConfigMutation.isPending}
                  >
                    {createConfigMutation.isPending && (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Configuration
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Configurations</CardTitle>
          <CardDescription>
            All commission configurations for different services and providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConfigs ? (
            <div className="w-full flex justify-center py-5">
              <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          ) : !configs || configs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-neutral-500">No commission configurations found.</p>
              <p className="mt-2 text-sm text-neutral-400">
                Create a new configuration to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Branch Manager</TableHead>
                  <TableHead className="text-center">Taluk Manager</TableHead>
                  <TableHead className="text-center">Service Agent</TableHead>
                  <TableHead className="text-center">Registered User</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Season</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config: CommissionConfig) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {config.serviceType.charAt(0).toUpperCase() + config.serviceType.slice(1)}
                    </TableCell>
                    <TableCell>{config.provider || "All Providers"}</TableCell>
                    <TableCell className="text-center">{config.adminCommission}%</TableCell>
                    <TableCell className="text-center">{config.branchManagerCommission}%</TableCell>
                    <TableCell className="text-center">{config.talukManagerCommission}%</TableCell>
                    <TableCell className="text-center">{config.serviceAgentCommission}%</TableCell>
                    <TableCell className="text-center">{config.registeredUserCommission}%</TableCell>
                    <TableCell className="text-center font-medium">
                      {config.totalCommission}%
                    </TableCell>
                    <TableCell className="text-center">
                      {config.isPeakRate && config.seasonName ? (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          {config.seasonName}
                        </Badge>
                      ) : config.startDate && config.endDate ? (
                        <div className="text-xs text-neutral-600">
                          {new Date(config.startDate).toLocaleDateString()} - {new Date(config.endDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-neutral-100 text-neutral-500">
                          Standard
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {config.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(config)}
                        title={config.isActive ? "Deactivate" : "Activate"}
                      >
                        {config.isActive ? (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <p className="text-sm text-neutral-500">
            <Percent className="inline-block h-4 w-4 mr-1" />
            Showing all commission configurations
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}