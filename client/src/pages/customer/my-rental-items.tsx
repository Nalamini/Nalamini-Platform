import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, MapPin, Clock, Star } from "lucide-react";
import { format } from "date-fns";

interface CustomerRentalItem {
  id: number;
  itemName: string;
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: Date;
  providerId: number;
  providerName?: string;
  equipmentId?: number;
}

export default function CustomerMyRentalItems() {
  const { user } = useAuth();

  const { data: rentalItems, isLoading } = useQuery<CustomerRentalItem[]>({
    queryKey: ['/api/customer/rental-items'],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your rental items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rental Items</h1>
        <p className="text-gray-600">Manage your current and past rental bookings</p>
      </div>

      {!rentalItems || rentalItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rental History</h3>
            <p className="text-gray-500 mb-6">
              You haven't rented any items yet. Browse our rental services to get started.
            </p>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Browse Rentals
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rentalItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{item.itemName}</CardTitle>
                  <Badge variant={
                    item.status === 'active' ? 'default' :
                    item.status === 'completed' ? 'secondary' :
                    item.status === 'pending' ? 'outline' : 'destructive'
                  }>
                    {item.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <Package className="mr-1 h-4 w-4" />
                  {item.category}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="mr-1 h-4 w-4" />
                    <span className="font-medium">₹{item.amount}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{format(new Date(item.createdAt), "MMM dd")}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{format(new Date(item.startDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{format(new Date(item.endDate), "MMM dd, yyyy")}</span>
                  </div>
                  {item.providerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{item.providerName}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {item.status === 'active' && (
                    <Button variant="default" size="sm" className="flex-1">
                      Contact Provider
                    </Button>
                  )}
                  {item.status === 'completed' && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Star className="mr-1 h-3 w-3" />
                      Rate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}