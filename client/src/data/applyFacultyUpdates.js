// Auto-update faculty data from provided JSON
import { updateFacultyDetails } from './facultyUpdates';
import { getAllFaculties } from './hardcodedFaculties';

const providedFacultyData = [
  {
    "Name": "CA Satish Jalan",
    "Teaches": "CA & CMA",
    "Bio": [
      "Renowned faculty and founder of SJC Institute, Kolkata.",
      "Over 18 years of teaching experience in CA, CS, and CMA courses.",
      "An All India Rank holder in both CA and CS exams and a CIMA (UK) topper.",
      "Specializes in Strategic Cost Management (SCMPE), Financial Management, and Cost Accounting.",
      "Known for deep conceptual clarity, real-world examples, and a student-friendly teaching style.",
      "Mentored over 80,000 students and produced 400+ All India Rankers.",
      "Courses are available in online, pendrive, and Google Drive formats, with full student support."
    ]
  },
  {
    "Name": "CA Ranjan Periwal",
    "Teaches": "CA & CMA",
    "Bio": [
      "Highly acclaimed faculty for Costing and Financial Management.",
      "All India Rank Holder in CA & CS exams (Top 20 ranks in all stages).",
      "Gold Medalist in B.Com (Hons.) from St. Xavier's College, Kolkata.",
      "Has rich corporate and consulting experience, having worked at PwC, ITC, and Ernst & Young (EY).",
      "Founder of Ranjan Periwal Classes, known for conceptual clarity and high student results.",
      "Offers video lectures in a Hindi-English mix with mock tests and printed notes."
    ]
  },
  {
    "Name": "CA Vishal Bhattad",
    "Teaches": "CA & CMA",
    "Bio": [
      "Founder, Director, and the Face of VSmart Academy.",
      "Teaching since 2005; known as the 'IDT Guru' among students.",
      "India's top faculty for Indirect Taxes (GST) and related subjects.",
      "Taught over 100,000 students to date.",
      "Plays a key role in teaching, faculty coordination, and management at VSmart.",
      "Involved in the academy's internal structuring, policies, and strategies."
    ]
  },
  {
    "Name": "CA Vijay Sarda",
    "Teaches": "CA & CMA",
    "Bio": [
      "A dynamic and dedicated faculty, most preferred for CA Inter & CA Final.",
      "Uses unique teaching techniques with summarized charts and regular revisions.",
      "Has a life story that has motivated lakhs of students.",
      "Provides interactive classes with colored notes, charts, and questionnaires.",
      "Has over 10 years of teaching experience and is a visiting faculty in various prominent institutions.",
      "Taught more than 100,000 students.",
      "Member of ICAI, a qualified company secretary, and author of over 8 books on taxation.",
      "Acts as a tax consultant for large export/import companies."
    ]
  },
  {
    "Name": "CS Arjun Chhabra",
    "Teaches": "CA & CMA",
    "Bio": [
      "A seasoned law faculty with qualifications including CS, LLB, LLM, and B.Com.",
      "Known for a practical and concept-based teaching style in Corporate and Business Laws.",
      "Has over 7 years of experience teaching CA, CS, and CMA students.",
      "Offers regular and fast-track batches in subjects like Company Law and Contract Act.",
      "Classes are available in a Hindi-English mix and are appreciated for clarity and affordability."
    ]
  },
  {
    "Name": "CA Santosh Kumar",
    "Teaches": "CA & CMA",
    "Bio": [
      "A qualified CA/CMA by profession.",
      "Has 15 years of experience teaching Accounts to CA, CMA, CS, and B.Com students.",
      "Taught more than 50,000 students in his career.",
      "Possesses vast experience in the practical working of Accounting Standards.",
      "Associated with many companies for providing practical training in accounting."
    ]
  },
  {
    "Name": "CA Divya Agarwal",
    "Teaches": "CA & CMA",
    "Bio": [
      "A highly regarded educator specializing in law and related subjects for CA, CS, and CMA courses.",
      "A rank holder at the CA final level, known for her practical approach.",
      "Associated with MEPL Classes.",
      "Teaches subjects like Law, Operation Management, and Strategic Management."
    ]
  },
  {
    "Name": "CA Aaditya Jain",
    "Teaches": "CA & CMA",
    "Bio": [
      "Known amongst students as the 'Finance Guru' and 'Stock Market Guru'.",
      "Considered the best faculty for CA/CMA Final Advanced Financial Management (AFM) & Strategic Financial Management (SFM).",
      "Qualified as a CA, MBA (FINANCE), NCFM, B.COM, M.COM.",
      "Has 20 years of teaching experience and is a visiting faculty of ICAI.",
      "His classes blend conceptual and practical, job-oriented knowledge.",
      "His motto is 'Learn More Earn More'."
    ]
  },
  {
    "Name": "CA Avinash Sancheti",
    "Teaches": "CA & CMA",
    "Bio": [
      "A top-ranking professional known for expertise in Accounting and Financial Reporting.",
      "Co-Founder of Navin Classes.",
      "Exceptional academic record: AIR 1 in CS Executive, AIR 3 in CA Final, and a perfect 100 in CA Inter Accounts.",
      "His teaching style simplifies complex concepts with a focus on exam-oriented learning.",
      "Mentored thousands of students, producing numerous rank-holders."
    ]
  },
  {
    "Name": "CA Bishnu kedia",
    "Teaches": "CA & CMA",
    "Bio": [
      "An eminent faculty of Accounting and Financial Reporting with over 6 years of teaching experience.",
      "Over 4 years of experience in Assurance Practice with Big Four firms (KPMG and PwC).",
      "A first-class commerce graduate from Calcutta University.",
      "His classes are high-energy and use practical, real-life examples.",
      "Provides comprehensive classes for CMA Final (CFR) and CA/CMA Inter (Accounting).",
      "Offers classes in Live, Google Drive, and Pen Drive modes with unlimited views."
    ]
  },
  {
    "Name": "CA Gaurav Kabra",
    "Teaches": "CA & CMA",
    "Bio": [
      "A critically acclaimed Chartered Accountant and CFA charterholder from St. Xavier's College, Kolkata.",
      "Expertise in Cost Accounting, Financial Management, and SFM for CMA and CA aspirants.",
      "Over 7 years of teaching experience, reaching more than 15,000 students worldwide.",
      "Brings a real-world perspective using practical examples.",
      "Courses are delivered in a bilingual Hindi-English mix with hard copy materials and doubt support."
    ]
  },
  {
    "Name": "CA Shivangi Agarwal",
    "Teaches": "CA & CMA",
    "Bio": [
      "A qualified Chartered Accountant who cleared CA in her first attempt at age 21.",
      "A sought-after law faculty for CA and CMA aspirants with over a decade of experience.",
      "Teaches Business Laws & Ethics, Corporate & Economic Laws, and other law papers.",
      "Delivers lectures in full-English or a Hindi-English mix.",
      "Her teaching style features simple, real-life examples and revision-friendly charts."
    ]
  },
  {
    "Name": "CA Yashwant Mangal",
    "Teaches": "CA & CMA",
    "Bio": [
      "A highly respected Chartered Accountant and Company Secretary.",
      "Known across India for his expertise in Indirect Tax Laws (GST and Customs).",
      "Over a decade of teaching experience.",
      "Author of the well-regarded 'Conceptual Learning on Indirect Tax Laws'.",
      "Offers regular and fast-track batches in Hindi-English with extensive study material.",
      "His teaching style is praised for clarity, conciseness, and practical examples."
    ]
  },
  {
    "Name": "CA Mayank Saraf",
    "Teaches": "CA & CMA",
    "Bio": [
      "A standout Chartered Accountant and CFA professional with exceptional academic achievements (AIR 10 in CA Inter, AIR 47 in CA Final).",
      "Brings practical exposure from roles at KPMG, Futures First, and VT Capital.",
      "Teaches subjects like Strategic Management, Financial Management, and Law.",
      "His pedagogy is interactive and exam-focused, combining conceptual clarity with real-world cases.",
      "Has a reputation for strong doubt support and high pass rates."
    ]
  },
  {
    "Name": "CA Avinash Lala",
    "Teaches": "CA & CMA",
    "Bio": [
      "A seasoned educator with over 11 years of teaching experience.",
      "Specializes in Financial Accounting, Corporate Accounting, and Corporate Financial Reporting.",
      "Known for his clear teaching style, handwritten notes, and exam-focused approach.",
      "Offers Hindi-English mixed lectures with flexible viewing options.",
      "Courses are popular for comprehensive syllabus coverage and reliable student support."
    ]
  },
  {
    "Name": "CA Nikunj Goenka",
    "Teaches": "CA & CMA",
    "Bio": [
      "A Chartered Accountant and tax mentor specializing in taxation for CA, CMA, and CS students.",
      "Has over 13 years of experience in tax management and planning, with a background at DB Desai and Ernst & Young.",
      "Known for an engaging and clear teaching style that helps students grasp complex tax concepts."
    ]
  },
  {
    "Name": "CMA Sumit Rastogi",
    "Teaches": "CMA",
    "Bio": [
      "A qualified CMA and B.Com (Hons.) graduate who topped India in Advanced Financial Management at the CMA Final level.",
      "Over a decade of teaching experience.",
      "Teaches Cost Accounting, Financial Management & Business Data Analytics (FMBDA), and more for CMA Inter.",
      "His style emphasizes flowcharts, shortcuts, and concept clarity.",
      "Praised for unique problem-solving techniques and a practical teaching approach."
    ]
  },
  {
    "Name": "CMA Akshay sen",
    "Teaches": "CMA",
    "Bio": [
      "A CMA professional and experienced educator.",
      "Known for exam-aligned, CMA-specific courses in subjects like Direct & Indirect Tax, OMSM, and Audit.",
      "Offers generous video hours, bilingual instruction, and unlimited access.",
      "Frequently recommended by students on CMA forums, especially for taxation papers."
    ]
  }
];

