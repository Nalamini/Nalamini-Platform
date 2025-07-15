// server/index.ts or server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Files here:', fs.readdirSync(__dirname));

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Nalamini Service Platform is running' });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// For Vercel or serverless environments
export default app;
