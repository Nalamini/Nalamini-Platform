import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Calendar, 
  Wallet,
  CreditCard,
  Shield
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">My Profile</h2>
        <p className="mt-1 text-sm text-neutral-500">View and manage your account information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information Card */}
        <Card className="col-span-2 border border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-neutral-500" />
                  <Input id="fullName" value={user.fullName} readOnly className="bg-neutral-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-neutral-500" />
                  <Input id="username" value={user.username} readOnly className="bg-neutral-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-neutral-500" />
                  <Input id="email" value={user.email} readOnly className="bg-neutral-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-neutral-500" />
                  <Input id="phone" value={user.phone || "Not provided"} readOnly className="bg-neutral-50" />
                </div>
              </div>

              {user.district && (
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-neutral-500" />
                    <Input id="district" value={user.district} readOnly className="bg-neutral-50" />
                  </div>
                </div>
              )}

              {user.taluk && (
                <div className="space-y-2">
                  <Label htmlFor="taluk">Taluk</Label>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-neutral-500" />
                    <Input id="taluk" value={user.taluk} readOnly className="bg-neutral-50" />
                  </div>
                </div>
              )}

              {user.pincode && (
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-neutral-500" />
                    <Input id="pincode" value={user.pincode} readOnly className="bg-neutral-50" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="createdAt">Member Since</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-neutral-500" />
                  <Input 
                    id="createdAt" 
                    value={new Date(user.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} 
                    readOnly 
                    className="bg-neutral-50" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <div className="space-y-6">
          <Card className="border border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Shield className="h-10 w-10 text-primary mr-4" />
                <div>
                  <p className="font-medium text-lg capitalize">
                    {user.userType === "customer" 
                      ? "Customer" 
                      : user.userType === "admin" 
                        ? "Administrator"
                        : user.userType === "branch_manager"
                          ? "Branch Manager"
                          : user.userType === "taluk_manager"
                            ? "Taluk Manager"
                            : user.userType === "service_agent"
                              ? "Service Agent"
                              : "Provider"}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {user.userType === "customer" 
                      ? "Access to all services" 
                      : user.userType === "admin" 
                        ? "Full administrative access"
                        : user.userType === "branch_manager"
                          ? `Managing ${user.district || "branch"}`
                          : user.userType === "taluk_manager"
                            ? `Managing ${user.taluk || "taluk"}`
                            : user.userType === "service_agent"
                              ? `Serving ${user.pincode || "area"}`
                              : "Service provider access"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Wallet className="h-10 w-10 text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-neutral-500">Current Balance</p>
                  <p className="font-medium text-2xl">₹{user.walletBalance?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <a href="/wallet">Manage Wallet</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">My Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <CreditCard className="h-10 w-10 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-neutral-500">View your earnings</p>
                  <p className="font-medium">Track commission payouts</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <a href="/commissions">View Commissions</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}