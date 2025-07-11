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
const rechargeSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number must not exceed 10 digits"),
  provider: z.string().min(1, "Please select a provider"),
  amount: z.string().min(1, "Amount is required"),
  serviceType: z.string().default("mobile"),
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

type RechargeFormValues = z.infer<typeof rechargeSchema>;

export default function MobileRechargePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'form' | 'plans'>('form');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize form
  const form = useForm<RechargeFormValues>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      mobileNumber: "",
      provider: "",
      amount: "",
      serviceType: "mobile",
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
    queryKey: [`/api/recharge/plans/${selectedProvider}`, "mobile"],
    queryFn: ({ queryKey }) => {
      return fetch(`${queryKey[0]}?serviceType=mobile`).then(res => {
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
    mutationFn: async (data: RechargeFormValues) => {
      const res = await apiRequest("POST", "/api/recharge", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Recharge Successful",
        description: `Your mobile recharge for ₹${data.amount} was successful.`,
      });
      
      // Reset the form and refetch the history
      form.reset({
        mobileNumber: "",
        amount: "",
        provider: "",
        serviceType: "mobile",
      });
      
      // Invalidate the history query to refetch it
      queryClient.invalidateQueries({ queryKey: ["/api/recharge/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Recharge Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: RechargeFormValues) {
    // Validate mobile number
    if (!/^[6-9]\d{9}$/.test(values.mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit the recharge - server will convert amount to number
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
        <h1 className="text-2xl font-bold tracking-tight">Mobile Recharge</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Recharge Form */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Mobile Recharge</CardTitle>
              <CardDescription>Recharge your mobile phone with ease</CardDescription>
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
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter 10-digit mobile number" {...field} maxLength={10} />
                          </FormControl>
                          <FormDescription>
                            Enter your mobile number without any prefix
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
                          <FormLabel>Operator</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mobile operator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Jio">Reliance Jio</SelectItem>
                              <SelectItem value="Airtel">Airtel</SelectItem>
                              <SelectItem value="Vi">Vodafone Idea</SelectItem>
                              <SelectItem value="BSNL">BSNL</SelectItem>
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
                                placeholder="Enter recharge amount" 
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
                                    title: "Please select an operator first",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Browse Plans
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
                      {selectedProvider} Mobile Plans
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleViewMode}
                    >
                      Back to Recharge
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
                      serviceType="mobile"
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
              <CardTitle>Recharge History</CardTitle>
              <CardDescription>Your recent mobile recharges</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !rechargeHistory || rechargeHistory.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recharge history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rechargeHistory
                    .filter(recharge => recharge.serviceType === 'mobile')
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