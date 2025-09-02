import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';

const group1 = [
  { id: 5, title: 'Advanced Accounting' },
  { id: 6, title: 'Corporate and Other Laws' },
  { id: 7, title: 'Taxation (Income tax laws & Goods & Service Tax)' },
];

const group2 = [
  { id: 8, title: 'Cost and Management Accounting' },
  { id: 9, title: 'Auditing and ethics' },
  { id: 10, title: 'Financial Management and Strategic Management' },
];

const CAInterPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-7 sm:py-8">
        <BackButton />
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-center mb-6 xs:mb-7 sm:mb-8 text-gray-800">CA Inter Papers</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-7 sm:gap-8">
          <div className="mb-6 xs:mb-7 sm:mb-0">
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold mb-3 xs:mb-4 sm:mb-4 text-gray-800">Group I</h2>
            <div className="space-y-3 xs:space-y-4 sm:space-y-4">
              {group1.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/inter/paper-${paper.id}`}
                  className="bg-teal-600 text-white p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-teal-700 block"
                >
                  <h3 className="text-lg xs:text-xl sm:text-xl font-semibold mb-2 xs:mb-2.5 sm:mb-2">Paper - {paper.id}</h3>
                  <p className="text-gray-100 text-sm xs:text-base sm:text-base leading-relaxed">{paper.title}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-2xl font-bold mb-3 xs:mb-4 sm:mb-4 text-gray-800">Group II</h2>
            <div className="space-y-3 xs:space-y-4 sm:space-y-4">
              {group2.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/inter/paper-${paper.id}`}
                  className="bg-teal-600 text-white p-4 xs:p-5 sm:p-6 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-teal-700 block"
                >
                  <h3 className="text-lg xs:text-xl sm:text-xl font-semibold mb-2 xs:mb-2.5 sm:mb-2">Paper - {paper.id}</h3>
                  <p className="text-gray-100 text-sm xs:text-base sm:text-base leading-relaxed">{paper.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CAInterPapers;
