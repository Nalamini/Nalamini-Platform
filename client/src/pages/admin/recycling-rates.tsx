import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Edit, Check, X, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Redirect } from "wouter";

// Define types
interface RecyclingMaterialRate {
  id: number;
  materialType: string;
  ratePerKg: number;
  description: string | null;
  isActive: boolean;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define form schema
const materialRateSchema = z.object({
  materialType: z.string().min(1, "Material type is required"),
  ratePerKg: z.coerce.number().min(0.01, "Rate must be greater than 0"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type MaterialRateFormValues = z.infer<typeof materialRateSchema>;

export default function RecyclingRatesPage() {
  const { user } = useAuth();
  const [isNewRateDialogOpen, setIsNewRateDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<RecyclingMaterialRate | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if user is not admin
  if (user?.userType !== "admin") {
    return <Redirect to="/" />;
  }

  // Fetch recycling material rates
  const { data: rates, isLoading, error } = useQuery<RecyclingMaterialRate[]>({
    queryKey: ["/api/recycling/material-rates"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add material rate mutation
  const addRateMutation = useMutation({
    mutationFn: async (data: MaterialRateFormValues) => {
      const res = await apiRequest("POST", "/api/recycling/material-rates", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recycling/material-rates"] });
      toast({
        title: "Success",
        description: "Material rate added successfully",
      });
      setIsNewRateDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add material rate",
        variant: "destructive",
      });
    },
  });

  // Update material rate mutation
  const updateRateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MaterialRateFormValues> }) => {
      const res = await apiRequest("PUT", `/api/recycling/material-rates/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recycling/material-rates"] });
      toast({
        title: "Success",
        description: "Material rate updated successfully",
      });
      setEditingRate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update material rate",
        variant: "destructive",
      });
    },
  });

  // Form for adding new material rates
  const form = useForm<MaterialRateFormValues>({
    resolver: zodResolver(materialRateSchema),
    defaultValues: {
      materialType: "",
      ratePerKg: 0,
      description: "",
      isActive: true,
    },
  });

  // Form for editing material rates
  const editForm = useForm<MaterialRateFormValues>({
    resolver: zodResolver(materialRateSchema),
    defaultValues: {
      materialType: "",
      ratePerKg: 0,
      description: "",
      isActive: true,
    },
  });

  // Update edit form values when editing rate changes
  useEffect(() => {
    if (editingRate) {
      editForm.reset({
        materialType: editingRate.materialType,
        ratePerKg: editingRate.ratePerKg,
        description: editingRate.description || "",
        isActive: editingRate.isActive,
      });
    }
  }, [editingRate, editForm]);

  // Form submission handlers
  const onSubmitNewRate = (data: MaterialRateFormValues) => {
    addRateMutation.mutate(data);
  };

  const onSubmitEditRate = (data: MaterialRateFormValues) => {
    if (editingRate) {
      updateRateMutation.mutate({ id: editingRate.id, data });
    }
  };

  // Toggle rate active status
  const toggleRateStatus = (rate: RecyclingMaterialRate) => {
    updateRateMutation.mutate({
      id: rate.id,
      data: { isActive: !rate.isActive },
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recycling Material Rates</CardTitle>
          <CardDescription>
            Manage rates for recycling materials. These rates will be used to calculate payments for recycling requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsNewRateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Material Rate
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              Failed to load material rates. Please try again.
            </div>
          ) : (
            <Table>
              <TableCaption>List of recycling material rates</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Type</TableHead>
                  <TableHead className="text-right">Rate per Kg (₹)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No material rates found. Add your first material rate.
                    </TableCell>
                  </TableRow>
                ) : (
                  rates?.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.materialType}</TableCell>
                      <TableCell className="text-right">₹{rate.ratePerKg.toFixed(2)}</TableCell>
                      <TableCell>{rate.description || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            rate.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rate.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(rate.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRate(rate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={rate.isActive ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => toggleRateStatus(rate)}
                        >
                          {rate.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding a new material rate */}
      <Dialog open={isNewRateDialogOpen} onOpenChange={setIsNewRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Material Rate</DialogTitle>
            <DialogDescription>
              Enter the details for the new recycling material rate.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewRate)} className="space-y-4">
              <FormField
                control={form.control}
                name="materialType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Plastic, Copper" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the type of recycling material (plastic, copper, brass, aluminum).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ratePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate per Kg (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the amount in rupees paid per kilogram.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide additional details about this material if needed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Set whether this material rate is currently active.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewRateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addRateMutation.isPending}
                >
                  {addRateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Material Rate
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing a material rate */}
      <Dialog open={!!editingRate} onOpenChange={(open) => !open && setEditingRate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material Rate</DialogTitle>
            <DialogDescription>
              Update the details for this recycling material rate.
            </DialogDescription>
          </DialogHeader>
          {editingRate && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEditRate)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Plastic, Copper" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the type of recycling material.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="ratePerKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate per Kg (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount in rupees paid per kilogram.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide additional details about this material if needed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          Set whether this material rate is currently active.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingRate(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateRateMutation.isPending}
                  >
                    {updateRateMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Material Rate
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}