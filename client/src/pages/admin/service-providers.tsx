import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, XCircle, Clock, User, Building, Phone, Mail, MapPin, Calendar } from "lucide-react";

interface ServiceProvider {
  id: number;
  userId: number;
  providerType: string;
  businessName: string;
  phone: string;
  email: string;
  district: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  adminNotes?: string;
  username: string;
  fullName: string;
}

export default function ServiceProvidersPage() {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  const { data: providers = [], isLoading, error } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/admin/service-providers"],
  });

  // Debug logging
  console.log("Service Providers Query:", { providers, isLoading, error });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/service-providers/${id}/status`, {
        status,
        adminNotes
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-providers"] });
      setSelectedProvider(null);
      setAdminNotes("");
      toast({
        title: "Status Updated",
        description: "Service provider status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="flex items-center gap-1 bg-green-600"><CheckCircle className="w-3 h-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProviderTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      farmer: "Farmer",
      manufacturer: "Manufacturer",
      recycling_agent: "Recycling Agent",
      booking_agent: "Booking Agent",
      rental_provider: "Rental Provider",
      transport_service: "Transport Service",
      taxi_service: "Taxi Service"
    };
    return typeMap[type] || type;
  };

  const handleApprove = () => {
    if (!selectedProvider) return;
    updateStatusMutation.mutate({
      id: selectedProvider.id,
      status: "approved",
      adminNotes
    });
  };

  const handleReject = () => {
    if (!selectedProvider) return;
    updateStatusMutation.mutate({
      id: selectedProvider.id,
      status: "rejected",
      adminNotes
    });
  };

  const pendingCount = providers.filter(p => p.status === "pending").length;
  const approvedCount = providers.filter(p => p.status === "approved").length;
  const rejectedCount = providers.filter(p => p.status === "rejected").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Service Providers</h3>
              <p className="text-gray-600">
                {error instanceof Error ? error.message : "Unable to load service provider registrations"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Provider Management</h1>
          <p className="text-muted-foreground">Review and approve service provider registrations</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Providers</p>
                <p className="text-2xl font-bold">{providers.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Provider Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Business Info</TableHead>
                <TableHead>Provider Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{provider.fullName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">@{provider.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{provider.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span>{provider.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getProviderTypeDisplay(provider.providerType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{provider.district}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(provider.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(provider.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setAdminNotes(provider.adminNotes || "");
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Service Provider Registration</DialogTitle>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6">
              {/* Provider Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm">{selectedProvider.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-sm">@{selectedProvider.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                    <p className="text-sm">{selectedProvider.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Provider Type</label>
                    <p className="text-sm">{getProviderTypeDisplay(selectedProvider.providerType)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">District</label>
                    <p className="text-sm">{selectedProvider.district}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <div className="mt-1">{getStatusBadge(selectedProvider.status)}</div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={4}
                />
              </div>

              {/* Previous Admin Notes */}
              {selectedProvider.adminNotes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Previous Admin Notes</label>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {selectedProvider.adminNotes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProvider(null)}
                  disabled={updateStatusMutation.isPending}
                >
                  Cancel
                </Button>
                {selectedProvider.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedProvider.status !== "pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateStatusMutation.mutate({
                        id: selectedProvider.id,
                        status: "pending",
                        adminNotes
                      });
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    Reset to Pending
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}