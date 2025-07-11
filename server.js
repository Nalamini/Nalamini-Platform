/**
 * Production server entry point for the Nalamini Service Platform
 * 
 * This file is used by deployment platforms to start the application.
 * It can run in both development and production environments.
 */

// Detect production vs development environment
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode`);

async function startServer() {
  try {
    // In development mode, use ts-node for TypeScript support
    if (!isProduction) {
      try {
        const tsNode = await import('ts-node');
        tsNode.register({
          transpileOnly: true,
          compilerOptions: {
            module: 'commonjs',
          },
        });
        console.log('TypeScript support enabled with ts-node');
      } catch (err) {
        console.warn('Failed to register ts-node, continuing without TypeScript support:', err);
      }
    }

    // Import and start the server
    try {
      // In production, load the compiled JS file from dist
      // In development, load the TS file directly
      const serverPath = isProduction ? './dist/index.js' : './server/index.ts';
      console.log(`Loading server from: ${serverPath}`);
      
      await import(serverPath);
      console.log('Server module loaded successfully');
    } catch (err) {
      console.error('Failed to import server module:', err);
      // Fallback to try the alternative path if the first one fails
      const fallbackPath = isProduction ? './server/index.ts' : './dist/index.js';
      console.log(`Attempting fallback: ${fallbackPath}`);
      
      try {
        await import(fallbackPath);
        console.log('Server loaded from fallback path');
      } catch (fallbackErr) {
        console.error('Fallback import also failed:', fallbackErr);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit in production, allow the platform to handle restart
});

// Start the server
startServer();