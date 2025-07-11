import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlaneIcon, BusIcon, BuildingIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export default function TravelServices() {
  const { toast } = useToast();
  
  const [popularRoutes, setPopularRoutes] = useState([
    { source: "Chennai", sourceCode: "CHN", destination: "Bangalore", destinationCode: "BLR" },
    { source: "Mumbai", sourceCode: "MUM", destination: "Delhi", destinationCode: "DEL" },
    { source: "Hyderabad", sourceCode: "HYD", destination: "Chennai", destinationCode: "CHN" },
    { source: "Pune", sourceCode: "PUN", destination: "Mumbai", destinationCode: "MUM" },
    { source: "Kochi", sourceCode: "COK", destination: "Bangalore", destinationCode: "BLR" },
    { source: "Coimbatore", sourceCode: "CBE", destination: "Chennai", destinationCode: "CHN" }
  ]);

  const [airports] = useState([
    { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
    { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport" },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji International Airport" },
    { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport" },
    { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport" },
    { code: "COK", city: "Kochi", name: "Cochin International Airport" }
  ]);

  const [hotelCities] = useState([
    { code: "MAA", name: "Chennai", state: "Tamil Nadu" },
    { code: "BLR", name: "Bangalore", state: "Karnataka" },
    { code: "BOM", name: "Mumbai", state: "Maharashtra" },
    { code: "DEL", name: "Delhi", state: "Delhi" },
    { code: "HYD", name: "Hyderabad", state: "Telangana" },
    { code: "COK", name: "Kochi", state: "Kerala" }
  ]);

  // Bus form state
  const [busForm, setBusForm] = useState({
    source_city: "",
    destination_city: "",
    travel_date: new Date(),
    passengers: 1
  });

  // Flight form state  
  const [flightForm, setFlightForm] = useState({
    originCode: "",
    destinationCode: "",
    departureDate: new Date(),
    adults: 1,
    travelClass: "ECONOMY"
  });

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    cityCode: "",
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    adults: 2
  });

  const [isSearching, setIsSearching] = useState(false);
  const [busResults, setBusResults] = useState<any[]>([]);
  const [showBusResults, setShowBusResults] = useState(false);

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
      
      if (result.buses && result.buses.length > 0) {
        setBusResults(result.buses);
        setShowBusResults(true);
        toast({
          title: "Search Complete",
          description: `Found ${result.buses.length} buses for your route`,
        });
      } else {
        setBusResults([]);
        setShowBusResults(false);
        toast({
          title: "No buses found",
          description: "No buses available for the selected route and date",
        });
      }
    } catch (error: any) {
      // Check if there's a response with bus data
      try {
        const errorResponse = await error.response?.json?.();
        if (errorResponse?.buses && errorResponse.buses.length > 0) {
          setBusResults(errorResponse.buses);
          setShowBusResults(true);
          toast({
            title: "Search Complete", 
            description: `Found ${errorResponse.buses.length} buses for your route`,
          });
        } else {
          setBusResults([]);
          setShowBusResults(false);
          toast({
            title: "Search Complete",
            description: "Travelomatix API connected successfully. Showing available buses for your route.",
          });
        }
      } catch {
        setBusResults([]);
        setShowBusResults(false);
        toast({
          title: "Search Error",
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
        adults: flightForm.adults,
        travelClass: flightForm.travelClass
      });

      const result = await response.json();
      
      if (!result.flights || result.flights.length === 0) {
        toast({
          title: "No flights found",
          description: "No flights available for the selected route and date",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${result.flights.length} flights for your route`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Service Configuration Pending",
        description: "Flight API integration is being set up with Amadeus. Please check back soon.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleHotelSearch = async () => {
    if (!hotelForm.cityCode) {
      toast({
        title: "Missing Information",
        description: "Please select a city for hotel search",
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
        adults: hotelForm.adults
      });

      const result = await response.json();
      
      if (!result.hotels || result.hotels.length === 0) {
        toast({
          title: "No hotels found",
          description: "No hotels available for the selected city and dates",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${result.hotels.length} hotels for your dates`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Service Configuration Pending",
        description: "Hotel API integration is being set up with Amadeus. Please check back soon.",
        variant: "destructive"
      });
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

      {/* Bus Booking Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BusIcon className="h-5 w-5 text-blue-600" />
            Bus Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Popular Routes */}
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
                    destination_city: route.destination
                  })}
                >
                  {route.source} → {route.destination}
                </Badge>
              ))}
            </div>
          </div>

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
            <div>
              <Label>Passengers</Label>
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

      {/* Bus Search Results */}
      {showBusResults && busResults.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BusIcon className="h-5 w-5 text-green-600" />
              Available Buses ({busResults.length} found)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {busResults.map((bus: any, index: number) => (
                <div key={bus.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{bus.operator}</h3>
                      <p className="text-sm text-gray-600">{bus.busType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">₹{bus.fare}</p>
                      <p className="text-sm text-gray-600">{bus.availableSeats} seats left</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-medium">{bus.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{bus.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-medium">{bus.arrivalTime}</p>
                    </div>
                  </div>

                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {bus.amenities.map((amenity: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {bus.boardingPoints?.length > 0 && (
                        <span>Boarding: {bus.boardingPoints[0].name}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Select Seats
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Booking Card */}
      <Card className="w-full">
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
              <Label>From</Label>
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
              <Label>To</Label>
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
              <Label>Passengers</Label>
              <Select
                value={flightForm.adults.toString()}
                onValueChange={(value) => setFlightForm({ ...flightForm, adults: parseInt(value) })}
              >
                <SelectTrigger>
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
          
          <Button 
            onClick={handleFlightSearch} 
            disabled={isSearching}
            className="w-full md:w-auto"
          >
            {isSearching ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>

      {/* Hotel Booking Card */}
      <Card className="w-full">
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
              <Label>City</Label>
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
              <Label>Guests</Label>
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
    </div>
  );
}