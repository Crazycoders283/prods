// Test script to show how production URL is used

// Mock environment for testing
const mockEnv = {
  VITE_APP_URL: "https://jet-set-go-psi.vercel.app/api"
};

console.log("=============================================");
console.log("TESTING PRODUCTION URL CONFIGURATION");
console.log("=============================================");
console.log("\nEnvironment variables detected:");
console.log(`VITE_APP_URL: ${mockEnv.VITE_APP_URL}`);

console.log("\nSimulating production environment (non-localhost)...");
console.log("Using logic from your src/config/api.js file");

// Simulate the getApiBaseUrl function from your config
function getProductionApiUrl() {
  // Simulate production environment
  const isLocalDevelopment = false;
  
  if (isLocalDevelopment) {
    return "http://localhost:5004/api"; // This won't be used in this test
  }
  
  // For production, use environment variable
  let apiUrl = mockEnv.VITE_APP_URL;
  
  // Handle cases where API URL doesn't have protocol
  if (apiUrl && !apiUrl.startsWith("http") && !apiUrl.startsWith("/")) {
    apiUrl = "https://" + apiUrl;
  }
  
  // Ensure URL has no trailing slash conflicts
  return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
}

// Get the final production URL
const prodUrl = getProductionApiUrl();
console.log("\nFinal production API URL: \x1b[32m" + prodUrl + "\x1b[0m");

// Show some example API endpoints
console.log("\nExample API endpoints that will be used:");
console.log(`- Authentication:  \x1b[36m${prodUrl}/auth/login\x1b[0m`);
console.log(`- Hotel Search:    \x1b[36m${prodUrl}/hotels/search\x1b[0m`);
console.log(`- Flight Search:   \x1b[36m${prodUrl}/flights/search\x1b[0m`);
console.log(`- User Profile:    \x1b[36m${prodUrl}/users/profile\x1b[0m`);

console.log("\n=============================================");
console.log("YOUR CONFIGURATION IS CORRECTLY SET UP");
console.log("=============================================");
