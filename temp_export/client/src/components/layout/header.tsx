import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Bell, 
  MessageSquare, 
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [notifications, setNotifications] = useState(5);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm fixed top-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-neutral-600 hover:text-neutral-900 focus:outline-none mr-2"
              aria-label="Open sidebar"
              onClick={() => {
                // Toggle sidebar here (using context or global state)
                const sidebar = document.querySelector('aside');
                if (sidebar) {
                  sidebar.classList.toggle('hidden');
                }
              }}
            >
              <Menu />
            </Button>
            
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  TN
                </div>
                <h1 className="ml-2 font-bold text-xl text-primary">TN Services</h1>
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-neutral-600 hover:text-neutral-900" aria-label="Notifications">
                <Bell />
                {notifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-900" aria-label="Messages">
                <MessageSquare />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-neutral-700">
                      {user?.fullName || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative text-neutral-600 hover:text-neutral-900" aria-label="Notifications">
                <Bell />
                {notifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <div className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
