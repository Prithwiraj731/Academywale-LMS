import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const papers = [
  { id: 1, title: 'Principles and Practice of Accounting' },
  { id: 2, title: 'Business Laws and Business Correspondence and Reporting' },
  { id: 3, title: 'Business Mathematics, Logical Reasoning & Statistics' },
  { id: 4, title: 'Business Economics & Business and Commercial Knowledge' },
];

const CAFoundationPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">CA Foundation Papers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/ca/foundation/paper-${paper.id}`}
              className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">Paper - {paper.id}</h2>
              <p className="text-gray-100">{paper.title}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/courses/ca/foundation/combo"
            className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-300 text-lg"
          >
            Combo Papers
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CAFoundationPapers;