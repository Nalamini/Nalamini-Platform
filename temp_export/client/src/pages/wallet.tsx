import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowUpRight, ArrowDownLeft, Clock, Plus, IndianRupee, CreditCard } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  serviceType: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  key?: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [testAmount, setTestAmount] = useState<number>(500);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  // Get wallet data
  const { data: walletData, isLoading, error } = useQuery<WalletData>({
    queryKey: ["/api/wallet"],
    staleTime: 30000, // 30 seconds
  });

  // Create Razorpay order
  const createOrderMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/wallet/recharge", { amount });
      return res.json();
    },
    onSuccess: (data: OrderData) => {
      setCurrentOrder(data);
      initializePayment(data);
    },
    onError: (error) => {
      toast({
        title: "Failed to create order",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  });

  // Verify payment
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const res = await apiRequest("POST", "/api/wallet/verify-payment", paymentData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment successful",
        description: "Your wallet has been recharged",
      });
      setPaymentInProgress(false);
      setCurrentOrder(null);
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
    onError: (error) => {
      toast({
        title: "Payment verification failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      setPaymentInProgress(false);
    }
  });
  
  // Add test funds (for testing and demo)
  const addTestFundsMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/wallet/add-test-funds", { amount });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Funds added successfully",
        description: `₹${data.balance.toFixed(2)} is your new wallet balance`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add funds",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  });

  // Initialize Razorpay payment
  const initializePayment = (orderData: OrderData) => {
    if (!orderData.key) {
      toast({
        title: "Payment Error",
        description: "API key not available. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setPaymentInProgress(true);

    // Make sure Razorpay is loaded
    if ((window as any).Razorpay) {
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TN Services",
        description: "Wallet Recharge",
        order_id: orderData.orderId,
        handler: function (response: any) {
          verifyPaymentMutation.mutate({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: "TN User",
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: function() {
            setPaymentInProgress(false);
          }
        }
      };

      try {
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } catch (err) {
        console.error("Razorpay error:", err);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        setPaymentInProgress(false);
      }
    } else {
      // Razorpay library not loaded
      toast({
        title: "Payment Error",
        description: "Payment gateway not available. Please try again later.",
        variant: "destructive",
      });
      setPaymentInProgress(false);
    }
  };

  // Handle recharge
  const handleRecharge = () => {
    if (rechargeAmount < 100) {
      toast({
        title: "Invalid amount",
        description: "Minimum recharge amount is ₹100",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(rechargeAmount);
  };
  
  // Handle adding test funds
  const handleAddTestFunds = () => {
    if (testAmount <= 0 || testAmount > 10000) {
      toast({
        title: "Invalid amount",
        description: "Amount must be between 1 and 10,000",
        variant: "destructive",
      });
      return;
    }
    addTestFundsMutation.mutate(testAmount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load wallet data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            <Button 
              className="mt-4" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/wallet"] })}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and view transactions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>Current available balance in your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">₹{walletData?.balance.toFixed(2)}</p>
                </div>
                
                <div className="flex gap-2">
                  {/* Add Test Funds Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        <IndianRupee className="mr-2 h-4 w-4" />
                        Add Test Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Test Funds</DialogTitle>
                        <DialogDescription>
                          Quickly add funds to your wallet for testing purposes
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="test-amount">Amount (₹)</Label>
                          <Input
                            id="test-amount"
                            type="number"
                            min={1}
                            max={10000}
                            value={testAmount}
                            onChange={(e) => setTestAmount(Number(e.target.value))}
                            placeholder="Enter amount"
                          />
                          <p className="text-sm text-muted-foreground">Amount must be between ₹1 and ₹10,000</p>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-between">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button 
                          type="button" 
                          onClick={handleAddTestFunds}
                          disabled={addTestFundsMutation.isPending}
                          variant="default"
                        >
                          {addTestFundsMutation.isPending ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" /> 
                              Add Funds
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Regular Razorpay Payment Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Money
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Money to Wallet</DialogTitle>
                        <DialogDescription>
                          Enter the amount you want to add to your wallet
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount (₹)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min={100}
                            value={rechargeAmount}
                            onChange={(e) => setRechargeAmount(Number(e.target.value))}
                            placeholder="Enter amount"
                          />
                          <p className="text-sm text-muted-foreground">Minimum amount: ₹100</p>
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-between">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button 
                          type="button" 
                          onClick={handleRecharge}
                          disabled={createOrderMutation.isPending || paymentInProgress}
                        >
                          {(createOrderMutation.isPending || paymentInProgress) ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                          ) : (
                            'Proceed to Payment'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {walletData?.transactions && walletData.transactions.length > 0 ? (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="credit">Credits</TabsTrigger>
                    <TabsTrigger value="debit">Debits</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {walletData.transactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                    {walletData.transactions.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No transactions found</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="credit" className="space-y-4">
                    {walletData.transactions
                      .filter((t) => t.type === "credit")
                      .map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    {walletData.transactions.filter((t) => t.type === "credit").length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No credit transactions found</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="debit" className="space-y-4">
                    {walletData.transactions
                      .filter((t) => t.type === "debit")
                      .map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    {walletData.transactions.filter((t) => t.type === "debit").length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No debit transactions found</p>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No transactions available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
          {transaction.type === "credit" ? (
            <ArrowUpRight className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowDownLeft className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{transaction.serviceType}</span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" /> 
              {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
          {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}