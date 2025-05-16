import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin access

console.log('🔍 Testing Database Connection and Setup');
console.log('=======================================');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabase() {
  try {
    console.log('\n1️⃣ Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .single();

    if (testError) {
      if (testError.message.includes('relation "public.users" does not exist')) {
        console.log('❌ Users table does not exist. Creating required tables...');
        await createTables();
      } else {
        throw testError;
      }
    } else {
      console.log('✅ Database connection successful');
      console.log('✅ Users table exists');
    }

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Create users table
    const { error: createError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable Row Level Security (RLS)
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Anyone can register" ON users 
        FOR INSERT WITH CHECK (true);

      CREATE POLICY "Users can view their own profile" ON users
        FOR SELECT USING (auth.uid() = id OR auth.role() = 'admin');

      CREATE POLICY "Users can update their own profile" ON users
        FOR UPDATE USING (auth.uid() = id OR auth.role() = 'admin');

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    if (createError) {
      throw createError;
    }

    console.log('✅ Users table created successfully');
    
    // Test table creation by inserting a test user
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'hashedpassword'
      });

    if (insertError) {
      throw insertError;
    }

    console.log('✅ Test user created successfully');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
}

// Run the test
testDatabase().then(() => {
  console.log('\n✅ Database setup complete!');
  process.exit(0);
}); 