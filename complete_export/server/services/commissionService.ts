import { storage } from '../storage';

/**
 * Default commission rates for different roles
 */
export const DEFAULT_COMMISSION_RATES = {
  admin: 0.5,              // 0.5%
  branch_manager: 0.5,     // 0.5%
  taluk_manager: 1.0,      // 1.0%
  service_agent: 3.0,      // 3.0%
  user: 1.0,               // 1.0% for registered users
};

/**
 * Service for handling commission calculations and distributions
 */
export class CommissionService {
  /**
   * Distribute commissions for a transaction - wrapper method for calculateAndDistributeCommissions
   * that handles service-specific commission distribution
   * @param serviceType Type of service (recharge, booking, etc.)
   * @param transactionId ID of the transaction
   * @param amount Transaction amount
   * @param provider Optional provider name
   */
  async distributeCommissions(
    serviceType: string,
    transactionId: number,
    amount: number,
    provider?: string
  ) {
    console.log(`[Commission] Starting distribution for ${serviceType} transaction ${transactionId}, amount ${amount}, provider ${provider || 'N/A'}`);
    try {
      const result = await this.calculateAndDistributeCommissions(serviceType, transactionId, amount, provider);
      console.log(`[Commission] Distribution completed successfully:`, result);
      return result;
    } catch (error) {
      console.error(`[Commission] Distribution failed:`, error);
      throw error;
    }
  }

  /**
   * Get default commission rates
   */
  async getCommissionRates() {
    return DEFAULT_COMMISSION_RATES;
  }
  
  /**
   * Initialize default commission configurations for different service types
   * This ensures configs exist for all primary service types
   */
  async initializeDefaultConfigs() {
    try {
      // Define service types that should have default configurations
      const serviceTypes = ['recharge', 'booking', 'grocery', 'travel', 'rental', 'taxi', 'delivery'];
      
      for (const serviceType of serviceTypes) {
        // Check if config already exists
        const existingConfig = await storage.getCommissionConfigByService(serviceType);
        
        if (!existingConfig) {
          console.log(`Creating default commission config for service type: ${serviceType}`);
          
          // Create default configuration using standard rates
          await storage.createCommissionConfig({
            serviceType,
            adminCommission: DEFAULT_COMMISSION_RATES.admin,
            branchManagerCommission: DEFAULT_COMMISSION_RATES.branch_manager,
            talukManagerCommission: DEFAULT_COMMISSION_RATES.taluk_manager,
            serviceAgentCommission: DEFAULT_COMMISSION_RATES.service_agent,
            registeredUserCommission: DEFAULT_COMMISSION_RATES.user,
          });
        }
      }
      
      return { success: true, message: "Default commission configurations initialized" };
    } catch (error) {
      console.error("Error initializing default commission configs:", error);
      throw error;
    }
  }

  /**
   * Get commission statistics for a user
   * 
   * @param userId User ID
   */
  async getUserCommissionStats(userId: number) {
    try {
      // Get user commission transactions
      const commissionTransactions = await storage.getCommissionTransactionsByUserId(userId);
      
      // Calculate total commissions earned
      const totalCommissionsEarned = commissionTransactions.reduce(
        (sum, transaction) => sum + transaction.commissionAmount,
        0
      );
      
      // Count transactions by service type
      const rechargeTransactions = commissionTransactions.filter(
        transaction => transaction.serviceType === 'recharge'
      );
      
      const bookingTransactions = commissionTransactions.filter(
        transaction => transaction.serviceType === 'booking'
      );
      
      // Get recent commissions (last 5)
      const recentCommissions = commissionTransactions
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      
      // Get pending commissions (not yet processed)
      const pendingCommissions = commissionTransactions.filter(
        transaction => transaction.status === 'pending'
      );
      
      return {
        totalCommissionsEarned,
        totalRecharges: rechargeTransactions.length,
        totalBookings: bookingTransactions.length,
        recentCommissions,
        pendingCommissions,
      };
    } catch (error) {
      console.error('Error getting user commission stats:', error);
      throw error;
    }
  }
  
