import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user._id) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/purchase/user/${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setPurchases(data.purchases);
      } else {
        setError(data.message || 'Failed to fetch purchases');
      }
    } catch (err) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (isExpired, paymentStatus) => {
    if (isExpired) return 'text-red-600';
    if (paymentStatus === 'completed') return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusText = (isExpired, paymentStatus) => {
    if (isExpired) return 'Expired';
    if (paymentStatus === 'completed') return 'Active';
    return 'Pending';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-[#20b2aa]">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white uppercase">
                  {user.firstName ? user.firstName[0] : (user.name ? user.name[0] : 'U')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Welcome back, {user.firstName || user.name || 'User'}!</h1>
                <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">Continue your learning journey</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xl sm:text-2xl font-bold text-[#20b2aa]">{purchases.length}</div>
              <div className="text-gray-600 text-sm sm:text-base">Courses Purchased</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Active Courses</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {purchases.filter(p => !p.isExpired && p.paymentStatus === 'completed').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">Learning Hours</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {purchases.length * 120}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-[#20b2aa]">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-center py-8">{error}</div>
          )}

          {!loading && !error && purchases.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6">Start your learning journey by purchasing your first course!</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all text-sm sm:text-base"
              >
                Browse Courses
              </button>
            </div>
          )}

          {!loading && !error && purchases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                  {purchase.courseDetails.posterUrl && (
                    <div className="relative">
                      <img 
                        src={`${API_URL}${purchase.courseDetails.posterUrl}`} 
                        alt={purchase.courseDetails.subject}
                        className="w-full h-32 sm:h-48 object-cover rounded-t-xl"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(purchase.isExpired, purchase.paymentStatus)} bg-white shadow-lg`}>
                          {getStatusText(purchase.isExpired, purchase.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                      {purchase.courseDetails.subject}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      by {purchase.facultyName}
                    </p>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Lectures:</span>
                        <span className="font-semibold">{purchase.courseDetails.noOfLecture}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Mode:</span>
                        <span className="font-semibold">{purchase.courseDetails.mode}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Language:</span>
                        <span className="font-semibold">{purchase.courseDetails.videoLanguage}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Purchased:</span>
                        <span>{formatDate(purchase.purchaseDate)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Expires:</span>
                        <span>{formatDate(purchase.accessExpiry)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Start Learning
                      </button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}