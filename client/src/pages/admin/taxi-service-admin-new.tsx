import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, Calendar, BarChart3, RefreshCw } from "lucide-react";

export default function TaxiServiceAdminNew() {
  // Fetch taxi categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/taxi-categories"],
  });

  // Fetch taxi vehicles
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles"],
  });

  // Fetch taxi providers
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["/api/taxi/providers"],
  });

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/taxi-stats"],
  });

  const isLoading = categoriesLoading || vehiclesLoading || providersLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading taxi service data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Taxi Service Administration</h1>
        <p className="text-muted-foreground mt-2">
          Manage taxi categories, vehicles, and service providers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCategories || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVehicles || vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.approvedVehicles || 0} approved
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
              Taxi service providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingBookings || 0} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Taxi Categories</CardTitle>
            <CardDescription>
              Available taxi categories and their pricing structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No taxi categories found</p>
                <p className="text-sm">Create categories to start managing taxi services</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category: any) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>Base: ₹{category.basePrice}</span>
                        <span>Per KM: ₹{category.pricePerKm}</span>
                        <span>Max Passengers: {category.maxPassengers}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Approved Vehicles</CardTitle>
            <CardDescription>
              Vehicles approved for taxi service operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No approved vehicles found</p>
                <p className="text-sm">Vehicles will appear here after approval</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-sm text-muted-foreground">
                        License: {vehicle.licensePlate} | Year: {vehicle.year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Category: {vehicle.categoryName} | Owner: {vehicle.ownerName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Providers Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>
              Registered taxi service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {providers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No service providers found</p>
                <p className="text-sm">Providers will appear here after registration</p>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((provider: any) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{provider.businessName || provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.address}, {provider.district}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phone: {provider.phone} | Email: {provider.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={provider.status === "approved" ? "default" : "secondary"}>
                        {provider.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button>
          <Car className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </div>
    </div>
  );
}