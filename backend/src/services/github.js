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

    // Fetch important config files for advanced analysis
    const configPromises = [
      client.rest.repos.getContent({ owner, repo, path: 'package.json' }).catch(() => null),
      client.rest.repos.getContent({ owner, repo, path: 'tsconfig.json' }).catch(() => null),
      client.rest.repos.getContent({ owner, repo, path: '.eslintrc.json' }).catch(() => null),
      client.rest.repos.getContent({ owner, repo, path: '.eslintrc.js' }).catch(() => null),
    ];

    const [packageJson, tsConfig, eslintJson, eslintJs] = await Promise.all(configPromises);

    // Parse config files
    let parsedPackageJson = null;
    let parsedTsConfig = null;
    let parsedEslintConfig = null;

    if (packageJson) {
      try {
        parsedPackageJson = JSON.parse(Buffer.from(packageJson.data.content, 'base64').toString());
      } catch (e) {
        console.error('Failed to parse package.json:', e.message);
      }
    }

    if (tsConfig) {
      try {
        parsedTsConfig = JSON.parse(Buffer.from(tsConfig.data.content, 'base64').toString());
      } catch (e) {
        console.error('Failed to parse tsconfig.json:', e.message);
      }
    }

    const eslintContent = eslintJson || eslintJs;
    if (eslintContent) {
      try {
        const content = Buffer.from(eslintContent.data.content, 'base64').toString();
        // Try JSON parse first, if it fails it might be a JS file
        if (eslintContent === eslintJson) {
          parsedEslintConfig = JSON.parse(content);
        } else {
          // For .js files, we'll just note it exists
          parsedEslintConfig = { exists: true, isJsFile: true };
        }
      } catch (e) {
        parsedEslintConfig = { exists: true, parseError: true };
      }
    }

    return {
      name: repoInfo.data.name,
      description: repoInfo.data.description,
      stars: repoInfo.data.stargazers_count,
      hasLicense: !!repoInfo.data.license,
      commits: commits.data,
      contributors: contributors.data,
      readme: readme ? Buffer.from(readme.data.content, 'base64').toString() : null,
      files: files,
      defaultBranch: repoInfo.data.default_branch,
      packageJson: parsedPackageJson,
      tsConfig: parsedTsConfig,
      eslintConfig: parsedEslintConfig
    };
  } catch (error) {
    throw new Error(`Failed to fetch repo: ${error.message}`);
  }
}

module.exports = { getRepoData };