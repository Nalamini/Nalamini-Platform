import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Delivery } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Truck,
  Package,
  MapPin,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clock,
  FileText,
  Rocket,
  Check,
  Banknote,
  Boxes,
} from "lucide-react";

// Schema for delivery
const deliverySchema = z.object({
  pickupAddress: z.string().min(1, "Pickup address is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  packageDetails: z.string().min(1, "Package details are required"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
});

// Utility function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Utility function to get status icon
function getStatusIcon(status: string) {
  switch(status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "picked_up":
      return <Package className="h-4 w-4" />;
    case "in_transit":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <Check className="h-4 w-4" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

// Utility function to get status color
function getStatusColor(status: string) {
  switch(status) {
    case "pending":
      return "bg-yellow-100 text-yellow-600";
    case "picked_up":
      return "bg-blue-100 text-blue-600";
    case "in_transit":
      return "bg-purple-100 text-purple-600";
    case "delivered":
      return "bg-green-100 text-green-600";
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-yellow-100 text-yellow-600";
  }
}

type DeliveryFormValues = z.infer<typeof deliverySchema>;

export default function DeliveryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deliveryType, setDeliveryType] = useState("standard");
  
  // Query to fetch delivery history
  const { data: deliveries, isLoading: isLoadingHistory } = useQuery<Delivery[]>({
    queryKey: ["/api/delivery"],
    enabled: !!user,
  });

  // Form for delivery
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      packageDetails: "",
      amount: "",
    },
  });

  // Popular cities in Tamil Nadu
  const popularCities = [
    "Chennai", "Coimbatore", "Madurai", "Trichy", 
    "Salem", "Tirunelveli", "Erode", "Vellore"
  ];

  // Calculate delivery cost
  const calculateDeliveryCost = () => {
    const pickupAddress = form.getValues("pickupAddress");
    const deliveryAddress = form.getValues("deliveryAddress");
    
    if (pickupAddress && deliveryAddress) {
      let baseCost = 80;
      
      // Add cost based on delivery type
      switch(deliveryType) {
        case "express":
          baseCost += 60;
          break;
        case "premium":
          baseCost += 120;
          break;
      }
      
      // Simulating distance-based pricing
      const randomDistance = Math.floor(Math.random() * 20) + 5; // 5-25 km
      const distanceCost = randomDistance * 5; // ₹5 per km
      
      const totalCost = baseCost + distanceCost;
      form.setValue("amount", totalCost.toString());
    }
  };

  // Mutation for delivery
  const deliveryMutation = useMutation({
    mutationFn: async (data: DeliveryFormValues) => {
      // Format the data
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        status: "pending"
      };
      
      const res = await apiRequest("POST", "/api/delivery", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Delivery Request Successful",
        description: `Your package delivery request has been confirmed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/delivery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      form.reset({
        pickupAddress: "",
        deliveryAddress: "",
        packageDetails: "",
        amount: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delivery Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: DeliveryFormValues) {
    deliveryMutation.mutate(values);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Delivery Management</h2>
        <p className="mt-1 text-sm text-neutral-500">Manage package deliveries across Tamil Nadu at affordable rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Delivery Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Schedule a Delivery</CardTitle>
              <CardDescription>Provide details for your package delivery</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Delivery type selection */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    deliveryType === "standard" ? "border-primary bg-primary/5" : "border-neutral-200"
                  }`}
                  onClick={() => setDeliveryType("standard")}
                >
                  <div className="flex flex-col items-center text-center">
                    <Truck className={`h-6 w-6 mb-2 ${deliveryType === "standard" ? "text-primary" : "text-neutral-500"}`} />
                    <h3 className={`text-sm font-medium ${deliveryType === "standard" ? "text-primary" : "text-neutral-700"}`}>Standard</h3>
                    <p className="text-xs text-neutral-500 mt-1">24-48 hours</p>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    deliveryType === "express" ? "border-primary bg-primary/5" : "border-neutral-200"
                  }`}
                  onClick={() => setDeliveryType("express")}
                >
                  <div className="flex flex-col items-center text-center">
                    <Rocket className={`h-6 w-6 mb-2 ${deliveryType === "express" ? "text-primary" : "text-neutral-500"}`} />
                    <h3 className={`text-sm font-medium ${deliveryType === "express" ? "text-primary" : "text-neutral-700"}`}>Express</h3>
                    <p className="text-xs text-neutral-500 mt-1">12-24 hours</p>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer ${
                    deliveryType === "premium" ? "border-primary bg-primary/5" : "border-neutral-200"
                  }`}
                  onClick={() => setDeliveryType("premium")}
                >
                  <div className="flex flex-col items-center text-center">
                    <Boxes className={`h-6 w-6 mb-2 ${deliveryType === "premium" ? "text-primary" : "text-neutral-500"}`} />
                    <h3 className={`text-sm font-medium ${deliveryType === "premium" ? "text-primary" : "text-neutral-700"}`}>Premium</h3>
                    <p className="text-xs text-neutral-500 mt-1">6-12 hours</p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Pickup Address
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Enter complete pickup address"
                              className="resize-none min-h-[100px]"
                              onChange={(e) => {
                                field.onChange(e);
                                if (form.getValues("deliveryAddress")) {
                                  calculateDeliveryCost();
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            Delivery Address
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Enter complete delivery address"
                              className="resize-none min-h-[100px]"
                              onChange={(e) => {
                                field.onChange(e);
                                if (form.getValues("pickupAddress")) {
                                  calculateDeliveryCost();
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="packageDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Package Details
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            placeholder="Describe the package contents, dimensions, and weight"
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Banknote className="h-4 w-4" />
                          Delivery Charges
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled
                            className="bg-neutral-50"
                          />
                        </FormControl>
                        <FormMessage />
                        {!field.value && form.getValues("pickupAddress") && form.getValues("deliveryAddress") && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={calculateDeliveryCost}
                          >
                            Calculate Charges
                          </Button>
                        )}
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={deliveryMutation.isPending || !form.getValues("amount")}
                  >
                    {deliveryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Schedule Delivery
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Delivery History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Deliveries</CardTitle>
              <CardDescription>Track your package delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : deliveries && deliveries.length > 0 ? (
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-neutral-200">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${getStatusColor(delivery.status)}`}>
                              {getStatusIcon(delivery.status)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-neutral-900">
                                Delivery #{delivery.id.toString().padStart(5, '0')}
                              </p>
                              <p className="text-xs text-neutral-500">{formatDate(delivery.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">₹{delivery.amount}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(delivery.status)}`}>
                              {delivery.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-neutral-50 text-xs">
                        <div className="flex items-start mb-2">
                          <MapPin className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-neutral-700">Pickup Address:</p>
                            <p className="text-neutral-600">{delivery.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start mb-2">
                          <MapPin className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-neutral-700">Delivery Address:</p>
                            <p className="text-neutral-600">{delivery.deliveryAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 text-neutral-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium text-neutral-700">Package Details:</p>
                            <p className="text-neutral-600">{delivery.packageDetails}</p>
                          </div>
                        </div>
                      </div>
                      {(delivery.status === "picked_up" || delivery.status === "in_transit") && (
                        <div className="p-3 bg-white border-t border-neutral-200 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-xs"
                          >
                            Track Package
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-neutral-500">No deliveries found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your delivery history will appear here
                  </p>
                </div>
              )}
            </CardContent>
            {deliveries && deliveries.length > 3 && (
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary">
                  View All Deliveries
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
