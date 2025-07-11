import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface RentalCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

interface RentalSubcategory {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  isActive: boolean;
}

interface RentalEquipment {
  id: number;
  name: string;
  categoryId: number;
  subcategoryId: number | null;
  providerId: number;
  description: string | null;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  securityDeposit: number;
  availableQuantity: number;
  totalQuantity: number;
  condition: string;
  location: string;
  district: string;
  isActive: boolean;
  adminApproved: boolean;
  status: string;
  category?: RentalCategory;
  subcategory?: RentalSubcategory;
}

export default function ProviderRentalServices() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

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

  // Filter equipment based on search and category
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.categoryId.toString() === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || 
                              (item.subcategoryId && item.subcategoryId.toString() === selectedSubcategory);
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const getStatusBadge = (equipment: RentalEquipment) => {
    if (!equipment.adminApproved) {
      return <Badge variant="secondary">Pending Approval</Badge>;
    }
    if (!equipment.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (equipment.availableQuantity === 0) {
      return <Badge variant="outline">Out of Stock</Badge>;
    }
    return <Badge variant="default">Available</Badge>;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Unknown Category";
  };

  const getSubcategoryName = (subcategoryId: number | null) => {
    if (!subcategoryId) return "No Subcategory";
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.name || "Unknown Subcategory";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Rental Equipment</h1>
            <p className="text-muted-foreground">
              Manage your rental equipment inventory and track performance
            </p>
          </div>
          <Button className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {subcategories
                .filter(sub => selectedCategory === "all" || sub.categoryId.toString() === selectedCategory)
                .map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                    {subcategory.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Equipment Found</h3>
            <p className="text-muted-foreground">
              {equipment.length === 0 
                ? "You haven't added any rental equipment yet."
                : "No equipment matches your current search and filters."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {getCategoryName(item.categoryId)}
                      </p>
                      {item.subcategoryId && (
                        <p className="text-xs text-muted-foreground">
                          {getSubcategoryName(item.subcategoryId)}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(item)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span className="font-medium">₹{item.dailyRate}</span>
                  </div>
                  {item.weeklyRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Rate:</span>
                      <span className="font-medium">₹{item.weeklyRate}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">{item.availableQuantity}/{item.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}