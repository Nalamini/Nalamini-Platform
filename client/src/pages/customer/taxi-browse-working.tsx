import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Car, Users, Fuel, MapPin, Filter, Search } from "lucide-react";

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

export default function TaxiBrowseWorking() {
  const { toast } = useToast();
  
  // Filter states
  const [filters, setFilters] = useState({
    vehicleType: "",
    district: "",
    acAvailable: "",
    seatingCapacity: "",
    fuelType: "",
    priceRange: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/taxi/vehicles");
      const data = await res.json();
      return data;
    }
  });

  // Get unique values for filter options
  const districts = [...new Set(vehicles.map((v: TaxiVehicle) => v.district))];
  const vehicleTypes = [...new Set(vehicles.map((v: TaxiVehicle) => v.vehicleType))];
  const fuelTypes = [...new Set(vehicles.map((v: TaxiVehicle) => v.fuelType))];
  const seatingCapacities = [...new Set(vehicles.map((v: TaxiVehicle) => v.seatingCapacity))].sort((a, b) => a - b);

  // Filter vehicles based on search term and filters
  const filteredVehicles = vehicles.filter((vehicle: TaxiVehicle) => {
    const matchesSearch = searchTerm === "" || 
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicleType = !filters.vehicleType || vehicle.vehicleType === filters.vehicleType;
    const matchesDistrict = !filters.district || vehicle.district === filters.district;
    const matchesAC = !filters.acAvailable || 
      (filters.acAvailable === "yes" && vehicle.acAvailable) ||
      (filters.acAvailable === "no" && !vehicle.acAvailable);
    const matchesSeatingCapacity = !filters.seatingCapacity || vehicle.seatingCapacity.toString() === filters.seatingCapacity;
    const matchesFuelType = !filters.fuelType || vehicle.fuelType === filters.fuelType;
    
    let matchesPriceRange = true;
    if (filters.priceRange) {
      const fare = vehicle.baseFarePerKm;
      switch (filters.priceRange) {
        case "low": matchesPriceRange = fare <= 10; break;
        case "medium": matchesPriceRange = fare > 10 && fare <= 20; break;
        case "high": matchesPriceRange = fare > 20; break;
      }
    }

    return matchesSearch && matchesVehicleType && matchesDistrict && matchesAC && 
           matchesSeatingCapacity && matchesFuelType && matchesPriceRange;
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

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={filters.vehicleType} onValueChange={(value) => setFilters({...filters, vehicleType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>District</Label>
                <Select value={filters.district} onValueChange={(value) => setFilters({...filters, district: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Air Conditioning</Label>
                <Select value={filters.acAvailable} onValueChange={(value) => setFilters({...filters, acAvailable: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="yes">AC Available</SelectItem>
                    <SelectItem value="no">Non-AC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Seating Capacity</Label>
                <Select value={filters.seatingCapacity} onValueChange={(value) => setFilters({...filters, seatingCapacity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Capacity</SelectItem>
                    {seatingCapacities.map(capacity => (
                      <SelectItem key={capacity} value={capacity.toString()}>{capacity} Seater</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select value={filters.fuelType} onValueChange={(value) => setFilters({...filters, fuelType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fuel Types</SelectItem>
                    {fuelTypes.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range (per km)</Label>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Prices</SelectItem>
                    <SelectItem value="low">Low (≤ ₹10)</SelectItem>
                    <SelectItem value="medium">Medium (₹10-20)</SelectItem>
                    <SelectItem value="high">High (&gt; ₹20)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({
                    vehicleType: "",
                    district: "",
                    acAvailable: "",
                    seatingCapacity: "",
                    fuelType: "",
                    priceRange: ""
                  });
                  setSearchTerm("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium">
          Found {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} 
          {(searchTerm || Object.values(filters).some(f => f)) && (
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