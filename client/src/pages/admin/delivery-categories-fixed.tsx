import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, DollarSign, Truck, TrendingUp, Eye, EyeOff } from "lucide-react";

interface DeliveryCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  pricePerKg: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DeliveryCategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DeliveryCategory | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    pricePerKm: "",
    pricePerKg: "",
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    basePrice: "",
    pricePerKm: "",
    pricePerKg: ""
  });

  const { toast } = useToast();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/delivery-categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/delivery-categories", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-categories"] });
      setIsCreateOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Delivery category created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/delivery-categories/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-categories"] });
      setEditingCategory(null);
      resetForm();
      toast({
        title: "Success",
        description: "Delivery category updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/delivery-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-categories"] });
      toast({
        title: "Success",
        description: "Delivery category deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
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
      pricePerKg: "",
      isActive: true
    });
    setFormErrors({
      name: "",
      description: "",
      basePrice: "",
      pricePerKm: "",
      pricePerKg: ""
    });
  };

  const validateForm = () => {
    const errors = {
      name: "",
      description: "",
      basePrice: "",
      pricePerKm: "",
      pricePerKg: ""
    };

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) {
      errors.basePrice = "Valid base price is required";
    }

    if (!formData.pricePerKm || parseFloat(formData.pricePerKm) < 0) {
      errors.pricePerKm = "Valid price per KM is required";
    }

    if (!formData.pricePerKg || parseFloat(formData.pricePerKg) < 0) {
      errors.pricePerKg = "Valid price per KG is required";
    }

    setFormErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      basePrice: parseFloat(formData.basePrice),
      pricePerKm: parseFloat(formData.pricePerKm),
      pricePerKg: parseFloat(formData.pricePerKg),
      isActive: formData.isActive
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const openEditDialog = (category: DeliveryCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      basePrice: category.basePrice.toString(),
      pricePerKm: category.pricePerKm.toString(),
      pricePerKg: category.pricePerKg.toString(),
      isActive: category.isActive
    });
    setFormErrors({
      name: "",
      description: "",
      basePrice: "",
      pricePerKm: "",
      pricePerKg: ""
    });
  };

  const closeEditDialog = () => {
    setEditingCategory(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredCategories = showInactive 
    ? categories 
    : categories.filter((cat: DeliveryCategory) => cat.isActive);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Delivery Categories</h1>
          <p className="text-muted-foreground">Manage delivery service categories and pricing</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label htmlFor="show-inactive" className="text-sm">
              {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Show Inactive
            </Label>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Create Delivery Category
                </DialogTitle>
                <DialogDescription>
                  Add a new delivery category with pricing structure and service details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Category Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Express Delivery, Same Day Delivery"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed description of the delivery service category"
                      rows={3}
                      className={formErrors.description ? "border-red-500" : ""}
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="basePrice" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Base Price (₹) *
                    </Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      placeholder="0.00"
                      className={formErrors.basePrice ? "border-red-500" : ""}
                    />
                    {formErrors.basePrice && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.basePrice}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pricePerKm" className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Price per KM (₹) *
                    </Label>
                    <Input
                      id="pricePerKm"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pricePerKm}
                      onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                      placeholder="0.00"
                      className={formErrors.pricePerKm ? "border-red-500" : ""}
                    />
                    {formErrors.pricePerKm && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.pricePerKm}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pricePerKg" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Price per KG (₹) *
                    </Label>
                    <Input
                      id="pricePerKg"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pricePerKg}
                      onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                      placeholder="0.00"
                      className={formErrors.pricePerKg ? "border-red-500" : ""}
                    />
                    {formErrors.pricePerKg && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.pricePerKg}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active Category</Label>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    The final delivery price will be calculated as: Base Price + (Distance × Price per KM) + (Weight × Price per KG)
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createCategoryMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No delivery categories</h3>
            <p className="text-muted-foreground mb-4">Create your first delivery category to get started.</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category: DeliveryCategory) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Base Price:</span>
                    <span className="font-medium">₹{category.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per KM:</span>
                    <span className="font-medium">₹{category.pricePerKm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per KG:</span>
                    <span className="font-medium">₹{category.pricePerKg}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCategoryMutation.mutate(category.id)}
                    disabled={deleteCategoryMutation.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Category</DialogTitle>
            <DialogDescription>
              Update the delivery category information and pricing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Express Delivery"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the category"
              />
            </div>
            <div>
              <Label htmlFor="edit-basePrice">Base Price (₹)</Label>
              <Input
                id="edit-basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="Base charge amount"
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
                placeholder="Additional charge per kilometer"
              />
            </div>
            <div>
              <Label htmlFor="edit-pricePerKg">Price per KG (₹)</Label>
              <Input
                id="edit-pricePerKg"
                type="number"
                step="0.01"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                placeholder="Additional charge per kilogram"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategoryMutation.isPending}>
                {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}