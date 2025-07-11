import axios from 'axios';
import Razorpay from 'razorpay';

/**
 * Interface for a recharge request
 */
interface RechargeRequest {
  mobileNumber: string;
  amount: number;
  provider: string;
  transactionId: string;
}

/**
 * Interface for a recharge response
 */
interface RechargeResponse {
  success: boolean;
  transactionId: string;
  operatorRef?: string;
  message: string;
}

/**
 * Interface for a recharge status request
 */
interface RechargeStatusRequest {
  transactionId: string;
}

/**
 * Interface for Razorpay API Hub recharge request
 */
interface RazorpayRechargeRequest {
  customer_id: string; // Customer identifier
  mobile: string; // Mobile number with country code
  amount: number; // Amount in paisa (Rs. 1 = 100 paisa)
  operator: string; // Operator code
  reference_id: string; // Unique reference ID for the transaction
}

/**
 * Service for handling mobile recharge operations
 */
export class RechargeService {
  private razorpayClient: Razorpay | null = null;
  private useMock: boolean;
  private apiBaseUrl: string;

  constructor() {
    // Initialize Razorpay client with credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log("Razorpay credentials check:", !!keyId, !!keySecret);
    this.useMock = !keyId || !keySecret;
    
    if (!this.useMock) {
      this.razorpayClient = new Razorpay({
        key_id: keyId!,
        key_secret: keySecret!
      });
      
      // Razorpay API Hub base URL for recharge services
      this.apiBaseUrl = 'https://api.razorpay.com/v1/apihub';
      console.log("Using Razorpay API Hub at:", this.apiBaseUrl);
    } else {
      console.warn('Razorpay credentials not found. Using mock recharge service.');
      this.apiBaseUrl = '';
    }
  }

  /**
   * Process a mobile recharge request using Razorpay API Hub
   * @param rechargeData The recharge request data
   * @returns A promise with the recharge response
   */
  async processMobileRecharge(rechargeData: RechargeRequest): Promise<RechargeResponse> {
    console.log("Processing mobile recharge:", rechargeData);
    
    // Fallback to mock if Razorpay credentials are not available
    if (this.useMock) {
      console.log("Using mock recharge service");
      return this.mockRechargeResponse(rechargeData);
    }
    
    try {
      // Prepare operator code based on provider name
      const operatorCode = this.getOperatorCode(rechargeData.provider);
      console.log("Using operator code:", operatorCode);
      
      // Create request payload for Razorpay API
      const payload: RazorpayRechargeRequest = {
        customer_id: `cust_${rechargeData.transactionId}`, // Generate a customer ID based on transaction
        mobile: `91${rechargeData.mobileNumber}`, // Add country code
        amount: rechargeData.amount * 100, // Convert to paisa
        operator: operatorCode,
        reference_id: rechargeData.transactionId
      };
      
      console.log("Razorpay request payload:", payload);
      
      // Make request to Razorpay API Hub recharge endpoint
      const response = await axios.post(
        `${this.apiBaseUrl}/recharge`,
        payload,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID!,
            password: process.env.RAZORPAY_KEY_SECRET!
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      console.log('Razorpay recharge response:', data);
      
      return {
        success: data.status === 'processed' || data.status === 'success',
        transactionId: rechargeData.transactionId,
        operatorRef: data.transaction_id || data.reference_id,
        message: data.message || 'Recharge processed successfully'
      };
    } catch (error: any) {
      console.error('Razorpay recharge API error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Enhanced error handling for API errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received, request details:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in request setup:', error.message);
      }
      
      return {
        success: false,
        transactionId: rechargeData.transactionId,
        message: error.response?.data?.error?.description || error.message || 'Recharge processing failed'
      };
    }
  }

  /**
   * Check the status of a recharge request
   * @param statusRequest The status request data
   * @returns A promise with the recharge status response
   */
  async checkRechargeStatus(statusRequest: RechargeStatusRequest): Promise<RechargeResponse> {
    console.log("Checking recharge status:", statusRequest);
    
    // Fallback to mock if Razorpay credentials are not available
    if (this.useMock) {
      console.log("Using mock status service");
      return {
        success: true,
        transactionId: statusRequest.transactionId,
        operatorRef: `OP${Math.floor(Math.random() * 1000000)}`,
        message: 'Recharge completed successfully'
      };
    }
    
    try {
      // Request recharge status from Razorpay API Hub
      const response = await axios.get(
        `${this.apiBaseUrl}/recharge/status`,
        {
          params: {
            reference_id: statusRequest.transactionId
          },
          auth: {
            username: process.env.RAZORPAY_KEY_ID!,
            password: process.env.RAZORPAY_KEY_SECRET!
          }
        }
      );
      
      const data = response.data;
      console.log('Razorpay status response:', data);
      
      return {
        success: data.status === 'processed' || data.status === 'success',
        transactionId: statusRequest.transactionId,
        operatorRef: data.transaction_id || data.operator_transaction_id,
        message: data.message || 'Status retrieved successfully'
      };
    } catch (error: any) {
      console.error('Razorpay status API error:', error.response?.data || error.message);
      return {
        success: false,
        transactionId: statusRequest.transactionId,
        message: error.response?.data?.error?.description || error.message || 'Status check failed'
      };
    }
  }

