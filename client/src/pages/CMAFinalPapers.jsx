
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CMAFinalPapers = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">CMA Final Papers</h1>
        {/* Paper content will be added here */}
        <div className="text-center mt-8">
          <Link
            to="/courses/cma/final/combo"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
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
