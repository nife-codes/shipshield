/**
 * Array and object manipulation utilities
 */

/**
 * Deduplicates an array of objects based on a specific key
 * @param {Array} array - Array of objects to deduplicate
 * @param {string} key - Key to use for deduplication
 * @returns {Array} Deduplicated array
 */
export const deduplicateByKey = (array, key) => {
    return Array.from(
        new Map(array.map(item => [item[key], item])).values()
    );
};

/**
 * Sorts an array by a specific key in descending order
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @returns {Array} Sorted array
 */
export const sortByKeyDesc = (array, key) => {
    return [...array].sort((a, b) => b[key] - a[key]);
};
