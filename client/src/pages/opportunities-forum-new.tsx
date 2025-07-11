import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, MessageSquare, Users, MapPin, Award, Phone } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Nomination form schema
const nominationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  roleAppliedFor: z.string().min(1, "Please select a role"),
  district: z.string().min(1, "Please select a district"),
  taluk: z.string().min(1, "Please select a taluk"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  servicesProvided: z.string().min(10, "Please describe the service in at least 10 characters"),
});

type NominationForm = z.infer<typeof nominationSchema>;

// OTP verification schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

// Message schema
const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

type MessageForm = z.infer<typeof messageSchema>;

export default function OpportunitiesForumNew() {
  const [showNominationDialog, setShowNominationDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [pendingNomination, setPendingNomination] = useState<any>(null);
  const [selectedNomination, setSelectedNomination] = useState<any>(null);
  const [showMessagesDialog, setShowMessagesDialog] = useState(false);
  const { toast } = useToast();

  // Queries
  const { data: approvedNominations = [], isLoading: nominationsLoading } = useQuery({
    queryKey: ["/api/nominations/approved"],
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["/api/districts"],
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/public-messages", selectedNomination?.id],
    enabled: !!selectedNomination?.id,
  });

  // Forms
  const nominationForm = useForm<NominationForm>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      roleAppliedFor: "",
      district: "",
      taluk: "",
      pincode: "",
      servicesProvided: "",
    },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const messageForm = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  // Mutations
  const nominationMutation = useMutation({
    mutationFn: async (data: NominationForm) => {
      const res = await apiRequest("POST", "/api/nominations", data);
      return res.json();
    },
    onSuccess: (nomination) => {
      setPendingNomination(nomination);
      setShowNominationDialog(false);
      setShowOtpDialog(true);
      toast({
        title: "Nomination Submitted",
        description: "Please verify your phone number with the OTP sent to you.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const otpMutation = useMutation({
    mutationFn: async (data: OtpForm) => {
      const res = await apiRequest("POST", "/api/verify-otp", {
        phoneNumber: pendingNomination.phoneNumber,
        otp: data.otp,
        purpose: "nomination",
      });
      return res.json();
    },
    onSuccess: () => {
      setShowOtpDialog(false);
      setPendingNomination(null);
      toast({
        title: "Phone Verified",
        description: "Your nomination has been submitted for admin review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (data: MessageForm) => {
      const res = await apiRequest("POST", "/api/public-messages", {
        nominationId: selectedNomination.id,
        senderName: "Anonymous",
        message: data.message,
      });
      return res.json();
    },
    onSuccess: () => {
      messageForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/public-messages", selectedNomination.id] });
      toast({
        title: "Message Sent",
        description: "Your message has been posted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get taluks for selected district
  const { data: taluks = [] } = useQuery({
    queryKey: ["/api/taluks", nominationForm.watch("district")],
    enabled: !!nominationForm.watch("district"),
  });

  const onNominationSubmit = (data: NominationForm) => {
    nominationMutation.mutate(data);
  };

  const onOtpSubmit = (data: OtpForm) => {
    otpMutation.mutate(data);
  };

  const onMessageSubmit = (data: MessageForm) => {
    messageMutation.mutate(data);
  };

  const openMessagesDialog = (nomination: any) => {
    setSelectedNomination(nomination);
    setShowMessagesDialog(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Opportunities Forum
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with service providers and discover opportunities in your community. 
          Submit nominations to showcase local talent and services.
        </p>
        
        {/* Nominate Button */}
        <Dialog open={showNominationDialog} onOpenChange={setShowNominationDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => {
                console.log("Nominate button clicked");
                setShowNominationDialog(true);
              }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Nominate Yourself
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit a Nomination</DialogTitle>
              <DialogDescription>
                Nominate someone who provides excellent services in your community.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...nominationForm}>
              <form onSubmit={nominationForm.handleSubmit(onNominationSubmit)} className="space-y-4">
                <FormField
                  control={nominationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="roleAppliedFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role/Profession</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="transport">Transport Service</SelectItem>
                          <SelectItem value="taxi">Taxi Service</SelectItem>
                          <SelectItem value="rental">Rental Service</SelectItem>
                          <SelectItem value="recycling">Recycling Agent</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {districts.map((district: string) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="taluk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taluk</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select taluk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taluks.map((taluk: any) => (
                            <SelectItem key={taluk.name} value={taluk.name}>
                              {taluk.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="6-digit pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nominationForm.control}
                  name="servicesProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the services provided..."
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
                  disabled={nominationMutation.isPending}
                >
                  {nominationMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Nomination
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to {pendingNomination?.phoneNumber}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={otpMutation.isPending}
              >
                {otpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Approved Nominations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          Featured Service Providers
        </h2>

        {nominationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedNominations.map((nomination: any) => (
              <Card key={nomination.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nomination.name}</CardTitle>
                    <Badge variant="secondary">{nomination.role}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {nomination.taluk}, {nomination.district} - {nomination.pincode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {nomination.serviceProvided}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openMessagesDialog(nomination)}
                    >
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="mr-1 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {approvedNominations.length === 0 && !nominationsLoading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Featured Providers Yet</h3>
            <p className="text-muted-foreground">
              Be the first to nominate someone from your community!
            </p>
          </div>
        )}
      </div>

      {/* Messages Dialog */}
      <Dialog open={showMessagesDialog} onOpenChange={setShowMessagesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chat with {selectedNomination?.name}</DialogTitle>
            <DialogDescription>
              Public messages for {selectedNomination?.role} services
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Messages List */}
            <div className="max-h-96 overflow-y-auto space-y-3 border rounded p-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground">No messages yet. Be the first to send one!</p>
              ) : (
                messages.map((message: any) => (
                  <div key={message.id} className="bg-muted rounded p-3">
                    <div className="font-medium text-sm">{message.senderName}</div>
                    <div className="text-sm mt-1">{message.message}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Send Message Form */}
            <Form {...messageForm}>
              <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="flex gap-2">
                <FormField
                  control={messageForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Type your message..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={messageMutation.isPending}
                >
                  {messageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}