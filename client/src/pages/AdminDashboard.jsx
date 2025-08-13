import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import FacultyImage from '../components/ui/FacultyImage';
import { getAllFaculties } from '../data/hardcodedFaculties';
import { 
  getFacultyUpdates, 
  updateFacultyDetails, 
  getFacultyDetails, 
  getAllFacultiesWithUpdates 
} from '../data/facultyUpdates';

const MODES = ['Live Watching', 'Recorded Videos'];
const DURATIONS = ['August 2025', 'February 2026', 'August 2026', 'February 2027', 'August 2027'];
const TEACHES_OPTIONS = ['CA', 'CMA'];
const COURSE_OPTIONS = [
  'CA Foundation', 'CMA Foundation',
  'CA Inter', 'CMA Inter', 
  'CA Final', 'CMA Final'
];
const API_URL = import.meta.env.VITE_API_URL;

// Modal styles
const modalStyles = {
  overlay: { zIndex: 1000, background: 'rgba(0,0,0,0.3)' },
  content: { maxWidth: 500, margin: 'auto', borderRadius: 16, padding: 32 }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  if (localStorage.getItem('isAdmin') !== 'true') {
    navigate('/admin');
    return null;
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
    const facultiesWithUpdates = getAllFacultiesWithUpdates(faculties);
    console.log('📝 Faculties with updates:', facultiesWithUpdates);
    setHardcodedFaculties(facultiesWithUpdates);
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
      const res = await fetch(`/api/admin/faculty-info`, {
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
      const res = await fetch(`${API_URL}/api/admin/faculty`, {
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
      
      const res = await fetch(`${API_URL}/emergency-delete-faculty`, {
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
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '' });
  const [coupons, setCoupons] = useState([]);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Add Institute State
  const [instituteAdd, setInstituteAdd] = useState({ name: '', image: null, imagePreview: null });
  const [instituteAddStatus, setInstituteAddStatus] = useState('');
  const [instituteAddError, setInstituteAddError] = useState('');

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
      const res = await fetch(`${API_URL}/api/admin/institutes`, {
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

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`);
      const data = await res.json();
      if (res.ok && data.success) setCoupons(data.coupons);
    } catch {}
  };

  const handleCouponChange = e => {
    const { name, value } = e.target;
    setCouponForm(f => ({ ...f, [name]: value }));
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
      const res = await fetch(`${API_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponForm.code.trim().toUpperCase(),
          discountPercent: Number(couponForm.discountPercent)
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCouponSuccess('Coupon added!');
        setCouponForm({ code: '', discountPercent: '' });
        fetchCoupons();
        setTimeout(() => setCouponSuccess(''), 2000);
      } else {
        setCouponError(data.error || 'Failed to add coupon');
      }
    } catch {
      setCouponError('Server error');
    }
  };

  const handleDeleteCoupon = async code => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await fetch(`${API_URL}/api/admin/coupons/${code}`, { method: 'DELETE' });
      fetchCoupons();
    } catch {}
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
    if (facultyName) {
      const firstName = facultyName.split(' ')[0].toUpperCase();
      url = `${API_URL}/api/courses/${firstName}`;
    } else if (instituteName) {
      url = `${API_URL}/api/institutes/${encodeURIComponent(instituteName)}/courses`;
    } else {
      setCourses([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        setFacultyQueried(facultyName || '');
      } else {
        setCourses([]);
        setError(data.error || 'Could not fetch courses');
      }
    } catch (err) {
      setError('Server error');
      setCourses([]);
    }
    setLoading(false);
  };

  // New Course Management State
  const [courseForm, setCourseForm] = useState({
    isStandalone: false, // New field for standalone courses
    title: '', // Course title for standalone courses
    category: '', // CA or CMA
    subcategory: '', // Foundation, Inter, Final
    paperId: '', // Paper 1, Paper 2, etc.
    paperName: '',
    subject: '',
    facultySlug: '',
    institute: '',
    description: '',
    noOfLecture: '',
    books: '',
    videoLanguage: '',
    videoRunOn: '',
    doubtSolving: '',
    supportMail: '',
    supportCall: '',
    timing: '',
    validityStartFrom: '',
    poster: null,
    modeAttemptPricing: [
      {
        mode: 'Live at Home With Hard Copy',
        attempts: [
          { attempt: '1.5 Views & 12 Months Validity', costPrice: 15999, sellingPrice: 13999 }
        ]
      }
    ]
  });

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
    if (category === 'CA') {
      if (subcategory === 'Foundation') {
        return [
          { id: 1, name: 'Principles and Practice of Accounting' },
          { id: 2, name: 'Business Laws and Business Correspondence and Reporting' },
          { id: 3, name: 'Business Mathematics, Logical Reasoning & Statistics' },
          { id: 4, name: 'Business Economics & Business and Commercial Knowledge' }
        ];
      } else if (subcategory === 'Inter') {
        return [
          // INTERMEDIATE GROUP 1
          { id: 5, name: 'Advanced Accounting', group: 'Group 1' },
          { id: 6, name: 'Corporate and Other Laws', group: 'Group 1' },
          { id: 7, name: 'Taxation (Income tax laws & Goods & Service Tax)', group: 'Group 1' },
          // INTERMEDIATE GROUP 2
          { id: 8, name: 'Cost and Management Accounting', group: 'Group 2' },
          { id: 9, name: 'Auditing and ethics', group: 'Group 2' },
          { id: 10, name: 'Financial Management and Strategic Management', group: 'Group 2' }
        ];
      } else if (subcategory === 'Final') {
        return [
          // FINAL GROUP 3
          { id: 11, name: 'Financial Reporting', group: 'Group 3' },
          { id: 12, name: 'Advanced Financial Management', group: 'Group 3' },
          { id: 13, name: 'Advanced Auditing and Professional Ethics', group: 'Group 3' },
          { id: 14, name: 'Direct Tax Laws and International Taxation', group: 'Group 3' },
          // FINAL GROUP 4
          { id: 15, name: 'Indirect Tax Laws', group: 'Group 4' },
          { id: 16, name: 'Corporate and Economic Laws', group: 'Group 4' },
          { id: 17, name: 'Strategic Cost and Performance Management', group: 'Group 4' }
        ];
      }
    } else if (category === 'CMA') {
      if (subcategory === 'Foundation') {
        return [
          { id: 1, name: 'Fundamentals of Business Laws' },
          { id: 2, name: 'Fundamentals of Financial and Cost Accounting' },
          { id: 3, name: 'Fundamentals of Business mathematics and statistics' },
          { id: 4, name: 'Fundamentals of Business Economics and Management' }
        ];
      } else if (subcategory === 'Inter') {
        return [
          // INTERMEDIATE GROUP 1
          { id: 5, name: 'Business Laws and Ethics', group: 'Group 1' },
          { id: 6, name: 'Financial Accounting', group: 'Group 1' },
          { id: 7, name: 'Direct and Indirect Taxation', group: 'Group 1' },
          { id: 8, name: 'Cost Accounting', group: 'Group 1' },
          // INTERMEDIATE GROUP 2
          { id: 9, name: 'Operations Management and Strategic Management', group: 'Group 2' },
          { id: 10, name: 'Corporate Accounting and Auditing', group: 'Group 2' },
          { id: 11, name: 'Financial Management and Business Data Analytics', group: 'Group 2' },
          { id: 12, name: 'Management Accounting', group: 'Group 2' }
        ];
      } else if (subcategory === 'Final') {
        return [
          // FINAL GROUP 3
          { id: 13, name: 'Corporate and Economic Laws', group: 'Group 3' },
          { id: 14, name: 'Strategic Financial Management', group: 'Group 3' },
          { id: 15, name: 'Direct Tax Laws and International Taxation', group: 'Group 3' },
          { id: 16, name: 'Strategic Cost Management', group: 'Group 3' },
          // FINAL GROUP 4
          { id: 17, name: 'Cost and Management Audit', group: 'Group 4' },
          { id: 18, name: 'Corporate Financial Reporting', group: 'Group 4' },
          { id: 19, name: 'Indirect Tax Laws and Practice', group: 'Group 4' },
          { id: 20, name: 'Strategic Performance Management and Business Valuation', group: 'Group 4' }
        ];
      }
    }
    return [];
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
      
      // Auto-fill paper name when paper ID is selected
      if (name === 'paperId') {
        const papers = getPapers(courseForm.category, courseForm.subcategory);
        const selectedPaper = papers.find(p => p.id === parseInt(value));
        if (selectedPaper) {
          setCourseForm(prev => ({ ...prev, paperName: selectedPaper.name }));
        }
      }
    }
  };

  const addModeAttemptPricing = () => {
    setCourseForm(prev => ({
      ...prev,
      modeAttemptPricing: [
        ...prev.modeAttemptPricing,
        {
          mode: '',
          attempts: [
            { attempt: '', costPrice: 0, sellingPrice: 0 }
          ]
        }
      ]
    }));
  };

  const removeModeAttemptPricing = (modeIndex) => {
    setCourseForm(prev => ({
      ...prev,
      modeAttemptPricing: prev.modeAttemptPricing.filter((_, index) => index !== modeIndex)
    }));
  };

  const updateModeAttemptPricing = (modeIndex, field, value) => {
    setCourseForm(prev => ({
      ...prev,
      modeAttemptPricing: prev.modeAttemptPricing.map((item, index) => 
        index === modeIndex ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAttemptToPricing = (modeIndex) => {
    setCourseForm(prev => ({
      ...prev,
      modeAttemptPricing: prev.modeAttemptPricing.map((item, index) => 
        index === modeIndex 
          ? { 
              ...item, 
              attempts: [...item.attempts, { attempt: '', costPrice: 0, sellingPrice: 0 }] 
            } 
          : item
      )
    }));
  };

  const removeAttemptFromPricing = (modeIndex, attemptIndex) => {
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
  };

  const updateAttemptPricing = (modeIndex, attemptIndex, field, value) => {
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
  };

  const handleNewCourseSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    // Validation for standalone courses vs faculty courses
    if (courseForm.isStandalone) {
      // Standalone course validation
      if (!courseForm.category || !courseForm.subcategory || !courseForm.paperId || 
          !courseForm.title || !courseForm.subject || !courseForm.poster) {
        setError('Please fill all required fields (Category, Subcategory, Paper, Title, Subject, and Poster are required for standalone courses)');
        return;
      }
    } else {
      // Faculty-based course validation
      if (!courseForm.category || !courseForm.subcategory || !courseForm.paperId || 
          !courseForm.subject || !courseForm.facultySlug || !courseForm.poster) {
        setError('Please fill all required fields');
        return;
      }
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
      
      // Fix: Use correct endpoint based on course type
      const apiEndpoint = courseForm.isStandalone 
        ? `${API_URL}/api/admin/courses/standalone`
        : `${API_URL}/api/admin/courses`;
      
      console.log('🔗 API Endpoint:', apiEndpoint);
      console.log('📋 Course Form Data:', courseForm);
      console.log('🌐 API_URL value:', API_URL);
      console.log('🎯 Course Type:', courseForm.isStandalone ? 'Standalone' : 'Faculty-based');
      console.log('🔍 isStandalone value:', courseForm.isStandalone, typeof courseForm.isStandalone);
      
      // Test endpoint availability first
      console.log('🧪 Testing endpoint availability...');
      try {
        const testResponse = await fetch(apiEndpoint, { method: 'OPTIONS' });
        console.log('🔍 OPTIONS Response:', testResponse.status, testResponse.statusText);
      } catch (testError) {
        console.error('❌ Endpoint test failed:', testError);
      }
      
      // Fix: Convert boolean to string for backend compatibility
      formData.append('isStandalone', courseForm.isStandalone ? 'true' : 'false');
      
      // Basic course info - common for both types
      formData.append('category', courseForm.category);
      formData.append('subcategory', courseForm.subcategory);
      formData.append('paperId', courseForm.paperId);
      formData.append('paperName', courseForm.paperName);
      formData.append('subject', courseForm.subject);
      formData.append('institute', courseForm.institute);
      
      console.log('📝 Appending isStandalone:', courseForm.isStandalone ? 'true' : 'false');
      console.log('📝 Appending facultySlug:', courseForm.facultySlug);
      
      // Course type specific fields
      if (courseForm.isStandalone) {
        // Standalone course specific fields
        formData.append('title', courseForm.title);
        // For standalone, facultySlug is optional
        if (courseForm.facultySlug) {
          formData.append('facultySlug', courseForm.facultySlug);
          formData.append('facultyName', courseForm.facultySlug);
        }
        console.log('📍 Preparing STANDALONE course data');
      } else {
        // Faculty-based course specific fields - facultySlug is required
        if (!courseForm.facultySlug) {
          setError('Faculty is required for faculty-based courses');
          setLoading(false);
          return;
        }
        formData.append('facultySlug', courseForm.facultySlug);
        // For faculty courses, title can be auto-generated from paperName
        formData.append('title', courseForm.paperName || courseForm.subject);
        console.log('📍 Preparing FACULTY course data');
      }
      
      // Common fields for both course types
      formData.append('description', courseForm.description);
      formData.append('noOfLecture', courseForm.noOfLecture);
      formData.append('books', courseForm.books);
      formData.append('videoLanguage', courseForm.videoLanguage);
      formData.append('videoRunOn', courseForm.videoRunOn);
      formData.append('doubtSolving', courseForm.doubtSolving);
      formData.append('supportMail', courseForm.supportMail);
      formData.append('supportCall', courseForm.supportCall);
      formData.append('timing', courseForm.timing);
      formData.append('validityStartFrom', courseForm.validityStartFrom);
      
      // Poster upload validation
      if (courseForm.poster) {
        formData.append('poster', courseForm.poster);
      } else {
        setError('Poster image is required');
        setLoading(false);
        return;
      }
      
      // Course type for backwards compatibility
      formData.append('courseType', `${courseForm.category} ${courseForm.subcategory}`);
      
      // Mode and attempt pricing
      formData.append('modeAttemptPricing', JSON.stringify(courseForm.modeAttemptPricing));

      console.log('📤 Sending FormData with fields:');
      for (let [key, value] of formData.entries()) {
        console.log(`   ${key}: ${value}`);
      }

      console.log('🚀 Making POST request to:', apiEndpoint);
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Response received:', res.status, res.statusText);
      console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));
      
      const responseText = await res.text();
      console.log('📋 Raw response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        console.error('❌ Raw response:', responseText);
        
        // Check if it's an HTML error page (500 error)
        if (responseText.includes('<!DOCTYPE html>') && responseText.includes('Internal Server Error')) {
          throw new Error('Backend server error - please check server logs. The server crashed while processing your request.');
        } else {
          throw new Error(`Server response is not valid JSON: ${responseText.substring(0, 200)}...`);
        }
      }
      
      if (res.ok) {
        console.log('✅ Course creation successful:', data);
        setSuccess(courseForm.isStandalone ? 'Standalone course added successfully!' : 'Course added successfully!');
        // Reset form
        setCourseForm({
          isStandalone: false,
          title: '',
          category: '',
          subcategory: '',
          paperId: '',
          paperName: '',
          subject: '',
          facultySlug: '',
          institute: '',
          description: '',
          noOfLecture: '',
          books: '',
          videoLanguage: '',
          videoRunOn: '',
          doubtSolving: '',
          supportMail: '',
          supportCall: '',
          timing: '',
          validityStartFrom: '',
          poster: null,
          modeAttemptPricing: [
            {
              mode: 'Live at Home With Hard Copy',
              attempts: [
                { attempt: '1.5 Views & 12 Months Validity', costPrice: 15999, sellingPrice: 13999 }
              ]
            }
          ]
        });
        setPosterPreviewNew(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('❌ Course creation failed:', data);
        setError(data.error || 'Failed to add course');
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
    // Extra validation for facultySlug and institute
    if (!form.facultySlug && !form.institute) {
      setError('Please select either a Faculty or an Institute.');
      return;
    }
    // Validate required fields
    for (const field of requiredFields) {
      if (!form[field.name] || (field.name === 'poster' && !form.poster)) {
        setError(`Please fill the required field: ${field.label}`);
        return;
      }
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (form.facultySlug) formData.append('facultySlug', form.facultySlug);
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
      // Add modes and durations as comma-separated strings
      formData.append('modes', modesText);
      formData.append('durations', durationsText);
      const res = await fetch(`${API_URL}/api/admin/courses`, {
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

  // Open edit modal
  const openEditModal = (facultySlug, idx) => {
    const facultyExists = allFaculties.some(f => f.slug === facultySlug);
    if (!facultyExists) {
      alert('Faculty not found. This course cannot be edited.');
      return;
    }
    setForm(f => ({ ...f, facultySlug }));
    setEditCourseIdx(idx);
    setEditCourseData({ ...courses[idx] });
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
    }
  };
  // Submit edit
  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const formData = new FormData();
      Object.entries(editCourseData).forEach(([k, v]) => {
        if (k !== 'posterUrl') formData.append(k, v);
      });
      if (editPoster) formData.append('poster', editPoster);
      const res = await fetch(`${API_URL}/api/admin/courses/${form.facultySlug}/${editCourseIdx}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCourses(form.facultySlug);
        setEditModalOpen(false);
      } else {
        setEditError(data.error || 'Failed to update course');
      }
    } catch {
      setEditError('Server error');
    }
    setEditLoading(false);
  };
  // Delete course
  const handleDeleteCourse = async (facultySlug, idx) => {
    const facultyExists = faculties.some(f => f.slug === facultySlug);
    if (!facultyExists) {
      alert('Faculty not found. This course cannot be deleted.');
      return;
    }
    if (!window.confirm('Delete this course?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/courses/${facultySlug}/${idx}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCourses(facultySlug);
      } else {
        alert(data.error || 'Failed to delete course');
      }
    } catch {
      alert('Server error');
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
    const existingDetails = getFacultyDetails(faculty.id);
    console.log('📋 Existing details for faculty ID', faculty.id, ':', existingDetails);
    setFacultyUpdateData({
      bio: existingDetails?.bio || '',
      teaches: existingDetails?.teaches || []
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

    const success = updateFacultyDetails(selectedFaculty.id, {
      bio: facultyUpdateData.bio.trim(),
      teaches: facultyUpdateData.teaches
    });

    if (success) {
      setFacultyUpdateStatus(`Faculty details updated successfully for ${selectedFaculty.name}!`);
      
      // Refresh the hardcoded faculties list
      const faculties = getAllFaculties();
      const facultiesWithUpdates = getAllFacultiesWithUpdates(faculties);
      setHardcodedFaculties(facultiesWithUpdates);
      
      // Trigger a custom event to notify other components
      console.log('🔔 Dispatching facultyUpdated event for faculty ID:', selectedFaculty.id);
      window.dispatchEvent(new CustomEvent('facultyUpdated', { 
        detail: { facultyId: selectedFaculty.id, updates: facultyUpdateData } 
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
  const openEditFacultyModal = (fac) => {
    setEditFacultyData({ ...fac });
    setEditFacultySlug(fac.slug);
    setEditFacultyImage(null);
    setEditFacultyImagePreview(null);
    setEditFacultyError('');
    setEditFacultyModalOpen(true);
  };
  // Handle faculty edit change
  const handleEditFacultyChange = e => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image') {
      setEditFacultyImage(files[0]);
      setEditFacultyImagePreview(URL.createObjectURL(files[0]));
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
      Object.entries(editFacultyData).forEach(([k, v]) => {
        if (k === 'teaches') {
          v.forEach(teach => {
            formData.append('teaches[]', teach);
          });
        } else if (k !== 'image' && k !== 'slug') {
          formData.append(k, v);
        }
      });
      if (editFacultyImage) formData.append('image', editFacultyImage);
      const res = await fetch(`${API_URL}/api/admin/faculty/${editFacultySlug}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh faculties list after edit
        fetch(`${API_URL}/api/faculties`).then(res => res.json()).then(data => setFaculties(data.faculties || []));
        setEditFacultyModalOpen(false);
      } else {
        setEditFacultyError(data.error || 'Failed to update faculty');
      }
    } catch {
      setEditFacultyError('Server error');
    }
    setEditFacultyLoading(false);
  };
  // Delete faculty
  const handleDeleteFaculty = async (slug) => {
    if (!window.confirm('Delete this faculty?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/faculty/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh faculties list after delete
        fetch(`${API_URL}/api/faculties`).then(res => res.json()).then(data => setFaculties(data.faculties || []));
      } else {
        alert(data.error || 'Failed to delete faculty');
      }
    } catch {
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
      const res = await fetch(`${API_URL}/api/admin/institutes/${editInstituteId}`, {
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
      const res = await fetch(`${API_URL}/api/admin/institutes/${id}`, { method: 'DELETE' });
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
    
    // Fetch database faculties
    console.log('🔍 Starting to fetch faculties from:', `${API_URL}/api/faculties`);
    fetch(`${API_URL}/api/faculties`)
      .then(res => {
        console.log('📡 Faculty API response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📋 Raw faculty API data:', data);
        const dbFaculties = data.faculties || [];
        console.log('🎓 Database faculties found:', dbFaculties.length);
        setFaculties(dbFaculties);
        
        // Combine hardcoded faculties with database faculties
        const hardcoded = getAllFaculties();
        console.log('📚 Hardcoded faculties found:', hardcoded.length);
        
        const combinedFaculties = [
          // Add hardcoded faculties first (convert to needed format)
          ...hardcoded.map(faculty => ({
            slug: faculty.slug,
            firstName: faculty.name.replace(/^(CA|CMA|CS)\s+/, ''), // Remove prefix
            lastName: '',
            isHardcoded: true,
            fullName: faculty.name
          })),
          // Add database faculties
          ...dbFaculties.map(faculty => ({
            ...faculty,
            isHardcoded: false,
            fullName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
          }))
        ];
        
        console.log('🎯 Final combined faculties:', combinedFaculties.length, combinedFaculties);
        setAllFaculties(combinedFaculties);
      })
      .catch(err => {
        console.error('❌ Error fetching faculties:', err);
        // Fallback to hardcoded faculties only
        const hardcoded = getAllFaculties();
        console.log('🔄 Using hardcoded faculties as fallback:', hardcoded.length);
        const fallbackFaculties = hardcoded.map(faculty => ({
          slug: faculty.slug,
          firstName: faculty.name.replace(/^(CA|CMA|CS)\s+/, ''), // Remove prefix
          lastName: '',
          isHardcoded: true,
          fullName: faculty.name
        }));
        setAllFaculties(fallbackFaculties);
      });
  }, []);

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
    } catch {}
  };

  // Render the AdminDashboard component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col items-center">
      {/* Animated Button Row */}
      <div className="w-full max-w-3xl flex gap-8 mb-10">
        <button
          className={`${buttonBase} ${activePanel === 'course' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('course')}
        >
          <span className="mb-2 text-4xl">📚</span>
          Add Course
        </button>
        <button
          className={`${buttonBase} ${activePanel === 'faculty' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('faculty')}
        >
          <span className="mb-2 text-4xl">👨‍🏫</span>
          Add Faculty
        </button>
        <button
          className={`${buttonBase} ${activePanel === 'institute' ? buttonActive : buttonInactive}`}
          onClick={() => setActivePanel('institute')}
        >
          <span className="mb-2 text-4xl">🏫</span>
          Add Institute
        </button>
      </div>
      {/* Panel Switcher */}
      {activePanel === 'course' && (
        <div className="w-full max-w-6xl bg-white/95 rounded-2xl shadow-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Add New Course</h2>
          
          <form onSubmit={handleNewCourseSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Course Type Toggle */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Course Type</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="courseType"
                    checked={!courseForm.isStandalone}
                    onChange={() => setCourseForm(prev => ({ ...prev, isStandalone: false }))}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-700">Faculty-based Course (with Category/Subcategory/Paper)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="courseType"
                    checked={courseForm.isStandalone}
                    onChange={() => setCourseForm(prev => ({ ...prev, isStandalone: true }))}
                    className="mr-2 text-green-600"
                  />
                  <span className="text-gray-700">Standalone Course (General Course)</span>
                </label>
              </div>
            </div>

            {/* Step 1: Course Category for Standalone Courses */}
            {courseForm.isStandalone && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">Step 1: Course Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category" 
                      value={courseForm.category} 
                      onChange={handleCourseFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required={courseForm.isStandalone}
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required={courseForm.isStandalone}
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required={courseForm.isStandalone}
                    disabled={!courseForm.category || !courseForm.subcategory}
                  >
                    <option value="">Select Paper</option>
                    {getPapers(courseForm.category, courseForm.subcategory).map(paper => (
                      <option key={paper.id} value={paper.id}>
                        Paper {paper.id} - {paper.name}
                        {paper.group ? ` (${paper.group})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                </div>
              </div>
            )}

            {/* Course Information for Standalone Courses */}
            {courseForm.isStandalone && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Course Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={courseForm.title}
                      onChange={handleCourseFormChange}
                      placeholder="e.g., Advanced Excel Training, Digital Marketing Course"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                      required={courseForm.isStandalone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={courseForm.subject}
                      onChange={handleCourseFormChange}
                      placeholder="e.g., Excel, Digital Marketing, Programming"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Category Selection (Only for Faculty-based courses) */}
            {!courseForm.isStandalone && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Step 1: Course Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      name="category" 
                      value={courseForm.category} 
                      onChange={handleCourseFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required={!courseForm.isStandalone}
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    disabled={!courseForm.category || !courseForm.subcategory}
                  >
                    <option value="">Select Paper</option>
                    {getPapers(courseForm.category, courseForm.subcategory).map(paper => (
                      <option key={paper.id} value={paper.id}>
                        Paper {paper.id} - {paper.name}
                        {paper.group ? ` (${paper.group})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Step 2: Course Details */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Step 2: Course Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject field for faculty-based courses only (standalone already has it above) */}
                {!courseForm.isStandalone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject/Course Title *</label>
                    <input 
                      name="subject" 
                      value={courseForm.subject} 
                      onChange={handleCourseFormChange}
                      placeholder="e.g. Direct Tax Combo"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                      required 
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty {courseForm.isStandalone ? '(Optional)' : '*'}</label>
                  <select 
                    name="facultySlug" 
                    value={courseForm.facultySlug} 
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                    required={!courseForm.isStandalone}
                  >
                    <option value="">Select Faculty</option>
                    {allFaculties.map(fac => (
                      <option key={fac.slug} value={fac.slug}>
                        {fac.isHardcoded ? fac.fullName : (fac.firstName + (fac.lastName ? ' ' + fac.lastName : ''))}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institute {courseForm.isStandalone ? '(Optional)' : '*'}</label>
                  <select 
                    name="institute" 
                    value={courseForm.institute} 
                    onChange={handleCourseFormChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                    required={!courseForm.isStandalone}
                  >
                    <option value="">Select Institute</option>
                    {console.log('🏫 Institutes available for dropdown:', institutes)}
                    {institutes.length === 0 && (
                      <option disabled>No institutes available</option>
                    )}
                    {institutes.map(inst => (
                      <option key={inst.name || inst._id} value={inst.name}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Lectures</label>
                  <input 
                    name="noOfLecture" 
                    value={courseForm.noOfLecture} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. 65 Lectures"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Books</label>
                  <input 
                    name="books" 
                    value={courseForm.books} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. Main Book, Practice Manual"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Language</label>
                  <input 
                    name="videoLanguage" 
                    value={courseForm.videoLanguage} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. Hindi + English Mix"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Run On</label>
                  <input 
                    name="videoRunOn" 
                    value={courseForm.videoRunOn} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. Windows Laptop, Android Mobile"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doubt Solving</label>
                  <input 
                    name="doubtSolving" 
                    value={courseForm.doubtSolving} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. WhatsApp / Telegram"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Mail</label>
                  <input 
                    name="supportMail" 
                    value={courseForm.supportMail} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. support@academywale.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Call</label>
                  <input 
                    name="supportCall" 
                    value={courseForm.supportCall} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. 8910416751"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timing</label>
                  <input 
                    name="timing" 
                    value={courseForm.timing} 
                    onChange={handleCourseFormChange}
                    placeholder="e.g. 120 Hours"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    value={courseForm.description} 
                    onChange={handleCourseFormChange}
                    placeholder="Course description"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Poster *</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      name="poster" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCourseFormChange}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                      required 
                    />
                    {posterPreviewNew && (
                      <img src={posterPreviewNew} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-green-200" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Mode & Attempt Pricing */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Step 3: Mode & Attempt Pricing</h3>
              
              {courseForm.modeAttemptPricing.map((modeData, modeIndex) => (
                <div key={modeIndex} className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-purple-700">Mode {modeIndex + 1}</h4>
                    {courseForm.modeAttemptPricing.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeModeAttemptPricing(modeIndex)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove Mode
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode Name *</label>
                    <input 
                      value={modeData.mode} 
                      onChange={(e) => updateModeAttemptPricing(modeIndex, 'mode', e.target.value)}
                      placeholder="e.g. Live at Home With Hard Copy"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-md font-semibold text-purple-600">Attempts & Pricing:</h5>
                    {modeData.attempts.map((attempt, attemptIndex) => (
                      <div key={attemptIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-purple-50 rounded-lg">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Attempt *</label>
                          <input 
                            value={attempt.attempt} 
                            onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'attempt', e.target.value)}
                            placeholder="e.g. 1.5 Views & 12 Months"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Cost Price *</label>
                          <input 
                            type="number"
                            value={attempt.costPrice} 
                            onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'costPrice', parseInt(e.target.value) || 0)}
                            placeholder="15999"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Selling Price *</label>
                          <input 
                            type="number"
                            value={attempt.sellingPrice} 
                            onChange={(e) => updateAttemptPricing(modeIndex, attemptIndex, 'sellingPrice', parseInt(e.target.value) || 0)}
                            placeholder="13999"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          {modeData.attempts.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeAttemptFromPricing(modeIndex, attemptIndex)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      type="button"
                      onClick={() => addAttemptToPricing(modeIndex)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                    >
                      + Add Another Attempt
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                type="button"
                onClick={addModeAttemptPricing}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                + Add Another Mode
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all text-lg flex items-center justify-center gap-3 mx-auto"
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
          
          {/* Hardcoded Faculty Management Section */}
          <div className="w-full max-w-5xl bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-2xl p-8 border border-purple-300 mt-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">📚 Manage Faculty Details</h2>
            <p className="text-gray-600 mb-6">Update bio and teaching areas for faculty members. These details will be displayed on faculty profile pages.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Faculty Selection */}
              <div>
                <h3 className="text-lg font-bold text-purple-600 mb-4">Select Faculty Member</h3>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
                  {hardcodedFaculties.map(faculty => (
                    <div 
                      key={faculty.id} 
                      onClick={() => handleSelectFaculty(faculty)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                        selectedFaculty?.id === faculty.id 
                          ? 'border-purple-500 bg-purple-100 shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <img 
                        src={faculty.image} 
                        alt={faculty.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{faculty.name}</div>
                        <div className="text-xs text-gray-500">
                          {faculty.bio ? '✅ Bio Added' : '⚠️ No Bio'} • 
                          {faculty.teaches && faculty.teaches.length > 0 ? ` Teaches: ${faculty.teaches.join(', ')}` : ' No Teaching Areas'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Update Form */}
              <div>
                <h3 className="text-lg font-bold text-purple-600 mb-4">
                  {selectedFaculty ? `Update ${selectedFaculty.name}` : 'Select a Faculty Member'}
                </h3>
                
                {selectedFaculty ? (
                  <form onSubmit={handleFacultyUpdateSubmit} className="space-y-4">
                    {/* Selected Faculty Display */}
                    <div className="p-4 bg-white rounded-xl border border-purple-200 flex items-center gap-4">
                      <img 
                        src={selectedFaculty.image} 
                        alt={selectedFaculty.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
                      />
                      <div>
                        <div className="font-bold text-purple-700">{selectedFaculty.name}</div>
                        <div className="text-sm text-gray-500">Faculty Profile</div>
                      </div>
                    </div>

                    {/* Bio Field */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Faculty Bio</label>
                      <textarea
                        name="bio"
                        value={facultyUpdateData.bio}
                        onChange={handleFacultyUpdateChange}
                        placeholder="Enter detailed bio about the faculty member's experience, qualifications, and expertise..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                        rows={5}
                        required
                      />
                    </div>

                    {/* Teaching Areas */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-3">Teaching Areas</label>
                      <div className="grid grid-cols-2 gap-3">
                        {TEACHES_OPTIONS.map(option => (
                          <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              name="teaches"
                              value={option}
                              checked={facultyUpdateData.teaches.includes(option)}
                              onChange={handleFacultyUpdateChange}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="font-medium">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all text-lg"
                    >
                      💾 Update Faculty Details
                    </button>

                    {/* Status Messages */}
                    {facultyUpdateStatus && (
                      <div className="text-green-600 text-center font-semibold bg-green-50 p-3 rounded-lg border border-green-200">
                        ✅ {facultyUpdateStatus}
                      </div>
                    )}
                    {facultyUpdateError && (
                      <div className="text-red-600 text-center font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
                        ❌ {facultyUpdateError}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center text-gray-500 py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-4xl mb-4">👆</div>
                    <p className="font-medium">Click on a faculty member from the left to start editing their details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
          {/* Manage Testimonials Section */}
          <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-green-300 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Testimonials</h2>
            <form onSubmit={handleTestimonialAddSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
              <input name="name" value={testimonialAdd.name} onChange={handleTestimonialAddChange} placeholder="Name" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400" required />
              <select name="role" value={testimonialAdd.role} onChange={handleTestimonialAddChange} className="rounded-lg border border-gray-300 px-4 py-2 text-base">
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <textarea name="text" value={testimonialAdd.text} onChange={handleTestimonialAddChange} placeholder="What they say..." className="rounded-lg border border-gray-300 px-4 py-2 text-base" required />
              <input name="image" type="file" accept="image/*" onChange={handleTestimonialAddChange} className="rounded-lg border border-gray-300 px-3 py-2 text-base" />
              <small className="text-gray-500">Image is optional</small>
              {testimonialAdd.imagePreview && (
                <img src={testimonialAdd.imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-green-200 mt-2" />
              )}
              <button type="submit" className="bg-green-500 text-white font-bold py-2 rounded-xl shadow-lg hover:bg-green-600 transition-all text-lg flex items-center justify-center gap-2">Add Testimonial</button>
              {testimonialStatus && <div className="text-green-600 text-center font-semibold">{testimonialStatus}</div>}
              {testimonialError && <div className="text-red-600 text-center font-semibold">{testimonialError}</div>}
            </form>
            <h3 className="text-xl font-bold text-purple-700 mt-8 mb-4">All Testimonials</h3>
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map(t => (
                <div key={t._id} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4 border border-green-100">
                  <div className="flex items-center gap-4">
                    {t.image && <AdvancedImage cldImg={cld.image(t.image)} alt={t.name} className="w-16 h-16 object-cover rounded-xl border-2 border-green-200" />}
                    <div>
                      <div className="font-bold text-green-700">{t.name} <span className="text-xs text-gray-500">({t.role})</span></div>
                      <div className="text-gray-700 text-sm">{t.text}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
                    <button onClick={() => openEditTestimonialModal(t)} className="px-3 py-1 rounded bg-yellow-200 text-yellow-900 font-bold text-xs hover:bg-yellow-300 transition">✏️ Edit</button>
                    <button onClick={() => handleDeleteTestimonial(t._id)} className="px-3 py-1 rounded bg-red-200 text-red-900 font-bold text-xs hover:bg-red-300 transition">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Edit Testimonial Modal */}
            <Modal
              isOpen={editTestimonialModalOpen}
              onRequestClose={() => setEditTestimonialModalOpen(false)}
              style={modalStyles}
              ariaHideApp={false}
            >
              <h2 className="text-xl font-bold mb-4">Edit Testimonial</h2>
              <form onSubmit={handleEditTestimonialSubmit} className="flex flex-col gap-3">
                <input name="name" value={editTestimonialData.name || ''} onChange={handleEditTestimonialChange} placeholder="Name" className="rounded border px-3 py-2" required />
                <select name="role" value={editTestimonialData.role || 'teacher'} onChange={handleEditTestimonialChange} className="rounded border px-3 py-2">
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
                <textarea name="text" value={editTestimonialData.text || ''} onChange={handleEditTestimonialChange} placeholder="What they say..." className="rounded border px-3 py-2" required />
                <input name="image" type="file" accept="image/*" onChange={handleEditTestimonialChange} className="rounded border px-3 py-2" />
                {editTestimonialImagePreview && <img src={editTestimonialImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-green-200 mt-2" />}
                {editTestimonialError && <div className="text-red-600 text-center font-semibold">{editTestimonialError}</div>}
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setEditTestimonialModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-bold" disabled={editTestimonialLoading}>{editTestimonialLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-green-100 mb-8 mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Coupon Codes</h2>
        <form onSubmit={handleAddCoupon} className="flex flex-col sm:flex-row gap-4 mb-4">
          <input name="code" value={couponForm.code} onChange={handleCouponChange} placeholder="Coupon Code (e.g. OFF5)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <input name="discountPercent" value={couponForm.discountPercent} onChange={handleCouponChange} placeholder="Discount % (e.g. 5)" type="number" min="1" max="100" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400" required />
          <button type="submit" className="bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition-all">Add Coupon</button>
        </form>
        {couponSuccess && <div className="text-green-600 text-center font-semibold mb-2">{couponSuccess}</div>}
        {couponError && <div className="text-red-600 text-center font-semibold mb-2">{couponError}</div>}
        <div>
          <h3 className="text-lg font-bold mb-2">Active Coupons</h3>
          {coupons.length === 0 && <div className="text-gray-500">No coupons found.</div>}
          <ul className="divide-y divide-gray-200">
            {coupons.map(c => (
              <li key={c.code} className="flex items-center justify-between py-2">
                <span className="font-mono text-base">{c.code}</span>
                <span className="text-green-700 font-bold">{c.discountPercent}% off</span>
                <button onClick={() => handleDeleteCoupon(c.code)} className="text-red-500 hover:underline ml-4">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-bold text-purple-700 mb-4">All Courses by Faculty</h3>
        {loading && <div className="text-blue-500">Loading...</div>}
        {!loading && faculties.map(fac => (
          <div key={fac.slug} className="mb-8">
            <div className="font-bold text-lg text-[#17817a] mb-2">{fac.firstName} {fac.lastName}</div>
            {(!fac.courses || fac.courses.length === 0) ? (
              <div className="text-gray-400 text-sm mb-4">No courses for this faculty.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fac.courses.map((c, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center border border-[#20b2aa]">
                    {c.posterUrl && <img src={c.posterUrl.startsWith('http') ? c.posterUrl : `${API_URL}${c.posterUrl}`} alt="Poster" className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200" />}
                    <div>
                      <div className="font-bold text-[#17817a]">{c.subject}</div>
                      <div className="text-xs text-gray-500">Lectures: {c.noOfLecture} | Attempt: {c.duration}</div>
                      <div className="text-xs text-gray-500">Books: {c.books}</div>
                      <div className="text-xs text-gray-500">Language: {c.videoLanguage}</div>
                      <div className="text-xs text-gray-500">Validity: {c.validityStartFrom}</div>
                      <div className="text-xs text-gray-500">Mode: {c.mode} | Timing: {c.timing}</div>
                      <div className="text-xs text-gray-500">Type: {c.courseType}</div>
                      <div className="text-xs text-gray-500">Institute: {c.institute}</div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => openEditModal(fac.slug, idx)} className="px-3 py-1 rounded bg-yellow-200 text-yellow-900 font-bold text-xs hover:bg-yellow-300 transition">✏️ Edit</button>
                        <button onClick={() => handleDeleteCourse(fac.slug, idx)} className="px-3 py-1 rounded bg-red-200 text-red-900 font-bold text-xs hover:bg-red-300 transition">🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Edit Course Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        style={modalStyles}
        ariaHideApp={false}
      >
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
          <input name="subject" value={editCourseData.subject || ''} onChange={handleEditChange} placeholder="Subject" className="rounded border px-3 py-2" required />
          <input name="noOfLecture" value={editCourseData.noOfLecture || ''} onChange={handleEditChange} placeholder="No Of Lecture" className="rounded border px-3 py-2" required />
          <input name="books" value={editCourseData.books || ''} onChange={handleEditChange} placeholder="Books" className="rounded border px-3 py-2" />
          <input name="videoLanguage" value={editCourseData.videoLanguage || ''} onChange={handleEditChange} placeholder="Video Language" className="rounded border px-3 py-2" />
          <input name="validityStartFrom" value={editCourseData.validityStartFrom || ''} onChange={handleEditChange} placeholder="Validity" className="rounded border px-3 py-2" />
          <input name="videoRunOn" value={editCourseData.videoRunOn || ''} onChange={handleEditChange} placeholder="Video Run On" className="rounded border px-3 py-2" />
          <input name="doubtSolving" value={editCourseData.doubtSolving || ''} onChange={handleEditChange} placeholder="Doubt Solving" className="rounded border px-3 py-2" />
          <input name="supportMail" value={editCourseData.supportMail || ''} onChange={handleEditChange} placeholder="Support Mail" className="rounded border px-3 py-2" />
          <input name="supportCall" value={editCourseData.supportCall || ''} onChange={handleEditChange} placeholder="Support Call" className="rounded border px-3 py-2" />
          <input name="mode" value={editCourseData.mode || ''} onChange={handleEditChange} placeholder="Mode" className="rounded border px-3 py-2" />
          <input name="timing" value={editCourseData.timing || ''} onChange={handleEditChange} placeholder="Timing" className="rounded border px-3 py-2" />
          <input name="costPrice" value={editCourseData.costPrice || ''} onChange={handleEditChange} placeholder="Cost Price" type="number" className="rounded border px-3 py-2" />
          <input name="sellingPrice" value={editCourseData.sellingPrice || ''} onChange={handleEditChange} placeholder="Selling Price" type="number" className="rounded border px-3 py-2" />
          <select name="courseType" value={editCourseData.courseType || ''} onChange={handleEditChange} className="rounded border px-3 py-2" required>
            <option value="">Select Course Type</option>
            <option value="CA Foundation">CA Foundation</option>
            <option value="CMA Foundation">CMA Foundation</option>
            <option value="CA Inter">CA Inter</option>
            <option value="CMA Inter">CMA Inter</option>
            <option value="CA Final">CA Final</option>
            <option value="CMA Final">CMA Final</option>
          </select>
          <label className="font-semibold text-gray-700">Institute</label>
          <select
            name="institute"
            value={editCourseData.institute || ''}
            onChange={handleEditChange}
            className="rounded border px-3 py-2"
            required
          >
            <option value="">Select Institute</option>
            {institutes.map(inst => (
              <option key={inst.name} value={inst.name}>{inst.name}</option>
            ))}
          </select>
          <textarea name="description" value={editCourseData.description || ''} onChange={handleEditChange} placeholder="Description" className="rounded border px-3 py-2" />
          <input name="poster" type="file" accept="image/*" onChange={handleEditChange} className="rounded border px-3 py-2" />
          {editPosterPreview && <img src={editPosterPreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-200 mt-2" />}
          {editError && <div className="text-red-600 text-center font-semibold">{editError}</div>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white font-bold" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
