import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Car, 
  Package, 
  Home, 
  ShoppingCart, 
  Smartphone, 
  Recycle, 
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  AlertCircle
} from "lucide-react";

const serviceRequestSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  serviceData: z.object({
    pickup: z.string().optional(),
    dropoff: z.string().optional(),
    packageDetails: z.string().optional(),
    itemName: z.string().optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    district: z.string().optional(),
    taluk: z.string().optional(),
    pincode: z.string().optional(),
  }).optional()
});

type ServiceRequestForm = z.infer<typeof serviceRequestSchema>;

const serviceTypes = [
  { id: "taxi", name: "Taxi Service", icon: Car, color: "bg-blue-500" },
  { id: "delivery", name: "Delivery Service", icon: Package, color: "bg-green-500" },
  { id: "rental", name: "Rental Service", icon: Home, color: "bg-purple-500" },
  { id: "local_products", name: "Local Products", icon: ShoppingCart, color: "bg-orange-500" },
  { id: "grocery", name: "Grocery", icon: ShoppingCart, color: "bg-pink-500" },
  { id: "recharge", name: "Recharge", icon: Smartphone, color: "bg-cyan-500" },
  { id: "recycling", name: "Recycling", icon: Recycle, color: "bg-emerald-500" }
];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  closed: "bg-orange-100 text-orange-800", 
  approved: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800"
};

const statusIcons = {
  new: Clock,
  in_progress: AlertCircle,
  closed: CheckCircle,
  approved: CheckCircle,
  completed: CheckCircle
};

export default function ServiceRequestDashboard() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const form = useForm<ServiceRequestForm>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: "",
      amount: 0,
      paymentMethod: "razorpay",
      serviceData: {}
    }
  });

  // Fetch customer's service requests
  const { data: serviceRequests, isLoading } = useQuery({
    queryKey: ["/api/service-requests/my-requests"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch service request details
  const { data: requestDetails } = useQuery({
    queryKey: ["/api/service-requests", selectedRequestId],
    enabled: !!selectedRequestId
  });

  // Create service request mutation
  const createServiceRequestMutation = useMutation({
    mutationFn: async (data: ServiceRequestForm) => {
      const response = await apiRequest("POST", "/api/service-requests", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Service Request Created",
        description: `Service request ${data.srNumber} has been created successfully.`
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service request",
        variant: "destructive"
      });
    }
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ requestId, paymentData }: { requestId: number, paymentData: any }) => {
      const response = await apiRequest("POST", `/api/service-requests/${requestId}/payment`, paymentData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed and the service request is now in progress."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ServiceRequestForm) => {
    createServiceRequestMutation.mutate(data);
  };

  const handlePayment = async (requestId: number, amount: number) => {
    // Simulate payment process for demo
    // In production, integrate with Razorpay
    const paymentData = {
      paymentId: `pay_${Date.now()}`,
      razorpayPaymentId: `razorpay_payment_${Date.now()}`,
      razorpayOrderId: `order_${Date.now()}`,
      razorpaySignature: "demo_signature"
    };

    processPaymentMutation.mutate({ requestId, paymentData });
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.id === serviceType);
    return service ? service.icon : Wrench;
  };

  const getServiceName = (serviceType: string) => {
    const service = serviceTypes.find(s => s.id === serviceType);
    return service ? service.name : serviceType;
  };

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || Clock;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Service Request Dashboard</h1>
          <p className="text-gray-600">Manage all your service requests in one place</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Service Request</DialogTitle>
              <DialogDescription>
                Choose a service and provide details for your request
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex items-center space-x-2">
                                <service.icon className="h-4 w-4" />
                                <span>{service.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceData.pickup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pickup location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceData.dropoff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination/Delivery Location (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter destination" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceData.packageDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about your service request"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createServiceRequestMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createServiceRequestMutation.isPending ? "Creating..." : "Create Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Request Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {serviceRequests?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {serviceRequests?.filter((r: any) => r.status === "in_progress").length || 0}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {serviceRequests?.filter((r: any) => r.status === "completed").length || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              ₹{serviceRequests?.reduce((sum: number, r: any) => sum + r.amount, 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </CardContent>
        </Card>
      </div>

      {/* Service Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Service Requests</CardTitle>
          <CardDescription>
            Track the status of all your service requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!serviceRequests || serviceRequests.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests yet</h3>
              <p className="text-gray-600 mb-4">Create your first service request to get started</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Request
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((request: any) => {
                const ServiceIcon = getServiceIcon(request.serviceType);
                const StatusIcon = getStatusIcon(request.status);
                
                return (
                  <div 
                    key={request.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ServiceIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {getServiceName(request.serviceType)}
                          </div>
                          <div className="text-sm text-gray-600">
                            SR: {request.srNumber}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">₹{request.amount}</div>
                          <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          {request.paymentStatus === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handlePayment(request.id, request.amount)}
                              disabled={processPaymentMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay Now
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedRequestId(request.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Service Request Details</DialogTitle>
                                <DialogDescription>
                                  {request.srNumber} - {getServiceName(request.serviceType)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {requestDetails && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Badge className={statusColors[requestDetails.status as keyof typeof statusColors]}>
                                        {requestDetails.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Amount</label>
                                      <div>₹{requestDetails.amount}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Payment Status</label>
                                      <div>{requestDetails.paymentStatus}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Created</label>
                                      <div>{new Date(requestDetails.createdAt).toLocaleString()}</div>
                                    </div>
                                  </div>
                                  
                                  {requestDetails.serviceData && (
                                    <div>
                                      <label className="text-sm font-medium">Service Details</label>
                                      <pre className="bg-gray-100 p-3 rounded text-sm">
                                        {JSON.stringify(JSON.parse(requestDetails.serviceData), null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  
                                  {requestDetails.statusHistory && requestDetails.statusHistory.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium">Status History</label>
                                      <div className="space-y-2 mt-2">
                                        {requestDetails.statusHistory.map((update: any, index: number) => (
                                          <div key={index} className="border-l-2 border-blue-200 pl-3">
                                            <div className="text-sm font-medium">
                                              {update.toStatus.replace('_', ' ')}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {new Date(update.createdAt).toLocaleString()}
                                            </div>
                                            {update.reason && (
                                              <div className="text-xs text-gray-600">
                                                Reason: {update.reason}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}