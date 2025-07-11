import { storage } from "../storage";
import { v4 as uuidv4 } from "uuid";
import { walletService } from "./walletService";

export type UtilityType = 'electricity' | 'water' | 'gas' | 'dth' | 'broadband' | 'landline';

export interface UtilityProvider {
  id: string;
  name: string;
  type: UtilityType;
  logo: string;
  minAmount: number;
  maxAmount: number;
  states?: string[];
}

export interface BillDetails {
  billId: string;
  consumerNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  billDate: string;
  providerName: string;
  providerType: UtilityType;
  billPeriod?: string;
  extraDetails?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  message?: string;
  transactionId?: number;
  receiptNumber?: string;
  paidAmount?: number;
  paidDate?: Date;
}

// Mock data for utility providers
const providers: UtilityProvider[] = [
  {
    id: 'electricity_tneb',
    name: 'Tamil Nadu Electricity Board',
    type: 'electricity',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/TamilNadu_Electricity_Board_Logo.svg/120px-TamilNadu_Electricity_Board_Logo.svg.png',
    minAmount: 50,
    maxAmount: 50000,
    states: ['Tamil Nadu']
  },
  {
    id: 'electricity_kseb',
    name: 'Kerala State Electricity Board',
    type: 'electricity',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Kerala_State_Electricity_Board_Logo.svg/120px-Kerala_State_Electricity_Board_Logo.svg.png',
    minAmount: 50,
    maxAmount: 50000,
    states: ['Kerala']
  },
  {
    id: 'electricity_bescom',
    name: 'Bangalore Electricity Supply',
    type: 'electricity',
    logo: 'https://bescom.karnataka.gov.in/storage/pdf-files/BESCOM-LOGO.jpg',
    minAmount: 50,
    maxAmount: 50000,
    states: ['Karnataka']
  },
  {
    id: 'water_cmwssb',
    name: 'Chennai Metro Water',
    type: 'water',
    logo: 'https://chennaimetrowater.tn.gov.in/images/logo.png',
    minAmount: 100,
    maxAmount: 10000,
    states: ['Tamil Nadu']
  },
  {
    id: 'water_bwssb',
    name: 'Bangalore Water Supply',
    type: 'water',
    logo: 'https://bwssb.gov.in/bwssbuat/assets/img/logo.png',
    minAmount: 100,
    maxAmount: 10000,
    states: ['Karnataka']
  },
  {
    id: 'gas_igl',
    name: 'Indraprastha Gas Limited',
    type: 'gas',
    logo: 'https://www.iglonline.net/images/IGLLogo.png',
    minAmount: 200,
    maxAmount: 5000
  },
  {
    id: 'gas_gail',
    name: 'GAIL Gas Limited',
    type: 'gas',
    logo: 'https://www.gailgas.com/images/GAIL-Gas-Logo.png',
    minAmount: 200,
    maxAmount: 5000
  },
  {
    id: 'dth_tataplay',
    name: 'Tata Play',
    type: 'dth',
    logo: 'https://www.tataplay.com/assets/images/Tata-Play-Logo.png',
    minAmount: 100,
    maxAmount: 5000
  },
  {
    id: 'dth_airteldth',
    name: 'Airtel Digital TV',
    type: 'dth',
    logo: 'https://www.airtel.in/assets/images/Airtel-Logo.png',
    minAmount: 100,
    maxAmount: 5000
  },
  {
    id: 'dth_dishd2h',
    name: 'Dish D2H',
    type: 'dth',
    logo: 'https://www.d2h.com/assets/images/Dish-D2H-Logo.png',
    minAmount: 100,
    maxAmount: 5000
  },
  {
    id: 'dth_sundirect',
    name: 'Sun Direct',
    type: 'dth',
    logo: 'https://www.sundirect.in/assets/images/Sun-Direct-Logo.png',
    minAmount: 100,
    maxAmount: 5000
  },
  {
    id: 'broadband_airtel',
    name: 'Airtel Broadband',
    type: 'broadband',
    logo: 'https://www.airtel.in/assets/images/Airtel-Logo.png',
    minAmount: 300,
    maxAmount: 10000
  },
  {
    id: 'broadband_jio',
    name: 'Jio Fiber',
    type: 'broadband',
    logo: 'https://www.jio.com/static/img/logo.png',
    minAmount: 300,
    maxAmount: 10000
  },
  {
    id: 'broadband_bsnl',
    name: 'BSNL Broadband',
    type: 'broadband',
    logo: 'https://www.bsnl.co.in/images/logo.gif',
    minAmount: 200,
    maxAmount: 10000
  },
  {
    id: 'landline_bsnl',
    name: 'BSNL Landline',
    type: 'landline',
    logo: 'https://www.bsnl.co.in/images/logo.gif',
    minAmount: 100,
    maxAmount: 5000
  },
  {
    id: 'landline_airtel',
    name: 'Airtel Landline',
    type: 'landline',
    logo: 'https://www.airtel.in/assets/images/Airtel-Logo.png',
    minAmount: 100,
    maxAmount: 5000
  }
];

