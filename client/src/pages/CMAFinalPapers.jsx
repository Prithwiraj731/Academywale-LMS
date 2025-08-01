import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const group3 = [
  { id: 13, title: 'Corporate & Economic Laws' },
  { id: 14, title: 'Strategic Financial Management' },
  { id: 15, title: 'Direct Tax Laws and International Taxation' },
  { id: 16, title: 'Strategic Cost Management' },
];

const group4 = [
  { id: 17, title: 'Cost & Management Audit' },
  { id: 18, title: 'Corporate Financial Reporting' },
  { id: 19, title: 'Indirect Tax Laws & Practice' },
  { id: 20, title: 'Strategic Performance Management and Business Valuation' },
];

const CMAFinalPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">CMA Final Papers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Group III</h2>
            <div className="space-y-4">
              {group3.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/cma/final/paper-${paper.id}`}
                  className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 block"
                >
                  <h3 className="text-xl font-semibold mb-2">Paper - {paper.id}</h3>
                  <p className="text-gray-100">{paper.title}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Group IV</h2>
            <div className="space-y-4">
              {group4.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/cma/final/paper-${paper.id}`}
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
            to="/courses/cma/final/combo"
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

export default CMAFinalPapers;