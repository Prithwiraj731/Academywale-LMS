import React, { useState } from 'react';
import { API_URL } from '../../api';

const DeleteAllCoursesButton = ({ onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAllCourses = async () => {
    if (!window.confirm('WARNING: This will delete ALL courses from the system. This action cannot be undone. Are you absolutely sure?')) {
      return;
    }
    
    setIsDeleting(true);
    setResult(null);
    setError(null);
    
    try {
      console.log('Sending delete request to:', `${API_URL}/api/admin/courses/delete-all`);
      const response = await fetch(`${API_URL}/api/admin/courses/delete-all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response received:', await response.text());
        throw new Error('Unexpected response format from server');
      }
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok || response.status === 207) {
        setResult(data);
        
        // If there were partial errors, show them too
        if (data.partial && data.errors) {
          const errorDetails = data.errors.map(err => 
            `${err.type}: ${err.error}`
          ).join('; ');
          setError(`Warning: ${data.message} Errors: ${errorDetails}`);
        }
        
        // Call onDeleteSuccess callback if provided
        if (typeof onDeleteSuccess === 'function' && data.deletedCount > 0) {
          setTimeout(() => {
            onDeleteSuccess();
          }, 1000);
        }
        
        // Auto-hide confirmation after showing success
        setTimeout(() => {
          if (data.deletedCount > 0) {
            setShowConfirmation(false);
          }
        }, 5000);
      } else {
        setError(data.error || 'Failed to delete courses');
      }
    } catch (err) {
      console.error('Error deleting courses:', err);
      setError(`Server error occurred: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="my-6">
      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete All Courses
        </button>
      ) : (
        <div className="border border-red-300 bg-red-50 p-4 rounded-md">
          <h4 className="text-lg font-bold text-red-700 mb-2">Delete All Courses</h4>
          <p className="text-red-600 mb-4">
            WARNING: This will delete ALL courses from the system.
            This action cannot be undone. Are you sure you want to proceed?
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleDeleteAllCourses}
              disabled={isDeleting}
              className={`px-4 py-2 ${isDeleting ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition-colors`}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete All Courses'}
            </button>
            
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md text-green-800">
              {result.message || `Successfully deleted ${result.deletedCount} courses.`}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
              <div className="font-semibold mb-1">Error:</div>
              <div className="text-sm whitespace-pre-wrap overflow-auto max-h-40">
                {error}
              </div>
              <div className="mt-2 text-sm">
                <p>Try refreshing the page and attempting again. If the issue persists, please check the server logs.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteAllCoursesButton;
