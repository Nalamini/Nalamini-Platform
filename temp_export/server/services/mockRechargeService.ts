import { storage } from '../storage';
import { InsertCommissionConfig, InsertRecharge } from '@shared/schema';

/**
 * Default commission rates for different roles
 */
const COMMISSION_RATES = {
  admin: 0.5,              // 0.5%
  branch_manager: 0.5,     // 0.5%
  taluk_manager: 1.0,      // 1.0%
  service_agent: 3.0,      // 3.0%
  registered_user: 1.0,    // 1.0%
};

/**
 * Service for testing the commission distribution system with mock recharges
 */
export class MockRechargeService {
  /**
   * Process a mock recharge and distribute commissions
   * 
   * @param userId User ID of the customer
   * @param mobileNumber Mobile number to recharge
   * @param amount Recharge amount
   * @param provider Provider (e.g., 'Airtel', 'Jio', etc.)
   * @returns The recharge details
   */
  async processMockRecharge(
    userId: number,
    mobileNumber: string,
    amount: number,
    provider: string
  ) {
    // 1. Create a recharge in the database
    const recharge = await this.createRecharge(userId, mobileNumber, amount, provider);
    
    // 2. Ensure commission config exists
    await this.ensureCommissionConfig();
    
    // 3. Find the service agent for this user's pincode
    const user = await storage.getUser(userId);
    if (!user || !user.pincode) {
      throw new Error('User not found or pincode not set');
    }
    
    const serviceAgent = await storage.getUserByPincodeAndType(user.pincode, 'service_agent');
    if (!serviceAgent) {
      throw new Error(`No service agent found for pincode ${user.pincode}`);
    }
    
    // 4. Update the recharge record with the service agent
    await storage.updateRecharge(recharge.id, {
      processedBy: serviceAgent.id,
      status: 'completed',
      completedAt: new Date(),
    });
    
    // 5. Calculate and distribute commissions
    try {
      await storage.calculateCommissions('recharge', recharge.id, amount, provider);
      
      return {
        ...recharge,
        processedBy: serviceAgent.id,
        status: 'completed',
        completedAt: new Date(),
      };
    } catch (error) {
      console.error('Error distributing commissions:', error);
      throw error;
    }
  }
  
  /**
   * Create a recharge record
   */
  private async createRecharge(
    userId: number,
    mobileNumber: string,
    amount: number,
    provider: string
  ) {
    const rechargeData: InsertRecharge = {
      userId,
      mobileNumber,
      amount,
      provider,
      status: 'pending',
      serviceType: 'mobile',
    };
    
    return await storage.createRecharge(rechargeData);
  }
  
  /**
   * Ensure commission config exists for testing
   */
  private async ensureCommissionConfig() {
    const config = await storage.getCommissionConfigByService('recharge');
    
    if (!config) {
      const configData: InsertCommissionConfig = {
        serviceType: 'recharge',
        adminCommission: COMMISSION_RATES.admin,
        branchManagerCommission: COMMISSION_RATES.branch_manager,
        talukManagerCommission: COMMISSION_RATES.taluk_manager,
        serviceAgentCommission: COMMISSION_RATES.service_agent,
        registeredUserCommission: COMMISSION_RATES.registered_user,
      };
      
      await storage.createCommissionConfig(configData);
    }
  }
}

export const mockRechargeService = new MockRechargeService();