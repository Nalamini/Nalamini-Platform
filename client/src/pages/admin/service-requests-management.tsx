import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Car, 
  Package, 
  Wrench, 
  ShoppingCart, 
  Smartphone, 
  Recycle,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  MessageSquare,
  User,
  Building
} from "lucide-react";
import { format } from "date-fns";

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

const ServiceRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");

  const { toast } = useToast();

  const { data: serviceRequests = [], isLoading, error } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests/all"],
  });

  console.log("Admin Service Requests Debug:", { 
    serviceRequests, 
    isLoading, 
    error,
    length: serviceRequests?.length,
    firstItem: serviceRequests?.[0]
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes: string }) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/status`, {
        status,
        notes
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/all"] });
      toast({
        title: "Status Updated",
        description: "Service request status has been updated successfully.",
      });
      setIsUpdateDialogOpen(false);
      setSelectedRequest(null);
      setUpdateStatus("");
      setUpdateNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update service request status.",
        variant: "destructive",
      });
    },
  });

  const assignToStakeholderMutation = useMutation({
    mutationFn: async ({ id, stakeholderType, stakeholderId }: { id: number, stakeholderType: string, stakeholderId: number }) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/assign`, {
        stakeholderType,
        stakeholderId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/all"] });
      toast({
        title: "Assignment Updated",
        description: "Service request has been assigned successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign service request.",
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
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
                         request.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userId.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === "all" || request.serviceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const groupedRequests = {
    new: filteredRequests.filter(r => r.status === "new"),
    in_progress: filteredRequests.filter(r => r.status === "in_progress"),
    completed: filteredRequests.filter(r => ["completed", "approved", "closed"].includes(r.status)),
    cancelled: filteredRequests.filter(r => r.status === "cancelled")
  };

  const handleUpdateStatus = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setUpdateStatus(request.status);
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = () => {
    if (!selectedRequest || !updateStatus) return;
    
    updateStatusMutation.mutate({
      id: selectedRequest.id,
      status: updateStatus,
      notes: updateNotes
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error Loading Service Requests</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!serviceRequests || serviceRequests.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Service Request Management</h1>
          <p className="text-muted-foreground">Manage and track all service requests</p>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No Service Requests Found</p>
            <p className="text-muted-foreground">No service requests are currently in the system.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Service Request Management</h1>
          <p className="text-muted-foreground">
            Manage and track all service requests across the platform
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SR number, service, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">New</p>
                <p className="text-2xl font-bold">{groupedRequests.new.length}</p>
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
                <p className="text-2xl font-bold">{groupedRequests.in_progress.length}</p>
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
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Cancelled</p>
                <p className="text-2xl font-bold">{groupedRequests.cancelled.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">
                  ₹{filteredRequests.reduce((sum, req) => sum + Number(req.amount), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Requests List */}
      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">New ({groupedRequests.new.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({groupedRequests.in_progress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({groupedRequests.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({groupedRequests.cancelled.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {groupedRequests.new.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No new service requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.new.map((request) => (
              <AdminServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onAssignStakeholder={assignToStakeholderMutation.mutate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {groupedRequests.in_progress.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No service requests in progress</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.in_progress.map((request) => (
              <AdminServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onAssignStakeholder={assignToStakeholderMutation.mutate}
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
              <AdminServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onAssignStakeholder={assignToStakeholderMutation.mutate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {groupedRequests.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No cancelled service requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.cancelled.map((request) => (
              <AdminServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onAssignStakeholder={assignToStakeholderMutation.mutate}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Service Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for service request {selectedRequest?.srNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                placeholder="Add notes about this status update..."
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitUpdate}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminServiceRequestCard = ({ 
  request, 
  onUpdateStatus,
  onAssignStakeholder 
}: { 
  request: ServiceRequest;
  onUpdateStatus: (request: ServiceRequest) => void;
  onAssignStakeholder: (params: { id: number, stakeholderType: string, stakeholderId: number }) => void;
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
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
                {request.serviceType} Service Request • User ID: {request.userId}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {request.assignedTo ? `Assigned: ${request.assignedTo}` : "Unassigned"}
            </span>
          </div>
        </div>

        {/* Stakeholder Assignment Info */}
        {(request.pincodeAgentId || request.talukManagerId || request.branchManagerId) && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Stakeholder Assignment</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              {request.pincodeAgentId && (
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>Agent: {request.pincodeAgentId}</span>
                </div>
              )}
              {request.talukManagerId && (
                <div className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span>Taluk Manager: {request.talukManagerId}</span>
                </div>
              )}
              {request.branchManagerId && (
                <div className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span>Branch Manager: {request.branchManagerId}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onUpdateStatus(request)}>
              <Edit className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRequestsManagement;