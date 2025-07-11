import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export function useProviderAccess() {
  const { user } = useAuth();

  const { data: providerRegistration } = useQuery({
    queryKey: ["/api/provider/registration-status"],
    enabled: !!user && user.userType === "service_provider",
  });

  const isApprovedProvider = (providerRegistration as any)?.status === "approved";
  const isPendingProvider = (providerRegistration as any)?.status === "pending";
  const providerType = (providerRegistration as any)?.providerType || (providerRegistration as any)?.provider_type;

  // Define access permissions for each provider type
  const getProviderAccess = () => {
    // Allow pending providers to access their dashboard with limited functionality
    if (!providerType && !isPendingProvider && !isApprovedProvider) {
      return {
        canAccessFarmerListings: false,
        canAccessLocalProducts: false,
        canAccessBookingServices: false,
        canAccessRentalServices: false,
        canAccessTaxiServices: false,
        canAccessTransportServices: false,
        canAccessRecyclingServices: false,
        providerType: null,
        isApproved: false,
        isPending: false
      };
    }

    // For pending providers, allow dashboard access but limited functionality
    if (isPendingProvider && !isApprovedProvider) {
      return {
        canAccessFarmerListings: false,
        canAccessLocalProducts: false,
        canAccessBookingServices: false,
        canAccessRentalServices: false,
        canAccessTaxiServices: false,
        canAccessTransportServices: false,
        canAccessRecyclingServices: false,
        providerType,
        isApproved: false,
        isPending: true
      };
    }

    switch (providerType) {
      case "farmer":
        return {
          canAccessFarmerListings: true,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "manufacturer":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: true,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "booking_agent":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: true,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "rental":
      case "rental_provider":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: true,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "taxi_service":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: true,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "transport_service":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: true,
          canAccessRecyclingServices: false,
          providerType,
          isApproved: true
        };
      
      case "recycling_agent":
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: true,
          providerType,
          isApproved: true
        };
      
      default:
        return {
          canAccessFarmerListings: false,
          canAccessLocalProducts: false,
          canAccessBookingServices: false,
          canAccessRentalServices: false,
          canAccessTaxiServices: false,
          canAccessTransportServices: false,
          canAccessRecyclingServices: false,
          providerType: null,
          isApproved: false
        };
    }
  };

  return {
    ...getProviderAccess(),
    providerRegistration,
    isLoading: user && user.userType === "provider" && providerRegistration === undefined
  };
}