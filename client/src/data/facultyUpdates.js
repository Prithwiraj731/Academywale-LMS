// Faculty updates storage - for admin edited faculty details
// This allows admins to add bio and teaches info to hardcoded faculty members

const FACULTY_UPDATES_KEY = 'faculty_updates';

// Get faculty updates from localStorage
export const getFacultyUpdates = () => {
  try {
    const updates = localStorage.getItem(FACULTY_UPDATES_KEY);
    return updates ? JSON.parse(updates) : {};
  } catch (error) {
    console.error('Error loading faculty updates:', error);
    return {};
  }
};

// Save faculty updates to localStorage
export const saveFacultyUpdates = (updates) => {
  try {
    localStorage.setItem(FACULTY_UPDATES_KEY, JSON.stringify(updates));
    return true;
  } catch (error) {
    console.error('Error saving faculty updates:', error);
    return false;
  }
};

// Update a specific faculty member's details
export const updateFacultyDetails = (facultyId, details) => {
  const updates = getFacultyUpdates();
  updates[facultyId] = {
    ...updates[facultyId],
    ...details,
    lastUpdated: new Date().toISOString()
  };
  return saveFacultyUpdates(updates);
};

// Get a specific faculty member's updated details
export const getFacultyDetails = (facultyId) => {
  const updates = getFacultyUpdates();
  return updates[facultyId] || null;
};

// Get all faculty with their updated details merged
export const getAllFacultiesWithUpdates = (baseFaculties) => {
  const updates = getFacultyUpdates();
  return baseFaculties.map(faculty => ({
    ...faculty,
    ...(updates[faculty.id] || {})
  }));
};

// Clear all faculty updates
export const clearAllFacultyUpdates = () => {
  try {
    localStorage.removeItem(FACULTY_UPDATES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing faculty updates:', error);
    return false;
  }
};
