import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Car, MapPin, Phone, Star, Plus, Clock, Users, Fuel, Filter, Search } from "lucide-react";

interface TaxiVehicle {
  id: number;
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
  baseFarePerKm: number;
  baseWaitingCharge: number;
  district: string;
  pincode: string;
  currentLocation: string;
  status: string;
  adminApproved: boolean;
  imageUrl?: string;
  providerId: number;
  provider?: {
    id: number;
    username: string;
    name?: string;
    phoneNumber?: string;
    district: string;
    taluk?: string;
    pincode?: string;
    adminApproved: boolean;
  };
}

interface TaxiCategory {
  id: number;
  name: string;
  description: string;
  baseFare: number;
  isActive: boolean;
}

interface TaxiBooking {
  vehicleId: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  estimatedDistance: number;
  notes: string;
}

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
  "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", 
  "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
  "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar"
];

export default function TaxiBrowseComplete() {
  const [selectedLocation, setSelectedLocation] = useState({
    district: "",
    taluk: "",
    pincode: ""
  });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TaxiVehicle | null>(null);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    estimatedDistance: "",
    notes: ""
  });
  const [filters, setFilters] = useState({
    vehicleType: "all",
    category: "all",
    minSeating: "",
    maxSeating: "",
    fuelType: "all",
    acOnly: false,
    maxFarePerKm: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch vehicles with provider details
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles", selectedLocation, filters],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/taxi/vehicles");
      return await res.json();
    }
  });

  // Fetch taxi categories from admin
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/taxi/categories"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/taxi/categories");
      return await res.json();
    }
  });

  // Fetch taluks for selected district
  const { data: taluks = [] } = useQuery({
    queryKey: ["/api/locations/taluks", selectedLocation.district],
    queryFn: async () => {
      if (!selectedLocation.district) return [];
      const res = await apiRequest("GET", `/api/locations/taluks?district=${selectedLocation.district}`);
      return await res.json();
    },
    enabled: !!selectedLocation.district
  });

  // Fetch pincodes for selected taluk
  const { data: pincodes = [] } = useQuery({
    queryKey: ["/api/locations/pincodes", selectedLocation.district, selectedLocation.taluk],
    queryFn: async () => {
      if (!selectedLocation.district || !selectedLocation.taluk) return [];
      const res = await apiRequest("GET", `/api/locations/pincodes?district=${selectedLocation.district}&taluk=${selectedLocation.taluk}`);
      return await res.json();
    },
    enabled: !!selectedLocation.district && !!selectedLocation.taluk
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: TaxiBooking) => {
      const response = await apiRequest("POST", "/api/taxi/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your taxi has been booked successfully!",
      });
      setIsBookingModalOpen(false);
      setSelectedVehicle(null);
      setBookingForm({
        pickupLocation: "",
        dropoffLocation: "",
        pickupTime: "",
        estimatedDistance: "",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/vehicles"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookNow = (vehicle: TaxiVehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = () => {
    if (!selectedVehicle) return;

    const bookingData: TaxiBooking = {
      vehicleId: selectedVehicle.id,
      pickupLocation: bookingForm.pickupLocation,
      dropoffLocation: bookingForm.dropoffLocation,
      pickupTime: bookingForm.pickupTime,
      estimatedDistance: parseFloat(bookingForm.estimatedDistance) || 0,
      notes: bookingForm.notes
    };

    createBookingMutation.mutate(bookingData);
  };

  // Apply all filters
  const filteredVehicles = vehicles.filter((vehicle: TaxiVehicle) => {
    // Location filters
    if (selectedLocation.district && vehicle.district !== selectedLocation.district) return false;
    if (selectedLocation.pincode && vehicle.pincode !== selectedLocation.pincode) return false;
    if (selectedLocation.taluk && vehicle.provider?.taluk !== selectedLocation.taluk) return false;

    // Vehicle type filter
    if (filters.vehicleType !== "all" && vehicle.vehicleType !== filters.vehicleType) return false;

    // Seating capacity filters
    if (filters.minSeating && vehicle.seatingCapacity < parseInt(filters.minSeating)) return false;
    if (filters.maxSeating && vehicle.seatingCapacity > parseInt(filters.maxSeating)) return false;

    // Fuel type filter
    if (filters.fuelType !== "all" && vehicle.fuelType !== filters.fuelType) return false;

    // AC filter
    if (filters.acOnly && !vehicle.acAvailable) return false;

    // Fare filter
    if (filters.maxFarePerKm && vehicle.baseFarePerKm > parseFloat(filters.maxFarePerKm)) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchFields = [
        vehicle.brand,
        vehicle.model,
        vehicle.vehicleType,
        vehicle.vehicleNumber,
        vehicle.currentLocation,
        vehicle.provider?.name || "",
        vehicle.provider?.username || ""
      ].join(" ").toLowerCase();
      
      if (!searchFields.includes(query)) return false;
    }

    // Only show admin-approved vehicles with approved providers
    return vehicle.adminApproved && vehicle.status === "available" && vehicle.provider?.adminApproved;
  });

  const uniqueVehicleTypes = vehicles.reduce((types: string[], vehicle: TaxiVehicle) => {
    if (!types.includes(vehicle.vehicleType)) {
      types.push(vehicle.vehicleType);
    }
    return types;
  }, []);

  const uniqueFuelTypes = vehicles.reduce((types: string[], vehicle: TaxiVehicle) => {
    if (!types.includes(vehicle.fuelType)) {
      types.push(vehicle.fuelType);
    }
    return types;
  }, []);

  if (vehiclesLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading taxi services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Taxi Services</h1>
        <p className="text-muted-foreground">Find and book taxi services across Tamil Nadu</p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by vehicle, brand, location, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="district">District</Label>
              <Select 
                value={selectedLocation.district} 
                onValueChange={(value) => setSelectedLocation(prev => ({ ...prev, district: value, taluk: "", pincode: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Districts</SelectItem>
                  {TAMIL_NADU_DISTRICTS.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="taluk">Taluk</Label>
              <Select 
                value={selectedLocation.taluk} 
                onValueChange={(value) => setSelectedLocation(prev => ({ ...prev, taluk: value, pincode: "" }))}
                disabled={!selectedLocation.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select taluk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Taluks</SelectItem>
                  {taluks.map((taluk: string) => (
                    <SelectItem key={taluk} value={taluk}>{taluk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Select 
                value={selectedLocation.pincode} 
                onValueChange={(value) => setSelectedLocation(prev => ({ ...prev, pincode: value }))}
                disabled={!selectedLocation.taluk}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pincode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Pincodes</SelectItem>
                  {pincodes.map((pincode: string) => (
                    <SelectItem key={pincode} value={pincode}>{pincode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select 
                value={filters.vehicleType} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueVehicleTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select 
                value={filters.fuelType} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, fuelType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Fuels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuels</SelectItem>
                  {uniqueFuelTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minSeating">Min Seating</Label>
              <Input
                id="minSeating"
                type="number"
                placeholder="Min"
                value={filters.minSeating}
                onChange={(e) => setFilters(prev => ({ ...prev, minSeating: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="maxFare">Max Fare/KM</Label>
              <Input
                id="maxFare"
                type="number"
                placeholder="₹"
                value={filters.maxFarePerKm}
                onChange={(e) => setFilters(prev => ({ ...prev, maxFarePerKm: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Available Vehicles ({filteredVehicles.length})
        </h2>
        
        {filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No vehicles available with the selected filters.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
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
                    <Badge variant="default">Available</Badge>
                  </div>
                  <CardDescription>
                    {vehicle.vehicleType} • {vehicle.vehicleNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {vehicle.imageUrl && (
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Seating:
                      </span>
                      <span className="font-medium">{vehicle.seatingCapacity} passengers</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        Fuel:
                      </span>
                      <span className="font-medium">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location:
                      </span>
                      <span className="font-medium">{vehicle.currentLocation}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate per KM:</span>
                      <span className="font-medium text-primary">₹{vehicle.baseFarePerKm}</span>
                    </div>
                    
                    {/* Provider Details */}
                    {vehicle.provider && (
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Provider:</span>
                          <span className="font-medium">{vehicle.provider.name || vehicle.provider.username}</span>
                        </div>
                        {vehicle.provider.phoneNumber && (
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              Contact:
                            </span>
                            <span className="font-medium">{vehicle.provider.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vehicle.acAvailable && (
                        <Badge variant="secondary" className="text-xs">AC</Badge>
                      )}
                      {vehicle.gpsEnabled && (
                        <Badge variant="secondary" className="text-xs">GPS</Badge>
                      )}
                      {vehicle.insuranceValid && (
                        <Badge variant="secondary" className="text-xs">Insured</Badge>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleBookNow(vehicle)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Taxi</DialogTitle>
            <DialogDescription>
              {selectedVehicle && `${selectedVehicle.brand} ${selectedVehicle.model} - ${selectedVehicle.vehicleType}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                value={bookingForm.pickupLocation}
                onChange={(e) => setBookingForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                placeholder="Enter pickup location"
              />
            </div>
            
            <div>
              <Label htmlFor="dropoffLocation">Drop-off Location</Label>
              <Input
                id="dropoffLocation"
                value={bookingForm.dropoffLocation}
                onChange={(e) => setBookingForm(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                placeholder="Enter drop-off location"
              />
            </div>
            
            <div>
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                value={bookingForm.pickupTime}
                onChange={(e) => setBookingForm(prev => ({ ...prev, pickupTime: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedDistance">Estimated Distance (KM)</Label>
              <Input
                id="estimatedDistance"
                type="number"
                value={bookingForm.estimatedDistance}
                onChange={(e) => setBookingForm(prev => ({ ...prev, estimatedDistance: e.target.value }))}
                placeholder="Enter estimated distance"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleBookingSubmit}
                disabled={!bookingForm.pickupLocation || !bookingForm.dropoffLocation || createBookingMutation.isPending}
                className="flex-1"
              >
                {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}