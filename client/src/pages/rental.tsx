import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Rental } from "@/types";

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
  Wrench,
  HardHat,
  Brush,
  Stethoscope,
  Gem,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

// Schema for rental
const rentalSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  category: z.enum(["power_tools", "construction", "cleaning", "medical", "ornament"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
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

// Calculate duration between two dates in days
function calculateDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

type RentalFormValues = z.infer<typeof rentalSchema>;

export default function RentalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("power_tools");
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  // Query to fetch rental history
  const { data: rentalHistory, isLoading: isLoadingHistory } = useQuery<Rental[]>({
    queryKey: ["/api/rental"],
    enabled: !!user,
  });

  // Form for rental
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      itemName: "",
      category: "power_tools",
      startDate: today,
      endDate: tomorrowString,
      amount: "",
    },
  });

  // Watch form values for changes
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const itemName = form.watch("itemName");

  // Update form when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("category", value as "power_tools" | "construction" | "cleaning" | "medical" | "ornament");
    form.setValue("itemName", "");
    form.setValue("amount", "");
  };

  // Item options for each category
  const categoryItems = {
    power_tools: [
      {name: "Drill Machine", rate: 200},
      {name: "Circular Saw", rate: 250},
      {name: "Angle Grinder", rate: 180},
      {name: "Jigsaw", rate: 220},
      {name: "Router", rate: 260}
    ],
    construction: [
      {name: "Concrete Mixer", rate: 800},
      {name: "Scaffolding Set", rate: 600},
      {name: "Tile Cutter", rate: 350},
      {name: "Compactor", rate: 700},
      {name: "Ladder (8ft)", rate: 120}
    ],
    cleaning: [
      {name: "Pressure Washer", rate: 400},
      {name: "Industrial Vacuum", rate: 300},
      {name: "Floor Polisher", rate: 350},
      {name: "Carpet Cleaner", rate: 450},
      {name: "Steam Cleaner", rate: 380}
    ],
    medical: [
      {name: "Wheelchair", rate: 150},
      {name: "Hospital Bed", rate: 500},
      {name: "Oxygen Concentrator", rate: 700},
      {name: "Blood Pressure Monitor", rate: 80},
      {name: "Nebulizer", rate: 120}
    ],
    ornament: [
      {name: "Bridal Jewelry Set", rate: 1200},
      {name: "Wedding Necklace", rate: 800},
      {name: "Traditional Earrings", rate: 400},
      {name: "Designer Bangles", rate: 350},
      {name: "Statement Rings", rate: 300}
    ]
  };

  // Category icons
  const categoryIcons = {
    power_tools: <Wrench className="h-5 w-5" />,
    construction: <HardHat className="h-5 w-5" />,
    cleaning: <Brush className="h-5 w-5" />,
    medical: <Stethoscope className="h-5 w-5" />,
    ornament: <Gem className="h-5 w-5" />
  };

  // Update amount when item or dates change
  const updateAmount = () => {
    if (itemName && startDate && endDate) {
      const selectedItem = categoryItems[activeTab as keyof typeof categoryItems].find(item => item.name === itemName);
      if (selectedItem) {
        const days = calculateDays(startDate, endDate);
        const totalAmount = selectedItem.rate * days;
        form.setValue("amount", totalAmount.toString());
      }
    }
  };

  // Mutation for rental
  const rentalMutation = useMutation({
    mutationFn: async (data: RentalFormValues) => {
      // Format the data
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        status: "pending"
      };
      
      // Create the rental
      const rentalRes = await apiRequest("POST", "/api/rental", formattedData);
      const rental = await rentalRes.json();
      
      // Automatically create service request
      const serviceRequestData = {
        serviceType: "rental",
        amount: parseFloat(data.amount),
        paymentMethod: "razorpay",
        serviceData: {
          itemName: data.itemName,
          category: data.category,
          startDate: data.startDate,
          endDate: data.endDate,
          rentalId: rental.id
        }
      };
      
      const serviceRes = await apiRequest("POST", "/api/service-requests", serviceRequestData);
      const serviceRequest = await serviceRes.json();
      
      return { rental, serviceRequest };
    },
    onSuccess: (data) => {
      toast({
        title: "Rental Successful",
        description: `Your ${itemName} has been rented successfully! Service request ${data.serviceRequest.srNumber} has been generated.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rental"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] });
      form.reset({
        itemName: "",
        category: activeTab as "power_tools" | "construction" | "cleaning" | "medical" | "ornament",
        startDate: today,
        endDate: tomorrowString,
        amount: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Rental Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: RentalFormValues) {
    rentalMutation.mutate(values);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Rental Services</h2>
        <p className="mt-1 text-sm text-neutral-500">Rent tools and equipment for your needs at affordable prices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Rental Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rent Equipment</CardTitle>
              <CardDescription>Select from our wide range of rental items</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="power_tools" className="flex flex-col py-2 px-1 h-auto">
                    <Wrench className="h-5 w-5 mb-1" />
                    <span className="text-xs">Power Tools</span>
                  </TabsTrigger>
                  <TabsTrigger value="construction" className="flex flex-col py-2 px-1 h-auto">
                    <HardHat className="h-5 w-5 mb-1" />
                    <span className="text-xs">Construction</span>
                  </TabsTrigger>
                  <TabsTrigger value="cleaning" className="flex flex-col py-2 px-1 h-auto">
                    <Brush className="h-5 w-5 mb-1" />
                    <span className="text-xs">Cleaning</span>
                  </TabsTrigger>
                  <TabsTrigger value="medical" className="flex flex-col py-2 px-1 h-auto">
                    <Stethoscope className="h-5 w-5 mb-1" />
                    <span className="text-xs">Medical</span>
                  </TabsTrigger>
                  <TabsTrigger value="ornament" className="flex flex-col py-2 px-1 h-auto">
                    <Gem className="h-5 w-5 mb-1" />
                    <span className="text-xs">Ornaments</span>
                  </TabsTrigger>
                </TabsList>

                {/* Content for all categories */}
                {Object.keys(categoryItems).map((category) => (
                  <TabsContent key={category} value={category}>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="itemName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                {categoryIcons[category as keyof typeof categoryIcons]}
                                <span>Select Item</span>
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Update amount after selecting item
                                  setTimeout(updateAmount, 0);
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select a ${category.replace('_', ' ')}`} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoryItems[category as keyof typeof categoryItems].map((item) => (
                                    <SelectItem key={item.name} value={item.name}>
                                      {item.name} - ₹{item.rate}/day
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
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Start Date
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    min={today}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      // Update amount after changing date
                                      setTimeout(updateAmount, 0);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  End Date
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    min={startDate || today}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      // Update amount after changing date
                                      setTimeout(updateAmount, 0);
                                    }}
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
                              <FormLabel>Total Rental Amount</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled
                                  className="bg-neutral-50"
                                />
                              </FormControl>
                              <FormMessage />
                              {itemName && startDate && endDate && !field.value && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={updateAmount}
                                >
                                  Calculate Amount
                                </Button>
                              )}
                              {field.value && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  {calculateDays(startDate, endDate)} days × ₹{
                                    categoryItems[category as keyof typeof categoryItems].find(
                                      item => item.name === itemName
                                    )?.rate || 0
                                  }/day
                                </p>
                              )}
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={rentalMutation.isPending || !form.getValues("amount")}
                        >
                          {rentalMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Rent Now
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

        {/* Right Column - Rental History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Rentals</CardTitle>
              <CardDescription>View your active and past rentals</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rentalHistory && rentalHistory.length > 0 ? (
                <div className="space-y-4">
                  {rentalHistory.map((rental) => (
                    <div key={rental.id} className="flex items-start border-b border-neutral-200 pb-4 last:border-0">
                      <div className={`p-2 rounded-full ${
                        rental.status === "active" 
                          ? "bg-green-100 text-green-600" 
                          : rental.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : rental.status === "returned"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {(() => {
                          switch(rental.category) {
                            case "power_tools": return <Wrench className="h-4 w-4" />;
                            case "construction": return <HardHat className="h-4 w-4" />;
                            case "cleaning": return <Brush className="h-4 w-4" />;
                            case "medical": return <Stethoscope className="h-4 w-4" />;
                            case "ornament": return <Gem className="h-4 w-4" />;
                            default: return <Wrench className="h-4 w-4" />;
                          }
                        })()}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-neutral-900">
                            {rental.itemName}
                          </p>
                          <p className="text-sm font-semibold text-neutral-900">
                            ₹{rental.amount}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {formatDate(rental.startDate)} to {formatDate(rental.endDate)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {rental.category.charAt(0).toUpperCase() + rental.category.slice(1).replace('_', ' ')}
                          {' • '}{calculateDays(rental.startDate, rental.endDate)} days
                        </p>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            rental.status === "active" 
                              ? "bg-green-100 text-green-600" 
                              : rental.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : rental.status === "returned"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-yellow-100 text-yellow-600"
                          }`}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {rental.status === "active" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-2 text-xs h-8"
                        >
                          Return
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-neutral-500">No rentals found</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your rental history will appear here
                  </p>
                </div>
              )}
            </CardContent>
            {rentalHistory && rentalHistory.length > 5 && (
              <CardFooter>
                <Button variant="ghost" className="w-full text-primary">
                  View All Rentals
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
