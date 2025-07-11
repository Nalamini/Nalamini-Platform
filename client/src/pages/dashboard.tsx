import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Smartphone,
  Plane,
  Wrench,
  Car,
  Truck,
  Store,
  ShoppingBasket,
  Recycle,
  MapPin,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Wallet,
  Lightbulb,
  Sprout,
  Factory,
  Ticket,
  Package2,
  CircleDollarSign
} from "lucide-react";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import type { StatCard, ServiceItem, TopManager, ActivityItem } from "@/types";

function ProviderDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.userType === "admin";
  // Define provider services
  const providerTypes = [
    {
      id: "farmer",
      name: "Get Associated as a Farmer",
      description: "Register as a farmer to sell your farm produce directly to consumers",
      icon: <Sprout size={24} />,
      route: "/provider-registration/farmer",
      color: "green"
    },
    {
      id: "manufacturer",
      name: "Get Associated as a Manufacturer",
      description: "Join as a manufacturer to reach more customers for your products",
      icon: <Factory size={24} />,
      route: "/provider-registration/manufacturer",
      color: "blue"
    },
    {
      id: "booking_agent",
      name: "Get Associated as a Booking Agent",
      description: "Register as a booking agent for travel, accommodation, and more",
      icon: <Ticket size={24} />,
      route: "/provider-registration/booking-agent",
      color: "purple"
    },
    {
      id: "taxi_provider",
      name: "Get Associated for Taxi Service",
      description: "Join our network of taxi providers to grow your business",
      icon: <Car size={24} />,
      route: "/provider-registration/taxi-provider",
      color: "yellow"
    },
    {
      id: "transportation_agent",
      name: "Get Associated as a Transport Agent",
      description: "Register as a transportation service for logistics and delivery",
      icon: <Truck size={24} />,
      route: "/provider-registration/transportation-agent",
      color: "red"
    },
    {
      id: "rental_provider",
      name: "Get Associated as a Rental Agent",
      description: "Join as a rental provider for equipment, vehicles, and more",
      icon: <Package2 size={24} />,
      route: "/provider-registration/rental-provider",
      color: "orange"
    },
    {
      id: "recycling_agent",
      name: "Get Associated as a Recycling Agent",
      description: "Register as a recycling agent to help promote sustainability",
      icon: <Recycle size={24} />,
      route: "/provider-registration/recycling-agent",
      color: "emerald"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Welcome to TN Services Provider Portal</h2>
        <p className="mt-1 text-sm text-neutral-500">Register for different service types to expand your business reach</p>
      </div>

      {/* Service Provider Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Service Provider Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerTypes.map((provider) => (
            <Card key={provider.id} className="h-full border border-neutral-200 hover:border-primary hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className={`p-3 rounded-full bg-${provider.color}-100 text-${provider.color}-600 mb-4 inline-flex`}>
                  {provider.icon}
                </div>
                <h4 className="font-medium text-neutral-900 mb-2">{provider.name}</h4>
                <p className="text-sm text-neutral-500 mb-4">{provider.description}</p>
                <Button asChild className="w-full">
                  <Link href={provider.route}>Register Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin-specific Management Cards */}
      {isAdmin && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Hierarchy Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Branch Managers</h4>
                    <p className="text-sm text-neutral-500">Manage district-level managers</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/branch-managers">Manage Branch Managers</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Taluk Managers</h4>
                    <p className="text-sm text-neutral-500">Manage taluk-level managers</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/taluk-managers">Manage Taluk Managers</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Service Agents</h4>
                    <p className="text-sm text-neutral-500">Manage local service agents</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/service-agents">Manage Service Agents</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Service Categories Management (Admin-only) */}
      {isAdmin && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Service Categories Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Delivery Management</h4>
                    <p className="text-sm text-neutral-500">Manage delivery categories, agents & approvals</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/delivery">Delivery Categories & Agents</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <Car size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Taxi Management</h4>
                    <p className="text-sm text-neutral-500">Manage taxi categories, providers & vehicles</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/taxi">Taxi Categories & Providers</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Rental Management</h4>
                    <p className="text-sm text-neutral-500">Manage rental categories & equipment</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/rental">Rental Categories</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Product Management (Admin-only) */}
      {isAdmin && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Product Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <Store size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Local Products</h4>
                    <p className="text-sm text-neutral-500">Manage local product categories</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/local-products">Local Product Management</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                    <ShoppingBasket size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Grocery Management</h4>
                    <p className="text-sm text-neutral-500">Manage grocery products & categories</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/grocery">Grocery Management</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mr-4">
                    <Recycle size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Recycling Management</h4>
                    <p className="text-sm text-neutral-500">Manage recycling rates & processes</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/recycling">Recycling Management</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Commission Management (Admin-only) */}
      {isAdmin && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Commission Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                    <CircleDollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Commission Dashboard</h4>
                    <p className="text-sm text-neutral-500">Monitor and manage commissions</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/commissions">View Commission Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <CircleDollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">Commission Configuration</h4>
                    <p className="text-sm text-neutral-500">Set commission rates for services</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/commissions">Configure Commissions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                  <Wallet size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Wallet</h4>
                  <p className="text-sm text-neutral-500">Manage your balance and transactions</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/wallet">Access Wallet</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-accent/10 text-accent mr-4">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Profile</h4>
                  <p className="text-sm text-neutral-500">View and update your account details</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/profile">My Profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary mr-4">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">My Registrations</h4>
                  <p className="text-sm text-neutral-500">View your service provider registrations</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/provider-registration">View Registrations</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CustomerDashboard() {
  const services = [
    {
      id: 1,
      name: "Recharges & Bills",
      icon: <Smartphone size={24} />,
      description: "Mobile and DTH recharges, utility bill payments",
      link: "/recharge",
      color: "primary"
    },
    {
      id: 2,
      name: "Travel Bookings",
      icon: <Plane size={24} />,
      description: "Bus, flight and hotel reservations",
      link: "/travel",
      color: "secondary"
    },
    {
      id: 3,
      name: "Rental Services",
      icon: <Wrench size={24} />,
      description: "Tools, equipment and electronics rentals",
      link: "/rental",
      color: "accent"
    },
    {
      id: 4,
      name: "Taxi Services", 
      icon: <Car size={24} />,
      description: "Book taxis and ride-sharing services",
      link: "/taxi",
      color: "info"
    },
    {
      id: 5,
      name: "Grocery Shopping",
      icon: <Store size={24} />,
      description: "Farm-fresh products delivered to your home",
      link: "/grocery",
      color: "success"
    },
    {
      id: 6,
      name: "Local Products", 
      icon: <ShoppingBasket size={24} />,
      description: "Local manufacturers and artisans",
      link: "/local-products",
      color: "warning"
    },
    {
      id: 7,
      name: "Delivery Services",
      icon: <Truck size={24} />,
      description: "Package pickup and delivery services",
      link: "/delivery",
      color: "destructive"
    },
    {
      id: 8,
      name: "Recycling Collection", 
      icon: <Recycle size={24} />,
      description: "Schedule collection of recyclable materials",
      link: "/recycling",
      color: "muted"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Welcome to TN Services</h2>
        <p className="mt-1 text-sm text-neutral-500">Your one-stop platform for all services in Tamil Nadu</p>
      </div>

      {/* Featured Services */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Our Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="h-full border border-neutral-200 hover:border-primary hover:shadow-md transition-all">
              <Link href={service.link}>
                <CardContent className="p-6 cursor-pointer">
                  <div className={`p-3 rounded-full bg-${service.color}/10 text-${service.color} mb-4 inline-flex`}>
                    {service.icon}
                  </div>
                  <h4 className="font-medium text-neutral-900 mb-2">{service.name}</h4>
                  <p className="text-sm text-neutral-500">{service.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                  <Wallet size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Wallet</h4>
                  <p className="text-sm text-neutral-500">Manage your balance and transactions</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/wallet">Access Wallet</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-secondary/10 text-secondary mr-4">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Utility Bills</h4>
                  <p className="text-sm text-neutral-500">Pay electricity, water and gas bills</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/utility">Pay Bills</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-accent/10 text-accent mr-4">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Profile</h4>
                  <p className="text-sm text-neutral-500">View and update your account details</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/profile">My Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const { user } = useAuth();
  
  // Check user roles
  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";
  const isTalukManager = user?.userType === "taluk_manager";
  const isServiceAgent = user?.userType === "service_agent";
  // Stats for dashboard
  const statCards: StatCard[] = [
    {
      title: "Total Services",
      value: "8",
      change: "100% complete",
      icon: <LayoutDashboard size={20} />,
      color: "primary"
    },
    {
      title: "Active Users",
      value: "12,385",
      change: "+12% from last month",
      icon: <Users size={20} />,
      color: "secondary"
    },
    {
      title: "Total Revenue",
      value: "₹1,45,832",
      change: "+8.2% from last week",
      icon: <Smartphone size={20} />,
      color: "accent"
    },
    {
      title: "Service Agents",
      value: "386",
      change: "74% coverage",
      icon: <Users size={20} />,
      color: "info"
    }
  ];

  // Services for the overview section
  const services: ServiceItem[] = [
    {
      id: 1,
      name: "Recharges & Bills",
      count: "1,245 transactions today",
      icon: <Smartphone size={24} />,
      color: "primary",
      link: "/recharge"
    },
    {
      id: 2,
      name: "Travel Bookings",
      count: "328 bookings today",
      icon: <Plane size={24} />,
      color: "secondary",
      link: "/bookings"
    },
    {
      id: 3,
      name: "Rental Services",
      count: "78 active rentals",
      icon: <Wrench size={24} />,
      color: "accent",
      link: "/rental"
    },
    {
      id: 4,
      name: "Taxi Services",
      count: "432 rides today",
      icon: <Car size={24} />,
      color: "info",
      link: "/taxi"
    }
  ];

  // Top performing managers
  const topManagers: TopManager[] = [
    {
      id: 1,
      name: "Priya Subramaniam",
      role: "Chennai Branch Manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop",
      revenue: 42856,
      period: "This month"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Coimbatore Branch Manager",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&auto=format&fit=crop",
      revenue: 38245,
      period: "This month"
    },
    {
      id: 3,
      name: "Divya Venkatesh",
      role: "Madurai Taluk Manager",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=40&h=40&auto=format&fit=crop",
      revenue: 31782,
      period: "This month"
    }
  ];

  // Recent activities
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "New grocery order",
      message: "received from customer in Coimbatore",
      time: "30 minutes ago",
      icon: <ShoppingBasket size={16} />,
      iconColor: "text-green-500 bg-green-100"
    },
    {
      id: 2,
      type: "New service agent",
      message: "registered for Salem district",
      time: "2 hours ago",
      icon: <Users size={16} />,
      iconColor: "text-blue-500 bg-blue-100"
    },
    {
      id: 3,
      type: "Feedback received",
      message: "for rental service in Chennai",
      time: "5 hours ago",
      icon: <AlertCircle size={16} />,
      iconColor: "text-yellow-500 bg-yellow-100"
    },
    {
      id: 4,
      type: "Service disruption",
      message: "reported for taxi services in Trichy",
      time: "Yesterday",
      icon: <AlertCircle size={16} />,
      iconColor: "text-red-500 bg-red-100"
    }
  ];

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', value: 40000 },
    { name: 'Feb', value: 55000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 63000 },
    { name: 'May', value: 58000 },
    { name: 'Jun', value: 76000 },
    { name: 'Jul', value: 92000 },
    { name: 'Aug', value: 87000 },
    { name: 'Sep', value: 94000 },
    { name: 'Oct', value: 105000 },
    { name: 'Nov', value: 118000 },
    { name: 'Dec', value: 145832 },
  ];

  const serviceDistribution = [
    { name: 'Recharges', value: 35 },
    { name: 'Bookings', value: 20 },
    { name: 'Grocery', value: 18 },
    { name: 'Taxi', value: 12 },
    { name: 'Others', value: 15 },
  ];

  const COLORS = ['#1E40AF', '#047857', '#F59E0B', '#2563EB', '#64748B'];

  // For debugging: Log user type
  console.log("User type:", user?.userType);
  console.log("Is Admin:", isAdmin);
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Dashboard</h2>
        <p className="mt-1 text-sm text-neutral-500">Overview of your services and performance.</p>
        {isAdmin && (
          <p className="mt-1 text-sm font-semibold text-primary">Admin Dashboard</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-neutral-200">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat.color}/10 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
                  <h3 className="text-xl font-bold text-neutral-900">{stat.value}</h3>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-500 flex items-center">
                {stat.change && stat.change.includes('+') ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : stat.change && stat.change.includes('-') ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                <span>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Services Overview</h3>
        <Card className="border border-neutral-200">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-neutral-200">
            {services.map((service) => (
              <div key={service.id} className="p-5 hover:bg-neutral-50 transition-colors">
                <Link href={service.link}>
                  <div className="flex flex-col items-center text-center cursor-pointer">
                    <div className={`p-3 rounded-full bg-${service.color}/10 text-${service.color} mb-3`}>
                      {service.icon}
                    </div>
                    <h4 className="font-medium text-neutral-900 mb-1">{service.name}</h4>
                    <p className="text-xs text-neutral-500">{service.count}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue Chart & Top Managers */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Revenue Trend</h3>
          </div>
          <div className="p-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1E40AF"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Managers */}
        <Card className="border border-neutral-200">
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Top Performing Managers</h3>
            <Button variant="link" size="sm">View All</Button>
          </div>
          <div className="divide-y divide-neutral-200">
            {topManagers.map((manager) => (
              <div key={manager.id} className="p-4 flex items-center">
                <img 
                  src={manager.avatar}
                  alt={`${manager.name} avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{manager.name}</p>
                  <p className="text-xs text-neutral-500">{manager.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">₹{manager.revenue.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">{manager.period}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Service Distribution & Recent Activities */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Distribution */}
        <Card className="border border-neutral-200">
          <div className="p-5 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900">Service Distribution</h3>
          </div>
          <div className="p-5 h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 border border-neutral-200">
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Recent Activities</h3>
            <select className="text-sm border-neutral-300 rounded-md text-neutral-700 py-1">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="divide-y divide-neutral-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-start">
                <div className={`p-2 rounded-full ${activity.iconColor}`}>
                  {activity.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-900">
                    <span className="font-medium">{activity.type}</span> {activity.message}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-200 text-center">
            <Button variant="link">View All Activities</Button>
          </div>
        </Card>
      </div>

      {/* Regional Map (Placeholder) */}
      <Card className="border border-neutral-200 mb-8">
        <div className="p-5 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Regional Performance</h3>
        </div>
        <div className="p-5 h-80 flex items-center justify-center bg-neutral-50">
          <div className="text-center text-neutral-400">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Interactive map visualization</p>
            <p className="text-xs mt-1">Shows performance across Tamil Nadu districts</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Main Dashboard component that decides which dashboard to show
export default function Dashboard() {
  const { user } = useAuth();
  
  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";
  const isTalukManager = user?.userType === "taluk_manager";
  const isServiceAgent = user?.userType === "service_agent";
  const isCustomer = user?.userType === "customer";
  const isServiceProvider = user?.userType === "service_provider";
  
  // Determine if user is part of the management team
  const isManagementTeam = isAdmin || isBranchManager || isTalukManager || isServiceAgent;
  
  // Render the appropriate dashboard based on user type
  if (isManagementTeam) {
    return <ManagerDashboard />;
  } else if (isServiceProvider) {
    return <ProviderDashboard />;
  } else {
    return <CustomerDashboard />;
  }
}
