import { fileURLToPath } from 'url';
import supabase from '../config/supabase.js';

/**
 * Migration script to add Google authentication fields to the users table
 */
const addGoogleAuthFields = async () => {
  try {
    console.log('Starting migration: Adding Google authentication fields to users table...');
    
    // Check if the column google_id already exists
    const { data: columns, error: columnError } = await supabase
      .from('users')
      .select()
      .limit(1);
    
    if (columnError) {
      console.error('Error checking users table:', columnError);
      return false;
    }
    
    let needToAddColumns = true;
    
    // If we have any data, check if the google_id property exists
    if (columns && columns.length > 0 && columns[0].hasOwnProperty('google_id')) {
      console.log('Google authentication fields already exist. Skipping migration.');
      needToAddColumns = false;
    }
    
    if (needToAddColumns) {
      // Add google_id column
      const { error: googleIdError } = await supabase.rpc('add_column_if_not_exists', {
        table_name: 'users',
        column_name: 'google_id',
        column_type: 'text'
      });
      
      if (googleIdError) {
        console.error('Error adding google_id column:', googleIdError);
        return false;
      }
      
      // Add is_google_account column with default value false
      const { error: isGoogleError } = await supabase.rpc('add_column_if_not_exists', {
        table_name: 'users',
        column_name: 'is_google_account',
        column_type: 'boolean default false'
      });
      
      if (isGoogleError) {
        console.error('Error adding is_google_account column:', isGoogleError);
        return false;
      }
      
      console.log('✅ Migration successful: Google authentication fields added to users table');
    }
    
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