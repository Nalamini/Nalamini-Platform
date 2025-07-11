#!/usr/bin/env node

/**
 * Google OAuth Refresh Token Generator for YouTube API
 * 
 * This script helps you generate the GOOGLE_REFRESH_TOKEN needed for YouTube uploads.
 * Run this once to get your refresh token, then add it to your environment variables.
 */

const express = require('express');
const axios = require('axios');
const open = require('open');

// Configuration - Replace with your values
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:8080/auth/google/callback';
const SCOPES = 'https://www.googleapis.com/auth/youtube.upload';

const app = express();
const PORT = 8080;

// Step 1: Generate authorization URL
const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(SCOPES)}&` +
  `response_type=code&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('\n🔧 Google OAuth Refresh Token Generator');
console.log('=====================================\n');

// Step 2: Handle the callback and exchange code for tokens
app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('❌ Authorization failed:', error);
    res.send(`<h1>Authorization Failed</h1><p>Error: ${error}</p>`);
    return;
  }

  if (!code) {
    console.error('❌ No authorization code received');
    res.send('<h1>Error</h1><p>No authorization code received</p>');
    return;
  }

  try {
    console.log('✅ Authorization code received, exchanging for tokens...');

    // Exchange authorization code for access token and refresh token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    if (!refresh_token) {
      console.error('❌ No refresh token received. Make sure prompt=consent is included in the auth URL.');
      res.send('<h1>Error</h1><p>No refresh token received. Please try again.</p>');
      return;
    }

    console.log('\n🎉 SUCCESS! Your tokens:');
    console.log('========================');
    console.log('GOOGLE_CLIENT_ID=', CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET=', CLIENT_SECRET);
    console.log('GOOGLE_REFRESH_TOKEN=', refresh_token);
    console.log('\n📋 Copy these environment variables to your .env file');
    console.log('🔒 Keep these credentials secure and never share them publicly');

    res.send(`
      <h1>✅ OAuth Setup Complete!</h1>
      <h2>Your Environment Variables:</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; font-family: monospace;">
        GOOGLE_CLIENT_ID=${CLIENT_ID}<br>
        GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}<br>
        GOOGLE_REFRESH_TOKEN=${refresh_token}
      </div>
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Copy these variables to your .env file</li>
        <li>Restart your application</li>
        <li>Try approving a video - it should automatically upload to YouTube!</li>
      </ol>
      <p style="color: red;"><strong>Important:</strong> Keep these credentials secure!</p>
    `);

    // Exit after successful completion
    setTimeout(() => {
      console.log('\n✨ Setup complete! Shutting down helper server...');
      process.exit(0);
    }, 2000);

  } catch (error) {
    console.error('❌ Error exchanging code for tokens:', error.response?.data || error.message);
    res.send(`<h1>Error</h1><p>Failed to exchange code for tokens: ${error.message}</p>`);
  }
});

// Step 3: Start server and open browser
const server = app.listen(PORT, () => {
  console.log('📝 Before starting, update this script with your credentials:');
  console.log(`   - CLIENT_ID: ${CLIENT_ID === 'YOUR_CLIENT_ID_HERE' ? '❌ NOT SET' : '✅ SET'}`);
  console.log(`   - CLIENT_SECRET: ${CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE' ? '❌ NOT SET' : '✅ SET'}`);
  
  if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
    console.log('\n⚠️  Please edit oauth-helper.js and replace YOUR_CLIENT_ID_HERE and YOUR_CLIENT_SECRET_HERE with your actual values');
    console.log('   Then run: node oauth-helper.js');
    process.exit(1);
  }

  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log('🌐 Opening browser for OAuth authorization...\n');
  
  // Open the authorization URL in the default browser
  open(authUrl).catch(err => {
    console.log('❌ Could not open browser automatically.');
    console.log('🔗 Please visit this URL manually:', authUrl);
  });
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down OAuth helper server...');
  server.close(() => {
    process.exit(0);
  });
});