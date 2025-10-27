const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  console.error('Build directory does not exist. Please run "npm run build" first.');
  process.exit(1);
}
app.use(express.static(buildPath));

// API proxy configuration
if (process.env.REACT_APP_API_URL) {
  app.use('/api', (req, res) => {
    // This is handled by the frontend using the REACT_APP_API_URL env var
    res.status(404).json({ error: 'API proxy not configured' });
  });
}

// The "catchall" handler: send back React's index.html file for all non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📁 Serving files from: ${buildPath}`);
  console.log(`🌍 API URL: ${process.env.REACT_APP_API_URL || 'Not configured'}`);
});