  /**
   * Get all wallet balances for the hierarchy (for admin dashboard)
   */
  async getHierarchyWalletBalances() {
    try {
      // Get test user for demo
      const testUser = await storage.getUserByUsername('testuser');
      
      // Get service agent for Chennai North (600001)
      const serviceAgent = await storage.getUserByUsernameStartingWith('sa_chennai_chennai_north_600001');
      
      // Get taluk manager for Chennai North
      const talukManager = await storage.getUserByUsernameStartingWith('tm_chennai_chennai_north');
      
      // Get branch manager for Chennai
      const branchManager = await storage.getUserByUsernameStartingWith('bm_chennai');
      
      // Get admin
      const admin = await storage.getUserByType('admin');
      
      return {
        testUser: testUser ? {
          id: testUser.id,
          username: testUser.username,
          walletBalance: testUser.walletBalance || 0,
        } : null,
        serviceAgent: serviceAgent ? {
          id: serviceAgent.id,
          username: serviceAgent.username,
          walletBalance: serviceAgent.walletBalance || 0,
        } : null,
        talukManager: talukManager ? {
          id: talukManager.id,
          username: talukManager.username,
          walletBalance: talukManager.walletBalance || 0,
        } : null,
        branchManager: branchManager ? {
          id: branchManager.id,
          username: branchManager.username,
          walletBalance: branchManager.walletBalance || 0,
        } : null,
        admin: admin ? {
          id: admin.id,
          username: admin.username,
          walletBalance: admin.walletBalance || 0,
        } : null,
      };
    } catch (error) {
      console.error('Error getting hierarchy wallet balances:', error);
      throw error;
    }
  }
  
  /**
   * Get pending commissions that need to be approved
   */
  async getPendingCommissions() {
    return await storage.getPendingCommissionTransactions();
  }
  
  /**
   * Mark commissions as paid
   * 
   * @param commissionIds Array of commission transaction IDs to mark as paid
   */
  async markCommissionsAsPaid(commissionIds: number[]) {
    try {
      for (const id of commissionIds) {
        await storage.updateCommissionTransactionStatus(id, 'paid');
      }
      return { success: true, processedCount: commissionIds.length };
    } catch (error) {
      console.error('Error marking commissions as paid:', error);
      throw error;
    }
  }
  
  /**
   * Manually distribute commissions for a specific recharge transaction
   * This is useful for fixing recharges that didn't have commissions properly distributed
   * 
   * @param rechargeId ID of the recharge to process
   */
  async manuallyDistributeCommissionsForRecharge(rechargeId: number) {
    try {
      console.log(`[Commission] Starting manual distribution for recharge ID: ${rechargeId}`);
      
      // 1. Check if the recharge exists
      const recharge = await storage.getRecharge(rechargeId);
      if (!recharge) {
        throw new Error(`Recharge not found for ID: ${rechargeId}`);
      }
      
      // 2. Verify recharge was processed
      if (recharge.status !== 'success') {
        throw new Error(`Cannot distribute commissions for a recharge with status: ${recharge.status}`);
      }
      
      // 3. Check if commissions were already distributed
      const existingCommissions = await storage.getCommissionTransactionsByReference('recharge', rechargeId);
      if (existingCommissions && existingCommissions.length > 0) {
        console.log(`[Commission] Found ${existingCommissions.length} existing commission transactions for recharge ${rechargeId}`);
        // We'll allow re-distribution for debugging purposes, but we'll log it
        console.log(`[Commission] WARNING: Redistributing commissions for recharge ${rechargeId}`);
      }
      
      // 4. Distribute the commissions
      const result = await this.calculateAndDistributeCommissions(
        'recharge',
        rechargeId,
        recharge.amount,
        recharge.provider
      );
      
      return {
        success: true,
        message: `Commissions successfully distributed for recharge ID: ${rechargeId}`,
        details: result
      };
    } catch (error) {
      console.error(`[Commission] Error manually distributing commissions for recharge ${rechargeId}:`, error);
      throw error;
    }
  }
  
