import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, Share2, Presentation } from "lucide-react";

export default function ServicesOverview() {
  const downloadSVG = () => {
    const link = document.createElement('a');
    link.href = '/nalamini-professional-overview.svg';
    link.download = 'nalamini-services-overview.svg';
    link.click();
  };

  const openFullscreen = () => {
    window.open('/nalamini-professional-overview.svg', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Nalamini Services Overview
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Professional presentation-ready thumbnail for YouTube and marketing materials
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={downloadSVG} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download SVG
              </Button>
              <Button onClick={openFullscreen} variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Fullscreen
              </Button>
            </div>
          </div>

          {/* Preview Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="h-5 w-5" />
                Professional Services Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="/nalamini-professional-overview.svg" 
                  alt="Nalamini Services Overview" 
                  className="w-full h-auto"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Presentation className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Presentation Ready</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Professional design suitable for business presentations and investor meetings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold">YouTube Optimized</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Perfect 1280x720 dimensions for YouTube thumbnails and video covers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">High Quality</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Vector-based SVG format ensures crisp quality at any size
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Service Details */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Services Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>Taxi:</strong> Transportation Services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span><strong>Transport Services:</strong> Products/Packages across Tamil Nadu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span><strong>Rental Services:</strong> Power tools, Construction and Medical Equipments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>Manufactures Hub:</strong> Distribute Products across Tamil Nadu</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span><strong>Online Farmer's Market:</strong> Farm fresh Grocery to doorstep</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span><strong>Recharge, utilities, bookings:</strong> Mobile, DTH & Services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span><strong>Recycling:</strong> Waste Management & Recycling</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}