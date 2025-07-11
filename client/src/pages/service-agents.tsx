import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema for service agent form
const serviceAgentSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  pincode: z.string().length(6, "Pincode must be exactly 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),
});

type ServiceAgentFormValues = z.infer<typeof serviceAgentSchema>;

export default function ServiceAgents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";
  const isTalukManager = user?.userType === "taluk_manager";
  const hasManagementAccess = isAdmin || isBranchManager || isTalukManager;

  // Query to fetch service agents
  const { data: serviceAgents, isLoading } = useQuery<User[]>({
    queryKey: ["/api/agents"],
    enabled: hasManagementAccess,
  });

  // Form for adding new service agent
  const form = useForm<ServiceAgentFormValues>({
    resolver: zodResolver(serviceAgentSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      pincode: "",
    },
  });

  // Mutation to add service agent
  const createServiceAgentMutation = useMutation({
    mutationFn: async (data: ServiceAgentFormValues) => {
      const res = await apiRequest("POST", "/api/agents", {
        ...data,
        userType: "service_agent",
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Agent Added",
        description: "The service agent has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add Service Agent",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: ServiceAgentFormValues) {
    createServiceAgentMutation.mutate(values);
  }

  // Filter agents based on search term
  const filteredAgents = serviceAgents?.filter((agent) => {
    return (
      searchTerm === "" || 
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.pincode?.includes(searchTerm)
    );
  });

  // Placeholder delete function (would need proper implementation in a real app)
  const handleDelete = (id: number) => {
    toast({
      title: "Delete Operation",
      description: "This function is not implemented in the demo.",
      variant: "destructive",
    });
  };

  if (!hasManagementAccess) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Access Restricted
              </h2>
              <p className="text-neutral-600">
                You don't have permission to manage service agents. This section is only available to management team members.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Service Agents</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isAdmin 
            ? "Manage service agents across all pincodes in Tamil Nadu"
            : isBranchManager
              ? `Manage service agents in ${user?.district} district`
              : `Manage service agents in ${user?.taluk} taluk`}
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by name or pincode..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Service Agent</DialogTitle>
              <DialogDescription>
                Create a new service agent for a specific pincode area.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={6} placeholder="6-digit pincode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createServiceAgentMutation.isPending}
                  >
                    {createServiceAgentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Agent"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Agents Table */}
      <Card>
        {isLoading ? (
          <CardContent className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        ) : filteredAgents && filteredAgents.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {agent.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {agent.fullName}
                          </div>
                          <div className="text-xs text-neutral-500">
                            ID: SA{agent.id.toString().padStart(5, '0')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-4 w-4 text-neutral-400" />
                        {agent.pincode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">{agent.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">{agent.phone || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(agent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-neutral-200 sm:px-6 flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-neutral-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredAgents.length}</span> of{" "}
                  <span className="font-medium">{serviceAgents?.length || 0}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="ml-3" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                No service agents found
              </h3>
              <p className="text-neutral-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding a service agent to the system."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
