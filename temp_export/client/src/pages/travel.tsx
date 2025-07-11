import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, InfoIcon, LuggageIcon, HotelIcon, BusIcon, PlaneIcon, ExternalLinkIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

// Define types for our travel service
interface BusRoute {
  id: string;
  busOperator: string;
  busType: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  availableSeats: number;
  amenities: string[];
  busNumber: string;
  logo?: string;
}

interface FlightRoute {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  cabinClass: string;
  availableSeats: number;
  stops: number;
  logo?: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  price: number;
  amenities: string[];
  roomTypes: HotelRoomType[];
  images: string[];
  description: string;
}

interface HotelRoomType {
  id: string;
  name: string;
  capacity: number;
  price: number;
  amenities: string[];
  available: number;
}

interface BookingHistory {
  id: number;
  bookingType: string;
  origin?: string;
  destination: string;
  checkIn: string;
  checkOut?: string;
  status: string;
  amount: number;
  createdAt: string;
}

export default function TravelPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("bus");
  
  // Bus search states
  const [busOrigin, setBusOrigin] = useState("");
  const [busDestination, setBusDestination] = useState("");
  const [busDate, setBusDate] = useState("");
  const [busSearchEnabled, setBusSearchEnabled] = useState(false);
  
  // Flight search states
  const [flightOrigin, setFlightOrigin] = useState("");
  const [flightDestination, setFlightDestination] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightSearchEnabled, setFlightSearchEnabled] = useState(false);
  
  // Hotel search states
  const [hotelLocation, setHotelLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [hotelSearchEnabled, setHotelSearchEnabled] = useState(false);
  
  // Booking details states
  const [selectedBus, setSelectedBus] = useState<BusRoute | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightRoute | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [passengerCount, setPassengerCount] = useState<string>("1");
  const [roomCount, setRoomCount] = useState<string>("1");
  const [seatsSelected, setSeatsSelected] = useState<string[]>([]);
  const [passengerDetails, setPassengerDetails] = useState<any[]>([]);
  
  // Provider states for commission tracking
  const [busProvider, setBusProvider] = useState<string>("RedBus");
  const [flightProvider, setFlightProvider] = useState<string>("MakeMyTrip");
  const [hotelProvider, setHotelProvider] = useState<string>("MakeMyTrip");
  
  // Cities data
  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ["/api/travel/cities"],
    enabled: true,
  });
  
  // Bus search results with fallback mock data
  const { data: buses = [], refetch: refetchBuses, isLoading: isLoadingBuses } = useQuery<BusRoute[]>({
    queryKey: ["/api/travel/bus/search", busOrigin, busDestination, busDate, busProvider],
    enabled: busSearchEnabled,
    initialData: busSearchEnabled ? [
      {
        id: "bus1",
        busOperator: "Tamil Nadu Express",
        busType: "AC Sleeper",
        origin: busOrigin || "Chennai",
        destination: busDestination || "Coimbatore",
        departureTime: "21:30",
        arrivalTime: "05:45",
        duration: "8h 15m",
        fare: 850,
        availableSeats: 32,
        amenities: ["Charging Point", "Blanket", "Water Bottle", "CCTV"],
        busNumber: "TN01X6789",
        logo: "https://picsum.photos/200"
      },
      {
        id: "bus2",
        busOperator: "KPN Travels",
        busType: "Non-AC Seater",
        origin: busOrigin || "Chennai",
        destination: busDestination || "Coimbatore",
        departureTime: "22:00",
        arrivalTime: "06:30",
        duration: "8h 30m",
        fare: 650,
        availableSeats: 28,
        amenities: ["Charging Point", "TV"],
        busNumber: "TN02Y1234",
        logo: "https://picsum.photos/200"
      }
    ] : [],
  });
  
  // Flight search results with fallback mock data
  const { data: flights = [], refetch: refetchFlights, isLoading: isLoadingFlights } = useQuery<FlightRoute[]>({
    queryKey: ["/api/travel/flight/search", flightOrigin, flightDestination, flightDate, flightProvider],
    enabled: flightSearchEnabled,
    initialData: flightSearchEnabled ? [
      {
        id: "flight1",
        airline: "IndiGo",
        flightNumber: "6E-7652",
        origin: flightOrigin || "Chennai",
        destination: flightDestination || "Delhi",
        departureTime: "06:15",
        arrivalTime: "09:00",
        duration: "2h 45m",
        fare: 3450,
        cabinClass: "Economy",
        availableSeats: 43,
        stops: 0,
        logo: "https://picsum.photos/200"
      },
      {
        id: "flight2",
        airline: "Air India",
        flightNumber: "AI-802",
        origin: flightOrigin || "Chennai",
        destination: flightDestination || "Delhi",
        departureTime: "09:30",
        arrivalTime: "12:35",
        duration: "3h 05m",
        fare: 4100,
        cabinClass: "Economy",
        availableSeats: 21,
        stops: 0,
        logo: "https://picsum.photos/200"
      }
    ] : [],
  });
  
  // Hotel search results with fallback mock data
  const { data: hotels = [], refetch: refetchHotels, isLoading: isLoadingHotels } = useQuery<Hotel[]>({
    queryKey: ["/api/travel/hotel/search", hotelLocation, checkInDate, checkOutDate, guestCount, hotelProvider],
    enabled: hotelSearchEnabled,
    initialData: hotelSearchEnabled ? [
      {
        id: "hotel1",
        name: "The Park Chennai",
        location: hotelLocation || "Chennai",
        address: "601 Anna Salai, Chennai 600006",
        rating: 4.2,
        price: 5200,
        amenities: ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Gym", "Spa", "Room Service"],
        roomTypes: [
          {
            id: "room1",
            name: "Deluxe Room",
            capacity: 2,
            price: 5200,
            amenities: ["King Bed", "Free Wi-Fi", "Mini Bar"],
            available: 12
          },
          {
            id: "room2",
            name: "Executive Suite",
            capacity: 2,
            price: 7500,
            amenities: ["King Bed", "Free Wi-Fi", "Mini Bar", "Bathtub", "City View"],
            available: 5
          }
        ],
        images: ["https://picsum.photos/800/600", "https://picsum.photos/800/600"],
        description: "A luxury hotel located in the heart of Chennai, offering world-class amenities and services."
      },
      {
        id: "hotel2",
        name: "ITC Grand Chola",
        location: hotelLocation || "Chennai",
        address: "63 Mount Road, Chennai 600032",
        rating: 4.8,
        price: 8500,
        amenities: ["Free Wi-Fi", "Swimming Pool", "Multiple Restaurants", "Gym", "Spa", "Room Service", "Airport Shuttle"],
        roomTypes: [
          {
            id: "room3",
            name: "Executive Club Room",
            capacity: 2,
            price: 8500,
            amenities: ["King Bed", "Free Wi-Fi", "Mini Bar", "Club Access"],
            available: 8
          },
          {
            id: "room4",
            name: "Luxury Suite",
            capacity: 3,
            price: 12500,
            amenities: ["King Bed", "Free Wi-Fi", "Mini Bar", "Bathtub", "City View", "Butler Service"],
            available: 3
          }
        ],
        images: ["https://picsum.photos/800/600", "https://picsum.photos/800/600"],
        description: "A palatial luxury hotel with exquisite architecture and world-class dining options."
      }
    ] : [],
  });
  
  // Booking history
  const { data: bookingHistory = [], refetch: refetchBookings } = useQuery<BookingHistory[]>({
    queryKey: ["/api/travel/bookings"],
    enabled: !!user,
  });
  
  // Reset selections when tab changes
  useEffect(() => {
    setSelectedBus(null);
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedRoomType("");
  }, [activeTab]);
  
  // Handle bus search
  const handleBusSearch = () => {
    if (!busOrigin || !busDestination || !busDate) {
      toast({
        title: "Missing information",
        description: "Please select origin, destination and travel date",
        variant: "destructive",
      });
      return;
    }
    
    // Reset any previous selections
    setSelectedBus(null);
    setSeatsSelected([]);
    
    // Enable search and trigger data fetch
    setBusSearchEnabled(true);
    
    // Force refetch with a small delay to ensure UI updates
    setTimeout(() => {
      refetchBuses();
      
      // Create mock bus results if no results are returned
      if (buses.length === 0) {
        toast({
          title: "Search completed",
          description: "Available buses loaded for your route",
        });
      }
    }, 500);
  };
  
  // Handle flight search
  const handleFlightSearch = () => {
    if (!flightOrigin || !flightDestination || !flightDate) {
      toast({
        title: "Missing information",
        description: "Please select origin, destination and travel date",
        variant: "destructive",
      });
      return;
    }
    
    // Reset any previous selections
    setSelectedFlight(null);
    setPassengerDetails([]);
    
    // Enable search and trigger data fetch
    setFlightSearchEnabled(true);
    
    // Force refetch with a small delay to ensure UI updates
    setTimeout(() => {
      refetchFlights();
      
      // Create mock flight results if no results are returned
      if (flights.length === 0) {
        toast({
          title: "Search completed",
          description: "Available flights loaded for your route",
        });
      }
    }, 500);
  };
  
  // Handle hotel search
  const handleHotelSearch = () => {
    if (!hotelLocation || !checkInDate || !checkOutDate) {
      toast({
        title: "Missing information",
        description: "Please select location, check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }
    
    // Reset any previous selections
    setSelectedHotel(null);
    setSelectedRoomType("");
    setGuestCount("1");
    setRoomCount("1");
    
    // Enable search and trigger data fetch
    setHotelSearchEnabled(true);
    
    // Force refetch with a small delay to ensure UI updates
    setTimeout(() => {
      refetchHotels();
      
      // Create mock hotel results if no results are returned
      if (hotels.length === 0) {
        toast({
          title: "Search completed",
          description: "Available hotels loaded for your location",
        });
      }
    }, 500);
  };
  
  // Book a bus
  const handleBusBooking = async () => {
    if (!selectedBus || !passengerCount || seatsSelected.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a bus, number of passengers, and seat numbers",
        variant: "destructive",
      });
      return;
    }
    
    const passengers = parseInt(passengerCount);
    if (seatsSelected.length !== passengers) {
      toast({
        title: "Seat selection mismatch",
        description: `Please select exactly ${passengers} seats`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch("/api/travel/bus/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busId: selectedBus.id,
          passengers,
          seatNumbers: seatsSelected,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to book bus");
      }
      
      toast({
        title: "Booking Successful",
        description: `Your booking is confirmed with PNR: ${data.pnr}`,
      });
      
      setSelectedBus(null);
      setPassengerCount("1");
      setSeatsSelected([]);
      setBusSearchEnabled(false);
      refetchBookings();
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An error occurred during booking",
        variant: "destructive",
      });
    }
  };
  
  // Book a flight
  const handleFlightBooking = async () => {
    if (!selectedFlight || !passengerCount || passengerDetails.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a flight, number of passengers, and provide passenger details",
        variant: "destructive",
      });
      return;
    }
    
    const passengers = parseInt(passengerCount);
    if (passengerDetails.length !== passengers) {
      toast({
        title: "Passenger details mismatch",
        description: `Please provide details for all ${passengers} passengers`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch("/api/travel/flight/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          passengers,
          passengerDetails,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to book flight");
      }
      
      toast({
        title: "Booking Successful",
        description: `Your booking is confirmed with PNR: ${data.pnr}`,
      });
      
      setSelectedFlight(null);
      setPassengerCount("1");
      setPassengerDetails([]);
      setFlightSearchEnabled(false);
      refetchBookings();
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An error occurred during booking",
        variant: "destructive",
      });
    }
  };
  
  // Book a hotel
  const handleHotelBooking = async () => {
    if (!selectedHotel || !selectedRoomType || !guestCount || !roomCount || !checkInDate || !checkOutDate) {
      toast({
        title: "Missing information",
        description: "Please select a hotel, room type, and provide all booking details",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch("/api/travel/hotel/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          roomTypeId: selectedRoomType,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: parseInt(guestCount),
          rooms: parseInt(roomCount),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to book hotel");
      }
      
      toast({
        title: "Booking Successful",
        description: `Your booking is confirmed with reference: ${data.pnr}`,
      });
      
      setSelectedHotel(null);
      setSelectedRoomType("");
      setGuestCount("1");
      setRoomCount("1");
      setHotelSearchEnabled(false);
      refetchBookings();
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An error occurred during booking",
        variant: "destructive",
      });
    }
  };
  
  // Handle seat selection for bus booking
  const handleSeatSelection = (seatNumber: string) => {
    // If seat is already selected, remove it
    if (seatsSelected.includes(seatNumber)) {
      setSeatsSelected(seatsSelected.filter(seat => seat !== seatNumber));
      
      // Show helpful message if they've unselected a seat
      if (parseInt(passengerCount) > 0) {
        toast({
          title: "Seat unselected",
          description: `Please select ${parseInt(passengerCount) - seatsSelected.length + 1} more seat(s) to continue`,
        });
      }
      return;
    }
    
    // Make sure passenger count is selected before allowing seat selection
    if (!passengerCount || passengerCount === "0") {
      toast({
        title: "Select passenger count first",
        description: "Please select the number of passengers before choosing seats",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we've reached the selection limit
    const maxPassengers = parseInt(passengerCount);
    if (seatsSelected.length >= maxPassengers) {
      // Provide a clearer message about the limitation
      toast({
        title: "Maximum seats already selected",
        description: `You've already selected ${maxPassengers} seats. Unselect a seat first if you want to change your selection.`,
        variant: "destructive",
      });
      return;
    } else {
      // Add the new seat
      setSeatsSelected([...seatsSelected, seatNumber]);
      
      // Notify user about remaining seats to select
      const remaining = maxPassengers - seatsSelected.length - 1;
      if (remaining > 0) {
        toast({
          title: "Seat selected",
          description: `Please select ${remaining} more seat(s) to continue`,
        });
      } else {
        toast({
          title: "All seats selected",
          description: "You're ready to book your tickets",
        });
      }
    }
  };
  
  // Cancel a booking
  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/travel/booking/${bookingId}/cancel`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }
      
      toast({
        title: "Booking Cancelled",
        description: `Your booking has been cancelled and ₹${data.amount} has been refunded to your wallet`,
      });
      
      refetchBookings();
      
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "An error occurred during cancellation",
        variant: "destructive",
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Travel Bookings</h1>
      
      <Tabs defaultValue="bus" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="bus" className="flex items-center gap-2">
            <BusIcon size={16} />
            Bus
          </TabsTrigger>
          <TabsTrigger value="flight" className="flex items-center gap-2">
            <PlaneIcon size={16} />
            Flight
          </TabsTrigger>
          <TabsTrigger value="hotel" className="flex items-center gap-2">
            <HotelIcon size={16} />
            Hotel
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <LuggageIcon size={16} />
            My Bookings
          </TabsTrigger>
        </TabsList>
        
        {/* Bus Booking Tab */}
        <TabsContent value="bus">
          <Card>
            <CardHeader>
              <CardTitle>Book Bus Tickets</CardTitle>
              <CardDescription>Search and book bus tickets to any destination in Tamil Nadu</CardDescription>
            </CardHeader>
            
            <CardContent>
              {!selectedBus ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="bus-origin">Origin</Label>
                      <Select value={busOrigin} onValueChange={setBusOrigin}>
                        <SelectTrigger id="bus-origin">
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bus-destination">Destination</Label>
                      <Select value={busDestination} onValueChange={setBusDestination}>
                        <SelectTrigger id="bus-destination">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bus-date">Date of Journey</Label>
                      <Input
                        id="bus-date"
                        type="date"
                        value={busDate}
                        onChange={(e) => setBusDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="bus-provider">Provider</Label>
                    <Select value={busProvider} onValueChange={setBusProvider}>
                      <SelectTrigger id="bus-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RedBus">RedBus (8-10% commission)</SelectItem>
                        <SelectItem value="AbhiBus">AbhiBus (7-9% commission)</SelectItem>
                        <SelectItem value="PayTM">PayTM (6-8% commission)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">Select provider to view their inventory and prices</p>
                  </div>
                  
                  <Button onClick={handleBusSearch} className="w-full">
                    Search Buses
                  </Button>
                  
                  {isLoadingBuses && (
                    <div className="flex justify-center my-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  
                  {busSearchEnabled && !isLoadingBuses && buses.length === 0 && (
                    <div className="text-center my-8 text-muted-foreground">
                      No buses found for the selected route and date
                    </div>
                  )}
                  
                  {busSearchEnabled && !isLoadingBuses && buses.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium">Available Buses ({buses.length})</h3>
                      
                      {buses.map((bus) => (
                        <Card key={bus.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {bus.logo && (
                                  <img src={bus.logo} alt={bus.busOperator} className="h-8 w-8 object-contain" />
                                )}
                                <div>
                                  <CardTitle className="text-lg">{bus.busOperator}</CardTitle>
                                  <CardDescription>{bus.busType}</CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">₹{bus.fare}</div>
                                <CardDescription>per seat</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                              <div className="flex flex-col">
                                <span className="text-lg font-medium">{bus.departureTime}</span>
                                <span className="text-muted-foreground text-sm">{bus.origin}</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <span className="text-sm text-muted-foreground">{bus.duration}</span>
                                <div className="w-full flex items-center">
                                  <div className="h-0.5 flex-1 bg-border"></div>
                                  <ClockIcon size={16} className="mx-2 text-muted-foreground" />
                                  <div className="h-0.5 flex-1 bg-border"></div>
                                </div>
                                <span className="text-sm text-muted-foreground">Bus No: {bus.busNumber}</span>
                              </div>
                              
                              <div className="flex flex-col text-right">
                                <span className="text-lg font-medium">{bus.arrivalTime}</span>
                                <span className="text-muted-foreground text-sm">{bus.destination}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-4">
                              {bus.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                {bus.availableSeats} seats available
                              </span>
                              <Button onClick={() => setSelectedBus(bus)}>Select Bus</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Booking Details</h3>
                    <Button variant="outline" onClick={() => setSelectedBus(null)}>
                      Back to Search
                    </Button>
                  </div>
                  
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {selectedBus.logo && (
                            <img src={selectedBus.logo} alt={selectedBus.busOperator} className="h-8 w-8 object-contain" />
                          )}
                          <CardTitle>{selectedBus.busOperator}</CardTitle>
                        </div>
                        <div className="text-xl font-bold">₹{selectedBus.fare}</div>
                      </div>
                      <CardDescription>{selectedBus.busType} | {selectedBus.busNumber}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-medium">{selectedBus.departureTime}</span>
                          <span className="text-muted-foreground text-sm">{selectedBus.origin}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">{selectedBus.duration}</span>
                          <div className="w-full flex items-center">
                            <div className="h-0.5 flex-1 bg-border"></div>
                            <ClockIcon size={16} className="mx-2 text-muted-foreground" />
                            <div className="h-0.5 flex-1 bg-border"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{busDate}</span>
                        </div>
                        
                        <div className="flex flex-col text-right">
                          <span className="text-lg font-medium">{selectedBus.arrivalTime}</span>
                          <span className="text-muted-foreground text-sm">{selectedBus.destination}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Passenger Information</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="passenger-count">Number of Passengers</Label>
                          <Select 
                            value={passengerCount} 
                            onValueChange={(value) => {
                              setPassengerCount(value);
                              // Reset seat selection when passenger count changes
                              setSeatsSelected([]);
                            }}
                          >
                            <SelectTrigger id="passenger-count">
                              <SelectValue placeholder="Select passengers" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((count) => (
                                <SelectItem key={count} value={count.toString()}>
                                  {count} {count === 1 ? 'passenger' : 'passengers'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium mb-4">Seat Selection ({seatsSelected.length}/{passengerCount})</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 40 }, (_, i) => {
                          const seatNumber = `A${i + 1}`;
                          const isSelected = seatsSelected.includes(seatNumber);
                          return (
                            <Button
                              key={i}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSeatSelection(seatNumber)}
                              className="h-10"
                            >
                              {seatNumber}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Fare Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Base Fare ({passengerCount} x ₹{selectedBus.fare})</span>
                            <span>₹{parseInt(passengerCount) * selectedBus.fare}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Fee</span>
                            <span>₹50</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Provider: {busProvider}</span>
                            <span>Commission: 8-10%</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total Amount</span>
                            <span>₹{parseInt(passengerCount) * selectedBus.fare + 50}</span>
                          </div>
                          <div className="mt-1 text-sm text-blue-500">
                            {seatsSelected.length < parseInt(passengerCount) ? 
                              `Please select ${parseInt(passengerCount) - seatsSelected.length} more seat(s) to continue` : 
                              'All seats selected! You can now book.'}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="space-y-3">
                          {(passengerCount && parseInt(passengerCount) !== seatsSelected.length) && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Seat selection mismatch</AlertTitle>
                              <AlertDescription>
                                You've selected {passengerCount} passengers but only {seatsSelected.length} seats. 
                                Please select {parseInt(passengerCount) - seatsSelected.length} more seat(s).
                              </AlertDescription>
                            </Alert>
                          )}
                          <Button 
                            onClick={handleBusBooking} 
                            className="w-full" 
                            disabled={!passengerCount || parseInt(passengerCount) !== seatsSelected.length}
                          >
                            Pay using Wallet & Confirm Booking (₹{parseInt(passengerCount || "0") * selectedBus.fare + 50})
                          </Button>
                          {!passengerCount && (
                            <p className="text-sm text-muted-foreground text-center">Please select the number of passengers</p>
                          )}
                          {(passengerCount && seatsSelected.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center">Please select {passengerCount} seat(s)</p>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Flight Booking Tab */}
        <TabsContent value="flight">
          <Card>
            <CardHeader>
              <CardTitle>Book Flight Tickets</CardTitle>
              <CardDescription>Search and book flight tickets for domestic travel</CardDescription>
            </CardHeader>
            
            <CardContent>
              {!selectedFlight ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="flight-origin">Origin</Label>
                      <Select value={flightOrigin} onValueChange={setFlightOrigin}>
                        <SelectTrigger id="flight-origin">
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flight-destination">Destination</Label>
                      <Select value={flightDestination} onValueChange={setFlightDestination}>
                        <SelectTrigger id="flight-destination">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flight-date">Date of Journey</Label>
                      <Input
                        id="flight-date"
                        type="date"
                        value={flightDate}
                        onChange={(e) => setFlightDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="flight-provider">Provider</Label>
                    <Select value={flightProvider} onValueChange={setFlightProvider}>
                      <SelectTrigger id="flight-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MakeMyTrip">MakeMyTrip (6-8% commission)</SelectItem>
                        <SelectItem value="Cleartrip">Cleartrip (5-7% commission)</SelectItem>
                        <SelectItem value="EaseMyTrip">EaseMyTrip (7-9% commission)</SelectItem>
                        <SelectItem value="Goibibo">Goibibo (5-8% commission)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">Select provider to view their inventory and prices</p>
                  </div>
                  
                  <Button onClick={handleFlightSearch} className="w-full">
                    Search Flights
                  </Button>
                  
                  {isLoadingFlights && (
                    <div className="flex justify-center my-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  
                  {flightSearchEnabled && !isLoadingFlights && flights.length === 0 && (
                    <div className="text-center my-8 text-muted-foreground">
                      No flights found for the selected route and date
                    </div>
                  )}
                  
                  {flightSearchEnabled && !isLoadingFlights && flights.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium">Available Flights ({flights.length})</h3>
                      
                      {flights.map((flight) => (
                        <Card key={flight.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {flight.logo && (
                                  <img src={flight.logo} alt={flight.airline} className="h-8 w-8 object-contain" />
                                )}
                                <div>
                                  <CardTitle className="text-lg">{flight.airline}</CardTitle>
                                  <CardDescription>{flight.flightNumber} • {flight.cabinClass}</CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">₹{flight.fare}</div>
                                <CardDescription>per passenger</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                              <div className="flex flex-col">
                                <span className="text-lg font-medium">{flight.departureTime}</span>
                                <span className="text-muted-foreground text-sm">{flight.origin}</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <span className="text-sm text-muted-foreground">{flight.duration}</span>
                                <div className="w-full flex items-center">
                                  <div className="h-0.5 flex-1 bg-border"></div>
                                  <PlaneIcon size={16} className="mx-2 text-muted-foreground" />
                                  <div className="h-0.5 flex-1 bg-border"></div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                                </span>
                              </div>
                              
                              <div className="flex flex-col text-right">
                                <span className="text-lg font-medium">{flight.arrivalTime}</span>
                                <span className="text-muted-foreground text-sm">{flight.destination}</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                {flight.availableSeats} seats available
                              </span>
                              <Button onClick={() => setSelectedFlight(flight)}>Select Flight</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Booking Details</h3>
                    <Button variant="outline" onClick={() => setSelectedFlight(null)}>
                      Back to Search
                    </Button>
                  </div>
                  
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {selectedFlight.logo && (
                            <img src={selectedFlight.logo} alt={selectedFlight.airline} className="h-8 w-8 object-contain" />
                          )}
                          <CardTitle>{selectedFlight.airline}</CardTitle>
                        </div>
                        <div className="text-xl font-bold">₹{selectedFlight.fare}</div>
                      </div>
                      <CardDescription>{selectedFlight.flightNumber} • {selectedFlight.cabinClass}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div className="flex flex-col">
                          <span className="text-lg font-medium">{selectedFlight.departureTime}</span>
                          <span className="text-muted-foreground text-sm">{selectedFlight.origin}</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">{selectedFlight.duration}</span>
                          <div className="w-full flex items-center">
                            <div className="h-0.5 flex-1 bg-border"></div>
                            <PlaneIcon size={16} className="mx-2 text-muted-foreground" />
                            <div className="h-0.5 flex-1 bg-border"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{flightDate}</span>
                        </div>
                        
                        <div className="flex flex-col text-right">
                          <span className="text-lg font-medium">{selectedFlight.arrivalTime}</span>
                          <span className="text-muted-foreground text-sm">{selectedFlight.destination}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4">Passenger Information</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="passenger-count-flight">Number of Passengers</Label>
                        <Select 
                          value={passengerCount} 
                          onValueChange={(value) => {
                            setPassengerCount(value);
                            // Initialize passenger details array
                            setPassengerDetails(Array(parseInt(value)).fill({
                              name: "",
                              age: "",
                              gender: "",
                            }));
                          }}
                        >
                          <SelectTrigger id="passenger-count-flight">
                            <SelectValue placeholder="Select passengers" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((count) => (
                              <SelectItem key={count} value={count.toString()}>
                                {count} {count === 1 ? 'passenger' : 'passengers'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {parseInt(passengerCount) > 0 && (
                        <div className="space-y-4">
                          {Array.from({ length: parseInt(passengerCount) }).map((_, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle className="text-base">Passenger {index + 1}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <Label htmlFor={`passenger-name-${index}`}>Full Name</Label>
                                  <Input
                                    id={`passenger-name-${index}`}
                                    placeholder="Enter full name as per ID"
                                    onChange={(e) => {
                                      const newDetails = [...passengerDetails];
                                      newDetails[index] = {
                                        ...newDetails[index],
                                        name: e.target.value,
                                      };
                                      setPassengerDetails(newDetails);
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`passenger-age-${index}`}>Age</Label>
                                    <Input
                                      id={`passenger-age-${index}`}
                                      placeholder="Age"
                                      type="number"
                                      onChange={(e) => {
                                        const newDetails = [...passengerDetails];
                                        newDetails[index] = {
                                          ...newDetails[index],
                                          age: e.target.value,
                                        };
                                        setPassengerDetails(newDetails);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`passenger-gender-${index}`}>Gender</Label>
                                    <Select
                                      onValueChange={(value) => {
                                        const newDetails = [...passengerDetails];
                                        newDetails[index] = {
                                          ...newDetails[index],
                                          gender: value,
                                        };
                                        setPassengerDetails(newDetails);
                                      }}
                                    >
                                      <SelectTrigger id={`passenger-gender-${index}`}>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Fare Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Base Fare ({passengerCount} x ₹{selectedFlight.fare})</span>
                            <span>₹{parseInt(passengerCount) * selectedFlight.fare}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>₹{parseInt(passengerCount) * 500}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Provider: {flightProvider}</span>
                            <span>Commission: 6-8%</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total Amount</span>
                            <span>₹{parseInt(passengerCount) * (selectedFlight.fare + 500)}</span>
                          </div>
                          <div className="mt-1 text-sm text-blue-500">
                            {passengerDetails.filter(p => p.name && p.age && p.gender).length < parseInt(passengerCount) ? 
                              `Please complete details for all ${passengerCount} passenger(s) to continue` : 
                              'All passenger details complete! You can now book.'}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={handleFlightBooking} 
                          className="w-full" 
                          disabled={passengerDetails.filter(p => p.name && p.age && p.gender).length < parseInt(passengerCount)}
                        >
                          Pay using Wallet & Confirm Booking (₹{parseInt(passengerCount) * (selectedFlight.fare + 500)})
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Hotel Booking Tab */}
        <TabsContent value="hotel">
          <Card>
            <CardHeader>
              <CardTitle>Book Hotels</CardTitle>
              <CardDescription>Search and book hotels for your stay</CardDescription>
            </CardHeader>
            
            <CardContent>
              {!selectedHotel ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="hotel-location">Location</Label>
                      <Select value={hotelLocation} onValueChange={setHotelLocation}>
                        <SelectTrigger id="hotel-location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="check-in">Check-in Date</Label>
                      <Input
                        id="check-in"
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="check-out">Check-out Date</Label>
                      <Input
                        id="check-out"
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guests">Guests</Label>
                      <Select value={guestCount} onValueChange={setGuestCount}>
                        <SelectTrigger id="guests">
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} {count === 1 ? 'guest' : 'guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="hotel-provider">Provider</Label>
                    <Select value={hotelProvider} onValueChange={setHotelProvider}>
                      <SelectTrigger id="hotel-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MakeMyTrip">MakeMyTrip (10-12% commission)</SelectItem>
                        <SelectItem value="Cleartrip">Cleartrip (8-10% commission)</SelectItem>
                        <SelectItem value="Goibibo">Goibibo (9-11% commission)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">Select provider to view their inventory and prices</p>
                  </div>
                  
                  <Button onClick={handleHotelSearch} className="w-full">
                    Search Hotels
                  </Button>
                  
                  {isLoadingHotels && (
                    <div className="flex justify-center my-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  
                  {hotelSearchEnabled && !isLoadingHotels && hotels.length === 0 && (
                    <div className="text-center my-8 text-muted-foreground">
                      No hotels found for the selected location and dates
                    </div>
                  )}
                  
                  {hotelSearchEnabled && !isLoadingHotels && hotels.length > 0 && (
                    <div className="mt-8 space-y-6">
                      <h3 className="text-lg font-medium">Available Hotels ({hotels.length})</h3>
                      
                      {hotels.map((hotel) => (
                        <Card key={hotel.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="md:flex">
                            <div className="md:w-1/3">
                              {hotel.images && hotel.images.length > 0 && (
                                <img 
                                  src={hotel.images[0]} 
                                  alt={hotel.name} 
                                  className="h-full w-full object-cover aspect-video md:aspect-square"
                                />
                              )}
                            </div>
                            
                            <div className="md:w-2/3">
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-xl">{hotel.name}</CardTitle>
                                    <div className="flex items-center mt-1">
                                      <MapPinIcon size={14} className="text-muted-foreground mr-1" />
                                      <CardDescription className="text-sm">{hotel.address}</CardDescription>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Badge>{hotel.rating} ★</Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              
                              <CardContent className="pb-2">
                                <p className="text-sm mb-4 line-clamp-2">{hotel.description}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {hotel.amenities.slice(0, 5).map((amenity, index) => (
                                    <Badge key={index} variant="outline">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {hotel.amenities.length > 5 && (
                                    <Badge variant="outline">+{hotel.amenities.length - 5} more</Badge>
                                  )}
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-xl font-bold">₹{hotel.price}</span>
                                    <span className="text-sm text-muted-foreground"> / night</span>
                                  </div>
                                  <Button onClick={() => setSelectedHotel(hotel)}>
                                    Select Hotel
                                  </Button>
                                </div>
                              </CardContent>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Booking Details</h3>
                    <Button variant="outline" onClick={() => setSelectedHotel(null)}>
                      Back to Search
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedHotel.name}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center">
                              <MapPinIcon size={14} className="text-muted-foreground mr-1" />
                              {selectedHotel.address}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {selectedHotel.images.map((image, index) => (
                              <img 
                                key={index} 
                                src={image} 
                                alt={`${selectedHotel.name} image ${index + 1}`} 
                                className="rounded-md aspect-video object-cover w-full"
                              />
                            ))}
                          </div>
                          
                          <p className="text-sm mb-4">{selectedHotel.description}</p>
                          
                          <div>
                            <h4 className="font-medium mb-2">Amenities</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedHotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Check-in</span>
                              <span className="font-medium">{formatDate(checkInDate)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Check-out</span>
                              <span className="font-medium">{formatDate(checkOutDate)}</span>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="room-type">Room Type</Label>
                            <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                              <SelectTrigger id="room-type">
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedHotel.roomTypes.map((roomType) => (
                                  <SelectItem key={roomType.id} value={roomType.id}>
                                    {roomType.name} - ₹{roomType.price}/night
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="room-count">Rooms</Label>
                              <Select value={roomCount} onValueChange={setRoomCount}>
                                <SelectTrigger id="room-count">
                                  <SelectValue placeholder="Select rooms" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((count) => (
                                    <SelectItem key={count} value={count.toString()}>
                                      {count} {count === 1 ? 'room' : 'rooms'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="hotel-guests">Guests</Label>
                              <Select value={guestCount} onValueChange={setGuestCount}>
                                <SelectTrigger id="hotel-guests">
                                  <SelectValue placeholder="Select guests" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6].map((count) => (
                                    <SelectItem key={count} value={count.toString()}>
                                      {count} {count === 1 ? 'guest' : 'guests'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {selectedRoomType && (
                        <Card className="mt-4">
                          <CardHeader>
                            <CardTitle>Price Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {(() => {
                              const selectedRoom = selectedHotel.roomTypes.find(
                                (room) => room.id === selectedRoomType
                              );
                              
                              if (!selectedRoom) return null;
                              
                              // Calculate number of nights
                              const checkInDateObj = new Date(checkInDate);
                              const checkOutDateObj = new Date(checkOutDate);
                              const nights = Math.ceil(
                                (checkOutDateObj.getTime() - checkInDateObj.getTime()) / 
                                (1000 * 60 * 60 * 24)
                              );
                              
                              const roomPrice = selectedRoom.price;
                              const totalRoomPrice = roomPrice * parseInt(roomCount) * nights;
                              const taxesAndFees = Math.round(totalRoomPrice * 0.12); // 12% tax
                              const totalAmount = totalRoomPrice + taxesAndFees;
                              
                              return (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>
                                      {selectedRoom.name} x {roomCount} x {nights} nights
                                    </span>
                                    <span>₹{totalRoomPrice}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Taxes & Fees</span>
                                    <span>₹{taxesAndFees}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Provider: {hotelProvider}</span>
                                    <span>Commission: 10-12%</span>
                                  </div>
                                  <Separator className="my-2" />
                                  <div className="flex justify-between font-bold">
                                    <span>Total Amount</span>
                                    <span>₹{totalAmount}</span>
                                  </div>
                                  <div className="mt-1 text-sm text-blue-500">
                                    {!selectedRoomType || !roomCount || !guestCount ? 
                                      "Please select all options to continue" : 
                                      "All set! You can now book."}
                                  </div>
                                  
                                  <Button 
                                    onClick={handleHotelBooking} 
                                    className="w-full mt-4"
                                    disabled={!selectedRoomType || !roomCount || !guestCount}
                                  >
                                    Pay using Wallet & Confirm Booking (₹{totalAmount})
                                  </Button>
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* My Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View and manage all your travel bookings</CardDescription>
            </CardHeader>
            
            <CardContent>
              {bookingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <LuggageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No bookings found</h3>
                  <p className="text-muted-foreground">You haven't made any travel bookings yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookingHistory.map((booking) => (
                    <Card key={booking.id} className="group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              {booking.bookingType === 'bus' && <BusIcon size={16} />}
                              {booking.bookingType === 'flight' && <PlaneIcon size={16} />}
                              {booking.bookingType === 'hotel' && <HotelIcon size={16} />}
                              <CardTitle className="capitalize">{booking.bookingType} Booking</CardTitle>
                            </div>
                            <CardDescription>
                              {formatDate(booking.createdAt)}
                            </CardDescription>
                          </div>
                          <Badge className={booking.status === 'confirmed' ? 'bg-green-500' : 
                                           booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                          {booking.origin && (
                            <div>
                              <span className="text-sm text-muted-foreground">From</span>
                              <p className="font-medium">{booking.origin}</p>
                            </div>
                          )}
                          
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {booking.bookingType === 'hotel' ? 'Location' : 'To'}
                            </span>
                            <p className="font-medium">{booking.destination}</p>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {booking.bookingType === 'hotel' ? 'Check-in' : 'Date'}
                            </span>
                            <p className="font-medium">{formatDate(booking.checkIn)}</p>
                          </div>
                          
                          {booking.checkOut && (
                            <div>
                              <span className="text-sm text-muted-foreground">Check-out</span>
                              <p className="font-medium">{formatDate(booking.checkOut)}</p>
                            </div>
                          )}
                          
                          <div>
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <p className="font-medium">₹{booking.amount}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setLocation(`/booking/${booking.id}`)}
                          >
                            <ExternalLinkIcon size={14} /> View Details
                          </Button>
                          
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}