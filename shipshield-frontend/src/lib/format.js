/**
 * Format utilities for dates, numbers, and strings
 */

/**
 * Formats a Firestore timestamp to local date and time string
 * @param {Object|string|number} timestamp - Firestore timestamp or ISO string or unix timestamp
 * @returns {string} Formatted date and time string
 */
export const formatTimestamp = (timestamp) => {
    let date;

    if (timestamp && timestamp._seconds) {
        // Firestore timestamp
        date = new Date(timestamp._seconds * 1000);
    } else {
        // ISO string or unix timestamp
        date = new Date(timestamp || Date.now());
    }

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

/**
 * Extracts repository name from GitHub URL
 * @param {string} repoUrl - Full GitHub repository URL
 * @returns {string} Repository name in format owner/repo
 */
export const formatRepoUrl = (repoUrl) => {
    if (!repoUrl) return 'Unknown Repo';
    return repoUrl.replace('https://github.com/', '');
};

/**
 * Formats a number as percentage
 * @param {number} value - Number to format (0-100)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
};
