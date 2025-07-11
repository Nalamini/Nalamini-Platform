import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlaneIcon, BusIcon, BuildingIcon, ClockIcon, UsersIcon, MapPinIcon } from "lucide-react";
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

interface SearchResults {
  buses?: any[];
  flights?: any[];
  hotels?: any[];
  searchParams?: any;
}

export default function TravelBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("bus");
  const [popularRoutes, setPopularRoutes] = useState<BusRoute[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults>({});
  const [isSearching, setIsSearching] = useState(false);

  // Bus search form
  const [busForm, setBusForm] = useState({
    source_city: "",
    source_code: "",
    destination_city: "",
    destination_code: "",
    depart_date: null as Date | null
  });

  // Flight search form
  const [flightForm, setFlightForm] = useState({
    origin: "",
    destination: "",
    departureDate: null as Date | null,
    returnDate: null as Date | null,
    tripType: "one_way",
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "ECONOMY"
  });

  // Hotel search form
  const [hotelForm, setHotelForm] = useState({
    cityCode: "",
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    roomQuantity: 1,
    adults: 2,
    children: 0
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load bus routes
        const busResponse = await apiRequest("GET", "/api/bus/popular-routes");
        const busRoutes = await busResponse.json();
        setPopularRoutes(busRoutes);

        // Load airports
        const airportResponse = await apiRequest("GET", "/api/flight/airports");
        const airportData = await airportResponse.json();
        setAirports(airportData);

        // Load cities for hotels
        const cityResponse = await apiRequest("GET", "/api/hotel/cities");
        const cityData = await cityResponse.json();
        setCities(cityData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleBusSearch = async () => {
    if (!busForm.source_code || !busForm.destination_code || !busForm.depart_date) {
      toast({
        title: "Missing Information",
        description: "Please select origin, destination, and travel date",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/bus/search", {
        source_city: busForm.source_city,
        source_code: busForm.source_code,
        destination_city: busForm.destination_city,
        destination_code: busForm.destination_code,
        depart_date: format(busForm.depart_date, "yyyy-MM-dd")
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
          description: "RedBus API integration is being set up. Please check back soon for live bus booking.",
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
    if (!flightForm.origin || !flightForm.destination || !flightForm.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please select origin, destination, and departure date",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/flight/search", {
        origin: flightForm.origin,
        destination: flightForm.destination,
        departureDate: format(flightForm.departureDate, "yyyy-MM-dd"),
        returnDate: flightForm.returnDate ? format(flightForm.returnDate, "yyyy-MM-dd") : undefined,
        adults: flightForm.adults,
        children: flightForm.children,
        infants: flightForm.infants,
        travelClass: flightForm.travelClass
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
          description: "Flight API integration is being set up. Please check back soon for live flight booking.",
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
          description: "Hotel API integration is being set up. Please check back soon for live hotel booking.",
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

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to readable format
    const matches = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = matches?.[1] ? parseInt(matches[1]) : 0;
    const minutes = matches?.[2] ? parseInt(matches[2]) : 0;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Booking</h1>
        <p className="text-gray-600">Book buses, flights, and hotels across India</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bus" className="flex items-center gap-2">
            <BusIcon className="h-4 w-4" />
            Bus
          </TabsTrigger>
          <TabsTrigger value="flight" className="flex items-center gap-2">
            <PlaneIcon className="h-4 w-4" />
            Flight
          </TabsTrigger>
          <TabsTrigger value="hotel" className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4" />
            Hotel
          </TabsTrigger>
        </TabsList>

        {/* Bus Booking Tab */}
        <TabsContent value="bus" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BusIcon className="h-5 w-5" />
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
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
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

              {/* Search Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {busForm.depart_date ? format(busForm.depart_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={busForm.depart_date || undefined}
                        onSelect={(date) => setBusForm({ ...busForm, depart_date: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button onClick={handleBusSearch} disabled={isSearching} className="w-full">
                {isSearching ? "Searching..." : "Search Buses"}
              </Button>

              {/* Bus Results */}
              {searchResults.buses && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Buses</h3>
                  {searchResults.buses.map((bus, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{bus.travels}</h4>
                            <p className="text-sm text-gray-600">{bus.busType}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {formatTime(bus.departureTime)} - {formatTime(bus.arrivalTime)}
                              </span>
                              <span>{bus.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">₹{bus.fare}</p>
                            <p className="text-sm text-gray-600">{bus.availableSeats} seats left</p>
                            <Button className="mt-2">Select Seats</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flight Booking Tab */}
        <TabsContent value="flight" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlaneIcon className="h-5 w-5" />
                Flight Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Type Selection */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="one_way"
                    checked={flightForm.tripType === "one_way"}
                    onChange={(e) => setFlightForm({ ...flightForm, tripType: e.target.value })}
                  />
                  One Way
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    value="round_trip"
                    checked={flightForm.tripType === "round_trip"}
                    onChange={(e) => setFlightForm({ ...flightForm, tripType: e.target.value })}
                  />
                  Round Trip
                </label>
              </div>

              {/* Search Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="flight-from">From</Label>
                  <Select value={flightForm.origin} onValueChange={(value) => setFlightForm({ ...flightForm, origin: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airport" />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          {airport.city} ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="flight-to">To</Label>
                  <Select value={flightForm.destination} onValueChange={(value) => setFlightForm({ ...flightForm, destination: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select airport" />
                    </SelectTrigger>
                    <SelectContent>
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          {airport.city} ({airport.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Departure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flightForm.departureDate ? format(flightForm.departureDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flightForm.departureDate || undefined}
                        onSelect={(date) => setFlightForm({ ...flightForm, departureDate: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {flightForm.tripType === "round_trip" && (
                  <div>
                    <Label>Return</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flightForm.returnDate ? format(flightForm.returnDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={flightForm.returnDate || undefined}
                          onSelect={(date) => setFlightForm({ ...flightForm, returnDate: date || null })}
                          disabled={(date) => date <= (flightForm.departureDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Passengers and Class */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="adults">Adults</Label>
                  <Select value={flightForm.adults.toString()} onValueChange={(value) => setFlightForm({ ...flightForm, adults: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children">Children</Label>
                  <Select value={flightForm.children.toString()} onValueChange={(value) => setFlightForm({ ...flightForm, children: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="infants">Infants</Label>
                  <Select value={flightForm.infants.toString()} onValueChange={(value) => setFlightForm({ ...flightForm, infants: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={flightForm.travelClass} onValueChange={(value) => setFlightForm({ ...flightForm, travelClass: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECONOMY">Economy</SelectItem>
                      <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="FIRST">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleFlightSearch} disabled={isSearching} className="w-full">
                {isSearching ? "Searching..." : "Search Flights"}
              </Button>

              {/* Flight Results */}
              {searchResults.flights && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Flights</h3>
                  {searchResults.flights.map((flight, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{flight.airline} {flight.flightNumber}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {flight.departure.airport}
                              </span>
                              <span>{formatTime(flight.departure.time)}</span>
                              <span>→</span>
                              <span>{formatTime(flight.arrival.time)}</span>
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {flight.arrival.airport}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Duration: {formatDuration(flight.duration)} | Stops: {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">₹{Math.round(parseFloat(flight.price.total))}</p>
                            <p className="text-sm text-gray-600">{flight.numberOfBookableSeats} seats left</p>
                            <Button className="mt-2">Book Now</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotel Booking Tab */}
        <TabsContent value="hotel" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="h-5 w-5" />
                Hotel Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hotel-city">City</Label>
                  <Select value={hotelForm.cityCode} onValueChange={(value) => setHotelForm({ ...hotelForm, cityCode: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelForm.checkInDate ? format(hotelForm.checkInDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelForm.checkInDate || undefined}
                        onSelect={(date) => setHotelForm({ ...hotelForm, checkInDate: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelForm.checkOutDate ? format(hotelForm.checkOutDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelForm.checkOutDate || undefined}
                        onSelect={(date) => setHotelForm({ ...hotelForm, checkOutDate: date || null })}
                        disabled={(date) => date <= (hotelForm.checkInDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Guests and Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rooms">Rooms</Label>
                  <Select value={hotelForm.roomQuantity.toString()} onValueChange={(value) => setHotelForm({ ...hotelForm, roomQuantity: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hotel-adults">Adults</Label>
                  <Select value={hotelForm.adults.toString()} onValueChange={(value) => setHotelForm({ ...hotelForm, adults: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hotel-children">Children</Label>
                  <Select value={hotelForm.children.toString()} onValueChange={(value) => setHotelForm({ ...hotelForm, children: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleHotelSearch} disabled={isSearching} className="w-full">
                {isSearching ? "Searching..." : "Search Hotels"}
              </Button>

              {/* Hotel Results */}
              {searchResults.hotels && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Available Hotels</h3>
                  {searchResults.hotels.map((hotel, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">{hotel.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {[...Array(Math.floor(hotel.rating || 3))].map((_, i) => (
                                <span key={i} className="text-yellow-400">★</span>
                              ))}
                              <span className="text-sm text-gray-600">({hotel.rating || 3}/5)</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{hotel.address?.lines?.[0]}</p>
                            {hotel.amenities?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {hotel.amenities.slice(0, 3).map((amenity: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            {hotel.offers?.[0] && (
                              <>
                                <p className="text-2xl font-bold">₹{Math.round(parseFloat(hotel.offers[0].price.total))}</p>
                                <p className="text-sm text-gray-600">per night</p>
                                <p className="text-xs text-gray-500">{hotel.offers[0].room.type}</p>
                                <Button className="mt-2">Book Now</Button>
                              </>
                            )}
                          </div>
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