import express from 'express';
import emailService from '../services/emailService.js';

const router = express.Router();

// Send callback confirmation email
router.post('/send-callback-confirmation', async (req, res) => {
  console.log('🔶 Email route hit: /send-callback-confirmation');
  console.log('🔶 Request body:', req.body);
  
  try {
    const { data, type } = req.body;
    
    if (!data || !type) {
      console.log('❌ Missing required fields:', { data, type });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: data and type' 
      });
    }
    
    console.log('✅ Sending email with data:', { type, data: { ...data, email: data.email || 'Not provided' } });
    const result = await emailService.sendCallbackConfirmation(data, type);
    console.log('✅ Email sent successfully:', result);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully', 
      data: result 
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred while sending email' 
    });
  }
});

export default router;
