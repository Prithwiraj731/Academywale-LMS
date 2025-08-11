import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';

const papers = [
  { id: 1, title: 'Fundamentals of Business Laws' },
  { id: 2, title: 'Fundamentals of Financial and Cost Accounting' },
  { id: 3, title: 'Fundamentals of Business mathematics and statistics' },
  { id: 4, title: 'Fundamentals of Business Economics and Management' },
];

const CMAFoundationPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-center mb-8">CMA Foundation Papers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/cma/foundation/paper-${paper.id}`}
              className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">Paper - {paper.id}</h2>
              <p className="text-gray-100">{paper.title}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CMAFoundationPapers;
