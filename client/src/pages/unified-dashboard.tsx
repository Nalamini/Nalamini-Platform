import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Smartphone, 
  Recycle,
  Users,
  Building,
  MapPin,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface ServiceRequest {
  id: number;
  srNumber: string;
  userId: number;
  serviceType: string;
  amount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  serviceData: any;
  assignedTo?: number;
  processedBy?: number;
  pincodeAgentId?: number;
  talukManagerId?: number;
  branchManagerId?: number;
  adminApprovedBy?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  approvedAt?: string;
}

interface DashboardStats {
  totalServiceRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function UnifiedDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch service requests based on user role
  const getServiceRequestsEndpoint = () => {
    if (user?.type === "admin" || user?.userType === "admin") {
      return "/api/service-requests/all";
    } else if (user?.type === "service_provider" || user?.userType === "service_provider") {
      return "/api/service-requests/provider";
    } else if (user?.type === "branch_manager" || user?.userType === "branch_manager") {
      return "/api/service-requests/branch-manager";
    } else if (user?.type === "taluk_manager" || user?.userType === "taluk_manager") {
      return "/api/service-requests/taluk-manager";
    } else if (user?.type === "pincode_agent" || user?.userType === "pincode_agent") {
      return "/api/service-requests/agent";
    } else {
      return "/api/service-requests/customer";
    }
  };

  const { data: serviceRequests = [], isLoading: requestsLoading } = useQuery<ServiceRequest[]>({
    queryKey: [getServiceRequestsEndpoint()],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "taxi": return <Car className="h-5 w-5" />;
      case "delivery": return <Package className="h-5 w-5" />;
      case "rental": return <Wrench className="h-5 w-5" />;
      case "grocery": return <ShoppingCart className="h-5 w-5" />;
      case "recharge": return <Smartphone className="h-5 w-5" />;
      case "recycling": return <Recycle className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUserRoleDisplay = () => {
    const userType = user?.type || user?.userType;
    switch (userType) {
      case "admin": return "Administrator";
      case "service_provider": return "Service Provider";
      case "branch_manager": return "Branch Manager";
      case "taluk_manager": return "Taluk Manager";
      case "pincode_agent": return "Pincode Agent";
      case "customer": return "Customer";
      case "farmer": return "Farmer";
      default: return "User";
    }
  };

  const getQuickActions = () => {
    const userType = user?.type || user?.userType;
    
    const commonActions = [
      { label: "New Taxi Booking", icon: Car, href: "/taxi", color: "bg-blue-500" },
      { label: "Schedule Delivery", icon: Package, href: "/delivery", color: "bg-green-500" },
      { label: "Rent Equipment", icon: Wrench, href: "/rental", color: "bg-orange-500" },
      { label: "Order Groceries", icon: ShoppingCart, href: "/grocery", color: "bg-purple-500" },
      { label: "Mobile Recharge", icon: Smartphone, href: "/recharge", color: "bg-red-500" },
      { label: "Recycling Service", icon: Recycle, href: "/recycling", color: "bg-teal-500" },
    ];

    const adminActions = [
      { label: "Manage Users", icon: Users, href: "/admin/users", color: "bg-indigo-500" },
      { label: "Branch Managers", icon: Building, href: "/branch-managers", color: "bg-gray-500" },
      { label: "Analytics", icon: BarChart3, href: "/analytics", color: "bg-pink-500" },
      { label: "Commission Config", icon: Settings, href: "/commission-config", color: "bg-yellow-500" },
    ];

    const providerActions = [
      { label: "Add Local Product", icon: Plus, href: "/provider/add-local-product", color: "bg-emerald-500" },
      { label: "My Products", icon: Eye, href: "/provider/my-local-products", color: "bg-cyan-500" },
      { label: "Taxi Vehicles", icon: Car, href: "/provider/taxi-vehicles", color: "bg-blue-500" },
      { label: "Rental Items", icon: Wrench, href: "/provider/rental-items", color: "bg-orange-500" },
    ];

    if (userType === "admin") {
      return [...commonActions, ...adminActions];
    } else if (userType === "service_provider") {
      return [...commonActions, ...providerActions];
    }
    
    return commonActions;
  };

  const recentRequests = serviceRequests.slice(0, 5);

  if (requestsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.username}!</h1>
          <p className="text-muted-foreground">
            {getUserRoleDisplay()} Dashboard - Manage your services and requests
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/wallet">
              <DollarSign className="h-4 w-4 mr-2" />
              Wallet
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalServiceRequests || serviceRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.monthlyGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.pendingRequests || serviceRequests.filter(r => r.status === "new" || r.status === "in_progress").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.completedRequests || serviceRequests.filter(r => r.status === "completed" || r.status === "approved").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully processed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{(stats?.totalRevenue || serviceRequests.reduce((sum, r) => sum + (r.amount || 0), 0)).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access frequently used services and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {getQuickActions().map((action, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="h-auto p-4 flex flex-col space-y-2"
                  >
                    <Link href={action.href}>
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Service Requests</CardTitle>
              <CardDescription>
                Your latest service requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No Service Requests</p>
                  <p className="text-muted-foreground">Start by booking a service above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getServiceIcon(request.serviceType)}
                        </div>
                        <div>
                          <p className="font-medium">#{request.srNumber}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {request.serviceType} Service
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(request.createdAt), "PPp")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">₹{request.amount.toLocaleString()}</p>
                          <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                            {request.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/booking/${request.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/taxi-browse">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      <Car className="h-6 w-6" />
                    </div>
                    <CardTitle>Taxi Service</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Book reliable taxi rides for your daily commute and travel needs
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/delivery-browse">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500 text-white rounded-lg">
                      <Package className="h-6 w-6" />
                    </div>
                    <CardTitle>Delivery Service</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Fast and secure package delivery across Tamil Nadu
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/rental-browse">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-orange-500 text-white rounded-lg">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <CardTitle>Equipment Rental</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Rent tools, vehicles, and equipment for your projects
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/grocery-fixed">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500 text-white rounded-lg">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <CardTitle>Grocery Shopping</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Order fresh groceries and daily essentials for home delivery
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/recharge">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-500 text-white rounded-lg">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <CardTitle>Recharge & Bills</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Mobile recharge, DTH, electricity bills, and more
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/recycling">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-teal-500 text-white rounded-lg">
                      <Recycle className="h-6 w-6" />
                    </div>
                    <CardTitle>Recycling Service</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Eco-friendly waste collection and recycling solutions
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Service Requests</CardTitle>
              <CardDescription>
                View and manage all your service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serviceRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No Service Requests</p>
                  <p className="text-muted-foreground">Start by booking a service</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getServiceIcon(request.serviceType)}
                        </div>
                        <div>
                          <p className="font-medium">#{request.srNumber}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {request.serviceType} Service
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(request.createdAt), "PPp")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">₹{request.amount.toLocaleString()}</p>
                          <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                            {request.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/booking/${request.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Usage</CardTitle>
                <CardDescription>
                  Breakdown of services you use most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    serviceRequests.reduce((acc, req) => {
                      acc[req.serviceType] = (acc[req.serviceType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getServiceIcon(service)}
                        <span className="capitalize">{service}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending</CardTitle>
                <CardDescription>
                  Your service expenses this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  ₹{serviceRequests.reduce((sum, req) => sum + (req.amount || 0), 0).toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total spent on all services
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}