import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';

/**
 * Migration script to add Google authentication fields to the users table
 */
const addGoogleAuthFields = async () => {
  try {
    console.log('Starting migration: Adding Google authentication fields to users table...');
    
    // Add google_id column
    const { error: googleIdError } = await supabase.rpc('exec_sql', {
      sql_string: `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS google_id text,
        ADD COLUMN IF NOT EXISTS is_google_account boolean DEFAULT false
      `
    });
    
    if (googleIdError) {
      console.error('Error adding Google auth columns:', googleIdError);
      return false;
    }
    
    console.log('✅ Migration successful: Google authentication fields added to users table');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

// Run migration if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  addGoogleAuthFields()
    .then((success) => {
      if (success) {
        console.log('Migration completed successfully');
        process.exit(0);
      } else {
        console.error('Migration failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}

export default addGoogleAuthFields; 