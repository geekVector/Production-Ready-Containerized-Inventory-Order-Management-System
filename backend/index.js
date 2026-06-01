const express = require('express');
const app = express();
const port = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'Backend API is running' });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Backend data response' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
