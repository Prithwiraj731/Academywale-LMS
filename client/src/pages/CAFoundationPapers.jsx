import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';

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
      <main className="flex-grow container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-7 sm:py-8">
        <BackButton />
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-center mb-6 xs:mb-7 sm:mb-8 text-gray-800">CA Foundation Papers</h1>
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/ca/foundation/paper-${paper.id}`}
              className="bg-teal-600 text-white p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-teal-700"
            >
              <h2 className="text-lg xs:text-xl sm:text-xl font-semibold mb-2 xs:mb-2.5 sm:mb-2">Paper - {paper.id}</h2>
              <p className="text-gray-100 text-sm xs:text-base sm:text-base leading-relaxed">{paper.title}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CAFoundationPapers;