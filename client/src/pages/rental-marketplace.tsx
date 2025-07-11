import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Calendar as CalendarIcon, MapPin, Clock, Package, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { RentalCategory, RentalEquipment, RentalCartItem } from "@shared/schema";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

export default function RentalMarketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showCart, setShowCart] = useState(false);

  // Fetch rental categories
  const { data: categories = [] } = useQuery<RentalCategory[]>({
    queryKey: ["/api/rental-categories"],
  });

  // Fetch available equipment
  const { data: equipment = [], isLoading } = useQuery<RentalEquipment[]>({
    queryKey: ["/api/rental-equipment", { 
      category: selectedCategory, 
      search: searchQuery, 
      location: selectedLocation,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    }],
  });

  // Fetch cart items
  const { data: cartItems = [] } = useQuery<RentalCartItem[]>({
    queryKey: ["/api/rental-cart"],
    enabled: !!user,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ equipmentId, quantity, startDate, endDate }: {
      equipmentId: number;
      quantity: number;
      startDate: Date;
      endDate: Date;
    }) => {
      const totalDays = differenceInDays(endDate, startDate) + 1;
      const res = await apiRequest("POST", "/api/rental-cart", {
        equipmentId,
        quantity,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        totalDays,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rental-cart"] });
      toast({ title: "Equipment added to cart" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update cart quantity mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PATCH", `/api/rental-cart/${id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rental-cart"] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/rental-cart/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rental-cart"] });
      toast({ title: "Equipment removed from cart" });
    },
  });

  const calculateTotalDays = (start: Date, end: Date) => {
    return differenceInDays(end, start) + 1;
  };

  const calculateItemTotal = (equipment: RentalEquipment, days: number, quantity: number = 1) => {
    let rate = equipment.dailyRate;
    if (days >= 30 && equipment.monthlyRate) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      rate = (months * equipment.monthlyRate + remainingDays * equipment.dailyRate) / days;
    } else if (days >= 7 && equipment.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      rate = (weeks * equipment.weeklyRate + remainingDays * equipment.dailyRate) / days;
    }
    return rate * days * quantity;
  };

  const handleAddToCart = (equipment: RentalEquipment) => {
    if (!startDate || !endDate) {
      toast({
        title: "Please select rental dates",
        description: "Choose start and end dates for the rental period",
        variant: "destructive",
      });
      return;
    }

    const days = calculateTotalDays(startDate, endDate);
    if (days < equipment.minimumRentalDays) {
      toast({
        title: "Rental period too short",
        description: `Minimum rental period is ${equipment.minimumRentalDays} days`,
        variant: "destructive",
      });
      return;
    }

    if (days > equipment.maximumRentalDays) {
      toast({
        title: "Rental period too long",
        description: `Maximum rental period is ${equipment.maximumRentalDays} days`,
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      equipmentId: equipment.id,
      quantity: 1,
      startDate,
      endDate,
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const equipment = equipment.find(eq => eq.id === item.equipmentId);
      if (equipment) {
        return total + calculateItemTotal(equipment, item.totalDays, item.quantity);
      }
      return total;
    }, 0);
  };

  const getSecurityDepositTotal = () => {
    return cartItems.reduce((total, item) => {
      const equipment = equipment.find(eq => eq.id === item.equipmentId);
      if (equipment) {
        return total + (equipment.securityDeposit * item.quantity);
      }
      return total;
    }, 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Equipment Rental</h1>
          <p className="text-gray-600">Rent professional equipment for your projects</p>
        </div>
        <Button 
          onClick={() => setShowCart(!showCart)}
          className="relative"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart ({cartItems.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rental Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
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
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
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
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => !startDate || date <= startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && endDate && (
                <div className="text-sm text-center p-2 bg-blue-50 rounded">
                  Duration: {calculateTotalDays(startDate, endDate)} days
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
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
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="coimbatore">Coimbatore</SelectItem>
                    <SelectItem value="madurai">Madurai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="equipment" className="space-y-6">
            <TabsList>
              <TabsTrigger value="equipment">Available Equipment</TabsTrigger>
              {showCart && <TabsTrigger value="cart">Cart ({cartItems.length})</TabsTrigger>}
            </TabsList>

            <TabsContent value="equipment">
              {isLoading ? (
                <div className="text-center py-8">Loading equipment...</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {equipment.filter(item => item.adminApproved && item.status === 'active').map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </CardDescription>
                          </div>
                          <Badge variant={item.condition === 'excellent' ? 'default' : 'secondary'}>
                            {item.condition}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3 text-gray-500" />
                              <span>{item.availableQuantity}/{item.totalQuantity} available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span>{item.minimumRentalDays}-{item.maximumRentalDays} days</span>
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Daily Rate:</span>
                              <span className="text-lg font-bold">₹{item.dailyRate}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>Security Deposit:</span>
                              <span>₹{item.securityDeposit}</span>
                            </div>
                            {item.deliveryAvailable && (
                              <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Delivery:</span>
                                <span>₹{item.deliveryCharge}</span>
                              </div>
                            )}
                          </div>

                          {startDate && endDate && (
                            <div className="bg-blue-50 p-2 rounded text-sm">
                              <div className="flex justify-between">
                                <span>Total ({calculateTotalDays(startDate, endDate)} days):</span>
                                <span className="font-semibold">
                                  ₹{calculateItemTotal(item, calculateTotalDays(startDate, endDate))}
                                </span>
                              </div>
                            </div>
                          )}

                          <Button 
                            className="w-full"
                            onClick={() => handleAddToCart(item)}
                            disabled={!user || addToCartMutation.isPending || item.availableQuantity === 0}
                          >
                            {item.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {showCart && (
              <TabsContent value="cart">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental Cart</CardTitle>
                    <CardDescription>Review your selected equipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          const equipmentItem = equipment.find(eq => eq.id === item.equipmentId);
                          if (!equipmentItem) return null;

                          return (
                            <div key={item.id} className="flex justify-between items-center p-4 border rounded">
                              <div className="flex-1">
                                <h4 className="font-medium">{equipmentItem.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(item.startDate), "MMM dd")} - {format(new Date(item.endDate), "MMM dd, yyyy")}
                                  ({item.totalDays} days)
                                </p>
                                <p className="text-sm font-medium">
                                  ₹{calculateItemTotal(equipmentItem, item.totalDays, item.quantity)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartMutation.mutate({ id: item.id, quantity: item.quantity - 1 })}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                                  disabled={item.quantity >= equipmentItem.availableQuantity}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeFromCartMutation.mutate(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          );
                        })}

                        <div className="border-t pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Rental Total:</span>
                              <span className="font-semibold">₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Security Deposit:</span>
                              <span className="font-semibold">₹{getSecurityDepositTotal()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                              <span>Total Amount:</span>
                              <span>₹{getCartTotal() + getSecurityDepositTotal()}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="lg">
                            Proceed to Checkout
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}