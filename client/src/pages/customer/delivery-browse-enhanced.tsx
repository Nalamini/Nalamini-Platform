import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, MapPin, Filter, Search, Clock, Star, Phone } from "lucide-react";

interface DeliveryCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  pricePerKg: number;
  isActive: boolean;
}

interface DeliveryAgent {
  id: number;
  userId: number;
  name: string;
  mobileNumber: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  pincode: string;
  categoryId: number;
  availableStartTime: string;
  availableEndTime: string;
  operationAreas: {
    districts: string[];
    taluks: string[];
    pincodes: string[];
  };
  adminApproved: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  isOnline: boolean;
  isAvailable: boolean;
  rating: number;
  category?: DeliveryCategory;
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

export default function DeliveryBrowseEnhanced() {
  const { toast } = useToast();
  
  // Filter states
  const [filters, setFilters] = useState({
    district: "",
    category: "",
    availability: "",
    rating: "",
    priceRange: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Order form states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [orderForm, setOrderForm] = useState({
    pickupAddress: "",
    pickupDistrict: "",
    pickupTaluk: "",
    pickupPincode: "",
    pickupContactName: "",
    pickupContactPhone: "",
    deliveryAddress: "",
    deliveryDistrict: "",
    deliveryTaluk: "",
    deliveryPincode: "",
    deliveryContactName: "",
    deliveryContactPhone: "",
    packageDetails: "",
    packageWeight: "",
    packageValue: "",
    specialInstructions: "",
    scheduledPickupTime: "",
    paymentMode: "cash"
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/delivery/categories"],
  });

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["/api/delivery/agents"],
  });

  // Get unique values for filter options
  const districts = [...new Set(agents.map((a: DeliveryAgent) => a.district))];
  const categoryNames = [...new Set(agents.map((a: DeliveryAgent) => a.category?.name).filter(Boolean))];

  // Filter agents based on search term and filters
  const filteredAgents = agents.filter((agent: DeliveryAgent) => {
    const matchesSearch = searchTerm === "" || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.taluk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = !filters.district || agent.district === filters.district;
    const matchesCategory = !filters.category || agent.category?.name === filters.category;
    const matchesAvailability = !filters.availability || 
      (filters.availability === "available" && agent.isAvailable && agent.isOnline) ||
      (filters.availability === "verified" && agent.verificationStatus === "verified");
    
    let matchesRating = true;
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      matchesRating = agent.rating >= minRating;
    }

    let matchesPriceRange = true;
    if (filters.priceRange && agent.category) {
      const basePrice = agent.category.basePrice;
      switch (filters.priceRange) {
        case "low": matchesPriceRange = basePrice <= 50; break;
        case "medium": matchesPriceRange = basePrice > 50 && basePrice <= 100; break;
        case "high": matchesPriceRange = basePrice > 100; break;
      }
    }

    return matchesSearch && matchesDistrict && matchesCategory && matchesAvailability && 
           matchesRating && matchesPriceRange && agent.adminApproved;
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/delivery/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/orders"] });
      toast({
        title: "Order Created",
        description: "Your delivery order has been created successfully!",
      });
      setIsOrderModalOpen(false);
      setOrderForm({
        pickupAddress: "",
        pickupDistrict: "",
        pickupTaluk: "",
        pickupPincode: "",
        pickupContactName: "",
        pickupContactPhone: "",
        deliveryAddress: "",
        deliveryDistrict: "",
        deliveryTaluk: "",
        deliveryPincode: "",
        deliveryContactName: "",
        deliveryContactPhone: "",
        packageDetails: "",
        packageWeight: "",
        packageValue: "",
        specialInstructions: "",
        scheduledPickupTime: "",
        paymentMode: "cash"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateOrder = () => {
    if (!selectedAgent) return;
    
    const orderData = {
      categoryId: selectedAgent.categoryId,
      agentId: selectedAgent.id,
      ...orderForm,
      packageWeight: parseFloat(orderForm.packageWeight) || 0,
      packageValue: parseFloat(orderForm.packageValue) || 0,
      totalAmount: selectedAgent.category?.basePrice || 0
    };
    
    createOrderMutation.mutate(orderData);
  };

  if (categoriesLoading || agentsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading delivery services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Delivery Services</h1>
        <p className="text-muted-foreground">Find and book reliable delivery agents in your area</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by agent name, location, or service type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={filters.district} onValueChange={(value) => setFilters({...filters, district: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Service Category</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categoryNames.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Status</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={filters.rating} onValueChange={(value) => setFilters({...filters, rating: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Prices</SelectItem>
                    <SelectItem value="low">Budget (≤ ₹50)</SelectItem>
                    <SelectItem value="medium">Standard (₹50-100)</SelectItem>
                    <SelectItem value="high">Premium (&gt; ₹100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({
                    district: "",
                    category: "",
                    availability: "",
                    rating: "",
                    priceRange: ""
                  });
                  setSearchTerm("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium">
          Found {filteredAgents.length} delivery agent{filteredAgents.length !== 1 ? 's' : ''} 
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <span className="text-muted-foreground"> (filtered from {agents.length} total)</span>
          )}
        </p>
      </div>

      {filteredAgents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {agents.length === 0 ? "No delivery agents available" : "No agents match your filters"}
            </h3>
            <p className="text-muted-foreground">
              {agents.length === 0 
                ? "Please check back later for available delivery services." 
                : "Try adjusting your search criteria or clearing filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent: DeliveryAgent) => (
            <Card key={agent.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {agent.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Badge variant={agent.isAvailable && agent.isOnline ? "default" : "secondary"}>
                      {agent.isAvailable && agent.isOnline ? "Available" : "Busy"}
                    </Badge>
                    {agent.verificationStatus === "verified" && (
                      <Badge variant="outline" className="ml-1">Verified</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.category?.name || "General"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.rating.toFixed(1)} Stars</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Available: {agent.availableStartTime} - {agent.availableEndTime}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="text-lg font-semibold">₹{agent.category?.basePrice || 0}</p>
                  </div>
                  <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedAgent(agent)}
                        disabled={!agent.isAvailable || !agent.isOnline}
                      >
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Delivery Order</DialogTitle>
                        <DialogDescription>
                          Book delivery service with {selectedAgent?.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Pickup Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Pickup Details</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Pickup Address</Label>
                              <Textarea
                                value={orderForm.pickupAddress}
                                onChange={(e) => setOrderForm({...orderForm, pickupAddress: e.target.value})}
                                placeholder="Enter pickup address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Pickup District</Label>
                              <Select value={orderForm.pickupDistrict} onValueChange={(value) => setOrderForm({...orderForm, pickupDistrict: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TAMIL_NADU_DISTRICTS.map(district => (
                                    <SelectItem key={district} value={district}>{district}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Pickup Taluk</Label>
                              <Input
                                value={orderForm.pickupTaluk}
                                onChange={(e) => setOrderForm({...orderForm, pickupTaluk: e.target.value})}
                                placeholder="Enter pickup taluk"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Pickup Pincode</Label>
                              <Input
                                value={orderForm.pickupPincode}
                                onChange={(e) => setOrderForm({...orderForm, pickupPincode: e.target.value})}
                                placeholder="Enter pickup pincode"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Name</Label>
                              <Input
                                value={orderForm.pickupContactName}
                                onChange={(e) => setOrderForm({...orderForm, pickupContactName: e.target.value})}
                                placeholder="Contact person name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Phone</Label>
                              <Input
                                value={orderForm.pickupContactPhone}
                                onChange={(e) => setOrderForm({...orderForm, pickupContactPhone: e.target.value})}
                                placeholder="Contact phone number"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Delivery Details</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Delivery Address</Label>
                              <Textarea
                                value={orderForm.deliveryAddress}
                                onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                                placeholder="Enter delivery address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Delivery District</Label>
                              <Select value={orderForm.deliveryDistrict} onValueChange={(value) => setOrderForm({...orderForm, deliveryDistrict: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TAMIL_NADU_DISTRICTS.map(district => (
                                    <SelectItem key={district} value={district}>{district}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Delivery Taluk</Label>
                              <Input
                                value={orderForm.deliveryTaluk}
                                onChange={(e) => setOrderForm({...orderForm, deliveryTaluk: e.target.value})}
                                placeholder="Enter delivery taluk"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Delivery Pincode</Label>
                              <Input
                                value={orderForm.deliveryPincode}
                                onChange={(e) => setOrderForm({...orderForm, deliveryPincode: e.target.value})}
                                placeholder="Enter delivery pincode"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Name</Label>
                              <Input
                                value={orderForm.deliveryContactName}
                                onChange={(e) => setOrderForm({...orderForm, deliveryContactName: e.target.value})}
                                placeholder="Contact person name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contact Phone</Label>
                              <Input
                                value={orderForm.deliveryContactPhone}
                                onChange={(e) => setOrderForm({...orderForm, deliveryContactPhone: e.target.value})}
                                placeholder="Contact phone number"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Package Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Package Details</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Package Description</Label>
                              <Textarea
                                value={orderForm.packageDetails}
                                onChange={(e) => setOrderForm({...orderForm, packageDetails: e.target.value})}
                                placeholder="Describe the package contents"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Package Weight (kg)</Label>
                              <Input
                                type="number"
                                value={orderForm.packageWeight}
                                onChange={(e) => setOrderForm({...orderForm, packageWeight: e.target.value})}
                                placeholder="Enter weight in kg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Package Value (₹)</Label>
                              <Input
                                type="number"
                                value={orderForm.packageValue}
                                onChange={(e) => setOrderForm({...orderForm, packageValue: e.target.value})}
                                placeholder="Enter package value"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Payment Mode</Label>
                              <Select value={orderForm.paymentMode} onValueChange={(value) => setOrderForm({...orderForm, paymentMode: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="online">Online</SelectItem>
                                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Special Instructions</Label>
                            <Textarea
                              value={orderForm.specialInstructions}
                              onChange={(e) => setOrderForm({...orderForm, specialInstructions: e.target.value})}
                              placeholder="Any special handling instructions"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Scheduled Pickup Time</Label>
                            <Input
                              type="datetime-local"
                              value={orderForm.scheduledPickupTime}
                              onChange={(e) => setOrderForm({...orderForm, scheduledPickupTime: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateOrder}
                            disabled={createOrderMutation.isPending}
                          >
                            {createOrderMutation.isPending ? "Creating..." : "Create Order"}
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
  );
}