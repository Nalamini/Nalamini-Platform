/**
 * This script helps in setting up WhatsApp message templates
 * 
 * Usage:
 * 1. Get your WhatsApp API credentials from Meta Business Dashboard
 * 2. Set WHATSAPP_API_KEY and WHATSAPP_PHONE_NUMBER_ID in environment variables
 * 3. Run this script with: ts-node server/setup-whatsapp-templates.ts
 * 
 * This will output the API calls needed to create the templates,
 * which you can then use in the Meta Business Dashboard or make the API calls directly.
 */

import axios from 'axios';

// Define template structures
const templates = [
  {
    name: 'transaction_update',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Transaction Update'
      },
      {
        type: 'BODY',
        text: 'Hello {{1}},\n\nYour transaction (ID: {{2}}) for {{3}} has been processed. Service: {{4}}\n\nStatus: {{5}}\nTime: {{6}}\n\nIf you didn\'t authorize this transaction or have questions, please contact our support team.\n\nThank you,\nTamil Nadu Service Platform'
      },
      {
        type: 'FOOTER',
        text: 'This is an automated message - please do not reply directly.'
      }
    ]
  },
  {
    name: 'commission_earned',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Commission Earned'
      },
      {
        type: 'BODY',
        text: 'Hello {{1}},\n\nYou have earned a commission on transaction {{2}}.\n\nTransaction amount: {{3}}\nCommission earned: {{4}}\nTime: {{5}}\n\nThe amount has been added to your wallet balance.\n\nThank you,\nTamil Nadu Service Platform'
      },
      {
        type: 'FOOTER',
        text: 'This is an automated message - please do not reply directly.'
      }
    ]
  },
  {
    name: 'recharge_update',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Recharge Update'
      },
      {
        type: 'BODY',
        text: 'Hello {{1}},\n\nYour recharge for mobile number {{2}} for amount {{3}} with {{4}} has been processed.\n\nStatus: {{5}}\nTime: {{6}}\n\nIf you didn\'t authorize this recharge or have questions, please contact our support team.\n\nThank you,\nTamil Nadu Service Platform'
      },
      {
        type: 'FOOTER',
        text: 'This is an automated message - please do not reply directly.'
      }
    ]
  },
  {
    name: 'booking_update',
    category: 'UTILITY',
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Booking Update'
      },
      {
        type: 'BODY',
        text: 'Hello {{1}},\n\nYour booking (ID: {{2}}) for {{3}} with amount {{4}} has been processed.\n\nStatus: {{5}}\nTime: {{6}}\n\nIf you didn\'t authorize this booking or have questions, please contact our support team.\n\nThank you,\nTamil Nadu Service Platform'
      },
      {
        type: 'FOOTER',
        text: 'This is an automated message - please do not reply directly.'
      }
    ]
  }
];

// Main function to print the template creation instructions
async function printTemplateCreationGuide() {
  console.log('============================================');
  console.log('WhatsApp Template Creation Guide');
  console.log('============================================');
  console.log('\nTo create these templates, you\'ll need to:');
  console.log('1. Go to the Meta Business Dashboard');
  console.log('2. Navigate to the WhatsApp Business section');
  console.log('3. Go to the Message Templates section');
  console.log('4. Create each of the following templates');
  console.log('\nHere are the details for each template:');

  // Print details for each template
  templates.forEach(template => {
    console.log(`\n----- ${template.name} -----`);
    console.log(`Category: ${template.category}`);
    console.log(`Language: ${template.language}`);
    console.log('\nComponents:');

    template.components.forEach(component => {
      console.log(`\n${component.type}:`);
      if (component.format) {
        console.log(`Format: ${component.format}`);
      }
      console.log(`Text: ${component.text}`);
    });

    console.log('\n--------------------------');
  });

  console.log('\nAPI Example (requires WHATSAPP_API_KEY and WHATSAPP_PHONE_NUMBER_ID):');
  
  if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('\nAPI credentials found! Here\'s how to create these templates via API:');
    
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiKey = process.env.WHATSAPP_API_KEY;
    
    templates.forEach(template => {
      console.log(`\n----- Create ${template.name} via API -----`);
      console.log(`curl -X POST https://graph.facebook.com/v18.0/${phoneNumberId}/message_templates`);
      console.log(`-H "Authorization: Bearer ${apiKey.substring(0, 5)}..."`);
      console.log(`-H "Content-Type: application/json"`);
      console.log(`-d '${JSON.stringify({
        name: template.name,
        category: template.category,
        language: template.language,
        components: template.components
      }, null, 2)}'`);
    });
  } else {
    console.log('\nNo API credentials found in environment variables.');
    console.log('Set WHATSAPP_API_KEY and WHATSAPP_PHONE_NUMBER_ID to see API examples.');
  }

  console.log('\n============================================');
  console.log('End of WhatsApp Template Creation Guide');
  console.log('============================================');
}

// Execute the guide
printTemplateCreationGuide().catch(console.error);