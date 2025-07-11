import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, ChevronRight, Calendar, Receipt, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Provider {
  id: string;
  name: string;
  type: string;
  logo: string;
  minAmount: number;
  maxAmount: number;
  states?: string[];
}

interface BillDetails {
  billId: string;
  consumerNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  billDate: string;
  providerName: string;
  providerType: string;
  billPeriod?: string;
  extraDetails?: Record<string, string>;
}

function ProviderSelector({ 
  selectedType, 
  onSelectType, 
  onSelectProvider 
}: { 
  selectedType: string; 
  onSelectType: (type: string) => void; 
  onSelectProvider: (provider: Provider) => void;
}) {
  const { toast } = useToast();
  
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['/api/utility/providers', selectedType],
    queryFn: async () => {
      const queryParams = selectedType ? `?type=${selectedType}` : '';
      const response = await apiRequest('GET', `/api/utility/providers${queryParams}`);
      return response.json();
    },
  });

  const utilityTypes = [
    { id: 'electricity', name: 'Electricity' },
    { id: 'water', name: 'Water' },
    { id: 'gas', name: 'Gas' },
    { id: 'dth', name: 'DTH' },
    { id: 'broadband', name: 'Broadband' },
    { id: 'landline', name: 'Landline' }
  ];

  if (error) {
    toast({
      title: "Error fetching providers",
      description: "Failed to load utility providers. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Utility Bills</CardTitle>
        <CardDescription>
          Select a service provider to fetch and pay bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="utilityType">Select Utility Type</Label>
            <Select value={selectedType} onValueChange={onSelectType}>
              <SelectTrigger id="utilityType">
                <SelectValue placeholder="Select utility type" />
              </SelectTrigger>
              <SelectContent>
                {utilityTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : providers && providers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {providers.map((provider: Provider) => (
                <Card 
                  key={provider.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectProvider(provider)}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                    <div className="h-16 w-16 flex items-center justify-center overflow-hidden rounded-full bg-neutral-100">
                      <img 
                        src={provider.logo} 
                        alt={provider.name}
                        className="max-h-12 max-w-12 object-contain"
                        onError={(e) => {
                          // If image fails to load, show the first letter of provider name
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerText = provider.name.charAt(0);
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-center">{provider.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              {selectedType 
                ? "No providers available for the selected utility type" 
                : "Select a utility type to view providers"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BillFetcher({ 
  provider, 
  onBack, 
  onBillFetched 
}: { 
  provider: Provider; 
  onBack: () => void; 
  onBillFetched: (bill: BillDetails) => void;
}) {
  const [consumerNumber, setConsumerNumber] = useState("");
  const { toast } = useToast();
  
  const fetchBillMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        'GET', 
        `/api/utility/fetch-bill?providerId=${provider.id}&consumerNumber=${consumerNumber}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch bill");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onBillFetched(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error fetching bill",
        description: error.message || "Failed to fetch bill details. Please check the consumer number and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNumber.trim()) {
      toast({
        title: "Consumer number required",
        description: "Please enter a valid consumer/subscriber number",
        variant: "destructive",
      });
      return;
    }
    
    fetchBillMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onBack}
          >
            ←
          </Button>
          <div>
            <CardTitle>Fetch Bill Details</CardTitle>
            <CardDescription>
              Enter your consumer number to fetch bill details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
            <img 
              src={provider.logo} 
              alt={provider.name}
              className="max-h-10 max-w-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerText = provider.name.charAt(0);
              }}
            />
          </div>
          <div>
            <h3 className="font-medium">{provider.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{provider.type}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consumerNumber">Consumer/Subscriber Number</Label>
              <Input
                id="consumerNumber"
                type="text"
                placeholder="Enter your consumer/subscriber number"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                disabled={fetchBillMutation.isPending}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the number exactly as it appears on your bill or subscription details
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={fetchBillMutation.isPending}
            >
              {fetchBillMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Bill"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BillPayment({ 
  bill, 
  onBack, 
  onPaid 
}: { 
  bill: BillDetails; 
  onBack: () => void; 
  onPaid: () => void;
}) {
  const { toast } = useToast();
  
  const payBillMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        'POST', 
        '/api/utility/pay-bill', 
        {
          billId: bill.billId,
          providerId: getProviderIdFromName(bill.providerName, bill.providerType),
          consumerNumber: bill.consumerNumber,
          amount: bill.amount
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      toast({
        title: "Payment Successful",
        description: `Your bill payment of ₹${bill.amount.toFixed(2)} was successful.`,
        variant: "default",
      });
      onPaid();
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper function to construct provider ID from name and type (reverse of what the API does)
  const getProviderIdFromName = (name: string, type: string): string => {
    // This is a simplistic approach - ideally we would have the original provider ID
    const nameSlug = name.toLowerCase().replace(/\s+/g, '');
    return `${type.toLowerCase()}_${nameSlug}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getDueInDays = (dueDateString: string): number => {
    try {
      const dueDate = parseISO(dueDateString);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  };

  const dueInDays = getDueInDays(bill.dueDate);
  const isDueWarning = dueInDays >= 0 && dueInDays <= 5;
  const isOverdue = dueInDays < 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onBack}
          >
            ←
          </Button>
          <div>
            <CardTitle>Bill Details</CardTitle>
            <CardDescription>
              Review and pay your utility bill
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">{bill.providerName}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {bill.providerType} Bill
            </p>
          </div>
          <div className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-primary text-sm font-medium">
              Bill #{bill.billId.substring(bill.billId.length - 6)}
            </span>
          </div>
        </div>
        
        <Separator />
        
        {(isDueWarning || isOverdue) && (
          <Alert variant={isOverdue ? "destructive" : "default"} className={!isOverdue ? "border-yellow-500 bg-yellow-50 text-yellow-900" : ""}>
            <AlertCircle className={`h-4 w-4 ${!isOverdue ? "text-yellow-500" : ""}`} />
            <AlertTitle>
              {isOverdue ? "Payment Overdue" : "Due Soon"}
            </AlertTitle>
            <AlertDescription>
              {isOverdue 
                ? `This bill is overdue by ${Math.abs(dueInDays)} days.` 
                : `This bill is due in ${dueInDays} days.`
              }
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Customer Name
            </p>
            <p>{bill.customerName}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Consumer Number
            </p>
            <p>{bill.consumerNumber}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bill Date
            </p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <p>{formatDate(bill.billDate)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Due Date
            </p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <p>{formatDate(bill.dueDate)}</p>
            </div>
          </div>
          
          {bill.billPeriod && (
            <div className="space-y-2 col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Billing Period
              </p>
              <p>{bill.billPeriod}</p>
            </div>
          )}
        </div>
        
        {bill.extraDetails && Object.keys(bill.extraDetails).length > 0 && (
          <>
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-3">Additional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(bill.extraDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Bill Amount</span>
            <span className="font-semibold">₹ {bill.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Convenience Fee</span>
            <span className="font-semibold">₹ 0.00</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount</span>
            <span className="text-lg font-bold">₹ {bill.amount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          className="w-full"
          onClick={() => payBillMutation.mutate()}
          disabled={payBillMutation.isPending}
        >
          {payBillMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              Pay ₹ {bill.amount.toFixed(2)}
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          By proceeding with the payment, you agree to the terms and conditions.
          <br />
          Payment will be deducted from your wallet balance.
        </p>
      </CardFooter>
    </Card>
  );
}

function PaymentSuccess() {
  return (
    <Card>
      <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Your bill payment has been processed successfully.
        </p>
        <Button variant="outline" className="mb-4" asChild>
          <a href="/wallet">
            Check Wallet <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function UtilityPage() {
  const [step, setStep] = useState<'select-provider' | 'fetch-bill' | 'payment' | 'success'>('select-provider');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  
  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setStep('fetch-bill');
  };
  
  const handleBillFetched = (bill: BillDetails) => {
    setBillDetails(bill);
    setStep('payment');
  };
  
  const handlePaymentSuccess = () => {
    setStep('success');
  };
  
  const handleBackToProviders = () => {
    setSelectedProvider(null);
    setStep('select-provider');
  };
  
  const handleBackToBillFetch = () => {
    setBillDetails(null);
    setStep('fetch-bill');
  };
  
  const handleStartOver = () => {
    setSelectedProvider(null);
    setBillDetails(null);
    setSelectedType('');
    setStep('select-provider');
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Utility Bill Payments</h1>
        <p className="text-muted-foreground">
          Pay your electricity, water, gas, DTH, broadband and landline bills
        </p>
      </div>
      
      <Tabs defaultValue="pay-bills" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="pay-bills">Pay Bills</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pay-bills">
          <div className="space-y-6">
            {step === 'select-provider' && (
              <ProviderSelector 
                selectedType={selectedType}
                onSelectType={setSelectedType}
                onSelectProvider={handleSelectProvider}
              />
            )}
            
            {step === 'fetch-bill' && selectedProvider && (
              <BillFetcher 
                provider={selectedProvider}
                onBack={handleBackToProviders}
                onBillFetched={handleBillFetched}
              />
            )}
            
            {step === 'payment' && billDetails && (
              <BillPayment 
                bill={billDetails}
                onBack={handleBackToBillFetch}
                onPaid={handlePaymentSuccess}
              />
            )}
            
            {step === 'success' && (
              <div className="space-y-6">
                <PaymentSuccess />
                <div className="flex justify-center">
                  <Button variant="outline" onClick={handleStartOver}>
                    Pay Another Bill
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="payment-history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your past utility bill payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  Your payment history will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}