import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Loader2, Image } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Store, 
  Search,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Category form schema
const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().optional()
});

// SubCategory form schema
const subCategorySchema = z.object({
  name: z.string().min(2, { message: "Subcategory name must be at least 2 characters" }),
  description: z.string().optional(),
  parentCategoryId: z.coerce.number(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().optional()
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
}

interface SubCategory {
  id: number;
  name: string;
  description?: string;
  parentCategoryId: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
}

export default function GroceryCategoriesPage() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null; type: 'category' | 'subcategory' }>({
    open: false,
    id: null,
    type: 'category'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActiveOnly, setFilterActiveOnly] = useState(true);
  
  // Image upload states
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [subcategoryImage, setSubcategoryImage] = useState<File | null>(null);
  const [subcategoryImagePreview, setSubcategoryImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category form
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      color: "",
      isActive: true,
      displayOrder: 0
    }
  });

  // SubCategory form
  const subCategoryForm = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: 0,
      isActive: true,
      displayOrder: 0
    }
  });

  // Query to fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError
  } = useQuery<Category[]>({
    queryKey: ["/api/admin/grocery/categories"],
  });

  // Query to fetch subcategories
  const {
    data: subCategories,
    isLoading: subCategoriesLoading,
    isError: subCategoriesError
  } = useQuery<SubCategory[]>({
    queryKey: ["/api/admin/grocery/subcategories"],
  });

  // Upload Category Image Mutation
  const uploadCategoryImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      console.log(`Uploading image for category ID: ${id}`);
      const formData = new FormData();
      formData.append('categoryImage', file);
      
      // Don't set Content-Type header, let the browser set it with the boundary
      const response = await fetch(`/api/admin/grocery/categories/${id}/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Important: Don't manually set Content-Type header for multipart/form-data
      });
      
      console.log(`Upload response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload image: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Category image upload success:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/categories"] });
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setUploadingImage(false);
      toast({
        title: "Image uploaded",
        description: "The category image has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Category image upload error:', error);
      setUploadingImage(false);
      toast({
        title: "Failed to upload image",
        description: error.message || "An error occurred while uploading the image.",
        variant: "destructive",
      });
    }
  });

  // Create Category Mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await apiRequest("POST", "/api/admin/grocery/categories", data);
      return response.json();
    },
    onSuccess: (category) => {
      // If there's a category image, upload it after category creation
      if (categoryImage) {
        setUploadingImage(true);
        uploadCategoryImageMutation.mutate({ id: category.id, file: categoryImage });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/categories"] });
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
      categoryForm.reset();
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setOpenCategoryDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create category",
        description: error.message || "An error occurred while creating the category.",
        variant: "destructive",
      });
    }
  });

  // Update Category Mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryFormValues }) => {
      const response = await apiRequest("PATCH", `/api/admin/grocery/categories/${id}`, data);
      return response.json();
    },
    onSuccess: (category) => {
      // If there's a category image, upload it after category update
      if (categoryImage) {
        setUploadingImage(true);
        uploadCategoryImageMutation.mutate({ id: category.id, file: categoryImage });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/categories"] });
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
      categoryForm.reset();
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setSelectedCategory(null);
      setOpenCategoryDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update category",
        description: error.message || "An error occurred while updating the category.",
        variant: "destructive",
      });
    }
  });

  // Delete Category Mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/grocery/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/categories"] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
      setConfirmDelete({ open: false, id: null, type: 'category' });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete category",
        description: error.message || "An error occurred while deleting the category.",
        variant: "destructive",
      });
    }
  });

  // Upload SubCategory Image Mutation
  const uploadSubCategoryImageMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      console.log(`Uploading image for subcategory ID: ${id}`);
      const formData = new FormData();
      formData.append('subcategoryImage', file);
      
      // Don't set Content-Type header, let the browser set it with the boundary
      const response = await fetch(`/api/admin/grocery/subcategories/${id}/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Important: Don't manually set Content-Type header for multipart/form-data
      });
      
      console.log(`Upload response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload image: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Subcategory image upload success:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/subcategories"] });
      setSubcategoryImage(null);
      setSubcategoryImagePreview(null);
      setUploadingImage(false);
      toast({
        title: "Image uploaded",
        description: "The subcategory image has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Subcategory image upload error:', error);
      setUploadingImage(false);
      toast({
        title: "Failed to upload image",
        description: error.message || "An error occurred while uploading the image.",
        variant: "destructive",
      });
    }
  });

  // Create SubCategory Mutation
  const createSubCategoryMutation = useMutation({
    mutationFn: async (data: SubCategoryFormValues) => {
      const response = await apiRequest("POST", "/api/admin/grocery/subcategories", data);
      return response.json();
    },
    onSuccess: (subcategory) => {
      // If there's a subcategory image, upload it after subcategory creation
      if (subcategoryImage) {
        setUploadingImage(true);
        uploadSubCategoryImageMutation.mutate({ id: subcategory.id, file: subcategoryImage });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/subcategories"] });
      toast({
        title: "Subcategory created",
        description: "The subcategory has been created successfully.",
      });
      subCategoryForm.reset();
      setSubcategoryImage(null);
      setSubcategoryImagePreview(null);
      setOpenSubCategoryDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create subcategory",
        description: error.message || "An error occurred while creating the subcategory.",
        variant: "destructive",
      });
    }
  });

  // Update SubCategory Mutation
  const updateSubCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SubCategoryFormValues }) => {
      const response = await apiRequest("PUT", `/api/admin/grocery/subcategories/${id}`, data);
      return response.json();
    },
    onSuccess: (subcategory) => {
      // If there's a subcategory image, upload it after subcategory update
      if (subcategoryImage) {
        setUploadingImage(true);
        uploadSubCategoryImageMutation.mutate({ id: subcategory.id, file: subcategoryImage });
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/subcategories"] });
      toast({
        title: "Subcategory updated",
        description: "The subcategory has been updated successfully.",
      });
      subCategoryForm.reset();
      setSubcategoryImage(null);
      setSubcategoryImagePreview(null);
      setSelectedSubCategory(null);
      setOpenSubCategoryDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update subcategory",
        description: error.message || "An error occurred while updating the subcategory.",
        variant: "destructive",
      });
    }
  });

  // Delete SubCategory Mutation
  const deleteSubCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/grocery/subcategories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grocery/subcategories"] });
      toast({
        title: "Subcategory deleted",
        description: "The subcategory has been deleted successfully.",
      });
      setConfirmDelete({ open: false, id: null, type: 'subcategory' });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete subcategory",
        description: error.message || "An error occurred while deleting the subcategory.",
        variant: "destructive",
      });
    }
  });

  // Handle category form submission
  const onCategorySubmit = (data: CategoryFormValues) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  // Handle subcategory form submission
  const onSubCategorySubmit = (data: SubCategoryFormValues) => {
    if (selectedSubCategory) {
      updateSubCategoryMutation.mutate({ id: selectedSubCategory.id, data });
    } else {
      createSubCategoryMutation.mutate(data);
    }
  };

  // Open edit category dialog
  const openEditCategoryDialog = (category: Category) => {
    setSelectedCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "",
      isActive: category.isActive,
      displayOrder: category.displayOrder || 0
    });
    setOpenCategoryDialog(true);
  };

  // Open edit subcategory dialog
  const openEditSubCategoryDialog = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    subCategoryForm.reset({
      name: subCategory.name,
      description: subCategory.description || "",
      parentCategoryId: subCategory.parentCategoryId,
      isActive: subCategory.isActive,
      displayOrder: subCategory.displayOrder || 0
    });
    setOpenSubCategoryDialog(true);
  };

  // Open create category dialog
  const openCreateCategoryDialog = () => {
    setSelectedCategory(null);
    categoryForm.reset({
      name: "",
      description: "",
      icon: "",
      color: "",
      isActive: true,
      displayOrder: 0
    });
    setOpenCategoryDialog(true);
  };

  // Open create subcategory dialog
  const openCreateSubCategoryDialog = () => {
    setSelectedSubCategory(null);
    subCategoryForm.reset({
      name: "",
      description: "",
      parentCategoryId: categories && categories.length > 0 ? categories[0].id : 0,
      isActive: true,
      displayOrder: 0
    });
    setOpenSubCategoryDialog(true);
  };

  // Handle delete category
  const handleDeleteCategory = (id: number) => {
    setConfirmDelete({ open: true, id, type: 'category' });
  };

  // Handle delete subcategory
  const handleDeleteSubCategory = (id: number) => {
    setConfirmDelete({ open: true, id, type: 'subcategory' });
  };

  // Confirm delete
  const confirmDeleteItem = () => {
    if (confirmDelete.id === null) return;
    
    if (confirmDelete.type === 'category') {
      deleteCategoryMutation.mutate(confirmDelete.id);
    } else {
      deleteSubCategoryMutation.mutate(confirmDelete.id);
    }
  };
  
  // Handle category image selection
  const handleCategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCategoryImagePreview(imageUrl);
    }
  };
  
  // Handle subcategory image selection
  const handleSubcategoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubcategoryImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSubcategoryImagePreview(imageUrl);
    }
  };
  
  // Handle removing category image
  const handleRemoveCategoryImage = () => {
    setCategoryImage(null);
    setCategoryImagePreview(null);
    if (categoryImagePreview) {
      URL.revokeObjectURL(categoryImagePreview);
    }
  };
  
  // Handle removing subcategory image
  const handleRemoveSubcategoryImage = () => {
    setSubcategoryImage(null);
    setSubcategoryImagePreview(null);
    if (subcategoryImagePreview) {
      URL.revokeObjectURL(subcategoryImagePreview);
    }
  };

  // Filter categories based on search term and active filter
  const filteredCategories = categories?.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesActiveFilter = !filterActiveOnly || category.isActive;
    
    return matchesSearch && matchesActiveFilter;
  });

  // Filter subcategories based on search term and active filter
  const filteredSubCategories = subCategories?.filter(subCategory => {
    const parentCategory = categories?.find(cat => cat.id === subCategory.parentCategoryId);
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subCategory.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (parentCategory?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesActiveFilter = !filterActiveOnly || subCategory.isActive;
    
    return matchesSearch && matchesActiveFilter;
  });

  // Find parent category name by ID
  const getParentCategoryName = (parentId: number) => {
    const category = categories?.find(cat => cat.id === parentId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Grocery Categories Management</h1>
          <p className="text-muted-foreground">Manage categories and subcategories for grocery products</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </Button>
          <Button
            variant={activeTab === 'subcategories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('subcategories')}
          >
            Subcategories
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Switch 
              id="active-filter" 
              checked={filterActiveOnly}
              onCheckedChange={setFilterActiveOnly} 
            />
            <label htmlFor="active-filter" className="text-sm cursor-pointer">
              Show active only
            </label>
          </div>
          <Button
            onClick={activeTab === 'categories' ? openCreateCategoryDialog : openCreateSubCategoryDialog}
            className="ml-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab === 'categories' ? 'Category' : 'Subcategory'}
          </Button>
        </div>
      </div>

      {activeTab === 'categories' ? (
        // Categories Table
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage grocery product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading categories...</span>
              </div>
            ) : categoriesError ? (
              <div className="flex justify-center items-center py-8 text-destructive">
                <AlertCircle className="h-6 w-6 mr-2" />
                Failed to load categories
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden md:table-cell">Icon</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories && filteredCategories.length > 0 ? (
                      filteredCategories.map((category, index) => (
                        <TableRow key={category.id}>
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {category.description || '-'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {category.icon || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={category.isActive ? 'default' : 'outline'}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {category.displayOrder || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openEditCategoryDialog(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          {searchTerm || !filterActiveOnly ? 'No categories match your search' : 'No categories found'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Subcategories Table
        <Card>
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
            <CardDescription>
              Manage grocery product subcategories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subCategoriesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading subcategories...</span>
              </div>
            ) : subCategoriesError ? (
              <div className="flex justify-center items-center py-8 text-destructive">
                <AlertCircle className="h-6 w-6 mr-2" />
                Failed to load subcategories
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Parent Category</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubCategories && filteredSubCategories.length > 0 ? (
                      filteredSubCategories.map((subCategory, index) => (
                        <TableRow key={subCategory.id}>
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{subCategory.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {subCategory.description || '-'}
                          </TableCell>
                          <TableCell>
                            {getParentCategoryName(subCategory.parentCategoryId)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={subCategory.isActive ? 'default' : 'outline'}>
                              {subCategory.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {subCategory.displayOrder || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => openEditSubCategoryDialog(subCategory)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleDeleteSubCategory(subCategory.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          {searchTerm || !filterActiveOnly ? 'No subcategories match your search' : 'No subcategories found'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Form Dialog */}
      <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory ? 'Update the existing category details' : 'Add a new grocery product category'}
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vegetables, Fruits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the category" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={categoryForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 🥦, 🍎" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        Use emoji or icon code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={categoryForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Class</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., bg-green-100" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        CSS class for styling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Category Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="categoryImage">Category Image</Label>
                <div className="flex flex-col gap-4">
                  {categoryImagePreview ? (
                    <div className="relative w-full max-w-[200px] h-[150px] rounded-md overflow-hidden">
                      <img 
                        src={categoryImagePreview} 
                        alt="Category preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRemoveCategoryImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : selectedCategory?.imageUrl ? (
                    <div className="relative w-full max-w-[200px] h-[150px] rounded-md overflow-hidden">
                      <img 
                        src={selectedCategory.imageUrl} 
                        alt="Category image" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRemoveCategoryImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 h-[150px] max-w-[200px]">
                      <div className="space-y-1 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          No image uploaded
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Input 
                      id="categoryImage" 
                      type="file" 
                      accept="image/*"
                      onChange={handleCategoryImageChange}
                      className="max-w-[300px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a JPG, PNG, or GIF image (max 2MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={categoryForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value === undefined ? '0' : field.value.toString()}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Order of appearance (lower first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={categoryForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Show this category to users
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                  {(createCategoryMutation.isPending || updateCategoryMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Subcategory Form Dialog */}
      <Dialog open={openSubCategoryDialog} onOpenChange={setOpenSubCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSubCategory ? 'Edit Subcategory' : 'Create Subcategory'}
            </DialogTitle>
            <DialogDescription>
              {selectedSubCategory ? 'Update the existing subcategory details' : 'Add a new grocery product subcategory'}
            </DialogDescription>
          </DialogHeader>
          <Form {...subCategoryForm}>
            <form onSubmit={subCategoryForm.handleSubmit(onSubCategorySubmit)} className="space-y-4">
              <FormField
                control={subCategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Leafy Vegetables, Exotic Fruits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subCategoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the subcategory" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subCategoryForm.control}
                name="parentCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map(category => (
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
              {/* Subcategory Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="subcategoryImage">Subcategory Image</Label>
                <div className="flex flex-col gap-4">
                  {subcategoryImagePreview ? (
                    <div className="relative w-full max-w-[200px] h-[150px] rounded-md overflow-hidden">
                      <img 
                        src={subcategoryImagePreview} 
                        alt="Subcategory preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRemoveSubcategoryImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : selectedSubCategory?.imageUrl ? (
                    <div className="relative w-full max-w-[200px] h-[150px] rounded-md overflow-hidden">
                      <img 
                        src={selectedSubCategory.imageUrl} 
                        alt="Subcategory image" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRemoveSubcategoryImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 h-[150px] max-w-[200px]">
                      <div className="space-y-1 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          No image uploaded
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Input 
                      id="subcategoryImage" 
                      type="file" 
                      accept="image/*"
                      onChange={handleSubcategoryImageChange}
                      className="max-w-[300px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a JPG, PNG, or GIF image (max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={subCategoryForm.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value === undefined ? '0' : field.value.toString()}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Order of appearance (lower first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={subCategoryForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Show this subcategory to users
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending}>
                  {(createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {selectedSubCategory ? 'Update Subcategory' : 'Create Subcategory'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onOpenChange={(isOpen) => setConfirmDelete({ ...confirmDelete, open: isOpen })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {confirmDelete.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDelete({ open: false, id: null, type: 'category' })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteItem}
              disabled={deleteCategoryMutation.isPending || deleteSubCategoryMutation.isPending}
            >
              {(deleteCategoryMutation.isPending || deleteSubCategoryMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}