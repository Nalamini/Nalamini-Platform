import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Car, Plus, Edit, Users, Fuel, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TaxiVehicle {
  id: number;
  providerId: number;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  seatingCapacity: number;
  fuelType: string;
  acAvailable: boolean;
  gpsEnabled: boolean;
  insuranceValid: boolean;
  pucValid: boolean;
  rcNumber: string;
  insuranceNumber: string;
  driverLicenseNumber: string;
  baseFarePerKm: number;
  baseWaitingCharge: number;
  nightChargeMultiplier: number;
  tollChargesApplicable: boolean;
  availableAreas: string;
  currentLocation: string;
  district: string;
  pincode: string;
  imageUrl?: string;
  additionalImages?: string[];
  isActive: boolean;
  status: string;
  adminApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VehicleForm {
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  seatingCapacity: number;
  fuelType: string;
  acAvailable: boolean;
  gpsEnabled: boolean;
  insuranceValid: boolean;
  pucValid: boolean;
  rcNumber: string;
  insuranceNumber: string;
  driverLicenseNumber: string;
  baseFarePerKm: number;
  baseWaitingCharge: number;
  nightChargeMultiplier: number;
  tollChargesApplicable: boolean;
  availableAreas: string;
  currentLocation: string;
  district: string;
  pincode: string;
  imageUrl: string;
}

export default function TaxiVehicles() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<TaxiVehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState<VehicleForm>({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    seatingCapacity: 4,
    fuelType: "",
    acAvailable: false,
    gpsEnabled: false,
    insuranceValid: false,
    pucValid: false,
    rcNumber: "",
    insuranceNumber: "",
    driverLicenseNumber: "",
    baseFarePerKm: 10,
    baseWaitingCharge: 50,
    nightChargeMultiplier: 1.2,
    tollChargesApplicable: true,
    availableAreas: "",
    currentLocation: "",
    district: "",
    pincode: "",
    imageUrl: ""
  });

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["/api/taxi/my-vehicles"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/taxi/my-vehicles");
      return response.json();
    }
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (vehicleData: VehicleForm) => {
      const response = await apiRequest("POST", "/api/taxi/vehicles", vehicleData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vehicle Added",
        description: "Your taxi vehicle has been added successfully!"
      });
      setShowForm(false);
      setEditingVehicle(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/my-vehicles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Vehicle",
        description: error.message || "Failed to add vehicle",
        variant: "destructive"
      });
    }
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<VehicleForm> }) => {
      const response = await apiRequest("PUT", `/api/taxi/vehicles/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vehicle Updated",
        description: "Your taxi vehicle has been updated successfully!"
      });
      setShowForm(false);
      setEditingVehicle(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/taxi/my-vehicles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Vehicle",
        description: error.message || "Failed to update vehicle",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setVehicleForm({
      vehicleNumber: "",
      vehicleType: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      seatingCapacity: 4,
      fuelType: "",
      acAvailable: false,
      gpsEnabled: false,
      insuranceValid: false,
      pucValid: false,
      rcNumber: "",
      insuranceNumber: "",
      driverLicenseNumber: "",
      baseFarePerKm: 10,
      baseWaitingCharge: 50,
      nightChargeMultiplier: 1.2,
      tollChargesApplicable: true,
      availableAreas: "",
      currentLocation: "",
      district: "",
      pincode: "",
      imageUrl: ""
    });
  };

  const handleAddVehicle = () => {
    setShowForm(true);
    setEditingVehicle(null);
    resetForm();
  };

  const handleEditVehicle = (vehicle: TaxiVehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      seatingCapacity: vehicle.seatingCapacity,
      fuelType: vehicle.fuelType,
      acAvailable: vehicle.acAvailable,
      gpsEnabled: vehicle.gpsEnabled,
      insuranceValid: vehicle.insuranceValid,
      pucValid: vehicle.pucValid,
      rcNumber: vehicle.rcNumber,
      insuranceNumber: vehicle.insuranceNumber,
      driverLicenseNumber: vehicle.driverLicenseNumber,
      baseFarePerKm: vehicle.baseFarePerKm,
      baseWaitingCharge: vehicle.baseWaitingCharge,
      nightChargeMultiplier: vehicle.nightChargeMultiplier,
      tollChargesApplicable: vehicle.tollChargesApplicable,
      availableAreas: vehicle.availableAreas,
      currentLocation: vehicle.currentLocation,
      district: vehicle.district,
      pincode: vehicle.pincode,
      imageUrl: vehicle.imageUrl || ""
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data: vehicleForm });
    } else {
      createVehicleMutation.mutate(vehicleForm);
    }
  };

  const vehicleTypes = ["Two Wheeler", "Three Wheeler", "4 Seaters", "6 Seaters", "12 Seaters"];
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const districts = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tiruppur"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading Your Vehicles...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Taxi Vehicles</h1>
          <p className="text-muted-foreground mt-2">Manage your taxi fleet and vehicle details</p>
        </div>
        <Button onClick={handleAddVehicle} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: TaxiVehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.brand} {vehicle.model}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.vehicleNumber}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={vehicle.adminApproved ? "default" : "secondary"}>
                    {vehicle.adminApproved ? "Approved" : "Pending"}
                  </Badge>
                  <Badge variant="outline">{vehicle.vehicleType}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicle.imageUrl && (
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.seatingCapacity} seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{vehicle.year}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {vehicle.acAvailable && <Badge variant="outline">AC</Badge>}
                {vehicle.gpsEnabled && <Badge variant="outline">GPS</Badge>}
                {vehicle.insuranceValid && <Badge variant="outline">Insured</Badge>}
                {vehicle.pucValid && <Badge variant="outline">PUC Valid</Badge>}
              </div>

              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Base Fare:</span>
                  <span className="text-primary font-bold">₹{vehicle.baseFarePerKm}/km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Waiting:</span>
                  <span className="text-primary font-bold">₹{vehicle.baseWaitingCharge}/hr</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {vehicle.status === 'available' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm capitalize">{vehicle.status}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No vehicles added yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first taxi vehicle to begin accepting bookings.</p>
            <Button onClick={handleAddVehicle}>Add Your First Vehicle</Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Vehicle Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                    <Input
                      id="vehicleNumber"
                      value={vehicleForm.vehicleNumber}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      placeholder="TN 01 AB 1234"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select
                      value={vehicleForm.vehicleType}
                      onValueChange={(value) => {
                        let defaultCapacity = 4;
                        if (value === "Two Wheeler") defaultCapacity = 1;
                        else if (value === "Three Wheeler") defaultCapacity = 3;
                        else if (value === "4 Seaters") defaultCapacity = 4;
                        else if (value === "6 Seaters") defaultCapacity = 6;
                        else if (value === "12 Seaters") defaultCapacity = 12;
                        
                        setVehicleForm(prev => ({ 
                          ...prev, 
                          vehicleType: value,
                          seatingCapacity: defaultCapacity
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={vehicleForm.brand}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Toyota, Maruti, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={vehicleForm.model}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="Innova, Swift, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={vehicleForm.year}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color *</Label>
                    <Input
                      id="color"
                      value={vehicleForm.color}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="White, Black, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                    <Select
                      value={vehicleForm.seatingCapacity.toString()}
                      onValueChange={(value) => setVehicleForm(prev => ({ ...prev, seatingCapacity: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 17].map(capacity => (
                          <SelectItem key={capacity} value={capacity.toString()}>{capacity} seats</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuelType">Fuel Type *</Label>
                    <Select
                      value={vehicleForm.fuelType}
                      onValueChange={(value) => setVehicleForm(prev => ({ ...prev, fuelType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map(fuel => (
                          <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Vehicle Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="acAvailable"
                        checked={vehicleForm.acAvailable}
                        onCheckedChange={(checked) => setVehicleForm(prev => ({ ...prev, acAvailable: checked }))}
                      />
                      <Label htmlFor="acAvailable">AC Available</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="gpsEnabled"
                        checked={vehicleForm.gpsEnabled}
                        onCheckedChange={(checked) => setVehicleForm(prev => ({ ...prev, gpsEnabled: checked }))}
                      />
                      <Label htmlFor="gpsEnabled">GPS Enabled</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="insuranceValid"
                        checked={vehicleForm.insuranceValid}
                        onCheckedChange={(checked) => setVehicleForm(prev => ({ ...prev, insuranceValid: checked }))}
                      />
                      <Label htmlFor="insuranceValid">Insurance Valid</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pucValid"
                        checked={vehicleForm.pucValid}
                        onCheckedChange={(checked) => setVehicleForm(prev => ({ ...prev, pucValid: checked }))}
                      />
                      <Label htmlFor="pucValid">PUC Valid</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Legal Documents */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Legal Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rcNumber">RC Number *</Label>
                      <Input
                        id="rcNumber"
                        value={vehicleForm.rcNumber}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, rcNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="insuranceNumber">Insurance Number *</Label>
                      <Input
                        id="insuranceNumber"
                        value={vehicleForm.insuranceNumber}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="driverLicenseNumber">Driver License Number *</Label>
                      <Input
                        id="driverLicenseNumber"
                        value={vehicleForm.driverLicenseNumber}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, driverLicenseNumber: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="baseFarePerKm">Base Fare (₹/km) *</Label>
                      <Input
                        id="baseFarePerKm"
                        type="number"
                        step="0.01"
                        value={vehicleForm.baseFarePerKm}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, baseFarePerKm: parseFloat(e.target.value) || 0 }))}
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="baseWaitingCharge">Waiting Charge (₹/hr) *</Label>
                      <Input
                        id="baseWaitingCharge"
                        type="number"
                        step="0.01"
                        value={vehicleForm.baseWaitingCharge}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, baseWaitingCharge: parseFloat(e.target.value) || 0 }))}
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="nightChargeMultiplier">Night Charge Multiplier</Label>
                      <Input
                        id="nightChargeMultiplier"
                        type="number"
                        step="0.1"
                        value={vehicleForm.nightChargeMultiplier}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, nightChargeMultiplier: parseFloat(e.target.value) || 1 }))}
                        min="1"
                        max="3"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tollChargesApplicable"
                      checked={vehicleForm.tollChargesApplicable}
                      onCheckedChange={(checked) => setVehicleForm(prev => ({ ...prev, tollChargesApplicable: checked }))}
                    />
                    <Label htmlFor="tollChargesApplicable">Toll charges applicable</Label>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={vehicleForm.district}
                        onValueChange={(value) => setVehicleForm(prev => ({ ...prev, district: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={vehicleForm.pincode}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="600001"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input
                        id="currentLocation"
                        value={vehicleForm.currentLocation}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, currentLocation: e.target.value }))}
                        placeholder="T. Nagar, Chennai"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imageUrl">Vehicle Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={vehicleForm.imageUrl}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/vehicle-image.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availableAreas">Available Areas</Label>
                    <Textarea
                      id="availableAreas"
                      value={vehicleForm.availableAreas}
                      onChange={(e) => setVehicleForm(prev => ({ ...prev, availableAreas: e.target.value }))}
                      placeholder="List areas where your vehicle is available for service..."
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingVehicle(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createVehicleMutation.isPending || updateVehicleMutation.isPending}
                  >
                    {(createVehicleMutation.isPending || updateVehicleMutation.isPending) 
                      ? (editingVehicle ? "Updating..." : "Adding...") 
                      : (editingVehicle ? "Update Vehicle" : "Add Vehicle")
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}