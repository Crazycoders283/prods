import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Supabase Connection Test');
console.log('==========================');

// Check environment variables
console.log('\n1️⃣ Environment Variables:');
if (!supabaseUrl) {
  console.error('❌ SUPABASE_URL is not set in your .env file');
} else {
  console.log('✅ SUPABASE_URL is set:', supabaseUrl);
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY is not set in your .env file');
} else {
  console.log('✅ SUPABASE_ANON_KEY is set (length:', supabaseKey.length, 'characters)');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
console.log('\n2️⃣ Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Supabase client created');

// Test connection
console.log('\n3️⃣ Testing connection to Supabase...');
async function testConnection() {
  try {
    // First, try a simple health check
    console.log('   - Performing health check...');
    const { data: healthData, error: healthError } = await supabase.from('_health').select('*').limit(1);
    
    if (healthError) {
      console.log('   - Health check failed (this is normal if the _health table doesn\'t exist)');
    } else {
      console.log('   - Health check successful');
    }
    
    // Try to query the users table
    console.log('   - Testing users table...');
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('❌ Error querying users table:', error.message);
      
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('\n🔧 Database Setup Required:');
        console.log('The users table does not exist in your Supabase project.');
        console.log('You need to run the SQL setup script to create the necessary tables.');
        console.log('\nTo set up your database:');
        console.log('1. Log in to your Supabase dashboard: https://app.supabase.io');
        console.log('2. Select your project');
        console.log('3. Go to the SQL Editor');
        console.log('4. Copy the contents of supabase-setup.sql');
        console.log('5. Paste and run the SQL script');
      }
      
      return false;
    }
    
    console.log('✅ Successfully queried users table');
    console.log('✅ Supabase connection is working correctly!');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Supabase is running correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
}); 