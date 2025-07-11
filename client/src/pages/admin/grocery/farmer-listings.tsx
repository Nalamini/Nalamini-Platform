import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { FarmerProductListing, GroceryProduct } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, CheckCircle, XCircle, 
  MessageSquare, Tag, Leaf, Ban, Check, Search,
  AlertTriangle, Info, ShoppingBasket, Trash
} from "lucide-react";

// Types
interface ListingWithProduct extends FarmerProductListing {
  product?: GroceryProduct;
  farmerName?: string;
}

export default function FarmerListingsAdmin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedListing, setSelectedListing] = useState<ListingWithProduct | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch all farmer product listings with product details
  const { data: listings, isLoading, error, refetch } = useQuery<ListingWithProduct[]>({
    queryKey: ['/api/farmer-products/admin'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/farmer-products?includeProduct=true");
      if (!response.ok) {
        throw new Error('Failed to fetch farmer product listings');
      }
      return await response.json();
    }
  });

  // Approve listing mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/farmer-products/${id}/approve`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve listing');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing approved",
        description: "The farmer product listing has been approved.",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Reject listing mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number, reason: string }) => {
      const response = await apiRequest("PATCH", `/api/farmer-products/${id}/reject`, { reason });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject listing');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing rejected",
        description: "The farmer product listing has been rejected with feedback.",
      });
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedListing(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Rejection failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/farmer-products/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete listing');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing deleted",
        description: "The farmer product listing has been permanently deleted.",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter listings based on active tab and search term
  const filteredListings = listings?.filter(listing => {
    // Filter by status (tab)
    const matchesStatus = listing.status === activeTab || activeTab === "all";
    
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      listing.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.product?.description && listing.product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (listing.farmerName && listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Handle approval
  const handleApprove = (listing: ListingWithProduct) => {
    if (window.confirm(`Are you sure you want to approve this listing for ${listing.product?.name}?`)) {
      approveMutation.mutate(listing.id);
    }
  };

  // Handle rejection dialog open
  const handleRejectDialogOpen = (listing: ListingWithProduct) => {
    setSelectedListing(listing);
    setRejectDialogOpen(true);
  };

  // Handle rejection submit
  const handleRejectSubmit = () => {
    if (!selectedListing) return;
    
    if (!rejectionReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for rejection to help the farmer understand.",
        variant: "destructive",
      });
      return;
    }
    
    rejectMutation.mutate({ id: selectedListing.id, reason: rejectionReason });
  };

  // Handle delete
  const handleDelete = (listing: ListingWithProduct) => {
    if (window.confirm(`Are you sure you want to permanently delete this listing? This cannot be undone.`)) {
      deleteMutation.mutate(listing.id);
    }
  };

  // Check if user is authorized
  if (!user || user.userType !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to manage farmer product listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This page is only accessible to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Farmer Product Listings</h1>
          <p className="text-gray-600 mt-1">
            Review and manage product listings submitted by farmers
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
          </TabsTrigger>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading farmer product listings...</span>
        </div>
      ) : error ? (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{(error as Error).message}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      ) : filteredListings && filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.product?.name || "Product"}</CardTitle>
                    <CardDescription>
                      {listing.product?.description || "No description available"}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      listing.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : listing.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {listing.imageUrl ? (
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.product?.name || "Product"} 
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                    <ShoppingBasket className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                <div className="text-sm mb-4">
                  <p className="flex items-center gap-1 text-gray-700">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Farmer:</span> {listing.farmerName || "Unknown farmer"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium">₹{listing.price}/{listing.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">{listing.quantity} {listing.unit}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {listing.isOrganic && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      Organic
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {listing.sourceDistrict || listing.product?.district || "Unknown district"}
                  </Badge>
                  {listing.selfDelivery && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Self-delivery
                    </Badge>
                  )}
                </div>

                {listing.status === "rejected" && listing.adminNotes && (
                  <div className="mt-3 border-l-2 border-red-400 pl-2 py-1">
                    <p className="text-xs font-medium text-red-800">Rejection reason:</p>
                    <p className="text-xs text-gray-700">{listing.adminNotes}</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-2 border-t">
                {listing.status === "pending" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleApprove(listing)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRejectDialogOpen(listing)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => window.location.href = `/farm-listings?product=${listing.product?.id}`}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      View Live
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(listing)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "There are no farmer product listings available."
                  : `There are no ${activeTab} product listings at the moment.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this product listing. The farmer will see this feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">{selectedListing?.product?.name}</p>
              <p className="text-xs text-gray-500">Farmer: {selectedListing?.farmerName}</p>
            </div>
            
            <Textarea
              placeholder="Explain why this listing is being rejected..."
              className="min-h-[100px]"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectSubmit}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Reject Listing
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}