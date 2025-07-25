import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoursePurchase from '../components/common/CoursePurchase';
import { useAuth } from '../context/AuthContext';

const MODES = ['Live Watching', 'Recorded Videos'];
const DURATIONS = ['August 2025', 'February 2026', 'August 2026', 'February 2027', 'August 2027'];
const API_URL = import.meta.env.VITE_API_URL;

export default function FacultyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState(MODES[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [purchaseStatus, setPurchaseStatus] = useState({});
  const [facultyInfo, setFacultyInfo] = useState({ bio: '', teaches: [], imageUrl: '', firstName: '', lastName: '', slug: '' });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedValidity, setSelectedValidity] = useState('');

  const firstName = facultyInfo.firstName || '';

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/courses/${slug}`);
        const data = await res.json();
        if (res.ok) {
          const coursesData = data.courses || [];
          setCourses(coursesData);
          setFilteredCourses(coursesData);
          if (user && user._id) {
            checkPurchaseStatus(coursesData);
          }
        } else {
          setError(data.error || 'Could not fetch courses');
        }
      } catch (err) {
        setError('Server error');
      }
      setLoading(false);
    }
    if (slug) fetchCourses();
  }, [slug, user]);

  useEffect(() => {
    async function fetchFacultyInfo() {
      if (slug) {
        try {
          const res = await fetch(`${API_URL}/api/faculty-info/${slug}`);
          const data = await res.json();
          if (res.ok && data.bio !== undefined) {
            setFacultyInfo({
              bio: data.bio || '',
              teaches: data.teaches || [],
              imageUrl: data.imageUrl || '',
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              slug: data.slug || ''
            });
          } else {
            setFacultyInfo({ bio: '', teaches: [], imageUrl: '', firstName: '', lastName: '', slug: '' });
          }
        } catch {
          setFacultyInfo({ bio: '', teaches: [], imageUrl: '', firstName: '', lastName: '', slug: '' });
        }
      }
    }
    fetchFacultyInfo();
  }, [slug]);

  const checkPurchaseStatus = async (coursesList) => {
    const status = {};
    for (let i = 0; i < coursesList.length; i++) {
      try {
        const response = await fetch(`/api/purchase/check/${user._id}/${slug}/${i}`);
        const data = await response.json();
        if (data.success) {
          status[i] = data.hasPurchased;
        }
      } catch (err) {
        console.error('Error checking purchase status:', err);
      }
    }
    setPurchaseStatus(status);
  };

  const handlePurchaseSuccess = (purchase) => {
    // Update purchase status for the course
    setPurchaseStatus(prev => ({
      ...prev,
      [purchase.courseIndex]: true
    }));
  };

  // Use the correct display name
  const displayFacultyName = (facultyInfo.firstName ? facultyInfo.firstName : '') + (facultyInfo.lastName ? ' ' + facultyInfo.lastName : '');

  // Mode/duration selection per course
  const getCourseModes = (course) => {
    if (Array.isArray(course.modes) && course.modes.length > 0) {
      return course.modes;
    }
    // Fallback to default modes if no custom modes set
    return MODES;
  };
  const getCourseDurations = (course) => {
    if (Array.isArray(course.durations) && course.durations.length > 0) {
      return course.durations;
    }
    // Fallback to default durations if no custom durations set
    return DURATIONS;
  };

  const getFacultyImage = (fac) => {
    if (fac.imageUrl && fac.imageUrl !== '/logo.svg') {
      if (fac.imageUrl.startsWith('http')) return fac.imageUrl;
      if (fac.imageUrl.startsWith('/uploads')) return `${API_URL}${fac.imageUrl}`;
      if (fac.imageUrl.startsWith('/static')) return fac.imageUrl;
    }
    return '/logo.svg';
  };

  const getPosterUrl = (course) => {
    if (course.posterUrl) {
      if (course.posterUrl.startsWith('http')) return course.posterUrl;
      if (course.posterUrl.startsWith('/uploads')) return `${API_URL}${course.posterUrl}`;
    }
    return '/logo.svg';
  };

  const filterCourses = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => {
        if (course.courseType) {
          const courseTypeLower = course.courseType.toLowerCase();
          return courseTypeLower.includes(filter.toLowerCase());
        }
        return false;
      });
      setFilteredCourses(filtered);
    }
  };

  const getFilterButtons = () => {
    const filters = ['all'];
    const courseTypes = [...new Set(courses.map(c => c.courseType).filter(Boolean))];
    
    courseTypes.forEach(type => {
      filters.push(type.toLowerCase());
    });
    
    return filters;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7] py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <button
          className="mb-6 text-blue-600 font-semibold hover:underline flex items-center text-base"
          onClick={() => navigate('/faculties')}
        >
          ← Back to Faculties
        </button>
        {/* Faculty Info Section */}
        <div className="w-full flex flex-col md:flex-row items-center gap-8 bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-100 mb-10">
          <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-blue-200 bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {getFacultyImage(facultyInfo) ? (
              <img src={getFacultyImage(facultyInfo)} alt={displayFacultyName} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center h-full">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{displayFacultyName}</h2>
            <p className="text-gray-700 mb-2 text-base sm:text-lg">{facultyInfo.bio ? facultyInfo.bio : 'No bio available.'}</p>
            {facultyInfo.teaches.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-blue-700">Teaches: </span>
                <span className="text-gray-800">{facultyInfo.teaches.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
        {/* Courses Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-purple-700 mb-6">Courses by {displayFacultyName}</h3>
          
          {/* Filter Buttons */}
          {!loading && !error && courses.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {getFilterButtons().map(filter => (
                  <button
                    key={filter}
                    onClick={() => filterCourses(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedFilter === filter
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter === 'all' ? 'All Courses' : filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {loading && <div className="text-blue-500">Loading courses...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && filteredCourses.length === 0 && <div className="text-gray-500">No courses found for this faculty.</div>}
          <div className="flex flex-col gap-12">
            {filteredCourses.map((course, idx) => (
              <div key={idx} className="bg-white/95 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-blue-100">
                {/* Course Poster Only */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-blue-200 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {course.posterUrl ? (
                    <img src={getPosterUrl(course)} alt="Poster" className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Poster</div>
                  )}
                </div>
                {/* Course Info */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  {/* Title & Batch */}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">{course.subject}</div>
                    {course.courseType && (
                      <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full shadow-md ml-2">{course.courseType}</span>
                    )}

                    {purchaseStatus[idx] && (
                      <span className="inline-block bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                        ✓ Purchased
                      </span>
                    )}
                  </div>
                  {/* Price Block */}
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200 w-fit">
                    <span className="text-xl font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                    <span className="text-2xl font-bold text-indigo-700">₹{course.sellingPrice}</span>
                    {course.costPrice > course.sellingPrice && (
                      <span className="bg-green-400 text-white font-bold px-4 py-1 rounded-full text-base">
                        {Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100)}% off
                      </span>
                    )}
                  </div>
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-base text-gray-700 mb-2">
                    <div><span className="font-semibold">Faculty:</span> {course.facultyName}</div>
                    <div><span className="font-semibold">Lectures:</span> {course.noOfLecture}</div>
                    <div><span className="font-semibold">Language:</span> {course.videoLanguage}</div>
                    <div><span className="font-semibold">Run On:</span> {course.videoRunOn}</div>
                    <div><span className="font-semibold">Doubt Solving:</span> {course.doubtSolving}</div>
                    <div><span className="font-semibold">Support:</span> {course.supportMail} {course.supportCall}</div>
                  </div>
                  {/* Description */}
                  {course.description && <div className="text-gray-600 text-base mb-2">{course.description}</div>}
                  {/* Mode, Duration, Books, Validity Dropdowns */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Mode</label>
                      <select
                        value={selectedMode}
                        onChange={e => setSelectedMode(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px]"
                      >
                        {getCourseModes(course).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Attempt</label>
                      <select
                        value={selectedDuration}
                        onChange={e => setSelectedDuration(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 min-w-[180px]"
                      >
                        {getCourseDurations(course).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Books</label>
                      <select
                        value={selectedBook || (Array.isArray(course.books) ? course.books[0] : (course.books || ''))}
                        onChange={e => setSelectedBook(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 min-w-[180px]"
                      >
                        {(Array.isArray(course.books) ? course.books : (typeof course.books === 'string' ? course.books.split(',').map(b => b.trim()) : [])).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 mb-1">Validity</label>
                      <select
                        value={selectedValidity || (Array.isArray(course.validityStartFrom) ? course.validityStartFrom[0] : (course.validityStartFrom || ''))}
                        onChange={e => setSelectedValidity(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[180px]"
                      >
                        {(Array.isArray(course.validityStartFrom) ? course.validityStartFrom : (typeof course.validityStartFrom === 'string' ? course.validityStartFrom.split(',').map(v => v.trim()) : [])).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Purchase Buttons */}
                  {purchaseStatus[idx] ? (
                    <button
                      onClick={() => navigate('/student-dashboard')}
                      className="mt-4 sm:mt-7 bg-green-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-600 transition-all text-lg"
                    >
                      Access Course
                    </button>
                  ) : (
                    <div className="mt-4 sm:mt-7 w-full sm:w-auto">
                      <button
                        onClick={() => navigate(`/payment/${facultyInfo.slug}/${idx}`, { state: { selectedAttempt: selectedDuration } })}
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all text-lg w-full sm:w-auto"
                      >
                        Buy Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 