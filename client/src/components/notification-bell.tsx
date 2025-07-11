import { useState, useEffect } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { Notification } from "@shared/schema";

export function NotificationBell() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [wsConnected, setWsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      if (!user) return [];
      const res = await apiRequest("GET", "/api/notifications?limit=20");
      return await res.json();
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute as fallback
  });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    queryFn: async () => {
      if (!user) return { count: 0 };
      const res = await apiRequest("GET", "/api/notifications/unread-count");
      return await res.json();
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  const unreadCount = unreadData?.count || 0;

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/notifications/mark-read/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to mark notification as read: ${error.message}`,
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/notifications/mark-all-read");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to mark all notifications as read: ${error.message}`,
      });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/notifications/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete notification: ${error.message}`,
      });
    },
  });

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/notifications?userId=${user.id}`;
    
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setWsConnected(true);
    };
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "notification") {
        // Single new notification
        queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
        
        // Show toast for new notification
        toast({
          title: data.data.title,
          description: data.data.content,
        });
      } else if (data.type === "unread_notifications") {
        // Batch of unread notifications
        queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
        queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      }
    };
    
    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setWsConnected(false);
    };
    
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [user, queryClient, toast]);

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    
    // Navigate to the action URL if present
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {wsConnected ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification: Notification) => (
              <div 
                key={notification.id}
                className={`p-3 hover:bg-accent cursor-pointer ${!notification.isRead ? 'bg-accent/30' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReadMutation.mutate(notification.id);
                        }}
                        className="text-xs text-primary/70 hover:text-primary"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotificationMutation.mutate(notification.id);
                      }}
                      className="text-xs text-destructive/70 hover:text-destructive"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.content}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {notification.createdAt && format(new Date(notification.createdAt), 'MMM d, yyyy • HH:mm')}
                </div>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}