// Function to normalize names for matching
function normalizeName(name) {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

// Function to parse teaches field
function parseTeaches(teachesStr) {
  const teaches = [];
  if (teachesStr.includes('CA')) teaches.push('CA');
  if (teachesStr.includes('CMA')) teaches.push('CMA');
  return teaches;
}

// Function to match and update faculties
export function applyFacultyUpdatesFromJSON() {
  console.log('🚀 Starting faculty updates from JSON data...');
  
  const existingFaculties = getAllFaculties();
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFoundNames = [];
  
  providedFacultyData.forEach(providedFaculty => {
    const normalizedProvidedName = normalizeName(providedFaculty.Name);
    
    // Try to find matching faculty in our existing list
    const matchingFaculty = existingFaculties.find(existingFaculty => {
      const normalizedExistingName = normalizeName(existingFaculty.name);
      return normalizedExistingName === normalizedProvidedName;
    });
    
    if (matchingFaculty) {
      console.log(`✅ Found match: "${providedFaculty.Name}" -> "${matchingFaculty.name}"`);
      
      const teaches = parseTeaches(providedFaculty.Teaches);
      
      // Convert bullet points array to formatted string
      let bioText;
      if (Array.isArray(providedFaculty.Bio)) {
        bioText = providedFaculty.Bio.map(point => `• ${point}`).join('\n');
      } else {
        bioText = providedFaculty.Bio;
      }
      
      const success = updateFacultyDetails(matchingFaculty.id, {
        bio: bioText,
        teaches: teaches
      });
      
      if (success) {
        updatedCount++;
        console.log(`✅ Updated faculty ID ${matchingFaculty.id} (${matchingFaculty.name})`);
      } else {
        console.log(`❌ Failed to update faculty ID ${matchingFaculty.id} (${matchingFaculty.name})`);
      }
    } else {
      console.log(`❌ No match found for: "${providedFaculty.Name}"`);
      notFoundCount++;
      notFoundNames.push(providedFaculty.Name);
    }
  });
  
  // Dispatch event to refresh all pages
  window.dispatchEvent(new CustomEvent('facultyUpdated', { 
    detail: { bulkUpdate: true, updatedCount } 
  }));
  
  console.log('📊 Faculty Update Summary:');
  console.log(`✅ Successfully updated: ${updatedCount} faculties`);
  console.log(`❌ Not found in our list: ${notFoundCount} faculties`);
  if (notFoundNames.length > 0) {
    console.log('Names not found:', notFoundNames);
  }
  
  return {
    success: true,
    updatedCount,
    notFoundCount,
    notFoundNames
  };
}

// Auto-run the updates when this file loads
console.log('🔄 Auto-applying faculty updates from JSON...');
applyFacultyUpdatesFromJSON();
