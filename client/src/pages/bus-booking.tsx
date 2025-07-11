import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { CalendarIcon, Bus, Clock, MapPin, Users, Star, Wifi, Snowflake, Shield, Route } from "lucide-react";

interface BusRoute {
  source: string;
  sourceCode: string;
  destination: string;
  destinationCode: string;
}

interface BusResult {
  resultIndex: number;
  busType: string;
  serviceName: string;
  travelName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableSeats: number;
  price: {
    basePrice: number;
    offeredPrice: number;
    agentCommission: number;
    currencyCode: string;
  };
  boardingPoints: number;
  droppingPoints: number;
  features: {
    idProofRequired: boolean;
    liveTracking: boolean;
    mTicket: boolean;
    partialCancellation: boolean;
  };
  cancellationPolicies: any[];
}

interface SearchResults {
  traceId: number;
  buses: BusResult[];
  searchParams: any;
}

export default function BusBooking() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [popularRoutes, setPopularRoutes] = useState<BusRoute[]>([]);
  const [searchForm, setSearchForm] = useState({
    source_city: "",
    source_code: "",
    destination_city: "",
    destination_code: "",
    depart_date: null as Date | null
  });
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusResult | null>(null);
  const [seatLayout, setSeatLayout] = useState<any>(null);
  const [isLoadingSeatLayout, setIsLoadingSeatLayout] = useState(false);

  // Fetch popular routes on component mount
  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        const response = await apiRequest("GET", "/api/bus/popular-routes");
        const routes = await response.json();
        setPopularRoutes(routes);
      } catch (error) {
        console.error("Error fetching popular routes:", error);
      }
    };

    fetchPopularRoutes();
  }, []);

  const handleRouteSelect = (route: BusRoute) => {
    setSearchForm({
      ...searchForm,
      source_city: route.source,
      source_code: route.sourceCode,
      destination_city: route.destination,
      destination_code: route.destinationCode
    });
  };

  const handleSearch = async () => {
    if (!searchForm.source_city || !searchForm.destination_city || !searchForm.depart_date) {
      toast({
        title: "Missing Information",
        description: "Please select source, destination, and travel date",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiRequest("POST", "/api/bus/search", {
        ...searchForm,
        depart_date: format(searchForm.depart_date, "yyyy-MM-dd")
      });
      
      const results = await response.json();
      setSearchResults(results);
      
      if (results.buses.length === 0) {
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

  const handleBusSelect = async (bus: BusResult) => {
    if (!searchResults) return;
    
    setSelectedBus(bus);
    setIsLoadingSeatLayout(true);
    
    try {
      const response = await apiRequest("POST", "/api/bus/seat-layout", {
        traceId: searchResults.traceId,
        resultIndex: bus.resultIndex
      });
      
      const layout = await response.json();
      setSeatLayout(layout);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to load seat layout",
        variant: "destructive"
      });
    } finally {
      setIsLoadingSeatLayout(false);
    }
  };

  const formatTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bus Booking</h1>
        <p className="text-gray-600">Book bus tickets across Tamil Nadu and beyond</p>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Search Buses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Popular Routes */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Popular Routes</Label>
            <div className="flex flex-wrap gap-2">
              {popularRoutes.map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRouteSelect(route)}
                  className="text-xs"
                >
                  {route.source} → {route.destination}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="source">From</Label>
              <Input
                id="source"
                placeholder="Source city"
                value={searchForm.source_city}
                onChange={(e) => setSearchForm({...searchForm, source_city: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="destination">To</Label>
              <Input
                id="destination"
                placeholder="Destination city"
                value={searchForm.destination_city}
                onChange={(e) => setSearchForm({...searchForm, destination_city: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !searchForm.depart_date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchForm.depart_date ? format(searchForm.depart_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchForm.depart_date}
                    onSelect={(date) => setSearchForm({...searchForm, depart_date: date})}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="lg:col-span-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSearching ? "Searching..." : "Search Buses"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bus List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Available Buses ({searchResults.buses.length})
            </h2>
            
            <div className="space-y-4">
              {searchResults.buses.map((bus) => (
                <Card 
                  key={bus.resultIndex} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBus?.resultIndex === bus.resultIndex ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleBusSelect(bus)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{bus.travelName}</h3>
                        <p className="text-sm text-gray-600">{bus.busType}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ₹{bus.price.offeredPrice}
                        </div>
                        {bus.price.basePrice > bus.price.offeredPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{bus.price.basePrice}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-semibold">{formatTime(bus.departureTime)}</div>
                          <div className="text-xs text-gray-500">{formatDate(bus.departureTime)}</div>
                        </div>
                        <div className="flex-1 text-center">
                          <div className="text-sm text-gray-500">{bus.duration}</div>
                          <div className="h-px bg-gray-300 relative">
                            <Bus className="h-4 w-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-primary" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{formatTime(bus.arrivalTime)}</div>
                          <div className="text-xs text-gray-500">{formatDate(bus.arrivalTime)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {bus.availableSeats} seats
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {bus.boardingPoints} boarding points
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {bus.features.liveTracking && (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            Live Tracking
                          </Badge>
                        )}
                        {bus.features.mTicket && (
                          <Badge variant="secondary" className="text-xs">
                            M-Ticket
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          <div>
            {selectedBus ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Seats</CardTitle>
                  <p className="text-sm text-gray-600">{selectedBus.travelName}</p>
                </CardHeader>
                <CardContent>
                  {isLoadingSeatLayout ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading seat layout...</p>
                    </div>
                  ) : seatLayout ? (
                    <div className="space-y-4">
                      <div className="text-sm">
                        <span className="font-medium">Available Seats:</span> {seatLayout.availableSeats}
                      </div>
                      
                      {/* Seat layout visualization would go here */}
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 mb-2">Seat Layout</p>
                        <div className="text-xs text-gray-500">
                          Interactive seat selection coming soon
                        </div>
                      </div>
                      
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Proceed to Book
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Select a bus to view seat layout
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Bus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select a bus to proceed with booking</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* No results message */}
      {!searchResults && !isSearching && (
        <Card>
          <CardContent className="text-center py-12">
            <Bus className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Bus Tickets</h3>
            <p className="text-gray-600">Enter your travel details to find available buses</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}