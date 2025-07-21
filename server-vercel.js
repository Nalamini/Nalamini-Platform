import dotenv from 'dotenv';
dotenv.config();

// server-vercel.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// Debug logs
console.log('📁 Working directory:', process.cwd());
console.log('📁 __dirname:', __dirname);
console.log('📂 Files here:', fs.readdirSync(__dirname));

// ✅ Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Nalamini Service Platform is running',
    time: new Date().toISOString(),
  });
});

// ✅ Serve static files from 'public'
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  // Fallback to index.html for frontend routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  console.warn('⚠️ Warning: public directory not found:', publicDir);
}

// ✅ Start server only if not in serverless
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL === undefined) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}

// ✅ Export for Vercel (serverless function handler)
export default app;
