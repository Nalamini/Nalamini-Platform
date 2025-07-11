import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  User,
  Edit,
  Building,
  Users,
  Shield,
  TrendingUp
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

const BranchManagerServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");

  const { toast } = useToast();

  const { data: serviceRequests = [], isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests/branch-manager-requests"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes: string }) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/branch-manager-update`, {
        status,
        notes
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/branch-manager-requests"] });
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

  const finalApprovalMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/final-approval`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/branch-manager-requests"] });
      toast({
        title: "Final Approval Granted",
        description: "Service request has been given final approval.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to grant final approval.",
        variant: "destructive",
      });
    },
  });

  const escalateToAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/service-requests/${id}/escalate-to-admin`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/branch-manager-requests"] });
      toast({
        title: "Escalated to Admin",
        description: "Service request has been escalated to admin for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Escalation Failed",
        description: error.message || "Failed to escalate to admin.",
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
      case "escalated": return "bg-red-100 text-red-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "final_approved": return "bg-green-100 text-green-800";
      case "admin_escalated": return "bg-orange-100 text-orange-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
    escalated: filteredRequests.filter(r => r.status === "escalated"),
    pending_final_approval: filteredRequests.filter(r => r.status === "approved" && !r.approvedAt),
    final_approved: filteredRequests.filter(r => r.status === "final_approved"),
    admin_escalated: filteredRequests.filter(r => r.status === "admin_escalated"),
    all: filteredRequests
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Branch Manager - Service Requests</h1>
          <p className="text-muted-foreground">
            Final review and approval of escalated service requests
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
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="approved">Pending Final Approval</SelectItem>
              <SelectItem value="final_approved">Final Approved</SelectItem>
              <SelectItem value="admin_escalated">Admin Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Escalated</p>
                <p className="text-2xl font-bold">{groupedRequests.escalated.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Pending Final</p>
                <p className="text-2xl font-bold">{groupedRequests.pending_final_approval.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Final Approved</p>
                <p className="text-2xl font-bold">{groupedRequests.final_approved.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Admin Escalated</p>
                <p className="text-2xl font-bold">{groupedRequests.admin_escalated.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Requests</p>
                <p className="text-2xl font-bold">{groupedRequests.all.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="escalated" className="space-y-4">
        <TabsList>
          <TabsTrigger value="escalated">Escalated ({groupedRequests.escalated.length})</TabsTrigger>
          <TabsTrigger value="pending_final_approval">Pending Final ({groupedRequests.pending_final_approval.length})</TabsTrigger>
          <TabsTrigger value="final_approved">Final Approved ({groupedRequests.final_approved.length})</TabsTrigger>
          <TabsTrigger value="admin_escalated">Admin Escalated ({groupedRequests.admin_escalated.length})</TabsTrigger>
          <TabsTrigger value="all">All Requests ({groupedRequests.all.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="escalated" className="space-y-4">
          {groupedRequests.escalated.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No escalated requests requiring your attention</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.escalated.map((request) => (
              <BranchManagerServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onFinalApproval={finalApprovalMutation.mutate}
                onEscalateToAdmin={escalateToAdminMutation.mutate}
                showFinalApprovalActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending_final_approval" className="space-y-4">
          {groupedRequests.pending_final_approval.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No requests pending final approval</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.pending_final_approval.map((request) => (
              <BranchManagerServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onFinalApproval={finalApprovalMutation.mutate}
                onEscalateToAdmin={escalateToAdminMutation.mutate}
                showFinalApprovalActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="final_approved" className="space-y-4">
          {groupedRequests.final_approved.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No final approved requests</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.final_approved.map((request) => (
              <BranchManagerServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onFinalApproval={finalApprovalMutation.mutate}
                onEscalateToAdmin={escalateToAdminMutation.mutate}
                showFinalApprovalActions={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="admin_escalated" className="space-y-4">
          {groupedRequests.admin_escalated.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No requests escalated to admin</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.admin_escalated.map((request) => (
              <BranchManagerServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onFinalApproval={finalApprovalMutation.mutate}
                onEscalateToAdmin={escalateToAdminMutation.mutate}
                showFinalApprovalActions={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {groupedRequests.all.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No service requests in your branch</p>
              </CardContent>
            </Card>
          ) : (
            groupedRequests.all.map((request) => (
              <BranchManagerServiceRequestCard 
                key={request.id} 
                request={request} 
                onUpdateStatus={handleUpdateStatus}
                onFinalApproval={finalApprovalMutation.mutate}
                onEscalateToAdmin={escalateToAdminMutation.mutate}
                showFinalApprovalActions={request.status === "escalated" || (request.status === "approved" && !request.approvedAt)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

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
                  <SelectItem value="final_approved">Final Approved</SelectItem>
                  <SelectItem value="admin_escalated">Escalate to Admin</SelectItem>
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

const BranchManagerServiceRequestCard = ({ 
  request, 
  onUpdateStatus,
  onFinalApproval,
  onEscalateToAdmin,
  showFinalApprovalActions
}: { 
  request: ServiceRequest;
  onUpdateStatus: (request: ServiceRequest) => void;
  onFinalApproval: (id: number) => void;
  onEscalateToAdmin: (id: number) => void;
  showFinalApprovalActions: boolean;
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
      case "escalated": return "bg-red-100 text-red-800";
      case "approved": return "bg-purple-100 text-purple-800";
      case "final_approved": return "bg-green-100 text-green-800";
      case "admin_escalated": return "bg-orange-100 text-orange-800";
      case "closed": return "bg-gray-100 text-gray-800";
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
            <div className="flex space-x-1">
              {request.pincodeAgentId && (
                <Badge variant="outline" className="text-xs">
                  Agent: {request.pincodeAgentId}
                </Badge>
              )}
              {request.talukManagerId && (
                <Badge variant="outline" className="text-xs">
                  Manager: {request.talukManagerId}
                </Badge>
              )}
            </div>
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

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            Updated: {format(new Date(request.updatedAt), "MMM dd, HH:mm")}
          </div>
          
          <div className="flex space-x-2">
            {showFinalApprovalActions && (
              <>
                <Button variant="default" size="sm" onClick={() => onFinalApproval(request.id)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Final Approval
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onEscalateToAdmin(request.id)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Escalate to Admin
                </Button>
              </>
            )}
            
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

export default BranchManagerServiceRequests;