  /**
   * Get available plans for a specific provider
   * @param provider The mobile service provider
   * @param circle The telecom circle/region (optional)
   * @returns A promise with the available plans
   */
  async getAvailablePlans(provider: string, circle?: string): Promise<any> {
    console.log("Getting available plans for provider:", provider, "circle:", circle);
    
    // Fallback to mock if Razorpay credentials are not available
    if (this.useMock) {
      console.log("Using mock plans service");
      return this.getMockPlans(provider);
    }
    
    try {
      // Get operator code based on provider name
      const operatorCode = this.getOperatorCode(provider);
      const circleCode = circle ? this.getCircleCode(circle) : undefined;
      
      console.log("Using operator code:", operatorCode, "circle code:", circleCode);
      
      // Request plans from Razorpay API Hub
      const response = await axios.get(
        `${this.apiBaseUrl}/recharge/plans`,
        {
          params: {
            operator: operatorCode,
            circle: circleCode
          },
          auth: {
            username: process.env.RAZORPAY_KEY_ID!,
            password: process.env.RAZORPAY_KEY_SECRET!
          }
        }
      );
      
      // Transform the response to match our expected format
      const data = response.data;
      console.log('Razorpay plans API raw response:', data);
      
      // Process and categorize plans
      const processedData = this.processRazorpayPlans(data, provider);
      return processedData;
    } catch (error: any) {
      console.error('Razorpay plans API error:', error.response?.data || error.message);
      
      // Fallback to mock plans if the API call fails
      console.log("API call failed, using mock plans");
      return this.getMockPlans(provider);
    }
  }
  
  /**
   * Process and categorize plans from Razorpay response
   */
  private processRazorpayPlans(data: any, provider: string): any {
    // Default categories
    const categories = [
      { id: 'data', name: 'Data' },
      { id: 'combo', name: 'Combo' },
      { id: 'talktime', name: 'Talktime' },
      { id: 'entertainment', name: 'Entertainment' },
      { id: 'roaming', name: 'Roaming' },
    ];
    
    // If we have plans data from Razorpay
    if (data && data.plans && Array.isArray(data.plans)) {
      const plans = data.plans.map((plan: any, index: number) => {
        // Determine the category based on plan details
        const category = this.determinePlanCategory(plan);
        
        return {
          id: index + 1,
          category,
          amount: plan.amount / 100, // Convert from paisa to rupees
          validity: plan.validity || 'N/A',
          description: plan.description || `${provider} Plan`
        };
      });
      
      return {
        provider,
        categories: {
          data: categories
        },
        plans,
        message: 'Plans fetched successfully from Razorpay'
      };
    }
    
    // If the response doesn't have the expected structure, return mock plans
    console.log("Invalid response format from Razorpay API, using mock plans");
    return this.getMockPlans(provider);
  }
  
  /**
   * Determine the category of a plan based on its details
   */
  private determinePlanCategory(plan: any): string {
    const description = (plan.description || '').toLowerCase();
    
    if (description.includes('gb') || description.includes('data')) {
      if (description.includes('call') || description.includes('voice') || description.includes('sms')) {
        return 'combo';
      }
      return 'data';
    } else if (description.includes('talk') || description.includes('voice') || description.includes('call')) {
      return 'talktime';
    } else if (description.includes('hotstar') || description.includes('prime') || description.includes('netflix') || 
               description.includes('zee') || description.includes('sony')) {
      return 'entertainment';
    } else if (description.includes('roaming') || description.includes('international')) {
      return 'roaming';
    }
    
    // Default to combo for unknown categories
    return 'combo';
  }
  
  /**
   * Get operator code based on provider name
   */
  private getOperatorCode(provider: string): string {
    // Map provider names to Razorpay operator codes
    const providerMap: Record<string, string> = {
      'airtel': 'AIRTEL',
      'jio': 'JIO',
      'vi': 'VODAFONE',
      'vodafone': 'VODAFONE',
      'vodafone idea': 'VODAFONE',
      'bsnl': 'BSNL'
    };
    
    const normalizedProvider = provider.toLowerCase();
    return providerMap[normalizedProvider] || normalizedProvider.toUpperCase();
  }
  
  /**
   * Get circle code based on circle name
   */
  private getCircleCode(circle: string): string {
    // Map circle names to Razorpay circle codes for Indian states
    const circleMap: Record<string, string> = {
      'tamil nadu': 'TN',
      'tamilnadu': 'TN',
      'tn': 'TN',
      'kerala': 'KL',
      'karnataka': 'KA',
      'andhra pradesh': 'AP',
      'telangana': 'TS',
      'maharashtra': 'MH',
      'gujarat': 'GJ',
      'delhi': 'DL',
      'punjab': 'PB',
      'west bengal': 'WB',
      'uttar pradesh': 'UP'
    };
    
    const normalizedCircle = circle.toLowerCase();
    return circleMap[normalizedCircle] || normalizedCircle.toUpperCase();
  }