// Generate random names for bill detail mocking
const randomNames = [
  'Raj Kumar', 'Priya Singh', 'Vikram Mehta', 'Ananya Sharma', 'Rajesh Khanna',
  'Deepika Patel', 'Suresh Reddy', 'Kavita Gupta', 'Ramesh Iyengar', 'Meena Joshi',
  'Arun Krishnan', 'Lakshmi Nair', 'Sanjay Patil', 'Nirmala Devi', 'Mohan Rao'
];

class UtilityService {
  // Get list of utility providers with optional filtering
  getProviders(type?: UtilityType, state?: string): UtilityProvider[] {
    let filteredProviders = [...providers];
    
    if (type) {
      filteredProviders = filteredProviders.filter(provider => provider.type === type);
    }
    
    if (state) {
      filteredProviders = filteredProviders.filter(provider => 
        !provider.states || provider.states.includes(state)
      );
    }
    
    return filteredProviders;
  }
  
  // Mock function to fetch bill details for a consumer
  async fetchBill(providerId: string, consumerNumber: string): Promise<BillDetails | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the provider
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return null;
    
    // Generate a random bill with realistic data
    const billId = `BILL${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randomNameIndex = Math.floor(Math.random() * randomNames.length);
    const customerName = randomNames[randomNameIndex];
    
    // Calculate random amount within provider's limits
    const amount = Math.floor(provider.minAmount + Math.random() * (provider.maxAmount - provider.minAmount));
    
    // Get dates for bill period
    const today = new Date();
    const billDate = new Date(today);
    billDate.setDate(today.getDate() - Math.floor(5 + Math.random() * 15)); // 5-20 days ago
    
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + Math.floor(5 + Math.random() * 10)); // 5-15 days in future
    
    // Calculate bill period
    const billPeriodStart = new Date(billDate);
    billPeriodStart.setMonth(billPeriodStart.getMonth() - 1);
    
    const billPeriodFormatted = `${billPeriodStart.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} - ${billDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
    
    // Extra details based on utility type
    let extraDetails: Record<string, string> = {};
    
    switch (provider.type) {
      case 'electricity':
        extraDetails = {
          'meterNumber': `ELEC${Math.floor(1000000 + Math.random() * 9000000)}`,
          'unitsConsumed': `${Math.floor(100 + Math.random() * 900)} kWh`,
          'tariffPlan': 'Domestic LT'
        };
        break;
      case 'water':
        extraDetails = {
          'meterNumber': `WTR${Math.floor(1000000 + Math.random() * 9000000)}`,
          'consumption': `${Math.floor(5 + Math.random() * 30)} kL`,
          'connectionType': 'Residential'
        };
        break;
      case 'gas':
        extraDetails = {
          'meterNumber': `GAS${Math.floor(1000000 + Math.random() * 9000000)}`,
          'consumption': `${Math.floor(5 + Math.random() * 20)} SCM`,
          'heatingValue': '8200 kcal/SCM'
        };
        break;
      case 'dth':
        extraDetails = {
          'subscriptionPlan': ['Basic', 'Standard', 'Premium'][Math.floor(Math.random() * 3)],
          'nextRechargeDate': new Date(dueDate).toLocaleDateString('en-IN')
        };
        break;
      case 'broadband':
        extraDetails = {
          'plan': `${Math.floor(30 + Math.random() * 970)} Mbps`,
          'dataUsed': `${Math.floor(10 + Math.random() * 900)} GB`,
          'validityPeriod': '30 Days'
        };
        break;
      case 'landline':
        extraDetails = {
          'planName': 'Unlimited Calling',
          'localCalls': `${Math.floor(10 + Math.random() * 200)} mins`,
          'stdCalls': `${Math.floor(5 + Math.random() * 100)} mins`
        };
        break;
    }
    
    return {
      billId,
      consumerNumber,
      customerName,
      amount,
      dueDate: dueDate.toISOString(),
      billDate: billDate.toISOString(),
      providerName: provider.name,
      providerType: provider.type,
      billPeriod: billPeriodFormatted,
      extraDetails
    };
  }
  
