import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Loader2,
  Check,
  X,
  FileCheck,
  Filter,
  Eye,
  RefreshCw,
} from "lucide-react";

interface ProductRequest {
  id: number;
  farmerId: number;
  requestedProductName: string;
  description: string;
  category: string;
  unit: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  farmerName?: string; // This would come from joining with user data
}

const statusColorMap = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  approved: "bg-green-100 text-green-800 hover:bg-green-200",
  rejected: "bg-red-100 text-red-800 hover:bg-red-200",
};

// Form schema for approving a product request
const approveFormSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  adminNotes: z.string().optional(),
  subcategoryId: z.number().optional(),
  displayName: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  imageUrl: z.string().optional(),
  isOrganic: z.boolean().default(false)
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;

export default function ProductRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Fetch product requests based on active tab
  const { data: requests, isLoading, error, refetch } = useQuery<ProductRequest[]>({
    queryKey: ['/api/product-requests', activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/product-requests?status=${activeTab}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product requests');
      }
      return response.json();
    },
  });

  // Fetch grocery subcategories for the dropdown
  const { data: subcategories } = useQuery({
    queryKey: ['/api/admin/grocery/subcategories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/grocery/subcategories');
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      return response.json();
    }
  });

  // Initialize form for approving/rejecting requests
  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: {
      status: "approved",
      adminNotes: "",
      subcategoryId: undefined,
      displayName: "",
      description: "",
      price: undefined,
      imageUrl: "",
      isOrganic: false
    },
  });

  // Update product request status mutation
  const updateRequest = useMutation({
    mutationFn: async (data: ApproveFormValues & { id: number }) => {
      const { id, ...requestData } = data;
      const response = await apiRequest("PATCH", `/api/product-requests/${id}`, requestData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request updated",
        description: "The product request has been processed successfully",
      });
      
      // Reset form and close modal
      form.reset();
      setIsApproveModalOpen(false);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/product-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/grocery/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const openViewModal = (request: ProductRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const openApproveModal = (request: ProductRequest) => {
    setSelectedRequest(request);
    
    // Pre-populate form with request data
    form.reset({
      status: "approved",
      adminNotes: "",
      displayName: request.requestedProductName,
      description: request.description,
      imageUrl: request.imageUrl,
      subcategoryId: undefined,
      price: undefined,
      isOrganic: false
    });
    
    setIsApproveModalOpen(true);
  };

  const onApproveSubmit = (data: ApproveFormValues) => {
    if (!selectedRequest) return;
    
    // Add request ID to the data and submit
    updateRequest.mutate({
      id: selectedRequest.id,
      ...data
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={statusColorMap[status as keyof typeof statusColorMap] || "bg-gray-100"}>
        {status === "pending" && "Pending"}
        {status === "approved" && "Approved"}
        {status === "rejected" && "Rejected"}
      </Badge>
    );
  };

  if (user?.userType !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page. Only administrators can manage product requests.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileCheck className="h-8 w-8 text-primary" />
            Product Requests
          </h1>
          <p className="text-gray-600">
            Review and manage product requests from farmers
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs 
        defaultValue="pending" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400"></span>
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400"></span>
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests</CardTitle>
          <CardDescription>
            {activeTab === 'pending' && 'Product requests awaiting your review'}
            {activeTab === 'approved' && 'Product requests you have approved'}
            {activeTab === 'rejected' && 'Product requests you have rejected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading requests. Please try refreshing the page.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.requestedProductName}</TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>{request.unit}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openViewModal(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {request.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => openApproveModal(request)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No {activeTab} requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Request Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Request Details</DialogTitle>
            <DialogDescription>
              Request #{selectedRequest?.id} - {selectedRequest?.requestedProductName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product Name</h4>
                  <p>{selectedRequest.requestedProductName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <p>{selectedRequest.category}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Unit</h4>
                  <p>{selectedRequest.unit}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p>{getStatusBadge(selectedRequest.status)}</p>
                </div>
              </div>
              
              {selectedRequest.imageUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Image</h4>
                  <div className="mt-1 h-40 w-full overflow-hidden rounded-md bg-gray-100">
                    <img 
                      src={selectedRequest.imageUrl} 
                      alt={selectedRequest.requestedProductName} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              )}
              
              {selectedRequest.adminNotes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Admin Notes</h4>
                  <p className="text-sm">{selectedRequest.adminNotes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p>{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Updated At</h4>
                  <p>{new Date(selectedRequest.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status === 'pending' && (
              <Button onClick={() => {
                setIsViewModalOpen(false);
                openApproveModal(selectedRequest);
              }}>
                Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Request Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Review Product Request</DialogTitle>
            <DialogDescription>
              Approve or reject the request for "{selectedRequest?.requestedProductName}"
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onApproveSubmit)} className="space-y-6">
              {/* Status Selection */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="approved">Approve Request</SelectItem>
                        <SelectItem value="rejected">Reject Request</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Admin Notes */}
              <FormField
                control={form.control}
                name="adminNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add notes about this decision (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes will be visible to the farmer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Additional fields when approving */}
              {form.watch("status") === "approved" && (
                <>
                  <div className="mt-6 mb-2">
                    <h3 className="text-sm font-medium text-foreground">Product Details</h3>
                    <p className="text-xs text-muted-foreground">
                      When approved, a new product will be created with these details
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories?.map((subcat: any) => (
                              <SelectItem key={subcat.id} value={subcat.id.toString()}>
                                {subcat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="0.00"
                              value={field.value?.toString() || ""}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsApproveModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateRequest.isPending}
                  variant={form.watch("status") === "approved" ? "default" : "destructive"}
                >
                  {updateRequest.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : form.watch("status") === "approved" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Approve Request
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Reject Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}