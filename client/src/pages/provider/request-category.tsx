import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Package, 
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Send
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface LocalProductCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

interface CategoryRequest {
  id: number;
  categoryName: string;
  subcategoryName?: string;
  parentCategoryId?: number;
  description?: string;
  justification?: string;
  status: string;
  adminResponse?: string;
  createdAt: Date;
  reviewedAt?: Date;
}

export default function RequestCategoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<"category" | "subcategory">("category");

  // Fetch existing categories for subcategory requests
  const { data: categories = [] } = useQuery<LocalProductCategory[]>({
    queryKey: ["/api/local-product-categories"],
  });

  // Fetch user's category requests
  const { data: requests = [], isLoading } = useQuery<CategoryRequest[]>({
    queryKey: ["/api/provider/category-requests"],
  });

  // Create category request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const res = await apiRequest("POST", "/api/provider/category-requests", requestData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your category request has been submitted for admin review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/category-requests"] });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitRequest = (formData: FormData) => {
    const requestData = {
      categoryName: formData.get("categoryName") as string,
      subcategoryName: requestType === "subcategory" ? formData.get("subcategoryName") as string : undefined,
      parentCategoryId: requestType === "subcategory" ? parseInt(formData.get("parentCategoryId") as string) : undefined,
      description: formData.get("description") as string,
      justification: formData.get("justification") as string,
    };
    createRequestMutation.mutate(requestData);
  };

  if (!user || user.userType !== "service_provider") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only service providers can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request New Category</h1>
        <p className="text-gray-600">
          Can't find the right category for your products? Request a new category or subcategory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Category Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Category Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request New Category</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitRequest(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div>
                      <Label>Request Type</Label>
                      <Select value={requestType} onValueChange={(value: "category" | "subcategory") => setRequestType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category">New Category</SelectItem>
                          <SelectItem value="subcategory">New Subcategory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {requestType === "subcategory" && (
                      <div>
                        <Label htmlFor="parentCategoryId">Parent Category</Label>
                        <Select name="parentCategoryId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(c => c.isActive).map(category => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="categoryName">
                        {requestType === "category" ? "Category Name" : "Category Name (if new)"}
                      </Label>
                      <Input 
                        id="categoryName" 
                        name="categoryName" 
                        required={requestType === "category"}
                        placeholder={requestType === "subcategory" ? "Leave empty if using existing category" : ""}
                      />
                    </div>

                    {requestType === "subcategory" && (
                      <div>
                        <Label htmlFor="subcategoryName">Subcategory Name</Label>
                        <Input id="subcategoryName" name="subcategoryName" required />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Describe what products would fall under this category"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="justification">Business Justification</Label>
                      <Textarea 
                        id="justification" 
                        name="justification" 
                        placeholder="Explain why this category is needed for your business"
                        rows={3}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={createRequestMutation.isPending} className="w-full">
                      {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Guidelines for Category Requests</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific about the products that would fall under this category</li>
                  <li>• Explain how this helps your business and customers</li>
                  <li>• Check if a similar category already exists</li>
                  <li>• Admin review typically takes 1-3 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Existing Categories */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Existing Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="p-2 border rounded text-sm">
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 text-xs mt-1">{category.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Requests ({requests.length})</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{request.categoryName}</h3>
                      {request.subcategoryName && (
                        <p className="text-gray-600 text-sm">Subcategory: {request.subcategoryName}</p>
                      )}
                    </div>
                    <Badge 
                      variant={
                        request.status === "approved" ? "default" :
                        request.status === "rejected" ? "destructive" : "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {request.status === "approved" && <CheckCircle className="w-3 h-3" />}
                      {request.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {request.status === "pending" && <Clock className="w-3 h-3" />}
                      {request.status}
                    </Badge>
                  </div>
                  
                  {request.description && (
                    <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                  )}
                  
                  {request.adminResponse && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Admin Response:
                      </h4>
                      <p className="text-sm text-gray-600">{request.adminResponse}</p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Requested: {new Date(request.createdAt).toLocaleDateString()}
                    {request.reviewedAt && (
                      <span> • Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {requests.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-500">Your category requests will appear here once submitted</p>
          </div>
        )}
      </div>
    </div>
  );
}