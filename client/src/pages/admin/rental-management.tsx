import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RentalCategory, RentalEquipment, RentalOrder } from "@shared/schema";

export default function RentalManagement() {
  const { toast } = useToast();

  // Fetch rental categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<RentalCategory[]>({
    queryKey: ["/api/admin/rental-categories"],
  });

  // Fetch rental equipment
  const { data: equipment = [], isLoading: equipmentLoading } = useQuery<RentalEquipment[]>({
    queryKey: ["/api/admin/rental-equipment"],
  });

  // Fetch rental orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<RentalOrder[]>({
    queryKey: ["/api/admin/rental-orders"],
  });

  // Approve equipment mutation
  const approveEquipmentMutation = useMutation({
    mutationFn: async (equipmentId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/rental-equipment/${equipmentId}/approve`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rental-equipment"] });
      toast({ title: "Equipment approved successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to approve equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject equipment mutation
  const rejectEquipmentMutation = useMutation({
    mutationFn: async (equipmentId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/rental-equipment/${equipmentId}/reject`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rental-equipment"] });
      toast({ title: "Equipment rejected successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reject equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      active: "default",
      inactive: "destructive",
      maintenance: "outline"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rental Management</h1>
          <p className="text-gray-600">Manage equipment rentals, categories, and orders</p>
        </div>
      </div>

      <Tabs defaultValue="equipment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Equipment Management</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>

          {equipmentLoading ? (
            <div className="text-center py-8">Loading equipment...</div>
          ) : (
            <div className="grid gap-4">
              {equipment.map((item) => (
                <Card key={item.id} className={!item.adminApproved ? "border-orange-200 bg-orange-50" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          Category: {(item as any).categoryName || 'Unknown'} | Provider: {(item as any).providerName || 'Unknown'}
                        </CardDescription>
                        <CardDescription className="mt-1">
                          Daily Rate: ₹{item.dailyRate} | Security Deposit: ₹{item.securityDeposit}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(item.status)}
                        {item.adminApproved ? (
                          <Badge variant="default">Approved</Badge>
                        ) : (
                          <Badge variant="secondary">Pending Approval</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Location:</span> {item.location}
                      </div>
                      <div>
                        <span className="font-medium">Condition:</span> {item.condition}
                      </div>
                      <div>
                        <span className="font-medium">Available:</span> {item.availableQuantity}/{item.totalQuantity}
                      </div>
                      <div>
                        <span className="font-medium">Min Days:</span> {item.minimumRentalDays}
                      </div>
                    </div>
                    
                    {item.description && (
                      <div className="mb-4">
                        <span className="font-medium">Description:</span> {item.description}
                      </div>
                    )}
                    
                    {!item.adminApproved && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveEquipmentMutation.mutate(item.id)}
                          disabled={approveEquipmentMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectEquipmentMutation.mutate(item.id)}
                          disabled={rejectEquipmentMutation.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Rental Categories</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <h2 className="text-2xl font-semibold">Rental Orders</h2>
          
          {ordersLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                        <CardDescription>
                          Total: ₹{order.totalAmount} | Deposit: ₹{order.securityDeposit}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(order.status)}
                        <Badge variant="outline">{order.paymentStatus}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Duration:</span> {order.totalDays} days
                      </div>
                      <div>
                        <span className="font-medium">Start:</span> {order.startDate}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {order.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Delivery:</span> ₹{order.deliveryCharge}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}