  // Process bill payment using wallet
  async payBill(
    userId: number,
    billId: string,
    providerId: string,
    consumerNumber: string,
    amount: number,
    processedById?: number
  ): Promise<PaymentResult> {
    try {
      // Find the provider to verify it exists
      const provider = providers.find(p => p.id === providerId);
      if (!provider) {
        return {
          success: false,
          message: "Invalid provider"
        };
      }
      
      // Check if amount is within the provider's allowed range
      if (amount < provider.minAmount || amount > provider.maxAmount) {
        return {
          success: false,
          message: `Payment amount must be between ₹${provider.minAmount} and ₹${provider.maxAmount}`
        };
      }
      
      // Attempt to deduct from wallet
      try {
        await walletService.deductFunds(userId, amount, provider.type, `Bill payment: ${provider.name} - ${consumerNumber}`);
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : "Failed to process payment from wallet"
        };
      }
      
      // Get the latest transaction for this payment
      const transactions = await walletService.getTransactionHistory(userId);
      const transaction = transactions[0]; // Latest transaction
      
      // Generate receipt information
      const receiptNumber = `RCPT-${uuidv4().substring(0, 8).toUpperCase()}`;
      const paidDate = new Date();
      
      // Calculate and distribute commissions based on transaction amount
      try {
        // Get the user profile to check if they are a service agent or regular user
        const user = await storage.getUser(userId);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // If the user is a service agent, process commissions directly
        if (user.userType === 'service_agent') {
          await storage.calculateCommissions(provider.type, transaction.id, amount, provider.name);
        } 
        // If a service agent processed the transaction for a customer
        else if (processedById) {
          const serviceAgentId = processedById;
          const serviceAgent = await storage.getUser(serviceAgentId);
          
          if (!serviceAgent || serviceAgent.userType !== 'service_agent') {
            console.error('Invalid service agent for commission processing');
          } else {
            // Create a transaction specifically for the service agent
            const agentTransaction = await storage.createTransaction({
              userId: serviceAgentId,
              amount,
              type: 'credit',
              description: `${provider.type} bill payment processed for ${consumerNumber}`,
              serviceType: provider.type
            });
            
            // Get the service agent's hierarchy chain
            const parentChain = await storage.getParentChain(serviceAgentId);
            
            // Get the commission config for this service type and provider
            const config = await storage.getCommissionConfigByService(provider.type, provider.name);
            
            if (config) {
              // Distribute commissions to each person in the hierarchy
              await storage.distributeCommission(
                serviceAgentId, 
                parentChain, 
                agentTransaction.id, 
                provider.type, 
                agentTransaction.id, 
                amount, 
                config
              );
            }
          }
        } 
        // Auto-find a service agent for commission distribution (customer without a service agent)
        else if (user.userType === 'customer') {
          // Look for a service agent in the user's pincode area
          const serviceAgents = await storage.listUsers({ userType: 'service_agent' });
          let serviceAgentId: number | null = null;
          
          // If the user has a pincode, try to find a service agent in the same pincode
          if (user.pincode) {
            const sameAreaAgent = serviceAgents.find(agent => agent.pincode === user.pincode);
            if (sameAreaAgent) {
              serviceAgentId = sameAreaAgent.id;
            }
          }
          
          // If no service agent was found, use the first one
          if (!serviceAgentId && serviceAgents.length > 0) {
            serviceAgentId = serviceAgents[0].id;
          }
          
          if (serviceAgentId) {
            const serviceAgent = await storage.getUser(serviceAgentId);
            
            if (!serviceAgent || serviceAgent.userType !== 'service_agent') {
              console.error('Invalid service agent for commission processing');
            } else {
              // Create a transaction specifically for the service agent
              const agentTransaction = await storage.createTransaction({
                userId: serviceAgentId,
                amount,
                type: 'credit',
                description: `${provider.type} bill payment processed for ${consumerNumber}`,
                serviceType: provider.type
              });
              
              // Get the service agent's hierarchy chain
              const parentChain = await storage.getParentChain(serviceAgentId);
              
              // Get the commission config for this service type and provider
              const config = await storage.getCommissionConfigByService(provider.type, provider.name);
              
              if (config) {
                // Distribute commissions to each person in the hierarchy
                await storage.distributeCommission(
                  serviceAgentId, 
                  parentChain, 
                  agentTransaction.id, 
                  provider.type, 
                  agentTransaction.id, 
                  amount, 
                  config
                );
              }
            }
          } else {
            console.log('No service agent available for commission processing');
          }
        }
      } catch (commissionError) {
        console.error('Error processing commissions:', commissionError);
        // We don't want to fail the whole payment if just commission distribution fails
      }
      
      return {
        success: true,
        transactionId: transaction.id,
        receiptNumber: receiptNumber,
        paidAmount: amount,
        paidDate: paidDate
      };
    } catch (error) {
      console.error("Bill payment error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to process bill payment"
      };
    }
  }
}

export const utilityService = new UtilityService();