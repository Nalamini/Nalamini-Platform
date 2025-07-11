import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PlanDisplay from "@/components/recharge/PlanDisplay";

// Form schema
const electricityBillSchema = z.object({
  mobileNumber: z
    .string()
    .min(5, "Consumer number must be at least 5 characters")
    .max(20, "Consumer number must not exceed 20 characters"),
  provider: z.string().min(1, "Please select a provider"),
  amount: z.string().min(1, "Amount is required"),
  serviceType: z.string().default("electricity"),
});

// Types
interface Recharge {
  id: number;
  userId: number;
  mobileNumber: string;
  amount: number;
  provider: string;
  status: string;
  serviceType: string;
  createdAt: string;
  completedAt?: string;
}

interface Plan {
  id: number;
  category: string;
  amount: number;
  validity: string;
  description: string;
}

interface PlanCategory {
  id: string;
  name: string;
}

interface PlansResponse {
  provider: string;
  categories: {
    data: PlanCategory[];
  };
  plans: Plan[];
  message?: string;
}

type ElectricityBillFormValues = z.infer<typeof electricityBillSchema>;

export default function ElectricityBillPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'form' | 'plans'>('form');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize form
  const form = useForm<ElectricityBillFormValues>({
    resolver: zodResolver(electricityBillSchema),
    defaultValues: {
      mobileNumber: "",
      provider: "",
      amount: "",
      serviceType: "electricity",
    },
  });

  // Get the currently selected provider
  const selectedProvider = form.watch("provider");

  // Effect to update form values when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      form.setValue("amount", selectedPlan.amount.toString());
    }
  }, [selectedPlan, form]);

  // Reset search term and selected category when viewMode changes
  useEffect(() => {
    setSearchTerm("");
    setSelectedCategory(null);
  }, [viewMode]);

  // Query for provider plans
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useQuery<PlansResponse>({
    queryKey: [`/api/recharge/plans/${selectedProvider}`, "electricity"],
    queryFn: ({ queryKey }) => {
      return fetch(`${queryKey[0]}?serviceType=electricity`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch plans');
        return res.json();
      });
    },
    enabled: viewMode === 'plans' && !!selectedProvider,
  });

  // Query for recharge history
  const {
    data: rechargeHistory,
    isLoading: isLoadingHistory,
  } = useQuery<Recharge[]>({
    queryKey: ["/api/recharge/history"],
    queryFn: () => {
      return fetch("/api/recharge/history").then(res => {
        if (!res.ok) throw new Error('Failed to fetch recharge history');
        return res.json();
      });
    },
  });

  // Recharge mutation
  const rechargeMutation = useMutation({
    mutationFn: async (data: ElectricityBillFormValues) => {
      const res = await apiRequest("POST", "/api/recharge", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Electricity Bill Payment Successful",
        description: `Your electricity bill payment of ₹${data.amount} was successful.`,
      });
      
      // Reset the form and refetch the history
      form.reset({
        mobileNumber: "",
        amount: "",
        provider: "",
        serviceType: "electricity",
      });
      
      // Invalidate the history query to refetch it
      queryClient.invalidateQueries({ queryKey: ["/api/recharge/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Electricity Bill Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: ElectricityBillFormValues) {
    // Submit the recharge
    rechargeMutation.mutate(values);
  }

  // Toggle view mode between form and plans
  function toggleViewMode() {
    setViewMode(viewMode === 'form' ? 'plans' : 'form');
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/recharge")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Electricity Bill Payment</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Recharge Form */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Electricity Bill Payment</CardTitle>
              <CardDescription>Pay your electricity bills with ease</CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === 'form' ? (
                <Form {...form}>
                  <form className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumer Number / Service Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your consumer number" 
                              {...field} 
                              maxLength={20}
                            />
                          </FormControl>
                          <FormDescription>
                            You can find your consumer number on your electricity bill
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
                          <FormLabel>Electricity Board</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select electricity provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TNEB">Tamil Nadu Electricity Board (TNEB)</SelectItem>
                              <SelectItem value="BESCOM">Bangalore Electricity Supply (BESCOM)</SelectItem>
                              <SelectItem value="KSEB">Kerala State Electricity Board (KSEB)</SelectItem>
                              <SelectItem value="APTRANSCO">Andhra Pradesh Transmission Corp</SelectItem>
                              <SelectItem value="TSSPDCL">Telangana State Southern Power Distribution</SelectItem>
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
                          <FormLabel>Amount</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="Enter bill amount" 
                                {...field} 
                                type="number"
                                min="1"
                              />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                if (form.getValues("provider")) {
                                  setViewMode('plans');
                                } else {
                                  toast({
                                    title: "Please select an electricity provider first",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              View Plans
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={rechargeMutation.isPending}
                    >
                      {rechargeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Pay
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {selectedProvider} Payment Plans
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleViewMode}
                    >
                      Back to Payment
                    </Button>
                  </div>

                  {isLoadingPlans ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : isPlansError ? (
                    <div className="py-8 text-center">
                      <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
                      <p>Failed to load plans. Please try again.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetchPlans()}
                        className="mt-4"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <PlanDisplay 
                      plansData={plansData}
                      serviceType="electricity"
                      selectedPlan={selectedPlan}
                      setSelectedPlan={setSelectedPlan}
                      setViewMode={setViewMode}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Recharge History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent electricity bill payments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !rechargeHistory || rechargeHistory.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No payment history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rechargeHistory
                    .filter(recharge => recharge.serviceType === 'electricity')
                    .slice(0, 5)
                    .map((recharge) => (
                      <div 
                        key={recharge.id} 
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{recharge.mobileNumber}</p>
                          <p className="text-xs text-muted-foreground">{recharge.provider} • {new Date(recharge.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{recharge.amount}</p>
                          <p className={`text-xs ${
                            recharge.status === 'completed' 
                              ? 'text-green-500' 
                              : recharge.status === 'failed' 
                                ? 'text-red-500' 
                                : 'text-yellow-500'
                          }`}>
                            {recharge.status.charAt(0).toUpperCase() + recharge.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}