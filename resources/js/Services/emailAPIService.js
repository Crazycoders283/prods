/**
 * Service for handling email API calls
 */
const emailAPIService = {
  /**
   * Send a callback confirmation email
   * @param {Object} data - The callback data
   * @param {string} type - Type of callback ('cruise', 'package', 'rental')
   * @returns {Promise} - The response from the API
   */
  sendCallbackConfirmation: async (data, type) => {
    try {
      console.log('Sending callback confirmation email', { data, type });
      
      // First, try a direct API call to the test endpoint to verify connectivity
      // This is a simple endpoint that should work if the API is accessible
      try {
        await fetch(import.meta.env.VITE_APP_URL+'test', { method: 'GET' })
          .then(res => console.log('API connectivity test:', res.ok ? 'Success' : 'Failed'));
      } catch (e) {
        console.log('API connectivity test failed:', e.message);
      }
      
      // Try a relative URL approach which avoids CORS issues
      // If the app is served from the same origin as the API
      const apiUrl = '/api/email/send-callback-confirmation';
      console.log('Using API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, type }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error sending confirmation email:', errorText);
        throw new Error(`Email API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Email confirmation sent successfully:', responseData);
      return responseData;
    } catch (error) {
      console.error('Unexpected error in sendCallbackConfirmation:', error);
      // We don't want to block the main flow if email fails
      return { success: false, error: error.message };
    }
  }
};

export default emailAPIService;
