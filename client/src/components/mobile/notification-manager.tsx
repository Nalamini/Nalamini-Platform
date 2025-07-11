import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useCapacitor } from '@/hooks/use-capacitor';

interface NotificationManagerProps {
  userId?: number;
  serviceType?: string;
}

export default function NotificationManager({ userId, serviceType }: NotificationManagerProps) {
  const [notificationStatus, setNotificationStatus] = useState<'enabled' | 'disabled' | 'checking'>('checking');
  const { isNativeApp, permissions, scheduleNotification, vibrate } = useCapacitor();

  useEffect(() => {
    checkNotificationStatus();
  }, [permissions.notifications]);

  const checkNotificationStatus = () => {
    if (isNativeApp) {
      setNotificationStatus(permissions.notifications ? 'enabled' : 'disabled');
    } else {
      // Web notifications
      if ('Notification' in window) {
        setNotificationStatus(Notification.permission === 'granted' ? 'enabled' : 'disabled');
      } else {
        setNotificationStatus('disabled');
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!isNativeApp && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission === 'granted' ? 'enabled' : 'disabled');
    }
  };

  const testNotification = async () => {
    try {
      await vibrate('light');
      
      if (isNativeApp) {
        await scheduleNotification(
          'Test Notification',
          'Nalamini notifications are working perfectly!',
          1000 // 1 second delay
        );
      } else if (notificationStatus === 'enabled') {
        new Notification('Test Notification', {
          body: 'Nalamini notifications are working perfectly!',
          icon: '/android-chrome-192x192.png'
        });
      }
      
      await vibrate('medium');
    } catch (error) {
      console.error('Notification test failed:', error);
    }
  };

  // Service-specific notification examples
  const serviceNotifications = {
    taxi: {
      title: 'Taxi Booking Confirmed',
      body: 'Your driver will arrive in 5 minutes'
    },
    delivery: {
      title: 'Package Out for Delivery',
      body: 'Your order is on the way'
    },
    recharge: {
      title: 'Recharge Successful',
      body: 'Your mobile recharge has been completed'
    },
    rental: {
      title: 'Rental Approved',
      body: 'Your equipment rental request has been approved'
    }
  };

  const sendServiceNotification = async (type: keyof typeof serviceNotifications) => {
    const notification = serviceNotifications[type];
    try {
      await scheduleNotification(notification.title, notification.body);
      await vibrate('medium');
    } catch (error) {
      console.error('Service notification failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {notificationStatus === 'enabled' ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <span>Notifications</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 p-3 rounded-lg border">
          {notificationStatus === 'enabled' ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Notifications Enabled</p>
                <p className="text-sm text-green-600">You'll receive service updates</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Notifications Disabled</p>
                <p className="text-sm text-orange-600">Enable to get service updates</p>
              </div>
            </>
          )}
        </div>

        {notificationStatus === 'disabled' && (
          <Button
            onClick={requestNotificationPermission}
            className="w-full"
          >
            Enable Notifications
          </Button>
        )}

        {notificationStatus === 'enabled' && (
          <div className="space-y-2">
            <Button
              onClick={testNotification}
              variant="outline"
              className="w-full"
            >
              Test Notification
            </Button>
            
            {serviceType && serviceType in serviceNotifications && (
              <Button
                onClick={() => sendServiceNotification(serviceType as keyof typeof serviceNotifications)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Test {serviceType} Notification
              </Button>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Taxi booking confirmations</p>
          <p>• Delivery status updates</p>
          <p>• Payment confirmations</p>
          <p>• Service request updates</p>
        </div>
      </CardContent>
    </Card>
  );
}