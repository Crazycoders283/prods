import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get API key from environment variable
const apiKey = process.env.RESEND_API_KEY;
console.log('API Key from env:', apiKey ? 'Found (not shown for security)' : 'Not found');

// Initialize Resend with API key
const resend = new Resend(apiKey);

// Simple test function to send an email
async function testEmail() {
  try {
    const data = {
      from: 'JetSetGo <onboarding@resend.dev>',
      to: ['jetsetters721@gmail.com'],  // The email registered with Resend
      subject: 'Test Email from JetSetGo',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0066b2; padding: 20px; text-align: center; color: white;">
            <h1>Test Email</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hello there,</p>
            <p>This is a test email from JetSetGo to verify that the email service is working correctly.</p>
            <p>If you're seeing this, the email service is properly configured!</p>
            <p>Test timestamp: ${new Date().toISOString()}</p>
            <p>Best regards,<br>The JetSetGo Team</p>
          </div>
        </div>
      `,
    };

    console.log('Sending test email...');
    const response = await resend.emails.send(data);
    console.log('Email sent successfully!', response);
    return response;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
}

// Execute the test
testEmail()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test failed:', error))
  .finally(() => process.exit(0));
