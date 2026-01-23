const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getRepoData } = require("./services/github");
const { calculateScore } = require("./services/scoring");
const { checkDeployment } = require("./services/deploy.service");
const { generatePR } = require("./services/pr.service");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ShipShield API is running" });
});

app.post("/api/analyze", async (req, res) => {
  const { repoUrl, deploymentUrl } = req.body;

  try {
    const repoData = await getRepoData(repoUrl);

    const deploymentData = await checkDeployment(deploymentUrl);

    const result = calculateScore(repoData, deploymentData);

    res.json({
      ...result,
      repoUrl,
      deploymentUrl,
      analysisId: Date.now().toString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PR generation endpoint
app.post("/api/pr", async (req, res) => {
  const { repoUrl, filesToAdd } = req.body;

  if (!filesToAdd.length) {
    // auto-generate minimal fixes
    filesToAdd.push({
      path: ".env.example",
      content: "PORT=3000\nGITHUB_TOKEN=YOUR_TOKEN_HERE",
    });
  }

  if (!repoUrl || !filesToAdd || !Array.isArray(filesToAdd)) {
    return res
      .status(400)
      .json({ error: "repoUrl and filesToAdd are required" });
  }

  try {
    // Call your existing PR service
    const prInfo = await generatePR(repoUrl, filesToAdd);

    res.json({
      message: "PR created successfully",
      prInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
