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

    // Create files in the new branch
    for (const file of filesToAdd) {
      try {
        // Check if file already exists to get its SHA (needed for updates)
        let fileSha = null;
        try {
          const existingFile = await client.rest.repos.getContent({
            owner,
            repo,
            path: file.path,
            ref: newBranch
          });
          fileSha = existingFile.data.sha;
        } catch (error) {
          // File doesn't exist, which is fine for new files
          // console.log(`File ${file.path} does not exist, creating new.`);
        }

        const createFileParams = {
          owner,
          repo,
          path: file.path,
          message: `[ShipShield] Auto-fix: Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64'),
          branch: newBranch
        };

        // Only add SHA if file exists (for updates)
        if (fileSha) {
          createFileParams.sha = fileSha;
          createFileParams.message = `[ShipShield] Auto-fix: Update ${file.path}`;
        }

        await client.rest.repos.createOrUpdateFileContents(createFileParams);
      } catch (fileError) {
        console.error(`Failed to create/update file ${file.path}:`, fileError.message);
        throw fileError; // Re-throw to fail the PR generation if a file fails
      }
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
