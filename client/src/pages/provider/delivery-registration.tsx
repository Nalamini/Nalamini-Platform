import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Truck, Clock, MapPin, Plus, X, CheckCircle, AlertCircle } from "lucide-react";

interface DeliveryAgent {
  id: number;
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
  createdAt: string;
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

export default function DeliveryRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    taluk: "",
    pincode: "",
    categoryId: "",
    availableStartTime: "09:00",
    availableEndTime: "18:00",
    operationAreas: {
      districts: [] as string[],
      taluks: [] as string[],
      pincodes: [] as string[]
    }
  });
  const [newDistrict, setNewDistrict] = useState("");
  const [newTaluk, setNewTaluk] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const { toast } = useToast();

  const { data: agentStatus, isLoading } = useQuery({
    queryKey: ["/api/provider/delivery/status"],
  });

  const { data: deliveryCategories } = useQuery({
    queryKey: ["/api/delivery/categories"],
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/provider/delivery/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/delivery/status"] });
      toast({
        title: "Success",
        description: "Delivery agent registration submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register as delivery agent",
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (data: { isOnline: boolean; isAvailable: boolean }) => {
      const res = await apiRequest("PUT", "/api/provider/delivery/status", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/delivery/status"] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.district || !formData.categoryId) {
      toast({
        title: "Validation Error",
        description: "Name, phone, district, and delivery category are required",
        variant: "destructive",
      });
      return;
    }

    if (formData.operationAreas.districts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one operation district",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const addDistrict = () => {
    if (newDistrict && !formData.operationAreas.districts.includes(newDistrict)) {
      setFormData({
        ...formData,
        operationAreas: {
          ...formData.operationAreas,
          districts: [...formData.operationAreas.districts, newDistrict]
        }
      });
      setNewDistrict("");
    }
  };

  const removeDistrict = (district: string) => {
    setFormData({
      ...formData,
      operationAreas: {
        ...formData.operationAreas,
        districts: formData.operationAreas.districts.filter(d => d !== district)
      }
    });
  };

  const addTaluk = () => {
    if (newTaluk && !formData.operationAreas.taluks.includes(newTaluk)) {
      setFormData({
        ...formData,
        operationAreas: {
          ...formData.operationAreas,
          taluks: [...formData.operationAreas.taluks, newTaluk]
        }
      });
      setNewTaluk("");
    }
  };

  const removeTaluk = (taluk: string) => {
    setFormData({
      ...formData,
      operationAreas: {
        ...formData.operationAreas,
        taluks: formData.operationAreas.taluks.filter(t => t !== taluk)
      }
    });
  };

  const addPincode = () => {
    if (newPincode && !formData.operationAreas.pincodes.includes(newPincode)) {
      setFormData({
        ...formData,
        operationAreas: {
          ...formData.operationAreas,
          pincodes: [...formData.operationAreas.pincodes, newPincode]
        }
      });
      setNewPincode("");
    }
  };

  const removePincode = (pincode: string) => {
    setFormData({
      ...formData,
      operationAreas: {
        ...formData.operationAreas,
        pincodes: formData.operationAreas.pincodes.filter(p => p !== pincode)
      }
    });
  };

  const toggleOnlineStatus = () => {
    if (agentStatus && agentStatus.adminApproved) {
      statusMutation.mutate({
        isOnline: !agentStatus.isOnline,
        isAvailable: agentStatus.isAvailable
      });
    }
  };

  const toggleAvailabilityStatus = () => {
    if (agentStatus && agentStatus.adminApproved) {
      statusMutation.mutate({
        isOnline: agentStatus.isOnline,
        isAvailable: !agentStatus.isAvailable
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If already registered, show status management
  if (agentStatus) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Delivery Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage your delivery agent profile and status</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Registration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Registration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Verification Status:</span>
                  <Badge variant={
                    agentStatus.verificationStatus === "verified" ? "default" :
                    agentStatus.verificationStatus === "rejected" ? "destructive" : "secondary"
                  }>
                    {agentStatus.verificationStatus === "verified" && <CheckCircle className="mr-1 h-3 w-3" />}
                    {agentStatus.verificationStatus === "rejected" && <AlertCircle className="mr-1 h-3 w-3" />}
                    {agentStatus.verificationStatus === "pending" && <Clock className="mr-1 h-3 w-3" />}
                    {agentStatus.verificationStatus.charAt(0).toUpperCase() + agentStatus.verificationStatus.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Admin Approved:</span>
                  <Badge variant={agentStatus.adminApproved ? "default" : "secondary"}>
                    {agentStatus.adminApproved ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span>Agent Name:</span>
                  <span className="font-medium">{agentStatus.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Rating:</span>
                  <span className="font-medium">⭐ {agentStatus.rating}/5</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Registered:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(agentStatus.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Availability Status
              </CardTitle>
              <CardDescription>
                {agentStatus.adminApproved 
                  ? "Control your online and availability status"
                  : "Status controls will be enabled after admin approval"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Online Status</p>
                    <p className="text-sm text-muted-foreground">
                      Shows if you're currently active
                    </p>
                  </div>
                  <Button
                    variant={agentStatus.isOnline ? "default" : "outline"}
                    size="sm"
                    onClick={toggleOnlineStatus}
                    disabled={!agentStatus.adminApproved || statusMutation.isPending}
                  >
                    {agentStatus.isOnline ? "Online" : "Offline"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Available for Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Ready to accept new delivery orders
                    </p>
                  </div>
                  <Button
                    variant={agentStatus.isAvailable ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAvailabilityStatus}
                    disabled={!agentStatus.adminApproved || statusMutation.isPending}
                  >
                    {agentStatus.isAvailable ? "Available" : "Busy"}
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Available Hours: {agentStatus.availableStartTime} - {agentStatus.availableEndTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operation Areas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Operation Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {agentStatus.operationAreas?.districts && (
                <div>
                  <h4 className="font-medium mb-2">Districts</h4>
                  <div className="flex flex-wrap gap-1">
                    {agentStatus.operationAreas.districts.map((district: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {district}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {agentStatus.operationAreas?.taluks && (
                <div>
                  <h4 className="font-medium mb-2">Taluks</h4>
                  <div className="flex flex-wrap gap-1">
                    {agentStatus.operationAreas.taluks.map((taluk: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {taluk}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {agentStatus.operationAreas?.pincodes && (
                <div>
                  <h4 className="font-medium mb-2">Pincodes</h4>
                  <div className="flex flex-wrap gap-1">
                    {agentStatus.operationAreas.pincodes.map((pincode: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {pincode}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Registration form
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Register as Delivery Agent</h1>
        <p className="text-muted-foreground">Join our delivery network and start earning</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Delivery Agent Registration</CardTitle>
          <CardDescription>
            Please fill in your details to register as a delivery agent. Your application will be reviewed by our admin team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your mobile number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryId">Delivery Vehicle Type *</Label>
                  <select
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {deliveryCategories?.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Your complete address"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="district">District *</Label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
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
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    placeholder="Your taluk"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            {/* Availability Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Availability Hours</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startTime">Available From</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.availableStartTime}
                    onChange={(e) => setFormData({ ...formData, availableStartTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Available Until</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.availableEndTime}
                    onChange={(e) => setFormData({ ...formData, availableEndTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Operation Areas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Operation Areas</h3>
              
              {/* Districts */}
              <div>
                <Label>Service Districts *</Label>
                <div className="flex gap-2 mt-2">
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select District</option>
                    {TAMIL_NADU_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <Button type="button" onClick={addDistrict} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.operationAreas.districts.map((district, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {district}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeDistrict(district)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Taluks */}
              <div>
                <Label>Service Taluks (Optional)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTaluk}
                    onChange={(e) => setNewTaluk(e.target.value)}
                    placeholder="Enter taluk name"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTaluk} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.operationAreas.taluks.map((taluk, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {taluk}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTaluk(taluk)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pincodes */}
              <div>
                <Label>Service Pincodes (Optional)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addPincode} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.operationAreas.pincodes.map((pincode, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {pincode}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removePincode(pincode)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button 
                type="submit" 
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Submitting..." : "Register as Delivery Agent"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}