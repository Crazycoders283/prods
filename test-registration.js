import dotenv from 'dotenv';
import User from './backend/models/user.model.js';

// Load environment variables
dotenv.config();

async function testRegistration() {
  console.log('🧪 Testing User Registration');
  console.log('==========================');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`, // Generate unique email
    password: 'password12345'
  };
  
  console.log(`📝 Test user data (unique email): ${testUser.email}`);
  
  try {
    console.log('⏳ Attempting to register user...');
    const user = await User.create(testUser);
    
    console.log('✅ User registration successful!');
    console.log('User data:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
    
    return true;
  } catch (error) {
    console.error('❌ User registration failed');
    console.error('Error details:', error);
    
    // Check if error is from Supabase
    if (error.error) {
      console.error('Supabase error:', error.error);
      console.error('Supabase error message:', error.message);
      console.error('Supabase error status:', error.status);
    }
    
    return false;
  }
}

// Run the test
testRegistration()
  .then(success => {
    console.log('\n🔍 Test result:', success ? 'PASSED' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
