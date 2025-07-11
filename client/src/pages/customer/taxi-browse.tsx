import { useState } from "react";
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
import { Car, MapPin, Phone, Star, Plus, Clock, Users, Fuel } from "lucide-react";

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

export default function TaxiBrowsePage() {
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
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/taxi/vehicles");
      const data = await res.json();
      console.log("VEHICLES DEBUG:", data);
      return data;
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: TaxiBooking) => {
      const response = await apiRequest("POST", "/api/taxi/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: "Your taxi booking has been submitted successfully.",
      });
      setIsBookingModalOpen(false);
      setBookingForm({
        pickupLocation: "",
        dropoffLocation: "",
        pickupTime: "",
        estimatedDistance: "",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleBookNow = (vehicle: TaxiVehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Filter vehicles based on selected type
  const filteredVehicles = vehicles.filter((vehicle: TaxiVehicle) => {
    if (filterType === "all") return true;
    return vehicle.vehicleType === filterType;
  });

  // Filter by location if selected
  const locationFilteredVehicles = filteredVehicles.filter((vehicle: TaxiVehicle) => {
    if (!selectedLocation.district || selectedLocation.district === "") return true;
    return vehicle.district === selectedLocation.district;
  });

  console.log("DEBUG: vehicles.length =", vehicles.length);
  console.log("DEBUG: filteredVehicles.length =", filteredVehicles.length);
  console.log("DEBUG: locationFilteredVehicles.length =", locationFilteredVehicles.length);
  console.log("DEBUG: selectedLocation =", selectedLocation);
  console.log("DEBUG: filterType =", filterType);

  const uniqueVehicleTypes = vehicles.reduce((types: string[], vehicle: TaxiVehicle) => {
    if (!types.includes(vehicle.vehicleType)) {
      types.push(vehicle.vehicleType);
    }
    return types;
  }, []);

  if (vehiclesLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading Available Vehicles...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Book a Taxi</h1>
        <p className="text-muted-foreground">Choose from available vehicles in Tamil Nadu</p>
      </div>

      {/* Location and Vehicle Type Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Vehicles</CardTitle>
          <CardDescription>Filter by location and vehicle type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="district">District</Label>
              <Select 
                value={selectedLocation.district} 
                onValueChange={(value) => setSelectedLocation({...selectedLocation, district: value})}
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
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
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
              <Label htmlFor="pincode">Pincode (Optional)</Label>
              <Input
                id="pincode"
                placeholder="Enter pincode"
                value={selectedLocation.pincode}
                onChange={(e) => setSelectedLocation({...selectedLocation, pincode: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Vehicles */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Available Vehicles ({locationFilteredVehicles.length})
        </h2>
        
        {locationFilteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No vehicles available with the selected filters.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locationFilteredVehicles.map((vehicle: TaxiVehicle) => (
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
                      <span>Vehicle Type:</span>
                      <span className="font-medium">{vehicle.vehicleType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Seating:
                      </span>
                      <span className="font-medium">{vehicle.seatingCapacity} passengers</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate per KM:</span>
                      <span className="font-medium text-primary">₹{vehicle.baseFarePerKm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Waiting Charge:</span>
                      <span className="font-medium text-primary">₹{vehicle.baseWaitingCharge}/hr</span>
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
                      <span className="font-medium">{vehicle.district}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle.acAvailable && <Badge variant="outline">AC</Badge>}
                    {vehicle.gpsEnabled && <Badge variant="outline">GPS</Badge>}
                    {vehicle.insuranceValid && <Badge variant="outline">Insured</Badge>}
                    {vehicle.pucValid && <Badge variant="outline">PUC Valid</Badge>}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleBookNow(vehicle)}
                    disabled={vehicle.status !== 'available' || !vehicle.adminApproved}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book This Vehicle
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
            <DialogTitle>
              Book {selectedVehicle?.brand} {selectedVehicle?.model}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your taxi booking
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div>
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                value={bookingForm.pickupLocation}
                onChange={(e) => setBookingForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                placeholder="Enter pickup location"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
              <Input
                id="dropoffLocation"
                value={bookingForm.dropoffLocation}
                onChange={(e) => setBookingForm(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                placeholder="Enter drop-off location"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pickupTime">Pickup Time *</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                value={bookingForm.pickupTime}
                onChange={(e) => setBookingForm(prev => ({ ...prev, pickupTime: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedDistance">Estimated Distance (km)</Label>
              <Input
                id="estimatedDistance"
                type="number"
                step="0.1"
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
                placeholder="Any special requirements..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}