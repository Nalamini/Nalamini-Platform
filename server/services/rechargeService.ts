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
      // Using the updated endpoint structure based on Razorpay API documentation
      const response = await axios.post(
        `https://api.razorpay.com/v1/apihub/recharge`,
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
      // Using the updated endpoint structure based on Razorpay API documentation
      const response = await axios.get(
        `https://api.razorpay.com/v1/apihub/recharge/status`,
        {
          params: {
            reference_id: statusRequest.transactionId
          },
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
   * @param serviceType The service type (mobile, dth, electricity, etc.)
   * @returns A promise with the available plans
   */
  async getAvailablePlans(provider: string, circle?: string, serviceType?: string): Promise<any> {
    console.log("Getting available plans for provider:", provider, "circle:", circle);
    
    // Fallback to mock if Razorpay credentials are not available
    if (this.useMock) {
      console.log("Using mock plans service");
      return this.getMockPlans(provider, serviceType);
    }
    
    try {
      // Get operator code based on provider name
      const operatorCode = this.getOperatorCode(provider);
      const circleCode = circle ? this.getCircleCode(circle) : undefined;
      
      console.log("Using operator code:", operatorCode, "circle code:", circleCode);
      
      // Request plans from Razorpay API Hub
      // Note: The correct endpoint might be slightly different based on Razorpay's API structure
      // Attempting with the updated API path format
      const apiPath = '/v1/apihub/recharge/plans';
      
      const response = await axios.get(
        `https://api.razorpay.com${apiPath}`,
        {
          params: {
            operator: operatorCode,
            circle: circleCode
          },
          auth: {
            username: process.env.RAZORPAY_KEY_ID!,
            password: process.env.RAZORPAY_KEY_SECRET!
          },
          headers: {
            'Content-Type': 'application/json'
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
      // Enhanced error logging for better debugging
      console.error('Razorpay plans API error details:');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request (no response received):', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      
      // Log error details
      console.log('API call failed, will use mock plans instead');
      
      // Fallback to mock plans if the API call fails
      console.log("API call failed, using mock plans");
      return this.getMockPlans(provider, serviceType);
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
      // Mobile operators
      'airtel': 'AIRTEL',
      'jio': 'JIO',
      'vi': 'VODAFONE',
      'vodafone': 'VODAFONE',
      'vodafone idea': 'VODAFONE',
      'bsnl': 'BSNL',
      
      // DTH operators
      'tata play': 'TATA_PLAY',
      'airtel digital tv': 'AIRTEL_DTH',
      'dish tv': 'DISH_TV',
      'sun direct': 'SUN_DIRECT',
      'd2h': 'D2H',
      
      // Electricity providers
      'tneb': 'TNEB',
      'bescom': 'BESCOM',
      'kseb': 'KSEB',
      'aptransco': 'APTRANSCO',
      'tsspdcl': 'TSSPDCL'
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

  /**
   * Get mock plans based on provider and service type
   * @param provider The service provider
   * @param serviceType The service type (mobile, dth, electricity, etc.)
   * @returns Mock plans data
   */
  private getMockPlans(provider: string, serviceType?: string): any {
    console.log("Getting mock plans for:", provider, "with service type:", serviceType);
    
    // If serviceType is specified, use it to determine the type of plans to return
    if (serviceType) {
      switch(serviceType.toLowerCase()) {
        case 'dth':
          return this.getMockDTHPlans(provider);
        case 'electricity':
          return this.getMockElectricityPlans(provider);
        case 'mobile':
          return this.getMockMobilePlans(provider);
        default:
          console.log(`Unknown service type: ${serviceType}, defaulting to mobile plans`);
          return this.getMockMobilePlans(provider);
      }
    }
    
    // If serviceType is not specified, infer from provider (for backward compatibility)
    const isDTH = ['tata play', 'airtel digital tv', 'dish tv', 'sun direct', 'd2h'].includes(provider.toLowerCase());
    const isElectricity = ['tneb', 'bescom', 'kseb', 'aptransco', 'tsspdcl'].includes(provider.toLowerCase());
    
    if (isDTH) {
      return this.getMockDTHPlans(provider);
    } else if (isElectricity) {
      return this.getMockElectricityPlans(provider);
    } else {
      return this.getMockMobilePlans(provider);
    }
  }
  
  /**
   * Generate mock plans for mobile recharges
   */
  private getMockMobilePlans(provider: string): any {
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
      message: 'Mobile plans generated successfully'
    };
  }
  
  /**
   * Generate mock plans for DTH recharges
   */
  private getMockDTHPlans(provider: string): any {
    const categories = [
      { id: 'base', name: 'Base Packs' },
      { id: 'addon', name: 'Add-on Packs' },
      { id: 'regional', name: 'Regional' },
      { id: 'hd', name: 'HD Packs' },
      { id: 'sports', name: 'Sports' },
    ];
    
    // Generate sample DTH plans
    const plans = [];
    
    // Base packs
    plans.push(
      { id: 1, category: 'base', amount: 199, validity: '1 Month', description: 'Value Pack - 100 Channels' },
      { id: 2, category: 'base', amount: 299, validity: '1 Month', description: 'Family Pack - 150 Channels' },
      { id: 3, category: 'base', amount: 399, validity: '1 Month', description: 'Premium Pack - 200 Channels' },
      { id: 4, category: 'base', amount: 499, validity: '1 Month', description: 'All Access Pack - 250+ Channels' }
    );
    
    // Add-on packs
    plans.push(
      { id: 5, category: 'addon', amount: 25, validity: '1 Month', description: 'Kids Pack - 10 Channels' },
      { id: 6, category: 'addon', amount: 35, validity: '1 Month', description: 'News Pack - 15 Channels' },
      { id: 7, category: 'addon', amount: 50, validity: '1 Month', description: 'Movies Pack - 12 Channels' },
      { id: 8, category: 'addon', amount: 75, validity: '1 Month', description: 'Entertainment Plus - 20 Channels' }
    );
    
    // Regional packs
    plans.push(
      { id: 9, category: 'regional', amount: 49, validity: '1 Month', description: 'Tamil Pack - 20 Channels' },
      { id: 10, category: 'regional', amount: 49, validity: '1 Month', description: 'Telugu Pack - 15 Channels' },
      { id: 11, category: 'regional', amount: 39, validity: '1 Month', description: 'Malayalam Pack - 10 Channels' },
      { id: 12, category: 'regional', amount: 49, validity: '1 Month', description: 'Kannada Pack - 15 Channels' },
      { id: 13, category: 'regional', amount: 39, validity: '1 Month', description: 'Bengali Pack - 12 Channels' }
    );
    
    // HD packs
    plans.push(
      { id: 14, category: 'hd', amount: 99, validity: '1 Month', description: 'HD Add-on - 10 HD Channels' },
      { id: 15, category: 'hd', amount: 149, validity: '1 Month', description: 'HD Entertainment - 15 HD Channels' },
      { id: 16, category: 'hd', amount: 199, validity: '1 Month', description: 'HD Premium - 25 HD Channels' },
      { id: 17, category: 'hd', amount: 299, validity: '1 Month', description: 'HD All Access - 50+ HD Channels' }
    );
    
    // Sports packs
    plans.push(
      { id: 18, category: 'sports', amount: 89, validity: '1 Month', description: 'Sports Lite - 5 Sports Channels' },
      { id: 19, category: 'sports', amount: 149, validity: '1 Month', description: 'Sports Pack - 10 Sports Channels' },
      { id: 20, category: 'sports', amount: 199, validity: '1 Month', description: 'Sports HD Pack - 10 HD Sports Channels' }
    );
    
    // Long-term recharges
    plans.push(
      { id: 21, category: 'base', amount: 1099, validity: '6 Months', description: 'Value Pack - 6 Month Offer' },
      { id: 22, category: 'base', amount: 1799, validity: '6 Months', description: 'Family Pack - 6 Month Offer' },
      { id: 23, category: 'base', amount: 1999, validity: '12 Months', description: 'Value Pack - Annual Offer' },
      { id: 24, category: 'base', amount: 3299, validity: '12 Months', description: 'Family Pack - Annual Offer' }
    );
    
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: 'DTH plans generated successfully'
    };
  }
  
  /**
   * Generate mock plans for electricity bill payments
   */
  private getMockElectricityPlans(provider: string): any {
    const categories = [
      { id: 'residential', name: 'Residential' },
      { id: 'commercial', name: 'Commercial' },
      { id: 'industrial', name: 'Industrial' },
      { id: 'agricultural', name: 'Agricultural' }
    ];
    
    // Generate sample electricity plans/tariffs
    const plans = [];
    
    // Residential tariffs
    plans.push(
      { id: 1, category: 'residential', amount: 100, validity: 'Monthly', description: 'Residential Basic (0-100 units)' },
      { id: 2, category: 'residential', amount: 250, validity: 'Monthly', description: 'Residential Standard (101-200 units)' },
      { id: 3, category: 'residential', amount: 400, validity: 'Monthly', description: 'Residential Regular (201-300 units)' },
      { id: 4, category: 'residential', amount: 750, validity: 'Monthly', description: 'Residential High (301-500 units)' },
      { id: 5, category: 'residential', amount: 1200, validity: 'Monthly', description: 'Residential Premium (501+ units)' }
    );
    
    // Commercial tariffs
    plans.push(
      { id: 6, category: 'commercial', amount: 500, validity: 'Monthly', description: 'Commercial Basic (0-200 units)' },
      { id: 7, category: 'commercial', amount: 1000, validity: 'Monthly', description: 'Commercial Standard (201-500 units)' },
      { id: 8, category: 'commercial', amount: 2500, validity: 'Monthly', description: 'Commercial Regular (501-1000 units)' },
      { id: 9, category: 'commercial', amount: 5000, validity: 'Monthly', description: 'Commercial High (1001+ units)' }
    );
    
    // Industrial tariffs
    plans.push(
      { id: 10, category: 'industrial', amount: 2000, validity: 'Monthly', description: 'Industrial Basic (LT)' },
      { id: 11, category: 'industrial', amount: 5000, validity: 'Monthly', description: 'Industrial Standard (HT-I)' },
      { id: 12, category: 'industrial', amount: 10000, validity: 'Monthly', description: 'Industrial Premium (HT-II)' }
    );
    
    // Agricultural tariffs
    plans.push(
      { id: 13, category: 'agricultural', amount: 250, validity: 'Monthly', description: 'Agricultural Basic' },
      { id: 14, category: 'agricultural', amount: 500, validity: 'Monthly', description: 'Agricultural Standard' },
      { id: 15, category: 'agricultural', amount: 750, validity: 'Monthly', description: 'Agricultural Premium' }
    );
    
    return {
      provider,
      categories: {
        data: categories
      },
      plans,
      message: 'Electricity tariffs generated successfully'
    };
  }
}

// Create and export an instance of the recharge service
export const rechargeService = new RechargeService();