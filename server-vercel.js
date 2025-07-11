// Simplified server file for Vercel deployment
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Log directory info for debugging
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Files in current directory:', require('fs').readdirSync('.'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nalamini Service Platform API is running' });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Fallback route handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Only listen for connections when running directly (not imported)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For serverless environments
export default app;