import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Set environment to production
process.env.NODE_ENV = 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Preparing application for Vercel deployment...');

// Ensure API directories exist in the build output
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Copy API folders to dist for Vercel deployment
const copyApiFiles = () => {
  console.log('📋 Copying API files to dist folder...');
  
  // Create the API directory structure in dist
  ensureDirectoryExists(path.join(__dirname, 'dist', 'api'));
  ensureDirectoryExists(path.join(__dirname, 'dist', 'api', 'auth'));
  
  // Copy the API handler files
  if (fs.existsSync(path.join(__dirname, 'api', 'index.js'))) {
    fs.copyFileSync(
      path.join(__dirname, 'api', 'index.js'), 
      path.join(__dirname, 'dist', 'api', 'index.js')
    );
  }
  
  if (fs.existsSync(path.join(__dirname, 'api', 'auth', 'register.js'))) {
    fs.copyFileSync(
      path.join(__dirname, 'api', 'auth', 'register.js'), 
      path.join(__dirname, 'dist', 'api', 'auth', 'register.js')
    );
  }
  
  console.log('✅ API files copied successfully');
};

// Create _redirects file for SPA routing
const createRedirectsFile = () => {
  console.log('📝 Creating _redirects file for client-side routing...');
  
  const redirectsContent = `# Redirects for SPA routing
/api/*  /api/:splat  200
/*      /index.html  200`;
  
  fs.writeFileSync(path.join(__dirname, 'dist', '_redirects'), redirectsContent);
  console.log('✅ _redirects file created successfully');
};

// Validate Supabase tables
console.log('🔍 Verifying Supabase database tables...');
exec('node setup-supabase-tables.js', (error, stdout, stderr) => {
  console.log(stdout);
  if (error) {
    console.warn('⚠️ Error verifying Supabase tables:', error.message);
    console.log('⚠️ Deployment will continue, but database operations may fail');
  } else {
    console.log('✅ Supabase tables verified successfully');
  }
  
  // Copy API files to dist
  copyApiFiles();
  
  // Create redirects file
  createRedirectsFile();
  
  console.log('🎉 Vercel deployment preparation complete!');
});

// Run this script after the build is completed
export default function() {
  console.log('🚀 Vercel build script executed');
} 