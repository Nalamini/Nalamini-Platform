import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Grid2x2,
  Tv,
  Zap,
  Phone,
  Fuel,
  WifiIcon,
  GlobeIcon,
  CreditCard,
  Sparkles,
  ReceiptIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const ServiceCard = ({ title, icon, path }: ServiceCardProps) => {
  const [, navigate] = useLocation();
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group overflow-hidden relative"
      onClick={() => navigate(path)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="flex flex-col items-center justify-center p-6 relative z-10">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default function RechargeHub() {
  const [, navigate] = useLocation();
  const services = [
    {
      title: "Mobile Recharge",
      icon: <Phone className="h-7 w-7 text-primary" />,
      description: "Prepaid & Postpaid mobile recharges for all operators",
      path: "/recharge/mobile"
    },
    {
      title: "DTH",
      icon: <Tv className="h-7 w-7 text-primary" />,
      description: "Recharge your DTH connections across all providers",
      path: "/recharge/dth"
    },
    {
      title: "Electricity",
      icon: <Zap className="h-7 w-7 text-primary" />,
      description: "Pay electricity bills for all major boards",
      path: "/recharge/electricity"
    },
    {
      title: "Gas Bill",
      icon: <Fuel className="h-7 w-7 text-primary" />,
      description: "Pay your gas bills quickly and securely",
      path: "/recharge/gas"
    },
    {
      title: "Broadband",
      icon: <WifiIcon className="h-7 w-7 text-primary" />,
      description: "Pay bills for all broadband service providers",
      path: "/recharge/broadband"
    },
    {
      title: "Water Bill",
      icon: <GlobeIcon className="h-7 w-7 text-primary" />,
      description: "Pay your water utility bills easily",
      path: "/recharge/water"
    },
    {
      title: "Credit Card Bill",
      icon: <CreditCard className="h-7 w-7 text-primary" />,
      description: "Pay credit card bills for all major banks",
      path: "/recharge/credit-card"
    },
    {
      title: "All Services",
      icon: <Grid2x2 className="h-7 w-7 text-primary" />,
      description: "View all available recharge services in one place",
      path: "/recharge/all"
    }
  ];
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">Recharge & Bill Payments</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">Quick and secure payments for all your utility services in one place. Get instant confirmation and save time.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            icon={service.icon}
            path={service.path}
          />
        ))}
      </div>
      
      <div className="mt-12 mb-4">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Your recent recharge history will appear here</p>
      </div>
      
      <Card className="border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ReceiptIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-center">Your recent recharge transactions will appear here.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/recharge/mobile")}
              className="mt-2"
            >
              Make Your First Recharge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}