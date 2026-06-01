const express = require('express');
const path = require('path'); // Node built-in tool for file paths
const app = express();
const port = 8080;

// Tell Express to serve your HTML file when someone opens the main link
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'Frontend is running' });
});

app.get('/frontend/data', (req, res) => {
  res.json({ message: 'Frontend data response' });
});

app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});