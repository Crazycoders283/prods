import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Starting Render build setup...');
console.log(`Current directory: ${process.cwd()}`);

try {
  // Print out directory listing for debugging
  console.log('\n📁 Contents of current directory:');
  console.log(execSync('ls -la').toString());

  console.log('\n📦 Node.js and npm versions:');
  console.log(execSync('node -v && npm -v').toString());

  // Copy environment file for Render
  console.log('\n📝 Setting up environment file...');
  const envRenderPath = path.join(__dirname, '.env.render');
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envRenderPath)) {
    fs.copyFileSync(envRenderPath, envPath);
    console.log('✅ Copied .env.render to .env');
  } else {
    console.log('⚠️ No .env.render file found, creating .env file...');
    // Create a basic .env file if .env.render doesn't exist
    const basicEnvContent = `
# Server Configuration
NODE_ENV=production
PORT=10000

# Supabase Configuration
SUPABASE_URL=https://qqmagqwumjipdqvxbiqu.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Authentication
JWT_SECRET=e4f8a2b5c9d3f7e1a0b5c8d2e6f3a9b7d1e0f5a2c4b8e3d7f9a1c5b0e2d4f8
JWT_EXPIRE=30d

# Frontend Configuration
VITE_APP_NAME="JetSet App"
VITE_API_URL=/api
`;
    fs.writeFileSync(envPath, basicEnvContent);
    console.log('✅ Created new .env file');
  }

  // Create Pages directory and subdirectories
  const resourcesDir = path.join(__dirname, 'resources', 'js');
  console.log(`\n🔍 Checking resources directory: ${resourcesDir}`);
  if (fs.existsSync(resourcesDir)) {
    console.log('✅ Resources directory exists');
  } else {
    console.log('❌ Resources directory not found');
    process.exit(1);
  }

  // Log contents
  console.log('\n📁 Contents of resources/js directory:');
  console.log(fs.readdirSync(resourcesDir));

  const pagesDir = path.join(resourcesDir, 'Pages');
  const pagesAuthDir = path.join(pagesDir, 'Auth');

  // Create directories if they don't exist
  if (!fs.existsSync(pagesDir)) {
    console.log('📁 Creating Pages directory...');
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  if (!fs.existsSync(pagesAuthDir)) {
    console.log('📁 Creating Auth directory...');
    fs.mkdirSync(pagesAuthDir, { recursive: true });
  }

  // Copy files from lowercase pages to uppercase Pages
  const lowerPagesDir = path.join(resourcesDir, 'pages');
  if (fs.existsSync(lowerPagesDir)) {
    console.log('📋 Copying files from pages to Pages...');
    
    console.log('📁 Contents of pages directory:');
    console.log(fs.readdirSync(lowerPagesDir));
    
    // Copy function
    const copyDirRecursively = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        try {
          if (entry.isDirectory()) {
            copyDirRecursively(srcPath, destPath);
            console.log(`📁 Copied directory: ${entry.name}`);
          } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`✅ Copied file: ${srcPath} to ${destPath}`);
          }
        } catch (err) {
          console.error(`❌ Error copying ${srcPath}: ${err.message}`);
        }
      }
    };
    
    copyDirRecursively(lowerPagesDir, pagesDir);
  } else {
    console.log('⚠️ Lowercase pages directory not found');
  }

  console.log('\n📁 After copying, Contents of Pages directory:');
  if (fs.existsSync(pagesDir)) {
    console.log(fs.readdirSync(pagesDir));
  } else {
    console.log('❌ Pages directory still not found');
  }
  
  // Check and update app.jsx imports
  const appPath = path.join(resourcesDir, 'app.jsx');
  if (fs.existsSync(appPath)) {
    console.log('\n📝 Updating app.jsx...');
    let appContent = fs.readFileSync(appPath, 'utf8');
    appContent = appContent.replace(/from\s+['"]\.\/pages\//g, 'from \'./Pages/');
    fs.writeFileSync(appPath, appContent);
    console.log('✅ Updated app.jsx imports');
  } else {
    console.log('❌ app.jsx not found');
  }
  
  console.log('\n🔨 Installing dependencies...');
  // First try to install the required packages directly (most reliable)
  console.log('📦 Explicitly installing vite and plugin-react first...');
  execSync('npm install @vitejs/plugin-react vite --no-save', { stdio: 'inherit' });
  
  // Then install all packages
  console.log('📦 Installing all dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Use our simplified Vite config
  console.log('\n🔧 Using simplified vite config...');
  
  console.log('\n🏗️ Building application...');
  execSync('npx vite build --config simple-vite.config.js', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
} 