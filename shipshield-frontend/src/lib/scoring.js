/**
 * Grade mapping utilities for scoring systems
 */

/**
 * Maps a score (0-25) to a grade object with grade letter, theme, and badge
 * @param {number} score - Score from 0 to 25
 * @returns {{grade: string, theme: string, badge: string}}
 */
export const getGrade = (score) => {
    if (score >= 22) return { grade: 'A', theme: 'success', badge: 'Excellent' };
    if (score >= 18) return { grade: 'B', theme: 'info', badge: 'Good' };
    if (score >= 14) return { grade: 'C', theme: 'warning', badge: 'Improve' };
    return { grade: 'D', theme: 'danger', badge: 'Critical' };
};

/**
 * Converts a category score (0-25) to percentage
 * @param {number} score - Score from 0 to 25
 * @returns {number} Percentage (0-100)
 */
export const scoreToPercentage = (score) => {
    return (score / 25) * 100;
};

/**
 * Maps analysis data to dashboard display format
 * @param {Object} analysisData - Raw analysis data from API
 * @returns {Object} Formatted data for dashboard display
 */
export const mapAnalysisData = (analysisData) => {
    if (!analysisData) {
        // Default/Placeholder data
        return {
            score: 56,
            security: {
                val: 'C-',
                progress: 45,
                theme: 'danger',
                badge: 'Needs Work',
                desc: '3 High severity vulnerabilities detected'
            },
            docs: {
                val: '58%',
                progress: 58,
                theme: 'warning',
                badge: 'Improve',
                desc: 'README missing setup instructions'
            },
            testing: {
                val: '92%',
                progress: 92,
                theme: 'success',
                badge: 'Good',
                desc: 'All unit tests passed'
            },
            deploy: {
                val: 'A',
                progress: 85,
                theme: 'info',
                badge: 'Stable',
                desc: 'Dockerfiles optimized'
            },
            topIssues: ['High severity vulnerability in package.json', 'Missing .env.example file']
        };
    }

    const { categories, score } = analysisData;
    const sec = getGrade(categories.productionSafety.score);
    const dep = getGrade(categories.deploymentReality.score);

    return {
        score: score,
        security: {
            val: sec.grade,
            progress: scoreToPercentage(categories.productionSafety.score),
            theme: sec.theme,
            badge: sec.badge,
            desc: categories.productionSafety.issues[0] || 'No major issues found.'
        },
        docs: {
            val: `${Math.round(scoreToPercentage(categories.repoCredibility.score))}%`,
            progress: scoreToPercentage(categories.repoCredibility.score),
            theme: 'warning',
            badge: 'Review',
            desc: categories.repoCredibility.issues[0] || 'Documentation looks good.'
        },
        testing: {
            val: `${Math.round(scoreToPercentage(categories.developerExperience.score))}%`,
            progress: scoreToPercentage(categories.developerExperience.score),
            theme: 'success',
            badge: 'Good',
            desc: categories.developerExperience.issues[0] || 'Dev experience is solid.'
        },
        deploy: {
            val: dep.grade,
            progress: scoreToPercentage(categories.deploymentReality.score),
            theme: dep.theme,
            badge: dep.badge,
            desc: categories.deploymentReality.issues[0] || 'Deployment config valid.'
        },
        topIssues: analysisData.topIssues || []
    };
};

/**
 * Generates a contextual fix suggestion based on issue description
 * @param {string} description - The issue description
 * @param {string} title - The issue title
 * @returns {string} Suggested fix
 */
export const generateFixSuggestion = (description, title = '') => {
    const desc = (description || title || '').toLowerCase()

    // Security-related issues
    if (desc.includes('vulnerability') || desc.includes('security') || desc.includes('cve')) {
        return 'Update vulnerable dependencies to their latest secure versions. Run `npm audit fix` or `yarn audit` to automatically patch known vulnerabilities.'
    }

    if (desc.includes('dependency') || desc.includes('package') || desc.includes('outdated')) {
        return 'Review and update outdated packages. Check for breaking changes in package documentation before updating major versions.'
    }

    // Documentation issues
    if (desc.includes('readme') || desc.includes('documentation')) {
        return 'Add comprehensive documentation including: project overview, installation steps, usage examples, and contribution guidelines in your README.md file.'
    }

    if (desc.includes('license')) {
        return 'Add an appropriate open-source license (MIT, Apache 2.0, GPL, etc.) to clarify usage rights. Create a LICENSE file in your repository root.'
    }

    // Configuration issues
    if (desc.includes('.env') || desc.includes('environment')) {
        return 'Create a .env.example file with all required environment variables (without sensitive values). Document each variable\'s purpose in comments.'
    }

    if (desc.includes('docker') || desc.includes('container')) {
        return 'Add Docker configuration with Dockerfile and docker-compose.yml for consistent development and deployment environments.'
    }

    if (desc.includes('ci') || desc.includes('continuous integration') || desc.includes('github actions')) {
        return 'Set up CI/CD pipeline with automated testing and linting. Add GitHub Actions workflow or similar CI configuration.'
    }

    // Testing issues
    if (desc.includes('test') || desc.includes('coverage')) {
        return 'Increase test coverage by adding unit tests for critical paths. Aim for at least 80% code coverage on business logic.'
    }

    // Code quality issues
    if (desc.includes('linting') || desc.includes('lint') || desc.includes('eslint')) {
        return 'Configure and run a linter (ESLint for JavaScript/TypeScript) with consistent code style rules. Add pre-commit hooks with Husky.'
    }

    if (desc.includes('typescript') || desc.includes('type')) {
        return 'Add TypeScript for type safety, or improve existing type definitions. Configure strict mode in tsconfig.json for better type checking.'
    }

    // Git/Version control
    if (desc.includes('gitignore')) {
        return 'Create or update .gitignore file to exclude node_modules, build artifacts, environment files, and other generated content from version control.'
    }

    if (desc.includes('commit') || desc.includes('git')) {
        return 'Follow conventional commit messages (feat:, fix:, docs:, etc.) and consider adding commitlint for automated validation.'
    }

    // Deployment issues
    if (desc.includes('deploy') || desc.includes('production')) {
        return 'Set up proper deployment configuration with environment-specific settings. Use environment variables for sensitive data and configuration.'
    }

    // Generic fallback with better context
    return 'Review this issue and implement the suggested improvements. Add proper error handling, validation, and documentation as needed.'
}
