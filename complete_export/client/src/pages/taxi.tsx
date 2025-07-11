import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TaxiRide } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Car,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  ArrowRight,
  LocateFixed,
  Search,
} from "lucide-react";

// Schema for taxi ride
const taxiRideSchema = z.object({
  pickup: z.string().min(1, "Pickup location is required"),
  dropoff: z.string().min(1, "Dropoff location is required"),
  distance: z.string()
    .min(1, "Distance is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Distance must be a positive number",
    }),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
});

// Utility function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

type TaxiRideFormValues = z.infer<typeof taxiRideSchema>;

export default function TaxiPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("regular");
  
  // Query to fetch taxi ride history
  const { data: taxiRides, isLoading: isLoadingHistory } = useQuery<TaxiRide[]>({
    queryKey: ["/api/taxi"],
    enabled: !!user,
  });

  // Form for taxi ride
  const form = useForm<TaxiRideFormValues>({
    resolver: zodResolver(taxiRideSchema),
    defaultValues: {
      pickup: "",
      dropoff: "",
      distance: "",
      amount: "",
    },
  });

  // Popular locations in Tamil Nadu
  const popularLocations = [
    "Chennai Central", "T Nagar", "Anna Nagar", "Adyar", "Velachery",
    "Tambaram", "Guindy", "Mylapore", "Egmore", "Porur", "Vadapalani",
    "Nungambakkam", "Besant Nagar", "Royapettah", "Teynampet"
  ];

  // Watch for distance changes
  const distance = form.watch("distance");
  
  // Update amount when distance or cab type changes
  const calculateFare = () => {
    if (distance) {
      const distanceValue = parseFloat(distance);
      let ratePerKm = 0;
      
      switch(activeTab) {
        case "regular":
          ratePerKm = 12;
          break;
        case "premium":
          ratePerKm = 18;
          break;
        case "suv":
          ratePerKm = 22;
          break;
        default:
          ratePerKm = 12;
      }
      
      const baseFare = 40;
      const totalFare = baseFare + (distanceValue * ratePerKm);
      form.setValue("amount", totalFare.toFixed(2));
    }
  };

  // Mutation for taxi ride
  const taxiRideMutation = useMutation({
    mutationFn: async (data: TaxiRideFormValues) => {
      // Format the data
      const formattedData = {
        ...data,
        distance: parseFloat(data.distance),
        amount: parseFloat(data.amount),
        status: "pending"
      };
      
      const res = await apiRequest("POST", "/api/taxi", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Taxi Booked Successfully",
        description: `Your ride from ${form.getValues("pickup")} to ${form.getValues("dropoff")} has been confirmed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/taxi"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      form.reset({
        pickup: "",
        dropoff: "",
        distance: "",
        amount: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: TaxiRideFormValues) {
    taxiRideMutation.mutate(values);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Taxi Services</h2>
        <p className="mt-1 text-sm text-neutral-500">Book taxis for your travel needs within Tamil Nadu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Taxi Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book a Ride</CardTitle>
              <CardDescription>Choose your cab type and enter journey details</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                if (distance) {
                  setTimeout(calculateFare, 0);
                }
              }}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="regular" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Regular</span>
                  </TabsTrigger>
                  <TabsTrigger value="premium" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>Premium</span>
                  </TabsTrigger>
                  <TabsTrigger value="suv" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span>SUV</span>
                  </TabsTrigger>
                </TabsList>

                {/* Cab type tabs */}
                {["regular", "premium", "suv"].map((cabType) => (
                  <TabsContent key={cabType} value={cabType}>
                    <div className="bg-primary/5 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          <Car className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-primary">
                            {cabType === "regular" ? "Regular Cab" : cabType === "premium" ? "Premium Sedan" : "SUV"}
                          </h4>
                          <p className="text-xs text-neutral-600">
                            {cabType === "regular" 
                              ? "Affordable rides for daily travel" 
                              : cabType === "premium" 
                                ? "Comfortable sedans for a premium experience" 
                                : "Spacious SUVs for family and group travel"}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm font-medium text-neutral-900">
                            ₹{cabType === "regular" ? "12" : cabType === "premium" ? "18" : "22"}/km
                          </p>
                          <p className="text-xs text-neutral-500">+ ₹40 base fare</p>
                        </div>
                      </div>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="pickup"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Pickup Location
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="pl-9">
                                      <SelectValue placeholder="Enter pickup location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {popularLocations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                          {location}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MapPin className="h-4 w-4 text-neutral-400" />
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <FormMessage />
                                <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs flex items-center gap-1 text-primary">
                                  <LocateFixed className="h-3 w-3" />
                                  Current Location
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dropoff"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Dropoff Location
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="pl-9">
                                      <SelectValue placeholder="Enter dropoff location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {popularLocations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                          {location}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MapPin className="h-4 w-4 text-neutral-400" />
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Distance (km)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    step="0.1" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setTimeout(calculateFare, 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estimated Fare</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled
                                    className="bg-neutral-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={taxiRideMutation.isPending || !form.getValues("amount")}
                        >
                          {taxiRideMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Book Taxi
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ride History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Rides</CardTitle>
              <CardDescription>View your recent taxi bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : taxiRides && taxiRides.length > 0 ? (
                <div className="space-y-4">
                  {taxiRides.map((ride) => (
                    <div key={ride.id} className="flex items-start border-b border-neutral-200 pb-4 last:border-0">
                      <div className={`p-2 rounded-full ${
                        ride.status === "completed" 
                          ? "bg-green-100 text-green-600" 
                          : ride.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : ride.status === "active"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                      }`}>
                        <Car className="h-4 w-4" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-neutral-900">
                            Taxi Ride
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            ₹{ride.amount}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {ride.pickup} → {ride.dropoff}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(ride.createdAt)} • {ride.distance} km
                        </p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ride.status === "completed" 
                              ? "bg-green-100 text-green-600" 
                              : ride.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : ride.status === "active"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {ride.status === "active" && (
                        <div className="ml-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs h-8 px-2"
                          >
                            Track
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-neutral-500">No rides found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your taxi bookings will appear here
                  </p>
                </div>
              )}
            </CardContent>
            {taxiRides && taxiRides.length > 5 && (
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary">
                  View All Rides
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
