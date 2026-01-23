function calculateScore(repoData, deploymentData) {
  let totalScore = 0;
  const categories = {
    deploymentReality: { score: 0, issues: [] },
    repoCredibility: { score: 0, issues: [] },
    productionSafety: { score: 0, issues: [] },
    developerExperience: { score: 0, issues: [] }
  };

  categories.repoCredibility = analyzeRepoCredibility(repoData);
  categories.productionSafety = analyzeProductionSafety(repoData);
  categories.developerExperience = analyzeDeveloperExperience(repoData);

  totalScore = Object.values(categories).reduce((sum, cat) => sum + cat.score, 0);

  const topIssues = Object.values(categories)
    .flatMap(cat => cat.issues)
    .slice(0, 3);

  return {
    score: totalScore,
    categories,
    topIssues
  };
}

function analyzeRepoCredibility(repoData) {
  let score = 25;
  const issues = [];

  const commits = repoData.commits || [];
  if (commits.length > 0) {
    const now = new Date();
    const timestamps = commits.map(c => new Date(c.commit.author.date));
    const earliest = Math.min(...timestamps);
    const latest = Math.max(...timestamps);
    const duration = latest - earliest;
    
    const last48Hours = commits.filter(c => 
      now - new Date(c.commit.author.date) < 48 * 3600 * 1000
    ).length;
    
    const percentLast48 = last48Hours / commits.length;
    
    if (percentLast48 > 0.8) {
      score -= 7;
      issues.push(`${Math.round(percentLast48 * 100)}% of commits in last 48 hours`);
    }
    
    if (duration < 24 * 3600 * 1000) {
      score -= 10;
      issues.push('All commits within 24 hours');
    }
  }

  const contributors = repoData.contributors || [];
  if (contributors.length === 1) {
    score -= 5;
    issues.push('Single contributor');
  }

  if (!repoData.readme || repoData.readme.length < 200) {
    score -= 5;
    issues.push('README too short or missing');
  }

  return { score: Math.max(0, score), issues };
}

function analyzeProductionSafety(repoData) {
  let score = 25;
  const issues = [];
  const files = repoData.files || [];

  if (!repoData.hasLicense) {
    score -= 3;
    issues.push('No LICENSE file');
  }

  const hasEnv = files.some(f => f === '.env');
  const hasEnvExample = files.some(f => f === '.env.example' || f === 'env.example');
  
  if (hasEnv && !hasEnvExample) {
    score -= 8;
    issues.push('.env file present but no .env.example');
  }

  const hasDockerfile = files.some(f => f === 'Dockerfile');
  if (hasDockerfile) {
  }

  const hasGitignore = files.some(f => f === '.gitignore');
  if (!hasGitignore) {
    score -= 2;
    issues.push('No .gitignore file');
  }

  return { score: Math.max(0, score), issues };
}

function analyzeDeveloperExperience(repoData) {
  let score = 25;
  const issues = [];
  const files = repoData.files || [];
  const readme = repoData.readme || '';

  const hasPackageJson = files.some(f => f === 'package.json');
  const hasRequirements = files.some(f => f === 'requirements.txt');
  const hasMakefile = files.some(f => f === 'Makefile');
  const hasScripts = files.some(f => f.startsWith('scripts/'));

  if (!hasMakefile && !hasScripts && readme.toLowerCase().includes('script')) {
    score -= 4;
    issues.push('References scripts but none found');
  }

  const setupSteps = (readme.match(/^\d+\./gm) || []).length;
  if (setupSteps > 6) {
    score -= 4;
    issues.push(`${setupSteps} setup steps (high friction)`);
  }

  const hasContributing = files.some(f => f === 'CONTRIBUTING.md');
  if (!hasContributing && readme.length > 500) {
    score -= 3;
    issues.push('No CONTRIBUTING.md for contributor guidance');
  }

  return { score: Math.max(0, score), issues };
}

module.exports = { calculateScore };