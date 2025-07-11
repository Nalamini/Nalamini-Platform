import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Car, Plus, Edit, Trash2, Users, DollarSign, Clock } from "lucide-react";

interface TaxiCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  waitingChargePerMinute: number;
  maxPassengers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TaxiCategoriesManagementPage() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaxiCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    pricePerKm: "",
    waitingChargePerMinute: "",
    maxPassengers: ""
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/taxi/categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const res = await apiRequest("POST", "/api/taxi-categories", categoryData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/categories"] });
      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Taxi category created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: any) => {
      const res = await apiRequest("PUT", `/api/taxi-categories/${id}`, categoryData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/categories"] });
      setEditingCategory(null);
      resetForm();
      toast({
        title: "Success",
        description: "Taxi category updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/taxi-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/categories"] });
      toast({
        title: "Success",
        description: "Taxi category deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      pricePerKm: "",
      waitingChargePerMinute: "",
      maxPassengers: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: formData.name,
      description: formData.description,
      basePrice: parseFloat(formData.basePrice),
      pricePerKm: parseFloat(formData.pricePerKm),
      waitingChargePerMinute: parseFloat(formData.waitingChargePerMinute),
      maxPassengers: parseInt(formData.maxPassengers)
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ ...categoryData, id: editingCategory.id });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: TaxiCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      basePrice: category.basePrice.toString(),
      pricePerKm: category.pricePerKm.toString(),
      waitingChargePerMinute: category.waitingChargePerMinute.toString(),
      maxPassengers: category.maxPassengers.toString()
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this taxi category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Taxi Categories Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage taxi service categories and pricing
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Taxi Category</DialogTitle>
              <DialogDescription>
                Add a new taxi service category with pricing details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Two Wheeler, 4 Seaters"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price (₹)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pricePerKm">Price per KM (₹)</Label>
                  <Input
                    id="pricePerKm"
                    type="number"
                    step="0.01"
                    value={formData.pricePerKm}
                    onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waitingCharge">Waiting Charge/Min (₹)</Label>
                  <Input
                    id="waitingCharge"
                    type="number"
                    step="0.01"
                    value={formData.waitingChargePerMinute}
                    onChange={(e) => setFormData({ ...formData, waitingChargePerMinute: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxPassengers">Max Passengers</Label>
                  <Input
                    id="maxPassengers"
                    type="number"
                    value={formData.maxPassengers}
                    onChange={(e) => setFormData({ ...formData, maxPassengers: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCategoryMutation.isPending}>
                  {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Taxi Category</DialogTitle>
            <DialogDescription>
              Update taxi service category details and pricing
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Two Wheeler, 4 Seaters"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-basePrice">Base Price (₹)</Label>
                <Input
                  id="edit-basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-pricePerKm">Price per KM (₹)</Label>
                <Input
                  id="edit-pricePerKm"
                  type="number"
                  step="0.01"
                  value={formData.pricePerKm}
                  onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-waitingCharge">Waiting Charge/Min (₹)</Label>
                <Input
                  id="edit-waitingCharge"
                  type="number"
                  step="0.01"
                  value={formData.waitingChargePerMinute}
                  onChange={(e) => setFormData({ ...formData, waitingChargePerMinute: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-maxPassengers">Max Passengers</Label>
                <Input
                  id="edit-maxPassengers"
                  type="number"
                  value={formData.maxPassengers}
                  onChange={(e) => setFormData({ ...formData, maxPassengers: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending}>
                {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: TaxiCategory) => (
          <Card key={category.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    {category.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </div>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">Base Price:</span>
                  </div>
                  <span className="font-medium">₹{category.basePrice}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">Per KM:</span>
                  </div>
                  <span className="font-medium">₹{category.pricePerKm}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">Waiting/Min:</span>
                  </div>
                  <span className="font-medium">₹{category.waitingChargePerMinute}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">Max Passengers:</span>
                  </div>
                  <span className="font-medium">{category.maxPassengers}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Taxi Categories</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first taxi service category
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}