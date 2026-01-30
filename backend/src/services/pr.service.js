const { Octokit } = require('octokit');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const { getRepoData } = require('./github');

async function generatePR(repoUrl, filesToAdd = []) {
  // Extract owner and repo name
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");

  const owner = match[1];
  const repo = match[2].replace('.git', '');
  const baseBranch = 'main';
  const newBranch = `shipshield/fixes-${Date.now()}`;

  try {
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`
    });

    const latestSha = refData.object.sha;

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: latestSha
    });

    for (const file of filesToAdd) {
      const { path, content } = file;
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `[ShipShield] Auto-fix: ${path}`,
        content: Buffer.from(content).toString('base64'),
        branch: newBranch
      });
    }

    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `[ShipShield] Auto-fix PR`,
      head: newBranch,
      base: baseBranch,
      body: `This PR improves the repo's launch readiness:\n- Added/Updated ${filesToAdd.map(f => f.path).join(', ')}\n\nShipShield automated fix.`
    });

    return { prUrl: pr.html_url, branch: newBranch };
  } catch (error) {
    console.error("Failed to generate PR:", error.message);
    throw error;
  }
}

module.exports = { generatePR };
