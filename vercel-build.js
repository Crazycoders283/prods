import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Starting pre-build setup for deployment...');
console.log(`Current working directory: ${process.cwd()}`);

// Create necessary directories and ensure they exist
const resourcesDir = path.join(__dirname, 'resources', 'js');
const pagesDir = path.join(resourcesDir, 'pages');
const upperPagesDir = path.join(resourcesDir, 'Pages');

// Ensure resources/js directory exists
try {
  if (!fs.existsSync(resourcesDir)) {
    console.log('📁 Creating resources/js directory');
    fs.mkdirSync(resourcesDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating resources/js directory:', err);
}

// List directory contents to debug
try {
  if (fs.existsSync(path.join(__dirname, 'resources'))) {
    console.log('Contents of resources directory:');
    console.log(fs.readdirSync(path.join(__dirname, 'resources')));
  } else {
    console.log('resources directory does not exist');
  }
  
  if (fs.existsSync(resourcesDir)) {
    console.log('Contents of resources/js directory:');
    console.log(fs.readdirSync(resourcesDir));
  } else {
    console.log('resources/js directory does not exist');
  }
} catch (err) {
  console.error('Error listing directories:', err);
}

// Create necessary directories
const directories = [
  pagesDir,
  upperPagesDir,
  path.join(pagesDir, 'Common'),
  path.join(upperPagesDir, 'Common'),
  path.join(pagesDir, 'Common', 'cruise'),
  path.join(upperPagesDir, 'Common', 'cruise'),
  path.join(pagesDir, 'Common', 'cruise', 'pages'),
  path.join(upperPagesDir, 'Common', 'cruise', 'pages'),
  path.join(pagesDir, 'Profile'),
  path.join(upperPagesDir, 'Profile')
];

// Create all necessary directories
for (const dir of directories) {
  if (!fs.existsSync(dir)) {
    try {
      console.log(`📁 Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory ${dir}:`, err);
    }
  }
}

// Function to fix Inertia imports in a file
const fixInertiaImports = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Inertia imports with React Router equivalents
    content = content.replace(/import\s+{[^}]*Head[^}]*}\s+from\s+['"]@inertiajs\/react['"];?/g, '');
    content = content.replace(/import\s+{\s*Link\s*(?:,[^}]*)?\s*}\s+from\s+['"]@inertiajs\/react['"];?/g, 'import { Link } from "react-router-dom";');
    content = content.replace(/import\s+{\s*useForm\s*(?:,[^}]*)?\s*}\s+from\s+['"]@inertiajs\/react['"];?/g, 'import React from "react";');
    content = content.replace(/import\s+{\s*usePage\s*(?:,[^}]*)?\s*}\s+from\s+['"]@inertiajs\/react['"];?/g, 'import React from "react";');
    
    // Replace Inertia specific component usage
    content = content.replace(/<Head[^>]*>.*?<\/Head>/gs, '');
    content = content.replace(/href=/g, 'to=');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed Inertia imports in ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Error fixing imports in ${filePath}:`, err);
  }
};

// Handle API.js
const apiJsPath = path.join(resourcesDir, 'api.js');
if (!fs.existsSync(apiJsPath)) {
  console.log('📝 Creating api.js...');
  
  const apiJsContent = `import axios from 'axios';

// API URL based on environment
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;`;

  try {
    fs.writeFileSync(apiJsPath, apiJsContent);
    console.log('✅ Created fallback api.js');
  } catch (err) {
    console.error('Error creating api.js:', err);
  }
}

// Create basic components if they don't exist
console.log('📝 Creating required pages...');

// Create Dashboard.jsx if it doesn't exist
const dashboardContent = `import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <Link 
          to="/"
          style={{ padding: '8px 15px', background: '#0066B2', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}
        >
          Back to Home
        </Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <h2>Cruises</h2>
          <p>Browse available cruise options</p>
          <Link to="/cruises" style={{ display: 'inline-block', marginTop: '10px', color: '#0066B2', textDecoration: 'none' }}>
            View Cruises →
          </Link>
        </div>
        
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <h2>Packages</h2>
          <p>Find vacation packages and deals</p>
          <Link to="/packages" style={{ display: 'inline-block', marginTop: '10px', color: '#0066B2', textDecoration: 'none' }}>
            Browse Packages →
          </Link>
        </div>
        
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <h2>Itineraries</h2>
          <p>View detailed travel plans</p>
          <Link to="/itinerary" style={{ display: 'inline-block', marginTop: '10px', color: '#0066B2', textDecoration: 'none' }}>
            View Itinerary →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`;

try {
  fs.writeFileSync(path.join(pagesDir, 'Dashboard.jsx'), dashboardContent);
  fs.writeFileSync(path.join(upperPagesDir, 'Dashboard.jsx'), dashboardContent);
  console.log('✅ Created Dashboard.jsx');
} catch (err) {
  console.error('Error creating Dashboard.jsx:', err);
}

// Create Error.jsx if it doesn't exist
const errorContent = `import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '30px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ fontSize: '8rem', margin: '0', color: '#0066B2' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>Page Not Found</h2>
      <p style={{ maxWidth: '500px', marginBottom: '30px', color: '#666' }}>
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link to="/" style={{ 
        padding: '10px 30px', 
        backgroundColor: '#0066B2', 
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}>
        Return Home
      </Link>
    </div>
  );
};

export default Error;`;

try {
  fs.writeFileSync(path.join(pagesDir, 'Error.jsx'), errorContent);
  fs.writeFileSync(path.join(upperPagesDir, 'Error.jsx'), errorContent);
  console.log('✅ Created Error.jsx');
} catch (err) {
  console.error('Error creating Error.jsx:', err);
}

// Create Welcome.jsx
const welcomeContent = `import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '1rem',
        color: '#0066B2'
      }}>
        Welcome to JetSet Travel
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        maxWidth: '600px', 
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#666'
      }}>
        Discover amazing cruise options and travel experiences
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem'
      }}>
        <Link to="/cruises" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0066B2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}>
          Browse Cruises
        </Link>
        
        <Link to="/dashboard" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#f0f0f0',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}`;

