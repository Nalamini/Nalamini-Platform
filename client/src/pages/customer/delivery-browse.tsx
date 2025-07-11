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
import { Package, Truck, MapPin, Phone, Star, Plus, Clock } from "lucide-react";

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
  phone: string;
  email: string;
  address: string;
  district: string;
  taluk: string;
  pincode: string;
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
}

interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  agentId: number;
  categoryId: number;
  pickupAddress: string;
  deliveryAddress: string;
  packageDetails: string;
  weight: number;
  distance: number;
  baseAmount: number;
  totalAmount: number;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  scheduledTime: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
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

export default function DeliveryBrowsePage() {
  const [selectedLocation, setSelectedLocation] = useState({
    district: "",
    taluk: "",
    pincode: ""
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DeliveryCategory | null>(null);
  const [orderForm, setOrderForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: "",
    weight: "",
    distance: "",
    scheduledTime: "",
    notes: ""
  });
  const { toast } = useToast();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/delivery/categories"],
  });

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["/api/delivery/agents", selectedLocation.district, selectedLocation.taluk, selectedLocation.pincode],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedLocation.district) params.append('district', selectedLocation.district);
      if (selectedLocation.taluk) params.append('taluk', selectedLocation.taluk);
      if (selectedLocation.pincode) params.append('pincode', selectedLocation.pincode);
      
      return fetch(`/api/delivery/agents?${params.toString()}`).then(res => res.json());
    },
    enabled: !!selectedLocation.district,
  });

  const { data: myOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/delivery/orders"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      // Create the delivery order
      const orderRes = await apiRequest("POST", "/api/delivery/orders", orderData);
      const order = await orderRes.json();
      
      // Automatically create service request
      const serviceRequestData = {
        serviceType: "delivery",
        amount: orderData.totalAmount,
        paymentMethod: "razorpay",
        serviceData: {
          pickup: orderData.pickupAddress,
          dropoff: orderData.deliveryAddress,
          packageDetails: orderData.packageDetails,
          weight: orderData.weight,
          distance: orderData.distance,
          scheduledTime: orderData.scheduledTime,
          notes: orderData.notes,
          agentId: orderData.agentId,
          categoryId: orderData.categoryId,
          orderId: order.id
        }
      };
      
      const serviceRes = await apiRequest("POST", "/api/service-requests", serviceRequestData);
      const serviceRequest = await serviceRes.json();
      
      return { order, serviceRequest };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] });
      setIsOrderModalOpen(false);
      resetOrderForm();
      toast({
        title: "Success",
        description: `Delivery order created successfully! Service request ${data.serviceRequest.srNumber} has been generated.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create delivery order",
        variant: "destructive",
      });
    },
  });

  const resetOrderForm = () => {
    setOrderForm({
      pickupAddress: "",
      deliveryAddress: "",
      packageDetails: "",
      weight: "",
      distance: "",
      scheduledTime: "",
      notes: ""
    });
    setSelectedAgent(null);
    setSelectedCategory(null);
  };

  const handleLocationSearch = () => {
    if (!selectedLocation.district) {
      toast({
        title: "Validation Error",
        description: "Please select a district to search for agents",
        variant: "destructive",
      });
      return;
    }
    // Query will automatically refetch when selectedLocation changes
  };

  const openOrderModal = (agent: DeliveryAgent, category: DeliveryCategory) => {
    setSelectedAgent(agent);
    setSelectedCategory(category);
    setIsOrderModalOpen(true);
  };

  const calculateTotalAmount = () => {
    if (!selectedCategory) return 0;
    
    const weight = parseFloat(orderForm.weight) || 0;
    const distance = parseFloat(orderForm.distance) || 0;
    
    return selectedCategory.basePrice + 
           (selectedCategory.pricePerKm * distance) + 
           (selectedCategory.pricePerKg * weight);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAgent || !selectedCategory) {
      toast({
        title: "Error",
        description: "Agent and category must be selected",
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.pickupAddress || !orderForm.deliveryAddress || !orderForm.packageDetails) {
      toast({
        title: "Validation Error",
        description: "Pickup address, delivery address, and package details are required",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      agentId: selectedAgent.id,
      categoryId: selectedCategory.id,
      pickupAddress: orderForm.pickupAddress,
      deliveryAddress: orderForm.deliveryAddress,
      packageDetails: orderForm.packageDetails,
      weight: parseFloat(orderForm.weight) || 0,
      distance: parseFloat(orderForm.distance) || 0,
      baseAmount: selectedCategory.basePrice,
      totalAmount: calculateTotalAmount(),
      scheduledTime: orderForm.scheduledTime,
      notes: orderForm.notes
    };

    createOrderMutation.mutate(orderData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "default";
      case "in_transit": return "default";
      case "picked_up": return "secondary";
      case "assigned": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery Services</h1>
        <p className="text-muted-foreground">Find delivery agents in your area and place orders</p>
      </div>

      {/* Location Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Search by Location
          </CardTitle>
          <CardDescription>
            Enter your location to find available delivery agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="district">District *</Label>
              <select
                id="district"
                value={selectedLocation.district}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, district: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select District</option>
                {TAMIL_NADU_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="taluk">Taluk</Label>
              <Input
                id="taluk"
                value={selectedLocation.taluk}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, taluk: e.target.value })}
                placeholder="Enter taluk (optional)"
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={selectedLocation.pincode}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, pincode: e.target.value })}
                placeholder="6-digit pincode (optional)"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleLocationSearch} className="w-full">
                Search Agents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Delivery Categories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Delivery Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No categories available</p>
              ) : (
                <div className="space-y-3">
                  {(categories as DeliveryCategory[]).map((category: DeliveryCategory) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory?.id === category.id ? "default" : "outline"}
                      className="w-full h-auto p-4 text-left justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="w-full">
                        <h4 className="font-medium text-left">{category.name}</h4>
                        <p className="text-sm text-muted-foreground text-left">{category.description}</p>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span className="font-medium">₹{category.basePrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Per KM:</span>
                            <span className="font-medium">₹{category.pricePerKm}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Per KG:</span>
                            <span className="font-medium">₹{category.pricePerKg}</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Agents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Available Delivery Agents
                {selectedLocation.district && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    in {selectedLocation.district}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedLocation.district ? (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select your location</h3>
                  <p className="text-muted-foreground">Choose a district to see available delivery agents</p>
                </div>
              ) : agentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No agents available</h3>
                  <p className="text-muted-foreground">
                    No delivery agents found in {selectedLocation.district}
                    {selectedLocation.taluk && `, ${selectedLocation.taluk}`}
                    {selectedLocation.pincode && ` - ${selectedLocation.pincode}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent: DeliveryAgent) => (
                    <div key={agent.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <div className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{agent.phone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{agent.rating}/5</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            <Badge variant={agent.isOnline ? "default" : "secondary"} className="text-xs">
                              {agent.isOnline ? "Online" : "Offline"}
                            </Badge>
                            <Badge variant={agent.isAvailable ? "default" : "destructive"} className="text-xs">
                              {agent.isAvailable ? "Available" : "Busy"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Available: {agent.availableStartTime} - {agent.availableEndTime}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {agent.taluk}, {agent.district} - {agent.pincode}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {categories.map((category: DeliveryCategory) => (
                          <Button
                            key={category.id}
                            size="sm"
                            variant="outline"
                            onClick={() => openOrderModal(agent, category)}
                            disabled={!agent.isOnline || !agent.isAvailable}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* My Orders */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Delivery Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Your delivery orders will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order: DeliveryOrder) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Order #{order.orderNumber}</h4>
                      <p className="text-sm text-muted-foreground">{order.packageDetails}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <div>From: {order.pickupAddress}</div>
                        <div>To: {order.deliveryAddress}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="text-sm font-medium mt-1">₹{order.totalAmount}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Delivery Order</DialogTitle>
            <DialogDescription>
              {selectedAgent && selectedCategory && (
                <>
                  Agent: {selectedAgent.name} | Category: {selectedCategory.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="pickupAddress">Pickup Address *</Label>
                <Textarea
                  id="pickupAddress"
                  value={orderForm.pickupAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, pickupAddress: e.target.value })}
                  placeholder="Complete pickup address"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                  placeholder="Complete delivery address"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="packageDetails">Package Details *</Label>
              <Textarea
                id="packageDetails"
                value={orderForm.packageDetails}
                onChange={(e) => setOrderForm({ ...orderForm, packageDetails: e.target.value })}
                placeholder="Describe what you're sending"
                rows={2}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="weight">Weight (KG)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={orderForm.weight}
                  onChange={(e) => setOrderForm({ ...orderForm, weight: e.target.value })}
                  placeholder="Package weight"
                />
              </div>
              <div>
                <Label htmlFor="distance">Distance (KM)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  value={orderForm.distance}
                  onChange={(e) => setOrderForm({ ...orderForm, distance: e.target.value })}
                  placeholder="Delivery distance"
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={orderForm.scheduledTime}
                  onChange={(e) => setOrderForm({ ...orderForm, scheduledTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                placeholder="Any special instructions"
                rows={2}
              />
            </div>

            {selectedCategory && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Cost Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>₹{selectedCategory.basePrice}</span>
                  </div>
                  {orderForm.distance && (
                    <div className="flex justify-between">
                      <span>Distance ({orderForm.distance} KM @ ₹{selectedCategory.pricePerKm}/KM):</span>
                      <span>₹{(parseFloat(orderForm.distance) * selectedCategory.pricePerKm).toFixed(2)}</span>
                    </div>
                  )}
                  {orderForm.weight && (
                    <div className="flex justify-between">
                      <span>Weight ({orderForm.weight} KG @ ₹{selectedCategory.pricePerKg}/KG):</span>
                      <span>₹{(parseFloat(orderForm.weight) * selectedCategory.pricePerKg).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createOrderMutation.isPending}>
                {createOrderMutation.isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}