const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Serve static files from the root directory instead of public
app.use(express.static(path.join(__dirname)));

// Route all requests to index.html in the root directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});