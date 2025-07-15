// server.js – Vercel serverless entry point + Local development friendly

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Helper to check file existence
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

// Detect project root by finding package.json
let projectRoot = __dirname;
while (!fileExists(path.join(projectRoot, 'package.json')) && projectRoot !== path.parse(projectRoot).root) {
  projectRoot = path.dirname(projectRoot);
}

console.log('🌍 Project root:', projectRoot);
console.log('📁 Current dir:', __dirname);
console.log('🧭 NODE_ENV:', process.env.NODE_ENV);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Attempt to load server module (registerRoutes)
const possiblePaths = [
  path.join(projectRoot, 'server/index.js'),
  path.join(projectRoot, 'dist/server/index.js'),
  path.join(projectRoot, 'dist/index.js'),
  path.join(projectRoot, 'index.js'),
];

let serverModuleLoaded = false;

for (const filePath of possiblePaths) {
  if (fileExists(filePath)) {
    try {
      console.log(`🔍 Loading server module: ${filePath}`);
      const serverModule = require(filePath);

      if (typeof serverModule.registerRoutes === 'function') {
        serverModule.registerRoutes(app);
        console.log('✅ Routes registered via registerRoutes()');
        serverModuleLoaded = true;
      } else {
        console.warn('⚠️ registerRoutes() not found in module:', filePath);
      }

      break;
    } catch (error) {
      console.error('❌ Failed to load server module:', filePath, error.message);
    }
  }
}

if (!serverModuleLoaded) {
  console.warn('⚠️ No server routes loaded. Only /api/health will respond.');
}

// Static file support (if you serve frontend from Express)
const publicDir = path.join(projectRoot, 'client', 'dist');
if (fileExists(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.url });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Run locally
if (require.main === module) {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;