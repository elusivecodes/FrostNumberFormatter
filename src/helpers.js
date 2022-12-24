/**
 * Helpers
 */

/**
 * Return an escaped string for use in RegEx.
 * @param {string} string The string to escape.
 * @return {string} The escaped string.
 */
export const escapeRegExp = (string) => string.replace(/[-/\\^$*+?.()|[]{}]/g, '\\$&');
