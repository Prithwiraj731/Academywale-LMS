import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { getFacultyImageUrl } from '../utils/imageUtils';
import { getFacultyBySlug } from '../data/hardcodedFaculties';
import { API_URL } from '../api';
import CourseCard from '../components/common/CourseCard/CourseCard';

export default function FacultyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [facultyInfo, setFacultyInfo] = useState({ bio: '', teaches: [], imageUrl: '', firstName: '', lastName: '', slug: '' });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

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
        } else {
          setError(data.error || 'Could not fetch courses');
        }
      } catch (err) {
        setError('Server error');
      }
      setLoading(false);
    }
    if (slug) fetchCourses();
  }, [slug]);

  useEffect(() => {
    async function loadFacultyInfo() {
      if (slug) {
        let facultyData = null;
        const hardcoded = getFacultyBySlug(slug);

        try {
          const res = await fetch(`${API_URL}/api/faculties/${slug}`);
          if (res.ok) {
            const apiFac = await res.json();
            if (apiFac && (apiFac.first_name || apiFac.firstName)) {
              const fName = apiFac.first_name || apiFac.firstName || '';
              const lName = apiFac.last_name || apiFac.lastName || '';
              const fullName = `${fName} ${lName}`.trim();
              facultyData = {
                firstName: fullName,
                lastName: '',
                bio: apiFac.bio || (hardcoded ? `Expert ${hardcoded.specialization} faculty with years of professional experience in teaching and industry practice.` : 'Expert faculty with extensive teaching experience.'),
                teaches: Array.isArray(apiFac.teaches) ? apiFac.teaches : (apiFac.teaches ? [apiFac.teaches] : (hardcoded ? [hardcoded.specialization] : [])),
                imageUrl: apiFac.image_url || apiFac.imageUrl || hardcoded?.image || '',
                image: apiFac.image_url || apiFac.imageUrl || hardcoded?.image || '',
                slug: apiFac.slug || slug,
                public_id: apiFac.public_id || hardcoded?.public_id
              };
            }
          }
        } catch (err) {
          console.error('Error fetching faculty info from API:', err);
        }

        if (!facultyData && hardcoded) {
          facultyData = {
            bio: `Expert ${hardcoded.specialization} faculty with years of professional experience in teaching and industry practice.`,
            teaches: [hardcoded.specialization],
            imageUrl: hardcoded.image,
            firstName: hardcoded.name,
            lastName: '',
            slug: hardcoded.slug,
            image: hardcoded.image,
            public_id: hardcoded.public_id
          };
        }

        if (facultyData) {
          setFacultyInfo(facultyData);
        } else {
          setFacultyInfo({ bio: '', teaches: [], imageUrl: '', firstName: slug.replace(/-/g, ' ').toUpperCase(), lastName: '', slug });
        }
      }
    }
    loadFacultyInfo();
  }, [slug]);

  const displayFacultyName = (facultyInfo.firstName ? facultyInfo.firstName : '') + (facultyInfo.lastName ? ' ' + facultyInfo.lastName : '');

  const filterCourses = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => {
        if (course.courseType) {
          return course.courseType.toLowerCase().includes(filter.toLowerCase());
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 py-8 px-2 sm:px-6 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        
        {/* Faculty Info Header Card */}
        <div className="w-full flex flex-col md:flex-row items-center gap-6 sm:gap-8 bg-white/95 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80 mb-8 mt-4">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-md border-4 border-[#20b2aa] bg-gray-100 flex-shrink-0 flex items-center justify-center">
            <img
              src={getFacultyImageUrl(facultyInfo)}
              alt={displayFacultyName}
              className="object-cover w-full h-full"
              onError={(e) => {
                const matched = getFacultyBySlug(slug);
                if (matched && matched.image && e.target.src !== matched.image) {
                  e.target.src = matched.image;
                } else {
                  e.target.src = '/logo.svg';
                }
              }}
            />
          </div>
          <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{displayFacultyName}</h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
              {facultyInfo.bio || 'Expert Faculty at AcademyWale'}
            </p>
            {facultyInfo.teaches && facultyInfo.teaches.length > 0 && (
              <div className="inline-block bg-teal-50 px-4 py-1.5 rounded-xl border border-teal-200 text-teal-800 text-sm font-bold w-fit mx-auto md:mx-0">
                Specialization: {facultyInfo.teaches.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Courses Offered Section */}
        <div className="bg-white/95 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Courses by {displayFacultyName}
            </h2>
            
            {/* Filter Pill Buttons */}
            {!loading && !error && courses.length > 0 && getFilterButtons().length > 1 && (
              <div className="flex flex-wrap gap-2">
                {getFilterButtons().map(filter => (
                  <button
                    key={filter}
                    onClick={() => filterCourses(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all ${
                      selectedFilter === filter
                        ? 'bg-[#20b2aa] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'All Courses' : filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#20b2aa] mx-auto mb-3"></div>
              <div className="text-gray-500 font-semibold text-sm">Loading courses...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500 font-bold">{error}</div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-gray-500 font-semibold text-base">No courses available for this faculty.</div>
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id || course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
