import axios from 'axios';

export interface WhatsAppRecipient {
  phoneNumber: string;
  name: string;
}

export interface WhatsAppTemplateParams {
  [key: string]: string;
}

/**
 * WhatsApp Notification Service
 * 
 * This service handles sending notifications via WhatsApp using
 * Meta's WhatsApp Business API.
 */
export class WhatsAppService {
  private apiKey: string;
  private phoneNumberId: string;
  private baseUrl: string;
  private version: string;

  constructor() {
    // Check required environment variables
    if (!process.env.WHATSAPP_API_KEY) {
      console.warn('WHATSAPP_API_KEY is not set. WhatsApp notifications will not be sent.');
    }
    if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.warn('WHATSAPP_PHONE_NUMBER_ID is not set. WhatsApp notifications will not be sent.');
    }

    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.baseUrl = 'https://graph.facebook.com';
    this.version = 'v18.0'; // Current API version as of 2025
  }

  private isConfigured(): boolean {
    return !!(this.apiKey && this.phoneNumberId);
  }

  /**
   * Format phone number to international format
   * Expects input like: '9876543210' or '09876543210'
   * Returns: '919876543210' (assuming Indian numbers)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Handle Indian phone numbers
    // Remove leading 0 if present
    let formatted = digitsOnly.replace(/^0/, '');
    
    // Add country code (91 for India) if not already present
    if (!formatted.startsWith('91') && formatted.length === 10) {
      formatted = `91${formatted}`;
    }
    
    return formatted;
  }

  /**
   * Send a message using a template
   */
  public async sendTemplateMessage(
    recipient: WhatsAppRecipient,
    templateName: string,
    params: WhatsAppTemplateParams
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('WhatsApp service is not properly configured. Message not sent.');
      return false;
    }

    try {
      const formattedPhone = this.formatPhoneNumber(recipient.phoneNumber);
      const components = this.formatTemplateComponents(params);
      
      const url = `${this.baseUrl}/${this.version}/${this.phoneNumberId}/messages`;
      
      const data = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en'
          },
          components
        }
      };

      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(url, data, { headers });
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`WhatsApp message sent successfully to ${recipient.name} (${formattedPhone})`);
        return true;
      } else {
        console.error('Failed to send WhatsApp message:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Format template components from parameters
   */
  private formatTemplateComponents(params: WhatsAppTemplateParams): any[] {
    const components = [];
    
    // Body components (where most parameters go)
    if (Object.keys(params).length > 0) {
      const bodyParameters = Object.keys(params).map(key => ({
        type: 'text',
        text: params[key]
      }));
      
      components.push({
        type: 'body',
        parameters: bodyParameters
      });
    }
    
    return components;
  }

  /**
   * Send a transaction notification
   */
  public async sendTransactionNotification(
    recipient: WhatsAppRecipient,
    transactionId: string | number,
    amount: number,
    service: string,
    status: string,
    dateTime: string
  ): Promise<boolean> {
    const params = {
      1: recipient.name,
      2: transactionId.toString(),
      3: `₹${amount.toFixed(2)}`,
      4: service,
      5: status,
      6: dateTime
    };
    
    // Using a template for transaction notifications
    return this.sendTemplateMessage(recipient, 'transaction_update', params);
  }

  /**
   * Send a commission notification
   */
  public async sendCommissionNotification(
    recipient: WhatsAppRecipient,
    transactionId: string | number,
    amount: number,
    commissionAmount: number,
    dateTime: string
  ): Promise<boolean> {
    const params = {
      1: recipient.name,
      2: transactionId.toString(),
      3: `₹${amount.toFixed(2)}`,
      4: `₹${commissionAmount.toFixed(2)}`,
      5: dateTime
    };
    
    // Using a template for commission notifications
    return this.sendTemplateMessage(recipient, 'commission_earned', params);
  }

  /**
   * Send a recharge notification
   */
  public async sendRechargeNotification(
    recipient: WhatsAppRecipient,
    mobileNumber: string,
    amount: number,
    provider: string,
    status: string,
    dateTime: string
  ): Promise<boolean> {
    const params = {
      1: recipient.name,
      2: mobileNumber,
      3: `₹${amount.toFixed(2)}`,
      4: provider,
      5: status,
      6: dateTime
    };
    
    // Using a template for recharge notifications
    return this.sendTemplateMessage(recipient, 'recharge_update', params);
  }

  /**
   * Send a booking notification
   */
  public async sendBookingNotification(
    recipient: WhatsAppRecipient,
    bookingId: string | number,
    bookingType: string,
    amount: number,
    status: string,
    dateTime: string
  ): Promise<boolean> {
    const params = {
      1: recipient.name,
      2: bookingId.toString(),
      3: bookingType,
      4: `₹${amount.toFixed(2)}`,
      5: status,
      6: dateTime
    };
    
    // Using a template for booking notifications
    return this.sendTemplateMessage(recipient, 'booking_update', params);
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();