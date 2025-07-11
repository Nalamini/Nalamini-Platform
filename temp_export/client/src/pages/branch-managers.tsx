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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tamil Nadu districts list
const tnDistricts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", 
  "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", 
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar", "Tenkasi", 
  "Kallakurichi", "Ranipet", "Chengalpattu", "Mayiladuthurai", "Tirupattur"
];

// Schema for branch manager form
const branchManagerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  district: z.string().min(1, "District is required"),
});

type BranchManagerFormValues = z.infer<typeof branchManagerSchema>;

export default function BranchManagers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Query to fetch branch managers
  const { data: branchManagers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/managers/branch"],
    enabled: user?.userType === "admin",
  });

  // Form for adding new branch manager
  const form = useForm<BranchManagerFormValues>({
    resolver: zodResolver(branchManagerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      district: "",
    },
  });

  // Mutation to add branch manager
  const createBranchManagerMutation = useMutation({
    mutationFn: async (data: BranchManagerFormValues) => {
      const res = await apiRequest("POST", "/api/managers/branch", {
        ...data,
        userType: "branch_manager",
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Branch Manager Added",
        description: "The branch manager has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/managers/branch"] });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add Branch Manager",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: BranchManagerFormValues) {
    createBranchManagerMutation.mutate(values);
  }

  // Filter managers based on search term and district
  const filteredManagers = branchManagers?.filter((manager) => {
    return (
      (searchTerm === "" || 
        manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterDistrict === "" || filterDistrict === "all" || manager.district === filterDistrict)
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

  if (user?.userType !== "admin") {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Access Restricted
              </h2>
              <p className="text-neutral-600">
                You don't have permission to manage branch managers. This section is only available to administrators.
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
        <h2 className="text-2xl font-bold text-neutral-900">Branch Managers</h2>
        <p className="mt-1 text-sm text-neutral-500">Manage the 38 branch managers across Tamil Nadu districts.</p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search managers..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={filterDistrict}
            onValueChange={(value) => setFilterDistrict(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {tnDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Branch Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Branch Manager</DialogTitle>
              <DialogDescription>
                Create a new branch manager for a district in Tamil Nadu.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tnDistricts.map((district) => (
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
                </div>
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
                    disabled={createBranchManagerMutation.isPending}
                  >
                    {createBranchManagerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Manager"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branch Managers Table */}
      <Card>
        {isLoading ? (
          <CardContent className="flex justify-center items-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        ) : filteredManagers && filteredManagers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Taluk Managers</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                          {manager.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {manager.fullName}
                          </div>
                          <div className="text-xs text-neutral-500">
                            ID: BM{manager.id.toString().padStart(5, '0')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">{manager.district}</div>
                      <div className="text-xs text-neutral-500">12 blocks</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">8 active</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 bg-neutral-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "95%" }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-500">95%</span>
                      </div>
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
                        onClick={() => handleDelete(manager.id)}
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
                  <span className="font-medium">{filteredManagers.length}</span> of{" "}
                  <span className="font-medium">{branchManagers?.length || 0}</span> results
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
                No branch managers found
              </h3>
              <p className="text-neutral-500 mb-4">
                {searchTerm || filterDistrict
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding a branch manager to the system."}
              </p>
              {(searchTerm || filterDistrict) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDistrict("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
