import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

import {
  ArrowUpIcon,
  BanknoteIcon,
  BarChart3Icon,
  CheckIcon,
  IndianRupeeIcon,
  UserRoundIcon,
  WalletIcon,
  RefreshCwIcon,
  SettingsIcon,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommissionStats {
  totalCommissionsEarned: number;
  totalRecharges: number;
  totalBookings: number;
  recentCommissions: any[];
  pendingCommissions: any[];
}

interface WalletBalance {
  testUser: { id: number; username: string; walletBalance: number };
  serviceAgent: { id: number; username: string; walletBalance: number };
  talukManager: { id: number; username: string; walletBalance: number };
  branchManager: { id: number; username: string; walletBalance: number };
  admin: { id: number; username: string; walletBalance: number };
}

export default function CommissionDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [mockTransactionAmount, setMockTransactionAmount] = useState(500);
  const [mockServiceType, setMockServiceType] = useState("recharge");
  const [mockProvider, setMockProvider] = useState("Airtel");
  const [rechargeId, setRechargeId] = useState("");

  const isAdmin = user?.userType === 'admin';

  // Get the commission statistics for the current user
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/commissions/stats"],
    enabled: isAdmin,
  });

  // Get the wallet balances for the entire hierarchy
  const { data: walletBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["/api/commissions/hierarchy-wallet-balances"],
    enabled: isAdmin,
  });

  // Get pending commissions
  const { data: pendingCommissions, isLoading: isLoadingPending } = useQuery({
    queryKey: ["/api/commissions/pending"],
    enabled: isAdmin,
  });
  
  // Get all recharges for admin
  const { data: recharges, isLoading: isLoadingRecharges } = useQuery({
    queryKey: ["/api/recharges/admin"],
    enabled: isAdmin,
  });

  // Create a mock transaction for testing
  const mockTransactionMutation = useMutation({
    mutationFn: async (data: { amount: number; serviceType: string; provider: string }) => {
      const response = await apiRequest(
        "POST", 
        "/api/commissions/mock-transaction",
        data
      );
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mock transaction created",
        description: "Commission distribution has been processed successfully",
      });
      
      // Refresh all commission-related data
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/hierarchy-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating mock transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark commissions as paid
  const markAsPaidMutation = useMutation({
    mutationFn: async (commissionIds: number[]) => {
      const response = await apiRequest(
        "POST", 
        "/api/commissions/mark-as-paid",
        { commissionIds }
      );
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Commissions marked as paid",
        description: "The selected commissions have been marked as paid",
      });
      
      // Refresh all commission-related data
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/hierarchy-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error marking commissions as paid",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Initialize configs mutation
  const initializeConfigsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/commission-configs/initialize");
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Commission configs initialized",
        description: data.message || "Default commission configurations have been set up",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commission-configs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error initializing configs",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Sync wallet balances mutation
  const syncWalletBalancesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/commissions/sync-wallet-balances");
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet balances synchronized",
        description: data.message || "All user wallet balances have been synchronized",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/hierarchy-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error syncing wallet balances",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Manual commission distribution for recharges
  const distributeCommissionMutation = useMutation({
    mutationFn: async () => {
      if (!rechargeId || isNaN(parseInt(rechargeId))) {
        throw new Error("Please enter a valid recharge ID");
      }
      
      const response = await apiRequest("POST", "/api/commissions/manual-distribute-recharge", {
        rechargeId: parseInt(rechargeId)
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Commissions distributed",
        description: "Commissions have been distributed successfully for the recharge",
      });
      
      // Refresh all commission-related data
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/hierarchy-wallet-balances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Reset the recharge ID
      setRechargeId("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error distributing commissions",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handler for creating mock transaction
  const handleCreateMockTransaction = () => {
    mockTransactionMutation.mutate({
      amount: mockTransactionAmount,
      serviceType: mockServiceType,
      provider: mockProvider,
    });
  };

  // Handler for marking commissions as paid
  const handleMarkAsPaid = (commissionId: number) => {
    markAsPaidMutation.mutate([commissionId]);
  };

  // Handler for initializing configs
  const handleInitializeConfigs = () => {
    initializeConfigsMutation.mutate();
  };

  // Handler for syncing wallet balances
  const handleSyncWalletBalances = () => {
    syncWalletBalancesMutation.mutate();
  };
  
  // Handler for manual commission distribution
  const handleDistributeCommission = () => {
    distributeCommissionMutation.mutate();
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view the commission dashboard. This dashboard is only accessible to administrators.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Prepare data for commission distribution chart
  const commissionDistributionData = walletBalances ? [
    { name: "Admin", value: walletBalances.admin?.walletBalance || 0 },
    { name: "Branch Manager", value: walletBalances.branchManager?.walletBalance || 0 },
    { name: "Taluk Manager", value: walletBalances.talukManager?.walletBalance || 0 },
    { name: "Service Agent", value: walletBalances.serviceAgent?.walletBalance || 0 },
    { name: "Customer", value: walletBalances.testUser?.walletBalance || 0 },
  ] : [];

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Mock transaction history for chart (in a real app, this would come from the API)
  const transactionHistory = [
    { date: '2025-01', amount: 2500, commissions: 150 },
    { date: '2025-02', amount: 3200, commissions: 192 },
    { date: '2025-03', amount: 4100, commissions: 246 },
    { date: '2025-04', amount: 3800, commissions: 228 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Commission Dashboard</h1>
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="testing">Testing Tools</TabsTrigger>
            <TabsTrigger value="pending">Pending Commissions</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Commissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <IndianRupeeIcon className="h-5 w-5 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      ₹{isLoading ? "..." : stats?.totalCommissionsEarned?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Recharges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BanknoteIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {isLoading ? "..." : stats?.totalRecharges || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3Icon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {isLoading ? "..." : stats?.totalBookings || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UserRoundIcon className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-2xl font-bold">5</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Distribution</CardTitle>
                  <CardDescription>
                    How commissions are distributed among different roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoadingBalances ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={commissionDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {commissionDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transaction & Commission Trends</CardTitle>
                  <CardDescription>Monthly transaction volume vs commissions</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={transactionHistory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        name="Transaction Amount"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="commissions"
                        stroke="#82ca9d"
                        name="Commission Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Wallet Balance Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Wallet Balances</CardTitle>
                  <CardDescription>Current commission wallet balances across the hierarchy</CardDescription>
                </div>
                <Button 
                  onClick={handleSyncWalletBalances} 
                  variant="outline" 
                  size="sm"
                  className="ml-auto"
                >
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Sync Balances
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingBalances ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Admin ({walletBalances?.admin?.username || 'Unknown'})</span>
                        <span className="font-medium">₹{walletBalances?.admin?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Progress value={walletBalances?.admin ? (walletBalances.admin.walletBalance / 200) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Branch Manager ({walletBalances?.branchManager?.username || 'Unknown'})</span>
                        <span className="font-medium">₹{walletBalances?.branchManager?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Progress value={walletBalances?.branchManager ? (walletBalances.branchManager.walletBalance / 200) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Taluk Manager ({walletBalances?.talukManager?.username || 'Unknown'})</span>
                        <span className="font-medium">₹{walletBalances?.talukManager?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Progress value={walletBalances?.talukManager ? (walletBalances.talukManager.walletBalance / 200) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Service Agent ({walletBalances?.serviceAgent?.username || 'Unknown'})</span>
                        <span className="font-medium">₹{walletBalances?.serviceAgent?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Progress value={walletBalances?.serviceAgent ? (walletBalances.serviceAgent.walletBalance / 200) * 100 : 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Test User ({walletBalances?.testUser?.username || 'Unknown'})</span>
                        <span className="font-medium">₹{walletBalances?.testUser?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Progress value={walletBalances?.testUser ? (walletBalances.testUser.walletBalance / 200) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Testing Tools Tab */}
          <TabsContent value="testing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Mock Transaction Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Commission Distribution Testing</CardTitle>
                  <CardDescription>
                    Create mock transactions to test the commission distribution system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transaction Amount</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          value={mockTransactionAmount}
                          onChange={(e) => setMockTransactionAmount(Number(e.target.value))}
                          min={1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Service Type</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={mockServiceType}
                          onChange={(e) => setMockServiceType(e.target.value)}
                        >
                          <option value="recharge">Recharge</option>
                          <option value="booking">Booking</option>
                          <option value="grocery">Grocery</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Provider</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={mockProvider}
                          onChange={(e) => setMockProvider(e.target.value)}
                        >
                          <option value="Airtel">Airtel</option>
                          <option value="Jio">Jio</option>
                          <option value="Vi">Vi</option>
                          <option value="BSNL">BSNL</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Commission Breakdown (Preview)</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Admin (0.5%)</span>
                          <span>₹{(mockTransactionAmount * 0.005).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Branch Manager (0.5%)</span>
                          <span>₹{(mockTransactionAmount * 0.005).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taluk Manager (1%)</span>
                          <span>₹{(mockTransactionAmount * 0.01).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Agent (2%)</span>
                          <span>₹{(mockTransactionAmount * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customer (1%)</span>
                          <span>₹{(mockTransactionAmount * 0.01).toFixed(2)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total Commission</span>
                          <span>₹{(mockTransactionAmount * 0.05).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCreateMockTransaction}
                      disabled={mockTransactionMutation.isPending}
                      className="w-full"
                    >
                      {mockTransactionMutation.isPending 
                        ? "Processing..." 
                        : "Create Mock Transaction"
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* System Maintenance Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance Tools</CardTitle>
                  <CardDescription>
                    Tools to initialize and fix commission system configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Commission Configuration Setup</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Initialize default commission configurations for all service types if they don't exist.
                    </p>
                    <Button 
                      onClick={handleInitializeConfigs}
                      disabled={initializeConfigsMutation.isPending}
                      className="w-full"
                      variant="outline"
                    >
                      {initializeConfigsMutation.isPending 
                        ? "Initializing..." 
                        : "Initialize Default Commission Configs"
                      }
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Wallet Balance Synchronization</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Recalculates and updates wallet balances for all users based on their commission transactions.
                    </p>
                    <Button 
                      onClick={handleSyncWalletBalances}
                      disabled={syncWalletBalancesMutation.isPending}
                      className="w-full"
                      variant="outline"
                    >
                      {syncWalletBalancesMutation.isPending 
                        ? "Syncing..." 
                        : "Sync Wallet Balances"
                      }
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Manual Commission Distribution</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manually distribute commissions for recharges that weren't processed automatically.
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-md"
                        value={rechargeId}
                        onChange={(e) => setRechargeId(e.target.value)}
                        placeholder="Enter recharge ID"
                      />
                      <Button 
                        onClick={handleDistributeCommission}
                        disabled={distributeCommissionMutation.isPending || !rechargeId}
                        variant="outline"
                      >
                        {distributeCommissionMutation.isPending 
                          ? "Processing..." 
                          : "Distribute"
                        }
                      </Button>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-xs text-amber-800">
                      This tool is for recharges that have been processed by a service agent but didn't have commissions distributed.
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
                  Note: These tools should only be used for maintenance and fixing system issues.
                </CardFooter>
              </Card>
            </div>
            
            {/* Recharge Transactions List */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recharge Transactions</CardTitle>
                <CardDescription>
                  List of all recharge transactions in the system. Use the ID from this list for manual commission distribution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecharges ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recharges && recharges.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Processed By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recharges.map((recharge) => (
                          <TableRow key={recharge.id}>
                            <TableCell className="font-medium">{recharge.id}</TableCell>
                            <TableCell>{recharge.userId}</TableCell>
                            <TableCell>₹{recharge.amount}</TableCell>
                            <TableCell>{recharge.mobileNumber}</TableCell>
                            <TableCell>{recharge.provider || '-'}</TableCell>
                            <TableCell>{recharge.serviceType || 'mobile'}</TableCell>
                            <TableCell>
                              <Badge variant={recharge.status === 'completed' ? 'success' : 
                                            recharge.status === 'pending' ? 'outline' : 'secondary'}>
                                {recharge.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{recharge.processedBy || '-'}</TableCell>
                            <TableCell>{new Date(recharge.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setRechargeId(recharge.id.toString())}
                              >
                                Use ID
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-md">
                    <p>No recharge transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pending Commissions Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Commissions</CardTitle>
                <CardDescription>
                  Commission transactions that need to be approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPending ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
                  </div>
                ) : pendingCommissions && pendingCommissions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingCommissions.map((commission: any) => (
                      <div 
                        key={commission.id} 
                        className="flex items-center justify-between border p-4 rounded-md"
                      >
                        <div>
                          <div className="font-medium">
                            {commission.serviceType.charAt(0).toUpperCase() + commission.serviceType.slice(1)}{' '}
                            {commission.provider && `- ${commission.provider}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            User: {commission.username} | Amount: ₹{commission.transactionAmount?.toFixed(2)} | 
                            Commission: ₹{commission.commissionAmount?.toFixed(2)} ({commission.commissionRate}%)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Date: {new Date(commission.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsPaid(commission.id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending commissions found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}