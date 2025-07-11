import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Layout Components
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";

// Pages
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import Dashboard from "@/pages/dashboard";
import BranchManagers from "@/pages/branch-managers";
import TalukManagers from "@/pages/taluk-managers";
import ServiceAgents from "@/pages/service-agents";
// Recharge Pages
import RechargeHub from "@/pages/recharge";
import MobileRecharge from "@/pages/recharge/mobile";
import DTHRecharge from "@/pages/recharge/dth";
import ElectricityBill from "@/pages/recharge/electricity";
import AllRechargeServices from "@/pages/recharge/all";

import Bookings from "@/pages/bookings";
import Rental from "@/pages/rental";
import Taxi from "@/pages/taxi";
import TaxiNew from "@/pages/taxi-new";
import Delivery from "@/pages/delivery";
import Grocery from "@/pages/grocery";
import GroceryProductDetail from "@/pages/grocery/product/[id]";
import GroceryCart from "@/pages/grocery/cart";
import CommissionConfig from "@/pages/commission-config";
import Commissions from "@/pages/commissions";
import CommissionDashboard from "@/pages/commission-dashboard";
import Wallet from "@/pages/wallet";
import Utility from "@/pages/utility";
import Travel from "@/pages/travel";
import BookingDetailPage from "@/pages/booking-detail";
import GetAssociatedPage from "@/pages/get-associated";
import ProfilePage from "@/pages/profile";
import HierarchyPage from "@/pages/hierarchy";
import ManagerApplicationsPage from "@/pages/manager-applications";
import FarmListingsPage from "@/pages/farm-listings";
import AddFarmerProductPage from "@/pages/farmer/add-product";
import EditFarmerProductPage from "@/pages/farmer/edit-product";
import RequestProductPage from "@/pages/farmer/request-product";
import MyFarmListingsPage from "@/pages/farmer/my-listings";

// Admin Pages
import GroceryCategoriesPage from "@/pages/admin/grocery/categories";
import GroceryProductsPage from "@/pages/admin/grocery/products";
import GroceryProductsNewPage from "@/pages/admin/grocery/products-new";
import ProductRequestsPage from "@/pages/admin/grocery/product-requests";
import FarmerListingsAdminPage from "@/pages/admin/grocery/farmer-listings";
import LocalProductsPage from "@/pages/admin/local-products";
import LocalProductsNewPage from "@/pages/admin/local-products/new";
import LocalProductDetailsPage from "@/pages/admin/local-products/[id]/details";

// Provider Registration Pages
import ProviderRegistrationPage from "@/pages/provider-registration";
import FarmerRegistrationPage from "@/pages/provider-registration/farmer";
import ManufacturerRegistrationPage from "@/pages/provider-registration/manufacturer";
import TaxiProviderRegistrationPage from "@/pages/provider-registration/taxi-provider";
import BookingAgentRegistrationPage from "@/pages/provider-registration/booking-agent";
import TransportationAgentRegistrationPage from "@/pages/provider-registration/transportation-agent";
import RentalProviderRegistrationPage from "@/pages/provider-registration/rental-provider";
import RecyclingAgentRegistrationPage from "@/pages/provider-registration/recycling-agent";

