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

// Tamil Nadu districts and taluks (sample for a few districts)
const tnDistrictsAndTaluks: Record<string, string[]> = {
  "Chennai": ["Chennai North", "Chennai South", "Chennai East", "Chennai West", "Chennai Central"],
  "Coimbatore": ["Coimbatore North", "Coimbatore South", "Mettupalayam", "Pollachi", "Sulur", "Valparai"],
  "Madurai": ["Madurai North", "Madurai South", "Melur", "Peraiyur", "Tirumangalam", "Usilampatti", "Vadipatti"],
  "Salem": ["Salem", "Attur", "Edappadi", "Gangavalli", "Mettur", "Omalur", "Sangagiri", "Valapady", "Yercaud"],
  "Trichy": ["Lalgudi", "Manachanallur", "Manapparai", "Musiri", "Srirangam", "Thiruverumbur", "Thottiyam", "Thuraiyur"],
};

// List of all districts
const tnDistricts = Object.keys(tnDistrictsAndTaluks);

// Schema for taluk manager form
const talukManagerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  district: z.string().min(1, "District is required"),
  taluk: z.string().min(1, "Taluk is required"),
});

type TalukManagerFormValues = z.infer<typeof talukManagerSchema>;

export default function TalukManagers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";

  // Query to fetch taluk managers
  const { data: talukManagers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/managers/taluk"],
    enabled: isAdmin || isBranchManager,
  });

  // Form for adding new taluk manager
  const form = useForm<TalukManagerFormValues>({
    resolver: zodResolver(talukManagerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      district: isBranchManager ? user?.district || "" : "",
      taluk: "",
    },
  });

  // Watch for district changes to update taluk options
  const watchDistrict = form.watch("district");
  if (watchDistrict !== selectedDistrict) {
    setSelectedDistrict(watchDistrict);
    form.setValue("taluk", "");
  }

  // Mutation to add taluk manager
  const createTalukManagerMutation = useMutation({
    mutationFn: async (data: TalukManagerFormValues) => {
      const res = await apiRequest("POST", "/api/managers/taluk", {
        ...data,
        userType: "taluk_manager",
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Taluk Manager Added",
        description: "The taluk manager has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/managers/taluk"] });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add Taluk Manager",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  function onSubmit(values: TalukManagerFormValues) {
    createTalukManagerMutation.mutate(values);
  }

  // Filter managers based on search term and district
  const filteredManagers = talukManagers?.filter((manager) => {
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

  if (!isAdmin && !isBranchManager) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Access Restricted
              </h2>
              <p className="text-neutral-600">
                You don't have permission to manage taluk managers. This section is only available to administrators and branch managers.
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
        <h2 className="text-2xl font-bold text-neutral-900">Taluk Managers</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isAdmin 
            ? "Manage the 262 taluk managers across Tamil Nadu"
            : `Manage taluk managers in ${user?.district} district`}
        </p>
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
          {isAdmin && (
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
          )}
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Taluk Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Taluk Manager</DialogTitle>
              <DialogDescription>
                Create a new taluk manager for a taluk in Tamil Nadu.
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
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isBranchManager}
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
                  <FormField
                    control={form.control}
                    name="taluk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taluk</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedDistrict}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select taluk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedDistrict && 
                              tnDistrictsAndTaluks[selectedDistrict]?.map((taluk) => (
                                <SelectItem key={taluk} value={taluk}>
                                  {taluk}
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
                    disabled={createTalukManagerMutation.isPending}
                  >
                    {createTalukManagerMutation.isPending ? (
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

      {/* Taluk Managers Table */}
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
                  <TableHead>Taluk</TableHead>
                  <TableHead>Service Agents</TableHead>
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
                            ID: TM{manager.id.toString().padStart(5, '0')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">{manager.district}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">{manager.taluk}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral-900">6 active</div>
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
                  <span className="font-medium">{talukManagers?.length || 0}</span> results
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
                No taluk managers found
              </h3>
              <p className="text-neutral-500 mb-4">
                {searchTerm || filterDistrict
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding a taluk manager to the system."}
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
