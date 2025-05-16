import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Using anon key which should have access

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function verifyTables() {
  try {
    console.log('🔍 Checking Supabase tables');
    console.log('==========================');
    
    // Try to perform a simple selection from the users table to check if it exists
    console.log('Checking users table...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (userError) {
      console.error('Error accessing users table:', userError);
      return false;
    }
    
    console.log('✅ Users table exists');
    console.log('Sample data structure:', userData && userData.length > 0 ? 
      Object.keys(userData[0]).join(', ') : 'No records found');
    
    // Try to insert a test user to verify column structure
    const testUserEmail = `test${Date.now()}@example.com`;
    console.log(`\nTrying to insert a test user with email: ${testUserEmail}`);
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        first_name: 'Test',
        last_name: 'User',
        email: testUserEmail,
        password: 'hashedpassword',
        role: 'user'
      })
      .select();
    
    if (insertError) {
      console.error('Error inserting test user:', insertError);
      return false;
    }
    
    console.log('✅ Successfully inserted test user');
    console.log('Inserted user data:', insertData[0]);
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

verifyTables()
  .then(success => {
    console.log('\n🔍 Final result:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  });
