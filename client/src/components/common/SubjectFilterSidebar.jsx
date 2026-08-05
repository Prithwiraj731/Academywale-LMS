import React from 'react';
import { FaFilter, FaTimes, FaUndo, FaSearch } from 'react-icons/fa';

export const PRESET_SUBJECTS = {
  CMA_INTER: [
    'Financial Accounting',
    'Laws and Ethics',
    'Direct Taxation',
    'Indirect Taxation',
    'Taxation',
    'Cost Accounting',
    'OMSM',
    'Corporate Accounts',
    'Audit',
    'Corporate Accounts and Audit',
    'FM-BDA',
    'Management Account'
  ],
  CA_INTER: [
    'Advanced Accounting',
    'Corporate and Other Laws',
    'Income Tax Law',
    'Indirect Tax Laws',
    'Taxation',
    'Cost and Management Accounting',
    'Auditing and Ethics',
    'Financial Management',
    'Strategic Management',
    'FM & SM'
  ],
  CMA_FINAL: [
    'Corporate & Economic Laws',
    'Strategic Financial Management',
    'Direct Tax Laws & International Taxation',
    'Strategic Cost Management',
    'Cost & Management Audit',
    'Corporate Financial Reporting',
    'Indirect Tax Laws & Practice'
  ],
  CA_FINAL: [
    'Financial Reporting',
    'Advanced Financial Management',
    'Advanced Auditing & Professional Ethics',
    'Direct Tax Laws & International Tax',
    'Indirect Tax Laws',
    'Integrated Business Solutions'
  ]
};

export default function SubjectFilterSidebar({
  categoryTitle = 'Subject Filter',
  selectedSubjects = [],
  onSubjectChange,
  availableSubjects = [],
  onClearFilters,
  onCloseMobile
}) {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Combine available subjects with preset default list
  const combinedSubjects = React.useMemo(() => {
    const set = new Set();
    // Add available subjects from DB courses first
    (availableSubjects || []).forEach(s => {
      if (s && typeof s === 'string' && s.trim()) {
        set.add(s.trim());
      }
    });

    // Determine category defaults to include
    let defaults = [];
    const catUpper = String(categoryTitle).toUpperCase();
    if (catUpper.includes('CMA') && (catUpper.includes('INTER') || catUpper.includes('PAPER'))) {
      defaults = PRESET_SUBJECTS.CMA_INTER;
    } else if (catUpper.includes('CA') && (catUpper.includes('INTER') || catUpper.includes('PAPER'))) {
      defaults = PRESET_SUBJECTS.CA_INTER;
    } else if (catUpper.includes('CMA') && catUpper.includes('FINAL')) {
      defaults = PRESET_SUBJECTS.CMA_FINAL;
    } else if (catUpper.includes('CA') && catUpper.includes('FINAL')) {
      defaults = PRESET_SUBJECTS.CA_FINAL;
    } else {
      defaults = [...PRESET_SUBJECTS.CMA_INTER, ...PRESET_SUBJECTS.CA_INTER];
    }

    defaults.forEach(d => set.add(d));
    return Array.from(set);
  }, [availableSubjects, categoryTitle]);

  const filteredSubjectList = combinedSubjects.filter(sub => 
    sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxToggle = (subject) => {
    if (selectedSubjects.includes(subject)) {
      onSubjectChange(selectedSubjects.filter(s => s !== subject));
    } else {
      onSubjectChange([...selectedSubjects, subject]);
    }
  };

  return (
    <aside className="w-full md:w-72 bg-white rounded-3xl border border-gray-200/80 p-5 shadow-lg flex flex-col shrink-0 transition-all duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-[#20b2aa] text-lg" />
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Subject</h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedSubjects.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear Subject Filters"
            >
              <FaUndo className="text-[10px]" /> Clear
            </button>
          )}

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Category Level Subtitle */}
      {categoryTitle && (
        <div className="mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {categoryTitle}
          </span>
        </div>
      )}

      {/* Quick Search inside Subject List */}
      {combinedSubjects.length > 8 && (
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:bg-white"
          />
          <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>
      )}

      {/* Active Filter Counter Pill */}
      {selectedSubjects.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {selectedSubjects.map(sub => (
            <span
              key={sub}
              className="bg-teal-50 text-teal-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-teal-200 flex items-center gap-1"
            >
              {sub}
              <button
                onClick={() => handleCheckboxToggle(sub)}
                className="hover:text-teal-950 font-bold ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Subject Checkboxes Container */}
      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredSubjectList.length === 0 ? (
          <p className="text-xs text-gray-400 py-3 text-center">No subjects match search</p>
        ) : (
          filteredSubjectList.map(subject => {
            const isChecked = selectedSubjects.includes(subject);
            return (
              <label
                key={subject}
                className={`
                  flex items-center gap-3 p-2 rounded-xl text-sm font-medium transition-all cursor-pointer select-none
                  ${isChecked 
                    ? 'bg-teal-50/80 text-teal-900 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxToggle(subject)}
                  className="w-4 h-4 text-[#20b2aa] border-gray-300 rounded focus:ring-[#20b2aa] cursor-pointer"
                />
                <span className="leading-snug">{subject}</span>
              </label>
            );
          })
        )}
      </div>
    </aside>
  );
}
