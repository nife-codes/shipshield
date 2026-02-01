const { scanForSecrets } = require('../utils/secrets');

function calculateScore(repoData, deploymentData) {
  let totalScore = 0;
  const categories = {
    deploymentReality: { score: 0, issues: [] },
    repoCredibility: { score: 0, issues: [] },
    productionSafety: { score: 0, issues: [] },
    developerExperience: { score: 0, issues: [] },
    packageQuality: { score: 0, issues: [] },
    codeQuality: { score: 0, issues: [] }
  };

  categories.repoCredibility = analyzeRepoCredibility(repoData);
  categories.productionSafety = analyzeProductionSafety(repoData);
  categories.developerExperience = analyzeDeveloperExperience(repoData);
  categories.packageQuality = analyzePackageQuality(repoData);
  categories.codeQuality = analyzeCodeQuality(repoData);

  totalScore = Object.values(categories).reduce((sum, cat) => sum + cat.score, 0);

  const topIssues = Object.values(categories)
    .flatMap(cat => cat.issues)
    .slice(0, 5); // Increased from 3 to 5 for more insights

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

  const hasGitignore = files.some(f => f === '.gitignore');
  if (!hasGitignore) {
    score -= 2;
    issues.push('No .gitignore file');
  }

  const readme = repoData.readme || '';
  const commits = repoData.commits || [];
  const commitMessages = commits.map(c => c.commit.message).join(' ');

  const secretsInReadme = scanForSecrets(readme);
  const secretsInCommits = scanForSecrets(commitMessages);

  if (secretsInReadme.length > 0 || secretsInCommits.length > 0) {
    score -= 8;
    issues.push('Potential secrets detected in code or commits');
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

function analyzePackageQuality(repoData) {
  let score = 0;
  const issues = [];
  const packageJson = repoData.packageJson;

  if (!packageJson) {
    return { score, issues };
  }

  // Check for essential scripts
  const scripts = packageJson.scripts || {};
  if (scripts.test) score += 3;
  else issues.push('No test script defined in package.json');

  if (scripts.lint || scripts.eslint) score += 2;
  else issues.push('No linting script configured');

  if (scripts.build) score += 2;

  // Check for dependencies
  const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
  const depCount = Object.keys(deps).length;

  if (depCount === 0) {
    issues.push('No dependencies listed');
  } else if (depCount > 100) {
    score -= 2;
    issues.push(`${depCount} dependencies (high complexity)`);
  }

  // Check for TypeScript
  const hasTypeScript = deps['typescript'] || repoData.tsConfig;
  if (hasTypeScript) {
    score += 3;
    if (repoData.tsConfig?.compilerOptions?.strict) {
      score += 2;
    } else {
      issues.push('TypeScript not in strict mode');
    }
  }

  // Check for testing libs
  const hasTestLib = deps['jest'] || deps['mocha'] || deps['vitest'] || deps['@testing-library/react'];
  if (hasTestLib) score += 3;

  return { score: Math.max(0, score), issues };
}

function analyzeCodeQuality(repoData) {
  let score = 0;
  const issues = [];
  const files = repoData.files || [];

  // Count TypeScript files
  const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).length;
  const jsFiles = files.filter(f => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('node_modules')).length;
  const totalCodeFiles = tsFiles + jsFiles;

  if (totalCodeFiles > 0) {
    const tsPercentage = (tsFiles / totalCodeFiles) * 100;
    if (tsPercentage > 80) score += 5;
    else if (tsPercentage > 50) score += 3;
    else if (tsPercentage > 0) score += 1;
  }

  // Check for test files
  const testFiles = files.filter(f =>
    f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__')
  ).length;

  if (testFiles > 0) {
    const testRatio = testFiles / Math.max(totalCodeFiles, 1);
    if (testRatio > 0.3) score += 5;
    else if (testRatio > 0.1) score += 3;
    else score += 1;
  } else if (totalCodeFiles > 10) {
    issues.push('No test files detected');
  }

  // Check for linting config
  if (repoData.eslintConfig) {
    score += 3;
  } else {
    issues.push('No ESLint configuration found');
  }

  return { score: Math.max(0, score), issues };
}

module.exports = { calculateScore };