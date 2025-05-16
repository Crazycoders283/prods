import fs from 'fs';
import path from 'path';

// Function to fix Inertia imports in a file
const fixInertiaImports = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  
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
};

// Create Pages directory if it doesn't exist
const pagesDir = path.resolve('./resources/js/Pages');
const pagesAuthDir = path.resolve('./resources/js/Pages/Auth');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  console.log('Created Pages directory');
}

if (!fs.existsSync(pagesAuthDir)) {
  fs.mkdirSync(pagesAuthDir, { recursive: true });
  console.log('Created Pages/Auth directory');
}

// Copy files from pages to Pages
const sourcePagesDir = path.resolve('./resources/js/pages');
if (fs.existsSync(sourcePagesDir)) {
  // Copy main page files
  fs.readdirSync(sourcePagesDir).forEach(file => {
    const sourceFile = path.join(sourcePagesDir, file);
    
    // Skip directories except 'Auth'
    if (fs.statSync(sourceFile).isDirectory() && file !== 'Auth') {
      return;
    }
    
    // Skip the Auth directory itself
    if (file === 'Auth') {
      return;
    }
    
    const targetFile = path.join(pagesDir, file);
    
    if (fs.statSync(sourceFile).isFile()) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`Copied ${file} to Pages/`);
      
      // Fix Inertia imports in the copied file
      fixInertiaImports(targetFile);
    }
  });
  
  // Copy Auth directory files
  const sourceAuthDir = path.join(sourcePagesDir, 'Auth');
  if (fs.existsSync(sourceAuthDir)) {
    fs.readdirSync(sourceAuthDir).forEach(file => {
      const sourceFile = path.join(sourceAuthDir, file);
      const targetFile = path.join(pagesAuthDir, file);
      
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied Auth/${file} to Pages/Auth/`);
        
        // Fix Inertia imports in the copied file
        fixInertiaImports(targetFile);
      }
    });
  }
}

// Now scan Pages directory to make sure all files have been fixed
const processDirectory = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      fixInertiaImports(fullPath);
    }
  });
};

processDirectory(pagesDir);

console.log('Import path fixing completed'); 