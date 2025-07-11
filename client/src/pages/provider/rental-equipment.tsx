import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface RentalCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RentalSubcategory {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  isActive: boolean;
  imageUrl: string | null;
  displayOrder: number;
}

interface RentalEquipment {
  id: number;
  name: string;
  categoryId: number;
  providerId: number;
  description: string | null;
  specifications: Record<string, any>;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  securityDeposit: number;
  availableQuantity: number;
  totalQuantity: number;
  condition: string;
  location: string;
  district: string;
  pincode: string | null;
  imageUrl: string | null;
  additionalImages: any[];
  deliveryAvailable: boolean;
  deliveryCharge: number;
  minimumRentalDays: number;
  maximumRentalDays: number;
  isActive: boolean;
  adminApproved: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const equipmentFormSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  categoryId: z.number().min(1, "Please select a category"),
  subcategoryId: z.number().optional(),
  description: z.string().optional(),
  dailyRate: z.number().min(1, "Daily rate must be greater than 0"),
  weeklyRate: z.number().optional(),
  monthlyRate: z.number().optional(),
  securityDeposit: z.number().min(0, "Security deposit cannot be negative"),
  totalQuantity: z.number().min(1, "Total quantity must be at least 1"),
  condition: z.string().default("excellent"),
  location: z.string().min(1, "Location is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().optional(),
  imageUrl: z.string().optional(),
  deliveryAvailable: z.boolean().default(false),
  deliveryCharge: z.number().default(0),
  minimumRentalDays: z.number().min(1, "Minimum rental days must be at least 1"),
  maximumRentalDays: z.number().min(1, "Maximum rental days must be at least 1"),
});

type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

export default function ProviderRentalEquipment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  // Fetch rental categories
  const { data: categories = [] } = useQuery<RentalCategory[]>({
    queryKey: ["/api/rental-categories"],
  });

  // Fetch rental subcategories
  const { data: subcategories = [] } = useQuery<RentalSubcategory[]>({
    queryKey: ["/api/rental-subcategories"],
  });

  // Fetch provider's equipment
  const { data: equipment = [], isLoading } = useQuery<RentalEquipment[]>({
    queryKey: ["/api/provider/rental-equipment"],
  });

  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      subcategoryId: 0,
      description: "",
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
      securityDeposit: 0,
      totalQuantity: 1,
      condition: "excellent",
      location: "",
      district: "",
      pincode: "",
      imageUrl: "",
      deliveryAvailable: false,
      deliveryCharge: 0,
      minimumRentalDays: 1,
      maximumRentalDays: 30,
    },
  });

  // Create equipment mutation
  const createEquipmentMutation = useMutation({
    mutationFn: async (data: EquipmentFormData) => {
      const res = await apiRequest("POST", "/api/provider/rental-equipment", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/rental-equipment"] });
      setShowAddForm(false);
      form.reset();
      toast({
        title: "Success",
        description: "Equipment added successfully. Awaiting admin approval.",
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

  const handleSubmit = (data: EquipmentFormData) => {
    createEquipmentMutation.mutate(data);
  };

  const getStatusBadge = (equipment: RentalEquipment) => {
    if (!equipment.adminApproved) {
      return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending Approval</Badge>;
    }
    if (equipment.status === "active") {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown Category";
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading your rental equipment...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Rental Equipment</h1>
          <p className="text-gray-600">Manage your rental equipment inventory</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Equipment"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
            <CardDescription>
              Add equipment to your rental inventory. All equipment requires admin approval before going live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., JCB Excavator" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={(value) => {
                          const categoryId = parseInt(value);
                          field.onChange(categoryId);
                          setSelectedCategoryId(categoryId);
                          form.setValue("subcategoryId", 0);
                        }} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories
                              .filter((subcategory) => subcategory.categoryId === selectedCategoryId)
                              .map((subcategory) => (
                                <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
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
                        <Textarea placeholder="Describe your equipment..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Rate (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weeklyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Rate (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rate (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (₹) *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Quantity *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Chennai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Chennai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 600001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minimumRentalDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Rental Days *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maximumRentalDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Rental Days *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 30)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="deliveryAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Delivery Available</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Do you offer delivery service for this equipment?
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("deliveryAvailable") && (
                  <FormField
                    control={form.control}
                    name="deliveryCharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Charge (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  type="submit" 
                  disabled={createEquipmentMutation.isPending}
                  className="w-full"
                >
                  {createEquipmentMutation.isPending ? "Adding Equipment..." : "Add Equipment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {equipment.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No rental equipment added yet</p>
            <p className="text-sm text-gray-400">Add your first piece of equipment to start renting</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {equipment.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{getCategoryName(item.categoryId)}</p>
                  </div>
                  {getStatusBadge(item)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Daily Rate: ₹{item.dailyRate}</p>
                    {item.weeklyRate && <p>Weekly Rate: ₹{item.weeklyRate}</p>}
                    {item.monthlyRate && <p>Monthly Rate: ₹{item.monthlyRate}</p>}
                  </div>
                  <div>
                    <p>Security Deposit: ₹{item.securityDeposit}</p>
                    <p>Quantity: {item.availableQuantity}/{item.totalQuantity}</p>
                  </div>
                  <div>
                    <p><MapPin className="w-3 h-3 inline mr-1" />{item.location}, {item.district}</p>
                    <p><Clock className="w-3 h-3 inline mr-1" />{item.minimumRentalDays}-{item.maximumRentalDays} days</p>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-3">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}