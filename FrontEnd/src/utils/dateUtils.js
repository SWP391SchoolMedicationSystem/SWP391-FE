// Utility functions for date handling with GMT+7 timezone

/**
 * Get current date in GMT+7 timezone as ISO string
 * @returns {string} ISO string in GMT+7
 */
export const getCurrentDateGMT7 = () => {
  const now = new Date();
  const gmt7Offset = 7 * 60; // GMT+7 in minutes
  const localOffset = now.getTimezoneOffset(); // Get local timezone offset
  const totalOffset = gmt7Offset + localOffset; // Total offset to apply

  const gmt7Date = new Date(now.getTime() + totalOffset * 60 * 1000);
  return gmt7Date.toISOString();
};

/**
 * Get current date in GMT+7 timezone as date string (YYYY-MM-DD)
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const getCurrentDateStringGMT7 = () => {
  return getCurrentDateGMT7().split('T')[0];
};

/**
 * Convert a date to GMT+7 timezone as ISO string
 * @param {Date|string} date - Date to convert
 * @returns {string} ISO string in GMT+7
 */
export const toGMT7ISOString = date => {
  const dateObj = new Date(date);
  const gmt7Offset = 7 * 60; // GMT+7 in minutes
  const localOffset = dateObj.getTimezoneOffset(); // Get local timezone offset
  const totalOffset = gmt7Offset + localOffset; // Total offset to apply

  const gmt7Date = new Date(dateObj.getTime() + totalOffset * 60 * 1000);
  return gmt7Date.toISOString();
};

/**
 * Convert a date to GMT+7 timezone as date string (YYYY-MM-DD)
 * @param {Date|string} date - Date to convert
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const toGMT7DateString = date => {
  return toGMT7ISOString(date).split('T')[0];
};

/**
 * Get tomorrow's date in GMT+7 timezone as date string
 * @returns {string} Tomorrow's date in YYYY-MM-DD format
 */
export const getTomorrowDateStringGMT7 = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toGMT7DateString(tomorrow);
};
