const express = require("express");
const cors = require("cors");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const { getRepoData } = require("./services/github");
const { calculateScore } = require("./services/scoring");
const { checkDeployment } = require("./services/deploy.service");
const { generatePR } = require("./services/pr.service");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Swagger configuration
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipShield API",
      version: "1.0.0",
      description:
        "API for analyzing GitHub repos, checking deployments, and auto-generating PRs",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/server.js", "./src/routes/*.js"], // <-- path to your JS files with Swagger comments
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Confirms the API is running
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ShipShield API is running" });
});

/**
 * @swagger
 * /api/analyze:
 *   post:
 *     summary: Analyze GitHub repo and compute Ship Score
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoUrl:
 *                 type: string
 *                 example: https://github.com/vercel/next.js
 *               deploymentUrl:
 *                 type: string
 *                 example: https://example.vercel.app
 *     responses:
 *       200:
 *         description: Analysis result
 */
app.post("/api/analyze", async (req, res) => {
  const { repoUrl, deploymentUrl } = req.body;

  try {
    const repoData = await getRepoData(repoUrl);
    const deploymentData = await checkDeployment(deploymentUrl);
    const result = calculateScore(repoData, deploymentData);

    res.json({
      score: result.score,
      categories: {
        deploymentReality: result.categories.deploymentReality,
        repoCredibility: result.categories.repoCredibility,
        productionSafety: result.categories.productionSafety,
        developerExperience: result.categories.developerExperience
      },
      topIssues: result.topIssues,
      repoUrl,
      deploymentUrl,
      analysisId: Date.now().toString(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/pr:
 *   post:
 *     summary: Generate PR with fixes
 *     tags: [PR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoUrl:
 *                 type: string
 *               filesToAdd:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: PR created successfully
 */
app.post("/api/pr", async (req, res) => {
  const { repoUrl, filesToAdd } = req.body;

  if (!filesToAdd || !Array.isArray(filesToAdd) || !filesToAdd.length) {
    filesToAdd = [
      {
        path: ".env.example",
        content: "PORT=3000\nGITHUB_TOKEN=YOUR_TOKEN_HERE",
      },
    ];
  }

  if (!repoUrl) {
    return res.status(400).json({ error: "repoUrl is required" });
  }

  try {
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
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
