import { User, Recharge, Booking, Rental, TaxiRide, Delivery } from '@shared/schema';
import { whatsappService, WhatsAppRecipient } from './whatsappService';
import { storage } from '../storage';

/**
 * Notification Service
 * 
 * Central service to handle all notifications across different channels
 * Currently supports WhatsApp, but can be extended to support SMS, email, etc.
 */
export class NotificationService {
  /**
   * Format date and time for notifications
   */
  private formatDateTime(date: Date): string {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get recipient details from user
   */
  private getRecipientFromUser(user: User): WhatsAppRecipient {
    return {
      phoneNumber: user.phone || '',
      name: user.username
    };
  }

  /**
   * Get hierarchy for a user's transaction
   * Returns the service agent, taluk manager, branch manager, and admin
   */
  private async getUserHierarchy(userId: number, pincode: string): Promise<User[]> {
    try {
      // Get the user's service agent, taluk manager, branch manager, and admin
      const serviceAgent = await storage.getServiceAgentByPincode(pincode);
      
      if (!serviceAgent) {
        console.warn(`No service agent found for pincode ${pincode}`);
        return [];
      }
      
      const talukManager = await storage.getTalukManagerByTaluk(serviceAgent.taluk);
      
      if (!talukManager) {
        console.warn(`No taluk manager found for taluk ${serviceAgent.taluk}`);
        return [serviceAgent];
      }
      
      const branchManager = await storage.getBranchManagerByDistrict(talukManager.district);
      
      if (!branchManager) {
        console.warn(`No branch manager found for district ${talukManager.district}`);
        return [serviceAgent, talukManager];
      }
      
      const admin = await storage.getAdminUser();
      
      if (!admin) {
        console.warn('No admin user found');
        return [serviceAgent, talukManager, branchManager];
      }
      
      return [serviceAgent, talukManager, branchManager, admin];
    } catch (error) {
      console.error('Error getting user hierarchy:', error);
      return [];
    }
  }

  /**
   * Notify about a new recharge
   */
  public async notifyRecharge(recharge: Recharge): Promise<void> {
    try {
      // Get the user who made the recharge
      const user = await storage.getUser(recharge.userId);
      
      if (!user) {
        console.warn(`No user found with ID ${recharge.userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date(recharge.createdAt));
      
      // Notify the user about their recharge
      if (user.phone) {
        await whatsappService.sendRechargeNotification(
          this.getRecipientFromUser(user),
          recharge.mobileNumber,
          recharge.amount,
          recharge.provider || 'Unknown',
          recharge.status,
          dateTime
        );
      }

      // Notify the user's hierarchy
      if (user.pincode) {
        const hierarchy = await this.getUserHierarchy(user.id, user.pincode);
        
        for (const manager of hierarchy) {
          if (manager.phone) {
            await whatsappService.sendRechargeNotification(
              this.getRecipientFromUser(manager),
              recharge.mobileNumber,
              recharge.amount,
              recharge.provider || 'Unknown',
              recharge.status,
              dateTime
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending recharge notifications:', error);
    }
  }

  /**
   * Notify about a new booking
   */
  public async notifyBooking(booking: Booking): Promise<void> {
    try {
      // Get the user who made the booking
      const user = await storage.getUser(booking.userId);
      
      if (!user) {
        console.warn(`No user found with ID ${booking.userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date(booking.createdAt));
      
      // Notify the user about their booking
      if (user.phone) {
        await whatsappService.sendBookingNotification(
          this.getRecipientFromUser(user),
          booking.id,
          booking.bookingType,
          booking.amount,
          booking.status,
          dateTime
        );
      }

      // Notify the user's hierarchy
      if (user.pincode) {
        const hierarchy = await this.getUserHierarchy(user.id, user.pincode);
        
        for (const manager of hierarchy) {
          if (manager.phone) {
            await whatsappService.sendBookingNotification(
              this.getRecipientFromUser(manager),
              booking.id,
              booking.bookingType,
              booking.amount,
              booking.status,
              dateTime
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending booking notifications:', error);
    }
  }

  /**
   * Notify about a new commission
   */
  public async notifyCommission(
    userId: number,
    transactionId: number,
    transactionAmount: number,
    commissionAmount: number,
    commissionType: string
  ): Promise<void> {
    try {
      // Get the user who earned the commission
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.warn(`No user found with ID ${userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date());
      
      // Notify the user about their commission
      if (user.phone) {
        await whatsappService.sendCommissionNotification(
          this.getRecipientFromUser(user),
          transactionId,
          transactionAmount,
          commissionAmount,
          dateTime
        );
      }
    } catch (error) {
      console.error('Error sending commission notifications:', error);
    }
  }

  /**
   * Notify about a rental transaction
   */
  public async notifyRental(rental: Rental): Promise<void> {
    try {
      // Get the user who made the rental
      const user = await storage.getUser(rental.userId);
      
      if (!user) {
        console.warn(`No user found with ID ${rental.userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date(rental.createdAt));
      
      // Notify the user about their rental
      if (user.phone) {
        await whatsappService.sendTransactionNotification(
          this.getRecipientFromUser(user),
          rental.id,
          rental.amount,
          `Rental: ${rental.itemName}`,
          rental.status,
          dateTime
        );
      }

      // Notify the user's hierarchy
      if (user.pincode) {
        const hierarchy = await this.getUserHierarchy(user.id, user.pincode);
        
        for (const manager of hierarchy) {
          if (manager.phone) {
            await whatsappService.sendTransactionNotification(
              this.getRecipientFromUser(manager),
              rental.id,
              rental.amount,
              `Rental: ${rental.itemName}`,
              rental.status,
              dateTime
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending rental notifications:', error);
    }
  }

  /**
   * Notify about a taxi ride
   */
  public async notifyTaxiRide(taxiRide: TaxiRide): Promise<void> {
    try {
      // Get the user who booked the taxi
      const user = await storage.getUser(taxiRide.userId);
      
      if (!user) {
        console.warn(`No user found with ID ${taxiRide.userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date(taxiRide.createdAt));
      
      // Notify the user about their taxi ride
      if (user.phone) {
        await whatsappService.sendTransactionNotification(
          this.getRecipientFromUser(user),
          taxiRide.id,
          taxiRide.amount,
          `Taxi: ${taxiRide.sourceLocation} to ${taxiRide.destinationLocation}`,
          taxiRide.status,
          dateTime
        );
      }

      // Notify the user's hierarchy
      if (user.pincode) {
        const hierarchy = await this.getUserHierarchy(user.id, user.pincode);
        
        for (const manager of hierarchy) {
          if (manager.phone) {
            await whatsappService.sendTransactionNotification(
              this.getRecipientFromUser(manager),
              taxiRide.id,
              taxiRide.amount,
              `Taxi: ${taxiRide.sourceLocation} to ${taxiRide.destinationLocation}`,
              taxiRide.status,
              dateTime
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending taxi ride notifications:', error);
    }
  }

  /**
   * Notify about a delivery
   */
  public async notifyDelivery(delivery: Delivery): Promise<void> {
    try {
      // Get the user who requested the delivery
      const user = await storage.getUser(delivery.userId);
      
      if (!user) {
        console.warn(`No user found with ID ${delivery.userId}`);
        return;
      }
      
      const dateTime = this.formatDateTime(new Date(delivery.createdAt));
      
      // Notify the user about their delivery
      if (user.phone) {
        await whatsappService.sendTransactionNotification(
          this.getRecipientFromUser(user),
          delivery.id,
          delivery.amount,
          `Delivery: ${delivery.sourceLocation} to ${delivery.destinationLocation}`,
          delivery.status,
          dateTime
        );
      }

      // Notify the user's hierarchy
      if (user.pincode) {
        const hierarchy = await this.getUserHierarchy(user.id, user.pincode);
        
        for (const manager of hierarchy) {
          if (manager.phone) {
            await whatsappService.sendTransactionNotification(
              this.getRecipientFromUser(manager),
              delivery.id,
              delivery.amount,
              `Delivery: ${delivery.sourceLocation} to ${delivery.destinationLocation}`,
              delivery.status,
              dateTime
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending delivery notifications:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();