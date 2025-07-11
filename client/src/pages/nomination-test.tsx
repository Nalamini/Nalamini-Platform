import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function NominationTest() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Nomination Test Page</h1>
        
        {/* Simple Test Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => {
              console.log("Simple button clicked");
              alert("Simple button works!");
            }}
            className="mr-4"
          >
            Test Simple Button
          </Button>
          
          <Button 
            onClick={() => {
              console.log("State button clicked, current state:", isOpen);
              setIsOpen(true);
            }}
            className="mr-4"
          >
            Test State Button
          </Button>
        </div>

        {/* Dialog Test */}
        <div className="text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => {
                  console.log("Dialog trigger clicked");
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Open Nomination Dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Test Nomination Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    console.log("Form submitted");
                    alert("Form would be submitted here");
                    setIsOpen(false);
                  }}>
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>State: {isOpen ? "Dialog Open" : "Dialog Closed"}</p>
          <p>Check browser console for click events</p>
        </div>
      </div>
    </div>
  );
}