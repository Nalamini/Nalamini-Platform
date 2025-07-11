import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CalendarIcon, ChevronDown, Users, Activity, CreditCard, FileText, DownloadCloud } from "lucide-react";
import { format, subDays, isValid } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar
} from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

type ChartData = {
  date: string;
  value: number;
  metric: string;
};

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [metrics, setMetrics] = useState<string[]>([
    "active_users",
    "page_views",
    "service_usage_recharge",
    "service_usage_booking"
  ]);
  const [district, setDistrict] = useState<string>("");
  const [taluk, setTaluk] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: [
      "/api/analytics/metrics",
      {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        metrics,
        district,
        taluk,
      },
    ],
    queryFn: async () => {
      if (!user) return [];
      
      const queryParams = new URLSearchParams();
      queryParams.append("startDate", dateRange.startDate.toISOString());
      queryParams.append("endDate", dateRange.endDate.toISOString());
      
      metrics.forEach(metric => {
        queryParams.append("metrics", metric);
      });
      
      if (district) {
        queryParams.append("district", district);
      }
      
      if (taluk) {
        queryParams.append("taluk", taluk);
      }
      
      const res = await apiRequest("GET", `/api/analytics/metrics?${queryParams.toString()}`);
      return await res.json();
    },
    enabled: !!user && user.userType !== "customer" && isValid(dateRange.startDate) && isValid(dateRange.endDate),
  });

  // Fetch reports
  const { data: reports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["/api/reports"],
    queryFn: async () => {
      if (!user) return [];
      const res = await apiRequest("GET", "/api/reports");
      return await res.json();
    },
    enabled: !!user && user.userType !== "customer",
  });

  if (!user || (user.userType !== "admin" && user.userType !== "branch_manager" && user.userType !== "taluk_manager")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // Transform data for charts
  const transformDataForCharts = (): ChartData[] => {
    if (!analyticsData || !Array.isArray(analyticsData)) {
      return [];
    }

    return analyticsData.map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      value: item.value,
      metric: item.metric,
    }));
  };

  // Group data by metric for separated charts
  const getDataByMetric = (metricName: string): ChartData[] => {
    if (!analyticsData || !Array.isArray(analyticsData)) {
      return [];
    }

    return analyticsData
      .filter((item) => item.metric === metricName)
      .map((item) => ({
        date: format(new Date(item.date), "MMM dd"),
        value: item.value,
        metric: item.metric,
      }));
  };

  // Calculate summary statistics
  const calculateTotal = (metricName: string): number => {
    if (!analyticsData || !Array.isArray(analyticsData)) {
      return 0;
    }

    return analyticsData
      .filter((item) => item.metric === metricName)
      .reduce((sum, item) => sum + item.value, 0);
  };

  const getLatestValue = (metricName: string): number => {
    if (!analyticsData || !Array.isArray(analyticsData)) {
      return 0;
    }

    const metricData = analyticsData
      .filter((item) => item.metric === metricName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return metricData.length > 0 ? metricData[0].value : 0;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        View key metrics and performance indicators for the Nalamini service platform.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <Label htmlFor="date-range" className="mr-2">
                Date Range:
              </Label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className="w-[300px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.startDate, "PPP")} - {format(dateRange.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="flex">
                      <div className="border-r p-2">
                        <div className="px-3 py-2 font-medium">Start Date</div>
                        <Calendar
                          mode="single"
                          selected={dateRange.startDate}
                          onSelect={(date) => date && setDateRange({ ...dateRange, startDate: date })}
                          initialFocus
                        />
                      </div>
                      <div className="p-2">
                        <div className="px-3 py-2 font-medium">End Date</div>
                        <Calendar
                          mode="single"
                          selected={dateRange.endDate}
                          onSelect={(date) => date && setDateRange({ ...dateRange, endDate: date })}
                          initialFocus
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* District Filter (show only for admin) */}
            {user.userType === "admin" && (
              <div className="flex items-center">
                <Label htmlFor="district" className="mr-2">
                  District:
                </Label>
                <Select
                  value={district}
                  onValueChange={setDistrict}
                >
                  <SelectTrigger id="district" className="w-[200px]">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {/* Future: Populate from API */}
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                    <SelectItem value="Madurai">Madurai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Taluk Filter (show only for admin and branch_manager) */}
            {(user.userType === "admin" || user.userType === "branch_manager") && (
              <div className="flex items-center">
                <Label htmlFor="taluk" className="mr-2">
                  Taluk:
                </Label>
                <Select
                  value={taluk}
                  onValueChange={setTaluk}
                >
                  <SelectTrigger id="taluk" className="w-[200px]">
                    <SelectValue placeholder="All Taluks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Taluks</SelectItem>
                    {/* Future: Populate from API based on district selection */}
                    <SelectItem value="Chennai North">Chennai North</SelectItem>
                    <SelectItem value="Chennai South">Chennai South</SelectItem>
                    <SelectItem value="Coimbatore North">Coimbatore North</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getLatestValue("active_users")}</div>
                    <p className="text-xs text-muted-foreground">
                      Total: {calculateTotal("active_users")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Page Views
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getLatestValue("page_views")}</div>
                    <p className="text-xs text-muted-foreground">
                      Total: {calculateTotal("page_views")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Recharges
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getLatestValue("service_usage_recharge")}</div>
                    <p className="text-xs text-muted-foreground">
                      Total: {calculateTotal("service_usage_recharge")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Bookings
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{getLatestValue("service_usage_booking")}</div>
                    <p className="text-xs text-muted-foreground">
                      Total: {calculateTotal("service_usage_booking")}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Overview</CardTitle>
                <CardDescription>
                  Daily active users and page views over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[350px] w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={transformDataForCharts()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        minTickGap={15}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        name="Active Users"
                        type="monotone"
                        dataKey={(entry) => entry.metric === "active_users" ? entry.value : null}
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        connectNulls
                      />
                      <Line
                        name="Page Views"
                        type="monotone"
                        dataKey={(entry) => entry.metric === "page_views" ? entry.value : null}
                        stroke="#82ca9d"
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Usage</CardTitle>
                <CardDescription>
                  Comparison of different service usages over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {isLoading ? (
                  <div className="h-[350px] w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={transformDataForCharts()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        minTickGap={15}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        name="Recharges"
                        dataKey={(entry) => entry.metric === "service_usage_recharge" ? entry.value : null}
                        fill="#8884d8"
                        connectNulls
                      />
                      <Bar
                        name="Bookings"
                        dataKey={(entry) => entry.metric === "service_usage_booking" ? entry.value : null}
                        fill="#82ca9d"
                        connectNulls
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Saved Reports</h2>
              <Button>
                Create New Report
              </Button>
            </div>
            
            {isLoadingReports ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-3 w-full mb-2" />
                      <Skeleton className="h-3 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No reports found</p>
                    <p className="text-sm text-muted-foreground">Create a new report to get started</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report: any) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <CardTitle>{report.name}</CardTitle>
                      <CardDescription>
                        {report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Last run: {report.lastRun ? format(new Date(report.lastRun), "MMM d, yyyy") : "Never"}
                        </div>
                        <Button size="sm" variant="outline">
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          Run Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Detailed Metrics</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  Export Data
                </Button>
                <Button variant="outline">
                  Configure Metrics
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              Detailed metrics are currently in development. This feature will provide in-depth analysis
              of service usage patterns, user engagement, and regional performance data.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Detailed analytics features will be available in the next update
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The detailed analytics dashboard will include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Service-specific performance metrics</li>
                  <li>Geographic distribution visualization</li>
                  <li>User acquisition and retention analysis</li>
                  <li>Revenue and transaction performance tracking</li>
                  <li>Custom report builder</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}