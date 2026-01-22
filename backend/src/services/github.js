const { Octokit } = require('octokit');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function getRepoData(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }

  const owner = match[1];
  const repo = match[2].replace('.git', '');

  try {
    const [repoInfo, commits, contributors, readme] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.repos.listCommits({ owner, repo, per_page: 100 }),
      octokit.rest.repos.listContributors({ owner, repo }),
      octokit.rest.repos.getReadme({ owner, repo }).catch(() => null)
    ]);

    return {
      name: repoInfo.data.name,
      description: repoInfo.data.description,
      stars: repoInfo.data.stargazers_count,
      hasLicense: !!repoInfo.data.license,
      commits: commits.data,
      contributors: contributors.data,
      readme: readme ? Buffer.from(readme.data.content, 'base64').toString() : null
    };
  } catch (error) {
    throw new Error(`Failed to fetch repo: ${error.message}`);
  }
}

module.exports = { getRepoData };