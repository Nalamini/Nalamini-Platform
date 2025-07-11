import { storage } from '../storage';
import { paymentService } from './paymentService';

/**
 * Service for handling wallet operations
 */
export class WalletService {

  /**
   * Get wallet balance for a user
   * @param userId User ID
   * @returns Wallet balance
   */
  async getBalance(userId: number): Promise<number> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.walletBalance || 0;
  }

  /**
   * Get transaction history for a user
   * @param userId User ID
   * @returns Array of transactions
   */
  async getTransactionHistory(userId: number) {
    return await storage.getTransactionsByUserId(userId);
  }

  /**
   * Add funds to a user's wallet
   * @param userId User ID
   * @param amount Amount to add (in rupees)
   * @param source Source of the funds (e.g., 'payment', 'admin', 'refund')
   * @param reference Reference information (e.g., payment ID)
   * @returns Updated wallet balance
   */
  async addFunds(userId: number, amount: number, source: string, reference: string): Promise<number> {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update wallet balance
    const currentBalance = user.walletBalance || 0;
    const newBalance = currentBalance + amount;
    await storage.updateUser(userId, { walletBalance: newBalance });

    // Create transaction record
    await storage.createTransaction({
      userId,
      amount,
      type: 'credit',
      description: `Wallet credit via ${source} (${reference})`,
      serviceType: 'wallet'
    });

    return newBalance;
  }

  /**
   * Deduct funds from a user's wallet
   * @param userId User ID
   * @param amount Amount to deduct (in rupees)
   * @param service Service using the funds (e.g., 'recharge', 'booking')
   * @param description Description of the transaction
   * @returns Updated wallet balance
   */
  async deductFunds(userId: number, amount: number, service: string, description: string): Promise<number> {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentBalance = user.walletBalance || 0;
    
    // Check if sufficient balance
    if (currentBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Update wallet balance
    const newBalance = currentBalance - amount;
    await storage.updateUser(userId, { walletBalance: newBalance });

    // Create transaction record
    await storage.createTransaction({
      userId,
      amount,
      type: 'debit',
      description,
      serviceType: service
    });

    return newBalance;
  }

  /**
   * Create a payment order for wallet recharge
   * @param userId User ID
   * @param amount Amount to add (in rupees)
   * @returns Payment order details
   */
  async createRechargeOrder(userId: number, amount: number) {
    if (amount < 100) {
      throw new Error('Minimum amount should be ₹100');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Amount needs to be in paise for Razorpay
    const amountInPaise = Math.round(amount * 100);
    
    // Create a unique receipt ID
    const receipt = `wallet_${userId}_${Date.now()}`;
    
    // Create order using Razorpay
    const order = await paymentService.createOrder({
      amount: amountInPaise,
      receipt,
      notes: {
        type: 'wallet_recharge',
        userEmail: user.email
      },
      userId
    });
    
    // Get the key - use mock key if no real key is available
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock';
    
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: razorpayKeyId
    };
  }

  /**
   * Verify payment and add funds to wallet
   * @param userId User ID
   * @param paymentData Payment verification data
   * @returns Verification result
   */
  async verifyPaymentAndAddFunds(userId: number, paymentData: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
    
    // Verify payment signature
    const isValid = paymentService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });
    
    if (!isValid) {
      throw new Error('Invalid payment signature');
    }
    
    // Get payment details from Razorpay
    const payment = await paymentService.getPayment(razorpay_payment_id);
    
    // Verify payment status
    if (payment.status !== 'captured') {
      throw new Error('Payment not completed');
    }
    
    // Get order details for amount verification
    const order = await paymentService.getOrder(razorpay_order_id);
    
    // Convert paise to rupees
    const amountInRupees = Number(order.amount) / 100;
    
    // Add funds to wallet
    const newBalance = await this.addFunds(
      userId,
      amountInRupees,
      'Razorpay',
      razorpay_payment_id
    );
    
    return {
      success: true,
      message: 'Payment verified and wallet updated',
      balance: newBalance
    };
  }

  /**
   * Add funds to a user's wallet by admin
   * @param adminId Admin user ID
   * @param userId User ID to credit
   * @param amount Amount to add
   * @param reason Reason for manual credit
   * @returns Updated wallet balance
   */
  async addFundsByAdmin(adminId: number, userId: number, amount: number, reason: string): Promise<number> {
    // Verify admin user
    const admin = await storage.getUser(adminId);
    if (!admin || admin.userType !== 'admin') {
      throw new Error('Unauthorized: Only admin can perform this action');
    }

    return await this.addFunds(
      userId,
      amount,
      'admin credit',
      `by admin ${admin.username}: ${reason}`
    );
  }
  
  /**
   * Add funds to user's own wallet for testing/demo purposes
   * @param userId User ID
   * @param amount Amount to add
   * @returns Updated wallet balance
   */
  async addTestFunds(userId: number, amount: number): Promise<number> {
    if (amount <= 0 || amount > 10000) {
      throw new Error('Amount must be between 1 and 10,000');
    }
    
    return await this.addFunds(
      userId,
      amount,
      'test credit',
      'Demo funds added for testing'
    );
  }
}

export const walletService = new WalletService();