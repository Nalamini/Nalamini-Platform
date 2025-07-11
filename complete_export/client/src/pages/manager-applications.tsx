import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Interface for manager application data
interface ManagerApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  managerType: "branch_manager" | "taluk_manager" | "service_agent";
  district: string;
  taluk: string;
  pincode: string;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  createdAt: string;
  approvedBy: number | null;
  updatedAt: string | null;
}

export default function ManagerApplicationsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedApplication, setSelectedApplication] = useState<ManagerApplication | null>(null);
  const [applicationDetailsOpen, setApplicationDetailsOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (user && user.userType !== "admin") {
      navigate("/dashboard");
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page.",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  // Query to fetch manager applications
  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ["/api/manager-applications", activeTab],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/manager-applications?status=${activeTab}`);
      const data = await res.json();
      return data as ManagerApplication[];
    },
    enabled: !!user && user.userType === "admin",
  });

  // Mutation to approve/reject application
  const updateApplicationMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: "approved" | "rejected";
      notes: string;
    }) => {
      const res = await apiRequest("PATCH", `/api/manager-applications/${id}`, {
        status,
        notes,
      });
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["/api/manager-applications"] });
      setApplicationDetailsOpen(false);
      setApprovalNotes("");
      refetch();
      
      toast({
        title: "Application Updated",
        description: "The manager application has been processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleViewDetails(application: ManagerApplication) {
    setSelectedApplication(application);
    setApplicationDetailsOpen(true);
  }

  function handleApproveReject(status: "approved" | "rejected") {
    if (!selectedApplication) return;
    
    updateApplicationMutation.mutate({
      id: selectedApplication.id,
      status,
      notes: approvalNotes,
    });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  }

  function formatManagerType(type: string) {
    switch (type) {
      case "branch_manager":
        return "Branch Manager";
      case "taluk_manager":
        return "Taluk Manager";
      case "service_agent":
        return "Service Agent";
      default:
        return type;
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }

  if (!user) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Manager Applications</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Review and manage pending manager applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending applications found.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of pending manager applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.fullName}</TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{formatManagerType(application.managerType)}</TableCell>
                          <TableCell>{formatDate(application.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Applications</CardTitle>
              <CardDescription>
                View all approved manager applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No approved applications found.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of approved manager applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Approved</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.fullName}</TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{formatManagerType(application.managerType)}</TableCell>
                          <TableCell>{formatDate(application.updatedAt || application.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Applications</CardTitle>
              <CardDescription>
                View all rejected manager applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No rejected applications found.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of rejected manager applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date Rejected</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.fullName}</TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{formatManagerType(application.managerType)}</TableCell>
                          <TableCell>{formatDate(application.updatedAt || application.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={applicationDetailsOpen} onOpenChange={setApplicationDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manager Application Details</DialogTitle>
            <DialogDescription>
              Review the application information before making a decision.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                  <div className="mt-2 border rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Full Name</span>
                      <p className="font-medium">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium">{selectedApplication.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Application Information</h3>
                  <div className="mt-2 border rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Role Applied For</span>
                      <p className="font-medium">{formatManagerType(selectedApplication.managerType)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Username</span>
                      <p className="font-medium">{selectedApplication.username}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Date Applied</span>
                      <p className="font-medium">{formatDate(selectedApplication.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location Information</h3>
                  <div className="mt-2 border rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">District</span>
                      <p className="font-medium">{selectedApplication.district || "To be assigned"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Taluk</span>
                      <p className="font-medium">{selectedApplication.taluk || "To be assigned"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Pincode</span>
                      <p className="font-medium">{selectedApplication.pincode || "To be assigned"}</p>
                    </div>
                  </div>
                </div>

                {selectedApplication.status === "pending" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Decision</h3>
                    <div className="mt-2 space-y-3">
                      <Textarea 
                        placeholder="Add notes or comments about this application..." 
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <div className="flex space-x-3">
                        <Button 
                          className="flex-1"
                          variant="destructive"
                          onClick={() => handleApproveReject("rejected")}
                          disabled={updateApplicationMutation.isPending}
                        >
                          {updateApplicationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Reject Application</>
                          )}
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleApproveReject("approved")}
                          disabled={updateApplicationMutation.isPending}
                        >
                          {updateApplicationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Approve Application</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.status !== "pending" && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <div className="mt-2 border rounded-lg p-4">
                      <p className="text-sm">
                        {selectedApplication.notes || "No notes provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApplicationDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}