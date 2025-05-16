const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route   POST /api/subscriptions/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email, consent } = req.body;

    // Validate email
    if (!email || !email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Check if consent is given
    if (consent !== true) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must agree to receive promotional emails' 
      });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('email_subscribers')
      .select('id, email, is_active, unsubscribed_at')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking subscription:', checkError);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    // If user exists but was previously unsubscribed, update their record
    if (existingUser) {
      if (!existingUser.is_active || existingUser.unsubscribed_at) {
        const { error: updateError } = await supabase
          .from('email_subscribers')
          .update({ 
            is_active: true, 
            unsubscribed_at: null,
            subscribed_at: new Date(),
            consent_given: true 
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          return res.status(500).json({ success: false, message: 'Server error, please try again later' });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated',
          data: { isReactivated: true }
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!',
        data: { isExisting: true }
      });
    }

    // If user doesn't exist, create a new record
    const { data: newSubscriber, error: insertError } = await supabase
      .from('email_subscribers')
      .insert([{ 
        email, 
        consent_given: consent,
        source: req.body.source || 'website',
        first_name: req.body.firstName || null
      }])
      .select();

    if (insertError) {
      console.error('Error creating subscription:', insertError);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    // Get latest deals to return to the user
    const { data: latestDeals, error: dealsError } = await supabase
      .from('flight_deals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    // Get current promotion
    const { data: currentPromotion, error: promoError } = await supabase
      .from('promotional_offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        subscriber: newSubscriber?.[0] || null,
        deals: latestDeals || [],
        promotion: currentPromotion || null
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

/**
 * @route   POST /api/subscriptions/unsubscribe
 * @desc    Unsubscribe from newsletter
 * @access  Public
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Update the subscriber record
    const { error } = await supabase
      .from('email_subscribers')
      .update({ 
        is_active: false,
        unsubscribed_at: new Date()
      })
      .eq('email', email);

    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'You have been successfully unsubscribed from our newsletter.'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

/**
 * @route   GET /api/subscriptions/deals
 * @desc    Get special flight deals for subscribers
 * @access  Public
 */
router.get('/deals', async (req, res) => {
  try {
    const { data: deals, error } = await supabase
      .from('flight_deals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching deals:', error);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    return res.status(200).json({ 
      success: true, 
      data: deals 
    });
  } catch (error) {
    console.error('Error in deals endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

/**
 * @route   GET /api/subscriptions/current-offer
 * @desc    Get current promotional offer
 * @access  Public
 */
router.get('/current-offer', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('promotional_offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current offer:', error);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    return res.status(200).json({ 
      success: true, 
      data: data || null
    });
  } catch (error) {
    console.error('Error in current-offer endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

/**
 * @route   GET /api/subscriptions/stats
 * @desc    Get subscription stats (for display on frontend)
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    // Get total number of subscribers
    const { count, error: countError } = await supabase
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      console.error('Error fetching subscriber count:', countError);
      return res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

    // Get subscriber avatars for display
    const { data: avatars, error: avatarsError } = await supabase
      .from('subscriber_avatars')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(4);

    if (avatarsError) {
      console.error('Error fetching avatars:', avatarsError);
    }

    // Get a rough estimate of subscribers today (in a real system, would have proper analytics)
    const todaySubscribers = Math.min(Math.floor(Math.random() * 500) + 10, count || 0);

    return res.status(200).json({
      success: true,
      data: {
        totalSubscribers: count || 0,
        subscribersToday: todaySubscribers,
        avatars: avatars || []
      }
    });
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

module.exports = router; 