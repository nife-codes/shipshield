const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShipShield API is running' });
});

app.post('/api/analyze', async (req, res) => {
  const { repoUrl, deploymentUrl } = req.body;
  
  res.json({
    score: 0,
    message: 'Analysis coming soon',
    repoUrl,
    deploymentUrl
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});