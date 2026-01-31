/**
 * History-specific utilities for transforming and displaying scan history
 */

import { formatTimestamp, formatRepoUrl, deduplicateByKey } from './utils';

/**
 * Maps score (0-100) to letter grade
 * @param {number} score - Score from 0 to 100
 * @returns {string} Letter grade
 */
export const getHistoryGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    return 'F';
};

/**
 * Gets color classes for a grade badge
 * @param {string} grade - Letter grade
 * @returns {string} Tailwind CSS classes for badge styling
 */
export const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-700 bg-red-200';
};

/**
 * Formats scan history data for display
 * @param {Array} rawData - Raw scan data from API
 * @returns {Array} Formatted and deduplicated history data
 */
export const formatHistoryData = (rawData) => {
    const formatted = rawData.map(item => {
        const grade = getHistoryGrade(item.score);

        return {
            id: item.analysisId || item.id,
            repo: formatRepoUrl(item.repoUrl),
            date: formatTimestamp(item.createdAt),
            score: grade,
            scoreColor: getGradeColor(grade),
            size: 'N/A'
        };
    });

    // Deduplicate based on id
    return deduplicateByKey(formatted, 'id');
};
