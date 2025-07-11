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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Car, DollarSign, Users, Check, X, Eye, Settings } from "lucide-react";

interface TaxiCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  waitingChargePerMinute: number;
  maxPassengers: number;
  isActive: boolean;
}

interface ServiceProvider {
  id: number;
  userId: number;
  businessName: string;
  address: string;
  district: string;
  taluk: string;
  phone: string;
  email: string;
  status: string;
  verificationStatus: string;
  createdAt: string;
}

interface TaxiVehicle {
  id: number;
  categoryId: number;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  driverName: string;
  driverPhone: string;
  isActive: boolean;
  adminApproved: boolean;
}

export default function TaxiAdminCompletePage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaxiCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    pricePerKm: "",
    waitingChargePerMinute: "",
    maxPassengers: "",
    isActive: true
  });

  const { toast } = useToast();

  // Fetch data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/taxi-categories"],
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["/api/taxi/providers"],
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/admin/taxi/vehicles"],
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/taxi-categories", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi-categories"] });
      setIsCategoryCreateOpen(false);
      resetCategoryForm();
      toast({
        title: "Success",
        description: "Taxi category created successfully",
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
      const res = await apiRequest("PUT", `/api/taxi-categories/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi-categories"] });
      setEditingCategory(null);
      resetCategoryForm();
      toast({
        title: "Success",
        description: "Taxi category updated successfully",
      });
    },
  });

  const toggleCategoryStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await apiRequest("PUT", `/api/taxi-categories/${id}`, { isActive });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi-categories"] });
      toast({
        title: "Success",
        description: "Category status updated",
      });
    },
  });

  // Provider approval mutations
  const approveProviderMutation = useMutation({
    mutationFn: async (providerId: number) => {
      const res = await apiRequest("PATCH", `/api/taxi/providers/${providerId}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/providers"] });
      toast({
        title: "Success",
        description: "Provider approved successfully",
      });
    },
  });

  const rejectProviderMutation = useMutation({
    mutationFn: async (providerId: number) => {
      const res = await apiRequest("PATCH", `/api/taxi/providers/${providerId}/reject`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/providers"] });
      toast({
        title: "Success",
        description: "Provider rejected",
      });
    },
  });

  // Vehicle approval mutations
  const approveVehicleMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      const res = await apiRequest("PUT", `/api/admin/taxi/vehicles/${vehicleId}/approve`, { approved: true });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle approved successfully",
      });
    },
  });

  const rejectVehicleMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      const res = await apiRequest("PUT", `/api/admin/taxi/vehicles/${vehicleId}/approve`, { approved: false });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle rejected",
      });
    },
  });

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      basePrice: "",
      pricePerKm: "",
      waitingChargePerMinute: "",
      maxPassengers: "",
      isActive: true
    });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...categoryFormData,
      basePrice: parseFloat(categoryFormData.basePrice),
      pricePerKm: parseFloat(categoryFormData.pricePerKm),
      waitingChargePerMinute: parseFloat(categoryFormData.waitingChargePerMinute),
      maxPassengers: parseInt(categoryFormData.maxPassengers)
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleEditCategory = (category: TaxiCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description,
      basePrice: category.basePrice.toString(),
      pricePerKm: category.pricePerKm.toString(),
      waitingChargePerMinute: category.waitingChargePerMinute.toString(),
      maxPassengers: category.maxPassengers.toString(),
      isActive: category.isActive
    });
    setIsCategoryCreateOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Taxi Service Management</h1>
        <p className="text-muted-foreground">Manage taxi categories, providers, and vehicle approvals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="providers">Service Providers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Approvals</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Taxi Categories</h2>
            <Dialog open={isCategoryCreateOpen} onOpenChange={setIsCategoryCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {setEditingCategory(null); resetCategoryForm();}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
                  <DialogDescription>
                    {editingCategory ? "Update taxi category details" : "Add a new taxi category"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      required
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="basePrice">Base Price (₹)</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        required
                        value={categoryFormData.basePrice}
                        onChange={(e) => setCategoryFormData({...categoryFormData, basePrice: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerKm">Price per KM (₹)</Label>
                      <Input
                        id="pricePerKm"
                        type="number"
                        step="0.01"
                        required
                        value={categoryFormData.pricePerKm}
                        onChange={(e) => setCategoryFormData({...categoryFormData, pricePerKm: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="waitingCharge">Waiting Charge (₹/min)</Label>
                      <Input
                        id="waitingCharge"
                        type="number"
                        step="0.01"
                        value={categoryFormData.waitingChargePerMinute}
                        onChange={(e) => setCategoryFormData({...categoryFormData, waitingChargePerMinute: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPassengers">Max Passengers</Label>
                      <Input
                        id="maxPassengers"
                        type="number"
                        required
                        value={categoryFormData.maxPassengers}
                        onChange={(e) => setCategoryFormData({...categoryFormData, maxPassengers: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={categoryFormData.isActive}
                      onCheckedChange={(checked) => setCategoryFormData({...categoryFormData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCategoryCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                      {editingCategory ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categoriesLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">Loading categories...</div>
                </CardContent>
              </Card>
            ) : categories.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No taxi categories found</p>
                    <p className="text-sm">Create your first taxi category to get started</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              categories.map((category: TaxiCategory) => (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{category.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Base Price:</span>
                            <span className="font-medium ml-1">₹{category.basePrice}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Per KM:</span>
                            <span className="font-medium ml-1">₹{category.pricePerKm}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Waiting:</span>
                            <span className="font-medium ml-1">₹{category.waitingChargePerMinute}/min</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Passengers:</span>
                            <span className="font-medium ml-1">{category.maxPassengers}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={(checked) => 
                            toggleCategoryStatusMutation.mutate({ id: category.id, isActive: checked })
                          }
                        />
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Service Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <h2 className="text-2xl font-semibold">Service Provider Approvals</h2>
          <div className="grid gap-4">
            {providersLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">Loading providers...</div>
                </CardContent>
              </Card>
            ) : providers.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No service providers found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              providers.map((provider: ServiceProvider) => (
                <Card key={provider.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{provider.businessName}</h3>
                          <Badge variant={provider.status === "approved" ? "default" : provider.status === "rejected" ? "destructive" : "secondary"}>
                            {provider.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p>📍 {provider.address}, {provider.district}</p>
                          <p>📞 {provider.phone}</p>
                          <p>📧 {provider.email}</p>
                          <p>📅 Applied: {new Date(provider.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {provider.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectProviderMutation.mutate(provider.id)}
                            disabled={rejectProviderMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => approveProviderMutation.mutate(provider.id)}
                            disabled={approveProviderMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <h2 className="text-2xl font-semibold">Vehicle Approvals</h2>
          <div className="grid gap-4">
            {vehiclesLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">Loading vehicles...</div>
                </CardContent>
              </Card>
            ) : vehicles.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No vehicles found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              vehicles.map((vehicle: TaxiVehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h3>
                          <Badge variant={vehicle.adminApproved ? "default" : "secondary"}>
                            {vehicle.adminApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <p>License: {vehicle.licensePlate}</p>
                          <p>Year: {vehicle.year}</p>
                          <p>Color: {vehicle.color}</p>
                          <p>Driver: {vehicle.driverName}</p>
                          <p>Phone: {vehicle.driverPhone}</p>
                        </div>
                      </div>
                      {!vehicle.adminApproved && (
                        <Button
                          size="sm"
                          onClick={() => approveVehicleMutation.mutate(vehicle.id)}
                          disabled={approveVehicleMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <h2 className="text-2xl font-semibold">Taxi Service Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">
                  {categories.filter((c: TaxiCategory) => c.isActive).length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{providers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {providers.filter((p: ServiceProvider) => p.status === "approved").length} approved
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <p className="text-xs text-muted-foreground">
                  {vehicles.filter((v: TaxiVehicle) => v.adminApproved).length} approved
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {providers.filter((p: ServiceProvider) => p.status === "pending").length + 
                   vehicles.filter((v: TaxiVehicle) => !v.adminApproved).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}