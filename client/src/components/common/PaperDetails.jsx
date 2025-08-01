
import React from 'react';
import { Link } from 'react-router-dom';

const PaperDetails = ({ paper, onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <button onClick={onBack} className="text-blue-500 hover:underline mb-4">
        &larr; Back to Papers
      </button>
      <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>
      <p className="text-gray-700 mb-8">{paper.description}</p>
      <Link
        to={`/courses/${paper.courseType}/${paper.level}`}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
      >
        View Courses
      </Link>
    </div>
  );
};

export default PaperDetails;
