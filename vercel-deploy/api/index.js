// Minimal API for Vercel deployment
module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Nalamini Service Platform API is running',
    time: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'unknown'
  });
};