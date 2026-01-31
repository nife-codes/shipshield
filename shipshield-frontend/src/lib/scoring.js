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
