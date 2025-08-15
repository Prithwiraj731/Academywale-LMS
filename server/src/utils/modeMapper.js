/**
 * This is a simple module to map any mode value to one of the allowed values.
 */

// These are the only values allowed in the Faculty schema
const ALLOWED_MODES = ['Live Watching', 'Recorded Videos'];

/**
 * Maps any mode value to one of the allowed values in the database schema.
 * This is a reliable way to avoid validation errors.
 * 
 * @param {string} mode - The mode value to map
 * @returns {string} - One of the allowed mode values
 */
function mapMode(mode) {
  // If no mode provided, use default
  if (!mode) {
    return 'Live Watching';
  }
  
  // If it's already an allowed value, return as is
  if (ALLOWED_MODES.includes(mode)) {
    return mode;
  }
  
  // Map known values to allowed values
  const mappings = {
    'Live at Home With Hard Copy': 'Live Watching',
    'Self Study': 'Recorded Videos',
    'Offline': 'Recorded Videos',
    'Hybrid': 'Live Watching',
    'Online': 'Live Watching',
    'Virtual': 'Live Watching',
    'Physical': 'Live Watching'
  };
  
  // Return mapping if it exists, otherwise default to Live Watching
  return mappings[mode] || 'Live Watching';
}

/**
 * Use this as a MongoDB schema setter to ensure mode is always valid.
 */
function modeSetter(value) {
  return mapMode(value);
}

module.exports = {
  mapMode,
  modeSetter,
  ALLOWED_MODES
};
