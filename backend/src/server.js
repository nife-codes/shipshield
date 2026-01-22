const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getRepoData } = require('./services/github');
const { calculateScore } = require('./services/scoring');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShipShield API is running' });
});

app.post('/api/analyze', async (req, res) => {
  const { repoUrl, deploymentUrl } = req.body;
  
  try {
    const repoData = await getRepoData(repoUrl);
    const deploymentData = {};
    
    const result = calculateScore(repoData, deploymentData);
    
    res.json({
      ...result,
      repoUrl,
      deploymentUrl,
      analysisId: Date.now().toString()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});