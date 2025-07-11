import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye
} from "lucide-react";

interface DeliveryAgent {
  id: number;
  userId: number;
  name: string;
  mobileNumber: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  pincode: string;
  categoryId: number;
  availableStartTime: string;
  availableEndTime: string;
  operationAreas: string;
  documents: string;
  status: string;
  verificationStatus: "pending" | "verified" | "rejected";
  adminApproved: boolean;
  isOnline: boolean;
  isAvailable: boolean;
  rating: number;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

interface DeliveryCategory {
  id: number;
  name: string;
  description: string;
}

export default function DeliveryAgentsManagementPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { data: allAgents = [], isLoading: allLoading } = useQuery({
    queryKey: ["/api/admin/delivery/agents"],
  });

  const { data: approvedAgents = [], isLoading: approvedLoading } = useQuery({
    queryKey: ["/api/admin/delivery/agents/approved"],
  });

  const { data: pendingAgents = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["/api/admin/delivery/agents/pending"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/delivery-categories"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, isOnline, isAvailable }: { id: number; isOnline: boolean; isAvailable: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/delivery/agents/${id}/status`, {
        isOnline,
        isAvailable,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents/approved"] });
      toast({
        title: "Success",
        description: "Agent status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/delivery/agents/${id}/approve`, {
        approved,
      });
      return res.json();
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents/approved"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents/pending"] });
      toast({
        title: "Success",
        description: `Delivery agent ${approved ? "approved" : "rejected"} successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update agent approval status",
        variant: "destructive",
      });
    },
  });

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat: DeliveryCategory) => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const filterAgents = (agents: DeliveryAgent[]) => {
    return agents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.mobileNumber.includes(searchTerm) ||
                          agent.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = !filterDistrict || agent.district === filterDistrict;
      const matchesStatus = !filterStatus || 
                          (filterStatus === "online" && agent.isOnline) ||
                          (filterStatus === "offline" && !agent.isOnline) ||
                          (filterStatus === "available" && agent.isAvailable) ||
                          (filterStatus === "unavailable" && !agent.isAvailable);
      
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  };

  const uniqueDistricts = [...new Set(allAgents.map((agent: DeliveryAgent) => agent.district))];

  const renderAgentCard = (agent: DeliveryAgent, showApprovalButtons = false) => (
    <Card key={agent.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{agent.name}</CardTitle>
            <CardDescription>
              {getCategoryName(agent.categoryId)} • {agent.district}, {agent.taluk}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={agent.adminApproved ? "default" : "secondary"}>
              {agent.adminApproved ? "Approved" : "Pending"}
            </Badge>
            <Badge variant={agent.isOnline ? "default" : "secondary"}>
              {agent.isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant={agent.isAvailable ? "default" : "secondary"}>
              {agent.isAvailable ? "Available" : "Busy"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center">
              <User className="mr-2 h-4 w-4" />
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{agent.mobileNumber}</span>
              </div>
              {agent.email && (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{agent.email}</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{agent.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Service Details
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {agent.availableStartTime} - {agent.availableEndTime}
                </span>
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{agent.rating}/5 ({agent.totalDeliveries} deliveries)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          {showApprovalButtons && !agent.adminApproved && (
            <>
              <Button
                onClick={() => approveMutation.mutate({ id: agent.id, approved: true })}
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => approveMutation.mutate({ id: agent.id, approved: false })}
                disabled={approveMutation.isPending}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          
          {agent.adminApproved && (
            <Button
              onClick={() => updateStatusMutation.mutate({ 
                id: agent.id, 
                isOnline: !agent.isOnline, 
                isAvailable: agent.isAvailable 
              })}
              disabled={updateStatusMutation.isPending}
              variant={agent.isOnline ? "outline" : "default"}
            >
              {agent.isOnline ? "Set Offline" : "Set Online"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (allLoading || approvedLoading || pendingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Delivery Agents Management</h1>
          <p className="text-muted-foreground">Manage and monitor delivery agent registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterDistrict} onValueChange={setFilterDistrict}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Districts</SelectItem>
            {uniqueDistricts.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => {
            setSearchTerm("");
            setFilterDistrict("");
            setFilterStatus("");
          }}
          variant="outline"
        >
          <Filter className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Agents ({allAgents.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedAgents.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAgents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filterAgents(allAgents).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Eye className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No agents found</h3>
                  <p className="text-muted-foreground">No delivery agents match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filterAgents(allAgents).map((agent) => renderAgentCard(agent))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {filterAgents(approvedAgents).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved agents</h3>
                  <p className="text-muted-foreground">No approved delivery agents match your current filters.</p>
                </CardContent>
              </Card>
            ) : (
              filterAgents(approvedAgents).map((agent) => renderAgentCard(agent))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {filterAgents(pendingAgents).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
                  <p className="text-muted-foreground">All delivery agent registrations have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              filterAgents(pendingAgents).map((agent) => renderAgentCard(agent, true))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}