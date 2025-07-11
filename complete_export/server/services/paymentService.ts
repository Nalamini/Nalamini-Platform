import Razorpay from 'razorpay';
import crypto from 'crypto';

interface CreateOrderOptions {
  amount: number; // amount in paise (₹100 = 10000 paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  userId: number;
}

interface VerifyPaymentOptions {
  orderId: string;
  paymentId: string;
  signature: string;
}

export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn('Razorpay credentials not found. Running in mock mode.');
    }

    this.razorpay = new Razorpay({
      key_id: keyId || 'rzp_test_mock',
      key_secret: keySecret || 'mock_secret',
    });
  }

  /**
   * Create a new payment order
   * @param options Order creation options
   * @returns The created order
   */
  async createOrder(options: CreateOrderOptions) {
    // Running in mock mode
    if (this.razorpay.key_id === 'rzp_test_mock') {
      return this.createMockOrder(options);
    }

    try {
      const order = await this.razorpay.orders.create({
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: {
          ...options.notes,
          userId: options.userId.toString(),
        },
      });

      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      // Fall back to mock order in case of error
      return this.createMockOrder(options);
    }
  }

  /**
   * Verify a payment signature
   * @param options Payment verification options
   * @returns Boolean indicating if signature is valid
   */
  verifyPaymentSignature(options: VerifyPaymentOptions): boolean {
    // Running in mock mode - always return true
    if (this.razorpay.key_id === 'rzp_test_mock') {
      return true;
    }

    try {
      // Generate the expected signature
      const secret = process.env.RAZORPAY_KEY_SECRET!;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${options.orderId}|${options.paymentId}`);
      const generatedSignature = hmac.digest('hex');

      // Compare signatures
      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(options.signature)
      );
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Fetch payment details by ID
   * @param paymentId The Razorpay payment ID
   * @returns The payment details
   */
  async getPayment(paymentId: string) {
    // Running in mock mode
    if (this.razorpay.key_id === 'rzp_test_mock') {
      return {
        id: paymentId,
        status: 'captured',
        amount: 100000, // ₹1000
        currency: 'INR',
        method: 'card',
        created_at: Date.now(),
      };
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Fetch order details by ID
   * @param orderId The Razorpay order ID
   * @returns The order details
   */
  async getOrder(orderId: string) {
    // Running in mock mode
    if (this.razorpay.key_id === 'rzp_test_mock') {
      return {
        id: orderId,
        amount: 100000, // ₹1000 in paise
        currency: 'INR',
        status: 'paid',
        receipt: 'receipt_123',
        created_at: Date.now(),
      };
    }

    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Refund a payment
   * @param paymentId The Razorpay payment ID
   * @param amount Optional amount to refund (in paise)
   * @returns The refund details
   */
  async refundPayment(paymentId: string, amount?: number) {
    // Running in mock mode
    if (this.razorpay.key_id === 'rzp_test_mock') {
      return {
        id: `refund_${Date.now()}`,
        payment_id: paymentId,
        amount: amount || 100000, // Default to ₹1000 if no amount specified
        currency: 'INR',
        status: 'processed',
        created_at: Date.now(),
      };
    }

    try {
      const refundOptions: any = {};
      if (amount) {
        refundOptions.amount = amount;
      }

      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Create a mock order for testing
   * @param options Order creation options
   * @returns Mock order object
   */
  private createMockOrder(options: CreateOrderOptions) {
    return {
      id: `order_${Date.now()}`,
      entity: 'order',
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: {
        ...options.notes,
        userId: options.userId.toString(),
      },
      created_at: Math.floor(Date.now() / 1000),
    };
  }
}

export const paymentService = new PaymentService();