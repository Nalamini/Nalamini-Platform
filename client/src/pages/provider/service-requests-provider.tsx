import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Smartphone, 
  Recycle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  approvedAt?: string;
}

const ProviderServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const { toast } = useToast();

  const { data: serviceRequests = [], isLoading, refetch } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests/provider-requests"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/provider-update`, {
        status,
        notes
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/provider-requests"] });
      toast({
        title: "Status Updated",
        description: "Service request status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update service request status.",
        variant: "destructive",
      });
    },
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
      case "assigned": return "bg-purple-100 text-purple-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.srNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === "all" || request.serviceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const groupedRequests = {
    assigned: filteredRequests.filter(r => r.status === "assigned"),
    active: filteredRequests.filter(r => ["in_progress"].includes(r.status)),
    completed: filteredRequests.filter(r => ["completed"].includes(r.status)),
    all: filteredRequests
  };

  const handleUpdateStatus = (request: ServiceRequest) => {
    const currentStatus = request.status;
    let newStatus = "";
    
    if (currentStatus === "assigned") {
      newStatus = "in_progress";
    } else if (currentStatus === "in_progress") {
      newStatus = "completed";
    }
    
    if (newStatus) {
      updateStatusMutation.mutate({
        id: request.id,
        status: newStatus,
        notes: `Status updated by service provider`
      });
    }
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground">
            Manage service requests assigned to you
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by request number or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="taxi">Taxi</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="grocery">Grocery</SelectItem>
              <SelectItem value="recharge">Recharge</SelectItem>
              <SelectItem value="recycling">Recycling</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Assigned</p>
                <p className="text-2xl font-bold">{groupedRequests.assigned.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{groupedRequests.active.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{groupedRequests.completed.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold">
                  ₹{filteredRequests.reduce((sum, req) => sum + Number(req.amount), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Requests List */}
      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned ({groupedRequests.assigned.length})</TabsTrigger>
          <TabsTrigger value="active">In Progress ({groupedRequests.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({groupedRequests.completed.length})</TabsTrigger>
          <TabsTrigger value="all">All ({groupedRequests.all.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {groupedRequests.assigned.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assigned service requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.assigned.map((request) => (
              <ServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateStatusMutation.isPending}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {groupedRequests.active.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active service requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.active.map((request) => (
              <ServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateStatusMutation.isPending}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {groupedRequests.completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed service requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.completed.map((request) => (
              <ServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateStatusMutation.isPending}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {groupedRequests.all.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No service requests found</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.all.map((request) => (
              <ServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateStatusMutation.isPending}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ServiceRequestCard = ({ 
  request, 
  onUpdateStatus, 
  isUpdating 
}: { 
  request: ServiceRequest; 
  onUpdateStatus: (request: ServiceRequest) => void;
  isUpdating: boolean;
}) => {
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
      case "assigned": return "bg-purple-100 text-purple-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const serviceData = request.serviceData ? JSON.parse(request.serviceData) : {};

  const getNextAction = () => {
    switch (request.status) {
      case "assigned":
        return { text: "Start Service", action: () => onUpdateStatus(request) };
      case "in_progress":
        return { text: "Mark Complete", action: () => onUpdateStatus(request) };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getServiceIcon(request.serviceType)}
            </div>
            <div>
              <CardTitle className="text-lg">{request.srNumber}</CardTitle>
              <CardDescription className="capitalize">
                {request.serviceType} Service Request
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(request.status)}>
              {request.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={getPaymentStatusColor(request.paymentStatus)}>
              Payment: {request.paymentStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">₹{Number(request.amount).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(request.createdAt), "MMM dd, yyyy HH:mm")}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{request.paymentMethod || "Razorpay"}</span>
          </div>
        </div>

        {/* Service-specific details */}
        {request.serviceType === "taxi" && serviceData.pickup && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Trip Details</p>
            <p className="text-sm text-muted-foreground">
              From: {serviceData.pickup} → To: {serviceData.dropoff}
            </p>
            {serviceData.distance && (
              <p className="text-sm text-muted-foreground">
                Distance: {serviceData.distance} km
              </p>
            )}
          </div>
        )}

        {request.serviceType === "delivery" && serviceData.pickupAddress && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Delivery Details</p>
            <p className="text-sm text-muted-foreground">
              From: {serviceData.pickupAddress} → To: {serviceData.deliveryAddress}
            </p>
            {serviceData.packageDetails && (
              <p className="text-sm text-muted-foreground">
                Package: {serviceData.packageDetails}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            Updated: {format(new Date(request.updatedAt), "MMM dd, HH:mm")}
          </div>
          
          {nextAction && (
            <Button 
              onClick={nextAction.action}
              disabled={isUpdating}
              size="sm"
            >
              {isUpdating ? "Updating..." : nextAction.text}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderServiceRequests;