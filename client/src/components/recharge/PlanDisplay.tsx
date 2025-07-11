import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Common interface for plans
interface Plan {
  id: number;
  category: string;
  amount: number;
  validity: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
}

interface PlansResponse {
  provider: string;
  categories: {
    data: Category[];
  };
  plans: Plan[];
  message?: string;
}

interface PlanDisplayProps {
  plansData: PlansResponse | undefined;
  serviceType: string;
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan | null) => void;
  setViewMode: (mode: 'form' | 'plans') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function PlanDisplay({
  plansData,
  serviceType,
  selectedPlan,
  setSelectedPlan,
  setViewMode,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}: PlanDisplayProps) {
  // Filter plans based on category and search term
  const filteredPlans = plansData?.plans?.filter(plan => {
    const matchesCategory = !selectedCategory || plan.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.amount.toString().includes(searchTerm);
    return matchesCategory && matchesSearch;
  }) || [];

  // Different UI components based on service type
  const CategoryFilter = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedCategory(null)}
        className="text-xs h-8"
      >
        {serviceType === 'electricity' ? 'All Categories' : 
         serviceType === 'dth' ? 'All Packs' : 'All Plans'}
      </Button>
      {plansData?.categories?.data?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(category.id)}
          className="text-xs h-8"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );

  // Mobile plan card
  const MobilePlanCard = ({ plan }: { plan: Plan }) => (
    <Card 
      key={plan.id}
      className={cn(
        "cursor-pointer hover:border-primary transition-colors",
        selectedPlan?.id === plan.id && "border-primary bg-primary/5"
      )}
      onClick={() => setSelectedPlan(plan)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">₹{plan.amount}</p>
            <p className="text-sm text-muted-foreground">Validity: {plan.validity}</p>
            <p className="text-xs mt-1">{plan.description}</p>
          </div>
          <Button
            variant={selectedPlan?.id === plan.id ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlan(plan);
              setViewMode('form');
            }}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // DTH plan card with category badge
  const DTHPlanCard = ({ plan }: { plan: Plan }) => (
    <Card 
      key={plan.id}
      className={cn(
        "cursor-pointer hover:border-primary transition-colors",
        selectedPlan?.id === plan.id && "border-primary bg-primary/5"
      )}
      onClick={() => setSelectedPlan(plan)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">₹{plan.amount}</p>
              <Badge variant="outline">{plan.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Validity: {plan.validity}</p>
            <p className="text-xs mt-1">{plan.description}</p>
          </div>
          <Button
            variant={selectedPlan?.id === plan.id ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlan(plan);
              setViewMode('form');
            }}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Electricity plan card with colored badge
  const ElectricityPlanCard = ({ plan }: { plan: Plan }) => (
    <Card 
      key={plan.id}
      className={cn(
        "cursor-pointer hover:border-primary transition-colors",
        selectedPlan?.id === plan.id && "border-primary bg-primary/5"
      )}
      onClick={() => setSelectedPlan(plan)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">₹{plan.amount}</p>
              <Badge>{plan.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Billing Cycle: {plan.validity}</p>
            <p className="text-xs mt-1">{plan.description}</p>
          </div>
          <Button
            variant={selectedPlan?.id === plan.id ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlan(plan);
              setViewMode('form');
            }}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Render plan card based on service type
  const renderPlanCard = (plan: Plan) => {
    switch (serviceType) {
      case 'dth':
        return <DTHPlanCard plan={plan} />;
      case 'electricity':
        return <ElectricityPlanCard plan={plan} />;
      case 'mobile':
      default:
        return <MobilePlanCard plan={plan} />;
    }
  };

  // Placeholder text based on service type
  const getEmptyText = () => {
    switch (serviceType) {
      case 'dth':
        return 'No DTH plans available for this operator.';
      case 'electricity':
        return 'No tariffs available for this electricity board.';
      case 'mobile':
      default:
        return 'No plans available for this operator.';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2 pb-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${serviceType === 'electricity' ? 'tariffs' : 'plans'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {plansData?.categories?.data && <CategoryFilter />}
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-8">
          <p>No {serviceType === 'electricity' ? 'tariffs' : 'plans'} found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPlans.map((plan) => (
            <div key={plan.id}>{renderPlanCard(plan)}</div>
          ))}
        </div>
      )}
      
      {selectedPlan && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              setViewMode('form');
            }}
          >
            Continue with ₹{selectedPlan.amount} {serviceType === 'electricity' ? 'tariff' : 'plan'}
          </Button>
        </div>
      )}
    </div>
  );
}