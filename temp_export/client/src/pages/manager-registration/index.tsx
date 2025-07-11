import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, LandPlot, ArrowRight } from "lucide-react";

export default function ManagerRegistrationPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Registration option cards - each represents a managerial role
  const registrationOptions = [
    {
      id: "branch_manager",
      title: "Branch Manager",
      description: "Apply to manage our services at the district level.",
      responsibilities: [
        "Manage all operations within a district",
        "Oversee multiple taluk managers",
        "Coordinate with head office on district-level initiatives",
        "Monitor service quality and customer satisfaction",
        "Implement strategic plans and expansion activities"
      ],
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      path: "/manager-registration/branch-manager",
      color: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100",
      buttonColor: "text-blue-600 border-blue-200 hover:bg-blue-50",
      countLabel: "Branch Managers",
      countValue: "38+",
      countDescription: "across Tamil Nadu"
    },
    {
      id: "taluk_manager",
      title: "Taluk Manager",
      description: "Apply to manage our services at the taluk level.",
      responsibilities: [
        "Oversee all operations within a taluk",
        "Manage multiple service agents in your area",
        "Ensure quality service delivery to customers",
        "Handle local partnerships and community relations",
        "Report to district branch manager"
      ],
      icon: <LandPlot className="h-8 w-8 text-green-600" />,
      path: "/manager-registration/taluk-manager",
      color: "bg-green-50 border-green-100",
      iconBg: "bg-green-100",
      buttonColor: "text-green-600 border-green-200 hover:bg-green-50",
      countLabel: "Taluk Managers",
      countValue: "261+",
      countDescription: "across Tamil Nadu"
    },
    {
      id: "service_agent",
      title: "Service Agent",
      description: "Apply to be the face of our services in your local area.",
      responsibilities: [
        "Provide direct services to customers in your area",
        "Handle recharge, booking, and payment services",
        "Serve as the local point of contact for our platform",
        "Build and maintain customer relationships",
        "Report to taluk manager"
      ],
      icon: <Users className="h-8 w-8 text-orange-600" />,
      path: "/manager-registration/service-agent",
      color: "bg-orange-50 border-orange-100",
      iconBg: "bg-orange-100",
      buttonColor: "text-orange-600 border-orange-200 hover:bg-orange-50",
      countLabel: "Service Agents",
      countValue: "517+",
      countDescription: "and growing"
    }
  ];

  return (
    <div className="container py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Managerial Team</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the role you're interested in applying for. Our platform provides opportunities 
            at different levels, from district management to local service delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrationOptions.map((option) => (
            <Card key={option.id} className={`shadow-md border-0 overflow-hidden transition-all hover:shadow-lg`}>
              <CardHeader className={`${option.color} border-b`}>
                <div className="flex items-center gap-4">
                  <div className={`${option.iconBg} p-3 rounded-md`}>
                    {option.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{option.title}</CardTitle>
                    <CardDescription className="text-sm">{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <div className="font-bold text-2xl text-gray-800">{option.countValue}</div>
                    <div className="text-sm text-gray-600">{option.countLabel} {option.countDescription}</div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities:</h4>
                    <ul className="space-y-2">
                      {option.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="rounded-full bg-gray-200 min-w-[18px] h-[18px] flex items-center justify-center text-xs mt-0.5">
                            {index + 1}
                          </div>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href={option.path} className="w-full">
                  <Button 
                    variant="outline" 
                    className={`w-full ${option.buttonColor} flex items-center justify-center gap-2`}
                  >
                    Apply as {option.title}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Already applied for a managerial position? Check your application status on the dashboard.
          </p>
          <Link href="/">
            <Button variant="outline" className="mx-auto">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}