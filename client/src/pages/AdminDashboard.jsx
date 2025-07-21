import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

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

  // Faculty Bio Panel State (for updating existing faculty)
  const [facultyInfo, setFacultyInfo] = useState({
    firstName: '',
    bio: '',
    teaches: [],
    lastName: '',
  });
  const [facultyInfoStatus, setFacultyInfoStatus] = useState('');
  const [facultyInfoError, setFacultyInfoError] = useState('');

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
    setFacultyAddStatus('');
    setFacultyAddError('');
    if (!facultyAdd.firstName.trim()) {
      setFacultyAddError('Faculty name is required.');
      return;
    }
    if (!facultyAdd.bio.trim()) {
      setFacultyAddError('Faculty bio is required.');
      return;
    }
    if (!facultyAdd.image) {
      setFacultyAddError('Faculty image is required.');
      return;
    }
    const formData = new FormData();
    // Send full name as firstName, leave lastName blank
    formData.append('firstName', facultyAdd.firstName.trim());
    formData.append('lastName', '');
    formData.append('bio', facultyAdd.bio.trim());
    formData.append('teaches', JSON.stringify(facultyAdd.teaches));
    formData.append('image', facultyAdd.image);
    try {
      const res = await fetch(`${API_URL}/api/admin/faculty`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setFacultyAddStatus('Faculty added!');
        setFacultyAdd({ firstName: '', lastName: '', bio: '', teaches: [], image: null, imagePreview: null });
        setTimeout(() => setFacultyAddStatus(''), 2000);
      } else {
        setFacultyAddError(data.error || 'Failed to add faculty');
      }
    } catch (err) {
      setFacultyAddError('Server error');
    }
  };

  // Add state to store faculties
  const [faculties, setFaculties] = useState([]);

  // Fetch faculties on mount
  useEffect(() => {
    fetch(`${API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => setFaculties(data.faculties || []));
  }, []);

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
    { name: 'facultySlug', label: 'Faculty' },
    { name: 'subject', label: 'Subject' },
    { name: 'noOfLecture', label: 'No Of Lecture' },
    { name: 'poster', label: 'Poster' },
    { name: 'courseType', label: 'Course Type' },
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

  // Fetch courses for a faculty
  const fetchCourses = async (facultyName) => {
    const firstName = facultyName.split(' ')[0].toUpperCase();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/courses/${firstName}`);
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        setFacultyQueried(firstName);
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

  // Course Form: allow text input for modes and durations
  const [modesText, setModesText] = useState('Recorded,Live,Pendrive');
  const [durationsText, setDurationsText] = useState('AUG 25,JUL 26,SEP 25');

  // In handleSubmit, append modes and durations arrays
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    // Extra validation for facultyName
    if (!form.facultySlug) {
      setError('Please select a valid Faculty.');
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
      formData.append('facultySlug', form.facultySlug);
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
        fetchCourses(form.facultySlug); // Use facultySlug to fetch courses
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
    const facultyExists = faculties.some(f => f.slug === facultySlug);
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
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditFacultyImage(files[0]);
      setEditFacultyImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'teaches') {
      setEditFacultyData(f => ({ ...f, teaches: [value] }));
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
        if (k !== 'image' && k !== 'slug') formData.append(k, v);
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

  // Add state for institutes
  const [institutes, setInstitutes] = useState([]);
  // Fetch institutes on mount
  useEffect(() => {
    fetch(`${API_URL}/api/institutes`)
      .then(res => res.json())
      .then(data => setInstitutes(data.institutes || []));
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
    formData.append('role', testimonialAdd.role);
    formData.append('text', testimonialAdd.text.trim());
    if (testimonialAdd.image) formData.append('image', testimonialAdd.image);
    try {
      const res = await fetch(`${API_URL}/api/testimonials`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonialStatus('Testimonial added!');
        setTestimonialAdd({ name: '', role: 'teacher', text: '', image: null, imagePreview: null });
        setTimeout(() => setTestimonialStatus(''), 2000);
        fetch(`${API_URL}/api/testimonials`).then(res => res.json()).then(data => setTestimonials(data.testimonials || []));
      } else {
        setTestimonialError(data.error || 'Failed to add testimonial');
      }
    } catch {
      setTestimonialError('Server error');
    }
  };
  const openEditTestimonialModal = (t) => {
    setEditTestimonialData(t);
    setEditTestimonialImagePreview(t.imageUrl || null);
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
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Course</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Faculty Dropdown */}
              <select name="facultySlug" value={form.facultySlug || ''} onChange={handleChange} required className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select Faculty</option>
                {faculties.map(fac => (
                  <option key={fac.slug} value={fac.slug}>{fac.firstName + (fac.lastName ? ' ' + fac.lastName : '')}</option>
                ))}
              </select>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (e.g. Direct Tax)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input name="noOfLecture" value={form.noOfLecture} onChange={handleChange} placeholder="No Of Lecture (e.g. DT 65)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              {/* Modes text input with preview dropdown */}
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-gray-700">Modes (comma-separated, shown as dropdown to users)</label>
                <input 
                  type="text" 
                  value={modesText} 
                  onChange={e => setModesText(e.target.value)} 
                  placeholder="e.g. Recorded,Live,Pendrive" 
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select className="rounded-lg border border-blue-200 px-4 py-2 text-base bg-blue-50 mt-1" disabled>
                  {modesText.split(',').map((m, i) => m.trim() && <option key={i}>{m.trim()}</option>)}
                </select>
              </div>
              {/* Durations text input with preview dropdown */}
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-gray-700">Attempts (comma-separated, shown as dropdown to users)</label>
                <input 
                  type="text" 
                  value={durationsText} 
                  onChange={e => setDurationsText(e.target.value)} 
                  placeholder="e.g. AUG 25,JUL 26,SEP 25" 
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select className="rounded-lg border border-blue-200 px-4 py-2 text-base bg-blue-50 mt-1" disabled>
                  {durationsText.split(',').map((d, i) => d.trim() && <option key={i}>{d.trim()}</option>)}
                </select>
              </div>
              {/* Validity text input with preview dropdown */}
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-gray-700">Validity (comma-separated, shown as dropdown to users)</label>
                <input 
                  type="text" 
                  name="validityStartFrom"
                  value={form.validityStartFrom} 
                  onChange={handleChange} 
                  placeholder="e.g. 6 Months,12 Months,18 Months" 
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select className="rounded-lg border border-blue-200 px-4 py-2 text-base bg-blue-50 mt-1" disabled>
                  {form.validityStartFrom.split(',').map((v, i) => v.trim() && <option key={i}>{v.trim()}</option>)}
                </select>
              </div>
              {/* Books text input with preview dropdown */}
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-gray-700">Books (comma-separated, shown as dropdown to users)</label>
                <input 
                  type="text" 
                  name="books"
                  value={form.books} 
                  onChange={handleChange} 
                  placeholder="e.g. Main Book,Workbook,Color Notes" 
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select className="rounded-lg border border-blue-200 px-4 py-2 text-base bg-blue-50 mt-1" disabled>
                  {form.books.split(',').map((b, i) => b.trim() && <option key={i}>{b.trim()}</option>)}
                </select>
              </div>
              <input name="videoLanguage" value={form.videoLanguage} onChange={handleChange} placeholder="Video Language (e.g. Hindi & English Mix)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="videoRunOn" value={form.videoRunOn} onChange={handleChange} placeholder="Video Run On (e.g. Windows Laptop / Android Mobile)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="doubtSolving" value={form.doubtSolving} onChange={handleChange} placeholder="Doubt Solving (e.g. WhatsApp)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="supportMail" value={form.supportMail} onChange={handleChange} placeholder="Support Mail (e.g. contact@facultywala.com)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="supportCall" value={form.supportCall} onChange={handleChange} placeholder="Support Call (e.g. 8910416751)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input name="costPrice" value={form.costPrice} onChange={handleChange} placeholder="Cost Price (e.g. 8250)" type="number" min="0" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400" required />
              <input name="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="Selling Price (e.g. 6999)" type="number" min="0" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400" required />
              <select name="courseType" value={form.courseType} onChange={handleChange} className="rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" required>
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
                value={form.institute || ''}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Institute</option>
                {institutes.map(inst => (
                  <option key={inst.name} value={inst.name}>{inst.name}</option>
                ))}
              </select>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Course Description" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400" rows={3} />
            <input name="timing" value={form.timing} onChange={handleChange} placeholder="Timing (e.g. 120 Hours)" className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <div className="flex gap-4 items-center">
              <input name="poster" type="file" accept="image/*" onChange={handleChange} className="rounded-lg border border-gray-300 px-3 py-2 text-base" required title="Upload a course poster image" />
              {posterPreview && <img src={posterPreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-blue-200" />}
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2" disabled={loading}>
              {loading && <span className="loader border-2 border-t-2 border-blue-500 border-t-transparent rounded-full w-5 h-5 animate-spin"></span>}
              {loading ? 'Saving...' : 'Add Course'}
            </button>
            {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
            {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
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
          <h3 className="text-xl font-bold text-purple-700 mt-8 mb-4">All Faculties</h3>
          <div className="grid grid-cols-1 gap-4">
            {faculties.map(fac => (
              <div key={fac.slug} className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4 border border-blue-100">
                <div className="flex items-center gap-4">
                  {fac.imageUrl && <img src={fac.imageUrl} alt={fac.firstName} className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200" />}
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
              <select name="teaches" value={editFacultyData.teaches && editFacultyData.teaches[0] || ''} onChange={handleEditFacultyChange} className="rounded border px-3 py-2">
                <option value="">Teaches</option>
                <option value="CA">CA</option>
                <option value="CMA">CMA</option>
              </select>
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
                    {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="w-16 h-16 object-cover rounded-xl border-2 border-green-200" />}
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
                    {c.posterUrl && <img src={`${API_URL}${c.posterUrl}`} alt="Poster" className="w-20 h-20 object-cover rounded-lg border-2 border-purple-200" />}
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