const { getRepoData } = require('./github');

let octokit;

async function getOctokit() {
  if (!octokit) {
    const { Octokit } = await import('octokit');
    octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }
  return octokit;
}

async function generatePR(repoUrl, filesToAdd = []) {
  const client = await getOctokit();

  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  const owner = match[1];
  const repo = match[2].replace('.git', '');

  // Fetch repo info to get the correct default branch
  const repoData = await getRepoData(repoUrl);
  const baseBranch = repoData.defaultBranch || 'main';

  const newBranch = `shipshield/fixes-${Date.now()}`;

  try {
    const { data: refData } = await client.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`
    });
    const latestSha = refData.object.sha;

    await client.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: latestSha
    });

    for (const file of filesToAdd) {
      const { path, content } = file;
      await client.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `[ShipShield] Auto-fix: ${path}`,
        content: Buffer.from(content).toString('base64'),
        branch: newBranch
      });
    }

    const { data: pr } = await client.rest.pulls.create({
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
