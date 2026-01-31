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

async function getRepoData(repoUrl) {
  const client = await getOctokit();
  
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const owner = match[1];
  const repo = match[2].replace('.git', '');

  try {
    const [repoInfo, commits, contributors, readme, tree] = await Promise.all([
      client.rest.repos.get({ owner, repo }),
      client.rest.repos.listCommits({ owner, repo, per_page: 100 }),
      client.rest.repos.listContributors({ owner, repo }),
      client.rest.repos.getReadme({ owner, repo }).catch(() => null),
      client.rest.git.getTree({ owner, repo, tree_sha: 'HEAD', recursive: true }).catch(() => null)
    ]);

    const files = tree ? tree.data.tree.map(item => item.path) : [];

    return {
      name: repoInfo.data.name,
      description: repoInfo.data.description,
      stars: repoInfo.data.stargazers_count,
      hasLicense: !!repoInfo.data.license,
      commits: commits.data,
      contributors: contributors.data,
      readme: readme ? Buffer.from(readme.data.content, 'base64').toString() : null,
      files: files
    };
  } catch (error) {
    throw new Error(`Failed to fetch repo: ${error.message}`);
  }
}

module.exports = { getRepoData };