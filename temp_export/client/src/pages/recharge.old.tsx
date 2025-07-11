import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Recharge } from "@/types";
import PlanDisplay from "@/components/recharge/PlanDisplay";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Smartphone,
  Tv,
  Lightbulb,
  PlugZap,
  PhoneCall,
  Check,
  Loader2,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Tag,
  Calendar,
  LifeBuoy,
  Search,
  IndianRupee,
  X,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Schema for recharge form, supporting all types of bill payments
const rechargeSchema = z.object({
  mobileNumber: z.string()
    // We validate based on the active tab/service type in the onSubmit function
    .min(1, "This field is required"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  provider: z.string().min(1, "Provider is required"),
  serviceType: z.string().default("mobile"),
});

// Utility function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Plan interface
interface Plan {
  id: number;
  category: string;
  amount: number;
  validity: string;
  description: string;
}

// Category interface
interface PlanCategory {
  id: string;
  name: string;
}

// API response interface
interface PlansResponse {
  provider: string;
  categories: {
    data: PlanCategory[];
  };
  plans: Plan[];
  message?: string;
}

// Form values type
type RechargeFormValues = z.infer<typeof rechargeSchema>;

export default function RechargePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("mobile");
  const [viewMode, setViewMode] = useState<'form' | 'plans'>('form');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  // Define the service categories
  const serviceCategories = [
    { id: "mobile", name: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
    { id: "dth", name: "DTH", icon: <Tv className="h-4 w-4" /> },
    { id: "electricity", name: "Electricity", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "broadband", name: "Broadband", icon: <PlugZap className="h-4 w-4" /> },
    { id: "landline", name: "Landline", icon: <PhoneCall className="h-4 w-4" /> },
  ];

  // Setup form
  const form = useForm<RechargeFormValues>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      mobileNumber: "",
      amount: "",
      provider: "",
      serviceType: activeTab,
    },
  });

  // Watch for provider changes
  const watchedProvider = form.watch("provider");

  // Update selected provider when form value changes
  useEffect(() => {
    if (watchedProvider) {
      setSelectedProvider(watchedProvider);
    }
  }, [watchedProvider]);

  // Update service type when tab changes
  useEffect(() => {
    form.setValue("serviceType", activeTab);
  }, [activeTab, form]);

  // Reset selected plan when viewMode or provider changes
  useEffect(() => {
    setSelectedPlan(null);
  }, [viewMode, selectedProvider]);

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
    queryKey: [`/api/recharge/plans/${selectedProvider}`, activeTab],
    queryFn: ({ queryKey }) => {
      return fetch(`${queryKey[0]}?serviceType=${activeTab}`).then(res => {
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
        description: `Your ${data.serviceType} recharge for ₹${data.amount} was successful.`,
      });
      
      // Reset the form and refetch the history
      form.reset({
        mobileNumber: "",
        amount: "",
        provider: "",
        serviceType: activeTab,
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
    // Validate mobile number based on service type
    if (values.serviceType === "mobile") {
      if (!/^[6-9]\d{9}$/.test(values.mobileNumber)) {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid 10-digit mobile number.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Submit the recharge
    rechargeMutation.mutate(values);
  }

  // Toggle view mode between form and plans
  function toggleViewMode() {
    setViewMode(viewMode === 'form' ? 'plans' : 'form');
  }

  return (
    <div className="container max-w-6xl py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Recharge & Pay Bills</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Recharge Form */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Recharge</CardTitle>
              <CardDescription>Recharge mobile, DTH, or pay utility bills</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="mobile" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 flex w-full overflow-x-auto justify-start">
                  {serviceCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex items-center gap-1.5"
                    >
                      {category.icon}
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Mobile Recharge Content */}
                <TabsContent value="mobile">
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
                </TabsContent>

                {/* DTH Recharge Content */}
                <TabsContent value="dth">
                  {viewMode === 'form' ? (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer ID / Subscriber ID</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your DTH subscriber ID" 
                                {...field} 
                                maxLength={12}
                              />
                            </FormControl>
                            <FormDescription>
                              You can find your Subscriber ID on your DTH bill or on-screen by pressing the 'Info' button on your remote.
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
                            <FormLabel>DTH Operator</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select DTH operator" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Tata Play">Tata Play</SelectItem>
                                <SelectItem value="Airtel Digital TV">Airtel Digital TV</SelectItem>
                                <SelectItem value="Dish TV">Dish TV</SelectItem>
                                <SelectItem value="Sun Direct">Sun Direct</SelectItem>
                                <SelectItem value="d2h">d2h</SelectItem>
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
                                    // Refetch plans will be triggered by the effect hook
                                  } else {
                                    toast({
                                      title: "Please select a DTH operator first",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Browse Plans
                              </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="text-xs px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                                onClick={() => form.setValue("amount", "199")}
                              >
                                ₹199 - 1 Month
                              </button>
                              <button
                                type="button"
                                className="text-xs px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                                onClick={() => form.setValue("amount", "299")}
                              >
                                ₹299 - 1 Month HD
                              </button>
                              <button
                                type="button"
                                className="text-xs px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                                onClick={() => form.setValue("amount", "499")}
                              >
                                ₹499 - 1 Month Premium
                              </button>
                              <button
                                type="button"
                                className="text-xs px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-50"
                                onClick={() => form.setValue("amount", "999")}
                              >
                                ₹999 - 3 Months
                              </button>
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
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{selectedProvider} DTH Packs</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode('form')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                      </div>
                      
                      {isLoadingPlans ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isPlansError ? (
                        <div className="text-center py-12">
                          <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                          <p className="text-neutral-600 mb-1">Failed to load plans</p>
                          <p className="text-sm text-neutral-500 mb-4">
                            There was an error loading the plans. Please try again.
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => refetchPlans()}
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      ) : (
                        <PlanDisplay 
                          plansData={plansData}
                          serviceType="dth"
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
                </TabsContent>

                {/* Electricity Bill Payment */}
                <TabsContent value="electricity">
                  {viewMode === 'form' ? (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consumer Number / Account ID</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your electricity consumer number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Consumer number can be found on your electricity bill
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
                                <SelectItem value="APTRANSCO">Andhra Pradesh Power Distribution</SelectItem>
                                <SelectItem value="TSSPDCL">Telangana State Power Distribution</SelectItem>
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
                            <FormLabel className="flex justify-between">
                              <span>Amount</span>
                              {selectedProvider && (
                                <button
                                  type="button"
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
                                  className="text-primary text-xs font-medium"
                                >
                                  Browse Tariffs
                                </button>
                              )}
                            </FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  placeholder="Enter bill amount" 
                                  {...field} 
                                  type="number"
                                  min="1"
                                />
                              </FormControl>
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
                            Pay Bill
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{selectedProvider} Tariffs</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode('form')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                      </div>
                      
                      {isLoadingPlans ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : isPlansError ? (
                        <div className="text-center py-12">
                          <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                          <p className="text-neutral-600 mb-1">Failed to load tariffs</p>
                          <p className="text-sm text-neutral-500 mb-4">
                            There was an error loading the electricity tariffs. Please try again.
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => refetchPlans()}
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
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
                </TabsContent>

                {/* Other service tabs (placeholder for now) */}
                {serviceCategories.filter(c => !["mobile", "dth", "electricity"].includes(c.id)).map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="text-center py-12">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{category.name} Bill Payment</h3>
                      <p className="text-neutral-500 mb-4">
                        This service will be available soon. Please check back later.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("mobile")}
                      >
                        Back to Mobile Recharge
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Transactions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent recharges and bill payments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rechargeHistory && rechargeHistory.length > 0 ? (
                <div className="space-y-4">
                  {rechargeHistory.map((recharge) => (
                    <div key={recharge.id} className="flex items-start border-b border-neutral-200 pb-4 last:border-0">
                      <div className={`p-2 rounded-full ${
                        recharge.status === "completed" 
                          ? "bg-green-100 text-green-600" 
                          : recharge.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {recharge.status === "completed" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-neutral-900">
                            {recharge.provider} Recharge
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            ₹{recharge.amount}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {recharge.mobileNumber}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(recharge.createdAt)}
                        </p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            recharge.status === "completed" 
                              ? "bg-green-100 text-green-600" 
                              : recharge.status === "failed"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {recharge.status.charAt(0).toUpperCase() + recharge.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-neutral-500">No transactions found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your recharge history will appear here
                  </p>
                </div>
              )}
            </CardContent>
            {rechargeHistory && rechargeHistory.length > 5 && (
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary">
                  View All Transactions
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}