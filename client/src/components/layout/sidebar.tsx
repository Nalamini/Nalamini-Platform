import { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useProviderAccess } from "@/hooks/use-provider-access";
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
  Plus,
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
  Package,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ShoppingCart,
  FileText,
  Video,
  Play,
  CheckCircle,
  Bus,
} from "lucide-react";

// Create context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  show?: boolean;
  tooltip?: string;
};

function NavLink({ href, icon, children, show = true, tooltip }: NavLinkProps) {
  const [location] = useLocation();
  const { isCollapsed } = useSidebarContext();
  const isActive = location === href;
  
  if (!show) return null;
  
  return (
    <Link href={href}>
      <div
        className={cn(
          "relative px-3 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer transition-all duration-200 group",
          isActive
            ? "bg-primary text-white"
            : "text-neutral-700 hover:bg-neutral-100",
          isCollapsed ? "justify-center" : ""
        )}
        title={isCollapsed ? (tooltip || children?.toString()) : ""}
      >
        <span className={cn("text-lg flex-shrink-0", isCollapsed ? "" : "mr-3")}>{icon}</span>
        <span className={cn(
          "transition-all duration-200 whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>
          {children}
        </span>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {tooltip || children}
          </div>
        )}
      </div>
    </Link>
  );
}

// Provider component to wrap the app
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Toggle button component
function SidebarToggle() {
  const { isCollapsed, setIsCollapsed } = useSidebarContext();
  
  return (
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className={cn(
        "fixed top-20 z-50 bg-white border border-gray-200 rounded-md p-2 shadow-lg hover:shadow-xl transition-all duration-200",
        isCollapsed ? "left-20" : "left-60"
      )}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ChevronRight className="h-4 w-4 text-gray-600" />
      ) : (
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      )}
    </button>
  );
}

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const providerAccess = useProviderAccess();
  const { isCollapsed } = useSidebarContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  useEffect(() => {
    // Close sidebar on mobile when route changes
    setSidebarOpen(false);
  }, [location]);
  
  const isAdmin = user?.userType === "admin";
  const isBranchManager = user?.userType === "branch_manager";
  const isTalukManager = user?.userType === "taluk_manager";
  const isProvider = user?.userType === "service_provider";
  const hasManagementAccess = isAdmin || isBranchManager || isTalukManager;
  
  // Provider type checks
  const isFarmer = isProvider && providerAccess.isApproved && providerAccess.providerType === "farmer";
  const isManufacturer = isProvider && providerAccess.isApproved && providerAccess.providerType === "manufacturer";
  
  // Video upload permission check
  const hasVideoUploadPermission = isAdmin || hasManagementAccess;
  


  // Provider type display names
  const getProviderTypeDisplay = (type: string | null) => {
    const typeMap: { [key: string]: string } = {
      farmer: "Farmer",
      manufacturer: "Manufacturer", 
      recycling_agent: "Recycling Agent",
      booking_agent: "Booking Agent",
      rental_provider: "Rental Provider",
      transport_service: "Transport Service",
      taxi_service: "Taxi Service"
    };
    return type ? typeMap[type] || type : "Provider";
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <SidebarToggle />
      
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white border-r border-neutral-200 pt-16 hidden lg:block transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <nav className={cn("flex-1 py-4 space-y-1", isCollapsed ? "px-2" : "px-4")}>
            {/* User Role Info */}
            {!isCollapsed && (
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
                          : isProvider && providerAccess.isApproved
                            ? getProviderTypeDisplay(providerAccess.providerType)
                            : isProvider
                              ? "Provider (Pending)"
                              : "Customer"
                  }
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {isAdmin && "Tamil Nadu (All Districts)"}
                  {isBranchManager && user?.district}
                  {isTalukManager && `${user?.district} - ${user?.taluk}`}
                  {user?.userType === "service_agent" && `${user?.pincode} Pincode Area`}
                  {isProvider && providerAccess.isApproved && "Approved Service Provider"}
                  {isProvider && !providerAccess.isApproved && "Registration Under Review"}
                  {user?.userType === "customer" && user?.username}
                </p>
              </div>
            )}

            {/* Dashboard */}
            <NavLink href="/" icon={<LayoutDashboard />}>
              Dashboard
            </NavLink>

            {/* GROCERY SERVICES SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Grocery Services
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            {/* Customer Grocery */}
            <NavLink href="/customer/grocery-browse" icon={<ShoppingBasket />}>
              Browse Groceries
            </NavLink>

            {/* Admin Grocery Management */}
            <NavLink 
              href="/admin/grocery/categories" 
              icon={<Store />}
              show={isAdmin}
              tooltip="Grocery Categories"
            >
              Grocery Categories
            </NavLink>
            
            <NavLink 
              href="/admin/grocery/products" 
              icon={<Package />}
              show={isAdmin}
              tooltip="Grocery Products"
            >
              Grocery Products
            </NavLink>
            
            <NavLink 
              href="/admin/grocery/farmer-product-approvals" 
              icon={<ClipboardList />}
              show={isAdmin}
              tooltip="Product Approvals"
            >
              Product Approvals
            </NavLink>

            {/* Provider Grocery */}
            <NavLink 
              href="/provider/add-grocery-product" 
              icon={<Plus />}
              show={isFarmer}
              tooltip="Add Product"
            >
              Add Product
            </NavLink>
            
            <NavLink 
              href="/provider/my-grocery-products" 
              icon={<Leaf />}
              show={isFarmer}
              tooltip="My Products"
            >
              My Products
            </NavLink>

            {/* LOCAL PRODUCTS SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Local Products
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/local-products" icon={<Store />}>
              Browse Local Products
            </NavLink>

            <NavLink 
              href="/admin/local-products" 
              icon={<Handshake />}
              show={isAdmin}
              tooltip="Manage Local Products"
            >
              Manage Products
            </NavLink>

            <NavLink 
              href="/provider/local-products/new" 
              icon={<Plus />}
              show={isManufacturer}
              tooltip="Add Local Product"
            >
              Add Product
            </NavLink>

            {/* RENTAL SERVICES SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Rental Services
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/rental-browse" icon={<Wrench />}>
              Browse Equipment
            </NavLink>

            <NavLink 
              href="/admin/rental-categories" 
              icon={<Package />}
              show={isAdmin}
              tooltip="Rental Categories"
            >
              Rental Categories
            </NavLink>
            
            <NavLink 
              href="/admin/rental-management" 
              icon={<Wrench />}
              show={isAdmin}
              tooltip="Manage Equipment"
            >
              Manage Equipment
            </NavLink>

            {/* TRANSPORT SERVICES SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Transport Services
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/travel-services" icon={<Plane />}>
              Travel Services
            </NavLink>

            <NavLink href="/taxi-browse" icon={<Car />}>
              Taxi Services
            </NavLink>

            <NavLink href="/delivery-browse" icon={<Truck />}>
              Delivery Services
            </NavLink>

            {/* Admin Transport Management */}
            <NavLink 
              href="/taxi" 
              icon={<Car />}
              show={isAdmin}
              tooltip="Taxi Management"
            >
              Taxi Management
            </NavLink>

            <NavLink 
              href="/delivery" 
              icon={<Truck />}
              show={isAdmin}
              tooltip="Delivery Management"
            >
              Delivery Management
            </NavLink>

            {/* Provider Transport Management */}
            <NavLink 
              href="/provider/taxi-vehicles" 
              icon={<Car />}
              show={isProvider}
              tooltip="My Vehicles"
            >
              My Taxi Vehicles
            </NavLink>

            <NavLink 
              href="/provider/delivery-registration" 
              icon={<Truck />}
              show={isProvider}
              tooltip="Delivery Registration"
            >
              Delivery Agent Registration
            </NavLink>

            {/* Admin Transport Management */}
            <NavLink 
              href="/admin/taxi-vehicle-approvals" 
              icon={<ClipboardList />}
              show={isAdmin}
              tooltip="Vehicle Approvals"
            >
              Vehicle Approvals
            </NavLink>

            <NavLink 
              href="/admin/delivery-categories" 
              icon={<Package />}
              show={isAdmin}
              tooltip="Delivery Categories"
            >
              Delivery Categories
            </NavLink>

            <NavLink 
              href="/admin/delivery-agent-approvals" 
              icon={<ClipboardList />}
              show={isAdmin}
              tooltip="Agent Approvals"
            >
              Delivery Agent Approvals
            </NavLink>

            {/* SYSTEM MANAGEMENT SECTION */}
            {hasManagementAccess && !isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  System Management
                </p>
              </div>
            )}
            {hasManagementAccess && isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink 
              href="/branch-managers" 
              icon={<Users />}
              show={isAdmin}
              tooltip="Branch Managers"
            >
              Branch Managers
            </NavLink>
            
            <NavLink 
              href="/taluk-managers" 
              icon={<UserCog />}
              show={isAdmin || isBranchManager}
              tooltip="Taluk Managers"
            >
              Taluk Managers
            </NavLink>
            
            <NavLink 
              href="/service-agents" 
              icon={<UserRound />}
              show={hasManagementAccess}
              tooltip="Service Agents"
            >
              Service Agents
            </NavLink>
            
            <NavLink 
              href="/admin/service-providers" 
              icon={<Handshake />}
              show={isAdmin}
              tooltip="Service Providers"
            >
              Service Providers
            </NavLink>
            
            <NavLink 
              href="/commission-config" 
              icon={<Percent />}
              show={isAdmin}
              tooltip="Commission Setup"
            >
              Commission Setup
            </NavLink>
            
            <NavLink 
              href="/analytics" 
              icon={<BarChart />}
              show={hasManagementAccess}
              tooltip="Analytics"
            >
              Analytics Dashboard
            </NavLink>
            
            <NavLink 
              href="/hierarchy" 
              icon={<Network />}
              show={hasManagementAccess}
              tooltip="Organization"
            >
              Organization Hierarchy
            </NavLink>

            {/* VIDEO MANAGEMENT SECTION */}
            {!isCollapsed && (hasManagementAccess) && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Video Management
                </p>
              </div>
            )}
            {isCollapsed && (hasManagementAccess) && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}
            
            <NavLink 
              href="/video-upload" 
              icon={<Video />}
              show={hasManagementAccess}
              tooltip="Upload Videos"
            >
              Upload Videos
            </NavLink>
            
            <NavLink 
              href="/video-analytics" 
              icon={<BarChart />}
              show={hasManagementAccess}
              tooltip="Video Analytics"
            >
              Video Analytics
            </NavLink>
            
            <NavLink 
              href="/video-library" 
              icon={<Play />}
              show={hasManagementAccess}
              tooltip="Video Library"
            >
              Video Library
            </NavLink>
            
            <NavLink 
              href="/admin/video-approvals" 
              icon={<CheckCircle />}
              show={isAdmin}
              tooltip="Video Approvals"
            >
              Video Approvals
            </NavLink>

            {/* UTILITIES & OTHER SERVICES SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Utilities & Others
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/recharge" icon={<Smartphone />}>
              Recharge Services
            </NavLink>

            <NavLink href="/recharge/electricity" icon={<Lightbulb />}>
              Utility Services
            </NavLink>

            <NavLink href="/recycling" icon={<Recycle />}>
              Recycling Services
            </NavLink>

            {/* PERSONAL SERVICES SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Personal Services
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/chat" icon={<MessageSquare />}>
              Chat & Support
            </NavLink>

            <NavLink href="/wallet" icon={<Wallet />}>
              Wallet
            </NavLink>

            <NavLink 
              href="/commissions" 
              icon={<CreditCard />}
              tooltip="My Commissions"
            >
              My Commissions
            </NavLink>

            {/* VIDEO MANAGEMENT SECTION */}
            {!isCollapsed && (
              <div className="pt-5 pb-2">
                <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Video Center
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="pt-5 pb-2">
                <div className="w-8 h-px bg-neutral-300 mx-auto"></div>
              </div>
            )}

            <NavLink href="/video-library" icon={<Play />}>
              Video Library
            </NavLink>

            <NavLink 
              href="/video-management" 
              icon={<Video />}
              show={hasVideoUploadPermission}
              tooltip="Video Management"
            >
              Video Management
            </NavLink>

            {/* User Settings and Logout */}
            <div className="mt-auto pt-6 border-t border-neutral-200">
              <NavLink href="/profile" icon={<Settings />}>
                Profile Settings
              </NavLink>
              
              <button
                onClick={() => logoutMutation.mutate()}
                className={cn(
                  "w-full px-3 py-2 rounded-md flex items-center text-sm font-medium cursor-pointer transition-all duration-200 text-red-600 hover:bg-red-50",
                  isCollapsed ? "justify-center" : ""
                )}
                disabled={logoutMutation.isPending}
                title={isCollapsed ? "Logout" : ""}
              >
                <span className={cn("text-lg flex-shrink-0", isCollapsed ? "" : "mr-3")}>
                  <LogOut />
                </span>
                <span className={cn(
                  "transition-all duration-200 whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </nav>
          

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
                            : isProvider && providerAccess.isApproved
                              ? getProviderTypeDisplay(providerAccess.providerType)
                              : isProvider
                                ? "Provider (Pending)"
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
                  href="/analytics" 
                  icon={<BarChart />}
                  show={hasManagementAccess} 
                >
                  Analytics Dashboard
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
                    
                    <NavLink 
                      href="/provider/add-grocery-product" 
                      icon={<ShoppingBasket />}
                      show={isFarmer}
                    >
                      Add Grocery Product
                    </NavLink>
                    
                    <NavLink 
                      href="/provider/my-grocery-products" 
                      icon={<ShoppingBasket />}
                      show={isFarmer}
                    >
                      My Grocery Products
                    </NavLink>
                  </>
                )}

                {/* Services Section - For customers and other non-admin users */}
                {(user?.userType === 'customer' || (user?.userType !== 'service_provider' && !isAdmin)) && (
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
                    
                    <NavLink href="/customer/grocery-browse" icon={<ShoppingBasket />}>
                      Browse Grocery Products
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
                
                <NavLink href="/chat" icon={<MessageSquare />}>
                  Chat System
                </NavLink>
                
                <NavLink href="/recycling" icon={<Recycle />}>
                  Recycling
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
