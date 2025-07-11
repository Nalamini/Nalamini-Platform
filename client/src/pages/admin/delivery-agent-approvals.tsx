import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, MapPin, Phone, Mail, User } from "lucide-react";

interface DeliveryAgent {
  id: number;
  userId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  pincode: string;
  availableStartTime: string;
  availableEndTime: string;
  operationAreas: {
    districts: string[];
    taluks: string[];
    pincodes: string[];
  };
  adminApproved: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function DeliveryAgentApprovalsPage() {
  const { toast } = useToast();

  const { data: pendingAgents = [], isLoading } = useQuery({
    queryKey: ["/api/admin/delivery/agents/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/delivery/agents/${id}/approve`, {
        approved,
      });
      return res.json();
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery/agents/pending"] });
      toast({
        title: "Success",
        description: `Delivery agent ${approved ? "approved" : "rejected"} successfully`,
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

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id, approved: true });
  };

  const handleReject = (id: number) => {
    approveMutation.mutate({ id, approved: false });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery Agent Approvals</h1>
        <p className="text-muted-foreground">Review and approve delivery agent registrations</p>
      </div>

      {pendingAgents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
            <p className="text-muted-foreground">All delivery agent registrations have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingAgents.map((agent: DeliveryAgent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <CardDescription>Applied on {new Date(agent.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{agent.phone}</span>
                      </div>
                      {agent.email && (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{agent.email}</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p>{agent.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent.taluk}, {agent.district} - {agent.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Service Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Available Hours:</span>
                        <p>{agent.availableStartTime} - {agent.availableEndTime}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Operation Areas:</span>
                        <div className="mt-1">
                          {agent.operationAreas?.districts && (
                            <div className="mb-2">
                              <span className="text-xs font-medium">Districts:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {agent.operationAreas.districts.map((district, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {district}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {agent.operationAreas?.taluks && (
                            <div className="mb-2">
                              <span className="text-xs font-medium">Taluks:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {agent.operationAreas.taluks.map((taluk, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {taluk}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {agent.operationAreas?.pincodes && (
                            <div>
                              <span className="text-xs font-medium">Pincodes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {agent.operationAreas.pincodes.map((pincode, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {pincode}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(agent.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Agent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(agent.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}