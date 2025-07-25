import React from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const PrivacyPolicy = () => {
      const [, navigate] = useLocation();
  return (
        <div className="min-h-screen flex flex-col relative">
      {/* Simple Navigation Bar for Landing Page */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Nalamini</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</a>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Get Started
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                  }
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors py-2">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors py-2">Contact Us</a>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="border-primary text-primary hover:bg-primary hover:text-white w-full mt-2"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-white w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    <div className="bg-white container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Effective Date: <strong>25th July, 2025</strong>
      </p>

      <p className="mb-4">
        Welcome to <strong>Nalamini</strong>, an integrated platform offering essential services and support to communities,
        farmers, and local manufacturers. Your privacy is important to us. This Privacy Policy explains how we collect, use,
        and protect your information when you use our application or services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Personal Information:</strong> Your name, phone number, email address, and location (when needed for bookings or deliveries).</li>
        <li><strong>Usage Data:</strong> Information about how you interact with the app and services.</li>
        <li><strong>Transaction Data:</strong> Recharge details, bill payments, bookings, and purchase history.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and improve our services (e.g., bill payments, bookings).</li>
        <li>To communicate important updates or changes.</li>
        <li>To support and promote local farmers and manufacturers.</li>
        <li>To ensure secure transactions and a smooth user experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We do <strong>not</strong> sell your personal information. However, we may share your data with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Service Providers:</strong> For payment processing, booking, or support services.</li>
        <li><strong>Local Sellers & Transport Partners:</strong> To deliver products or services efficiently.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement reasonable security practices to protect your personal information from unauthorized access, misuse, or loss.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Access or update your personal data.</li>
        <li>Request deletion of your data (if applicable).</li>
        <li>Opt-out of promotional communication.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-4">
        If you have questions or concerns about this Privacy Policy, you can contact us at:
      </p>
      <p className="mb-2">📧 <a href="mailto:support@nalamini.com" className="text-blue-600 underline">support@nalamini.com</a></p>
      <p>📞 +91 90619 12596</p>
    </div>
    {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Nalamini Service Platform</h3>
              <p className="text-gray-400 mb-4">
                Tamil Nadu's comprehensive digital ecosystem for essential services.
              </p>
              <div className="flex gap-3">
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Farmer's Market</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manufacturers Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transport Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Taxi Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rental Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recharge & Utilities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recycling Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/auth" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/auth"); }}>Get Started</a></li>
                <li><a href="/opportunities" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/opportunities"); }}>Careers</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); navigate("/privacy-policy"); }}>Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Coimbatore, Tamil Nadu</li>
                <li>support@nalamini.com</li>
                <li>admin@nalamini.com</li>
                <li>+91 9513430615</li>
              </ul>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Serving all 38 districts of Tamil Nadu
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Nalamini Service Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