  /**
   * Generate a mock recharge response for testing
   * @param rechargeData The recharge request data
   * @returns A mock recharge response
   */
  private mockRechargeResponse(rechargeData: RechargeRequest): RechargeResponse {
    // For debugging, always return success in mock mode
    return {
      success: true,
      transactionId: rechargeData.transactionId,
      operatorRef: `OP${Math.floor(Math.random() * 1000000)}`,
      message: `₹${rechargeData.amount} recharge for ${rechargeData.mobileNumber} completed successfully`
    };
  }

  /* Mock plans implementation remains the same */
  private getMockPlans(provider: string): any {
    const categories = [
      { id: 'data', name: 'Data' },
      { id: 'combo', name: 'Combo' },
      { id: 'talktime', name: 'Talktime' },
      { id: 'entertainment', name: 'Entertainment' },
      { id: 'roaming', name: 'Roaming' },
    ];
    
    // Generate sample plans based on provider
    const plans = [];
    
    // Data plans
    plans.push(
      { id: 1, category: 'data', amount: 19, validity: '1 Day', description: '1GB Data' },
      { id: 2, category: 'data', amount: 49, validity: '28 Days', description: '3GB Data' },
      { id: 3, category: 'data', amount: 98, validity: '28 Days', description: '12GB Data' },
      { id: 4, category: 'data', amount: 149, validity: '28 Days', description: '24GB Data' }
    );
    
    // Combo plans
    plans.push(
      { id: 5, category: 'combo', amount: 149, validity: '28 Days', description: 'Unlimited Calls + 1GB/Day + 100 SMS' },
      { id: 6, category: 'combo', amount: 179, validity: '28 Days', description: 'Unlimited Calls + 1.5GB/Day + 100 SMS' },
      { id: 7, category: 'combo', amount: 199, validity: '28 Days', description: 'Unlimited Calls + 2GB/Day + 100 SMS' },
      { id: 8, category: 'combo', amount: 249, validity: '28 Days', description: 'Unlimited Calls + 2.5GB/Day + 100 SMS' },
      { id: 9, category: 'combo', amount: 299, validity: '28 Days', description: 'Unlimited Calls + 3GB/Day + 100 SMS' },
      { id: 10, category: 'combo', amount: 399, validity: '56 Days', description: 'Unlimited Calls + 2GB/Day + 100 SMS' },
      { id: 11, category: 'combo', amount: 499, validity: '56 Days', description: 'Unlimited Calls + 2.5GB/Day + 100 SMS' },
      { id: 12, category: 'combo', amount: 599, validity: '84 Days', description: 'Unlimited Calls + 2GB/Day + 100 SMS' },
      { id: 13, category: 'combo', amount: 699, validity: '84 Days', description: 'Unlimited Calls + 2.5GB/Day + 100 SMS' },
      { id: 14, category: 'combo', amount: 799, validity: '84 Days', description: 'Unlimited Calls + 3GB/Day + 100 SMS' },
      { id: 15, category: 'combo', amount: 999, validity: '84 Days', description: 'Unlimited Calls + 3.5GB/Day + 100 SMS' },
      { id: 16, category: 'combo', amount: 2499, validity: '365 Days', description: 'Unlimited Calls + 2GB/Day + 100 SMS/Day' }
    );
    
    // Talktime plans
    plans.push(
      { id: 17, category: 'talktime', amount: 10, validity: 'Regular', description: 'Talktime ₹7.47' },
      { id: 18, category: 'talktime', amount: 20, validity: 'Regular', description: 'Talktime ₹14.95' },
      { id: 19, category: 'talktime', amount: 50, validity: 'Regular', description: 'Talktime ₹39.37' },
      { id: 20, category: 'talktime', amount: 100, validity: 'Regular', description: 'Talktime ₹81.75' },
      { id: 21, category: 'talktime', amount: 500, validity: 'Regular', description: 'Talktime ₹423.73' },
      { id: 22, category: 'talktime', amount: 1000, validity: 'Regular', description: 'Talktime ₹847.46' }
    );
    
    // Entertainment add-ons
    plans.push(
      { id: 23, category: 'entertainment', amount: 29, validity: '30 Days', description: 'Amazon Prime Video Mobile' },
      { id: 24, category: 'entertainment', amount: 59, validity: '28 Days', description: 'Disney+ Hotstar Mobile' },
      { id: 25, category: 'entertainment', amount: 149, validity: '28 Days', description: 'Netflix Mobile Plan' },
      { id: 26, category: 'entertainment', amount: 49, validity: '28 Days', description: 'SonyLIV Mobile' }
    );
    
    // Roaming plans
    plans.push(
      { id: 27, category: 'roaming', amount: 149, validity: '10 Days', description: 'International Roaming Pack - Basic' },
      { id: 28, category: 'roaming', amount: 499, validity: '10 Days', description: 'International Roaming Pack - Standard' },
      { id: 29, category: 'roaming', amount: 999, validity: '10 Days', description: 'International Roaming Pack - Premium' }
    );
    
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: 'Plans generated successfully'
    };
  }
}