import { useAuth } from "@/hooks/use-auth";
import TaxiAdminCompletePage from "@/pages/admin/taxi-admin-complete";
import TaxiBrowsePage from "@/pages/customer/taxi-browse";

export default function TaxiMainPage() {
  const { user } = useAuth();

  if (user?.userType === "admin") {
    return <TaxiAdminCompletePage />;
  }

  return <TaxiBrowsePage />;
}