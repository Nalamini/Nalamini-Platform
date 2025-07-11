import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, X, Eye, Phone, MapPin, User, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Admin response schema
const adminResponseSchema = z.object({
  response: z.string().min(10, "Response must be at least 10 characters"),
});

type AdminResponseForm = z.infer<typeof adminResponseSchema>;

export default function NominationsManagement() {
  const [selectedNomination, setSelectedNomination] = useState<any>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const { toast } = useToast();

  // Query for all nominations
  const { data: nominations = [], isLoading } = useQuery({
    queryKey: ["/api/admin/nominations"],
  });

  // Form for admin response
  const responseForm = useForm<AdminResponseForm>({
    resolver: zodResolver(adminResponseSchema),
    defaultValues: {
      response: "",
    },
  });

  // Mutation for updating nomination status
  const reviewMutation = useMutation({
    mutationFn: async (data: { nominationId: number; status: string; response: string }) => {
      const res = await apiRequest("PUT", `/api/admin/nominations/${data.nominationId}`, {
        status: data.status,
        adminResponse: data.response,
      });
      return res.json();
    },
    onSuccess: () => {
      setShowReviewDialog(false);
      setSelectedNomination(null);
      responseForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/nominations"] });
      toast({
        title: "Nomination Updated",
        description: "The nomination status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openReviewDialog = (nomination: any, action: "approve" | "reject") => {
    setSelectedNomination(nomination);
    setActionType(action);
    setShowReviewDialog(true);
    responseForm.setValue("response", "");
  };

  const onReviewSubmit = (data: AdminResponseForm) => {
    if (!selectedNomination) return;
    
    reviewMutation.mutate({
      nominationId: selectedNomination.id,
      status: actionType === "approve" ? "approved" : "rejected",
      response: data.response,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "otp_pending":
        return <Badge variant="outline">OTP Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingNominations = nominations.filter((n: any) => n.status === "pending");
  const processedNominations = nominations.filter((n: any) => n.status !== "pending");

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Nominations Management</h1>
        <p className="text-muted-foreground">
          Review and manage community nominations for the opportunities forum.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Nominations</p>
                <p className="text-2xl font-bold">{nominations.length}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingNominations.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {nominations.filter((n: any) => n.status === "approved").length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {nominations.filter((n: any) => n.status === "rejected").length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Nominations */}
      {pendingNominations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-600">Pending Review</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingNominations.map((nomination: any) => (
              <Card key={nomination.id} className="border-yellow-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nomination.name}</CardTitle>
                    {getStatusBadge(nomination.status)}
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {nomination.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {nomination.taluk}, {nomination.district} - {nomination.pincode}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {nomination.role}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Service Description:</h4>
                      <p className="text-sm text-muted-foreground">
                        {nomination.serviceProvided}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(nomination.submittedAt).toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openReviewDialog(nomination, "approve")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => openReviewDialog(nomination, "reject")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processed Nominations */}
      {processedNominations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Processed Nominations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processedNominations.map((nomination: any) => (
              <Card key={nomination.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nomination.name}</CardTitle>
                    {getStatusBadge(nomination.status)}
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {nomination.phoneNumber}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {nomination.taluk}, {nomination.district} - {nomination.pincode}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {nomination.role}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Service Description:</h4>
                      <p className="text-sm text-muted-foreground">
                        {nomination.serviceProvided}
                      </p>
                    </div>
                    
                    {nomination.adminResponse && (
                      <div>
                        <h4 className="font-medium mb-2">Admin Response:</h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {nomination.adminResponse}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Submitted: {new Date(nomination.submittedAt).toLocaleString()}</div>
                      {nomination.reviewedAt && (
                        <div>Reviewed: {new Date(nomination.reviewedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No nominations message */}
      {nominations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Nominations Yet</h3>
          <p className="text-muted-foreground">
            Nominations from the community will appear here for review.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Nomination
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? `Approve ${selectedNomination?.name}'s nomination for public display.`
                : `Reject ${selectedNomination?.name}'s nomination with a reason.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...responseForm}>
            <form onSubmit={responseForm.handleSubmit(onReviewSubmit)} className="space-y-4">
              <FormField
                control={responseForm.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {actionType === "approve" ? "Approval Message" : "Rejection Reason"}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={
                          actionType === "approve" 
                            ? "Welcome message for the approved nominee..."
                            : "Please provide a clear reason for rejection..."
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                  variant={actionType === "approve" ? "default" : "destructive"}
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {actionType === "approve" ? "Approve" : "Reject"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}