import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RentalCategory, RentalSubcategory, InsertRentalSubcategory } from "@shared/schema";

const subcategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.number().min(1, "Category is required"),
  isActive: z.boolean().default(true),
  displayOrder: z.number().min(0).default(0),
});

type SubcategoryFormData = z.infer<typeof subcategoryFormSchema>;

interface SubcategoryWithDetails extends RentalSubcategory {
  categoryName: string;
}

export default function RentalSubcategoriesPage() {
  const { toast } = useToast();
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<SubcategoryFormData>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      isActive: true,
      displayOrder: 0,
    },
  });

  // Fetch rental categories for dropdown
  const { data: categories = [] } = useQuery<RentalCategory[]>({
    queryKey: ["/api/rental-categories"],
  });

  // Fetch rental subcategories
  const { data: subcategories = [], isLoading } = useQuery<SubcategoryWithDetails[]>({
    queryKey: ["/api/admin/rental-subcategories"],
  });

  // Create subcategory mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertRentalSubcategory) => {
      const response = await apiRequest("POST", "/api/admin/rental-subcategories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rental-subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rental-subcategories"] });
      toast({
        title: "Success",
        description: "Subcategory created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create subcategory",
        variant: "destructive",
      });
    },
  });

  // Update subcategory mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertRentalSubcategory> }) => {
      const response = await apiRequest("PATCH", `/api/admin/rental-subcategories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rental-subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rental-subcategories"] });
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
      setIsDialogOpen(false);
      setEditingSubcategory(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update subcategory",
        variant: "destructive",
      });
    },
  });

  // Delete subcategory mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/rental-subcategories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rental-subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rental-subcategories"] });
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubcategoryFormData) => {
    if (editingSubcategory) {
      updateMutation.mutate({
        id: editingSubcategory.id,
        data: {
          name: data.name,
          description: data.description || null,
          categoryId: data.categoryId,
          isActive: data.isActive,
          displayOrder: data.displayOrder,
        },
      });
    } else {
      createMutation.mutate({
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        displayOrder: data.displayOrder,
      });
    }
  };

  const handleEdit = (subcategory: SubcategoryWithDetails) => {
    setEditingSubcategory(subcategory);
    form.reset({
      name: subcategory.name,
      description: subcategory.description || "",
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive,
      displayOrder: subcategory.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingSubcategory(null);
    form.reset({
      name: "",
      description: "",
      categoryId: 0,
      isActive: true,
      displayOrder: 0,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rental Subcategories</h1>
          <p className="text-muted-foreground">Manage rental equipment subcategories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
              </DialogTitle>
              <DialogDescription>
                {editingSubcategory 
                  ? "Update the subcategory details below."
                  : "Create a new rental subcategory. Fill in the details below."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subcategory name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter subcategory description" 
                          {...field} 
                        />
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
                      <FormLabel>Parent Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
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
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingSubcategory ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading subcategories...</div>
      ) : (
        <div className="grid gap-4">
          {subcategories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 mb-4" />
                  <p>No subcategories found. Add your first subcategory to get started.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            subcategories.map((subcategory) => (
              <Card key={subcategory.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {subcategory.name}
                        <Badge variant={subcategory.isActive ? "default" : "secondary"}>
                          {subcategory.isActive ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Category: {subcategory.categoryName} | Order: {subcategory.displayOrder}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(subcategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(subcategory.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {subcategory.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {subcategory.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}