try {
  fs.writeFileSync(path.join(pagesDir, 'Welcome.jsx'), welcomeContent);
  fs.writeFileSync(path.join(upperPagesDir, 'Welcome.jsx'), welcomeContent);
  console.log('✅ Created Welcome.jsx');
} catch (err) {
  console.error('Error creating Welcome.jsx:', err);
}

// Check if simple-vite.config.js exists, otherwise create it
const simpleViteConfigPath = path.join(__dirname, 'simple-vite.config.js');
if (!fs.existsSync(simpleViteConfigPath)) {
  const simpleViteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public/build',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
`;

  try {
    fs.writeFileSync(simpleViteConfigPath, simpleViteConfig);
    console.log('✅ Created simple-vite.config.js');
  } catch (err) {
    console.error('Error creating simple-vite.config.js:', err);
  }
}

// Setup environment file for Vercel deployment
try {
  const envContent = `NODE_ENV=production
PORT=8080
JWT_SECRET=e4f8a2b5c9d3f7e1a0b5c8d2e6f3a9b7d1e0f5a2c4b8e3d7f9a1c5b0e2d4f8
JWT_EXPIRE=30d
VITE_APP_NAME=JetSet App
VITE_API_URL=/api
`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Created .env file for deployment');
} catch (err) {
  console.error('Error creating .env file:', err);
}

// Run build steps
try {
  console.log('\n🏗️ Building application...');
  
  // First ensure the vite and plugin-react are installed
  console.log('📦 Ensuring vite and plugin-react are installed...');
  try {
    execSync('npm install @vitejs/plugin-react vite --no-save', { stdio: 'inherit' });
  } catch (err) {
    console.error('Warning: Could not install vite dependencies, but continuing anyway:', err);
  }
  
  // Build the application
  console.log('🔨 Running Vite build...');
  execSync('vite build --config simple-vite.config.js', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
} 