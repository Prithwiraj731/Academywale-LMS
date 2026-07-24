import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import FacultyImage from '../components/ui/FacultyImage';
import CoursesByPaperSection from '../components/admin/CoursesByPaperSection';
import { getAllFaculties } from '../data/hardcodedFaculties';
import { useAuth } from '../context/AuthContext';

const MODES = ['Live Watching', 'Recorded Videos'];
const DURATIONS = ['August 2025', 'February 2026', 'August 2026', 'February 2027', 'August 2027'];
const TEACHES_OPTIONS = ['CA', 'CMA'];

// Helper function to convert faculty name to slug
const getSlugFromFacultyName = (name) => {
  if (!name) return '';
  return name.trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]/g, '') // Remove non-word chars except hyphens
    .replace(/^(ca|cma|cs)-/, ''); // Remove leading CA/CMA/CS prefix if present
};
const COURSE_OPTIONS = [
  'CA Foundation', 'CMA Foundation',
  'CA Inter', 'CMA Inter',
  'CA Final', 'CMA Final'
];
import { API_URL, fetchWithCredentials } from '../api';

// Modal styles
const modalStyles = {
  overlay: { zIndex: 1000, background: 'rgba(0,0,0,0.3)' },
  content: { maxWidth: 500, margin: 'auto', borderRadius: 16, padding: 32 }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user, isLoading: authLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('isAdmin');
      navigate('/admin');
    }
  };

  // Check admin access - verify strictly with backend session role
  const isAdmin = user && user.role === 'admin';

  // If not admin, redirect but show loading state during redirect
  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        navigate('/admin');
      }
    }
  }, [isAdmin, authLoading, navigate]);

  // Show loading background during redirect
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 py-8 px-2 sm:px-4 flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20b2aa] mx-auto mb-4"></div>
          <p className="text-neutral-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // UI state for which panel is active
  const [activePanel, setActivePanel] = useState('course'); // 'course' or 'faculty' or 'institute'

  // Faculty Add Panel State
  const [facultyAdd, setFacultyAdd] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    teaches: [],
    image: null,
    imagePreview: null,
  });
  const [facultyAddStatus, setFacultyAddStatus] = useState('');
  const [facultyAddError, setFacultyAddError] = useState('');

  // Delete All Faculty State
  const [deleteAllStatus, setDeleteAllStatus] = useState('');
  const [deleteAllError, setDeleteAllError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Faculty Bio Panel State (for updating existing faculty)
  const [facultyInfo, setFacultyInfo] = useState({
    firstName: '',
    bio: '',
    teaches: [],
    lastName: '',
  });
  const [facultyInfoStatus, setFacultyInfoStatus] = useState('');
  const [facultyInfoError, setFacultyInfoError] = useState('');

  // Hardcoded Faculty Management State
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyUpdateData, setFacultyUpdateData] = useState({
    bio: '',
    teaches: []
  });
  const [facultyUpdateStatus, setFacultyUpdateStatus] = useState('');
  const [facultyUpdateError, setFacultyUpdateError] = useState('');
  const [hardcodedFaculties, setHardcodedFaculties] = useState([]);

  // Load hardcoded faculties on component mount
  useEffect(() => {
    const faculties = getAllFaculties();
    console.log('📚 Loading hardcoded faculties:', faculties);
    setHardcodedFaculties(faculties);
  }, []);

  // Fetch faculty info when firstName changes (for update panel)
  useEffect(() => {
    if (facultyInfo.firstName.trim()) {
      fetch(`/api/faculty-info/${facultyInfo.firstName.trim().toUpperCase()}`)
        .then(res => res.json())
        .then(data => {
          if (data.bio !== undefined) {
            setFacultyInfo(f => ({ ...f, bio: data.bio || '', teaches: data.teaches || [], lastName: data.lastName || '' }));
          } else {
            setFacultyInfo(f => ({ ...f, bio: '', teaches: [], lastName: '' }));
          }
        });
    }
  }, [facultyInfo.firstName]);

  const handleFacultyInfoChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'teaches') {
      setFacultyInfo(f => {
        let teaches = f.teaches || [];
        if (checked) {
          teaches = [...teaches, value];
        } else {
          teaches = teaches.filter(t => t !== value);
        }
        return { ...f, teaches };
      });
    } else {
      setFacultyInfo(f => ({ ...f, [name]: value }));
    }
  };

  const handleFacultyInfoSubmit = async e => {
    e.preventDefault();
    setFacultyInfoStatus('');
    setFacultyInfoError('');
    if (!facultyInfo.firstName.trim()) {
      setFacultyInfoError('Faculty first name is required.');
      return;
    }
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/faculty-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: facultyInfo.firstName.trim().toUpperCase(),
          bio: facultyInfo.bio,
          teaches: facultyInfo.teaches,
        })
      });
      const data = await res.json();
      if (data.success) {
        setFacultyInfoStatus('Faculty info updated!');
        setTimeout(() => setFacultyInfoStatus(''), 2000);
      } else {
        setFacultyInfoError(data.error || 'Failed to update faculty info');
      }
    } catch (err) {
      setFacultyInfoError('Server error');
    }
  };

  // Faculty Add Handlers
  const handleFacultyAddChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'teaches') {
      setFacultyAdd(f => {
        let teaches = f.teaches || [];
        if (checked) {
          teaches = [...teaches, value];
        } else {
          teaches = teaches.filter(t => t !== value);
        }
        return { ...f, teaches };
      });
    } else if (name === 'image') {
      const file = files[0];
      setFacultyAdd(f => ({ ...f, image: file, imagePreview: file ? URL.createObjectURL(file) : null }));
    } else {
      setFacultyAdd(f => ({ ...f, [name]: value }));
    }
  };

  const handleFacultyAddSubmit = async e => {
    e.preventDefault();
    console.log('🚀 Faculty submission started');
    console.log('Faculty data:', facultyAdd);

    setFacultyAddStatus('');
    setFacultyAddError('');

    if (!facultyAdd.firstName.trim()) {
      setFacultyAddError('Faculty name is required.');
      console.log('❌ Faculty name is missing');
      return;
    }
    if (!facultyAdd.bio.trim()) {
      setFacultyAddError('Faculty bio is required.');
      console.log('❌ Faculty bio is missing');
      return;
    }
    if (!facultyAdd.teaches || facultyAdd.teaches.length === 0) {
      setFacultyAddError('Faculty must teach at least one course.');
      console.log('❌ Faculty teaches array is empty');
      return;
    }
    if (!facultyAdd.image) {
      setFacultyAddError('Faculty image is required.');
      console.log('❌ Faculty image is missing');
      return;
    }

    console.log('✅ All validation passed, creating FormData');
    const formData = new FormData();
    // Send full name as firstName, leave lastName blank
    formData.append('firstName', facultyAdd.firstName.trim());
    formData.append('lastName', '');
    formData.append('bio', facultyAdd.bio.trim());

    // Send teaches as JSON string to avoid array handling issues
    formData.append('teaches', JSON.stringify(facultyAdd.teaches));

    formData.append('image', facultyAdd.image);

    console.log('📤 Sending request to:', `${API_URL}/api/admin/faculty`);

    try {
      setFacultyAddStatus('Adding faculty...');
      const res = await fetchWithCredentials(`${API_URL}/api/admin/faculty`, {
        method: 'POST',
        body: formData
      });

      console.log('📥 Response status:', res.status);
      const data = await res.json();
      console.log('📥 Response data:', data);

      if (res.ok) {
        setFacultyAddStatus('Faculty added!');
        setFacultyAdd({ firstName: '', lastName: '', bio: '', teaches: [], image: null, imagePreview: null });
        setTimeout(() => setFacultyAddStatus(''), 2000);
        console.log('✅ Faculty added successfully');
      } else {
        setFacultyAddError(data.error || data.message || 'Failed to add faculty');
        console.log('❌ Faculty addition failed:', data);
      }
    } catch (err) {
      setFacultyAddError('Server error');
      console.error('❌ Network/Server error:', err);
    }
  };

  // Delete All Faculty Handler
  const handleDeleteAllFaculty = async () => {
    setDeleteAllStatus('');
    setDeleteAllError('');

    try {
      setDeleteAllStatus('Deleting all faculty...');
      console.log('🗑️ Starting delete all faculty operation');

      const res = await fetchWithCredentials(`${API_URL}/emergency-delete-faculty`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📥 Delete all response status:', res.status);
      const data = await res.json();
      console.log('📥 Delete all response data:', data);

      if (res.ok) {
        setDeleteAllStatus(`Successfully deleted ${data.deletedCount} faculty members!`);
        setShowDeleteConfirm(false);
        setTimeout(() => setDeleteAllStatus(''), 3000);
        console.log(`✅ Successfully deleted ${data.deletedCount} faculty members`);
      } else {
        setDeleteAllError(data.message || 'Failed to delete faculty');
        console.log('❌ Delete all failed:', data);
      }
    } catch (err) {
      setDeleteAllError('Server error occurred');
      console.error('❌ Delete all network/server error:', err);
    }
  };

  const [form, setForm] = useState({
    facultySlug: '',
    subject: '',
    noOfLecture: '',
    books: '',
    videoLanguage: '',
    validityStartFrom: '',
    videoRunOn: '',
    doubtSolving: '',
    supportMail: '',
    supportCall: '',
    poster: null,
    mode: MODES[0],
    timing: '',
    description: '',
    title: '',
    costPrice: '',
    sellingPrice: '',
    courseType: COURSE_OPTIONS[0],
    institute: '',
  });
  const [posterPreview, setPosterPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [facultyQueried, setFacultyQueried] = useState('');

  // Coupon management state
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '', courseIds: [], message: '', isVisible: true, isGlobal: true });
  const [coupons, setCoupons] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const toggleCourseInCouponForm = (courseId) => {
    setCouponForm(f => {
      const current = f.courseIds || [];
      const updated = current.includes(courseId)
        ? current.filter(id => id !== courseId)
        : [...current, courseId];
      return { ...f, courseIds: updated, isGlobal: updated.length === 0 };
    });
  };

  const handleCouponChange = e => {
    const { name, value, type, checked } = e.target;
    setCouponForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddCoupon = async e => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponForm.code.trim() || !couponForm.discountPercent) {
      setCouponError('Enter code and discount percent');
      return;
    }
    try {
      const payloadCourseIds = couponForm.isGlobal ? null : (couponForm.courseIds.length > 0 ? couponForm.courseIds : null);
      const res = await fetchWithCredentials(`${API_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponForm.code.trim().toUpperCase(),
          discountPercent: Number.parseFloat(couponForm.discountPercent),
          courseIds: payloadCourseIds,
          message: couponForm.message.trim() || undefined,
          isVisible: couponForm.isVisible
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCouponSuccess('Coupon added!');
        setCouponForm({ code: '', discountPercent: '', courseIds: [], message: '', isVisible: true, isGlobal: true });
        fetchCoupons();
        setTimeout(() => setCouponSuccess(''), 2000);
      } else {
        setCouponError(data.message || data.error || 'Failed to add coupon');
      }
    } catch (err) {
      setCouponError(err.message || 'Server error');
    }
  };


  // Add Institute State
  const [instituteAdd, setInstituteAdd] = useState({ name: '', image: null, imagePreview: null });
  const [instituteAddStatus, setInstituteAddStatus] = useState('');
  const [instituteAddError, setInstituteAddError] = useState('');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkCourses, setBulkCourses] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  const handleInstituteAddChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setInstituteAdd(f => ({ ...f, image: file, imagePreview: file ? URL.createObjectURL(file) : null }));
    } else {
      setInstituteAdd(f => ({ ...f, [name]: value }));
    }
  };

  const handleInstituteAddSubmit = async e => {
    e.preventDefault();
    setInstituteAddStatus('');
    setInstituteAddError('');
    if (!instituteAdd.name.trim()) {
      setInstituteAddError('Institute name is required.');
      return;
    }
    if (!instituteAdd.image) {
      setInstituteAddError('Institute image is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', instituteAdd.name.trim());
    formData.append('image', instituteAdd.image);
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/institutes`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setInstituteAddStatus('Institute added!');
        setInstituteAdd({ name: '', image: null, imagePreview: null });
        setTimeout(() => setInstituteAddStatus(''), 2000);
      } else {
        setInstituteAddError(data.error || 'Failed to add institute');
      }
    } catch (err) {
      setInstituteAddError('Server error');
    }
  };

  // Fetch coupons & available courses on mount
  useEffect(() => {
    fetchCoupons();
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courses/all`);
      const data = await res.json();
      if (res.ok && data.courses) setAvailableCourses(data.courses);
    } catch (err) {
      console.error('Failed to fetch available courses:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/coupons`);
      const data = await res.json();
      if (res.ok && data.success) setCoupons(data.coupons);
    } catch { }
  };




  const handleDeleteCoupon = async code => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await fetchWithCredentials(`${API_URL}/api/admin/coupons/${code}`, { method: 'DELETE' });
      fetchCoupons();
    } catch { }
  };

  const handleToggleCouponVisibility = async (code, currentVisibility) => {
    const nextVisibility = !currentVisibility;
    // Optimistic UI update
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, isVisible: nextVisibility } : c));
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/coupons/${encodeURIComponent(code)}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: nextVisibility })
      });
      if (res.ok) {
        await fetchCoupons();
      } else {
        fetchCoupons(); // Revert on failure
      }
    } catch (err) {
      console.error('Error toggling coupon visibility:', err);
      fetchCoupons(); // Revert on failure
    }
  };



  const requiredFields = [
    { name: 'subject', label: 'Subject' },
    { name: 'noOfLecture', label: 'No Of Lecture' },
    { name: 'poster', label: 'Poster' },
    { name: 'courseType', label: 'Course Type' },
    { name: 'institute', label: 'Institute' },
  ];

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setForm(f => ({ ...f, poster: files[0] }));
      setPosterPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Fetch courses for a faculty or institute
  const fetchCourses = async (facultyName, instituteName) => {
    let url = '';

    // A valid faculty is always required now
    if (facultyName && facultyName.trim() !== '') {
      // For faculty-based courses
      const slug = getSlugFromFacultyName(facultyName);
      url = `${API_URL}/api/courses/${slug}`;
      console.log('🎯 Fetching faculty courses from:', url);
    } else if (instituteName && instituteName.trim() !== '') {
      // For institute-based courses
      url = `${API_URL}/api/institutes/${encodeURIComponent(instituteName)}/courses`;
      console.log('🎯 Fetching institute courses from:', url);
    } else {
      // Fallback case (should not happen with the logic above)
      setCourses([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        console.log(`✅ Fetched ${data.courses?.length || 0} courses successfully`);
        setCourses(data.courses || []);
        setFacultyQueried(facultyName || '');
      } else {
        console.error('❌ Failed to fetch courses:', data.error);
        setCourses([]);
        setError(data.error || 'Could not fetch courses');
      }
    } catch (err) {
      console.error('❌ Server error fetching courses:', err);
      setError('Server error');
      setCourses([]);
    }
    setLoading(false);
  };

  // New Course Management State
  const defaultCustomDetails = [
    { label: 'Subject', value: '', fieldType: 'text', displayOrder: 1, visible: true },
    { label: 'Lectures', value: '', fieldType: 'text', displayOrder: 2, visible: true },
    { label: 'Duration', value: '', fieldType: 'text', displayOrder: 3, visible: true },
    { label: 'Study Materials', value: '', fieldType: 'text', displayOrder: 4, visible: true },
    { label: 'Language', value: 'Hindi', fieldType: 'text', displayOrder: 5, visible: true },
    { label: 'Video Run On', value: '', fieldType: 'text', displayOrder: 6, visible: true },
    { label: 'Doubt Solving', value: '', fieldType: 'text', displayOrder: 7, visible: true },
    { label: 'Support Mail', value: '', fieldType: 'text', displayOrder: 8, visible: true },
    { label: 'Support Call', value: '', fieldType: 'text', displayOrder: 9, visible: true },
    { label: 'Validity', value: '', fieldType: 'text', displayOrder: 10, visible: true },
    { label: 'Faculty', value: '', fieldType: 'faculty', displayOrder: 11, visible: true },
    { label: 'Institute', value: '', fieldType: 'institute', displayOrder: 12, visible: true }
  ];

  const defaultCreateOptions = [
    { name: 'Mode', values: ['Google Drive', 'Pen Drive'] },
    { name: 'Validity', values: ['12 Months', '6 Months'] },
    { name: 'Mode of Books', values: ['Hard Copy', 'Soft Copy'] }
  ];

  const cartesian = (arrays) => {
    return arrays.reduce((acc, curr) => {
      return acc.flatMap(d => curr.map(e => [...d, e]));
    }, [[]]);
  };

  const generateVariants = (currentOptions, existingPricing = []) => {
    if (!currentOptions || currentOptions.length === 0) return [];
    
    const names = currentOptions.map(o => o.name);
    const valueArrays = currentOptions.map(o => o.values.filter(Boolean));
    
    if (valueArrays.some(arr => arr.length === 0)) {
      return [];
    }

    const combinations = cartesian(valueArrays);
    const grouped = {};
    
    combinations.forEach(combo => {
      const modeValue = combo[0];
      const otherValues = combo.slice(1);
      const attemptValue = otherValues.join(' / ') || 'Standard Package';
      
      if (!grouped[modeValue]) {
        grouped[modeValue] = {
          mode: modeValue,
          modeLabel: names[0] || 'Mode',
          attempts: []
        };
      }

      let foundAttempt = null;
      for (const m of existingPricing) {
        if (m.mode === modeValue) {
          const matchingAttempt = m.attempts?.find(a => a.attempt === attemptValue);
          if (matchingAttempt) {
            foundAttempt = matchingAttempt;
            break;
          }
        }
      }

      grouped[modeValue].attempts.push({
        attempt: attemptValue,
        attemptLabel: names.slice(1).join(' / ') || 'Option',
        validity: otherValues[0] || '',
        validityLabel: names[1] || 'Validity',
        costPrice: foundAttempt ? foundAttempt.costPrice : 0,
        sellingPrice: foundAttempt ? foundAttempt.sellingPrice : 0,
        description: foundAttempt ? foundAttempt.description : ''
      });
    });

    return Object.values(grouped);
  };

  const reconstructOptionsFromPricing = (pricing) => {
    if (!Array.isArray(pricing) || pricing.length === 0) {
      return [
        { name: 'Mode', values: ['Google Drive', 'Pen Drive'] },
        { name: 'Validity', values: ['12 Months', '6 Months'] },
        { name: 'Mode of Books', values: ['Hard Copy', 'Soft Copy'] }
      ];
    }

    const options = [];

    // 1. Reconstruct Option 1 (Mode)
    const modeName = pricing[0].modeLabel || 'Mode';
    const modeValues = Array.from(new Set(pricing.map(p => p.mode).filter(Boolean)));
    options.push({ name: modeName, values: modeValues });

    // 2. Reconstruct other options from attempts
    const firstMode = pricing[0];
    const firstAttempt = firstMode?.attempts?.[0];
    
    if (firstAttempt) {
      const attemptLabel = firstAttempt.attemptLabel || 'Option';
      const otherNames = attemptLabel.split(' / ');
      
      const otherValuesLists = otherNames.map(() => new Set());

      pricing.forEach(m => {
        (m.attempts || []).forEach(a => {
          const parts = a.attempt ? a.attempt.split(' / ') : [];
          parts.forEach((p, idx) => {
            if (otherValuesLists[idx]) {
              otherValuesLists[idx].add(p.trim());
            }
          });
        });
      });

      otherNames.forEach((name, idx) => {
        options.push({
          name: name.trim(),
          values: Array.from(otherValuesLists[idx] || [])
        });
      });
    }

    if (options.length === 0) {
      options.push({ name: 'Mode', values: ['Recorded'] });
    }

    return options;
  };

  const [createOptions, setCreateOptions] = useState(defaultCreateOptions);
  const [editOptions, setEditOptions] = useState([]);

  const [courseForm, setCourseForm] = useState({
    title: '', // Course title (required)
    category: '', // CA or CMA (required)
    subcategory: '', // Foundation, Inter, Final (required)
    paperId: '', // Paper 1, Paper 2, etc. (required)
    paperName: '', // Auto-filled from paperId (required)
    description: '',
    poster: null,
    customDetails: defaultCustomDetails,
    modeAttemptPricing: generateVariants(defaultCreateOptions)
  });

  const handleOptionsChange = (newOptions, isEdit = false) => {
    if (isEdit) {
      setEditOptions(newOptions);
      setEditCourseData(prev => {
        const generated = generateVariants(newOptions, prev.modeAttemptPricing || []);
        return {
          ...prev,
          modeAttemptPricing: generated
        };
      });
    } else {
      setCreateOptions(newOptions);
      setCourseForm(prev => {
        const generated = generateVariants(newOptions, prev.modeAttemptPricing || []);
        return {
          ...prev,
          modeAttemptPricing: generated
        };
      });
    }
  };

  const [posterPreviewNew, setPosterPreviewNew] = useState(null);

  // Categories and subcategories
  const categories = [
    { value: 'CA', label: 'CA' },
    { value: 'CMA', label: 'CMA' }
  ];

  const subcategories = [
    { value: 'Foundation', label: 'Foundation' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Final', label: 'Final' }
  ];

  // Papers based on category and subcategory - Using correct official CA/CMA structure
  const getPapers = (category, subcategory) => {
    console.log('🔍 getPapers called with:', { category, subcategory });

    if (category === 'CA') {
      if (subcategory === 'Foundation') {
        return [
          { id: 1, name: 'Paper 1: Principles and Practice of Accounting' },
          { id: 2, name: 'Paper 2: Business Laws and Business Correspondence and Reporting' },
          { id: 3, name: 'Paper 3: Business Mathematics, Logical Reasoning & Statistics' },
          { id: 4, name: 'Paper 4: Business Economics & Business and Commercial Knowledge' }
        ];
      } else if (subcategory === 'Inter') {
        return [
          // INTERMEDIATE GROUP 1
          { id: 5, name: 'Paper 5: Advanced Accounting', group: 'Group 1' },
          { id: 6, name: 'Paper 6: Corporate and Other Laws', group: 'Group 1' },
          { id: 7, name: 'Paper 7: Taxation', group: 'Group 1' },
          // INTERMEDIATE GROUP 2
          { id: 8, name: 'Paper 8: Cost and Management Accounting', group: 'Group 2' },
          { id: 9, name: 'Paper 9: Auditing and ethics', group: 'Group 2' },
          { id: 10, name: 'Paper 10: Financial Management and Strategic Management', group: 'Group 2' }
        ];
      } else if (subcategory === 'Final') {
        return [
          // FINAL GROUP 1
          { id: 11, name: 'Paper 11: Financial Reporting', group: 'Group 1' },
          { id: 12, name: 'Paper 12: Advanced Financial Management', group: 'Group 1' },
          { id: 13, name: 'Paper 13: Advanced Auditing and Professional Ethics', group: 'Group 1' },
          { id: 14, name: 'Paper 14: Direct Tax Laws and International Taxation', group: 'Group 1' },
          // FINAL GROUP 2
          { id: 15, name: 'Paper 15: Indirect Tax Laws', group: 'Group 2' },
          { id: 16, name: 'Paper 16: Corporate and Economic Laws', group: 'Group 2' },
          { id: 17, name: 'Paper 17: Strategic Cost and Performance Management', group: 'Group 2' }
        ];
      }

    } else if (category === 'CMA') {
      if (subcategory === 'Foundation') {
        return [
          { id: 1, name: 'Paper 1: Fundamentals of Business Laws' },
          { id: 2, name: 'Paper 2: Fundamentals of Financial and Cost Accounting' },
          { id: 3, name: 'Paper 3: Fundamentals of Business Mathematics and Statistics' },
          { id: 4, name: 'Paper 4: Fundamentals of Business Economics and Management' }
        ];
      } else if (subcategory === 'Inter') {
        return [
          // INTERMEDIATE GROUP 1
          { id: 5, name: 'Paper 5: Business Laws and Ethics', group: 'Group 1' },
          { id: 6, name: 'Paper 6: Financial Accounting', group: 'Group 1' },
          { id: 7, name: 'Paper 7: Direct and Indirect Taxation', group: 'Group 1' },
          { id: 8, name: 'Paper 8: Cost Accounting', group: 'Group 1' },
          // INTERMEDIATE GROUP 2
          { id: 9, name: 'Paper 9: Operations Management and Strategic Management', group: 'Group 2' },
          { id: 10, name: 'Paper 10: Corporate Accounting and Auditing', group: 'Group 2' },
          { id: 11, name: 'Paper 11: Financial Management and Business Data Analytics', group: 'Group 2' },
          { id: 12, name: 'Paper 12: Management Accounting', group: 'Group 2' }
        ];
      } else if (subcategory === 'Final') {
        return [
          // FINAL GROUP 3
          { id: 13, name: 'Paper 13: Corporate and Economic Laws', group: 'Group 3' },
          { id: 14, name: 'Paper 14: Strategic Financial Management', group: 'Group 3' },
          { id: 15, name: 'Paper 15: Direct Tax Laws and International Taxation', group: 'Group 3' },
          { id: 16, name: 'Paper 16: Strategic Cost Management', group: 'Group 3' },
          // FINAL GROUP 4
          { id: 17, name: 'Paper 17: Cost and Management Audit', group: 'Group 4' },
          { id: 18, name: 'Paper 18: Corporate Financial Reporting', group: 'Group 4' },
          { id: 19, name: 'Paper 19: Indirect Tax Laws and Practice', group: 'Group 4' },
          { id: 20, name: 'Paper 20: Strategic Performance Management and Business Valuation', group: 'Group 4' }
        ];
      }
    }


    const result = [];
    console.log('📋 Returning papers:', result);
    return result;
  };

  // New Course Form Handlers
  const handleCourseFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      const file = files[0];
      setCourseForm(prev => ({ ...prev, poster: file }));
      setPosterPreviewNew(file ? URL.createObjectURL(file) : null);
    } else {
      setCourseForm(prev => ({ ...prev, [name]: value }));

      // Reset dependent fields when category changes
      if (name === 'category') {
        setCourseForm(prev => ({
          ...prev,
          subcategory: '',
          paperId: '',
          paperName: ''
        }));
      }

      // Reset paper fields when subcategory changes
      if (name === 'subcategory') {
        setCourseForm(prev => ({
          ...prev,
          paperId: '',
          paperName: ''
        }));
      }

      // Auto-fill paper name and real paper ID when paper is selected
      if (name === 'paperId') {
        const papers = getPapers(courseForm.category, courseForm.subcategory);
        const selectedPaper = papers.find(p => String(p.id) === String(value));
        if (selectedPaper) {
          const match = selectedPaper.name.match(/Paper\s*(\d+)/i);
          const realPaperId = match ? match[1] : value;
          setCourseForm(prev => ({ 
            ...prev, 
            paperId: realPaperId,
            paperName: selectedPaper.name 
          }));
        }
      }

    }
  };

  const addCustomDetail = (isEdit = false) => {
    const defaultNewDetail = { label: '', value: '', fieldType: 'text', displayOrder: 1, visible: true };
    if (isEdit) {
      setEditCourseData(prev => {
        const details = prev.customDetails || [];
        defaultNewDetail.displayOrder = details.length + 1;
        return {
          ...prev,
          customDetails: [...details, defaultNewDetail]
        };
      });
    } else {
      setCourseForm(prev => {
        const details = prev.customDetails || [];
        defaultNewDetail.displayOrder = details.length + 1;
        return {
          ...prev,
          customDetails: [...details, defaultNewDetail]
        };
      });
    }
  };

  const removeCustomDetail = (index, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => {
        const filtered = (prev.customDetails || []).filter((_, idx) => idx !== index);
        const reindexed = filtered.map((d, idx) => ({ ...d, displayOrder: idx + 1 }));
        return { ...prev, customDetails: reindexed };
      });
    } else {
      setCourseForm(prev => {
        const filtered = (prev.customDetails || []).filter((_, idx) => idx !== index);
        const reindexed = filtered.map((d, idx) => ({ ...d, displayOrder: idx + 1 }));
        return { ...prev, customDetails: reindexed };
      });
    }
  };

  const updateCustomDetail = (index, field, value, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => {
        const updated = (prev.customDetails || []).map((d, idx) => 
          idx === index ? { ...d, [field]: value } : d
        );
        return { ...prev, customDetails: updated };
      });
    } else {
      setCourseForm(prev => {
        const updated = (prev.customDetails || []).map((d, idx) => 
          idx === index ? { ...d, [field]: value } : d
        );
        return { ...prev, customDetails: updated };
      });
    }
  };

  const moveCustomDetail = (index, direction, isEdit = false) => {
    const moveInArray = (arr, from, to) => {
      const copy = [...arr];
      const item = copy.splice(from, 1)[0];
      copy.splice(to, 0, item);
      return copy.map((d, idx) => ({ ...d, displayOrder: idx + 1 }));
    };

    if (isEdit) {
      setEditCourseData(prev => {
        const details = prev.customDetails || [];
        const toIndex = direction === 'up' ? index - 1 : index + 1;
        if (toIndex < 0 || toIndex >= details.length) return prev;
        return {
          ...prev,
          customDetails: moveInArray(details, index, toIndex)
        };
      });
    } else {
      setCourseForm(prev => {
        const details = prev.customDetails || [];
        const toIndex = direction === 'up' ? index - 1 : index + 1;
        if (toIndex < 0 || toIndex >= details.length) return prev;
        return {
          ...prev,
          customDetails: moveInArray(details, index, toIndex)
        };
      });
    }
  };

  const addModeAttemptPricing = (isEdit = false) => {
    const newMode = {
      mode: '',
      modeLabel: 'Mode',
      attempts: [
        { attempt: '', attemptLabel: 'Exam Term / Attempt', validity: '', validityLabel: 'Validity', costPrice: 0, sellingPrice: 0, description: '' }
      ]
    };
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: [...(prev.modeAttemptPricing || []), newMode]
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: [...prev.modeAttemptPricing, newMode]
      }));
    }
  };

  const removeModeAttemptPricing = (modeIndex, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: (prev.modeAttemptPricing || []).filter((_, index) => index !== modeIndex)
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: prev.modeAttemptPricing.filter((_, index) => index !== modeIndex)
      }));
    }
  };

  const updateModeAttemptPricing = (modeIndex, field, value, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: (prev.modeAttemptPricing || []).map((item, index) =>
          index === modeIndex ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: prev.modeAttemptPricing.map((item, index) =>
          index === modeIndex ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const removeAttemptFromMode = (modeIndex, attemptIndex, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => {
        const updated = [...(prev.modeAttemptPricing || [])];
        if (updated[modeIndex] && updated[modeIndex].attempts) {
          updated[modeIndex] = {
            ...updated[modeIndex],
            attempts: updated[modeIndex].attempts.filter((_, idx) => idx !== attemptIndex)
          };
        }
        return { ...prev, modeAttemptPricing: updated };
      });
    } else {
      setCourseForm(prev => {
        const updated = [...prev.modeAttemptPricing];
        if (updated[modeIndex] && updated[modeIndex].attempts) {
          updated[modeIndex] = {
            ...updated[modeIndex],
            attempts: updated[modeIndex].attempts.filter((_, idx) => idx !== attemptIndex)
          };
        }
        return { ...prev, modeAttemptPricing: updated };
      });
    }
  };

  const addAttemptToPricing = (modeIndex, isEdit = false) => {
    const newAttempt = { attempt: '', attemptLabel: 'Exam Term / Attempt', validity: '', validityLabel: 'Validity', costPrice: 0, sellingPrice: 0, description: '' };
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: (prev.modeAttemptPricing || []).map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: [...item.attempts, newAttempt]
            }
            : item
        )
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: prev.modeAttemptPricing.map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: [...item.attempts, newAttempt]
            }
            : item
        )
      }));
    }
  };

  const removeAttemptFromPricing = (modeIndex, attemptIndex, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: (prev.modeAttemptPricing || []).map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: item.attempts.filter((_, aIndex) => aIndex !== attemptIndex)
            }
            : item
        )
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: prev.modeAttemptPricing.map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: item.attempts.filter((_, aIndex) => aIndex !== attemptIndex)
            }
            : item
        )
      }));
    }
  };

  const updateAttemptPricing = (modeIndex, attemptIndex, field, value, isEdit = false) => {
    if (isEdit) {
      setEditCourseData(prev => ({
        ...prev,
        modeAttemptPricing: (prev.modeAttemptPricing || []).map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: item.attempts.map((attempt, aIndex) =>
                aIndex === attemptIndex ? { ...attempt, [field]: value } : attempt
              )
            }
            : item
        )
      }));
    } else {
      setCourseForm(prev => ({
        ...prev,
        modeAttemptPricing: prev.modeAttemptPricing.map((item, index) =>
          index === modeIndex
            ? {
              ...item,
              attempts: item.attempts.map((attempt, aIndex) =>
                aIndex === attemptIndex ? { ...attempt, [field]: value } : attempt
              )
            }
            : item
        )
      }));
    }
  };

  const handleNewCourseSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Unified validation - category, subcategory, paperId, title, and poster/posterUrl are required
    if (!courseForm.category || !courseForm.subcategory || !courseForm.paperId ||
      !courseForm.title || (!courseForm.poster && !courseForm.posterUrl)) {
      setError('Please fill all required fields: Category, Subcategory, Paper, Title, and Poster are required');
      return;
    }

    if (courseForm.modeAttemptPricing.length === 0) {
      setError('Please add at least one mode with pricing');
      return;
    }

    // Validate each mode has attempts with pricing
    for (const modeData of courseForm.modeAttemptPricing) {
      if (!modeData.mode || modeData.attempts.length === 0) {
        setError('Each mode must have a name and at least one attempt with pricing');
        return;
      }
      for (const attempt of modeData.attempts) {
        if (!attempt.attempt || !attempt.costPrice || !attempt.sellingPrice) {
          setError('All attempts must have complete pricing information');
          return;
        }
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();

      const getDetailVal = (label) => {
        const found = (courseForm.customDetails || []).find(d => d.label.toLowerCase() === label.toLowerCase());
        return found ? found.value : '';
      };

      const resolvedSubject = courseForm.title;
      const resolvedFacultySlug = courseForm.facultySlug || 'n-a';
      const resolvedInstitute = courseForm.instituteName || '';

      const apiEndpoint = `${API_URL}/api/admin/courses`;

      console.log('🔗 API Endpoint:', apiEndpoint);
      console.log('📋 Course Form Data:', courseForm);
      console.log('🌐 API_URL value:', API_URL);

      formData.append('category', courseForm.category);
      formData.append('subcategory', courseForm.subcategory);
      formData.append('paperId', courseForm.paperId);
      formData.append('paperName', courseForm.paperName);
      formData.append('title', courseForm.title);
      formData.append('subject', resolvedSubject);

      // Faculty and institute sync
      formData.append('facultySlug', resolvedFacultySlug);
      formData.append('facultyName', resolvedFacultySlug); // For backward compatibility
      formData.append('institute', resolvedInstitute);

      // Common fields mapped for legacy support
      formData.append('description', courseForm.description || '');
      formData.append('noOfLecture', getDetailVal('lectures'));
      formData.append('books', getDetailVal('study materials'));
      formData.append('videoLanguage', getDetailVal('language'));
      formData.append('videoRunOn', getDetailVal('video run on'));
      formData.append('doubtSolving', getDetailVal('doubt solving'));
      formData.append('supportMail', getDetailVal('support mail'));
      formData.append('supportCall', getDetailVal('support call'));
      formData.append('timing', getDetailVal('duration'));
      formData.append('validityStartFrom', getDetailVal('validity'));

      // Poster upload or existing poster URL (for cloned courses)
      if (courseForm.poster) {
        formData.append('poster', courseForm.poster);
      }
      if (courseForm.posterUrl) {
        formData.append('posterUrl', courseForm.posterUrl);
      }

      formData.append('courseType', `${courseForm.category} ${courseForm.subcategory}`);

      // Build final customDetails including Faculty and Institute for full compatibility
      const finalCustomDetails = [
        ...(courseForm.customDetails || []).filter(d => d.fieldType !== 'faculty' && d.fieldType !== 'institute'),
        { label: 'Faculty', value: resolvedFacultySlug, fieldType: 'faculty', displayOrder: 99, visible: true },
        { label: 'Institute', value: resolvedInstitute, fieldType: 'institute', displayOrder: 100, visible: true }
      ];

      // Serialize dynamic custom details and pricing blocks
      formData.append('customDetails', JSON.stringify(finalCustomDetails));
      formData.append('modeAttemptPricing', JSON.stringify(courseForm.modeAttemptPricing));

      console.log('📤 Sending FormData with fields:');
      for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
      }

      const res = await fetchWithCredentials(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response received:', res.status, res.statusText);

      const responseText = await res.text();
      console.log('📋 Raw response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        if (responseText.includes('<!DOCTYPE html>') && responseText.includes('Internal Server Error')) {
          throw new Error('Backend server error - please check server logs.');
        } else {
          throw new Error(`Server response is not valid JSON: ${responseText.substring(0, 200)}...`);
        }
      }

      if (res.ok) {
        console.log('✅ Course creation successful:', data);
        setSuccess(`Course added successfully`);
        // Reset form
        setCourseForm({
          title: '',
          category: '',
          subcategory: '',
          paperId: '',
          paperName: '',
          description: '',
          poster: null,
          facultySlug: '',
          instituteName: '',
          customDetails: [],
          modeAttemptPricing: generateVariants(defaultCreateOptions)
        });
        setPosterPreviewNew(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('❌ Course creation failed:', data);
        setError(`Course creation failed: ${data.error || data.message || 'Unknown error'} (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error('❌ Network/Server error:', err);
      if (err.message.includes('fetch')) {
        setError('Network error: Cannot connect to backend. Please check if the server is running.');
      } else if (err.message.includes('Backend server error')) {
        setError('Server Error: The backend crashed while processing your request. Please check the server logs and try again.');
      } else if (err.message.includes('Server response is not valid JSON')) {
        setError('Server Error: The backend returned an invalid response. This usually means there\'s an error in the server code.');
      } else {
        setError('Error: ' + err.message);
      }
    }
    setLoading(false);
  };

  // Course Form: allow text input for modes and durations
  const [modesText, setModesText] = useState('Recorded,Live,Pendrive');
  const [durationsText, setDurationsText] = useState('AUG 25,JUL 26,SEP 25');

  // In handleSubmit, append modes and durations arrays
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate required fields
    for (const field of requiredFields) {
      if (!form[field.name] || (field.name === 'poster' && !form.poster)) {
        setError(`Please fill the required field: ${field.label}`);
        return;
      }
    }

    // Faculty is required - validate it
    if (!form.facultySlug || form.facultySlug.trim() === '' || form.facultySlug.trim().toLowerCase() === 'n-a') {
      setError('Please select a valid faculty. Faculty is required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Always use the faculty route - we no longer use standalone endpoints
      const apiEndpoint = `${API_URL}/api/admin/courses`;

      console.log('🔗 Using API endpoint:', apiEndpoint);

      // Faculty is required
      formData.append('facultySlug', form.facultySlug);
      formData.append('facultyName', form.facultySlug); // For backward compatibility

      formData.append('subject', form.subject);
      formData.append('noOfLecture', form.noOfLecture);
      formData.append('books', form.books);
      formData.append('videoLanguage', form.videoLanguage);
      formData.append('validityStartFrom', form.validityStartFrom);
      formData.append('videoRunOn', form.videoRunOn);
      formData.append('doubtSolving', form.doubtSolving);
      formData.append('supportMail', form.supportMail);
      formData.append('supportCall', form.supportCall);
      formData.append('poster', form.poster);
      formData.append('timing', form.timing);
      formData.append('description', form.description);
      formData.append('costPrice', form.costPrice);
      formData.append('sellingPrice', form.sellingPrice);
      formData.append('courseType', form.courseType);
      formData.append('institute', form.institute);

      // We no longer use standalone flag - all courses go through the faculty system
      // If not specified, we use the N/A faculty (already set above)

      // Add modes and durations as comma-separated strings
      formData.append('modes', modesText);
      formData.append('durations', durationsText);

      // Use the selected endpoint
      const res = await fetchWithCredentials(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Course added!');
        fetchCourses(form.facultySlug, form.institute);
        setForm({ facultySlug: '', subject: '', noOfLecture: '', books: '', videoLanguage: '', validityStartFrom: '', videoRunOn: '', doubtSolving: '', supportMail: '', supportCall: '', poster: null, mode: MODES[0], timing: '', description: '', title: '', costPrice: '', sellingPrice: '', courseType: COURSE_OPTIONS[0], institute: '' });
        setPosterPreview(null);
        setModesText('Recorded,Live,Pendrive');
        setDurationsText('AUG 25,JUL 26,SEP 25');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.error || 'Failed to add course');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  // When faculty name is entered/changed, fetch their courses
  const handleFacultyBlur = () => {
    if (form.facultySlug) {
      fetchCourses(form.facultySlug);
    }
  };

  // Animated Button Styles
  const buttonBase = 'flex-1 py-6 px-8 rounded-2xl shadow-xl text-2xl font-bold flex flex-col items-center justify-center cursor-pointer transition-all duration-300';
  const buttonActive = 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105 animate-pulse';
  const buttonInactive = 'bg-white text-blue-700 border-2 border-blue-200 hover:scale-105 hover:shadow-2xl';

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourseIdx, setEditCourseIdx] = useState(null);
  const [editCourseData, setEditCourseData] = useState({});
  const [editPoster, setEditPoster] = useState(null);
  const [editPosterPreview, setEditPosterPreview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [courseListRefreshKey, setCourseListRefreshKey] = useState(0);

  // Handle course cloning into Add Course form
  // Handle direct course cloning into database
  const handleCloneCourse = async (course) => {
    if (!course) return;

    const clonedTitle = `${course.title || course.subject || 'Course'} (Copy)`;
    if (!window.confirm(`Are you sure you want to clone "${course.title || course.subject}"?`)) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // 1. Prepare custom details and pricing
      let details = course.customDetails || course.custom_details || [];
      if (!Array.isArray(details) || details.length === 0) {
        details = [
          { label: 'Subject', value: course.subject || '', fieldType: 'text', displayOrder: 1, visible: true },
          { label: 'Lectures', value: course.noOfLecture || '', fieldType: 'text', displayOrder: 2, visible: true },
          { label: 'Duration', value: course.timing || '', fieldType: 'text', displayOrder: 3, visible: true },
          { label: 'Study Materials', value: course.books || '', fieldType: 'text', displayOrder: 4, visible: true },
          { label: 'Language', value: course.videoLanguage || 'Hindi', fieldType: 'text', displayOrder: 5, visible: true },
          { label: 'Video Run On', value: course.videoRunOn || '', fieldType: 'text', displayOrder: 6, visible: true },
          { label: 'Doubt Solving', value: course.doubtSolving || '', fieldType: 'text', displayOrder: 7, visible: true },
          { label: 'Support Mail', value: course.supportMail || '', fieldType: 'text', displayOrder: 8, visible: true },
          { label: 'Support Call', value: course.supportCall || '', fieldType: 'text', displayOrder: 9, visible: true },
          { label: 'Validity', value: course.validityStartFrom || '', fieldType: 'text', displayOrder: 10, visible: true }
        ];
      }

      let pricing = course.modeAttemptPricing || [];
      if (!Array.isArray(pricing) || pricing.length === 0) {
        pricing = [
          {
            mode: course.mode || 'Recorded Video',
            modeLabel: 'Mode',
            attempts: [
              {
                attempt: course.attempt || 'Dec 2026',
                attemptLabel: 'Exam Term / Attempt',
                validity: course.validityStartFrom || '12 Months',
                validityLabel: 'Validity',
                costPrice: course.costPrice || 0,
                sellingPrice: course.sellingPrice || 0,
                description: ''
              }
            ]
          }
        ];
      }

      const pUrl = course.posterUrl || course.poster_url || course.poster || '';
      const pPublicId = course.posterPublicId || course.poster_public_id || '';

      const formData = new FormData();
      formData.append('category', course.category || 'CA');
      formData.append('subcategory', course.subcategory || 'Inter');
      formData.append('paperId', String(course.paperId || '1'));
      formData.append('paperName', course.paperName || '');
      formData.append('title', clonedTitle);
      formData.append('subject', course.subject || clonedTitle);
      formData.append('facultySlug', course.facultySlug || 'n-a');
      formData.append('facultyName', course.facultySlug || 'n-a');
      formData.append('institute', course.instituteName || course.institute || '');
      formData.append('description', course.description || '');
      formData.append('noOfLecture', course.noOfLecture || '');
      formData.append('books', course.books || '');
      formData.append('videoLanguage', course.videoLanguage || 'Hindi');
      formData.append('videoRunOn', course.videoRunOn || '');
      formData.append('doubtSolving', course.doubtSolving || '');
      formData.append('supportMail', course.supportMail || '');
      formData.append('supportCall', course.supportCall || '');
      formData.append('timing', course.timing || '');
      formData.append('validityStartFrom', course.validityStartFrom || '');
      if (pUrl) formData.append('posterUrl', pUrl);
      if (pPublicId) formData.append('posterPublicId', pPublicId);
      formData.append('courseType', `${course.category || 'CA'} ${course.subcategory || 'Inter'}`);

      const finalCustomDetails = [
        ...(details || []).filter(d => d.fieldType !== 'faculty' && d.fieldType !== 'institute'),
        { label: 'Faculty', value: course.facultySlug || 'n-a', fieldType: 'faculty', displayOrder: 99, visible: true },
        { label: 'Institute', value: course.instituteName || course.institute || '', fieldType: 'institute', displayOrder: 100, visible: true }
      ];

      formData.append('customDetails', JSON.stringify(finalCustomDetails));
      formData.append('modeAttemptPricing', JSON.stringify(pricing));

      const apiEndpoint = `${API_URL}/api/admin/courses`;
      const res = await fetchWithCredentials(apiEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (res.ok && (result.success || result.course)) {
        setSuccess(`✅ Course cloned successfully! "${clonedTitle}" has been added to the database and website.`);
        setCourseListRefreshKey(prev => prev + 1);
        if (typeof fetchCourses === 'function' && facultyQueried) {
          fetchCourses(facultyQueried);
        }
      } else {
        setError(result.error || result.message || 'Failed to clone course.');
      }
    } catch (err) {
      console.error('Error cloning course:', err);
      setError('Error cloning course: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (facultySlug, idx, courseOverride = null) => {
    const course = courseOverride || courses[idx];
    if (!course) {
      alert('Course not found. Please refresh the course list and try again.');
      return;
    }

    const courseFacultySlug = course.facultySlug || facultySlug || 'n-a';
    const facultyExists = allFaculties.some(f => f.slug === courseFacultySlug);
    if (courseFacultySlug && courseFacultySlug !== 'n-a' && !facultyExists && !courseOverride) {
      alert('Faculty not found. This course cannot be edited.');
      return;
    }

    setForm(f => ({ ...f, facultySlug: courseFacultySlug }));
    setEditCourseIdx(course.id || course._id || idx);
    
    // Parse custom details or construct defaults if missing
    let details = course.customDetails || course.custom_details || [];
    if (!Array.isArray(details) || details.length === 0) {
      // Re-construct custom details from legacy flat fields on the course if they exist
      details = [
        { label: 'Subject', value: course.subject || '', fieldType: 'text', displayOrder: 1, visible: true },
        { label: 'Lectures', value: course.noOfLecture || '', fieldType: 'text', displayOrder: 2, visible: true },
        { label: 'Duration', value: course.timing || '', fieldType: 'text', displayOrder: 3, visible: true },
        { label: 'Study Materials', value: course.books || '', fieldType: 'text', displayOrder: 4, visible: true },
        { label: 'Language', value: course.videoLanguage || 'Hindi', fieldType: 'text', displayOrder: 5, visible: true },
        { label: 'Video Run On', value: course.videoRunOn || '', fieldType: 'text', displayOrder: 6, visible: true },
        { label: 'Doubt Solving', value: course.doubtSolving || '', fieldType: 'text', displayOrder: 7, visible: true },
        { label: 'Support Mail', value: course.supportMail || '', fieldType: 'text', displayOrder: 8, visible: true },
        { label: 'Support Call', value: course.supportCall || '', fieldType: 'text', displayOrder: 9, visible: true },
        { label: 'Validity', value: course.validityStartFrom || '', fieldType: 'text', displayOrder: 10, visible: true },
        { label: 'Faculty', value: course.facultySlug || '', fieldType: 'faculty', displayOrder: 11, visible: true },
        { label: 'Institute', value: course.instituteName || course.institute || '', fieldType: 'institute', displayOrder: 12, visible: true }
      ];
    }

    // Pricing normalization
    let pricing = course.modeAttemptPricing || [];
    if (!Array.isArray(pricing) || pricing.length === 0) {
      pricing = [
        {
          mode: course.mode || 'Recorded Video',
          modeLabel: 'Mode',
          attempts: [
            {
              attempt: course.attempt || 'Dec 2026',
              attemptLabel: 'Exam Term / Attempt',
              validity: course.validityStartFrom || '12 Months',
              validityLabel: 'Validity',
              costPrice: course.costPrice || 0,
              sellingPrice: course.sellingPrice || 0,
              description: ''
            }
          ]
        }
      ];
    } else {
      const hasAttempts = pricing.some(p => p.attempts && Array.isArray(p.attempts));
      if (!hasAttempts) {
        const modesMap = {};
        pricing.forEach(item => {
          const m = item.mode || 'Recorded Video';
          if (!modesMap[m]) {
            modesMap[m] = {
              mode: m,
              modeLabel: item.modeLabel || 'Mode',
              attempts: []
            };
          }
          modesMap[m].attempts.push({
            attempt: item.attempt || '',
            attemptLabel: item.attemptLabel || 'Exam Term / Attempt',
            validity: item.validity || '',
            validityLabel: item.validityLabel || 'Validity',
            costPrice: item.costPrice || item.cost_price || 0,
            sellingPrice: item.sellingPrice || item.selling_price || 0,
            description: item.description || ''
          });
        });
        pricing = Object.values(modesMap);
      }
    }

    setEditCourseData({ 
      ...course,
      customDetails: details,
      modeAttemptPricing: pricing
    });
    
    const reconstructedOptions = reconstructOptionsFromPricing(pricing);
    setEditOptions(reconstructedOptions);
    
    setEditPoster(null);
    setEditPosterPreview(null);
    setEditError('');
    setEditModalOpen(true);
  };

  // Handle edit form change
  const handleEditChange = e => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setEditPoster(files[0]);
      setEditPosterPreview(URL.createObjectURL(files[0]));
    } else {
      setEditCourseData(f => ({ ...f, [name]: value }));

      if (name === 'category') {
        setEditCourseData(prev => ({ ...prev, subcategory: '', paperId: '', paperName: '' }));
      }
      if (name === 'subcategory') {
        setEditCourseData(prev => ({ ...prev, paperId: '', paperName: '' }));
      }
      if (name === 'paperId') {
        const papers = getPapers(editCourseData.category || f.category, editCourseData.subcategory || f.subcategory);
        const selectedPaper = papers.find(p => String(p.id) === String(value));
        if (selectedPaper) {
          const match = selectedPaper.name.match(/Paper\s*(\d+)/i);
          const realPaperId = match ? match[1] : value;
          setEditCourseData(prev => ({ 
            ...prev, 
            paperId: realPaperId,
            paperName: selectedPaper.name 
          }));
        }
      }
    }
  };


  // Submit edit
  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const formData = new FormData();

      const getDetailVal = (label) => {
        const found = (editCourseData.customDetails || []).find(d => d.label.toLowerCase() === label.toLowerCase());
        return found ? found.value : '';
      };

      const resolvedSubject = (editCourseData.title || '').trim();
      const resolvedFacultySlug = (editCourseData.facultySlug || '').trim();
      const resolvedInstitute = (editCourseData.instituteName || '').trim();

      formData.append('title', resolvedSubject);
      formData.append('category', editCourseData.category || '');
      formData.append('subcategory', editCourseData.subcategory || '');
      formData.append('paperId', editCourseData.paperId || '');
      formData.append('paperName', editCourseData.paperName || '');
      formData.append('description', editCourseData.description || '');
      formData.append('courseType', editCourseData.courseType || `${editCourseData.category} ${editCourseData.subcategory}`);
      
      formData.append('subject', resolvedSubject);
      formData.append('facultySlug', resolvedFacultySlug);
      formData.append('facultyName', resolvedFacultySlug); // For backward compatibility
      formData.append('institute', resolvedInstitute);

      formData.append('noOfLecture', getDetailVal('lectures'));
      formData.append('books', getDetailVal('study materials'));
      formData.append('videoLanguage', getDetailVal('language'));
      formData.append('videoRunOn', getDetailVal('video run on'));
      formData.append('doubtSolving', getDetailVal('doubt solving'));
      formData.append('supportMail', getDetailVal('support mail'));
      formData.append('supportCall', getDetailVal('support call'));
      formData.append('timing', getDetailVal('duration'));
      formData.append('validityStartFrom', getDetailVal('validity'));

      if (editPoster) {
        formData.append('poster', editPoster);
      }

      // Build final customDetails including Faculty and Institute for full compatibility
      const finalCustomDetails = [
        ...(editCourseData.customDetails || []).filter(d => d.fieldType !== 'faculty' && d.fieldType !== 'institute'),
        { label: 'Faculty', value: resolvedFacultySlug, fieldType: 'faculty', displayOrder: 99, visible: true },
        { label: 'Institute', value: resolvedInstitute, fieldType: 'institute', displayOrder: 100, visible: true }
      ];

      formData.append('customDetails', JSON.stringify(finalCustomDetails));
      formData.append('modeAttemptPricing', JSON.stringify(editCourseData.modeAttemptPricing));

      const courseId = editCourseData.id || editCourseData._id || editCourseIdx;
      const editUrl = courseId
        ? `${API_URL}/api/admin/course/${encodeURIComponent(courseId)}`
        : `${API_URL}/api/admin/courses/${encodeURIComponent(form.facultySlug)}/${encodeURIComponent(editCourseIdx)}`;
      const res = await fetchWithCredentials(editUrl, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCourses(form.facultySlug);
        setCourseListRefreshKey(key => key + 1);
        setEditModalOpen(false);
      } else {
        setEditError(data.message || data.error || 'Failed to update course');
      }
    } catch (err) {
      console.error('❌ Error updating course:', err);
      setEditError('Server error');
    }
    setEditLoading(false);
  };
  // Delete course
  const handleDeleteCourse = async (facultySlug, idx, courseOverride = null) => {
    const courseId = courseOverride?.id || courseOverride?._id || idx;
    const isIdDelete = facultySlug === 'by-id' || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(courseId));
    const facultyExists = faculties.some(f => f.slug === facultySlug);
    if (!isIdDelete && !facultyExists) {
      alert('Faculty not found. This course cannot be deleted.');
      return;
    }
    if (!window.confirm('Delete this course?')) return;
    setLoading(true);
    try {
      const deleteUrl = isIdDelete
        ? `${API_URL}/api/admin/course/${encodeURIComponent(courseId)}`
        : `${API_URL}/api/admin/courses/${encodeURIComponent(facultySlug)}/${encodeURIComponent(courseId)}`;
      const res = await fetchWithCredentials(deleteUrl, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCourses(form.facultySlug || facultySlug);
        setCourseListRefreshKey(key => key + 1);
      } else {
        alert(data.message || data.error || 'Failed to delete course');
      }
    } catch (err) {
      alert(`Server error: ${err.message || 'Failed to delete course'}`);
    }
    setLoading(false);
  };

  // Faculty edit/delete modal state
  const [editFacultyModalOpen, setEditFacultyModalOpen] = useState(false);
  const [editFacultyData, setEditFacultyData] = useState({});
  const [editFacultySlug, setEditFacultySlug] = useState(null);
  const [editFacultyImage, setEditFacultyImage] = useState(null);
  const [editFacultyImagePreview, setEditFacultyImagePreview] = useState(null);
  const [editFacultyLoading, setEditFacultyLoading] = useState(false);
  const [editFacultyError, setEditFacultyError] = useState('');

  // Hardcoded Faculty Management Handlers
  const handleSelectFaculty = (faculty) => {
    console.log('👆 Selected faculty:', faculty);
    setSelectedFaculty(faculty);
    setFacultyUpdateData({
      bio: '',
      teaches: []
    });
    setFacultyUpdateStatus('');
    setFacultyUpdateError('');
  };

  const handleFacultyUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'teaches') {
      setFacultyUpdateData(prev => {
        let teaches = prev.teaches || [];
        if (checked) {
          teaches = [...teaches, value];
        } else {
          teaches = teaches.filter(t => t !== value);
        }
        return { ...prev, teaches };
      });
    } else {
      setFacultyUpdateData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFacultyUpdateSubmit = (e) => {
    e.preventDefault();
    setFacultyUpdateStatus('');
    setFacultyUpdateError('');

    if (!selectedFaculty) {
      setFacultyUpdateError('Please select a faculty member first.');
      return;
    }

    if (!facultyUpdateData.bio.trim()) {
      setFacultyUpdateError('Faculty bio is required.');
      return;
    }

    if (!facultyUpdateData.teaches || facultyUpdateData.teaches.length === 0) {
      setFacultyUpdateError('Faculty must teach at least one course.');
      return;
    }

    const success = true; // Since we removed the update mechanism, just show success

    if (success) {
      setFacultyUpdateStatus(`Faculty details updated successfully for ${selectedFaculty.name}!`);

      // Refresh the hardcoded faculties list
      const faculties = getAllFaculties();
      setHardcodedFaculties(faculties);

      // Trigger a custom event to notify other components
      console.log('🔔 Dispatching facultyUpdated event for faculty slug:', selectedFaculty.slug);
      window.dispatchEvent(new CustomEvent('facultyUpdated', {
        detail: { facultySlug: selectedFaculty.slug, updates: facultyUpdateData }
      }));

      setTimeout(() => setFacultyUpdateStatus(''), 3000);
    } else {
      setFacultyUpdateError('Failed to update faculty details.');
    }
  };

  // Institute edit/delete modal state
  const [editInstituteModalOpen, setEditInstituteModalOpen] = useState(false);
  const [editInstituteData, setEditInstituteData] = useState({});
  const [editInstituteId, setEditInstituteId] = useState(null);
  const [editInstituteImage, setEditInstituteImage] = useState(null);
  const [editInstituteImagePreview, setEditInstituteImagePreview] = useState(null);
  const [editInstituteLoading, setEditInstituteLoading] = useState(false);
  const [editInstituteError, setEditInstituteError] = useState('');

  // Open faculty edit modal
  const fetchLiveFacultiesList = async () => {
    try {
      const res = await fetch(`${API_URL}/api/faculties`);
      const data = await res.json();
      const dbFaculties = data.faculties || [];
      const hardcoded = getAllFaculties();
      const mergedMap = new Map();

      hardcoded.forEach(h => {
        mergedMap.set(h.slug, {
          id: h.id,
          slug: h.slug,
          firstName: h.name,
          lastName: '',
          bio: h.bio || '',
          teaches: h.specialization ? [h.specialization] : [],
          imageUrl: h.image,
          image: h.image
        });
      });

      dbFaculties.forEach(db => {
        const slug = db.slug || `${db.first_name || db.firstName}-${db.last_name || db.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const existing = mergedMap.get(slug) || {};
        
        mergedMap.set(slug, {
          ...existing,
          ...db,
          id: db.id || db._id || existing.id,
          slug,
          firstName: db.first_name || db.firstName || existing.firstName || '',
          lastName: db.last_name !== undefined ? db.last_name : (db.lastName || existing.lastName || ''),
          bio: db.bio !== undefined ? db.bio : (existing.bio || ''),
          teaches: Array.isArray(db.teaches) ? db.teaches : (db.teaches ? [db.teaches] : (existing.teaches || [])),
          imageUrl: db.image_url || db.imageUrl || existing.imageUrl || existing.image,
          image: db.image_url || db.imageUrl || existing.image
        });
      });

      setFaculties(Array.from(mergedMap.values()));
    } catch (err) {
      console.error('Error refreshing faculties list:', err);
    }
  };

  const openEditFacultyModal = (fac) => {
    const rawFirstName = fac.firstName || fac.first_name || fac.name || '';
    const cleanFirstName = rawFirstName.replace(/^(CA|CMA|CS)\s+/i, '').trim();

    setEditFacultyData({
      firstName: cleanFirstName || rawFirstName,
      lastName: fac.lastName !== undefined ? fac.lastName : (fac.last_name || ''),
      bio: fac.bio || '',
      teaches: Array.isArray(fac.teaches) ? fac.teaches : (typeof fac.teaches === 'string' ? [fac.teaches] : (fac.specialization ? [fac.specialization] : [])),
    });
    setEditFacultySlug(fac.slug || (fac.name ? fac.name.toLowerCase().replace(/\s+/g, '-') : ''));
    setEditFacultyImage(null);
    setEditFacultyImagePreview(fac.imageUrl || fac.image_url || fac.image || null);
    setEditFacultyError('');
    setEditFacultyModalOpen(true);
  };

  // Handle faculty edit change
  const handleEditFacultyChange = e => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image') {
      if (files && files[0]) {
        setEditFacultyImage(files[0]);
        setEditFacultyImagePreview(URL.createObjectURL(files[0]));
      }
    } else if (name === 'teaches') {
      setEditFacultyData(f => {
        let teaches = f.teaches || [];
        if (checked) {
          teaches = [...teaches, value];
        } else {
          teaches = teaches.filter(t => t !== value);
        }
        return { ...f, teaches };
      });
    } else {
      setEditFacultyData(f => ({ ...f, [name]: value }));
    }
  };

  // Submit faculty edit
  const handleEditFacultySubmit = async e => {
    e.preventDefault();
    setEditFacultyLoading(true);
    setEditFacultyError('');
    try {
      const formData = new FormData();
      formData.append('firstName', editFacultyData.firstName || '');
      formData.append('lastName', editFacultyData.lastName || '');
      formData.append('bio', editFacultyData.bio || '');

      if (Array.isArray(editFacultyData.teaches)) {
        editFacultyData.teaches.forEach(teach => {
          formData.append('teaches[]', teach);
        });
      }

      if (editFacultyImage) {
        formData.append('image', editFacultyImage);
      }

      const res = await fetchWithCredentials(`${API_URL}/api/admin/faculty/${editFacultySlug}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok && (data.success || res.status === 200)) {
        await fetchLiveFacultiesList();
        setEditFacultyModalOpen(false);
      } else {
        setEditFacultyError(data.message || data.error || 'Failed to update faculty');
      }
    } catch (err) {
      console.error('Error updating faculty:', err);
      setEditFacultyError('Server error');
    }
    setEditFacultyLoading(false);
  };

  // Delete faculty
  const handleDeleteFaculty = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    setLoading(true);
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/faculty/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && (data.success || res.status === 200)) {
        await fetchLiveFacultiesList();
      } else {
        alert(data.message || data.error || 'Failed to delete faculty');
      }
    } catch (err) {
      console.error('Error deleting faculty:', err);
      alert('Server error');
    }
    setLoading(false);
  };
  // Open institute edit modal
  const openEditInstituteModal = (inst) => {
    setEditInstituteData({ ...inst });
    setEditInstituteId(inst._id);
    setEditInstituteImage(null);
    setEditInstituteImagePreview(null);
    setEditInstituteError('');
    setEditInstituteModalOpen(true);
  };
  // Handle institute edit change
  const handleEditInstituteChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditInstituteImage(files[0]);
      setEditInstituteImagePreview(URL.createObjectURL(files[0]));
    } else {
      setEditInstituteData(f => ({ ...f, [name]: value }));
    }
  };
  // Submit institute edit
  const handleEditInstituteSubmit = async e => {
    e.preventDefault();
    setEditInstituteLoading(true);
    setEditInstituteError('');
    try {
      const formData = new FormData();
      Object.entries(editInstituteData).forEach(([k, v]) => {
        if (k !== 'image' && k !== '_id') formData.append(k, v);
      });
      if (editInstituteImage) formData.append('image', editInstituteImage);
      const res = await fetchWithCredentials(`${API_URL}/api/admin/institutes/${editInstituteId}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetch(`${API_URL}/api/institutes`).then(res => res.json()).then(data => setInstitutes(data.institutes || []));
        setEditInstituteModalOpen(false);
      } else {
        setEditInstituteError(data.error || 'Failed to update institute');
      }
    } catch {
      setEditInstituteError('Server error');
    }
    setEditInstituteLoading(false);
  };
  // Delete institute
  const handleDeleteInstitute = async (id) => {
    if (!window.confirm('Delete this institute?')) return;
    setLoading(true);
    try {
      const res = await fetchWithCredentials(`${API_URL}/api/admin/institutes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetch(`${API_URL}/api/institutes`).then(res => res.json()).then(data => setInstitutes(data.institutes || []));
      } else {
        alert(data.error || 'Failed to delete institute');
      }
    } catch {
      alert('Server error');
    }
    setLoading(false);
  };

  // Add state for institutes and all faculties
  const [institutes, setInstitutes] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [allFaculties, setAllFaculties] = useState([]); // Combined hardcoded + database faculties

  // Hardcoded institutes as fallback
  const hardcodedInstitutes = [
    { name: "Aaditya Jain Classes", _id: "hardcoded-1" },
    { name: "Arjun Chhabra Tutorial", _id: "hardcoded-2" },
    { name: "Avinash Lala Classes", _id: "hardcoded-3" },
    { name: "BB Virtuals", _id: "hardcoded-4" },
    { name: "Bishnu Kedia Classes", _id: "hardcoded-5" },
    { name: "CA Buddy", _id: "hardcoded-6" },
    { name: "CA Praveen Jindal", _id: "hardcoded-7" },
    { name: "COC Education", _id: "hardcoded-8" },
    { name: "Ekatvam", _id: "hardcoded-9" },
    { name: "Gopal Bhoot Classes", _id: "hardcoded-10" },
    { name: "Harshad Jaju Classes", _id: "hardcoded-11" },
    { name: "Navin Classes", _id: "hardcoded-12" },
    { name: "Nitin Guru Classes", _id: "hardcoded-13" },
    { name: "Ranjan Periwal Classes", _id: "hardcoded-14" },
    { name: "Shivangi Agarwal", _id: "hardcoded-15" },
    { name: "Siddharth Agarrwal Classes", _id: "hardcoded-16" },
    { name: "SJC Institute", _id: "hardcoded-17" },
    { name: "Yashwant Mangal Classes", _id: "hardcoded-18" }
  ];

  // Fetch institutes and faculties on mount
  useEffect(() => {
    // Initialize faculties from hardcoded data first to ensure the dropdown has values
    const hardcodedFaculties = getAllFaculties();
    console.log('🎓 Initializing with hardcoded faculties:', hardcodedFaculties.length);

    const initialFaculties = hardcodedFaculties.map(faculty => ({
      slug: faculty.slug,
      firstName: faculty.name.replace(/^(CA|CMA|CS)\s+/, ''), // Remove prefix
      lastName: '',
      isHardcoded: true,
      fullName: faculty.name
    }));

    // Set initial faculty values immediately
    setAllFaculties(initialFaculties);

    // Fetch institutes
    console.log('🏫 Fetching institutes from:', `${API_URL}/api/institutes`);
    fetch(`${API_URL}/api/institutes`)
      .then(res => {
        console.log('🏫 Institutes response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('🏫 Institutes data received:', data);
        const apiInstitutes = data.institutes || [];

        // If no institutes from API, use hardcoded ones
        if (apiInstitutes.length === 0) {
          console.log('🏫 No institutes from API, using hardcoded institutes');
          setInstitutes(hardcodedInstitutes);
        } else {
          setInstitutes(apiInstitutes);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching institutes:', err);
        console.log('🏫 Using hardcoded institutes due to error');
        setInstitutes(hardcodedInstitutes);
      });

    // Fetch live merged faculties list
    fetchLiveFacultiesList();
  }, []);

  // Bulk Upload Parsing and Handlers
  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    setBulkFile(file);
    setBulkCourses([]);
    setBulkError('');
    setBulkSuccess('');
    setUploadResults(null);
  };

  const handleParseCSV = () => {
    if (!bulkFile) {
      setBulkError('Please select a CSV file first.');
      return;
    }

    setBulkLoading(true);
    setBulkError('');
    setBulkSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        
        // Custom robust CSV parser
        const parseCSV = (csvText) => {
          const lines = [];
          let row = [""];
          let inQuotes = false;

          for (let i = 0; i < csvText.length; i++) {
            const c = csvText[i];
            const next = csvText[i+1];

            if (c === '"') {
              if (inQuotes && next === '"') {
                row[row.length - 1] += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (c === ',' && !inQuotes) {
              row.push('');
            } else if ((c === '\r' || c === '\n') && !inQuotes) {
              if (c === '\r' && next === '\n') {
                i++;
              }
              lines.push(row);
              row = [''];
            } else {
              row[row.length - 1] += c;
            }
          }
          if (row.length > 1 || row[0] !== '') {
            lines.push(row);
          }
          return lines;
        };

        const rows = parseCSV(text);
        if (rows.length < 2) {
          throw new Error('CSV must have a header row and at least one data row.');
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const parsedData = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || (row.length === 1 && row[0] === '')) continue; // Skip empty rows

          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index] ? row[index].trim() : '';
          });

          // Row validation
          const title = rowData.title || rowData.subject;
          const subject = rowData.subject;
          const category = rowData.category ? rowData.category.toUpperCase() : '';
          const facultyName = rowData.faculty_name;
          const sellingPrice = Number(rowData.selling_price);

          let errorMsg = '';
          if (!title) errorMsg = 'Missing title/subject';
          else if (!subject) errorMsg = 'Missing subject name';
          else if (category !== 'CA' && category !== 'CMA') errorMsg = 'Category must be CA or CMA';
          else if (!facultyName) errorMsg = 'Missing faculty name';
          else if (isNaN(sellingPrice) || sellingPrice < 0) errorMsg = 'Invalid selling price';

          parsedData.push({
            rowNum: i,
            data: rowData,
            isValid: !errorMsg,
            validationError: errorMsg
          });
        }

        if (parsedData.length === 0) {
          throw new Error('No data rows found in the CSV.');
        }

        setBulkCourses(parsedData);
        setBulkSuccess(`Successfully parsed ${parsedData.length} rows. Please review below.`);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setBulkError(err.message || 'Failed to parse CSV file.');
      } finally {
        setBulkLoading(false);
      }
    };

    reader.onerror = () => {
      setBulkError('Failed to read CSV file.');
      setBulkLoading(false);
    };

    reader.readAsText(bulkFile);
  };

  const handleBulkUploadSubmit = async () => {
    const validCourses = bulkCourses.filter(c => c.isValid).map(c => c.data);

    if (validCourses.length === 0) {
      setBulkError('No valid rows to upload. Please correct errors and try again.');
      return;
    }

    setBulkLoading(true);
    setBulkError('');
    setBulkSuccess('');
    setUploadResults(null);

    try {
      console.log(`📤 Sending bulk upload request with ${validCourses.length} courses`);
      const res = await fetchWithCredentials(`${API_URL}/api/admin/courses/bulk-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: validCourses })
      });

      const data = await res.json();
      console.log('📥 Bulk upload response:', data);

      if (res.ok && data.success) {
        setBulkSuccess(data.message || `Successfully uploaded courses!`);
        setUploadResults({
          successCount: data.successCount,
          failedCount: data.failedCount,
          errors: data.errors || []
        });
        setBulkCourses([]);
        setBulkFile(null);
      } else {
        setBulkError(data.message || 'Bulk upload failed');
        if (data.errors) {
          setUploadResults({
            successCount: data.successCount || 0,
            failedCount: data.failedCount || 0,
            errors: data.errors
          });
        }
      }
    } catch (err) {
      console.error('Bulk upload network/server error:', err);
      setBulkError('Server error occurred during upload.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Testimonial state
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialAdd, setTestimonialAdd] = useState({ name: '', role: 'teacher', text: '', image: null, imagePreview: null });
  const [testimonialStatus, setTestimonialStatus] = useState('');
  const [testimonialError, setTestimonialError] = useState('');
  const [editTestimonialModalOpen, setEditTestimonialModalOpen] = useState(false);
  const [editTestimonialData, setEditTestimonialData] = useState({});
  const [editTestimonialImagePreview, setEditTestimonialImagePreview] = useState(null);
  const [editTestimonialError, setEditTestimonialError] = useState('');
  const [editTestimonialLoading, setEditTestimonialLoading] = useState(false);
  const cld = new Cloudinary({ cloud: { cloudName: 'drlqhsjgm' } });

  // Fetch testimonials
  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []));
  }, []);

  const handleTestimonialAddChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setTestimonialAdd(f => ({ ...f, image: file, imagePreview: file ? URL.createObjectURL(file) : null }));
    } else {
      setTestimonialAdd(f => ({ ...f, [name]: value }));
    }
  };
  const handleTestimonialAddSubmit = async e => {
    e.preventDefault();
    setTestimonialStatus('');
    setTestimonialError('');
    if (!testimonialAdd.name.trim() || !testimonialAdd.text.trim()) {
      setTestimonialError('Name and text are required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', testimonialAdd.name.trim());
    formData.append('course', testimonialAdd.role); // Use role as course
    formData.append('message', testimonialAdd.text.trim()); // Use text as message
    if (testimonialAdd.image) formData.append('image', testimonialAdd.image);
    try {
      const res = await fetch(`${API_URL}/api/testimonials`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.testimonial) {
        setTestimonialStatus('Testimonial added!');
        setTestimonialAdd({ name: '', role: 'teacher', text: '', image: null, imagePreview: null });
        setTimeout(() => setTestimonialStatus(''), 2000);
        // Refresh testimonials list
        fetch(`${API_URL}/api/testimonials`).then(res => res.json()).then(data => setTestimonials(data.testimonials || []));
      } else {
        setTestimonialError(data.message || 'Failed to add testimonial');
      }
    } catch (error) {
      console.error('Testimonial submission error:', error);
      setTestimonialError('Server error');
    }
  };
  const openEditTestimonialModal = (t) => {
    setEditTestimonialData(t);
    setEditTestimonialImagePreview(t.image || null);
    setEditTestimonialModalOpen(true);
    setEditTestimonialError('');
  };
  const handleEditTestimonialChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setEditTestimonialData(f => ({ ...f, image: file }));
      setEditTestimonialImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setEditTestimonialData(f => ({ ...f, [name]: value }));
    }
  };
  const handleEditTestimonialSubmit = async e => {
    e.preventDefault();
    setEditTestimonialLoading(true);
    setEditTestimonialError('');
    const formData = new FormData();
    formData.append('name', editTestimonialData.name);
    formData.append('role', editTestimonialData.role);
    formData.append('text', editTestimonialData.text);
    if (editTestimonialData.image) formData.append('image', editTestimonialData.image);
    try {
      const res = await fetch(`${API_URL}/api/testimonials/${editTestimonialData._id}`, { method: 'PUT', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditTestimonialModalOpen(false);
        fetch(`${API_URL}/api/testimonials`).then(res => res.json()).then(data => setTestimonials(data.testimonials || []));
      } else {
        setEditTestimonialError(data.error || 'Failed to update testimonial');
      }
    } catch {
      setEditTestimonialError('Server error');
    }
    setEditTestimonialLoading(false);
  };
  const handleDeleteTestimonial = async id => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await fetch(`${API_URL}/api/testimonials/${id}`, { method: 'DELETE' });
      fetch(`${API_URL}/api/testimonials`).then(res => res.json()).then(data => setTestimonials(data.testimonials || []));
    } catch { }
  };

  // Render the AdminDashboard component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col items-center">
      {/* Top Header & Logout Row */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-blue-100">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <span className="text-[#20b2aa]">Academy</span>Wale <span className="text-sm font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Admin Panel</span>
        </h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Animated Button Row */}
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <button
          className={`${buttonBase} ${activePanel === 'course' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('course')}
        >
          <span className="mb-1 text-3xl">📚</span>
          <span className="text-sm font-semibold">Add Course</span>
        </button>
        <button
          className={`${buttonBase} ${activePanel === 'faculty' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('faculty')}
        >
          <span className="mb-1 text-3xl">👨‍🏫</span>
          <span className="text-sm font-semibold">Add Faculty</span>
        </button>
        <button
          className={`${buttonBase} ${activePanel === 'institute' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('institute')}
        >
          <span className="mb-1 text-3xl">🏫</span>
          <span className="text-sm font-semibold">Add Institute</span>
        </button>
        <button
          className={`${buttonBase} ${activePanel === 'bulk' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('bulk')}
        >
          <span className="mb-1 text-3xl">📤</span>
          <span className="text-sm font-semibold">Bulk Upload</span>
        </button>
      </div>
      {/* Panel Switcher */}
      {activePanel === 'course' && (
        <div className="w-full max-w-6xl bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 sm:mb-6 text-center">Add New Course</h2>

          <form onSubmit={handleNewCourseSubmit} className="space-y-4 sm:space-y-6" encType="multipart/form-data">

            {/* Section 1: General Course Information (Fixed Fields) */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border-2 border-blue-200 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2">Section 1: General Course Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                  <select
                    name="subcategory"
                    value={courseForm.subcategory}
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                    disabled={!courseForm.category}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => (
                      <option key={sub.value} value={sub.value}>{sub.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paper *</label>
                  <select
                    name="paperId"
                    value={courseForm.paperId}
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                    disabled={!courseForm.subcategory}
                  >
                    <option value="">Select Paper</option>
                    {getPapers(courseForm.category, courseForm.subcategory).map(paper => (
                      <option key={paper.id} value={paper.id}>
                        {paper.name} {paper.group ? `(${paper.group})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleCourseFormChange}
                    placeholder="Enter course title"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Poster *</label>
                  <div className="flex gap-4 items-start">
                    <input
                      name="poster"
                      type="file"
                      accept="image/*"
                      onChange={handleCourseFormChange}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                      required={!courseForm.poster}
                    />
                    {posterPreviewNew && (
                      <img src={posterPreviewNew} alt="Preview" className="w-12 h-12 object-cover rounded-xl border-2 border-blue-200" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty *</label>
                  <select
                    name="facultySlug"
                    value={courseForm.facultySlug}
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {allFaculties.map(fac => (
                      <option key={fac.slug} value={fac.slug}>
                        {fac.isHardcoded ? fac.fullName : `${fac.firstName} ${fac.lastName || ''}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institute *</label>
                  <select
                    name="instituteName"
                    value={courseForm.instituteName}
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 mobile-touch-target"
                    required
                  >
                    <option value="">Select Institute</option>
                    <option value="N/A">N/A - No Institute</option>
                    {institutes.map(inst => (
                      <option key={inst.id || inst.name} value={inst.name}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleCourseFormChange}
                  placeholder="Course description"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
              </div>
            </div>

            {/* Section 2: Custom Course Details (Dynamic specifications) */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl border-2 border-green-200 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Section 2: Custom Course Details</h3>
              <p className="text-xs text-gray-600">Add custom details (e.g. Lectures, Duration, Study Materials, Language) below.</p>
              
              {/* Dynamic Details List */}
              <div className="space-y-4">
                {(courseForm.customDetails || []).map((detail, idx) => (
                  <div key={idx} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    
                    {/* Reorder Buttons */}
                    <div className="flex lg:flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveCustomDetail(idx, 'up', false)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCustomDetail(idx, 'down', false)}
                        disabled={idx === (courseForm.customDetails || []).length - 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Field Type selector */}
                    <div className="w-full lg:w-40">
                      <select
                        value={detail.fieldType || 'text'}
                        onChange={(e) => updateCustomDetail(idx, 'fieldType', e.target.value, false)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 mobile-touch-target"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="image">Image URL</option>
                      </select>
                    </div>

                    {/* Label/Heading */}
                    <div className="w-full lg:w-48">
                      <input
                        type="text"
                        value={detail.label}
                        onChange={(e) => updateCustomDetail(idx, 'label', e.target.value, false)}
                        placeholder="Heading (e.g. Duration)"
                        className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 mobile-touch-target"
                        required
                      />
                    </div>

                    {/* Value Input */}
                    <div className="w-full lg:flex-1">
                      {detail.fieldType === 'textarea' ? (
                        <textarea
                          value={detail.value}
                          onChange={(e) => updateCustomDetail(idx, 'value', e.target.value, false)}
                          placeholder="Detail Value..."
                          rows={1}
                          className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                        />
                      ) : (
                        <input
                          type="text"
                          value={detail.value}
                          onChange={(e) => updateCustomDetail(idx, 'value', e.target.value, false)}
                          placeholder="Detail Value..."
                          className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 mobile-touch-target"
                        />
                      )}
                    </div>

                    {/* Visibility checkbox */}
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={`visible-${idx}`}
                        checked={detail.visible !== false}
                        onChange={(e) => updateCustomDetail(idx, 'visible', e.target.checked, false)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-400"
                      />
                      <label htmlFor={`visible-${idx}`} className="text-xs text-gray-500 cursor-pointer select-none">Visible</label>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeCustomDetail(idx, false)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold mobile-touch-target"
                    >
                      Remove
                    </button>

                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addCustomDetail(false)}
                className="mt-4 text-green-700 hover:text-green-800 text-sm font-semibold py-2 px-4 bg-green-100 hover:bg-green-200 rounded-lg transition-colors mobile-touch-target"
              >
                + Add Custom Detail Row
              </button>
            </div>

            {/* Step 3: Mode & Attempt Pricing (Shopify-like Variant Builder) */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200 pb-3">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-850">Step 3: Variants & Options</h3>
                  <p className="text-xs text-indigo-650">Add options like Mode, Validity, or Books to generate price variants.</p>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-4">
                {createOptions.map((option, optIdx) => (
                  <div key={optIdx} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm relative">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex-grow">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Option Name</label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => {
                            const updated = [...createOptions];
                            updated[optIdx].name = e.target.value;
                            handleOptionsChange(updated, false);
                          }}
                          placeholder="e.g. Validity, Size, Books"
                          className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                      {createOptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = createOptions.filter((_, idx) => idx !== optIdx);
                            handleOptionsChange(updated, false);
                          }}
                          className="text-red-500 hover:text-red-750 font-bold text-xs mt-4"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Option Values</label>
                      
                      {/* Tags Container */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {option.values.map((val, valIdx) => (
                          <span key={valIdx} className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
                            {val}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...createOptions];
                                updated[optIdx].values = option.values.filter((_, idx) => idx !== valIdx);
                                handleOptionsChange(updated, false);
                              }}
                              className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600 font-bold focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Tag Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type value and press Enter or click Add"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.target.value.trim();
                              if (val && !option.values.includes(val)) {
                                const updated = [...createOptions];
                                updated[optIdx].values = [...option.values, val];
                                handleOptionsChange(updated, false);
                                e.target.value = '';
                              }
                            }
                          }}
                          className="flex-grow text-xs bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const inputEl = e.currentTarget.previousSibling;
                            const val = inputEl.value.trim();
                            if (val && !option.values.includes(val)) {
                              const updated = [...createOptions];
                              updated[optIdx].values = [...option.values, val];
                              handleOptionsChange(updated, false);
                              inputEl.value = '';
                            }
                          }}
                          className="bg-indigo-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-750"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {createOptions.length < 20 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...createOptions, { name: `Option ${createOptions.length + 1}`, values: [] }];
                      handleOptionsChange(updated, false);
                    }}
                    className="w-full border-2 border-dashed border-indigo-200 text-indigo-600 hover:border-indigo-400 font-semibold text-xs py-2.5 px-3 rounded-lg hover:bg-indigo-50/30 transition-all text-center"
                  >
                    + Add Another Option (e.g. Validity, Books Option)
                  </button>
                )}
              </div>

              {/* Variants Grid */}
              {courseForm.modeAttemptPricing && courseForm.modeAttemptPricing.length > 0 ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <h4 className="font-bold text-sm text-gray-800">Variants Matrix</h4>
                    <span className="text-xs text-gray-505 font-medium">Grouped by {createOptions[0]?.name || 'Mode'}</span>
                  </div>

                  <div className="divide-y divide-gray-200 max-h-[450px] overflow-y-auto">
                    {courseForm.modeAttemptPricing.map((modeData, modeIndex) => (
                      <div key={modeIndex} className="p-4 space-y-3 bg-white">
                        <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
                          <span className="font-bold text-sm text-indigo-700">{modeData.mode}</span>
                          <span className="text-xs text-gray-400">({modeData.attempts?.length || 0} variants)</span>
                        </div>
                        
                        <div className="space-y-3">
                          {(modeData.attempts || []).map((attempt, attemptIndex) => (
                            <div key={attemptIndex} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center bg-gray-50/50 p-2.5 rounded-lg border border-gray-200/60">
                              <div className="lg:col-span-3">
                                <span className="text-[10px] font-semibold text-gray-400 block mb-0.5">Combination</span>
                                <span className="text-xs text-gray-700 font-bold">{attempt.attempt}</span>
                              </div>
                              <div className="lg:col-span-2">
                                <span className="text-[10px] font-semibold text-gray-500 block mb-0.5">Cost Price *</span>
                                <input
                                  type="number"
                                  value={attempt.costPrice || ''}
                                  onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'costPrice', parseInt(e.target.value) || 0, false)}
                                  placeholder="e.g. 8000"
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 font-medium"
                                  required
                                />
                              </div>
                              <div className="lg:col-span-2">
                                <span className="text-[10px] font-semibold text-gray-500 block mb-0.5">Selling Price *</span>
                                <input
                                  type="number"
                                  value={attempt.sellingPrice || ''}
                                  onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'sellingPrice', parseInt(e.target.value) || 0, false)}
                                  placeholder="e.g. 7000"
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 font-medium"
                                  required
                                />
                              </div>
                              <div className="lg:col-span-4">
                                <span className="text-[10px] font-semibold text-gray-500 block mb-0.5">Variant Note / Description</span>
                                <input
                                  type="text"
                                  value={attempt.description || ''}
                                  onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'description', e.target.value, false)}
                                  placeholder="e.g. Video duration details..."
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                />
                              </div>
                              <div className="lg:col-span-1 flex items-center justify-center pt-3">
                                <button
                                  type="button"
                                  onClick={() => removeAttemptFromMode(modeIndex, attemptIndex, false)}
                                  className="text-red-500 hover:text-red-700 font-semibold p-1 px-2 rounded hover:bg-red-55 text-xs transition-colors border border-red-200"
                                  title="Delete Variant Row"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-gray-200 p-6 rounded-xl text-center text-sm text-gray-500">
                  Define your options and option values above to generate course pricing variants.
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 sm:px-12 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all text-base sm:text-lg flex items-center justify-center gap-3 mx-auto w-full sm:w-auto mobile-touch-target"
                disabled={loading}
              >
                {loading && <span className="loader border-2 border-t-2 border-blue-300 border-t-transparent rounded-full w-5 h-5 animate-spin"></span>}
                {loading ? 'Adding Course...' : 'Add Course'}
              </button>
            </div>

            {/* Status Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-semibold">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}
          </form>
        </div>
      )}
      {activePanel === 'faculty' && (
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-300 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Faculty</h2>
          <form onSubmit={handleFacultyAddSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
            <input
              name="firstName"
              value={facultyAdd.firstName}
              onChange={handleFacultyAddChange}
              placeholder="Faculty First Name (e.g. VIJAY)"
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              name="lastName"
              value={facultyAdd.lastName}
              onChange={handleFacultyAddChange}
              placeholder="Faculty Last Name (optional)"
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="bio"
              value={facultyAdd.bio}
              onChange={handleFacultyAddChange}
              placeholder="Faculty Bio"
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
              rows={3}
            />
            <div className="flex gap-4 items-center">
              {TEACHES_OPTIONS.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="teaches"
                    value={opt}
                    checked={facultyAdd.teaches.includes(opt)}
                    onChange={handleFacultyAddChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Faculty Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFacultyAddChange}
                className="rounded-lg border border-gray-300 px-3 py-2 text-base"
              />
              {facultyAdd.imagePreview && (
                <img src={facultyAdd.imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-blue-200 mt-2" />
              )}
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2">
              Add Faculty
            </button>
            {facultyAddStatus && <div className="text-green-600 text-center font-semibold">{facultyAddStatus}</div>}
            {facultyAddError && <div className="text-red-600 text-center font-semibold">{facultyAddError}</div>}
          </form>

          {/* Delete All Faculty Section */}
          <div className="mt-8 p-6 bg-red-50 rounded-xl border-2 border-red-200">
            <h3 className="text-lg font-bold text-red-700 mb-3">⚠️ Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">This action will permanently delete ALL faculty members from the database. This cannot be undone.</p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
              >
                🗑️ Delete All Faculty
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-red-700 font-semibold">Are you absolutely sure? This will delete ALL faculty members!</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAllFaculty}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    ✅ Yes, Delete All
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {deleteAllStatus && <div className="text-green-600 font-semibold mt-3">{deleteAllStatus}</div>}
            {deleteAllError && <div className="text-red-600 font-semibold mt-3">{deleteAllError}</div>}
          </div>

          <h3 className="text-xl font-bold text-purple-700 mt-8 mb-4">All Faculties</h3>
          <div className="grid grid-cols-1 gap-4">
            {faculties.map(fac => (
              <div key={fac.slug} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4 border border-blue-100">
                <div className="flex items-center gap-4">
                  <FacultyImage
                    faculty={fac}
                    alt={fac.firstName}
                    className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200"
                  />
                  <div>
                    <div className="font-bold text-blue-700">{fac.firstName} {fac.lastName}</div>
                    <div className="text-xs text-gray-500">{fac.bio}</div>
                    <div className="text-xs text-gray-500">Teaches: {fac.teaches && fac.teaches.join(', ')}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
                  <button onClick={() => openEditFacultyModal(fac)} className="px-3 py-1 rounded bg-yellow-200 text-yellow-900 font-bold text-xs hover:bg-yellow-300 transition">✏️ Edit</button>
                  <button onClick={() => handleDeleteFaculty(fac.slug)} className="px-3 py-1 rounded bg-red-200 text-red-900 font-bold text-xs hover:bg-red-300 transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
          {/* Edit Faculty Modal */}
          <Modal
            isOpen={editFacultyModalOpen}
            onRequestClose={() => setEditFacultyModalOpen(false)}
            shouldCloseOnOverlayClick={false}
            style={modalStyles}
            ariaHideApp={false}
          >

            <h2 className="text-xl font-bold mb-4">Edit Faculty</h2>
            <form onSubmit={handleEditFacultySubmit} className="flex flex-col gap-3">
              <input name="firstName" value={editFacultyData.firstName || ''} onChange={handleEditFacultyChange} placeholder="First Name" className="rounded border px-3 py-2" required />
              <input name="lastName" value={editFacultyData.lastName || ''} onChange={handleEditFacultyChange} placeholder="Last Name" className="rounded border px-3 py-2" />
              <textarea name="bio" value={editFacultyData.bio || ''} onChange={handleEditFacultyChange} placeholder="Bio" className="rounded border px-3 py-2" />
              <div className="flex gap-4 items-center">
                {TEACHES_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="teaches"
                      value={opt}
                      checked={editFacultyData.teaches && editFacultyData.teaches.includes(opt)}
                      onChange={handleEditFacultyChange}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <input name="image" type="file" accept="image/*" onChange={handleEditFacultyChange} className="rounded border px-3 py-2" />
              {editFacultyImagePreview && <img src={editFacultyImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-200 mt-2" />}
              {editFacultyError && <div className="text-red-600 text-center font-semibold">{editFacultyError}</div>}
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setEditFacultyModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-bold" disabled={editFacultyLoading}>{editFacultyLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </Modal>
        </div>
      )}
      {activePanel === 'institute' && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Add Institute Section */}
          <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-300 mb-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Institute</h2>
            <form onSubmit={handleInstituteAddSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
              <input
                name="name"
                value={instituteAdd.name}
                onChange={handleInstituteAddChange}
                placeholder="Institute Name (e.g. SJC)"
                className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Institute Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleInstituteAddChange}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-base"
                  required
                />
                {instituteAdd.imagePreview && (
                  <img src={instituteAdd.imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-blue-200 mt-2" />
                )}
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2">
                Add Institute
              </button>
              {instituteAddStatus && <div className="text-green-600 text-center font-semibold">{instituteAddStatus}</div>}
              {instituteAddError && <div className="text-red-600 text-center font-semibold">{instituteAddError}</div>}
            </form>
          </div>
          {/* Manage Testimonials Section (disabled) */}
          <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-green-300 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Testimonials</h2>
            <div className="text-gray-700">Testimonials are now hardcoded. Admin editing is disabled.</div>
          </div>
        </div>
      )}
      {activePanel === 'bulk' && (
        <div className="w-full max-w-5xl bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 text-center">CSV Bulk Course Upload</h2>
          <p className="text-gray-600 text-sm text-center max-w-xl mx-auto mb-6">
            Upload a CSV file containing multiple courses to add them to the LMS in bulk. Missing faculties will be automatically provisioned based on the faculty name.
          </p>

          {/* Guidelines / Help section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-6 text-sm text-gray-700">
            <h4 className="font-bold text-blue-800 mb-2">CSV Column Guidelines:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc pl-4 font-mono text-xs text-gray-600">
              <div>• title * (Course title)</div>
              <div>• subject * (Subject name)</div>
              <div>• category * (CA or CMA)</div>
              <div>• course_type * (Foundation, Inter, Final)</div>
              <div>• faculty_name * (Faculty Name)</div>
              <div>• selling_price * (e.g. 5000)</div>
              <div>• cost_price (e.g. 8000)</div>
              <div>• duration (e.g. 70 lectures)</div>
              <div>• books (Study Material description)</div>
              <div>• language (e.g. English, Hindi)</div>
              <div>• validity (e.g. 6 Months Validity)</div>
              <div>• mode (e.g. Recorded Video)</div>
              <div>• image_url (Poster Image URL)</div>
              <div>• status (active or inactive)</div>
            </div>
            <p className="text-[11px] text-blue-600 mt-3 font-semibold">* Required fields must not be empty.</p>
          </div>

          {/* Upload Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 bg-slate-50 p-5 rounded-2xl border border-gray-200 w-full justify-between">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-xl bg-white p-1.5 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleParseCSV}
              disabled={!bulkFile || bulkLoading}
              className={`w-full sm:w-auto px-6 py-3 font-bold text-sm rounded-xl shadow transition-all shrink-0 ${
                !bulkFile || bulkLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
              }`}
            >
              {bulkLoading ? 'Parsing...' : 'Parse & Preview'}
            </button>
          </div>

          {bulkError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold text-center">
              ❌ {bulkError}
            </div>
          )}

          {bulkSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold text-center">
              ✅ {bulkSuccess}
            </div>
          )}

          {/* Results Summary if upload was triggered */}
          {uploadResults && (
            <div className="mb-6 bg-slate-950 text-white p-5 rounded-xl border border-neutral-800 text-sm">
              <h4 className="font-bold text-base mb-2">Upload Results Summary:</h4>
              <p className="text-green-400 font-semibold font-sans">✓ Successfully Uploaded: {uploadResults.successCount} courses</p>
              <p className="text-red-400 font-semibold font-sans mb-3">✗ Failed / Skipped Rows: {uploadResults.failedCount}</p>
              
              {uploadResults.errors && uploadResults.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto bg-neutral-950 p-3 rounded-lg border border-neutral-900 mt-2 font-mono text-xs text-red-300 space-y-1 divide-y divide-neutral-900/50">
                  {uploadResults.errors.map((err, idx) => (
                    <div key={idx} className="pt-1.5 first:pt-0">
                      Row {err.row}: {err.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {bulkCourses.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">CSV Row Preview & Validation</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-[350px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Row</th>
                      <th className="p-3">Title / Subject</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Faculty</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bulkCourses.map((c, idx) => (
                      <tr key={idx} className={c.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/30 hover:bg-red-50/50'}>
                        <td className="p-3 font-semibold text-gray-500">#{c.rowNum}</td>
                        <td className="p-3 font-medium text-gray-800">
                          <div>{c.data.title || c.data.subject}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{c.data.course_type || 'N/A'}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            c.data.category?.toUpperCase() === 'CA' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-150' 
                              : 'bg-amber-50 text-amber-700 border border-amber-150'
                          }`}>
                            {c.data.category || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-gray-600">{c.data.faculty_name || 'N/A'}</td>
                        <td className="p-3 font-bold text-slate-800">₹{Number(c.data.selling_price || 0).toLocaleString()}</td>
                        <td className="p-3">
                          {c.isValid ? (
                            <span className="text-green-700 font-bold flex items-center gap-1">✓ Valid</span>
                          ) : (
                            <span className="text-red-600 font-bold flex flex-col gap-0.5">
                              <span>✗ Invalid</span>
                              <span className="text-[9px] font-normal leading-tight text-red-500">{c.validationError}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Upload Trigger Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBulkUploadSubmit}
                  disabled={bulkLoading || bulkCourses.filter(c => c.isValid).length === 0}
                  className={`px-8 py-3 rounded-xl font-bold shadow-lg text-sm transition-all ${
                    bulkLoading || bulkCourses.filter(c => c.isValid).length === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#20b2aa] to-[#126862] hover:from-[#17817a] hover:to-[#0f5752] text-white hover:scale-[1.01]'
                  }`}
                >
                  {bulkLoading ? 'Uploading...' : `Upload ${bulkCourses.filter(c => c.isValid).length} Valid Courses`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-green-100 mb-8 mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Coupon Codes</h2>
        <form onSubmit={handleAddCoupon} className="flex flex-col gap-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              name="code" 
              value={couponForm.code} 
              onChange={handleCouponChange} 
              placeholder="Coupon Code (e.g. SPECIAL10)" 
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" 
              required 
            />
            <input 
              name="discountPercent" 
              value={couponForm.discountPercent} 
              onChange={handleCouponChange} 
              placeholder="Discount % (e.g. 6.66)" 
              type="number" 
              step="0.01"
              min="0.01" 
              max="100" 
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" 
              required 
            />
          </div>

          <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-gray-200">
            <label className="text-xs font-bold text-gray-700">Course Scope (Apply to All Courses or Multiple Courses):</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-teal-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={couponForm.isGlobal}
                  onChange={(e) => setCouponForm(f => ({ ...f, isGlobal: e.target.checked, courseIds: e.target.checked ? [] : f.courseIds }))}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>🌐 All Courses (Global Coupon)</span>
              </label>
            </div>
            {!couponForm.isGlobal && (
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2 bg-white space-y-1 mt-1">
                {availableCourses.map((c) => {
                  const cId = c.id || c._id;
                  const isChecked = (couponForm.courseIds || []).includes(cId);
                  return (
                    <label key={cId} className="flex items-center gap-2 text-xs text-gray-800 hover:bg-gray-50 p-1 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCourseInCouponForm(cId)}
                        className="w-3.5 h-3.5 text-green-600 rounded border-gray-300"
                      />
                      <span className="font-medium">{c.title || c.subject} ({c.category || 'Course'})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <input 
              name="message" 
              value={couponForm.message} 
              onChange={handleCouponChange} 
              placeholder="Custom Note / Faculty Tag (e.g. 5% discount by Ranjan Periwal Sir)" 
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" 
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isVisible"
                checked={couponForm.isVisible}
                onChange={handleCouponChange}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span>Show in Course Details Page (Visible to Students)</span>
            </label>
            <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-lg shadow hover:bg-green-700 transition-all">
              Add Coupon
            </button>
          </div>
        </form>
        {couponSuccess && <div className="text-green-600 text-center font-semibold mb-2">{couponSuccess}</div>}
        {couponError && <div className="text-red-600 text-center font-semibold mb-2">{couponError}</div>}
        <div>
          <h3 className="text-lg font-bold mb-2">Active Coupons</h3>
          {coupons.length === 0 && <div className="text-gray-500">No coupons found.</div>}
          <ul className="divide-y divide-gray-200">
            {coupons.map(c => {
              const linkedCourse = c.courseId ? availableCourses.find(ac => (ac.id || ac._id) === c.courseId) : null;
              return (
                <li key={c.code} className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-gray-850">{c.code}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleCouponVisibility(c.code, c.isVisible !== false)}
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                          c.isVisible !== false 
                            ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                        }`}
                        title="Click to toggle visibility on course detail page"
                      >
                        {c.isVisible !== false ? '👁️ Visible on Course Page (Click to Hide)' : '🙈 Hidden (Click to Show)'}
                      </button>

                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {c.courseIds && c.courseIds.length > 0 
                        ? `🎯 Scope: ${c.courseIds.length} Specific Course(s)` 
                        : (linkedCourse ? `🎯 Course: ${linkedCourse.title || linkedCourse.subject}` : '🌐 Scope: All Courses')}
                    </span>

                    {c.message && (
                      <span className="text-xs text-teal-700 font-semibold mt-0.5">💬 {c.message}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-700 font-extrabold">{c.discountPercent}% off</span>
                    <button onClick={() => handleDeleteCoupon(c.code)} className="text-red-500 hover:underline text-sm font-semibold">Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="w-full max-w-3xl">
        <CoursesByPaperSection
          onEditCourse={openEditModal}
          onCloneCourse={handleCloneCourse}
          onDeleteCourse={handleDeleteCourse}
          refreshKey={courseListRefreshKey}
        />
      </div>
      {/* Edit Course Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        shouldCloseOnOverlayClick={false}
        style={{
          content: {
            ...modalStyles.content,
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
        ariaHideApp={false}
      >

        <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Course</h2>
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          
          {/* Section 1: General Course Information (Fixed Fields) */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-blue-200 space-y-4">
            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">Section 1: General Course Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={editCourseData.category || ''}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subcategory *</label>
                <select
                  name="subcategory"
                  value={editCourseData.subcategory || ''}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                  required
                  disabled={!editCourseData.category}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Paper *</label>
                <select
                  name="paperId"
                  value={editCourseData.paperId || ''}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                  required
                  disabled={!editCourseData.subcategory}
                >
                  <option value="">Select Paper</option>
                  {getPapers(editCourseData.category, editCourseData.subcategory).map(paper => (
                    <option key={paper.id} value={paper.id}>
                      {paper.name} {paper.group ? `(${paper.group})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editCourseData.title || ''}
                  onChange={handleEditChange}
                  placeholder="Enter course title"
                  className="w-full rounded border border-gray-350 px-3 py-1.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Course Poster</label>
                <div className="flex gap-3 items-start">
                  <input
                    name="poster"
                    type="file"
                    accept="image/*"
                    onChange={handleEditChange}
                    className="flex-1 rounded border border-gray-300 px-3 py-1 text-xs"
                  />
                  {editPosterPreview ? (
                    <img src={editPosterPreview} alt="Preview" className="w-10 h-10 object-cover rounded-xl border" />
                  ) : editCourseData.posterUrl ? (
                    <img src={editCourseData.posterUrl} alt="Current Poster" className="w-10 h-10 object-cover rounded-xl border" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Faculty *</label>
                <select
                  name="facultySlug"
                  value={editCourseData.facultySlug || ''}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                  required
                >
                  <option value="">Select Faculty</option>
                  {allFaculties.map(fac => (
                    <option key={fac.slug} value={fac.slug}>
                      {fac.isHardcoded ? fac.fullName : `${fac.firstName} ${fac.lastName || ''}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Institute *</label>
                <select
                  name="instituteName"
                  value={editCourseData.instituteName || ''}
                  onChange={handleEditChange}
                  className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
                  required
                >
                  <option value="">Select Institute</option>
                  <option value="N/A">N/A - No Institute</option>
                  {institutes.map(inst => (
                    <option key={inst.id || inst.name} value={inst.name}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editCourseData.description || ''}
                onChange={handleEditChange}
                placeholder="Course description"
                className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Section 2: Custom Course Details (Dynamic specifications) */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-green-200 space-y-4">
            <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">Section 2: Custom Course Details</h3>
            
            {/* Dynamic Details List */}
            <div className="space-y-3">
              {(editCourseData.customDetails || []).map((detail, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row gap-2 items-start lg:items-center bg-white p-3 rounded border border-gray-200">
                  
                  {/* Reorder Buttons */}
                  <div className="flex lg:flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveCustomDetail(idx, 'up', true)}
                      disabled={idx === 0}
                      className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCustomDetail(idx, 'down', true)}
                      disabled={idx === (editCourseData.customDetails || []).length - 1}
                      className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="w-full lg:w-32">
                    <select
                      value={detail.fieldType || 'text'}
                      onChange={(e) => updateCustomDetail(idx, 'fieldType', e.target.value, true)}
                      className="w-full rounded border border-gray-300 px-1 py-1 text-xs focus:outline-none focus:ring-1"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Text</option>
                      <option value="image">Image URL</option>
                    </select>
                  </div>

                  <div className="w-full lg:w-40">
                    <input
                      type="text"
                      value={detail.label}
                      onChange={(e) => updateCustomDetail(idx, 'label', e.target.value, true)}
                      placeholder="Label"
                      className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                      required
                    />
                  </div>

                  <div className="w-full lg:flex-1">
                    {detail.fieldType === 'textarea' ? (
                      <textarea
                        value={detail.value}
                        onChange={(e) => updateCustomDetail(idx, 'value', e.target.value, true)}
                        placeholder="Value"
                        rows={1}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    ) : (
                      <input
                        type="text"
                        value={detail.value}
                        onChange={(e) => updateCustomDetail(idx, 'value', e.target.value, true)}
                        placeholder="Value"
                        className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`edit-visible-${idx}`}
                      checked={detail.visible !== false}
                      onChange={(e) => updateCustomDetail(idx, 'visible', e.target.checked, true)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-400"
                    />
                    <label htmlFor={`edit-visible-${idx}`} className="text-xs text-gray-505 cursor-pointer">Visible</label>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCustomDetail(idx, true)}
                    className="text-red-500 hover:text-red-750 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addCustomDetail(true)}
              className="mt-3 text-green-700 hover:text-green-800 text-xs font-semibold py-1.5 px-3 bg-green-100 hover:bg-green-200 rounded"
            >
              + Add Custom Detail Row
            </button>
          </div>

          {/* Step 3: Pricing Block Editor (Shopify-like Variant Builder) */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex flex-col gap-1 border-b border-indigo-100 pb-2">
              <h3 className="text-lg font-bold text-purple-700">Pricing Options & Variants</h3>
              <p className="text-[10px] text-gray-500">Edit options to automatically regenerate combinations, or input pricing details directly below.</p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {(editOptions || []).map((option, optIdx) => (
                <div key={optIdx} className="bg-purple-50/30 border border-purple-100 rounded-xl p-3.5 space-y-2.5 relative">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-grow">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Option Name</label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => {
                          const updated = [...editOptions];
                          updated[optIdx].name = e.target.value;
                          handleOptionsChange(updated, true);
                        }}
                        placeholder="e.g. Validity or Books"
                        className="w-full text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    {(editOptions || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editOptions.filter((_, idx) => idx !== optIdx);
                          handleOptionsChange(updated, true);
                        }}
                        className="text-red-500 hover:text-red-750 font-bold text-xs mt-3"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Option Values</label>
                    
                    {/* Tags Container */}
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {(option.values || []).map((val, valIdx) => (
                        <span key={valIdx} className="inline-flex items-center bg-purple-100 text-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                          {val}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...editOptions];
                              updated[optIdx].values = option.values.filter((_, idx) => idx !== valIdx);
                              handleOptionsChange(updated, true);
                            }}
                            className="ml-1 inline-flex items-center justify-center text-purple-450 hover:text-purple-650 font-bold focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Tag Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type value and press Enter or click Add"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !option.values.includes(val)) {
                              const updated = [...editOptions];
                              updated[optIdx].values = [...option.values, val];
                              handleOptionsChange(updated, true);
                              e.target.value = '';
                            }
                          }
                        }}
                        className="flex-grow text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const inputEl = e.currentTarget.previousSibling;
                          const val = inputEl.value.trim();
                          if (val && !option.values.includes(val)) {
                            const updated = [...editOptions];
                            updated[optIdx].values = [...option.values, val];
                            handleOptionsChange(updated, true);
                            inputEl.value = '';
                          }
                        }}
                        className="bg-purple-600 text-white font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {(editOptions || []).length < 20 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...editOptions, { name: `Option ${editOptions.length + 1}`, values: [] }];
                    handleOptionsChange(updated, true);
                  }}
                  className="w-full border-2 border-dashed border-purple-200 text-purple-600 hover:border-purple-400 font-semibold text-xs py-2 px-3 rounded-lg hover:bg-purple-50/30 transition-all text-center"
                >
                  + Add Another Option
                </button>
              )}
            </div>

            {/* Variants Grid */}
            {editCourseData.modeAttemptPricing && editCourseData.modeAttemptPricing.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white">
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-gray-800">Variants Matrix</h4>
                  <span className="text-[10px] text-gray-505 font-medium">Grouped by {editOptions[0]?.name || 'Mode'}</span>
                </div>

                <div className="divide-y divide-gray-200 max-h-[350px] overflow-y-auto">
                  {editCourseData.modeAttemptPricing.map((modeData, modeIndex) => (
                    <div key={modeIndex} className="p-3 space-y-2 bg-white">
                      <div className="flex items-center gap-1.5 border-b border-gray-150 pb-1.5">
                        <span className="font-bold text-xs text-purple-700">{modeData.mode}</span>
                        <span className="text-[10px] text-gray-400">({modeData.attempts?.length || 0} variants)</span>
                      </div>
                      
                      <div className="space-y-2">
                        {(modeData.attempts || []).map((attempt, attemptIndex) => (
                          <div key={attemptIndex} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50/50 p-2 rounded-lg border border-gray-250/60">
                            <div className="md:col-span-3">
                              <span className="text-[9px] font-semibold text-gray-400 block">Combination</span>
                              <span className="text-xs text-gray-700 font-bold">{attempt.attempt}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-[9px] font-semibold text-gray-500 block">Cost Price *</span>
                              <input
                                type="number"
                                value={attempt.costPrice || ''}
                                onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'costPrice', parseInt(e.target.value) || 0, true)}
                                className="w-full rounded border border-gray-300 px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-[9px] font-semibold text-gray-500 block">Selling Price *</span>
                              <input
                                type="number"
                                value={attempt.sellingPrice || ''}
                                onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'sellingPrice', parseInt(e.target.value) || 0, true)}
                                className="w-full rounded border border-gray-300 px-2 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
                                required
                              />
                            </div>
                            <div className="md:col-span-4">
                              <span className="text-[9px] font-semibold text-gray-500 block">Variant Note / Description</span>
                              <input
                                type="text"
                                value={attempt.description || ''}
                                onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'description', e.target.value, true)}
                                placeholder="notes..."
                                className="w-full rounded border border-gray-300 px-2 py-0.5 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="md:col-span-1 flex items-center justify-center pt-2.5">
                              <button
                                type="button"
                                onClick={() => removeAttemptFromMode(modeIndex, attemptIndex, true)}
                                className="text-red-500 hover:text-red-700 font-semibold p-0.5 px-1.5 rounded hover:bg-red-55 text-[10px] transition-colors border border-red-200"
                                title="Delete Variant Row"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {editError && <div className="text-red-600 text-center font-semibold">{editError}</div>}
          
          <div className="flex gap-2 mt-4 border-t pt-3">
            <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-bold text-sm" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
