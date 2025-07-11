import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Car, Users, Fuel, MapPin, Search } from "lucide-react";

interface TaxiVehicle {
  id: number;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  seatingCapacity: number;
  fuelType: string;
  acAvailable: boolean;
  baseFarePerKm: number;
  district: string;
  currentLocation: string;
  status: string;
  adminApproved: boolean;
}

export default function TaxiBrowseSimpleFixed() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/taxi/vehicles");
      const data = await res.json();
      return data;
    }
  });

  // Get unique values for filters
  const districts = [...new Set(vehicles.map((v: TaxiVehicle) => v.district))];
  const vehicleTypes = [...new Set(vehicles.map((v: TaxiVehicle) => v.vehicleType))];

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle: TaxiVehicle) => {
    const matchesSearch = searchTerm === "" || 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = !selectedDistrict || vehicle.district === selectedDistrict;
    const matchesVehicleType = !selectedVehicleType || vehicle.vehicleType === selectedVehicleType;

    return matchesSearch && matchesDistrict && matchesVehicleType;
  });

  const bookingMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      const bookingData = {
        vehicleId,
        pickupLocation: "Test Pickup",
        dropoffLocation: "Test Dropoff", 
        pickupTime: new Date().toISOString(),
        estimatedDistance: 10,
        notes: "Test booking"
      };
      const response = await apiRequest("POST", "/api/taxi/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/bookings"] });
      toast({
        title: "Booking Successful",
        description: "Your taxi has been booked successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Taxi Vehicles</h1>
        <p className="text-muted-foreground">Find and book your preferred vehicle</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by brand, model, vehicle type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Simple Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>District</Label>
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <select 
                  value={selectedVehicleType} 
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedDistrict("");
                    setSelectedVehicleType("");
                    setSearchTerm("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium">
          Found {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} 
          {(searchTerm || selectedDistrict || selectedVehicleType) && (
            <span className="text-muted-foreground"> (filtered from {vehicles.length} total)</span>
          )}
        </p>
      </div>

      {filteredVehicles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {vehicles.length === 0 ? "No vehicles available" : "No vehicles match your filters"}
            </h3>
            <p className="text-muted-foreground">
              {vehicles.length === 0 
                ? "Please check back later for available vehicles." 
                : "Try adjusting your search criteria or clearing filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle: TaxiVehicle) => (
            <Card key={vehicle.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {vehicle.brand} {vehicle.model}
                  </CardTitle>
                  <Badge variant={vehicle.status === 'available' ? "default" : "secondary"}>
                    {vehicle.status === 'available' ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.vehicleType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.seatingCapacity} seater</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vehicle.district}</span>
                  </div>
                </div>
                
                {vehicle.acAvailable && (
                  <Badge variant="outline" className="w-fit">AC Available</Badge>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Fare per km</p>
                    <p className="text-lg font-semibold">₹{vehicle.baseFarePerKm}</p>
                  </div>
                  <Button 
                    onClick={() => bookingMutation.mutate(vehicle.id)}
                    disabled={bookingMutation.isPending || vehicle.status !== 'available'}
                  >
                    {bookingMutation.isPending ? "Booking..." : "Book Now"}
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