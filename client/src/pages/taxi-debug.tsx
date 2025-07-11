import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

export default function TaxiDebugPage() {
  const { user } = useAuth();

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["/api/taxi/categories"],
  });

  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ["/api/taxi/vehicles"],
  });

  const { data: providers, isLoading: providersLoading, error: providersError } = useQuery({
    queryKey: ["/api/taxi/providers"],
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/admin/taxi-stats"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Taxi Service Debug</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          <p>User Type: {user?.userType || "Unknown"}</p>
          <p>Username: {user?.username || "Unknown"}</p>
          <p>User ID: {user?.id || "Unknown"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <p>Loading: {categoriesLoading ? "Yes" : "No"}</p>
          <p>Error: {categoriesError ? String(categoriesError) : "None"}</p>
          <p>Data: {JSON.stringify(categories)}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Vehicles</h2>
          <p>Loading: {vehiclesLoading ? "Yes" : "No"}</p>
          <p>Error: {vehiclesError ? String(vehiclesError) : "None"}</p>
          <p>Data: {JSON.stringify(vehicles)}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Providers</h2>
          <p>Loading: {providersLoading ? "Yes" : "No"}</p>
          <p>Error: {providersError ? String(providersError) : "None"}</p>
          <p>Data: {JSON.stringify(providers)}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Stats</h2>
          <p>Loading: {statsLoading ? "Yes" : "No"}</p>
          <p>Error: {statsError ? String(statsError) : "None"}</p>
          <p>Data: {JSON.stringify(stats)}</p>
        </div>
      </div>
    </div>
  );
}