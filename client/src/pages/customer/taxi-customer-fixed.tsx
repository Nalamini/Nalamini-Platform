import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Car, MapPin, Clock, Users, Fuel } from "lucide-react";

interface TaxiVehicle {
  id: number;
  providerId: number;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  seatingCapacity: number;
  fuelType: string;
  acAvailable: boolean;
  baseFarePerKm: number;
  district: string;
  pincode: string;
  currentLocation: string;
  status: string;
  adminApproved: boolean;
}

interface TaxiBooking {
  id: number;
  customerId: number;
  vehicleId: number;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDateTime: string;
  estimatedDistance: number;
  estimatedFare: number;
  status: string;
  specialInstructions: string;
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

export default function TaxiCustomerFixed() {
  // Separate state for form inputs
  const [districtValue, setDistrictValue] = useState("");
  const [talukValue, setTalukValue] = useState("");
  const [pincodeValue, setPincodeValue] = useState("");
  
  // Debounced search state
  const [searchFilters, setSearchFilters] = useState({
    district: "",
    taluk: "",
    pincode: ""
  });
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TaxiVehicle | null>(null);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    scheduledDateTime: "",
    estimatedDistance: "",
    specialInstructions: ""
  });
  
  const { toast } = useToast();
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce search filters to prevent constant re-renders
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setSearchFilters({
        district: districtValue,
        taluk: talukValue,
        pincode: pincodeValue
      });
    }, 300);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [districtValue, talukValue, pincodeValue]);

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles", searchFilters.district, searchFilters.taluk, searchFilters.pincode],
    queryFn: async () => {
      let url = "/api/taxi/vehicles";
      const params = new URLSearchParams();
      if (searchFilters.district) params.append("district", searchFilters.district);
      if (searchFilters.taluk) params.append("taluk", searchFilters.taluk);
      if (searchFilters.pincode) params.append("pincode", searchFilters.pincode);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await apiRequest("GET", url);
      return res.json();
    }
  });

  const { data: myBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/taxi/my-bookings"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/taxi/my-bookings");
        return res.json();
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    }
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/taxi/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/my-bookings"] });
      toast({
        title: "Booking Created",
        description: "Your taxi booking has been created successfully!",
      });
      setIsBookingModalOpen(false);
      setBookingForm({
        pickupLocation: "",
        dropoffLocation: "",
        scheduledDateTime: "",
        estimatedDistance: "",
        specialInstructions: ""
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

  const handleCreateBooking = () => {
    if (!selectedVehicle) return;
    
    const distance = parseFloat(bookingForm.estimatedDistance) || 0;
    const estimatedFare = distance * selectedVehicle.baseFarePerKm;
    
    const bookingData = {
      vehicleId: selectedVehicle.id,
      providerId: selectedVehicle.providerId,
      pickupLocation: bookingForm.pickupLocation,
      dropoffLocation: bookingForm.dropoffLocation,
      scheduledDateTime: bookingForm.scheduledDateTime,
      estimatedDistance: distance,
      estimatedFare: estimatedFare,
      specialInstructions: bookingForm.specialInstructions,
      bookingType: "scheduled",
      pickupPincode: pincodeValue || "600001",
      dropoffPincode: "600002",
      totalAmount: estimatedFare,
      passengerCount: 1
    };
    
    createBookingMutation.mutate(bookingData);
  };

  const availableVehicles = vehicles.filter((vehicle: TaxiVehicle) => 
    vehicle.adminApproved && vehicle.status === 'available'
  );

  if (vehiclesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading taxi services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Taxi Booking Service</h1>
        <p className="text-muted-foreground">Book reliable taxi services in your area</p>
      </div>

      {/* Location Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Your Location</CardTitle>
          <CardDescription>Choose your pickup area to find available vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>District</Label>
              <select 
                value={districtValue}
                onChange={(e) => {
                  setDistrictValue(e.target.value);
                  setTalukValue("");
                  setPincodeValue("");
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select District</option>
                {TAMIL_NADU_DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Taluk</Label>
              <Input
                value={talukValue}
                onChange={(e) => setTalukValue(e.target.value)}
                placeholder="Enter taluk"
              />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input
                value={pincodeValue}
                onChange={(e) => setPincodeValue(e.target.value)}
                placeholder="Enter pincode"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Vehicles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Vehicles</h2>
        {searchFilters.district ? (
          <p className="text-muted-foreground mb-4">
            Found {availableVehicles.length} vehicle(s) in {searchFilters.district}
            {searchFilters.taluk && `, ${searchFilters.taluk}`}
            {searchFilters.pincode && ` - ${searchFilters.pincode}`}
          </p>
        ) : (
          <p className="text-muted-foreground mb-4">Please select a district to view available vehicles</p>
        )}

        {availableVehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No vehicles available</h3>
              <p className="text-muted-foreground">
                {searchFilters.district 
                  ? "No vehicles found in the selected area. Try a different location." 
                  : "Please select your district to view available vehicles."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableVehicles.map((vehicle: TaxiVehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {vehicle.brand} {vehicle.model}
                    </CardTitle>
                    <Badge variant="default">Available</Badge>
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
                    <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedVehicle(vehicle)}>
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Book Taxi</DialogTitle>
                          <DialogDescription>
                            Book {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.vehicleNumber})
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Pickup Location</Label>
                            <Textarea
                              value={bookingForm.pickupLocation}
                              onChange={(e) => setBookingForm(prev => ({...prev, pickupLocation: e.target.value}))}
                              placeholder="Enter detailed pickup address"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Drop-off Location</Label>
                            <Textarea
                              value={bookingForm.dropoffLocation}
                              onChange={(e) => setBookingForm(prev => ({...prev, dropoffLocation: e.target.value}))}
                              placeholder="Enter detailed drop-off address"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Pickup Time</Label>
                            <Input
                              type="datetime-local"
                              value={bookingForm.scheduledDateTime}
                              onChange={(e) => setBookingForm(prev => ({...prev, scheduledDateTime: e.target.value}))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Estimated Distance (km)</Label>
                            <Input
                              type="number"
                              value={bookingForm.estimatedDistance}
                              onChange={(e) => setBookingForm(prev => ({...prev, estimatedDistance: e.target.value}))}
                              placeholder="Enter approximate distance"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Special Instructions</Label>
                            <Textarea
                              value={bookingForm.specialInstructions}
                              onChange={(e) => setBookingForm(prev => ({...prev, specialInstructions: e.target.value}))}
                              placeholder="Any special instructions"
                            />
                          </div>
                          
                          {bookingForm.estimatedDistance && selectedVehicle && (
                            <div className="p-3 bg-muted rounded-md">
                              <p className="text-sm font-medium">Estimated Fare</p>
                              <p className="text-lg font-bold">
                                ₹{(parseFloat(bookingForm.estimatedDistance) * selectedVehicle.baseFarePerKm).toFixed(2)}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleCreateBooking}
                              disabled={createBookingMutation.isPending}
                            >
                              {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* My Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {bookingsLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : myBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No bookings yet. Book your first taxi above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myBookings.map((booking: TaxiBooking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'completed' ? 'secondary' :
                      booking.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{booking.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Drop-off</p>
                      <p className="text-sm text-muted-foreground">{booking.dropoffLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(booking.scheduledDateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {booking.estimatedDistance} km
                    </span>
                    <span className="font-semibold">₹{booking.estimatedFare}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}