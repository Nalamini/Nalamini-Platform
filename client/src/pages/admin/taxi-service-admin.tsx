import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Settings,
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Eye,
} from "lucide-react";

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

interface TaxiProvider {
  id: number;
  name: string;
  phone: string;
  vehicleType: string;
  licenseNumber: string;
  isApproved: boolean;
  isOnline: boolean;
  rating: number;
  totalRides: number;
}

export default function TaxiServiceAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<TaxiCategory[]>({
    queryKey: ["/api/taxi/categories"],
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery<TaxiProvider[]>({
    queryKey: ["/api/taxi/providers"],
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/taxi-stats"],
  });

  if (!user || user.userType !== "admin") {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Taxi Service Administration</h1>
          <p className="text-muted-foreground mt-2">
            Manage taxi categories, providers, and service settings
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">
                  {categories.filter(c => c.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{providers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {providers.filter(p => p.isApproved).length} approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Providers</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {providers.filter(p => p.isOnline && p.isApproved).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for rides
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Base Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + cat.basePrice, 0) / categories.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Categories</CardTitle>
                <CardDescription>Latest taxi categories added to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{category.basePrice} base + ₹{category.pricePerKm}/km
                        </p>
                      </div>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Status</CardTitle>
                <CardDescription>Current status of taxi service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers.slice(0, 5).map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {provider.vehicleType} • {provider.totalRides || 0} rides
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={provider.isOnline ? "default" : "secondary"}>
                          {provider.isOnline ? "Online" : "Offline"}
                        </Badge>
                        <Badge variant={provider.isApproved ? "default" : "destructive"}>
                          {provider.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Taxi Categories</h2>
              <p className="text-muted-foreground">
                Manage taxi service categories and pricing structure
              </p>
            </div>
            <Link href="/admin/taxi-categories">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p>Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">Create your first taxi category to get started</p>
                <Link href="/admin/taxi-categories">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </Link>
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Base Price</p>
                        <p className="font-medium">₹{category.basePrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Per KM</p>
                        <p className="font-medium">₹{category.pricePerKm}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Waiting</p>
                        <p className="font-medium">₹{category.waitingChargePerMinute}/min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Passengers</p>
                        <p className="font-medium">{category.maxPassengers}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-3">
                      <Link href="/admin/taxi-categories">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Taxi Providers</h2>
              <p className="text-muted-foreground">
                Manage taxi service providers and approvals
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Provider
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Provider List</CardTitle>
              <CardDescription>All registered taxi service providers</CardDescription>
            </CardHeader>
            <CardContent>
              {providersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p>Loading providers...</p>
                </div>
              ) : providers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No providers found</h3>
                  <p className="text-muted-foreground">Taxi providers will appear here once they register</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {provider.phone} • {provider.vehicleType}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            License: {provider.licenseNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <p className="font-medium">Rating: {provider.rating || 0}/5</p>
                          <p className="text-muted-foreground">{provider.totalRides || 0} rides</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={provider.isOnline ? "default" : "secondary"}>
                            {provider.isOnline ? "Online" : "Offline"}
                          </Badge>
                          <Badge variant={provider.isApproved ? "default" : "destructive"}>
                            {provider.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Service Settings</h2>
            <p className="text-muted-foreground">
              Configure taxi service parameters and policies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Settings</CardTitle>
                <CardDescription>Global pricing configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Commission Rate</label>
                    <p className="text-2xl font-bold text-primary">15%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Service Tax</label>
                    <p className="text-2xl font-bold text-primary">5%</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Pricing
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Areas</CardTitle>
                <CardDescription>Manage service coverage areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Active Districts</label>
                  <p className="text-2xl font-bold text-primary">32</p>
                  <p className="text-sm text-muted-foreground">across Tamil Nadu</p>
                </div>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Manage Areas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}