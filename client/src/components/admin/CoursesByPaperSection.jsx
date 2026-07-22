import React, { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../api';
import DeleteAllCoursesButton from './DeleteAllCoursesButton';

const emptyGroups = () => ({
  CA: { Foundation: [], Inter: [], Final: [] },
  CMA: { Foundation: [], Inter: [], Final: [] }
});

const normalizeLevel = (value = '') => {
  const lower = String(value).toLowerCase();
  if (lower.includes('foundation')) return 'Foundation';
  if (lower.includes('inter')) return 'Inter';
  if (lower.includes('final')) return 'Final';
  return 'Foundation';
};

const getCourseId = (course) => course?.id || course?._id || course?.mongo_id || '';

const CoursesByPaperSection = ({ onEditCourse, onDeleteCourse, onCloneCourse, refreshKey = 0 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/courses/all`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load courses');
      }

      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [refreshKey]);

  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return courses;

    return courses.filter(course => [
      course.title,
      course.subject,
      course.facultyName,
      course.instituteName,
      course.category,
      course.subcategory,
      course.paperId,
      course.paperName
    ].some(value => String(value || '').toLowerCase().includes(term)));
  }, [courses, query]);

  const groupedCourses = useMemo(() => {
    const grouped = emptyGroups();

    filteredCourses.forEach(course => {
      const category = String(course.category || '').toUpperCase() === 'CMA' ? 'CMA' : 'CA';
      const level = normalizeLevel(course.subcategory || course.courseType);
      grouped[category][level].push(course);
    });

    Object.values(grouped).forEach(levels => {
      Object.values(levels).forEach(list => {
        list.sort((a, b) => {
          const orderA = a.displayOrder !== undefined && a.displayOrder !== null ? Number(a.displayOrder) : (a.sequence !== undefined ? Number(a.sequence) : 9999);
          const orderB = b.displayOrder !== undefined && b.displayOrder !== null ? Number(b.displayOrder) : (b.sequence !== undefined ? Number(b.sequence) : 9999);
          if (orderA !== orderB) return orderA - orderB;
          const paperA = Number(a.paperId || a.paper_id || 999);
          const paperB = Number(b.paperId || b.paper_id || 999);
          if (paperA !== paperB) return paperA - paperB;
          return String(a.title || a.subject || '').localeCompare(String(b.title || b.subject || ''));
        });
      });
    });

    return grouped;
  }, [filteredCourses]);

  const handleMoveCourse = async (list, currentIndex, direction) => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const newList = [...list];
    const temp = newList[currentIndex];
    newList[currentIndex] = newList[targetIndex];
    newList[targetIndex] = temp;

    // Create a map of updated display order for each course in the list
    const updatedOrders = {};
    newList.forEach((course, idx) => {
      const id = getCourseId(course);
      if (id) {
        updatedOrders[id] = idx + 1;
      }
    });

    // Optimistically update local courses state
    setCourses(prevCourses => {
      return prevCourses.map(c => {
        const id = getCourseId(c);
        if (updatedOrders[id] !== undefined) {
          return {
            ...c,
            displayOrder: updatedOrders[id],
            display_order: updatedOrders[id]
          };
        }
        return c;
      });
    });

    const reorderPayload = newList.map((course, idx) => ({
      id: getCourseId(course),
      displayOrder: idx + 1
    }));

    try {
      let res = await fetch(`${API_URL}/api/courses/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items: reorderPayload })
      });
      if (!res.ok) {
        res = await fetch(`${API_URL}/api/admin/courses/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ items: reorderPayload })
        });
      }
      if (res.ok) {
        await loadCourses();
      }
    } catch (err) {
      console.error('Failed to save reordered courses:', err);
    }


  };

  const handleEdit = (course) => {
    const courseId = getCourseId(course);
    if (typeof onEditCourse === 'function') {
      onEditCourse(course.facultySlug || 'by-id', courseId, course);
    }
  };

  const handleClone = (course) => {
    if (typeof onCloneCourse === 'function') {
      onCloneCourse(course);
    }
  };

  const handleDelete = async (course) => {
    const courseId = getCourseId(course);
    if (typeof onDeleteCourse === 'function') {
      await onDeleteCourse(course.facultySlug || 'by-id', courseId, course);
      await loadCourses();
    }
  };

  const renderCourseRow = (course, index, list) => {
    const courseId = getCourseId(course);
    const title = course.title || course.subject || 'Untitled Course';
    const price = Number(course.sellingPrice || 0);
    const cost = Number(course.costPrice || 0);

    return (
      <tr key={courseId || `${title}-${course.paperId}`} className="border-b border-gray-100 last:border-b-0 hover:bg-purple-50/40">
        <td className="p-3 text-center align-middle font-bold text-xs text-purple-700">
          #{index + 1}
        </td>
        <td className="p-3 align-top">
          <div className="flex items-start gap-3">
            {course.posterUrl ? (
              <img
                src={course.posterUrl}
                alt={title}
                className="h-14 w-14 rounded-md border border-gray-200 object-cover bg-gray-50"
              />
            ) : (
              <div className="h-14 w-14 rounded-md border border-dashed border-gray-300 bg-gray-50" />
            )}
            <div>
              <div className="font-bold text-gray-900 leading-tight">{title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {course.paperName 
                  ? (course.paperName.toLowerCase().startsWith('paper') ? course.paperName : `Paper ${course.paperId || 'N/A'} - ${course.paperName}`)
                  : `Paper ${course.paperId || 'N/A'}`}
              </div>

              <div className="text-xs text-gray-500">
                Faculty: {course.facultyName || 'N/A'} | Institute: {course.instituteName || 'N/A'}
              </div>
            </div>
          </div>
        </td>
        <td className="p-3 align-top text-sm text-gray-700">
          <div className="font-semibold">{course.category || 'N/A'} {course.subcategory || ''}</div>
          <div className="text-xs text-gray-500">{course.courseType || 'Course'}</div>
        </td>
        <td className="p-3 align-top text-sm">
          <div className="font-bold text-green-700">Rs. {price.toLocaleString('en-IN')}</div>
          {cost > price && <div className="text-xs text-gray-400 line-through">Rs. {cost.toLocaleString('en-IN')}</div>}
        </td>
        <td className="p-3 align-top">
          <div className="flex flex-wrap gap-1.5 justify-end items-center">
            <div className="flex border rounded border-gray-300 overflow-hidden mr-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMoveCourse(list, index, 'up')}
                className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed border-r border-gray-300"
                title="Move Up in Sequence"
              >
                ⬆️
              </button>
              <button
                type="button"
                disabled={index === list.length - 1}
                onClick={() => handleMoveCourse(list, index, 'down')}
                className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move Down in Sequence"
              >
                ⬇️
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleEdit(course)}
              className="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200 cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleClone(course)}
              className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-200 cursor-pointer"
              title="Clone this course into Add Course form"
            >
              📋 Clone
            </button>
            <button
              type="button"
              onClick={() => handleDelete(course)}
              className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderLevel = (category, level, accentClass) => {
    const list = groupedCourses[category][level];

    return (
      <section className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className={`flex items-center justify-between px-4 py-3 ${accentClass}`}>
          <h5 className="font-bold text-gray-900">{category} {level}</h5>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-gray-700">
            {list.length} courses
          </span>
        </div>
        {list.length === 0 ? (
          <div className="p-4 text-sm italic text-gray-500">No {category} {level} courses found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3 text-center">Seq</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-right">Actions / Sequence</th>
                </tr>
              </thead>
              <tbody>{list.map((c, i) => renderCourseRow(c, i, list))}</tbody>
            </table>
          </div>
        )}
      </section>
    );
  };


  return (
    <div className="w-full space-y-5">
      <div className="rounded-xl border border-purple-100 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-purple-700">All Admin Courses</h3>
            <p className="text-sm text-gray-500">List view of courses saved in the course database.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button
              type="button"
              onClick={loadCourses}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <DeleteAllCoursesButton onDeleteSuccess={loadCourses} />

      {loading && <div className="rounded-lg bg-blue-50 p-4 text-blue-700">Loading courses...</div>}
      {error && <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {renderLevel('CA', 'Foundation', 'bg-blue-50')}
            {renderLevel('CA', 'Inter', 'bg-blue-50')}
            {renderLevel('CA', 'Final', 'bg-blue-50')}
          </div>
          <div className="grid gap-4">
            {renderLevel('CMA', 'Foundation', 'bg-green-50')}
            {renderLevel('CMA', 'Inter', 'bg-green-50')}
            {renderLevel('CMA', 'Final', 'bg-green-50')}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesByPaperSection;
