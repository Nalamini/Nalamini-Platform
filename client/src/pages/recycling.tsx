import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Recycle, Calendar as CalendarIcon } from "lucide-react";

// Schema for the recycling request form
const recyclingRequestSchema = z.object({
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  pincode: z.string().min(6, { message: "Please enter a valid pincode" }),
  date: z.date({ required_error: "Please select a date" }),
  timeSlot: z.enum(["morning", "afternoon", "evening"], { 
    required_error: "Please select a time slot" 
  }),
  materials: z.array(z.string()).refine(val => val.length > 0, {
    message: "Please select at least one material"
  }),
  additionalNotes: z.string().optional()
});

// Type for the form data
type RecyclingRequestForm = z.infer<typeof recyclingRequestSchema>;

// Materials available for recycling with rates - Only plastic, aluminum, copper, and brass as required
const MATERIALS = [
  { id: "plastic", label: "Plastic", rate: 15 },
  { id: "aluminum", label: "Aluminum", rate: 90 },
  { id: "copper", label: "Copper", rate: 400 },
  { id: "brass", label: "Brass", rate: 300 }
];

// Map status to badge color
const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge variant="outline">New</Badge>;
    case "assigned":
      return <Badge variant="secondary">Assigned</Badge>;
    case "collected":
      return <Badge className="bg-blue-600 text-white">Collected</Badge>;
    case "verified":
      return <Badge className="bg-green-600 text-white">Verified</Badge>;
    case "closed":
      return <Badge className="bg-gray-600 text-white">Closed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Map time slot to readable format
const formatTimeSlot = (slot: string) => {
  switch (slot) {
    case "morning":
      return "Morning (8 AM - 12 PM)";
    case "afternoon":
      return "Afternoon (12 PM - 4 PM)";
    case "evening":
      return "Evening (4 PM - 8 PM)";
    default:
      return slot;
  }
};

export default function RecyclingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("request");

  // Form for creating a new recycling request
  const form = useForm<RecyclingRequestForm>({
    resolver: zodResolver(recyclingRequestSchema),
    defaultValues: {
      address: "",
      pincode: "",
      timeSlot: "morning",
      materials: [],
      additionalNotes: ""
    }
  });

  // Query to fetch existing recycling requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/recycling/requests"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/recycling/requests");
      if (!res.ok) {
        throw new Error("Failed to fetch recycling requests");
      }
      return res.json();
    }
  });

  // Mutation to create a new recycling request
  const createRequestMutation = useMutation({
    mutationFn: async (data: RecyclingRequestForm) => {
      // Convert materials array to comma-separated string
      const formattedData = {
        ...data,
        materials: data.materials.join(",")
      };

      const res = await apiRequest("POST", "/api/recycling/request", formattedData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create recycling request");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your recycling collection request has been submitted",
      });
      
      // Reset form and refetch requests
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/recycling/requests"] });
      
      // Switch to history tab
      setActiveTab("history");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: RecyclingRequestForm) => {
    createRequestMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Recycling Service</h1>
        <p className="text-muted-foreground">
          Schedule collection of recyclable materials and earn money for your contribution to the environment
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request Collection</TabsTrigger>
          <TabsTrigger value="history">Collection History</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                <span>Schedule Recycling Collection</span>
              </CardTitle>
              <CardDescription>
                Fill in the details below to schedule a recycling collection. Our service agent will collect your recyclables and pay you based on the materials and weight.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collection Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your full address" {...field} className="resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your pincode" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll assign a service agent based on your pincode.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Collection Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Choose a date within the next 30 days.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Preferred Time Slot</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="morning" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Morning (8 AM - 12 PM)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="afternoon" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Afternoon (12 PM - 4 PM)
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="evening" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Evening (4 PM - 8 PM)
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="materials"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Materials for Recycling</FormLabel>
                          <FormDescription>
                            Select the materials you want to recycle. You'll be paid based on the weight and material type.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {MATERIALS.map((material) => (
                            <FormField
                              key={material.id}
                              control={form.control}
                              name="materials"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={material.id}
                                    className="flex flex-col items-start space-x-0 rounded-md border p-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(material.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...field.value, material.id]
                                              : field.value?.filter(
                                                  (value) => value !== material.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {material.label}
                                      </FormLabel>
                                    </div>
                                    <FormDescription className="ml-6 mt-2">
                                      ₹{material.rate}/kg
                                    </FormDescription>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special instructions or notes for the collector"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createRequestMutation.isPending}
                  >
                    {createRequestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Schedule Collection"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Recycling History</CardTitle>
              <CardDescription>
                View all your recycling collection requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !requests || requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven't made any recycling requests yet.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("request")}
                  >
                    Schedule Your First Collection
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request: any) => (
                    <Card key={request.id} className="overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <Recycle className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{request.requestNumber || `Collection Request #${request.id}`}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(request.date).toLocaleDateString()} - {formatTimeSlot(request.timeSlot)}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardContent className="p-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Collection Address</h4>
                            <p className="text-sm mt-1">{request.address}</p>
                            <p className="text-sm">Pincode: {request.pincode}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Materials</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {request.materials.split(",").map((material: string) => (
                                <Badge key={material} variant="outline" className="capitalize">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {request.additionalNotes && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium">Additional Notes</h4>
                            <p className="text-sm mt-1">{request.additionalNotes}</p>
                          </div>
                        )}
                        
                        {/* Show collection details */}
                        {(request.status === "collected" || request.status === "verified" || request.status === "closed") && request.totalWeight && (
                          <div className="mt-4 p-3 bg-primary/10 rounded-md">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Collection Details</h4>
                                <p className="text-sm">Total Weight: {request.totalWeight} kg</p>
                                {request.collectedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Collected on: {new Date(request.collectedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Amount Earned</p>
                                <p className="text-xl font-bold text-primary">₹{request.amount}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Show verification details */}
                        {(request.status === "verified" || request.status === "closed") && request.verifiedAt && (
                          <div className="mt-2 text-xs text-right text-muted-foreground">
                            Verified on: {new Date(request.verifiedAt).toLocaleDateString()}
                          </div>
                        )}
                        
                        {/* Show closed details */}
                        {request.status === "closed" && request.closedAt && (
                          <div className="mt-2 text-xs text-right text-muted-foreground">
                            Completed on: {new Date(request.closedAt).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}