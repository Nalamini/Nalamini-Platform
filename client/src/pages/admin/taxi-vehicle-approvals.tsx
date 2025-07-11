import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Car, Calendar, MapPin, Fuel, Users, Shield } from "lucide-react";
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

export default function TaxiVehicleApprovals() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");

  const { data: pendingVehicles, isLoading: pendingLoading } = useQuery<TaxiVehicle[]>({
    queryKey: ["/api/admin/taxi/vehicles/pending"],
    enabled: selectedTab === "pending"
  });

  const { data: approvedVehicles, isLoading: approvedLoading } = useQuery<TaxiVehicle[]>({
    queryKey: ["/api/admin/taxi/vehicles/approved"],
    enabled: selectedTab === "approved"
  });

  const approveMutation = useMutation({
    mutationFn: async ({ vehicleId, approved }: { vehicleId: number; approved: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/taxi/vehicles/${vehicleId}/approve`, { approved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/taxi/vehicles/approved"] });
      toast({
        title: "Vehicle Updated",
        description: "Vehicle approval status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApproval = (vehicleId: number, approved: boolean) => {
    approveMutation.mutate({ vehicleId, approved });
  };

  const VehicleCard = ({ vehicle }: { vehicle: TaxiVehicle }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {vehicle.vehicleNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={vehicle.adminApproved ? "default" : "secondary"}>
              {vehicle.adminApproved ? "Approved" : "Pending"}
            </Badge>
            <Badge variant={vehicle.isActive ? "default" : "secondary"}>
              {vehicle.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Type: {vehicle.vehicleType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Seats: {vehicle.seatingCapacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Fuel: {vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">District: {vehicle.district}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Insurance: {vehicle.insuranceValid ? "Valid" : "Invalid"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Registered: {new Date(vehicle.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Vehicle Details</h4>
            <p className="text-sm text-muted-foreground">Color: {vehicle.color}</p>
            <p className="text-sm text-muted-foreground">RC Number: {vehicle.rcNumber}</p>
            <p className="text-sm text-muted-foreground">Insurance: {vehicle.insuranceNumber}</p>
            <p className="text-sm text-muted-foreground">License: {vehicle.driverLicenseNumber}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Pricing & Features</h4>
            <p className="text-sm text-muted-foreground">Base Fare: ₹{vehicle.baseFarePerKm}/km</p>
            <p className="text-sm text-muted-foreground">Waiting Charge: ₹{vehicle.baseWaitingCharge}</p>
            <p className="text-sm text-muted-foreground">AC Available: {vehicle.acAvailable ? "Yes" : "No"}</p>
            <p className="text-sm text-muted-foreground">GPS Enabled: {vehicle.gpsEnabled ? "Yes" : "No"}</p>
          </div>
        </div>

        {vehicle.availableAreas && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Available Areas</h4>
            <p className="text-sm text-muted-foreground">{vehicle.availableAreas}</p>
          </div>
        )}

        {!vehicle.adminApproved && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApproval(vehicle.id, true)}
              disabled={approveMutation.isPending}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleApproval(vehicle.id, false)}
              disabled={approveMutation.isPending}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Taxi Vehicle Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve taxi vehicle registrations
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending Approvals ({pendingVehicles?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved Vehicles ({approvedVehicles?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingLoading ? (
            <div className="text-center py-8">Loading pending vehicles...</div>
          ) : pendingVehicles?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending vehicle approvals</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingVehicles?.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedLoading ? (
            <div className="text-center py-8">Loading approved vehicles...</div>
          ) : approvedVehicles?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No approved vehicles yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvedVehicles?.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}