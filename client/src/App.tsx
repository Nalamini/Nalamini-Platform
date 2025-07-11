import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AddLocalProduct from "./pages/provider/add-local-product";
import MyLocalProducts from "./pages/provider/my-local-products";
import RequestCategory from "./pages/provider/request-category";
import GroceryProductForm from "./pages/provider/grocery-product-form";
import CustomerGroceryBrowse from "./pages/customer/grocery-browse";
import AnalyticsDashboard from "@/pages/analytics-dashboard";

// Layout Components
import Header from "@/components/layout/header";
import Sidebar, { SidebarProvider, useSidebarContext } from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

// Pages
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";
import Dashboard from "@/pages/dashboard";
import UnifiedDashboard from "@/pages/unified-dashboard";
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
import Grocery from "@/pages/grocery-fixed";
import GroceryProductDetail from "@/pages/grocery/product/[id]";
import GroceryCart from "@/pages/grocery/cart";
import CommissionConfig from "@/pages/commission-config";
import Commissions from "@/pages/commissions";
import CommissionDashboard from "@/pages/commission-dashboard";
import Wallet from "@/pages/wallet";
import Utility from "@/pages/utility";
import Travel from "@/pages/travel";
import BusBooking from "@/pages/bus-booking";
import TravelBooking from "@/pages/travel-services";
import BookingDetailPage from "@/pages/booking-detail";
import GetAssociatedPage from "@/pages/get-associated";
import ProfilePage from "@/pages/profile";
import HierarchyPage from "@/pages/hierarchy";
import ManagerApplicationsPage from "@/pages/manager-applications";
import FarmListingsPage from "@/pages/farm-listings";
import AddFarmerProductPage from "@/pages/farmer/add-product";

// Farmer Pages
import FarmerAddProduct from "@/pages/farmer/add-product";
import FarmerMyListings from "@/pages/farmer/my-listings";
import FarmerRequestProduct from "@/pages/farmer/request-product";
import EditFarmerProductPage from "@/pages/farmer/edit-product";
import RequestProductPage from "@/pages/farmer/request-product";
import MyFarmListingsPage from "@/pages/farmer/my-listings";
import RecyclingPage from "@/pages/recycling";
import ChatPage from "@/pages/chat";

// Admin Pages
import RecyclingRatesPage from "@/pages/admin/recycling-rates";
import GroceryCategoriesPage from "@/pages/admin/grocery/categories";
import GroceryProductsPage from "@/pages/admin/grocery/products";
import GroceryProductsNewPage from "@/pages/admin/grocery/products-new";
import ProductRequestsPage from "@/pages/admin/grocery/product-requests";
import FarmerListingsAdminPage from "@/pages/admin/grocery/farmer-listings";
import FarmerProductApprovals from "@/pages/admin/grocery/farmer-product-approvals";
import LocalProductsPage from "@/pages/admin/local-products";
import LocalProductsNewPage from "@/pages/admin/local-products/new";
import LocalProductsCart from "@/pages/local-products-cart";
import LocalProductsBrowse from "@/pages/local-products-browse";
import LocalProductDetailsPage from "@/pages/admin/local-products/[id]/details";
import LocalProductCategoriesPage from "@/pages/admin/local-products/categories";
import ServiceProvidersPage from "@/pages/admin/service-providers";

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
import OilTestPage from "@/pages/oil-test";
import SubcategoryTestPage from "@/pages/subcategory-test";
import GroceryBrowsePage from "@/pages/grocery-browse-professional";
import ProviderDashboard from "@/pages/provider-dashboard";
import VideoManagement from "@/pages/video-management";
import VideoLibrary from "@/pages/video-library";
import VideoUploadPage from "@/pages/video-upload";
import VideoUploadChunked from "@/pages/video-upload-chunked";
import VideoUploadSimple from "@/pages/video-upload-simple";
import VideoAnalyticsDashboard from "@/pages/video-analytics-dashboard";
import VideoApprovals from "@/pages/admin/video-approvals";
import ServicesOverview from "@/pages/services-overview";
import MyGroceryProducts from "@/pages/provider/my-grocery-products";
import LocalProductsBrowsePage from "@/pages/local-products-new";
import OpportunitiesForum from "@/pages/opportunities-forum";
import OpportunitiesForumNew from "@/pages/opportunities-forum-new";
import NominationTest from "@/pages/nomination-test";

// Rental Pages
import RentalMarketplace from "@/pages/rental-marketplace";
import RentalManagement from "@/pages/admin/rental-management";
import RentalCategoriesPage from "@/pages/admin/rental-categories";
import RentalSubcategoriesPage from "@/pages/admin/rental-subcategories";
import ProviderRentalEquipment from "@/pages/provider/rental-equipment";
import RentalBrowse from "@/pages/rental-browse";
import RentalServices from "@/pages/rental-services";
import ProviderRentalServices from "@/pages/provider/rental-services";
import ProviderMyRentalItems from "@/pages/provider/my-rental-items";
import CustomerMyRentalItems from "@/pages/customer/my-rental-items";

