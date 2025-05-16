import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need admin privileges

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function verifyTableStructure() {
  try {
    console.log('🔍 Verifying Supabase tables structure');
    console.log('======================================');
    
    // Use raw SQL to query the table structure directly
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_string: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
        ORDER BY ordinal_position;
      `
    });
    
    if (error) {
      console.error('Error executing SQL query:', error);
      return false;
    }
    
    console.log('Users Table Structure:');
    console.table(data);
    
    // Verify required columns exist
    const requiredColumns = ['id', 'first_name', 'last_name', 'email', 'password', 'role'];
    const foundColumns = data.map(col => col.column_name);
    
    const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col));
    if (missingColumns.length > 0) {
      console.error('❌ Missing required columns:', missingColumns);
      return false;
    }
    
    console.log('✅ All required columns exist');
    
    // Try refreshing the schema cache
    console.log('\n🔄 Attempting to refresh schema cache...');
    const refreshResult = await supabase.rpc('exec_sql', { 
      sql_string: 'SELECT pg_catalog.pg_reload_conf();'
    });
    
    if (refreshResult.error) {
      console.error('Error refreshing schema:', refreshResult.error);
    } else {
      console.log('✅ Schema refresh command executed');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

verifyTableStructure()
  .then(success => {
    if (success) {
      console.log('\n✅ Table structure verification completed successfully');
    } else {
      console.log('\n❌ Table structure verification failed');
    }
    process.exit(success ? 0 : 1);
  });
