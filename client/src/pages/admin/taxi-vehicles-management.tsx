import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Calendar, MapPin, Fuel, Users, Shield, Power, PowerOff, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TaxiVehicle {
  id: number;
  providerId: number;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  seatingCapacity: number;
  fuelType: string;
  acAvailable: boolean;
  gpsEnabled: boolean;
  insuranceValid: boolean;
  pucValid: boolean;
  rcNumber: string;
  insuranceNumber: string;
  driverLicenseNumber: string;
  baseFarePerKm: number;
  baseWaitingCharge: number;
  nightChargeMultiplier: number;
  tollChargesApplicable: boolean;
  availableAreas: string;
  currentLocation: string;
  district: string;
  pincode: string;
  imageUrl?: string;
  additionalImages?: string[];
  isActive: boolean;
  status: string;
  adminApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function TaxiVehiclesManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

  const { data: vehicles, isLoading } = useQuery<TaxiVehicle[]>({
    queryKey: ["/api/admin/taxi/vehicles"]
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ vehicleId, isActive }: { vehicleId: number; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/taxi/vehicles/${vehicleId}/status`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles"] });
      toast({
        title: "Status Updated",
        description: "Vehicle status updated successfully",
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

  const approveMutation = useMutation({
    mutationFn: async ({ vehicleId, approved }: { vehicleId: number; approved: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/taxi/vehicles/${vehicleId}/approve`, { approved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles"] });
      toast({
        title: "Approval Updated",
        description: "Vehicle approval status updated successfully",
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

  const handleToggleStatus = (vehicleId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ vehicleId, isActive: !currentStatus });
  };

  const handleToggleApproval = (vehicleId: number, currentApproval: boolean) => {
    approveMutation.mutate({ vehicleId, approved: !currentApproval });
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && vehicle.isActive) ||
                         (statusFilter === "inactive" && !vehicle.isActive) ||
                         (statusFilter === "approved" && vehicle.adminApproved) ||
                         (statusFilter === "pending" && !vehicle.adminApproved);
    
    const matchesType = vehicleTypeFilter === "all" || vehicle.vehicleType === vehicleTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (vehicle: TaxiVehicle) => {
    if (!vehicle.adminApproved) return "destructive";
    return vehicle.isActive ? "default" : "secondary";
  };

  const getStatusText = (vehicle: TaxiVehicle) => {
    if (!vehicle.adminApproved) return "Not Approved";
    return vehicle.isActive ? "Active" : "Inactive";
  };

  const VehicleCard = ({ vehicle }: { vehicle: TaxiVehicle }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {vehicle.vehicleNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={getStatusBadgeVariant(vehicle)}>
              {getStatusText(vehicle)}
            </Badge>
            <Badge variant="outline">
              {vehicle.vehicleType}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Seats: {vehicle.seatingCapacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Fuel: {vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">District: {vehicle.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Insurance: {vehicle.insuranceValid ? "Valid" : "Invalid"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Registered: {new Date(vehicle.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Fare: ₹{vehicle.baseFarePerKm}/km</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Vehicle Details</h4>
            <p className="text-sm text-muted-foreground">Color: {vehicle.color}</p>
            <p className="text-sm text-muted-foreground">RC Number: {vehicle.rcNumber}</p>
            <p className="text-sm text-muted-foreground">License: {vehicle.driverLicenseNumber}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Features</h4>
            <p className="text-sm text-muted-foreground">AC Available: {vehicle.acAvailable ? "Yes" : "No"}</p>
            <p className="text-sm text-muted-foreground">GPS Enabled: {vehicle.gpsEnabled ? "Yes" : "No"}</p>
            <p className="text-sm text-muted-foreground">PUC Valid: {vehicle.pucValid ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            variant={vehicle.adminApproved ? "destructive" : "default"}
            size="sm"
            onClick={() => handleToggleApproval(vehicle.id, vehicle.adminApproved)}
            disabled={approveMutation.isPending}
          >
            {vehicle.adminApproved ? "Revoke Approval" : "Approve"}
          </Button>
          
          {vehicle.adminApproved && (
            <Button
              variant={vehicle.isActive ? "secondary" : "default"}
              size="sm"
              onClick={() => handleToggleStatus(vehicle.id, vehicle.isActive)}
              disabled={toggleStatusMutation.isPending}
            >
              {vehicle.isActive ? (
                <>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Taxi Vehicles Management</h1>
        <p className="text-muted-foreground">
          Manage all taxi vehicle registrations and their status
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="auto">Auto Rickshaw</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total Vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {vehicles?.filter(v => v.adminApproved).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {vehicles?.filter(v => v.isActive && v.adminApproved).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {vehicles?.filter(v => !v.adminApproved).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      {isLoading ? (
        <div className="text-center py-8">Loading vehicles...</div>
      ) : filteredVehicles?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {vehicles?.length === 0 ? "No vehicles registered yet" : "No vehicles match your search criteria"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredVehicles?.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}