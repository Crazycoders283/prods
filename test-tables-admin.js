import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  if (!supabaseUrl) console.error('   - SUPABASE_URL is not set');
  if (!supabaseKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY is not set');
  process.exit(1);
}

// Initialize Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testTables() {
  console.log('🔍 Testing Database Tables (Admin Mode)');
  console.log('=====================================\n');

  try {
    // Test callback_requests table
    console.log('1️⃣ Testing callback_requests table...');
    const { data: callbackCount, error: callbackError } = await supabase
      .from('callback_requests')
      .select('count', { count: 'exact' });
    
    if (callbackError) throw callbackError;
    console.log('✅ callback_requests table is working\n');

    // Test quote_requests table
    console.log('2️⃣ Testing quote_requests table...');
    const { data: quoteCount, error: quoteError } = await supabase
      .from('quote_requests')
      .select('count', { count: 'exact' });
    
    if (quoteError) throw quoteError;
    console.log('✅ quote_requests table is working\n');

    // Test contact_messages table
    console.log('3️⃣ Testing contact_messages table...');
    const { data: messageCount, error: messageError } = await supabase
      .from('contact_messages')
      .select('count', { count: 'exact' });
    
    if (messageError) throw messageError;
    console.log('✅ contact_messages table is working\n');

    // Test bookings table
    console.log('4️⃣ Testing bookings table...');
    const { data: bookingCount, error: bookingError } = await supabase
      .from('bookings')
      .select('count', { count: 'exact' });
    
    if (bookingError) throw bookingError;
    console.log('✅ bookings table is working\n');

    // Test inserting a callback request
    console.log('5️⃣ Testing callback request insertion...');
    const { data: insertData, error: insertError } = await supabase
      .from('callback_requests')
      .insert([
        {
          name: 'Test User',
          phone: '+1234567890',
          email: 'test@example.com',
          preferred_time: new Date().toISOString(),
          message: 'This is a test callback request'
        }
      ])
      .select();

    if (insertError) {
      console.log('❌ Error inserting callback request:', insertError.message);
    } else {
      console.log('✅ Successfully inserted callback request');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }

  console.log('\n✨ All tests completed!');
}

// Run the tests
testTables(); 