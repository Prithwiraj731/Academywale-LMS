import React, { useEffect, useState, useMemo } from 'react';
import Particles from '../components/common/Particles';
import { PinContainer } from '../components/ui/3d-pin';
import { getAllFaculties } from '../data/hardcodedFaculties';
import { API_URL } from '../api';
import { FaSearch, FaTimes, FaGraduationCap, FaUserTie } from 'react-icons/fa';

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadAllFaculties = async () => {
    try {
      const baseFaculties = getAllFaculties();
      const res = await fetch(`${API_URL}/api/faculties`);
      const data = await res.json();
      
      if (res.ok && Array.isArray(data.faculties) && data.faculties.length > 0) {
        const dbFaculties = data.faculties;
        const mergedMap = new Map();
        
        baseFaculties.forEach(f => {
          mergedMap.set(f.slug, { ...f });
        });

        dbFaculties.forEach(f => {
          const slug = f.slug || `${f.first_name}-${f.last_name || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const existing = mergedMap.get(slug) || {};
          const fullName = `${f.first_name || f.firstName || ''} ${f.last_name || f.lastName || ''}`.trim();
          
          mergedMap.set(slug, {
            id: f.id || f._id || existing.id,
            name: fullName || existing.name,
            slug: slug,
            image: f.image_url || f.imageUrl || existing.image,
            specialization: (Array.isArray(f.teaches) ? f.teaches[0] : f.teaches) || f.specialization || existing.specialization,
            bio: f.bio || existing.bio
          });
        });

        setFaculties(Array.from(mergedMap.values()));
      } else {
        setFaculties(baseFaculties);
      }
    } catch (err) {
      setFaculties(getAllFaculties());
    }
  };

  useEffect(() => {
    loadAllFaculties();
  }, []);

  // Filter faculties based on search query and category
  const filteredFaculties = useMemo(() => {
    return faculties.filter(faculty => {
      const nameMatch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase());
      const specMatch = (faculty.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || specMatch;

      if (selectedCategory === 'All') return matchesSearch;

      const catUpper = selectedCategory.toUpperCase();
      const nameUpper = faculty.name.toUpperCase();
      const specUpper = (faculty.specialization || '').toUpperCase();

      const categoryMatch = nameUpper.includes(catUpper) || specUpper.includes(catUpper);
      return matchesSearch && categoryMatch;
    });
  }, [faculties, searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
      {/* Background Particles */}
      <Particles
        particleColors={['#20b2aa', '#ffffff', '#ffd600']}
        particleCount={120}
        particleSpread={15}
        speed={0.10}
        particleBaseSize={70}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Page Hero Header Section */}
        <section className="pt-10 pb-6 px-4 sm:px-6 max-w-7xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs sm:text-sm font-semibold mb-4 shadow-inner">
            <FaGraduationCap className="text-teal-400" />
            <span>INDIA'S TOP EDUCATORS</span>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Meet Our <span className="bg-gradient-to-r from-[#20b2aa] via-teal-300 to-amber-300 bg-clip-text text-transparent">Expert Faculties</span>
          </h1>

          <p className="text-gray-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Learn from India's most trusted CA & CMA faculty members with proven track records of rank holders and top exam results.
          </p>

          {/* Search & Category Filter Control Bar */}
          <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* Search Input Bar */}
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search faculty by name or subject..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none justify-center">
                {['All', 'CA', 'CMA'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-[#20b2aa] to-teal-600 text-white shadow-md shadow-teal-500/20'
                        : 'bg-slate-950 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count banner */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Showing <strong className="text-teal-400 font-bold">{filteredFaculties.length}</strong> Faculty Members</span>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-teal-400 hover:underline font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Faculties Grid Section */}
        <section className="flex-1 py-4 sm:py-8 px-2 xs:px-3 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {filteredFaculties.length > 0 ? (
              /* 2 Columns on Mobile (grid-cols-2), 3 on SM, 4 on MD, 5 on LG */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-7">
                {filteredFaculties.map(faculty => (
                  <PinContainer
                    key={faculty.id || faculty.slug}
                    title={faculty.name}
                    href={`/faculties/${faculty.slug}`}
                    containerClassName="w-full h-full min-w-[150px] xs:min-w-[170px] sm:min-w-[210px] md:min-w-[230px] max-w-[250px] min-h-[230px] sm:min-h-[300px] mx-auto flex items-center justify-center"
                  >
                    <div
                      className="group bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-4 sm:p-6 cursor-pointer hover:scale-[1.03] w-full h-full border border-teal-100/50"
                    >
                      <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 sm:border-4 border-[#20b2aa] bg-gradient-to-br from-[#e0f7f4] to-[#b3e5e0] flex items-center justify-center group-hover:border-[#17817a] transition-colors duration-300 shadow-md">
                        <img
                          src={faculty.image}
                          alt={faculty.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-[#e0f7f4] to-[#b3e5e0] flex items-center justify-center text-2xl sm:text-3xl font-bold text-teal-800" style={{ display: 'none' }}>
                          {faculty.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-gray-900 text-center leading-tight group-hover:text-[#20b2aa] transition-colors duration-300 line-clamp-2">
                        {faculty.name}
                      </div>
                      {faculty.specialization && (
                        <span className="mt-2 px-2.5 py-0.5 text-xs sm:text-sm font-medium text-teal-700 bg-teal-50 rounded-full border border-teal-100/80 text-center line-clamp-1 max-w-full">
                          {faculty.specialization}
                        </span>
                      )}
                    </div>
                  </PinContainer>
                ))}
              </div>
            ) : (
              /* Empty Search Results */
              <div className="max-w-md mx-auto text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl">
                <div className="w-16 h-16 bg-slate-800 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FaUserTie />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Faculties Found</h3>
                <p className="text-sm text-gray-400 mb-6">
                  No educators matched your search "{searchQuery}". Try searching with a different name or course keyword.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="bg-gradient-to-r from-[#20b2aa] to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-sm"
                >
                  Show All Faculties
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}