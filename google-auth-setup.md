# Google Sign-In Integration Guide

This guide will help you set up Google Sign-In functionality with Gmail API access in the application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make note of your Project ID

## Step 2: Enable Required APIs

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Gmail API** - For accessing email functionality
   - **People API** - For user information
   - **Google Sign-In API** - For authentication

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you're restricting to organization only)
3. Fill in required application information:
   - App name
   - User support email
   - Developer contact information
4. Add the required scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/gmail.readonly` (if you need Gmail access)
5. Add any authorized domains where your app will run
6. Save and continue

## Step 4: Create OAuth Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Add a name for your client (e.g., "Jet Set Go Web Client")
5. Add authorized JavaScript origins:
   - Development: `http://localhost:5002` (or your local development URL)
   - Production: `https://jet-set-go-psi.vercel.app` (or your production URL)
6. Add authorized redirect URIs:
   - Development: `http://localhost:5002/oauth2callback`
   - Production: `https://jet-set-go-psi.vercel.app/oauth2callback`
7. Click "Create"
8. Save the generated **Client ID** and **Client Secret**

## Step 5: Update Environment Variables

1. Open your project's `.env` file
2. Add the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

## Step 6: Update the Client-Side Code

1. Open `resources/js/Pages/Common/login/login.jsx`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual client ID:
   ```javascript
   window.google.accounts.id.initialize({
     client_id: process.env.GOOGLE_CLIENT_ID, // Use environment variable
     callback: handleGoogleResponse,
     scope: "email profile https://www.googleapis.com/auth/gmail.readonly"
   });
   ```

## Step 7: Run Database Migrations

The system will automatically run migrations when the server starts, but you can also run it manually:

```bash
node backend/migrations/add-google-auth.js
```

## Step 8: Test the Integration

1. Start your application
2. Go to the login page
3. Click the Google Sign-In button
4. Complete the Google authentication flow
5. Verify that you're successfully logged in

## Troubleshooting

- **OAuth Error**: Make sure your authorized origins and redirect URIs are correctly set in the Google Cloud Console
- **API Not Available**: Ensure you've enabled all the necessary APIs in your Google Cloud project
- **Invalid Client ID**: Check that you're using the correct client ID in your frontend code
- **CORS Issues**: Verify that your application's domain is properly set in the authorized JavaScript origins

## Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity/gsi/web)
- [Gmail API Documentation](https://developers.google.com/gmail/api/guides)
- [People API Documentation](https://developers.google.com/people/api/rest) 