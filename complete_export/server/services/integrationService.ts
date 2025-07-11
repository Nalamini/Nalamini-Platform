import { storage } from '../storage';
import { notificationService } from './notificationService';
import { commissionService } from './commissionService';
import { Recharge, Booking, Rental, TaxiRide, Delivery } from '@shared/schema';

/**
 * Integration Service
 * 
 * This service handles integration of notifications and other post-processing
 * for various transaction types.
 */
export class IntegrationService {
  /**
   * Handle post-processing for a recharge
   */
  public async processRecharge(recharge: Recharge): Promise<void> {
    try {
      // Send notifications
      await notificationService.notifyRecharge(recharge);
      
      // Process commissions if recharge is completed
      if (recharge.status === 'completed' && recharge.processedBy) {
        const result = await commissionService.processRechargeCommissions(recharge.id);
        
        if (result && result.commissions) {
          // Send commission notifications to each recipient
          for (const commission of result.commissions) {
            await notificationService.notifyCommission(
              commission.userId,
              recharge.id,
              recharge.amount,
              commission.amount,
              'recharge'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in recharge integration:', error);
    }
  }

  /**
   * Handle post-processing for a booking
   */
  public async processBooking(booking: Booking): Promise<void> {
    try {
      // Send notifications
      await notificationService.notifyBooking(booking);
      
      // Process commissions if booking is completed
      if (booking.status === 'completed' && booking.processedBy) {
        const result = await commissionService.processBookingCommissions(booking.id);
        
        if (result && result.commissions) {
          // Send commission notifications to each recipient
          for (const commission of result.commissions) {
            await notificationService.notifyCommission(
              commission.userId,
              booking.id,
              booking.amount,
              commission.amount,
              'booking'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in booking integration:', error);
    }
  }

  /**
   * Handle post-processing for a rental
   */
  public async processRental(rental: Rental): Promise<void> {
    try {
      // Send notifications
      await notificationService.notifyRental(rental);
      
      // Process commissions if rental is completed
      if (rental.status === 'completed' && rental.processedBy) {
        const result = await commissionService.processRentalCommissions(rental.id);
        
        if (result && result.commissions) {
          // Send commission notifications to each recipient
          for (const commission of result.commissions) {
            await notificationService.notifyCommission(
              commission.userId,
              rental.id,
              rental.amount,
              commission.amount,
              'rental'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in rental integration:', error);
    }
  }

  /**
   * Handle post-processing for a taxi ride
   */
  public async processTaxiRide(taxiRide: TaxiRide): Promise<void> {
    try {
      // Send notifications
      await notificationService.notifyTaxiRide(taxiRide);
      
      // Process commissions if taxi ride is completed
      if (taxiRide.status === 'completed' && taxiRide.processedBy) {
        const result = await commissionService.processTaxiRideCommissions(taxiRide.id);
        
        if (result && result.commissions) {
          // Send commission notifications to each recipient
          for (const commission of result.commissions) {
            await notificationService.notifyCommission(
              commission.userId,
              taxiRide.id,
              taxiRide.amount,
              commission.amount,
              'taxi'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in taxi ride integration:', error);
    }
  }

  /**
   * Handle post-processing for a delivery
   */
  public async processDelivery(delivery: Delivery): Promise<void> {
    try {
      // Send notifications
      await notificationService.notifyDelivery(delivery);
      
      // Process commissions if delivery is completed
      if (delivery.status === 'completed' && delivery.processedBy) {
        const result = await commissionService.processDeliveryCommissions(delivery.id);
        
        if (result && result.commissions) {
          // Send commission notifications to each recipient
          for (const commission of result.commissions) {
            await notificationService.notifyCommission(
              commission.userId,
              delivery.id,
              delivery.amount,
              commission.amount,
              'delivery'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in delivery integration:', error);
    }
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();