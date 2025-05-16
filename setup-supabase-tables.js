import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Note: we need service role key for schema operations

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

async function setupTables() {
  try {
    console.log('Reading SQL schema file...');
    const sqlContent = fs.readFileSync('./supabase-tables-setup.sql', 'utf8');

    console.log('Connected to Supabase, executing SQL...');
    const { error } = await supabase.rpc('exec_sql', { sql_string: sqlContent });

    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    }

    console.log('SQL schema executed successfully!');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

async function verifyTables() {
  try {
    console.log('\nVerifying tables were created properly...');
    
    // Test if users table exists with expected columns
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email')
      .limit(1);
    
    if (error) {
      console.error('Error checking tables:', error);
      return false;
    }
    
    console.log('✅ Users table verified with correct columns');
    return true;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

// Execute setup and verification
(async () => {
  console.log('🚀 Setting up Supabase tables...');
  const setupSuccess = await setupTables();
  
  if (setupSuccess) {
    const verifySuccess = await verifyTables();
    console.log('\n🔍 Final result:', verifySuccess ? 'SUCCESS' : 'VERIFICATION FAILED');
  } else {
    console.log('\n🔍 Final result: SETUP FAILED');
  }
  
  process.exit(0);
})();
