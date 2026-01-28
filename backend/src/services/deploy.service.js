const fetch = require("node-fetch");
async function checkDeployment(url) {
  const result = {
    uptime: false,
    https: false,
    responseTimeMs: null,
    score: 0
  };

  if (!url) return result;

  result.https = url.startsWith("https://");

  try {
    const start = Date.now();
    const res = await fetch(url);
    const end = Date.now();

    result.uptime = res.ok;
    result.responseTimeMs = end - start;

    if (result.uptime) result.score += 10;
    if (result.https) result.score += 10;
    if (result.responseTimeMs < 1000) result.score += 5;
  } catch (err) {
    console.error("Deployment check failed:", err.message);
  }

  return result;
}

module.exports = { checkDeployment };
