import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Database Tables');
console.log('========================');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
    try {
        // Test callback_requests table
        console.log('\n1️⃣ Testing callback_requests table...');
        const { data: callbackData, error: callbackError } = await supabase
            .from('callback_requests')
            .select('count')
            .single();
        
        if (callbackError) {
            console.error('❌ Error with callback_requests:', callbackError.message);
        } else {
            console.log('✅ callback_requests table is working');
        }

        // Test quote_requests table
        console.log('\n2️⃣ Testing quote_requests table...');
        const { data: quoteData, error: quoteError } = await supabase
            .from('quote_requests')
            .select('count')
            .single();
        
        if (quoteError) {
            console.error('❌ Error with quote_requests:', quoteError.message);
        } else {
            console.log('✅ quote_requests table is working');
        }

        // Test contact_messages table
        console.log('\n3️⃣ Testing contact_messages table...');
        const { data: contactData, error: contactError } = await supabase
            .from('contact_messages')
            .select('count')
            .single();
        
        if (contactError) {
            console.error('❌ Error with contact_messages:', contactError.message);
        } else {
            console.log('✅ contact_messages table is working');
        }

        // Test bookings table
        console.log('\n4️⃣ Testing bookings table...');
        const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('count')
            .single();
        
        if (bookingError) {
            console.error('❌ Error with bookings:', bookingError.message);
        } else {
            console.log('✅ bookings table is working');
        }

        // Test inserting a sample callback request
        console.log('\n5️⃣ Testing callback request insertion...');
        const { data: insertData, error: insertError } = await supabase
            .from('callback_requests')
            .insert([
                {
                    name: 'Test User',
                    phone: '+1234567890',
                    email: 'test@example.com',
                    message: 'This is a test callback request'
                }
            ])
            .select();

        if (insertError) {
            console.error('❌ Error inserting callback request:', insertError.message);
        } else {
            console.log('✅ Successfully inserted callback request');
            console.log('Sample data:', insertData);
        }

    } catch (error) {
        console.error('❌ General error:', error.message);
    }
}

// Run the tests
testTables().then(() => {
    console.log('\n✨ All tests completed!');
}); 