import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Smartphone,
  Store,
  Truck,
  Menu,
  ShoppingBasket,
  Handshake,
  Settings
} from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location === path;
  const isAdmin = user?.userType === "admin";
  
  const toggleSidebar = () => {
    // Toggle sidebar implementation
    const sidebarEvent = new CustomEvent('toggle-sidebar');
    window.dispatchEvent(sidebarEvent);
  };
  
  // Different nav links for admin vs other users
  const renderNavItems = () => {
    if (isAdmin) {
      // Admin-specific mobile nav items
      return (
        <>
          <Link href="/">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/") ? "text-primary" : "text-neutral-500"
            )}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </div>
          </Link>
          
          <Link href="/admin/grocery/categories">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/admin/grocery/categories") ? "text-primary" : "text-neutral-500"
            )}>
              <Store className="h-5 w-5" />
              <span className="text-xs mt-1">Categories</span>
            </div>
          </Link>
          
          <Link href="/admin/grocery/products">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/admin/grocery/products") ? "text-primary" : "text-neutral-500"
            )}>
              <ShoppingBasket className="h-5 w-5" />
              <span className="text-xs mt-1">Products</span>
            </div>
          </Link>
          
          <Link href="/admin/local-products">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/admin/local-products") ? "text-primary" : "text-neutral-500"
            )}>
              <Handshake className="h-5 w-5" />
              <span className="text-xs mt-1">Local Prods</span>
            </div>
          </Link>
        </>
      );
    } else {
      // Standard user nav items
      return (
        <>
          <Link href="/">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/") ? "text-primary" : "text-neutral-500"
            )}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </div>
          </Link>
          
          <Link href="/recharge">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/recharge") ? "text-primary" : "text-neutral-500"
            )}>
              <Smartphone className="h-5 w-5" />
              <span className="text-xs mt-1">Recharge</span>
            </div>
          </Link>
          
          <Link href="/grocery">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/grocery") ? "text-primary" : "text-neutral-500"
            )}>
              <Store className="h-5 w-5" />
              <span className="text-xs mt-1">Grocery</span>
            </div>
          </Link>
          
          <Link href="/delivery">
            <div className={cn(
              "flex flex-col items-center py-1 cursor-pointer",
              isActive("/delivery") ? "text-primary" : "text-neutral-500"
            )}>
              <Truck className="h-5 w-5" />
              <span className="text-xs mt-1">Delivery</span>
            </div>
          </Link>
        </>
      );
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-2 lg:hidden z-30">
      <div className="grid grid-cols-5 gap-1">
        {renderNavItems()}
        
        <button 
          onClick={toggleSidebar}
          className="flex flex-col items-center py-1 text-neutral-500"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs mt-1">More</span>
        </button>
      </div>
    </div>
  );
}
