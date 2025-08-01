import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';

const group1 = [
  { id: 11, title: 'Financial Reporting' },
  { id: 12, title: 'Advanced Financial Management' },
  { id: 13, title: 'Advanced Auditing and Professional Ethics' },
  { id: 14, title: 'Corporate and Other Laws' },
];

const group2 = [
  { id: 15, title: 'Strategic Cost Management and Performance Evaluation' },
  { id: 16, title: 'Electives (various options)' },
  { id: 17, title: 'Direct Tax Laws and International Taxation' },
  { id: 18, title: 'Indirect Tax Laws' },
];

const CAFinalPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-center mb-8">CA Final Papers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Group I</h2>
            <div className="space-y-4">
              {group1.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/final/paper-${paper.id}`}
                  className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 block"
                >
                  <h3 className="text-xl font-semibold mb-2">Paper - {paper.id}</h3>
                  <p className="text-gray-100">{paper.title}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Group II</h2>
            <div className="space-y-4">
              {group2.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/final/paper-${paper.id}`}
                  className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 block"
                >
                  <h3 className="text-xl font-semibold mb-2">Paper - {paper.id}</h3>
                  <p className="text-gray-100">{paper.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/courses/ca/final/combo"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-300 text-lg w-full md:w-auto"
          >
            Combo Papers
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CAFinalPapers;
