import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Booking } from "@/types";

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
  Plane,
  Bus,
  Building,
  Calendar,
  MapPin,
  Users,
  Check,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

// Schema for booking
const bookingSchema = z.object({
  bookingType: z.enum(["bus", "flight", "hotel"]),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required").optional(),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required").optional(),
  passengers: z.string()
    .min(1, "Number of passengers is required")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Passengers must be a positive number",
    }).optional(),
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
  }).format(date);
}

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bus");
  const today = new Date().toISOString().split('T')[0];

  // Query to fetch booking history
  const { data: bookingHistory, isLoading: isLoadingHistory } = useQuery<Booking[]>({
    queryKey: ["/api/booking"],
    enabled: !!user,
  });

  // Form for booking
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType: "bus",
      origin: "",
      destination: "",
      checkIn: today,
      checkOut: "",
      passengers: "1",
      amount: "",
    },
  });

  // Watch booking type to adjust form fields
  const bookingType = form.watch("bookingType");

  // Update form when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("bookingType", value as "bus" | "flight" | "hotel");
    
    // Reset certain fields based on type
    if (value === "hotel") {
      form.setValue("destination", "");
    } else {
      form.setValue("checkOut", "");
    }
  };

  // Popular cities for origin/destination
  const popularCities = [
    "Chennai", "Coimbatore", "Madurai", "Trichy", 
    "Salem", "Tirunelveli", "Erode", "Vellore"
  ];

  // Mutation for booking
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Format the data
      const formattedData = {
        ...data,
        passengers: data.passengers ? parseInt(data.passengers) : undefined,
        amount: parseFloat(data.amount),
        status: "pending"
      };
      
      const res = await apiRequest("POST", "/api/booking", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: `Your ${bookingType} booking has been confirmed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/booking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      form.reset({
        bookingType,
        origin: "",
        destination: "",
        checkIn: today,
        checkOut: "",
        passengers: "1",
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
  function onSubmit(values: BookingFormValues) {
    bookingMutation.mutate(values);
  }

  // Set mock amounts for simplicity
  const setMockAmount = (type: string) => {
    switch (type) {
      case "bus":
        form.setValue("amount", "650");
        break;
      case "flight":
        form.setValue("amount", "3500");
        break;
      case "hotel":
        form.setValue("amount", "2800");
        break;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Travel Bookings</h2>
        <p className="mt-1 text-sm text-neutral-500">Book buses, flights, and hotels across Tamil Nadu and beyond.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Travel</CardTitle>
              <CardDescription>Find the best deals for your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="bus" className="flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    <span>Bus</span>
                  </TabsTrigger>
                  <TabsTrigger value="flight" className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    <span>Flight</span>
                  </TabsTrigger>
                  <TabsTrigger value="hotel" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>Hotel</span>
                  </TabsTrigger>
                </TabsList>

                {/* Bus Booking Form */}
                <TabsContent value="bus">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                From
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select origin city" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {popularCities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                To
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select destination city" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {popularCities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Journey Date
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  min={today}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="passengers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Passengers
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="10" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fare Amount</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled
                                className="bg-neutral-50"
                              />
                            </FormControl>
                            {!field.value && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setMockAmount("bus")}
                              >
                                Check Fare
                              </Button>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={bookingMutation.isPending || !form.getValues("amount")}
                      >
                        {bookingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Book Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Flight Booking Form */}
                <TabsContent value="flight">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                From
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select origin city" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["Chennai", "Coimbatore", "Madurai", "Trichy"].map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                To
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select destination city" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Kolkata"].map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Journey Date
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  min={today}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="passengers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Passengers
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="10" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fare Amount</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled
                                className="bg-neutral-50"
                              />
                            </FormControl>
                            {!field.value && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setMockAmount("flight")}
                              >
                                Check Fare
                              </Button>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={bookingMutation.isPending || !form.getValues("amount")}
                      >
                        {bookingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Book Flight
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Hotel Booking Form */}
                <TabsContent value="hotel">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              City
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {popularCities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="checkIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Check-in Date
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  min={today}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="checkOut"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Check-out Date
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  min={form.getValues("checkIn") || today}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="passengers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Guests
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="10" 
                                  {...field} 
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
                              <FormLabel>Room Rate</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled
                                  className="bg-neutral-50"
                                />
                              </FormControl>
                              {!field.value && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setMockAmount("hotel")}
                                >
                                  Check Rate
                                </Button>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={bookingMutation.isPending || !form.getValues("amount")}
                      >
                        {bookingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Book Hotel
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>View your recent travel bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookingHistory && bookingHistory.length > 0 ? (
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="flex items-start border-b border-neutral-200 pb-4 last:border-0">
                      <div className={`p-2 rounded-full ${
                        booking.status === "confirmed" 
                          ? "bg-green-100 text-green-600" 
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {booking.bookingType === "bus" ? (
                          <Bus className="h-4 w-4" />
                        ) : booking.bookingType === "flight" ? (
                          <Plane className="h-4 w-4" />
                        ) : (
                          <Building className="h-4 w-4" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-neutral-900">
                            {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)} Booking
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            ₹{booking.amount}
                          </p>
                        </div>
                        {booking.bookingType !== "hotel" && (
                          <p className="text-xs text-neutral-500">
                            {booking.origin} to {booking.destination}
                          </p>
                        )}
                        {booking.bookingType === "hotel" && (
                          <p className="text-xs text-neutral-500">
                            {booking.origin} - {booking.checkIn && formatDate(booking.checkIn)} to {booking.checkOut && formatDate(booking.checkOut)}
                          </p>
                        )}
                        {booking.bookingType !== "hotel" && (
                          <p className="text-xs text-neutral-500">
                            {booking.checkIn && formatDate(booking.checkIn)}
                            {booking.passengers && ` • ${booking.passengers} ${booking.passengers === 1 ? 'passenger' : 'passengers'}`}
                          </p>
                        )}
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            booking.status === "confirmed" 
                              ? "bg-green-100 text-green-600" 
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-neutral-500">No bookings found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your travel bookings will appear here
                  </p>
                </div>
              )}
            </CardContent>
            {bookingHistory && bookingHistory.length > 5 && (
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary">
                  View All Bookings
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
