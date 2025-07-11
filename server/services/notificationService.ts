import { storage } from "../storage";
import { Notification, InsertNotification, Recharge, Booking, Rental, TaxiRide, Delivery } from "@shared/schema";
import { WebSocketServer, WebSocket } from "ws";
import type { Server as HttpServer } from "http";

// Map to keep track of active WebSocket connections
const activeConnections: Map<number, WebSocket[]> = new Map();

// Initialize the WebSocket server and configure event handlers
export function initializeNotificationService(httpServer: HttpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/notifications' });
  
  wss.on('connection', (ws, req) => {
    // Authentication should be done using the session ID from cookies
    // This is a simplified implementation for now
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      ws.close(1008, 'Authentication required');
      return;
    }
    
    // Store the connection
    if (!activeConnections.has(userId)) {
      activeConnections.set(userId, []);
    }
    activeConnections.get(userId)?.push(ws);
    
    // Handle client disconnection
    ws.on('close', () => {
      const connections = activeConnections.get(userId) || [];
      const index = connections.indexOf(ws);
      if (index !== -1) {
        connections.splice(index, 1);
        if (connections.length === 0) {
          activeConnections.delete(userId);
        }
      }
    });
    
    // Send any unread notifications to the user
    sendUnreadNotifications(userId);
  });
  
  return wss;
}

// Extract user ID from the request
// In a real implementation, this would use the session cookie
function extractUserIdFromRequest(req: any): number | null {
  // For demo purposes - in production, validate the session token from cookies
  const userId = req.url.split('?userId=')[1];
  return userId ? parseInt(userId, 10) : null;
}

// Create a notification and send it in real-time if the user is connected
export async function createAndSendNotification(notification: InsertNotification): Promise<Notification> {
  const createdNotification = await storage.createNotification(notification);
  
  // Send the notification if the user is connected
  sendNotificationToUser(notification.userId, createdNotification);
  
  return createdNotification;
}

// Send a notification to all active connections for a user
function sendNotificationToUser(userId: number, notification: Notification) {
  const connections = activeConnections.get(userId) || [];
  const payload = JSON.stringify({
    type: 'notification',
    data: notification
  });
  
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

// Send all unread notifications to a user
async function sendUnreadNotifications(userId: number) {
  const notifications = await storage.getNotificationsByUserId(userId, 50, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  if (unreadNotifications.length === 0) return;
  
  const connections = activeConnections.get(userId) || [];
  const payload = JSON.stringify({
    type: 'unread_notifications',
    data: unreadNotifications
  });
  
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

// Helper to create system notifications for specific events
export async function sendSystemNotification(userId: number, title: string, content: string, actionUrl?: string): Promise<Notification> {
  return await createAndSendNotification({
    userId,
    title,
    content, 
    type: 'system_announcement',
    actionUrl,
    relatedEntityType: null,
    relatedEntityId: null,
    expiresAt: null
  });
}

// Helper to create transaction notifications
export async function sendTransactionNotification(
  userId: number, 
  title: string, 
  content: string, 
  transactionId: number
): Promise<Notification> {
  return await createAndSendNotification({
    userId,
    title,
    content,
    type: 'transaction',
    actionUrl: `/transactions/${transactionId}`,
    relatedEntityType: 'transaction',
    relatedEntityId: transactionId,
    expiresAt: null
  });
}

// Helper to create service update notifications
export async function sendServiceUpdateNotification(
  userId: number,
  title: string,
  content: string,
  serviceType: string,
  serviceId: number
): Promise<Notification> {
  return await createAndSendNotification({
    userId,
    title,
    content,
    type: 'service_update',
    actionUrl: `/${serviceType.toLowerCase()}/${serviceId}`,
    relatedEntityType: serviceType,
    relatedEntityId: serviceId,
    expiresAt: null
  });
}

// Notification methods for specific service types
export async function notifyRecharge(recharge: Recharge): Promise<Notification> {
  const title = `Recharge ${recharge.status}`;
  const content = `Your ${recharge.provider} recharge of ₹${recharge.amount} for ${recharge.mobileNumber} is ${recharge.status}.`;
  return await sendServiceUpdateNotification(
    recharge.userId,
    title,
    content,
    'recharge',
    recharge.id
  );
}

export async function notifyBooking(booking: Booking): Promise<Notification> {
  const title = `Booking ${booking.status}`;
  const content = `Your booking from ${booking.origin} to ${booking.destination} has been ${booking.status}.`;
  return await sendServiceUpdateNotification(
    booking.userId,
    title,
    content,
    'booking',
    booking.id
  );
}

export async function notifyRental(rental: Rental): Promise<Notification> {
  const title = `Rental ${rental.status}`;
  const content = `Your rental of ${rental.itemName} from ${rental.startDate} to ${rental.endDate} has been ${rental.status}.`;
  return await sendServiceUpdateNotification(
    rental.userId,
    title,
    content,
    'rental',
    rental.id
  );
}

export async function notifyTaxiRide(taxiRide: TaxiRide): Promise<Notification> {
  const title = `Taxi Ride ${taxiRide.status}`;
  const content = `Your taxi ride from ${taxiRide.pickup} to ${taxiRide.dropoff} is ${taxiRide.status}.`;
  return await sendServiceUpdateNotification(
    taxiRide.userId,
    title,
    content,
    'taxi',
    taxiRide.id
  );
}

export async function notifyDelivery(delivery: Delivery): Promise<Notification> {
  const title = `Delivery ${delivery.status}`;
  const content = `Your delivery from ${delivery.pickupAddress} to ${delivery.deliveryAddress} is ${delivery.status}.`;
  return await sendServiceUpdateNotification(
    delivery.userId,
    title,
    content,
    'delivery',
    delivery.id
  );
}

export async function notifyCommission(
  userId: number,
  transactionId: number,
  transactionAmount: number,
  commissionAmount: number,
  transactionType: string
): Promise<Notification> {
  const title = `Commission Earned`;
  const content = `You earned ₹${commissionAmount} commission for a ${transactionType} transaction of ₹${transactionAmount}.`;
  return await sendTransactionNotification(
    userId,
    title,
    content,
    transactionId
  );
}

// Export the NotificationService as a singleton
export const notificationService = {
  initializeNotificationService,
  createAndSendNotification,
  sendSystemNotification,
  sendTransactionNotification,
  sendServiceUpdateNotification,
  notifyRecharge,
  notifyBooking,
  notifyRental,
  notifyTaxiRide,
  notifyDelivery,
  notifyCommission
};