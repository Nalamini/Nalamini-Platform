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
import { CalendarIcon, MapPin, Clock, Shield, Package, Star, Filter, Search, Grid3X3, List } from "lucide-react";
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

interface RentalSubcategory {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  isActive: boolean;
  imageUrl: string | null;
  displayOrder: number;
}

interface RentalEquipment {
  id: number;
  name: string;
  categoryId: number;
  subcategoryId: number | null;
  categoryName: string;
  subcategoryName?: string;
  providerName: string;
  description: string | null;
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
  minimumRentalDays: number;
  maximumRentalDays: number;
  isActive: boolean;
  adminApproved: boolean;
  status: string;
}

export default function RentalServices() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEquipment, setSelectedEquipment] = useState<RentalEquipment | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Fetch rental categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<RentalCategory[]>({
    queryKey: ["/api/rental-categories"],
  });

  // Fetch rental subcategories
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<RentalSubcategory[]>({
    queryKey: ["/api/rental-subcategories"],
  });

  // Fetch rental equipment
  const { data: equipment = [], isLoading: equipmentLoading } = useQuery<RentalEquipment[]>({
    queryKey: ["/api/rental-equipment"],
  });

  // Filter equipment based on selected filters
  const filteredEquipment = equipment.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId.toString() === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "all" || item.subcategoryId?.toString() === selectedSubcategory;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || item.district === selectedLocation;
    const matchesCondition = condition === "all" || item.condition === condition;
    
    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = item.dailyRate;
      switch (priceRange) {
        case "0-500":
          matchesPrice = price <= 500;
          break;
        case "500-1000":
          matchesPrice = price > 500 && price <= 1000;
          break;
        case "1000-2000":
          matchesPrice = price > 1000 && price <= 2000;
          break;
        case "2000+":
          matchesPrice = price > 2000;
          break;
      }
    }

    return matchesCategory && matchesSubcategory && matchesSearch && matchesLocation && matchesCondition && matchesPrice;
  });

  // Get available locations
  const availableLocations = Array.from(new Set(equipment.map(item => item.district))).sort();

  // Get subcategories for selected category
  const categorySubcategories = selectedCategory === "all" 
    ? subcategories 
    : subcategories.filter(sub => sub.categoryId.toString() === selectedCategory);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateTotalPrice = (equipment: RentalEquipment) => {
    const days = calculateDays();
    const basePrice = equipment.dailyRate * days;
    const deliveryPrice = equipment.deliveryAvailable ? equipment.deliveryCharge : 0;
    return basePrice + deliveryPrice;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Rental Services</h1>
          <p className="text-gray-600 mt-2">Find and rent equipment for your needs</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
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
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subcategory</label>
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {categorySubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {availableLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (per day)</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                  <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                  <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                  <SelectItem value="2000+">₹2000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Select value={condition} onValueChange={setCondition}>
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

            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                  setSearchTerm("");
                  setSelectedLocation("all");
                  setPriceRange("all");
                  setCondition("all");
                }}
                className="mt-6"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      {equipmentLoading ? (
        <div className="text-center py-8">Loading equipment...</div>
      ) : filteredEquipment.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No equipment found</h3>
          <p className="text-gray-500">Try adjusting your filters to find more equipment</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredEquipment.map((item) => (
            <Card 
              key={item.id} 
              className={cn(
                "hover:shadow-lg transition-shadow cursor-pointer",
                viewMode === "list" && "flex flex-row"
              )}
              onClick={() => setSelectedEquipment(item)}
            >
              {viewMode === "grid" ? (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
                      <Badge variant={item.condition === "excellent" ? "default" : "secondary"}>
                        {item.condition}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {item.categoryName} {item.subcategoryName && `> ${item.subcategoryName}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {item.location}, {item.district}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        Available: {item.availableQuantity}/{item.totalQuantity}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Min: {item.minimumRentalDays} days
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">₹{item.dailyRate}</p>
                            <p className="text-sm text-gray-500">per day</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Shield className="w-4 h-4" />
                              ₹{item.securityDeposit}
                            </div>
                            <p className="text-xs text-gray-500">security deposit</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex w-full">
                  <CardContent className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <CardDescription>
                          {item.categoryName} {item.subcategoryName && `> ${item.subcategoryName}`}
                        </CardDescription>
                      </div>
                      <Badge variant={item.condition === "excellent" ? "default" : "secondary"}>
                        {item.condition}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {item.location}, {item.district}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        Available: {item.availableQuantity}/{item.totalQuantity}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Min: {item.minimumRentalDays} days
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{item.dailyRate}/day</p>
                        <p className="text-sm text-gray-500">Security: ₹{item.securityDeposit}</p>
                      </div>
                    </div>

                    <Button size="sm">View Details</Button>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Equipment Details Dialog */}
      <Dialog open={!!selectedEquipment} onOpenChange={() => setSelectedEquipment(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEquipment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEquipment.name}</DialogTitle>
                <DialogDescription>
                  {selectedEquipment.categoryName} {selectedEquipment.subcategoryName && `> ${selectedEquipment.subcategoryName}`} | Provider: {selectedEquipment.providerName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Pricing</h4>
                    <div className="space-y-1">
                      <p>Daily Rate: <span className="font-bold text-primary">₹{selectedEquipment.dailyRate}</span></p>
                      {selectedEquipment.weeklyRate && (
                        <p>Weekly Rate: <span className="font-bold">₹{selectedEquipment.weeklyRate}</span></p>
                      )}
                      {selectedEquipment.monthlyRate && (
                        <p>Monthly Rate: <span className="font-bold">₹{selectedEquipment.monthlyRate}</span></p>
                      )}
                      <p>Security Deposit: <span className="font-bold">₹{selectedEquipment.securityDeposit}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Availability</h4>
                    <div className="space-y-1">
                      <p>Available: {selectedEquipment.availableQuantity}/{selectedEquipment.totalQuantity}</p>
                      <p>Condition: <Badge variant="outline">{selectedEquipment.condition}</Badge></p>
                      <p>Min Days: {selectedEquipment.minimumRentalDays}</p>
                      <p>Max Days: {selectedEquipment.maximumRentalDays}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Location & Delivery</h4>
                  <p className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    {selectedEquipment.location}, {selectedEquipment.district}
                    {selectedEquipment.pincode && ` - ${selectedEquipment.pincode}`}
                  </p>
                  {selectedEquipment.deliveryAvailable && (
                    <p className="text-green-600">
                      ✓ Delivery available (₹{selectedEquipment.deliveryCharge})
                    </p>
                  )}
                </div>

                {selectedEquipment.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700">{selectedEquipment.description}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Book Equipment</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
                      <label className="text-sm font-medium mb-2 block">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
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
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-semibold mb-2">Booking Summary</h5>
                      <div className="space-y-1">
                        <p>Duration: {calculateDays()} days</p>
                        <p>Equipment Cost: ₹{selectedEquipment.dailyRate} × {calculateDays()} = ₹{selectedEquipment.dailyRate * calculateDays()}</p>
                        {selectedEquipment.deliveryAvailable && (
                          <p>Delivery Charge: ₹{selectedEquipment.deliveryCharge}</p>
                        )}
                        <p className="font-bold text-lg">Total: ₹{calculateTotalPrice(selectedEquipment)}</p>
                        <p className="text-sm text-gray-600">Security Deposit: ₹{selectedEquipment.securityDeposit} (refundable)</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    disabled={!startDate || !endDate || selectedEquipment.availableQuantity === 0}
                  >
                    {selectedEquipment.availableQuantity === 0 ? "Out of Stock" : "Book Now"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}