// Service Request Management
import ServiceRequestDashboard from "@/pages/customer/service-request-dashboard";
import ServiceRequestsManagement from "@/pages/admin/service-requests-management";
import CustomerServiceRequests from "@/pages/customer/service-requests";
import AgentServiceRequests from "@/pages/agent/service-requests-agent";
import ManagerServiceRequests from "@/pages/manager/service-requests-manager";
import BranchManagerServiceRequests from "@/pages/branch-manager/service-requests-branch-manager";
import ProviderServiceRequests from "@/pages/provider/service-requests-provider";

// Taxi Service Pages
import TaxiBrowse from "@/pages/customer/taxi-customer-delivery-clone";
import TaxiVehicles from "@/pages/provider/taxi-vehicles";
// Delivery Management Pages
import DeliveryBrowse from "@/pages/customer/delivery-browse";
import DeliveryRegistration from "@/pages/provider/delivery-registration";
import DeliveryCategories from "@/pages/admin/delivery-categories";
import DeliveryAgentApprovals from "@/pages/admin/delivery-agent-approvals";
import DeliveryAgentsManagement from "@/pages/admin/delivery-agents-management";

// Taxi Management Pages
import TaxiVehicleApprovals from "@/pages/admin/taxi-vehicle-approvals";
import TaxiVehiclesManagement from "@/pages/admin/taxi-vehicles-management";
import TaxiCategoriesManagement from "@/pages/admin/taxi-categories-management";
import TaxiServiceAdmin from "@/pages/admin/taxi-service-admin";
import TaxiMainPage from "@/pages/taxi-main";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarContext();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className={cn(
          "flex-1 pt-16 pb-16 lg:pb-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}>
          <div className="p-4 lg:p-6 max-w-full">
            {children}
          </div>
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
      <Route path="/opportunities" component={OpportunitiesForum} />
      
      <ProtectedRoute path="/dashboard">
        <AppLayout>
          <UnifiedDashboard />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider-dashboard">
        <AppLayout>
          <ProviderDashboard />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/service-requests">
        <AppLayout>
          <ServiceRequestDashboard />
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
      
      <ProtectedRoute path="/rental-marketplace">
        <AppLayout>
          <RentalMarketplace />
        </AppLayout>
      </ProtectedRoute>
      
      <Route path="/rental-browse">
        <AppLayout>
          <RentalBrowse />
        </AppLayout>
      </Route>
      
      <Route path="/rental-services">
        <AppLayout>
          <RentalServices />
        </AppLayout>
      </Route>
      
      <ProtectedRoute path="/admin/rental-management">
        <AppLayout>
          <RentalManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/rental-categories">
        <AppLayout>
          <RentalCategoriesPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/rental-subcategories">
        <AppLayout>
          <RentalSubcategoriesPage />
        </AppLayout>
      </ProtectedRoute>
      
      {/* Taxi Service Routes */}
      <ProtectedRoute path="/taxi">
        <AppLayout>
          <TaxiMainPage />
        </AppLayout>
      </ProtectedRoute>
      
      <Route path="/taxi-browse">
        <AppLayout>
          <TaxiBrowse />
        </AppLayout>
      </Route>
      
      <Route path="/customer/taxi-browse">
        <AppLayout>
          <TaxiBrowse />
        </AppLayout>
      </Route>
      
      <ProtectedRoute path="/provider/taxi-vehicles">
        <AppLayout>
          <TaxiVehicles />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-vehicle-approvals">
        <AppLayout>
          <TaxiVehicleApprovals />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-categories">
        <AppLayout>
          <TaxiCategoriesManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-service">
        <AppLayout>
          <TaxiServiceAdmin />
        </AppLayout>
      </ProtectedRoute>

      {/* Delivery Management Routes */}
      <Route path="/delivery-browse">
        <AppLayout>
          <DeliveryBrowse />
        </AppLayout>
      </Route>
      
      <ProtectedRoute path="/provider/delivery-registration">
        <AppLayout>
          <DeliveryRegistration />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/delivery-categories">
        <AppLayout>
          <DeliveryCategories />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/delivery-agent-approvals">
        <AppLayout>
          <DeliveryAgentApprovals />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/delivery-agents-management">
        <AppLayout>
          <DeliveryAgentsManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-categories-management">
        <AppLayout>
          <TaxiCategoriesManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-vehicle-approvals">
        <AppLayout>
          <TaxiVehicleApprovals />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/taxi-vehicles-management">
        <AppLayout>
          <TaxiVehiclesManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/rental-equipment">
        <AppLayout>
          <ProviderRentalEquipment />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/add-equipment">
        <AppLayout>
          <ProviderRentalEquipment />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/rental-services">
        <AppLayout>
          <ProviderRentalServices />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/my-rentals">
        <AppLayout>
          <ProviderMyRentalItems />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/customer/my-rentals">
        <AppLayout>
          <CustomerMyRentalItems />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/taxi">
        <AppLayout>
          <TaxiMainPage />
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
      
      {/* Direct access to fixed grocery page for testing */}
      <Route path="/grocery-fixed">
        <AppLayout>
          <Grocery />
        </AppLayout>
      </Route>
      
      {/* New grocery browse page with improved UI */}
      <Route path="/grocery-browse">
        <AppLayout>
          <GroceryBrowsePage />
        </AppLayout>
      </Route>
      
      {/* Customer grocery browse page */}
      <ProtectedRoute path="/customer/grocery-browse">
        <AppLayout>
          <CustomerGroceryBrowse />
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
      
      <ProtectedRoute path="/local-products">
        <AppLayout>
          <LocalProductsBrowse />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/local-products/cart">
        <AppLayout>
          <LocalProductsCart />
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
      
      <ProtectedRoute path="/analytics">
        <AppLayout>
          <AnalyticsDashboard />
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
      
      <Route path="/travel">
        <AppLayout>
          <Travel />
        </AppLayout>
      </Route>
      
      <ProtectedRoute path="/bus-booking">
        <AppLayout>
          <BusBooking />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/travel-services">
        <AppLayout>
          <TravelBooking />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/recycling">
        <AppLayout>
          <RecyclingPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/chat">
        <AppLayout>
          <ChatPage />
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
      
      <ProtectedRoute path="/video-management">
        <AppLayout>
          <VideoManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/video-library">
        <AppLayout>
          <VideoLibrary />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/video-upload">
        <AppLayout>
          <VideoUploadPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/video-upload-simple">
        <AppLayout>
          <VideoUploadSimple />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/video-upload-chunked">
        <AppLayout>
          <VideoUploadChunked />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/video-analytics">
        <AppLayout>
          <VideoAnalyticsDashboard />
        </AppLayout>
      </ProtectedRoute>
      
      <Route path="/services-overview">
        <ServicesOverview />
      </Route>
      
      <ProtectedRoute path="/manager-applications">
        <AppLayout>
          <ManagerApplicationsPage />
        </AppLayout>
      </ProtectedRoute>

      {/* Admin Pages */}
      <ProtectedRoute path="/admin/recycling/rates">
        <AppLayout>
          <RecyclingRatesPage />
        </AppLayout>
      </ProtectedRoute>

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
      
      <ProtectedRoute path="/admin/grocery/farmer-product-approvals">
        <AppLayout>
          <FarmerProductApprovals />
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
      
      <ProtectedRoute path="/admin/local-products/categories">
        <AppLayout>
          <LocalProductCategoriesPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/service-providers">
        <AppLayout>
          <ServiceProvidersPage />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/video-approvals">
        <AppLayout>
          <VideoApprovals />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/admin/service-requests">
        <AppLayout>
          <ServiceRequestsManagement />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/customer/service-requests">
        <AppLayout>
          <CustomerServiceRequests />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/agent/service-requests">
        <AppLayout>
          <AgentServiceRequests />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/manager/service-requests">
        <AppLayout>
          <ManagerServiceRequests />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/branch-manager/service-requests">
        <AppLayout>
          <BranchManagerServiceRequests />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/service-requests">
        <AppLayout>
          <ProviderServiceRequests />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/add-local-product">
        <AppLayout>
          <AddLocalProduct />
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

      {/* Provider/Manufacturer Routes */}
      <ProtectedRoute path="/provider/add-local-product">
        <AppLayout>
          <AddLocalProduct />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider/my-local-products">
        <AppLayout>
          <MyLocalProducts />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider/request-category">
        <AppLayout>
          <RequestCategory />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider/add-grocery-product">
        <AppLayout>
          <GroceryProductForm />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/provider/my-grocery-products">
        <AppLayout>
          <MyGroceryProducts />
        </AppLayout>
      </ProtectedRoute>
      
      <ProtectedRoute path="/customer/grocery-browse">
        <AppLayout>
          <CustomerGroceryBrowse />
        </AppLayout>
      </ProtectedRoute>

      <ProtectedRoute path="/provider/rental-equipment">
        <AppLayout>
          <ProviderRentalEquipment />
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
      
      {/* Opportunities Forum - Access without authentication */}
      <Route path="/opportunities-forum">
        <AppLayout>
          <OpportunitiesForumNew />
        </AppLayout>
      </Route>
      
      {/* Nomination Test Page */}
      <Route path="/nomination-test">
        <AppLayout>
          <NominationTest />
        </AppLayout>
      </Route>
      
      {/* Oil Subcategory Test Page - Access without authentication */}
      <Route path="/oil-test">
        <AppLayout>
          <OilTestPage />
        </AppLayout>
      </Route>
      
      {/* Subcategory Component Test Page - Access without authentication */}
      <Route path="/subcategory-test">
        <AppLayout>
          <SubcategoryTestPage />
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
        <SidebarProvider>
          <Router />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