// Manager Registration Pages
import ManagerRegistrationPage from "@/pages/manager-registration";
import BranchManagerRegistrationPage from "@/pages/manager-registration/branch-manager";
import TalukManagerRegistrationPage from "@/pages/manager-registration/taluk-manager";
import ServiceAgentRegistrationPage from "@/pages/manager-registration/service-agent";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:pl-64 pt-16 pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/dashboard">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/branch-managers">
        <AppLayout>
          <BranchManagers />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/taluk-managers">
        <AppLayout>
          <TalukManagers />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/service-agents">
        <AppLayout>
          <ServiceAgents />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/">
        <AppLayout>
          <RechargeHub />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/mobile">
        <AppLayout>
          <MobileRecharge />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/dth">
        <AppLayout>
          <DTHRecharge />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/electricity">
        <AppLayout>
          <ElectricityBill />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/gas">
        <AppLayout>
          <AllRechargeServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/broadband">
        <AppLayout>
          <AllRechargeServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/water">
        <AppLayout>
          <AllRechargeServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/credit-card">
        <AppLayout>
          <AllRechargeServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recharge/all">
        <AppLayout>
          <AllRechargeServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/bookings">
        <AppLayout>
          <Bookings />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/rental">
        <AppLayout>
          <Rental />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/taxi">
        <AppLayout>
          <TaxiNew />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/taxi-old">
        <AppLayout>
          <Taxi />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/delivery">
        <AppLayout>
          <Delivery />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/grocery">
        <AppLayout>
          <Grocery />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/grocery/product/:id">
        <AppLayout>
          <GroceryProductDetail />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/grocery/cart">
        <AppLayout>
          <GroceryCart />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/commission-config">
        <AppLayout>
          <CommissionConfig />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/commissions">
        <AppLayout>
          <Commissions />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/commission-dashboard">
        <AppLayout>
          <CommissionDashboard />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/wallet">
        <AppLayout>
          <Wallet />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/utility">
        <AppLayout>
          <Utility />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/travel">
        <AppLayout>
          <Travel />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/booking/:id">
        <AppLayout>
          <BookingDetailPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/get-associated">
        <AppLayout>
          <GetAssociatedPage />
        </AppLayout>
      </ProtectedRoute>

      {/* Provider Registration Routes */}
      <ProtectedRoute path="/provider-registration">
        <AppLayout>
          <ProviderRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/farmer">
        <AppLayout>
          <FarmerRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/manufacturer">
        <AppLayout>
          <ManufacturerRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/taxi-provider">
        <AppLayout>
          <TaxiProviderRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/booking-agent">
        <AppLayout>
          <BookingAgentRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/transportation-agent">
        <AppLayout>
          <TransportationAgentRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/rental-provider">
        <AppLayout>
          <RentalProviderRegistrationPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider-registration/recycling-agent">
        <AppLayout>
          <RecyclingAgentRegistrationPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/profile">
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/hierarchy">
        <AppLayout>
          <HierarchyPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/manager-applications">
        <AppLayout>
          <ManagerApplicationsPage />
        </AppLayout>
      </ProtectedRoute>

      {/* Admin Pages */}
      <ProtectedRoute path="/admin/grocery/categories">
        <AppLayout>
          <GroceryCategoriesPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/grocery/products">
        <AppLayout>
          <GroceryProductsPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/grocery/products-new">
        <AppLayout>
          <GroceryProductsNewPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/grocery/product-requests">
        <AppLayout>
          <ProductRequestsPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/grocery/farmer-listings">
        <AppLayout>
          <FarmerListingsAdminPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/local-products">
        <AppLayout>
          <LocalProductsPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/local-products/new">
        <AppLayout>
          <LocalProductsNewPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/local-products/:id/details">
        <AppLayout>
          <LocalProductDetailsPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/farm-listings">
        <AppLayout>
          <FarmListingsPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/farmer/add-product">
        <AppLayout>
          <AddFarmerProductPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/farmer/edit-product/:id">
        <AppLayout>
          <EditFarmerProductPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/farmer/my-listings">
        <AppLayout>
          <MyFarmListingsPage />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/farmer/request-product">
        <AppLayout>
          <RequestProductPage />
        </AppLayout>
      </ProtectedRoute>

      {/* Manager Registration Routes */}
      <Route path="/manager-registration">
        <AppLayout>
          <ManagerRegistrationPage />
        </AppLayout>
      </Route>

      <Route path="/manager-registration/branch-manager">
        <AppLayout>
          <BranchManagerRegistrationPage />
        </AppLayout>
      </Route>

      <Route path="/manager-registration/taluk-manager">
        <AppLayout>
          <TalukManagerRegistrationPage />
        </AppLayout>
      </Route>

      <Route path="/manager-registration/service-agent">
        <AppLayout>
          <ServiceAgentRegistrationPage />
        </AppLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
