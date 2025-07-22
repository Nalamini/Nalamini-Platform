// server-vercel.js

const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Log paths
console.log('📁 __dirname:', __dirname);

// Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Nalamini Service Platform is running',
    time: new Date().toISOString()
  });
});

// Serve from dist/public (correct relative path!)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  console.warn('⚠️ Static directory not found:', publicDir);
}

// Run locally only for development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL === undefined) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
