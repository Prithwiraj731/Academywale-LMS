import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import all faculty images
import vijaySarda from '../assets/facultyProfiles/VIJAY SARDA.png';
import aadityaJain from '../assets/facultyProfiles/AADITYA JAIN.png';
import avinashLala from '../assets/facultyProfiles/AVINASH LALA.png';
import bishnuKedia from '../assets/facultyProfiles/BISHNU KEDIA.png';
import mayankSaraf from '../assets/facultyProfiles/MAYANK SARAF.png';
import darshanKhare from '../assets/facultyProfiles/DARSHAN KHARE.png';
import divyaAgarwal from '../assets/facultyProfiles/DIVYA AGARWAL.png';
import santoshKumar from '../assets/facultyProfiles/SANTOSH KUMAR.png';
import ranjanPeriwal from '../assets/facultyProfiles/RANJAN PERIWAL.png';
import vishalBhattad from '../assets/facultyProfiles/VISHAL BHATTAD.png';
import shivangiAgarwal from '../assets/facultyProfiles/SHIVANGI AGARWAL.png';

const facultyList = [
  { name: 'VIJAY SARDA', img: vijaySarda },
  { name: 'AADITYA JAIN', img: aadityaJain },
  { name: 'AVINASH LALA', img: avinashLala },
  { name: 'BISHNU KEDIA', img: bishnuKedia },
  { name: 'MAYANK SARAF', img: mayankSaraf },
  { name: 'DARSHAN KHARE', img: darshanKhare },
  { name: 'DIVYA AGARWAL', img: divyaAgarwal },
  { name: 'SANTOSH KUMAR', img: santoshKumar },
  { name: 'RANJAN PERIWAL', img: ranjanPeriwal },
  { name: 'VISHAL BHATTAD', img: vishalBhattad },
  { name: 'SHIVANGI AGARWAL', img: shivangiAgarwal },
];

const placeholderCourses = [
  { title: 'Advanced Accounting', price: '₹2999', desc: 'Comprehensive course for CA/CMA students.' },
  { title: 'Taxation Mastery', price: '₹2499', desc: 'In-depth tax concepts and exam strategies.' },
  { title: 'Audit & Assurance', price: '₹1999', desc: 'All you need to ace Audit exams.' },
];

export default function FacultyDetailPage() {
  const { facultyName } = useParams();
  const navigate = useNavigate();
  const faculty = facultyList.find(f => f.name === facultyName);

  return (
    <div className="min-h-screen bg-white py-6 sm:py-10 px-2 sm:px-4">
      <div className="max-w-2xl sm:max-w-4xl mx-auto">
        <button
          className="mb-4 sm:mb-6 text-primary font-semibold hover:underline flex items-center text-sm sm:text-base"
          onClick={() => navigate('/faculties')}
        >
           Back to Faculties
        </button>
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-8 border border-gray-100">
          <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary bg-gray-50 flex-shrink-0 mb-4 md:mb-0">
            {faculty ? (
              <img src={faculty.img} alt={faculty.name} className="object-contain w-full h-full" style={{ background: '#fff' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{faculty ? faculty.name : 'Faculty Not Found'}</h2>
            <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">This is a placeholder for the faculty's bio and information. Add real details here for a more engaging profile.</p>
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary">Courses by {faculty ? faculty.name.split(' ')[0] : 'Faculty'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {placeholderCourses.map((course, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-gray-800 mb-1">{course.title}</div>
                      <div className="text-gray-600 text-xs sm:text-sm mb-2">{course.desc}</div>
                    </div>
                    <button className="mt-2 btn-primary w-full text-sm sm:text-base">Buy for {course.price}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 