import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              TN Services Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              A comprehensive platform offering integrated solutions across Tamil Nadu
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started as Customer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth?registerAs=provider")}
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Register as Service Provider
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth?registerAs=manager")}
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Register as Managerial Associate
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="bg-white/20 border-white text-white hover:bg-white/30"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                    <circle cx="5" cy="19" r="2"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile Recharges & Utilities</h3>
                <p className="text-gray-600">
                  Quick and easy payment for mobile recharges and various utility bills including electricity, water, and gas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M13.5 1.515a3.5 3.5 0 0 0-3 0L4.929 4.464A3.5 3.5 0 0 0 3.5 7.5v9a3.5 3.5 0 0 0 1.429 3.036l5.571 2.949a3.5 3.5 0 0 0 3 0l5.571-2.949A3.5 3.5 0 0 0 20.5 16.5v-9a3.5 3.5 0 0 0-1.429-3.036L13.5 1.515z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Travel Bookings</h3>
                <p className="text-gray-600">
                  Hassle-free bookings for buses, trains, flights, and hotels with competitive prices and instant confirmations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path>
                    <path d="M17.64 15 22 10.64"></path>
                    <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Farm Fresh Products</h3>
                <p className="text-gray-600">
                  Direct farm-to-consumer grocery products sourced from local farmers for freshness and quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Service Provider section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/5 p-8 rounded-xl border border-primary/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Become a Service Provider</h2>
                  <p className="text-gray-600 mb-6">
                    Join our platform as a service provider and reach thousands of customers across Tamil Nadu. 
                    We offer a simple registration process, easy payment collection, and comprehensive business tools.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Farmers</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Manufacturers</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Travel Agents</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Taxi Providers</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Rental Services</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Recycling Agents</div>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => navigate("/auth?registerAs=provider")}
                  >
                    Register Now
                  </Button>
                </div>
                <div className="flex-shrink-0 hidden md:block">
                  <div className="bg-primary/10 w-40 h-40 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                      <path d="M13 5v2"></path>
                      <path d="M13 17v2"></path>
                      <path d="M13 11v2"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Managerial Associate section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="bg-blue-100 w-40 h-40 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Join Our Management Team</h2>
                  <p className="text-gray-600 mb-6">
                    Become part of our managerial structure and help expand our services across Tamil Nadu. We're seeking dedicated individuals to join as Branch Managers, Taluk Managers, and Service Agents.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Branch Managers</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Taluk Managers</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Service Agents</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Pincode Area Coverage</div>
                    <div className="bg-white px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm">Earn Commissions</div>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/auth?registerAs=manager")}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TN Services Platform</h3>
              <p className="text-gray-400">
                A comprehensive platform that connects service providers with customers across Tamil Nadu.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mobile Recharges</li>
                <li>Utility Bill Payments</li>
                <li>Travel Bookings</li>
                <li>Grocery Shopping</li>
                <li>Equipment Rental</li>
                <li>Taxi Services</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Registration</li>
                <li>Provider Dashboard</li>
                <li>Payment Collection</li>
                <li>Business Analytics</li>
                <li>Marketing Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@tnservices.com</li>
                <li>+91 1234567890</li>
                <li>Chennai, Tamil Nadu</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TN Services Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}