import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface LocalProductCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
}

interface LocalProductSubCategory {
  id: number;
  name: string;
  description?: string;
  parentCategoryId: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: Date;
}

interface CategoryRequest {
  id: number;
  requesterId: number;
  categoryName: string;
  subcategoryName?: string;
  parentCategoryId?: number;
  description?: string;
  justification?: string;
  status: string;
  adminResponse?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
  requesterName?: string;
}

export default function LocalProductCategoriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState<LocalProductCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<LocalProductSubCategory | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<LocalProductCategory[]>({
    queryKey: ["/api/admin/local-product-categories"],
  });

  // Fetch subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<LocalProductSubCategory[]>({
    queryKey: ["/api/admin/local-product-subcategories"],
  });

  // Fetch category requests
  const { data: categoryRequests = [], isLoading: requestsLoading } = useQuery<CategoryRequest[]>({
    queryKey: ["/api/admin/local-product-category-requests"],
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const res = await apiRequest("POST", "/api/admin/local-product-categories", categoryData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category Created",
        description: "Local product category has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-product-categories"] });
      setIsCreateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create subcategory mutation
  const createSubcategoryMutation = useMutation({
    mutationFn: async (subcategoryData: any) => {
      const res = await apiRequest("POST", "/api/admin/local-product-subcategories", subcategoryData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subcategory Created",
        description: "Local product subcategory has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-product-subcategories"] });
      setIsSubcategoryDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/local-product-categories/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category Updated",
        description: "Local product category has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-product-categories"] });
      setEditingCategory(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Review category request mutation
  const reviewRequestMutation = useMutation({
    mutationFn: async ({ id, action, response }: { id: number; action: string; response?: string }) => {
      const res = await apiRequest("PUT", `/api/admin/local-product-category-requests/${id}/review`, {
        action,
        adminResponse: response
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Reviewed",
        description: "Category request has been reviewed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/local-product-category-requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Review Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = (formData: FormData) => {
    const categoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      color: formData.get("color") as string,
      imageUrl: formData.get("imageUrl") as string,
      isActive: formData.get("isActive") === "on",
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };
    createCategoryMutation.mutate(categoryData);
  };

  const handleCreateSubcategory = (formData: FormData) => {
    const subcategoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      parentCategoryId: parseInt(formData.get("parentCategoryId") as string),
      imageUrl: formData.get("imageUrl") as string,
      isActive: formData.get("isActive") === "on",
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };
    createSubcategoryMutation.mutate(subcategoryData);
  };

  if (!user || user.userType !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Product Categories</h1>
        <p className="text-gray-600">Manage categories and subcategories for local products</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Requests
            {categoryRequests.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {categoryRequests.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories ({categories.length})</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateCategory(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon (emoji or icon code)</Label>
                    <Input id="icon" name="icon" placeholder="📦" />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" name="color" placeholder="blue" />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="url" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" name="isActive" defaultChecked />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
                  </div>
                  <Button type="submit" disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {category.isActive ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Order: {category.displayOrder}</span>
                    <span>
                      {subcategories.filter(s => s.parentCategoryId === category.id).length} subcategories
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subcategories Tab */}
        <TabsContent value="subcategories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subcategories ({subcategories.length})</h2>
            <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Subcategory</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateSubcategory(new FormData(e.currentTarget));
                }} className="space-y-4">
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
                  <div>
                    <Label htmlFor="name">Subcategory Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" type="url" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" name="isActive" defaultChecked />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div>
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
                  </div>
                  <Button type="submit" disabled={createSubcategoryMutation.isPending}>
                    {createSubcategoryMutation.isPending ? "Creating..." : "Create Subcategory"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => {
              const parentCategory = categories.find(c => c.id === subcategory.parentCategoryId);
              return (
                <Card key={subcategory.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {subcategory.isActive ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSubcategory(subcategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-2">{subcategory.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Package className="w-3 h-3" />
                      <span>Parent: {parentCategory?.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Order: {subcategory.displayOrder}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <h2 className="text-xl font-semibold">Category Requests ({categoryRequests.length})</h2>
          
          <div className="space-y-4">
            {categoryRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{request.categoryName}</h3>
                      {request.subcategoryName && (
                        <p className="text-gray-600">Subcategory: {request.subcategoryName}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Requested by: {request.requesterName} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
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
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>
                  )}
                  
                  {request.justification && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Justification:</h4>
                      <p className="text-sm text-gray-600">{request.justification}</p>
                    </div>
                  )}
                  
                  {request.adminResponse && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Admin Response:
                      </h4>
                      <p className="text-sm text-gray-600">{request.adminResponse}</p>
                    </div>
                  )}
                  
                  {request.status === "pending" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => reviewRequestMutation.mutate({
                          id: request.id,
                          action: "approve"
                        })}
                        disabled={reviewRequestMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => reviewRequestMutation.mutate({
                          id: request.id,
                          action: "reject",
                          response: "Request rejected by admin"
                        })}
                        disabled={reviewRequestMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {categoryRequests.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">Category requests from service providers will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}