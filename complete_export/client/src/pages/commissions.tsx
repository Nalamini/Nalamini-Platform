import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { 
  RefreshCw, CreditCard, Calendar, CircleDollarSign, 
  Plus, Edit, Check, X, CheckCircle, Users, BarChart
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Commission = {
  id: number;
  userType: string;
  userId: number;
  serviceType: string;
  transactionId: number;
  serviceId: number;
  originalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  status: string;
  createdAt: Date | null;
};

type CommissionConfig = {
  id: number;
  serviceType: string;
  provider?: string;
  adminPercentage: number;
  branchManagerPercentage: number;
  talukManagerPercentage: number;
  serviceAgentPercentage: number;
  totalPercentage?: number;
  active: boolean;
};

type CommissionStats = {
  totalEarned: number;
  pendingAmount: number;
  paidAmount: number;
  recentCommissions: Commission[];
  commissionsByService: Record<string, number>;
};

// Form schema for commission configuration
const commissionConfigSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  provider: z.string().optional(),
  adminPercentage: z.coerce.number().min(0).max(10),
  branchManagerPercentage: z.coerce.number().min(0).max(10),
  talukManagerPercentage: z.coerce.number().min(0).max(10),
  serviceAgentPercentage: z.coerce.number().min(0).max(15),
  active: z.boolean().default(true)
});

