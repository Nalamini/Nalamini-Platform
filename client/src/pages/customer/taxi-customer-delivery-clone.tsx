import { useState } from "react";
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
import { Car, MapPin, Clock, Users, Fuel, Plus } from "lucide-react";

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

export default function TaxiCustomerDeliveryClone() {
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
    scheduledDateTime: "",
    estimatedDistance: "",
    specialInstructions: ""
  });
  const { toast } = useToast();

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/taxi/vehicles", selectedLocation.district, selectedLocation.taluk, selectedLocation.pincode],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedLocation.district) params.append('district', selectedLocation.district);
      if (selectedLocation.taluk) params.append('taluk', selectedLocation.taluk);
      if (selectedLocation.pincode) params.append('pincode', selectedLocation.pincode);
      
      return fetch(`/api/taxi/vehicles?${params.toString()}`).then(res => res.json());
    },
    enabled: !!selectedLocation.district,
  });

  const { data: myBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/taxi/my-bookings"],
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      // Create the taxi booking
      const bookingRes = await apiRequest("POST", "/api/taxi/bookings", bookingData);
      const booking = await bookingRes.json();
      
      // Automatically create service request
      const serviceRequestData = {
        serviceType: "taxi",
        amount: bookingData.totalAmount,
        paymentMethod: "razorpay",
        serviceData: {
          pickup: bookingData.pickupLocation,
          dropoff: bookingData.dropoffLocation,
          vehicleType: selectedVehicle?.vehicleType,
          scheduledDateTime: bookingData.scheduledDateTime,
          estimatedDistance: bookingData.estimatedDistance,
          passengerCount: bookingData.passengerCount,
          specialInstructions: bookingData.specialInstructions,
          vehicleId: bookingData.vehicleId,
          bookingId: booking.id
        }
      };
      
      const serviceRes = await apiRequest("POST", "/api/service-requests", serviceRequestData);
      const serviceRequest = await serviceRes.json();
      
      return { booking, serviceRequest };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] });
      setIsBookingModalOpen(false);
      resetBookingForm();
      toast({
        title: "Success",
        description: `Taxi booking created successfully! Service request ${data.serviceRequest.srNumber} has been generated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create taxi booking",
        variant: "destructive",
      });
    },
  });

  const resetBookingForm = () => {
    setBookingForm({
      pickupLocation: "",
      dropoffLocation: "",
      scheduledDateTime: "",
      estimatedDistance: "",
      specialInstructions: ""
    });
    setSelectedVehicle(null);
  };

  const handleLocationSearch = () => {
    if (!selectedLocation.district) {
      toast({
        title: "Validation Error",
        description: "Please select a district to search for vehicles",
        variant: "destructive",
      });
      return;
    }
    // Query will automatically refetch when selectedLocation changes
  };

  const openBookingModal = (vehicle: TaxiVehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingModalOpen(true);
  };

  const calculateTotalFare = () => {
    if (!selectedVehicle) return 0;
    
    const distance = parseFloat(bookingForm.estimatedDistance) || 0;
    
    return selectedVehicle.baseFarePerKm * distance;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      toast({
        title: "Error",
        description: "Vehicle must be selected",
        variant: "destructive",
      });
      return;
    }

    if (!bookingForm.pickupLocation || !bookingForm.dropoffLocation || !bookingForm.scheduledDateTime) {
      toast({
        title: "Validation Error",
        description: "Pickup location, drop-off location, and scheduled time are required",
        variant: "destructive",
      });
      return;
    }

    const distance = parseFloat(bookingForm.estimatedDistance) || 0;
    const estimatedFare = calculateTotalFare();

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
      pickupPincode: selectedLocation.pincode || "600001",
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
                value={selectedLocation.district} 
                onChange={(e) => setSelectedLocation({...selectedLocation, district: e.target.value, taluk: "", pincode: ""})}
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
                value={selectedLocation.taluk}
                onChange={(e) => setSelectedLocation({...selectedLocation, taluk: e.target.value})}
                placeholder="Enter taluk"
              />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input
                value={selectedLocation.pincode}
                onChange={(e) => setSelectedLocation({...selectedLocation, pincode: e.target.value})}
                placeholder="Enter pincode"
              />
            </div>
          </div>
          {selectedLocation.district && (
            <div className="mt-4">
              <Button onClick={handleLocationSearch} className="w-full md:w-auto">
                Search Vehicles
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Vehicles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Vehicles</h2>
        {selectedLocation.district ? (
          <p className="text-muted-foreground mb-4">
            {availableVehicles.length > 0 
              ? `Found ${availableVehicles.length} vehicle(s) in ${selectedLocation.district}${selectedLocation.taluk ? `, ${selectedLocation.taluk}` : ''}${selectedLocation.pincode ? ` - ${selectedLocation.pincode}` : ''}`
              : `No vehicles available in ${selectedLocation.district}${selectedLocation.taluk ? `, ${selectedLocation.taluk}` : ''}${selectedLocation.pincode ? ` - ${selectedLocation.pincode}` : ''}`
            }
          </p>
        ) : (
          <p className="text-muted-foreground mb-4">Please select a district to view available vehicles</p>
        )}

        {!selectedLocation.district ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Select Your Location</h3>
              <p className="text-muted-foreground">
                Choose your district to see available taxi vehicles in your area
              </p>
            </CardContent>
          </Card>
        ) : availableVehicles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Vehicles Available</h3>
              <p className="text-muted-foreground">
                No taxi vehicles found in the selected area. Try a different location.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableVehicles.map((vehicle: TaxiVehicle) => (
              <Card key={vehicle.id} className="relative">
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
                  
                  <div className="text-sm text-muted-foreground">
                    Vehicle: {vehicle.vehicleNumber}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Fare per km</p>
                      <p className="text-lg font-semibold">₹{vehicle.baseFarePerKm}</p>
                    </div>
                    <Button 
                      onClick={() => openBookingModal(vehicle)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Book Now
                    </Button>
                  </div>
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
              {selectedVehicle && `Book ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.vehicleNumber})`}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="space-y-2">
              <Label>Pickup Location *</Label>
              <Textarea
                value={bookingForm.pickupLocation}
                onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value})}
                placeholder="Enter detailed pickup address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Drop-off Location *</Label>
              <Textarea
                value={bookingForm.dropoffLocation}
                onChange={(e) => setBookingForm({...bookingForm, dropoffLocation: e.target.value})}
                placeholder="Enter detailed drop-off address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Scheduled Time *</Label>
              <Input
                type="datetime-local"
                value={bookingForm.scheduledDateTime}
                onChange={(e) => setBookingForm({...bookingForm, scheduledDateTime: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Estimated Distance (km)</Label>
              <Input
                type="number"
                step="0.1"
                value={bookingForm.estimatedDistance}
                onChange={(e) => setBookingForm({...bookingForm, estimatedDistance: e.target.value})}
                placeholder="Enter approximate distance"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={bookingForm.specialInstructions}
                onChange={(e) => setBookingForm({...bookingForm, specialInstructions: e.target.value})}
                placeholder="Any special instructions"
              />
            </div>
            
            {bookingForm.estimatedDistance && selectedVehicle && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estimated Fare:</span>
                  <span className="text-lg font-bold">₹{calculateTotalFare().toFixed(2)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {bookingForm.estimatedDistance} km × ₹{selectedVehicle.baseFarePerKm}/km
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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