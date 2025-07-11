import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlaneIcon, BusIcon, BuildingIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface BusRoute {
  source: string;
  sourceCode: string;
  destination: string;
  destinationCode: string;
}

interface Airport {
  code: string;
  city: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  state: string;
}

export default function TravelBookingSimple() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [popularRoutes, setPopularRoutes] = useState<BusRoute[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [hotelCities, setHotelCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>({});

  // Bus form state
  const [busForm, setBusForm] = useState({
    source_city: "",
    source_code: "",
    destination_city: "",
    destination_code: "",
    travel_date: new Date(),
    passengers: 1
  });

  // Flight form state
  const [flightForm, setFlightForm] = useState({
    originCode: "",
    destinationCode: "",
    departureDate: new Date(),
    returnDate: null as Date | null,
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "ECONOMY",
    tripType: "ONE_WAY"
  });

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    cityCode: "",
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    roomQuantity: 1,
    adults: 2,
    children: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load popular bus routes
      const routesResponse = await apiRequest("GET", "/api/bus/popular-routes");
      const routes = await routesResponse.json();
      setPopularRoutes(routes);

      // Load airports
      const airportsResponse = await apiRequest("GET", "/api/flight/airports");
      const airportData = await airportsResponse.json();
      setAirports(airportData);

      // Load hotel cities
      const citiesResponse = await apiRequest("GET", "/api/hotel/cities");
      const cityData = await citiesResponse.json();
      setHotelCities(cityData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleBusSearch = async () => {
    if (!busForm.source_city || !busForm.destination_city) {
      toast({
        title: "Missing Information",
        description: "Please select both origin and destination cities",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/bus/search", {
        sourceCity: busForm.source_city,
        destinationCity: busForm.destination_city,
        travelDate: format(busForm.travel_date, "yyyy-MM-dd"),
        passengers: busForm.passengers
      });

      const result = await response.json();
      setSearchResults({ buses: result.buses, searchParams: result.searchParams });

      if (!result.buses || result.buses.length === 0) {
        toast({
          title: "No buses found",
          description: "No buses available for the selected route and date",
        });
      }
    } catch (error: any) {
      const errorResponse = await error.response?.json?.() || {};
      
      if (errorResponse.error === "service_unavailable") {
        toast({
          title: "Service Configuration Pending",
          description: "Bus API integration is being set up with RedBus. Please check back soon.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to search buses. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleFlightSearch = async () => {
    if (!flightForm.originCode || !flightForm.destinationCode) {
      toast({
        title: "Missing Information",
        description: "Please select both origin and destination airports",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/flight/search", {
        originCode: flightForm.originCode,
        destinationCode: flightForm.destinationCode,
        departureDate: format(flightForm.departureDate, "yyyy-MM-dd"),
        returnDate: flightForm.returnDate ? format(flightForm.returnDate, "yyyy-MM-dd") : null,
        adults: flightForm.adults,
        children: flightForm.children,
        infants: flightForm.infants,
        travelClass: flightForm.travelClass,
        tripType: flightForm.tripType
      });

      const result = await response.json();
      setSearchResults({ flights: result.flights, searchParams: result.searchParams });

      if (!result.flights || result.flights.length === 0) {
        toast({
          title: "No flights found",
          description: "No flights available for the selected route and date",
        });
      }
    } catch (error: any) {
      const errorResponse = await error.response?.json?.() || {};
      
      if (errorResponse.error === "service_unavailable") {
        toast({
          title: "Service Configuration Pending",
          description: "Flight API integration is being set up with Amadeus. Please check back soon.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to search flights. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleHotelSearch = async () => {
    if (!hotelForm.cityCode || !hotelForm.checkInDate || !hotelForm.checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please select city, check-in date, and check-out date",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/hotel/search", {
        cityCode: hotelForm.cityCode,
        checkInDate: format(hotelForm.checkInDate, "yyyy-MM-dd"),
        checkOutDate: format(hotelForm.checkOutDate, "yyyy-MM-dd"),
        roomQuantity: hotelForm.roomQuantity,
        adults: hotelForm.adults,
        children: hotelForm.children
      });

      const result = await response.json();
      setSearchResults({ hotels: result.hotels, searchParams: result.searchParams });

      if (!result.hotels || result.hotels.length === 0) {
        toast({
          title: "No hotels found",
          description: "No hotels available for the selected city and dates",
        });
      }
    } catch (error: any) {
      const errorResponse = await error.response?.json?.() || {};
      
      if (errorResponse.error === "service_unavailable") {
        toast({
          title: "Service Configuration Pending",
          description: "Hotel API integration is being set up with Amadeus. Please check back soon.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Unable to search hotels. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Services</h1>
        <p className="text-gray-600">Book buses, flights, and hotels across India</p>
      </div>

      {/* Bus Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BusIcon className="h-5 w-5 text-blue-600" />
            Bus Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Popular Routes */}
          {popularRoutes.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Popular Routes</Label>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.slice(0, 6).map((route, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setBusForm({
                      ...busForm,
                      source_city: route.source,
                      source_code: route.sourceCode,
                      destination_city: route.destination,
                      destination_code: route.destinationCode
                    })}
                  >
                    {route.source} → {route.destination}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bus Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bus-from">From</Label>
              <Input
                id="bus-from"
                value={busForm.source_city}
                onChange={(e) => setBusForm({ ...busForm, source_city: e.target.value })}
                placeholder="Origin city"
              />
            </div>
            <div>
              <Label htmlFor="bus-to">To</Label>
              <Input
                id="bus-to"
                value={busForm.destination_city}
                onChange={(e) => setBusForm({ ...busForm, destination_city: e.target.value })}
                placeholder="Destination city"
              />
            </div>
            <div>
              <Label>Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(busForm.travel_date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={busForm.travel_date}
                    onSelect={(date) => date && setBusForm({ ...busForm, travel_date: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="bus-passengers">Passengers</Label>
              <Select
                value={busForm.passengers.toString()}
                onValueChange={(value) => setBusForm({ ...busForm, passengers: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Passengers" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleBusSearch} 
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? "Searching..." : "Search Buses"}
          </Button>
        </CardContent>
      </Card>

      {/* Flight Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlaneIcon className="h-5 w-5 text-green-600" />
            Flight Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="flight-from">From</Label>
              <Select
                value={flightForm.originCode}
                onValueChange={(value) => setFlightForm({ ...flightForm, originCode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Origin airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map(airport => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="flight-to">To</Label>
              <Select
                value={flightForm.destinationCode}
                onValueChange={(value) => setFlightForm({ ...flightForm, destinationCode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Destination airport" />
                </SelectTrigger>
                <SelectContent>
                  {airports.map(airport => (
                    <SelectItem key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(flightForm.departureDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={flightForm.departureDate}
                    onSelect={(date) => date && setFlightForm({ ...flightForm, departureDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="flight-passengers">Passengers</Label>
              <div className="flex gap-2">
                <Select
                  value={flightForm.adults.toString()}
                  onValueChange={(value) => setFlightForm({ ...flightForm, adults: parseInt(value) })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Adult{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleFlightSearch} 
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>

      {/* Hotel Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BuildingIcon className="h-5 w-5 text-purple-600" />
            Hotel Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="hotel-city">City</Label>
              <Select
                value={hotelForm.cityCode}
                onValueChange={(value) => setHotelForm({ ...hotelForm, cityCode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {hotelCities.map(city => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}, {city.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(hotelForm.checkInDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={hotelForm.checkInDate}
                    onSelect={(date) => date && setHotelForm({ ...hotelForm, checkInDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(hotelForm.checkOutDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={hotelForm.checkOutDate}
                    onSelect={(date) => date && setHotelForm({ ...hotelForm, checkOutDate: date })}
                    disabled={(date) => date <= hotelForm.checkInDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="hotel-guests">Guests</Label>
              <Select
                value={hotelForm.adults.toString()}
                onValueChange={(value) => setHotelForm({ ...hotelForm, adults: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleHotelSearch} 
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? "Searching..." : "Search Hotels"}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {(searchResults.buses || searchResults.flights || searchResults.hotels) && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.buses && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bus Results</h3>
                {searchResults.buses.map((bus: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{bus.operatorName}</h4>
                        <p className="text-sm text-gray-600">{bus.busType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{bus.fare}</p>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.flights && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Flight Results</h3>
                {searchResults.flights.map((flight: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{flight.airline}</h4>
                        <p className="text-sm text-gray-600">{flight.aircraft}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{flight.price}</p>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.hotels && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Hotel Results</h3>
                {searchResults.hotels.map((hotel: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{hotel.name}</h4>
                        <p className="text-sm text-gray-600">{hotel.rating} ⭐ | {hotel.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{hotel.price}/night</p>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}