  /**
   * Calculate and distribute commissions for a transaction
   * 
   * @param serviceType Type of service (e.g., 'recharge', 'booking')
   * @param transactionId ID of the transaction
   * @param amount Transaction amount
   * @param provider Service provider (e.g., 'Airtel', 'Jio')
   */
  async calculateAndDistributeCommissions(
    serviceType: string,
    transactionId: number,
    amount: number,
    provider?: string
  ) {
    try {
      console.log(`[Commission] Step 1: Getting commission config for ${serviceType}`);
      // 1. Get commission config
      const config = await storage.getCommissionConfigByService(serviceType);
      if (!config) {
        throw new Error(`No commission config found for service type: ${serviceType}`);
      }
      console.log(`[Commission] Config found:`, config);
      
      console.log(`[Commission] Step 2: Getting transaction details for ID ${transactionId}`);
      // 2. Get transaction details
      const transaction = serviceType === 'recharge'
        ? await storage.getRecharge(transactionId)
        : null; // Add other service types here
      
      console.log(`[Commission] Transaction:`, transaction);
      
      if (!transaction) {
        throw new Error(`Transaction not found for ID: ${transactionId}`);
      }
      
      const userId = transaction.userId;
      console.log(`[Commission] Step 3: Getting user details for user ID ${userId}`);
      const user = await storage.getUser(userId);
      console.log(`[Commission] User:`, user);
      
      if (!user) {
        throw new Error(`User not found for ID: ${userId}`);
      }
      
      // 3. Get the hierarchy chain for this user's area
      const userPincode = user.pincode;
      console.log(`[Commission] User pincode: ${userPincode}`);
      
      if (!userPincode) {
        throw new Error(`User ${userId} has no pincode assigned`);
      }
      
      console.log(`[Commission] Step 4: Finding service agent for pincode ${userPincode}`);
      // Find service agent by pincode
      const serviceAgent = await storage.getUserByPincodeAndType(userPincode, 'service_agent');
      console.log(`[Commission] Service agent:`, serviceAgent);
      
      if (!serviceAgent) {
        throw new Error(`No service agent found for pincode ${userPincode}`);
      }
      
      console.log(`[Commission] Step 5: Finding taluk manager for district ${serviceAgent.district}, taluk ${serviceAgent.taluk}`);
      // Find taluk manager from service agent's area
      const talukManager = await storage.getUserByTalukAndType(
        serviceAgent.district || '',
        serviceAgent.taluk || '',
        'taluk_manager'
      );
      console.log(`[Commission] Taluk manager:`, talukManager);
      
      if (!talukManager) {
        throw new Error(`No taluk manager found for ${serviceAgent.district}, ${serviceAgent.taluk}`);
      }
      
      console.log(`[Commission] Step 6: Finding branch manager for district ${talukManager.district}`);
      // Find branch manager from taluk manager's district
      const branchManager = await storage.getUserByDistrictAndType(
        talukManager.district || '',
        'branch_manager'
      );
      console.log(`[Commission] Branch manager:`, branchManager);
      
      if (!branchManager) {
        throw new Error(`No branch manager found for district ${talukManager.district}`);
      }
      
      console.log(`[Commission] Step 7: Finding admin user`);
      // Find admin
      const admin = await storage.getUserByType('admin');
      console.log(`[Commission] Admin:`, admin);
      
      if (!admin) {
        throw new Error('No admin user found in the system');
      }
      
      console.log(`[Commission] Step 8: Calculating commission amounts based on config rates`);
      // 4. Calculate commission amounts
      const commissions = {
        user: (amount * config.registeredUserCommission) / 100,
        serviceAgent: (amount * config.serviceAgentCommission) / 100,
        talukManager: (amount * config.talukManagerCommission) / 100,
        branchManager: (amount * config.branchManagerCommission) / 100,
        admin: (amount * config.adminCommission) / 100,
      };
      console.log(`[Commission] Calculated commissions:`, commissions);
      
      console.log(`[Commission] Step 9: Recording commission transactions and updating wallet balances`);
      
      try {
        // Admin commission
        console.log(`[Commission] Creating commission transaction for admin ID ${admin.id}`);
        await storage.createCommissionTransaction({
          userId: admin.id,
          serviceType,
          transactionId,
          amount: commissions.admin, // Required field in schema
          commissionAmount: commissions.admin,
          commissionRate: config.adminCommission,
          transactionAmount: amount,
          provider: provider || null,
          status: 'pending',
        });
        
        console.log(`[Commission] Updating admin wallet balance`);
        await storage.updateWalletBalance(admin.id, (admin.walletBalance || 0) + commissions.admin);
        
        // Branch manager commission
        console.log(`[Commission] Creating commission transaction for branch manager ID ${branchManager.id}`);
        await storage.createCommissionTransaction({
          userId: branchManager.id,
          serviceType,
          transactionId,
          amount: commissions.branchManager, // Required field in schema
          commissionAmount: commissions.branchManager,
          commissionRate: config.branchManagerCommission,
          transactionAmount: amount,
          provider: provider || null,
          status: 'pending',
        });
        
        console.log(`[Commission] Updating branch manager wallet balance`);
        await storage.updateWalletBalance(
          branchManager.id, 
          (branchManager.walletBalance || 0) + commissions.branchManager
        );
        
        // Taluk manager commission
        console.log(`[Commission] Creating commission transaction for taluk manager ID ${talukManager.id}`);
        await storage.createCommissionTransaction({
          userId: talukManager.id,
          serviceType,
          transactionId,
          amount: commissions.talukManager, // Required field in schema
          commissionAmount: commissions.talukManager,
          commissionRate: config.talukManagerCommission,
          transactionAmount: amount,
          provider: provider || null,
          status: 'pending',
        });
        
        console.log(`[Commission] Updating taluk manager wallet balance`);
        await storage.updateWalletBalance(
          talukManager.id, 
          (talukManager.walletBalance || 0) + commissions.talukManager
        );
        
        // Service agent commission
        console.log(`[Commission] Creating commission transaction for service agent ID ${serviceAgent.id}`);
        await storage.createCommissionTransaction({
          userId: serviceAgent.id,
          serviceType,
          transactionId,
          amount: commissions.serviceAgent, // Required field in schema
          commissionAmount: commissions.serviceAgent,
          commissionRate: config.serviceAgentCommission,
          transactionAmount: amount,
          provider: provider || null,
          status: 'pending',
        });
        
        console.log(`[Commission] Updating service agent wallet balance`);
        await storage.updateWalletBalance(
          serviceAgent.id, 
          (serviceAgent.walletBalance || 0) + commissions.serviceAgent
        );
        
        // User commission
        console.log(`[Commission] Creating commission transaction for user ID ${user.id}`);
        await storage.createCommissionTransaction({
          userId: user.id,
          serviceType,
          transactionId,
          amount: commissions.user, // Required field in schema
          commissionAmount: commissions.user,
          commissionRate: config.registeredUserCommission,
          transactionAmount: amount,
          provider: provider || null,
          status: 'pending',
        });
        
        console.log(`[Commission] Updating user wallet balance`);
        await storage.updateWalletBalance(
          user.id, 
          (user.walletBalance || 0) + commissions.user
        );
      } catch (err) {
        console.error('[Commission] Error creating transactions or updating wallets:', err);
        throw err;
      }
      
      return {
        success: true,
        totalCommission: Object.values(commissions).reduce((sum, val) => sum + val, 0),
        commissions,
      };
    } catch (error) {
      console.error('Error calculating commissions:', error);
      throw error;
    }
  }
}

export const commissionService = new CommissionService();