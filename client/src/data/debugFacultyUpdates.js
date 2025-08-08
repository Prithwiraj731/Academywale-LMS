// Debug helper for testing faculty updates
import { updateFacultyDetails, getFacultyDetails, getAllFacultiesWithUpdates } from './facultyUpdates';
import { getAllFaculties } from './hardcodedFaculties';

// Test function to manually update a faculty member (for debugging)
window.testFacultyUpdate = (facultyId, bio, teaches) => {
  console.log('🧪 Testing faculty update for ID:', facultyId);
  
  // Update the faculty
  const success = updateFacultyDetails(facultyId, { bio, teaches });
  console.log('💾 Update result:', success);
  
  // Check if it was saved
  const saved = getFacultyDetails(facultyId);
  console.log('📋 Saved details:', saved);
  
  // Test the merged data
  const allFaculties = getAllFaculties();
  const merged = getAllFacultiesWithUpdates(allFaculties);
  const updatedFaculty = merged.find(f => f.id === facultyId);
  console.log('✅ Merged faculty data:', updatedFaculty);
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('facultyUpdated', { 
    detail: { facultyId, updates: { bio, teaches } } 
  }));
  console.log('🔔 Event dispatched');
  
  return { success, saved, updatedFaculty };
};

// Test function to get all faculty updates
window.getAllFacultyUpdates = () => {
  const updates = JSON.parse(localStorage.getItem('faculty_updates') || '{}');
  console.log('📝 All faculty updates in localStorage:', updates);
  return updates;
};

// Test function to clear all updates
window.clearAllUpdates = () => {
  localStorage.removeItem('faculty_updates');
  console.log('🗑️ All faculty updates cleared');
  window.location.reload();
};

console.log('🛠️ Debug functions loaded:');
console.log('- testFacultyUpdate(facultyId, bio, teaches)');
console.log('- getAllFacultyUpdates()');
console.log('- clearAllUpdates()');
