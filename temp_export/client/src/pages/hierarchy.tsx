import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  BookOpen,
  Users,
  LucideShield,
  MapPin,
  User,
  Building,
  Map,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HierarchyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("structure");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Organizational Hierarchy</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Management structure across Tamil Nadu with credential information
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="structure">
            <Users className="mr-2 h-4 w-4" />
            Management Structure
          </TabsTrigger>
          <TabsTrigger value="credentials">
            <LucideShield className="mr-2 h-4 w-4" />
            Login Credentials
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <MapPin className="mr-2 h-4 w-4" />
            Geographic Coverage
          </TabsTrigger>
        </TabsList>

        {/* Management Structure Tab */}
        <TabsContent value="structure">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Management Hierarchy</CardTitle>
                <CardDescription>
                  Four-tier management structure with clear reporting lines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    {/* Hierarchy Visualization */}
                    <div className="flex flex-col items-center">
                      {/* Admin Level */}
                      <div className="w-64 p-4 mb-4 bg-primary text-white rounded-lg shadow-lg text-center">
                        <div className="flex justify-center mb-2">
                          <User className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold">System Administrator</h3>
                        <p className="text-xs opacity-80">Headquarters</p>
                        <p className="text-sm mt-1">Access to all platform functions</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-300"></div>

                      {/* Branch Managers Level */}
                      <div className="w-72 p-3 mb-4 bg-blue-600 text-white rounded-lg shadow-lg text-center">
                        <div className="flex justify-center mb-2">
                          <Building className="h-7 w-7" />
                        </div>
                        <h3 className="font-bold">Branch Managers (38)</h3>
                        <p className="text-xs opacity-80">District Level</p>
                        <p className="text-sm mt-1">Manage district operations</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-300"></div>

                      {/* Taluk Managers Level */}
                      <div className="w-80 p-3 mb-4 bg-blue-500 text-white rounded-lg shadow-lg text-center">
                        <div className="flex justify-center mb-2">
                          <Map className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold">Taluk Managers (261)</h3>
                        <p className="text-xs opacity-80">Taluk Level</p>
                        <p className="text-sm mt-1">Manage taluk-level services</p>
                      </div>
                      <div className="h-8 w-px bg-neutral-300"></div>

                      {/* Service Agents Level */}
                      <div className="w-96 p-3 mb-4 bg-blue-400 text-white rounded-lg shadow-lg text-center">
                        <div className="flex justify-center mb-2">
                          <Users className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold">Service Agents (517+)</h3>
                        <p className="text-xs opacity-80">Pincode Level</p>
                        <p className="text-sm mt-1">Direct customer service provision</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles & Responsibilities</CardTitle>
                <CardDescription>Duties at each management level</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-medium">System Administrator</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Platform oversight and configuration</li>
                        <li>Commission rates management</li>
                        <li>Branch manager appointment and management</li>
                        <li>Service integration and API control</li>
                        <li>Financial oversight across platform</li>
                        <li>Overall performance monitoring</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-medium">Branch Managers</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>District-level service delivery</li>
                        <li>Taluk manager appointment and supervision</li>
                        <li>Service quality monitoring</li>
                        <li>District performance targets</li>
                        <li>Conflict resolution and escalations</li>
                        <li>Marketing initiatives at district level</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-medium">Taluk Managers</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Taluk-level service management</li>
                        <li>Service agent recruitment and oversight</li>
                        <li>Local marketing and promotion</li>
                        <li>Customer dispute resolution</li>
                        <li>Service provider onboarding</li>
                        <li>Local partnership development</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-medium">Service Agents</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Direct service provision to customers</li>
                        <li>Mobile recharge and bill payments</li>
                        <li>Travel bookings assistance</li>
                        <li>Local delivery coordination</li>
                        <li>Equipment rental facilitation</li>
                        <li>Customer support and issue resolution</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Commission Structure</CardTitle>
              <CardDescription>Revenue sharing across management hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Commission Rate</TableHead>
                      <TableHead>Examples</TableHead>
                      <TableHead>Payment Cycle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">System Administrator</TableCell>
                      <TableCell>0.5%</TableCell>
                      <TableCell>Platform maintenance, infrastructure costs</TableCell>
                      <TableCell>Monthly</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Branch Managers</TableCell>
                      <TableCell>0.5%</TableCell>
                      <TableCell>District management, taluk coordination</TableCell>
                      <TableCell>Bi-weekly</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Taluk Managers</TableCell>
                      <TableCell>1%</TableCell>
                      <TableCell>Local operations, agent management</TableCell>
                      <TableCell>Weekly</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Service Agents</TableCell>
                      <TableCell>2-3%</TableCell>
                      <TableCell>Direct service provision to customers</TableCell>
                      <TableCell>Daily/Weekly</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Registered Users</TableCell>
                      <TableCell>1%</TableCell>
                      <TableCell>Referrals, repeat business</TableCell>
                      <TableCell>Immediate</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-neutral-500">
                <p>
                  Total commission from service providers and API partners ranges from 8-15% of
                  transaction value, distributed through this hierarchy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login Credentials Tab */}
        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Login Credential Format</CardTitle>
              <CardDescription>Standardized login credentials for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Test Credentials Available</AlertTitle>
                <AlertDescription>
                  The following examples can be used to log in and explore different roles in the system.
                </AlertDescription>
              </Alert>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Username Format</TableHead>
                      <TableHead>Password Format</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrator</TableCell>
                      <TableCell>admin</TableCell>
                      <TableCell>admin123</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Username: <span className="font-mono">admin</span></span>
                          <span className="text-sm">Password: <span className="font-mono">admin123</span></span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Branch Manager</TableCell>
                      <TableCell>bm_districtname</TableCell>
                      <TableCell>districtname123</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Username: <span className="font-mono">bm_chennai</span></span>
                          <span className="text-sm">Password: <span className="font-mono">chennai123</span></span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Taluk Manager</TableCell>
                      <TableCell>tm_districtname_talukname</TableCell>
                      <TableCell>talukname123</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Username: <span className="font-mono">tm_chennai_north</span></span>
                          <span className="text-sm">Password: <span className="font-mono">north123</span></span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Service Agent</TableCell>
                      <TableCell>sa_districtname_talukname_pincode</TableCell>
                      <TableCell>pincode123</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Username: <span className="font-mono">sa_chennai_north_600001</span></span>
                          <span className="text-sm">Password: <span className="font-mono">600001123</span></span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Notable Credentials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Branch Manager - Chennai</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Username:</span>
                          <code className="bg-neutral-100 px-2 py-1 rounded">bm_chennai</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Password:</span>
                          <code className="bg-neutral-100 px-2 py-1 rounded">chennai123</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">District:</span>
                          <span>Chennai</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Taluk Managers:</span>
                          <span>4</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Taluk Manager - Coimbatore South</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Username:</span>
                          <code className="bg-neutral-100 px-2 py-1 rounded">tm_coimbatore_south</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Password:</span>
                          <code className="bg-neutral-100 px-2 py-1 rounded">south123</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">District:</span>
                          <span>Coimbatore</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Service Agents:</span>
                          <span>6</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Coverage Tab */}
        <TabsContent value="coverage">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Statistics</CardTitle>
                <CardDescription>Current team members across locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Current Count</TableHead>
                        <TableHead className="text-right">Target Count</TableHead>
                        <TableHead className="text-right">Coverage %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Branch Managers</TableCell>
                        <TableCell className="text-right">38</TableCell>
                        <TableCell className="text-right">38</TableCell>
                        <TableCell className="text-right text-green-600">100%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Taluk Managers</TableCell>
                        <TableCell className="text-right">261</TableCell>
                        <TableCell className="text-right">288</TableCell>
                        <TableCell className="text-right text-amber-600">90.6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Service Agents</TableCell>
                        <TableCell className="text-right">517</TableCell>
                        <TableCell className="text-right">2000+</TableCell>
                        <TableCell className="text-right text-red-600">25.9%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Districts by Service Agents</CardTitle>
                <CardDescription>Districts with highest agent deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chennai */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Chennai</span>
                      <span className="text-sm">50 agents</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  {/* Coimbatore */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Coimbatore</span>
                      <span className="text-sm">38 agents</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>

                  {/* Madurai */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Madurai</span>
                      <span className="text-sm">30 agents</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>

                  {/* Tiruchirappalli */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Tiruchirappalli</span>
                      <span className="text-sm">27 agents</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "54%" }}></div>
                    </div>
                  </div>

                  {/* Salem */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Salem</span>
                      <span className="text-sm">25 agents</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <h4 className="font-medium mb-2">Rural vs Urban Distribution</h4>
                  <div className="flex items-center">
                    <div className="w-2/3 bg-neutral-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-l-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                    <div className="ml-4 text-sm flex space-x-4">
                      <span>
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-1"></span>
                        Urban (70%)
                      </span>
                      <span>
                        <span className="inline-block w-3 h-3 rounded-full bg-neutral-200 mr-1"></span>
                        Rural (30%)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Service Availability Across Districts</CardTitle>
              <CardDescription>Service coverage by district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead>Branch Manager</TableHead>
                      <TableHead className="text-center">Taluk Managers</TableHead>
                      <TableHead className="text-center">Service Agents</TableHead>
                      <TableHead>Service Availability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Chennai</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">4/4 (100%)</TableCell>
                      <TableCell className="text-center">50/80 (62.5%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Coimbatore</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">6/6 (100%)</TableCell>
                      <TableCell className="text-center">38/50 (76%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Madurai</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">5/5 (100%)</TableCell>
                      <TableCell className="text-center">30/40 (75%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Tiruchirappalli</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">4/4 (100%)</TableCell>
                      <TableCell className="text-center">27/35 (77%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Tiruppur</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">3/4 (75%)</TableCell>
                      <TableCell className="text-center">17/30 (56.7%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">Salem</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </TableCell>
                      <TableCell className="text-center">4/4 (100%)</TableCell>
                      <TableCell className="text-center">25/35 (71.4%)</TableCell>
                      <TableCell>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-neutral-500">
                <p>Data as of April 2025 - Districts with less than 50% service agent coverage not shown.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="mt-8 p-4 border rounded-lg bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">Management Information</h3>
            <p className="mt-1 text-sm text-blue-700">
              This hierarchy overview provides insight into the organizational structure and login credential format for all management roles. Use the example credentials to explore different access levels in the system. For security reasons, all passwords follow the standardized format outlined above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}