export default function CommissionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("history");
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<CommissionConfig | null>(null);
  const [selectedCommissionIds, setSelectedCommissionIds] = useState<number[]>([]);
  
  const isAdmin = user?.userType === "admin";

  // Fetch user's commission stats
  const { data: stats, isLoading: statsLoading } = useQuery<CommissionStats>({
    queryKey: ["/api/commissions/stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commissions/stats");
      return response.json();
    },
  });
  
  // Fetch user's commissions (for history tab)
  const { data: commissions, isLoading } = useQuery({
    queryKey: ["/api/commission"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commission");
      return response.json();
    },
  });
  
  // For admin: fetch commission configurations
  const { data: commissionConfigs, isLoading: configsLoading } = useQuery<CommissionConfig[]>({
    queryKey: ["/api/commission-configs"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commission-configs");
      return response.json();
    },
    enabled: isAdmin
  });
  
  // For admin: fetch pending commissions
  const { data: pendingCommissions, isLoading: pendingLoading } = useQuery<Commission[]>({
    queryKey: ["/api/commissions/pending"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/commissions/pending");
      return response.json();
    },
    enabled: isAdmin
  });

  // Calculate total earnings
  const totalEarnings = commissions?.reduce(
    (sum: number, commission: Commission) => 
      sum + (commission.commissionAmount || 0), 
    0
  ) || 0;

  // Group commissions by service type
  const serviceGroups = commissions?.reduce((groups: Record<string, Commission[]>, commission: Commission) => {
    const group = groups[commission.serviceType] || [];
    group.push(commission);
    groups[commission.serviceType] = group;
    return groups;
  }, {}) || {};

  const serviceTypes = Object.keys(serviceGroups);

  // Admin: Create/update commission config mutation
  const configMutation = useMutation({
    mutationFn: async (data: z.infer<typeof commissionConfigSchema>) => {
      const url = selectedConfig 
        ? `/api/commission-configs/${selectedConfig.id}`
        : "/api/commission-configs";
      const method = selectedConfig ? "PUT" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commission-configs"] });
      setOpenConfigDialog(false);
      setSelectedConfig(null);
      toast({
        title: "Success",
        description: selectedConfig 
          ? "Commission configuration updated successfully"
          : "Commission configuration created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to ${selectedConfig ? 'update' : 'create'} commission configuration: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Admin: Mark commissions as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: async (commissionIds: number[]) => {
      const response = await apiRequest("POST", "/api/commissions/mark-paid", { commissionIds });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/stats"] });
      setSelectedCommissionIds([]);
      toast({
        title: "Success",
        description: "Commissions marked as paid successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to mark commissions as paid: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Commission config form
  const configForm = useForm<z.infer<typeof commissionConfigSchema>>({
    resolver: zodResolver(commissionConfigSchema),
    defaultValues: selectedConfig ? {
      serviceType: selectedConfig.serviceType,
      provider: selectedConfig.provider || "",
      adminPercentage: selectedConfig.adminPercentage,
      branchManagerPercentage: selectedConfig.branchManagerPercentage,
      talukManagerPercentage: selectedConfig.talukManagerPercentage,
      serviceAgentPercentage: selectedConfig.serviceAgentPercentage,
      active: selectedConfig.active
    } : {
      serviceType: "",
      provider: "",
      adminPercentage: 0.5,
      branchManagerPercentage: 0.5,
      talukManagerPercentage: 1,
      serviceAgentPercentage: 3,
      active: true
    }
  });
  
  const handleSubmitConfig = (data: z.infer<typeof commissionConfigSchema>) => {
    configMutation.mutate(data);
  };
  
  const handleOpenConfigDialog = (config?: CommissionConfig) => {
    if (config) {
      setSelectedConfig(config);
      configForm.reset({
        serviceType: config.serviceType,
        provider: config.provider || "",
        adminPercentage: config.adminPercentage,
        branchManagerPercentage: config.branchManagerPercentage,
        talukManagerPercentage: config.talukManagerPercentage,
        serviceAgentPercentage: config.serviceAgentPercentage,
        active: config.active
      });
    } else {
      setSelectedConfig(null);
      configForm.reset({
        serviceType: "",
        provider: "",
        adminPercentage: 0.5,
        branchManagerPercentage: 0.5,
        talukManagerPercentage: 1,
        serviceAgentPercentage: 3,
        active: true
      });
    }
    setOpenConfigDialog(true);
  };
  
  const handleMarkPaid = () => {
    if (selectedCommissionIds.length > 0) {
      markPaidMutation.mutate(selectedCommissionIds);
    } else {
      toast({
        title: "No commissions selected",
        description: "Please select at least one commission to mark as paid",
        variant: "destructive",
      });
    }
  };
  
  const toggleCommissionSelection = (id: number) => {
    setSelectedCommissionIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(commissionId => commissionId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Commission Management</h1>
          <p className="text-neutral-600 mt-1">
            {isAdmin 
              ? "View, track, and configure commission structures across your organization" 
              : "View all your earned commissions and track your earnings"}
          </p>
        </div>
        
        {statsLoading ? (
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-center">
              <RefreshCw className="h-10 w-10 text-primary mr-4 animate-spin" />
              <div>
                <p className="text-sm text-neutral-500">Loading...</p>
              </div>
            </CardContent>
          </Card>
        ) : stats ? (
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Card className="w-full md:w-auto">
              <CardContent className="p-4 flex items-center">
                <CircleDollarSign className="h-10 w-10 text-primary mr-4" />
                <div>
                  <p className="text-sm text-neutral-500">Total Earned</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalEarned)}</p>
                </div>
              </CardContent>
            </Card>
            
            {isAdmin && (
              <Card className="w-full md:w-auto">
                <CardContent className="p-4 flex items-center">
                  <CircleDollarSign className="h-10 w-10 text-amber-500 mr-4" />
                  <div>
                    <p className="text-sm text-neutral-500">Pending Payouts</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-center">
              <CircleDollarSign className="h-10 w-10 text-primary mr-4" />
              <div>
                <p className="text-sm text-neutral-500">Total Earned</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {isAdmin && (
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Commission History</TabsTrigger>
              <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Admin tab content */}
      {isAdmin && activeTab === "config" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Commission Configuration</CardTitle>
              <CardDescription>
                Configure commission percentages for different services and providers
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenConfigDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Configuration
            </Button>
          </CardHeader>
          <CardContent>
            {configsLoading ? (
              <div className="w-full flex justify-center py-5">
                <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
              </div>
            ) : !commissionConfigs || commissionConfigs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-neutral-500">No commission configurations found.</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Add a new configuration to manage commission rates.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">Branch Manager</TableHead>
                    <TableHead className="text-center">Taluk Manager</TableHead>
                    <TableHead className="text-center">Service Agent</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionConfigs.map((config) => {
                    const totalPercentage = 
                      config.adminPercentage + 
                      config.branchManagerPercentage + 
                      config.talukManagerPercentage + 
                      config.serviceAgentPercentage;
                      
                    return (
                      <TableRow key={config.id}>
                        <TableCell className="font-medium">
                          {config.serviceType.charAt(0).toUpperCase() + config.serviceType.slice(1)}
                        </TableCell>
                        <TableCell>{config.provider || "All Providers"}</TableCell>
                        <TableCell className="text-center">{config.adminPercentage}%</TableCell>
                        <TableCell className="text-center">{config.branchManagerPercentage}%</TableCell>
                        <TableCell className="text-center">{config.talukManagerPercentage}%</TableCell>
                        <TableCell className="text-center">{config.serviceAgentPercentage}%</TableCell>
                        <TableCell className="text-center font-medium">{totalPercentage}%</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={config.active ? "default" : "outline"}
                            className={config.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                          >
                            {config.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenConfigDialog(config)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {isAdmin && activeTab === "pending" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Commission Payouts</CardTitle>
              <CardDescription>
                Review and process pending commission payments
              </CardDescription>
            </div>
            <Button 
              onClick={handleMarkPaid} 
              disabled={markPaidMutation.isPending || selectedCommissionIds.length === 0}
            >
              {markPaidMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Mark Selected as Paid
            </Button>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="w-full flex justify-center py-5">
                <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
              </div>
            ) : !pendingCommissions || pendingCommissions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-neutral-500">No pending commissions found.</p>
                <p className="mt-2 text-sm text-neutral-400">
                  All commissions have been processed.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCommissionIds(pendingCommissions.map(c => c.id));
                            } else {
                              setSelectedCommissionIds([]);
                            }
                          }}
                          checked={selectedCommissionIds.length === pendingCommissions.length && pendingCommissions.length > 0}
                        />
                      </div>
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={() => toggleCommissionSelection(commission.id)}
                          checked={selectedCommissionIds.includes(commission.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {commission.createdAt ? 
                          format(new Date(commission.createdAt), 'dd MMM yyyy') : 
                          'N/A'}
                      </TableCell>
                      <TableCell>ID: {commission.userId}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            commission.userType === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : commission.userType === 'branch_manager'
                              ? 'bg-blue-100 text-blue-800'
                              : commission.userType === 'taluk_manager'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {commission.userType.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {commission.serviceType.charAt(0).toUpperCase() + 
                            commission.serviceType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>TRX-{commission.transactionId}</TableCell>
                      <TableCell className="text-center">{commission.commissionPercentage}%</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(commission.commissionAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <p className="text-sm text-neutral-500">
              <CreditCard className="inline-block h-4 w-4 mr-1" />
              {pendingCommissions ? `${pendingCommissions.length} pending commission${pendingCommissions.length !== 1 ? 's' : ''} (${selectedCommissionIds.length} selected)` : 'No pending commissions'}
            </p>
            <p className="text-sm text-neutral-500">
              <Calendar className="inline-block h-4 w-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      )}

      {/* Commission history display (default tab for both regular users and admin) */}
      {(!isAdmin || activeTab === "history") && (
        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>
              All commissions earned from different services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full flex justify-center py-5">
                <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
              </div>
            ) : !commissions || commissions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-neutral-500">No commissions found.</p>
                <p className="mt-2 text-sm text-neutral-400">
                  Process services to earn commissions.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Services</TabsTrigger>
                  {serviceTypes.map(serviceType => (
                    <TabsTrigger key={serviceType} value={serviceType}>
                      {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="all">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Transaction Amount</TableHead>
                        <TableHead className="text-center">Rate</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((commission: Commission) => (
                        <TableRow key={commission.id}>
                          <TableCell>
                            {commission.createdAt ? 
                              format(new Date(commission.createdAt), 'dd MMM yyyy') : 
                              'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {commission.serviceType.charAt(0).toUpperCase() + 
                                commission.serviceType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>TRX-{commission.transactionId}</TableCell>
                          <TableCell>{formatCurrency(commission.originalAmount)}</TableCell>
                          <TableCell className="text-center">{commission.commissionPercentage}%</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(commission.commissionAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={commission.status === 'credited' ? "default" : "outline"}
                              className={
                                commission.status === 'credited' 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-amber-100 text-amber-800"
                              }
                            >
                              {commission.status === 'credited' ? 'Paid' : 'Pending'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {serviceTypes.map(serviceType => (
                  <TabsContent key={serviceType} value={serviceType}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Transaction Amount</TableHead>
                          <TableHead className="text-center">Rate</TableHead>
                          <TableHead className="text-right">Commission</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceGroups[serviceType].map((commission: Commission) => (
                          <TableRow key={commission.id}>
                            <TableCell>
                              {commission.createdAt ? 
                                format(new Date(commission.createdAt), 'dd MMM yyyy') : 
                                'N/A'}
                            </TableCell>
                            <TableCell>TRX-{commission.transactionId}</TableCell>
                            <TableCell>{formatCurrency(commission.originalAmount)}</TableCell>
                            <TableCell className="text-center">{commission.commissionPercentage}%</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(commission.commissionAmount)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={commission.status === 'credited' ? "default" : "outline"}
                                className={
                                  commission.status === 'credited' 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-amber-100 text-amber-800"
                                }
                              >
                                {commission.status === 'credited' ? 'Paid' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <p className="text-sm text-neutral-500">
              <CreditCard className="inline-block h-4 w-4 mr-1" />
              {commissions ? `Showing ${commissions.length} commission entries` : 'No commissions found'}
            </p>
            <p className="text-sm text-neutral-500">
              <Calendar className="inline-block h-4 w-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      )}
      
      {/* Dialog for adding/editing commission configurations */}
      <Dialog open={openConfigDialog} onOpenChange={setOpenConfigDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedConfig ? "Edit Commission Configuration" : "Add Commission Configuration"}
            </DialogTitle>
            <DialogDescription>
              Configure commission percentages for service providers in the hierarchy
            </DialogDescription>
          </DialogHeader>
          
          <Form {...configForm}>
            <form onSubmit={configForm.handleSubmit(handleSubmitConfig)} className="space-y-4">
              <FormField
                control={configForm.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={Boolean(selectedConfig)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="recharge">Recharge</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="bus">Bus Booking</SelectItem>
                        <SelectItem value="flight">Flight Booking</SelectItem>
                        <SelectItem value="hotel">Hotel Booking</SelectItem>
                        <SelectItem value="taxi">Taxi</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of service this commission structure applies to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={configForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Provider name (leave empty for all providers)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Specific provider this configuration applies to (leave empty for all)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={configForm.control}
                  name="adminPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          max="10"
                          step="0.1"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={configForm.control}
                  name="branchManagerPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Manager %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          max="10"
                          step="0.1"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={configForm.control}
                  name="talukManagerPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taluk Manager %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          max="10"
                          step="0.1"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={configForm.control}
                  name="serviceAgentPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Agent %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          max="15"
                          step="0.1"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={configForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or disable this commission configuration
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setOpenConfigDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={configMutation.isPending}>
                  {configMutation.isPending ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    selectedConfig ? "Update" : "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}