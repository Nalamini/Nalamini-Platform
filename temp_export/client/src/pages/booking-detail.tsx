import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, CalendarIcon, ClockIcon, UsersIcon, BusIcon, PlaneIcon, HotelIcon, LoaderIcon, ArrowLeftIcon } from "lucide-react";

interface BookingDetail {
  id: number;
  userId: number;
  bookingType: 'bus' | 'flight' | 'hotel';
  status: string;
  origin: string | null;
  destination: string | null;
  checkIn: string | null;
  checkOut: string | null;
  passengers: number | null;
  provider: string | null;
  commission: number | null;
  amount: number;
  createdAt: string;
}

export default function BookingDetailPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams();
  const bookingId = params.id;

  // Fetch booking details
  const { data: booking, isLoading, error } = useQuery<BookingDetail>({
    queryKey: [`/api/travel/booking/${bookingId}`],
    enabled: !!bookingId,
  });

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`/api/travel/booking/${bookingId}/cancel`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }
      
      toast({
        title: "Booking Cancelled",
        description: `Your booking has been cancelled and ₹${data.amount} has been refunded to your wallet`,
      });
      
      // Redirect to bookings page
      setLocation("/travel");
      
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "An error occurred during cancellation",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>Could not load booking details</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error instanceof Error ? error.message : "An error occurred while loading booking details"}</p>
            <Button onClick={() => setLocation("/travel")}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Travel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBookingIcon = () => {
    switch (booking.bookingType) {
      case 'bus':
        return <BusIcon className="h-8 w-8 text-primary" />;
      case 'flight':
        return <PlaneIcon className="h-8 w-8 text-primary" />;
      case 'hotel':
        return <HotelIcon className="h-8 w-8 text-primary" />;
      default:
        return null;
    }
  };

  const getBookingTypeText = () => {
    switch (booking.bookingType) {
      case 'bus':
        return 'Bus Ticket';
      case 'flight':
        return 'Flight Ticket';
      case 'hotel':
        return 'Hotel Reservation';
      default:
        return 'Booking';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (booking.status.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <Button variant="outline" onClick={() => setLocation("/travel")}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Travel
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {getBookingIcon()}
            <div>
              <CardTitle className="text-2xl">{getBookingTypeText()}</CardTitle>
              <CardDescription>Booking ID: {booking.id}</CardDescription>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant()}>
            {booking.status}
          </Badge>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Booking Date</h3>
                <p className="text-lg font-medium flex items-center mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {formatDate(booking.createdAt)}
                </p>
              </div>
              
              {booking.bookingType !== 'hotel' && booking.origin && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Origin</h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    <MapPinIcon className="mr-2 h-4 w-4 text-primary" />
                    {booking.origin}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {booking.bookingType === 'hotel' ? 'Location' : 'Destination'}
                </h3>
                <p className="text-lg font-medium flex items-center mt-1">
                  <MapPinIcon className="mr-2 h-4 w-4 text-primary" />
                  {booking.destination || 'N/A'}
                </p>
              </div>
              
              {booking.checkIn && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {booking.bookingType === 'hotel' ? 'Check-in Date' : 'Travel Date'}
                  </h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {formatDate(booking.checkIn)}
                  </p>
                </div>
              )}
              
              {booking.bookingType === 'hotel' && booking.checkOut && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Check-out Date</h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {formatDate(booking.checkOut)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {booking.passengers && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {booking.bookingType === 'hotel' ? 'Guests' : 'Passengers'}
                  </h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    <UsersIcon className="mr-2 h-4 w-4 text-primary" />
                    {booking.passengers}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Amount Paid</h3>
                <p className="text-2xl font-bold mt-1 text-primary">
                  ₹{booking.amount.toLocaleString('en-IN')}
                </p>
              </div>

              {booking.provider && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Booking Provider</h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    {booking.provider}
                  </p>
                </div>
              )}
              
              {booking.commission !== null && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Commission Applied</h3>
                  <p className="text-lg font-medium flex items-center mt-1">
                    {booking.commission}%
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                {booking.status.toLowerCase() === 'confirmed' && (
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelBooking} 
                    className="w-full md:w-auto"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">Important Information</h3>
            <ul className="space-y-2 text-sm">
              <li>• Please arrive at least 30 minutes before departure time for bus/flight bookings.</li>
              <li>• Carry a valid ID proof for verification at the time of boarding/check-in.</li>
              <li>• Cancellation charges may apply as per policy.</li>
              <li>• For any assistance, please contact our customer support.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}