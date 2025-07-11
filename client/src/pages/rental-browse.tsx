import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Clock, Shield, Package, Star, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RentalCategory {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface RentalEquipment {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  providerId: number;
  providerName?: string;
  description: string | null;
  specifications: Record<string, any>;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  securityDeposit: number;
  availableQuantity: number;
  totalQuantity: number;
  condition: string;
  location: string;
  district: string;
  pincode: string | null;
  imageUrl: string | null;
  additionalImages: any[];
  deliveryAvailable: boolean;
  deliveryCharge: number;
  pickupAvailable: boolean;
  minimumRentalDays: number;
  maximumRentalDays: number;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function RentalBrowse() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<RentalEquipment | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Fetch rental categories
  const { data: categories = [] } = useQuery<RentalCategory[]>({
    queryKey: ["/api/rental-categories"],
  });

  // Fetch all rental equipment
  const { data: allEquipment = [], isLoading } = useQuery<RentalEquipment[]>({
    queryKey: ["/api/rental-equipment"],
  });

  // Filter equipment based on selected filters
  const filteredEquipment = allEquipment.filter(equipment => {
    const matchesCategory = selectedCategory === "all" || equipment.categoryId.toString() === selectedCategory;
    const matchesSearch = searchTerm === "" || equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         equipment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === "all" || equipment.district === selectedDistrict;
    const matchesCondition = conditionFilter === "all" || equipment.condition === conditionFilter;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const dailyRate = equipment.dailyRate;
      switch (priceRange) {
        case "0-500":
          matchesPrice = dailyRate <= 500;
          break;
        case "500-1000":
          matchesPrice = dailyRate > 500 && dailyRate <= 1000;
          break;
        case "1000-2000":
          matchesPrice = dailyRate > 1000 && dailyRate <= 2000;
          break;
        case "2000+":
          matchesPrice = dailyRate > 2000;
          break;
      }
    }

    return matchesCategory && matchesSearch && matchesDistrict && matchesCondition && matchesPrice && equipment.isActive;
  });

  // Get unique districts for filter
  const districts = Array.from(new Set(allEquipment.map(equipment => equipment.district))).sort();

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "fair": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateRentalCost = (equipment: RentalEquipment, days: number) => {
    if (days >= 30 && equipment.monthlyRate) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return (months * equipment.monthlyRate) + (remainingDays * equipment.dailyRate);
    } else if (days >= 7 && equipment.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * equipment.weeklyRate) + (remainingDays * equipment.dailyRate);
    }
    return days * equipment.dailyRate;
  };

  const getRentalDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 1;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Rental Equipment Marketplace</h1>
        <p className="text-gray-600">Find and rent equipment for your projects</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District Filter */}
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-500">₹0 - ₹500/day</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1000/day</SelectItem>
                <SelectItem value="1000-2000">₹1000 - ₹2000/day</SelectItem>
                <SelectItem value="2000+">₹2000+/day</SelectItem>
              </SelectContent>
            </Select>

            {/* Condition Filter */}
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredEquipment.length} of {allEquipment.length} equipment
        </p>
      </div>

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEquipment.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((equipment) => (
            <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {equipment.imageUrl ? (
                  <img 
                    src={equipment.imageUrl} 
                    alt={equipment.name}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Badge className={cn("absolute top-2 right-2", getConditionColor(equipment.condition))}>
                  {equipment.condition}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{equipment.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {equipment.location}, {equipment.district}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Min: {equipment.minimumRentalDays} day(s) | Max: {equipment.maximumRentalDays} day(s)
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{equipment.dailyRate}
                      <span className="text-sm font-normal text-gray-600">/day</span>
                    </div>
                    {equipment.weeklyRate && (
                      <div className="text-sm text-gray-600">
                        ₹{equipment.weeklyRate}/week
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    Security Deposit: ₹{equipment.securityDeposit}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Available: {equipment.availableQuantity}/{equipment.totalQuantity}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => setSelectedEquipment(equipment)}
                        disabled={equipment.availableQuantity === 0}
                      >
                        {equipment.availableQuantity === 0 ? "Not Available" : "View Details & Book"}
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{equipment.name}</DialogTitle>
                        <DialogDescription>
                          Equipment details and booking information
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedEquipment && (
                        <div className="space-y-6">
                          {/* Equipment Image */}
                          {equipment.imageUrl ? (
                            <img 
                              src={equipment.imageUrl} 
                              alt={equipment.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-16 w-16 text-gray-400" />
                            </div>
                          )}

                          {/* Equipment Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Equipment Details</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Condition:</strong> {equipment.condition}</p>
                                <p><strong>Location:</strong> {equipment.location}, {equipment.district}</p>
                                <p><strong>Available Quantity:</strong> {equipment.availableQuantity}</p>
                                <p><strong>Delivery:</strong> {equipment.deliveryAvailable ? `Yes (₹${equipment.deliveryCharge})` : "No"}</p>
                                <p><strong>Pickup:</strong> {equipment.pickupAvailable ? "Yes" : "No"}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Daily Rate:</strong> ₹{equipment.dailyRate}</p>
                                {equipment.weeklyRate && <p><strong>Weekly Rate:</strong> ₹{equipment.weeklyRate}</p>}
                                {equipment.monthlyRate && <p><strong>Monthly Rate:</strong> ₹{equipment.monthlyRate}</p>}
                                <p><strong>Security Deposit:</strong> ₹{equipment.securityDeposit}</p>
                                <p><strong>Min Rental:</strong> {equipment.minimumRentalDays} day(s)</p>
                                <p><strong>Max Rental:</strong> {equipment.maximumRentalDays} day(s)</p>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {equipment.description && (
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{equipment.description}</p>
                            </div>
                          )}

                          {/* Specifications */}
                          {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Specifications</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {Object.entries(equipment.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Date Selection */}
                          <div>
                            <h4 className="font-semibold mb-2">Select Rental Period</h4>
                            <div className="flex gap-4">
                              <div>
                                <label className="text-sm font-medium">Start Date</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={startDate}
                                      onSelect={setStartDate}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">End Date</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={endDate}
                                      onSelect={setEndDate}
                                      disabled={(date) => date < (startDate || new Date())}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            
                            {startDate && endDate && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <h5 className="font-semibold mb-2">Rental Summary</h5>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Duration:</strong> {getRentalDays()} day(s)</p>
                                  <p><strong>Rental Cost:</strong> ₹{calculateRentalCost(equipment, getRentalDays())}</p>
                                  <p><strong>Security Deposit:</strong> ₹{equipment.securityDeposit}</p>
                                  {equipment.deliveryAvailable && (
                                    <p><strong>Delivery Charge:</strong> ₹{equipment.deliveryCharge}</p>
                                  )}
                                  <div className="border-t pt-2 mt-2">
                                    <p className="font-semibold">
                                      <strong>Total Amount:</strong> ₹{calculateRentalCost(equipment, getRentalDays()) + equipment.securityDeposit + (equipment.deliveryAvailable ? equipment.deliveryCharge : 0)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Book Button */}
                          <Button 
                            className="w-full" 
                            size="lg"
                            disabled={!startDate || !endDate || getRentalDays() < equipment.minimumRentalDays || getRentalDays() > equipment.maximumRentalDays}
                          >
                            Book Equipment
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}