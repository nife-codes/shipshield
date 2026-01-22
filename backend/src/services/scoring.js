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
      issues.push(`${Math.round(percentLast48 * 100)}% of commits in last 48 hours (hackathon spike)`);
    }
    
    if (duration < 24 * 3600 * 1000) {
      score -= 10;
      issues.push('All commits within 24 hours');
    }
  }

  const contributors = repoData.contributors || [];
  if (contributors.length === 1) {
    score -= 5;
    issues.push('Single contributor (no team collaboration)');
  } else if (contributors.length >= 3) {
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

  if (!repoData.hasLicense) {
    score -= 3;
    issues.push('No LICENSE file (legal ambiguity)');
  }

  const readme = repoData.readme || '';
  const hasEnvExample = readme.includes('.env.example') || readme.includes('env.example');
  const mentionsEnv = readme.includes('.env') || readme.includes('environment');
  
  if (mentionsEnv && !hasEnvExample) {
    score -= 8;
    issues.push('References .env but no .env.example (security risk)');
  }

  return { score: Math.max(0, score), issues };
}

module.exports = { calculateScore };