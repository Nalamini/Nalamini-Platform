import { useLocation } from "wouter";
import { ArrowLeft, Zap, Tv, Phone, Fuel, WifiIcon, GlobeIcon, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MobileRechargePage from "./mobile";
import DTHRechargePage from "./dth";
import ElectricityBillPage from "./electricity";

// Component for upcoming services
const ComingSoonService = ({ title, icon, description }: { title: string, icon: React.ReactNode, description: string }) => {
  return (
    <Card className="border border-dashed bg-card/50">
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Coming Soon
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AllRechargeServicesPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/recharge")}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">All Recharge Services</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Pay all your utility bills from a single dashboard</p>
        </div>
      </div>
      
      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="mb-6 w-full flex justify-start overflow-x-auto">
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> Mobile
          </TabsTrigger>
          <TabsTrigger value="dth" className="flex items-center gap-2">
            <Tv className="h-4 w-4" /> DTH
          </TabsTrigger>
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Electricity
          </TabsTrigger>
          <TabsTrigger value="gas" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" /> Gas
          </TabsTrigger>
          <TabsTrigger value="broadband" className="flex items-center gap-2">
            <WifiIcon className="h-4 w-4" /> Broadband
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" /> Water
          </TabsTrigger>
          <TabsTrigger value="credit-card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Credit Card
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mobile">
          <div className="mt-2">
            <MobileRechargePage />
          </div>
        </TabsContent>
        
        <TabsContent value="dth">
          <div className="mt-2">
            <DTHRechargePage />
          </div>
        </TabsContent>
        
        <TabsContent value="electricity">
          <div className="mt-2">
            <ElectricityBillPage />
          </div>
        </TabsContent>
        
        <TabsContent value="gas">
          <div className="mt-4">
            <ComingSoonService 
              title="Gas Bill Payment"
              icon={<Fuel className="h-7 w-7 text-primary" />}
              description="Pay your gas bills for all major gas providers with instant confirmation and receipts."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="broadband">
          <div className="mt-4">
            <ComingSoonService 
              title="Broadband Bill Payment"
              icon={<WifiIcon className="h-7 w-7 text-primary" />}
              description="Pay your broadband and internet bills for all ISPs with attractive cashback offers."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="water">
          <div className="mt-4">
            <ComingSoonService 
              title="Water Bill Payment"
              icon={<GlobeIcon className="h-7 w-7 text-primary" />}
              description="Pay your water utility bills for all municipalities and water boards with zero convenience fee."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="credit-card">
          <div className="mt-4">
            <ComingSoonService 
              title="Credit Card Bill Payment"
              icon={<CreditCard className="h-7 w-7 text-primary" />}
              description="Pay your credit card bills for all major banks with rewards and special offers."
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Have questions about our recharge services? <Button variant="link" className="h-auto p-0">Contact Support</Button>
        </p>
      </div>
    </div>
  );
}