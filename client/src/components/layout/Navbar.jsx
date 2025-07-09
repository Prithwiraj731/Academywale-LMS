import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Main navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo only */}
            <div className="flex items-center">
              <img src="/academywale.svg" alt="Academywale Logo" className="h-16 w-auto object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 font-bold text-lg">
              <Link to="/" className="text-gray-800 hover:text-primary transition">Home</Link>
              <div className="relative group">
                <button className="text-gray-800 hover:text-primary transition flex items-center font-bold">
                  Video Lectures
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="font-semibold text-primary mb-2">CA</h4>
                      <div className="space-y-1 text-sm">
                        <a href="#" className="block hover:text-primary">CA INTER</a>
                        <a href="#" className="block hover:text-primary">CA FINAL</a>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">CMA</h4>
                      <div className="space-y-1 text-sm">
                        <a href="#" className="block hover:text-primary">CMA INTER</a>
                        <a href="#" className="block hover:text-primary">CMA FINAL</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#" className="text-gray-800 hover:text-primary transition">Test Series</a>
              <Link to="/faculties" className="text-gray-800 hover:text-primary transition">Faculties</Link>
              <Link to="/about" className="text-gray-800 hover:text-primary transition">About</Link>
              <Link to="/contact" className="text-gray-800 hover:text-primary transition">Contact</Link>
            </div>

            {/* Account Button */}
            <div className="flex items-center space-x-4">
              <button className="btn-primary">
                Account
              </button>
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                <Link to="/" className="block py-2 text-gray-700 hover:text-primary">Home</Link>
                <a href="#" className="block py-2 text-gray-700 hover:text-primary">Video Lectures</a>
                <a href="#" className="block py-2 text-gray-700 hover:text-primary">Test Series</a>
                <Link to="/faculties" className="block py-2 text-gray-700 hover:text-primary">Faculties</Link>
                <Link to="/about" className="block py-2 text-gray-700 hover:text-primary">About</Link>
                <Link to="/contact" className="block py-2 text-gray-700 hover:text-primary">Contact</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
} 