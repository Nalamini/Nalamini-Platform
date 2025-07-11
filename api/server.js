// Serverless entry point for Vercel deployment
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set production environment
process.env.NODE_ENV = 'production';

// Helper to check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

// Attempt to determine project root directory
let projectRoot = __dirname;
while (!fileExists(path.join(projectRoot, 'package.json')) && projectRoot !== '/') {
  projectRoot = path.dirname(projectRoot);
}

// Log debug information
console.log('Project root detected as:', projectRoot);
console.log('Current directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware to handle all requests
app.use(async (req, res, next) => {
  try {
    // Log request information
    console.log('Request received:', req.method, req.url);
    
    // Health check endpoint
    if (req.url === '/api/health') {
      return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    }
    
    // Dynamic import of the main server module
    try {
      // Try to import server module from various possible locations
      let serverModule;
      const possiblePaths = [
        path.join(projectRoot, 'server/index.js'),
        path.join(projectRoot, 'dist/server/index.js'),
        path.join(projectRoot, '../server/index.js'),
        path.join(projectRoot, '../dist/server/index.js'),
        path.join(projectRoot, 'server.js'),
        path.join(projectRoot, 'dist/server.js'),
        path.join(projectRoot, '../server.js'),
        path.join(projectRoot, '../dist/server.js')
      ];
      
      // Log possible paths for debugging
      console.log('Checking these paths for server module:');
      possiblePaths.forEach(p => console.log('- ' + p + ' exists: ' + fileExists(p)));
      
      // Try each path until we find the server module
      for (const p of possiblePaths) {
        if (fileExists(p)) {
          console.log('Attempting to load server from:', p);
          serverModule = require(p);
          console.log('Server module loaded successfully from:', p);
          break;
        }
      }
      
      if (!serverModule) {
        throw new Error('Could not find server module at any of the expected paths');
      }
      
      // If the server module has a registerRoutes function, call it
      if (typeof serverModule.registerRoutes === 'function') {
        console.log('Calling registerRoutes function');
        await serverModule.registerRoutes(app);
      }
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Error importing server module:', error);
      res.status(500).json({ 
        error: 'Failed to load server module', 
        details: error.message,
        stack: error.stack
      });
    }
  } catch (error) {
    console.error('Unhandled error in request middleware:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.url });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error('Express error handler:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// For local testing
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Vercel serverless function listening on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;