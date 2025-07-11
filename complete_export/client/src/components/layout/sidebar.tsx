import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserRound,
  Smartphone,
  Plane,
  Wrench,
  Car,
  Truck,
  Store,
  ShoppingBasket,
  Recycle,
  MessageSquare,
  Wallet,
  BarChart,
  Settings,
  LogOut,
  Percent,
  CreditCard,
  Receipt,
  Lightbulb,
  Handshake,
  Network,
  ClipboardList,
  Leaf,
} from "lucide-react";

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  show?: boolean;
};

function NavLink({ href, icon, children, show = true }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  if (!show) return null;
  
  return (
    <Link href={href}>
      <div
        className={cn(
          "px-3 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer",
          isActive
            ? "bg-primary text-white"
            : "text-neutral-700 hover:bg-neutral-100"
        )}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span>{children}</span>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  useEffect(() => {
    // Close sidebar on mobile when route changes
    setSidebarOpen(false);
  }, [location]);
  
  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";
  const isTalukManager = user?.userType === "taluk_manager";
  const isProvider = user?.userType === "provider";
  // For now we show farmer options for all providers, could refine this later to check providerType
  const isFarmer = isProvider; 
  const hasManagementAccess = isAdmin || isBranchManager || isTalukManager;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 pt-16 hidden lg:block"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {/* User Role Info */}
            <div className="mb-6 px-3 py-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium text-primary-foreground">
                {isAdmin 
                  ? "Admin" 
                  : isBranchManager 
                    ? "Branch Manager" 
                    : isTalukManager 
                      ? "Taluk Manager" 
                      : user?.userType === "service_agent"
                        ? "Service Agent"
                        : isFarmer
                          ? "Farmer"
                          : "Customer"
                }
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {isAdmin && "Tamil Nadu (All Districts)"}
                {isBranchManager && user?.district}
                {isTalukManager && `${user?.district} - ${user?.taluk}`}
                {user?.userType === "service_agent" && `${user?.pincode} Pincode Area`}
                {user?.userType === "customer" && user?.username}
              </p>
            </div>

            {/* Dashboard */}
            <NavLink href="/" icon={<LayoutDashboard />}>
              Dashboard
            </NavLink>

            {/* Management Section */}
            {hasManagementAccess && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Management
                </p>
              </div>
            )}

            <NavLink 
              href="/branch-managers" 
              icon={<Users />}
              show={isAdmin}
            >
              Branch Managers
            </NavLink>
            
            <NavLink 
              href="/taluk-managers" 
              icon={<UserCog />}
              show={isAdmin || isBranchManager}
            >
              Taluk Managers
            </NavLink>
            
            <NavLink 
              href="/service-agents" 
              icon={<UserRound />}
              show={hasManagementAccess}
            >
              Service Agents
            </NavLink>
            
            <NavLink 
              href="/commission-config" 
              icon={<Percent />}
              show={isAdmin} 
            >
              Commission Setup
            </NavLink>
            
            <NavLink 
              href="/commissions" 
              icon={<CreditCard />}
              show={true} 
            >
              My Commissions
            </NavLink>
            
            <NavLink 
              href="/commission-dashboard" 
              icon={<BarChart />}
              show={isAdmin} 
            >
              Commission Dashboard
            </NavLink>
            
            <NavLink 
              href="/hierarchy" 
              icon={<Network />}
              show={hasManagementAccess} 
            >
              Organization Hierarchy
            </NavLink>
            
            <NavLink 
              href="/manager-applications" 
              icon={<ClipboardList />}
              show={isAdmin} 
            >
              Manager Applications
            </NavLink>
            
            {/* Products Management Section */}
            {isAdmin && (
              <>
                <div className="pt-5 pb-2">
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Product Management
                  </p>
                </div>
                
                <NavLink 
                  href="/admin/grocery/categories" 
                  icon={<Store />}
                  show={isAdmin}
                >
                  Grocery Categories
                </NavLink>
                
                <NavLink 
                  href="/admin/grocery/products" 
                  icon={<ShoppingBasket />}
                  show={isAdmin}
                >
                  Grocery Products
                </NavLink>
                
                <NavLink 
                  href="/admin/grocery/product-requests" 
                  icon={<ClipboardList />}
                  show={isAdmin}
                >
                  Product Requests
                </NavLink>
                
                <NavLink 
                  href="/admin/grocery/farmer-listings" 
                  icon={<Leaf />}
                  show={isAdmin}
                >
                  Farmer Product Listings
                </NavLink>
                
                <NavLink 
                  href="/admin/local-products" 
                  icon={<Handshake />}
                  show={isAdmin}
                >
                  Local Products
                </NavLink>
              </>
            )}
            
            {/* Farmer Section */}
            {isFarmer && (
              <>
                <div className="pt-5 pb-2">
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Farmer Portal
                  </p>
                </div>
                
                <NavLink 
                  href="/farmer/add-product" 
                  icon={<ShoppingBasket />}
                  show={isFarmer}
                >
                  Add Product Listing
                </NavLink>
                
                <NavLink 
                  href="/farmer/request-product" 
                  icon={<ClipboardList />}
                  show={isFarmer}
                >
                  Request New Product
                </NavLink>
                
                <NavLink 
                  href="/farmer/my-listings" 
                  icon={<Leaf />}
                  show={isFarmer}
                >
                  My Product Listings
                </NavLink>
              </>
            )}

            {/* Services Section - Hidden for admin users and service providers */}
            {user?.userType !== 'provider' && !isAdmin && (
              <>
                <div className="pt-5 pb-2">
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Services
                  </p>
                </div>

                <NavLink href="/recharge/" icon={<Smartphone />}>
                  Recharges & Bills
                </NavLink>
                
                <NavLink href="/travel" icon={<Plane />}>
                  Travel Bookings
                </NavLink>
                
                <NavLink href="/rental" icon={<Wrench />}>
                  Rental Services
                </NavLink>
                
                <NavLink href="/taxi" icon={<Car />}>
                  Taxi Services
                </NavLink>
                
                <NavLink href="/delivery" icon={<Truck />}>
                  Delivery Management
                </NavLink>
                
                <NavLink href="/grocery" icon={<Store />}>
                  Grocery
                </NavLink>
                
                <NavLink href="/farm-listings" icon={<Leaf />}>
                  Farm Products
                </NavLink>
              </>
            )}

            <div className="pt-5 pb-2">
              <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Additional
              </p>
            </div>
            
            <NavLink href="/wallet" icon={<Wallet />}>
              Wallet Management
            </NavLink>
            
            <NavLink href="/utility" icon={<Lightbulb />}>
              Utility Bills
            </NavLink>
            
            {/* Future features (commented out until implemented) */}
            {/*
            <NavLink href="/local-products" icon={<ShoppingBasket />}>
              Local Products
            </NavLink>
            
            <NavLink href="/recycling" icon={<Recycle />}>
              Recycling
            </NavLink>
            
            <NavLink href="/feedback" icon={<MessageSquare />}>
              Feedback System
            </NavLink>
            
            <NavLink href="/reports" icon={<BarChart />}>
              Reports
            </NavLink>
            
            <NavLink href="/settings" icon={<Settings />}>
              Settings
            </NavLink>
            */}
          </nav>
          
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm font-medium text-neutral-700 hover:text-primary flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar with backdrop */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          <aside 
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 pt-16 lg:hidden"
          >
            <div className="h-full flex flex-col overflow-y-auto">
              {/* Same content as desktop sidebar */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {/* User Role Info */}
                <div className="mb-6 px-3 py-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary-foreground">
                    {isAdmin 
                      ? "Admin" 
                      : isBranchManager 
                        ? "Branch Manager" 
                        : isTalukManager 
                          ? "Taluk Manager" 
                          : user?.userType === "service_agent"
                            ? "Service Agent"
                            : isFarmer
                              ? "Farmer"
                              : "Customer"
                    }
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {isAdmin && "Tamil Nadu (All Districts)"}
                    {isBranchManager && user?.district}
                    {isTalukManager && `${user?.district} - ${user?.taluk}`}
                    {user?.userType === "service_agent" && `${user?.pincode} Pincode Area`}
                    {user?.userType === "customer" && user?.username}
                  </p>
                </div>

                {/* Dashboard */}
                <NavLink href="/" icon={<LayoutDashboard />}>
                  Dashboard
                </NavLink>

                {/* Management Section */}
                {hasManagementAccess && (
                  <div className="pt-5 pb-2">
                    <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Management
                    </p>
                  </div>
                )}

                <NavLink 
                  href="/branch-managers" 
                  icon={<Users />}
                  show={isAdmin}
                >
                  Branch Managers
                </NavLink>
                
                <NavLink 
                  href="/taluk-managers" 
                  icon={<UserCog />}
                  show={isAdmin || isBranchManager}
                >
                  Taluk Managers
                </NavLink>
                
                <NavLink 
                  href="/service-agents" 
                  icon={<UserRound />}
                  show={hasManagementAccess}
                >
                  Service Agents
                </NavLink>
                
                <NavLink 
                  href="/commission-config" 
                  icon={<Percent />}
                  show={isAdmin} 
                >
                  Commission Setup
                </NavLink>
                
                <NavLink 
                  href="/commissions" 
                  icon={<CreditCard />}
                  show={true} 
                >
                  My Commissions
                </NavLink>
                
                <NavLink 
                  href="/commission-dashboard" 
                  icon={<BarChart />}
                  show={isAdmin} 
                >
                  Commission Dashboard
                </NavLink>
                
                <NavLink 
                  href="/hierarchy" 
                  icon={<Network />}
                  show={hasManagementAccess} 
                >
                  Organization Hierarchy
                </NavLink>
                
                <NavLink 
                  href="/manager-applications" 
                  icon={<ClipboardList />}
                  show={isAdmin} 
                >
                  Manager Applications
                </NavLink>
                
                {/* Products Management Section */}
                {isAdmin && (
                  <>
                    <div className="pt-5 pb-2">
                      <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Product Management
                      </p>
                    </div>
                    
                    <NavLink 
                      href="/admin/grocery/categories" 
                      icon={<Store />}
                      show={isAdmin}
                    >
                      Grocery Categories
                    </NavLink>
                    
                    <NavLink 
                      href="/admin/grocery/products" 
                      icon={<ShoppingBasket />}
                      show={isAdmin}
                    >
                      Grocery Products
                    </NavLink>
                    
                    <NavLink 
                      href="/admin/grocery/product-requests" 
                      icon={<ClipboardList />}
                      show={isAdmin}
                    >
                      Product Requests
                    </NavLink>
                    
                    <NavLink 
                      href="/admin/grocery/farmer-listings" 
                      icon={<Leaf />}
                      show={isAdmin}
                    >
                      Farmer Product Listings
                    </NavLink>
                    
                    <NavLink 
                      href="/admin/local-products" 
                      icon={<Handshake />}
                      show={isAdmin}
                    >
                      Local Products
                    </NavLink>
                  </>
                )}
                
                {/* Farmer Section */}
                {isFarmer && (
                  <>
                    <div className="pt-5 pb-2">
                      <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Farmer Portal
                      </p>
                    </div>
                    
                    <NavLink 
                      href="/farmer/add-product" 
                      icon={<ShoppingBasket />}
                      show={isFarmer}
                    >
                      Add Product Listing
                    </NavLink>
                    
                    <NavLink 
                      href="/farmer/request-product" 
                      icon={<ClipboardList />}
                      show={isFarmer}
                    >
                      Request New Product
                    </NavLink>
                    
                    <NavLink 
                      href="/farmer/my-listings" 
                      icon={<Leaf />}
                      show={isFarmer}
                    >
                      My Product Listings
                    </NavLink>
                  </>
                )}

                {/* Services Section - Hidden for admin users and service providers */}
                {user?.userType !== 'provider' && !isAdmin && (
                  <>
                    <div className="pt-5 pb-2">
                      <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Services
                      </p>
                    </div>

                    <NavLink href="/recharge/" icon={<Smartphone />}>
                      Recharges & Bills
                    </NavLink>
                    
                    <NavLink href="/travel" icon={<Plane />}>
                      Travel Bookings
                    </NavLink>
                    
                    <NavLink href="/rental" icon={<Wrench />}>
                      Rental Services
                    </NavLink>
                    
                    <NavLink href="/taxi" icon={<Car />}>
                      Taxi Services
                    </NavLink>
                    
                    <NavLink href="/delivery" icon={<Truck />}>
                      Delivery Management
                    </NavLink>
                    
                    <NavLink href="/grocery" icon={<Store />}>
                      Grocery
                    </NavLink>
                    
                    <NavLink href="/farm-listings" icon={<Leaf />}>
                      Farm Products
                    </NavLink>
                  </>
                )}
                
                <div className="pt-5 pb-2">
                  <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Additional
                  </p>
                </div>
                
                <NavLink href="/wallet" icon={<Wallet />}>
                  Wallet Management
                </NavLink>
                
                <NavLink href="/utility" icon={<Lightbulb />}>
                  Utility Bills
                </NavLink>

                {/* Future features will be added here */}
              </nav>
              
              <div className="p-4 border-t border-neutral-200">
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="text-sm font-medium text-neutral-700 hover:text-primary flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
