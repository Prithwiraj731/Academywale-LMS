// Auto-update faculty data from provided JSON
import { updateFacultyDetails } from './facultyUpdates';
import { getAllFaculties } from './hardcodedFaculties';

const providedFacultyData = [
  {
    "Name": "CA Satish Jalan",
    "Teaches": "CA & CMA",
    "Bio": "CA Satish Jalan is a renowned faculty and founder of SJC Institute, Kolkata, with over 18 years of teaching experience in CA, CS, and CMA courses. An All India Rank holder in both CA and CS exams, and a CIMA (UK) topper, he specializes in Strategic Cost Management (SCMPE), Financial Management, and Cost Accounting. Known for his deep conceptual clarity, real-world examples, and student-friendly teaching style, he has mentored over 80,000 students and produced 400+ All India Rankers. His courses are available in online, pendrive, and Google Drive formats, backed by structured notes, test series, and dedicated student support through platforms like YouTube, Telegram, and his official website, sjcinstitute.com."
  },
  {
    "Name": "CA Ranjan Periwal",
    "Teaches": "CA & CMA",
    "Bio": "CA Ranjan Periwal is a highly acclaimed faculty for Costing and Financial Management for CA, CS, and CMA courses. 🏅 AIR Holder in CA & CS exams (Top 20 ranks in all stages of both). 🎓 Gold Medalist in B.Com (Hons.) from St. Xavier's College, Kolkata. 💼 Worked at PwC, ITC, and Ernst & Young (EY); has rich corporate & consulting experience. 📚 Founder of Ranjan Periwal Classes – known for conceptual clarity, exam-oriented teaching, and high student results. 🖥️ Offers video lectures in Hindi-English mix with mock tests, printed notes, and full support. 💯 Many students score AIRs & 100/100 under his guidance."
  },
  {
    "Name": "CA Vishal Bhattad",
    "Teaches": "CA & CMA",
    "Bio": "- Founder, Director and the Face of VSmart Academy. - Teaching since 2005 - Top faculty of India for Indirect Taxes, GST and related subjects. - Taught 1,00,000+ students till date. Famous as \"IDT Guru\" among CA, CS, CMA students and the professional fraternity. - Various Tax Commissioners refer to his batches in their professional trainings \"\"Sir started his teaching journey with one of the top coaching institute. After detailed discussion with Mr. Rajesh Rakesh on the future expansion of classes, Sir engraved the founding stone of VSmart in 2008 with face-to-face classes. With time, Sir has built the best team of educators to provide the best quality coaching in CA, CS, CMA courses.\"\" - Plays an important role in - * Teaching * Faculty Co-ordination * Management of face-to-face classes at Pune office * Internal audit and accounting review * Company's internal structuring, policies and strategies"
  },
  {
    "Name": "CA Vijay Sarda",
    "Teaches": "CA & CMA",
    "Bio": "• Most Dynamic & Dedicated faculty.\n• Most preferred faculty for CA Inter & CA Final.\n• With unique teaching technique make concepts easy and understandable along with summarized charts & Regular revision • Vijay Sir's life story has motivated lakhs of students.\n• Provide interactive classes & colour notes, charts, questionnaire. • Teaching experience 10+ years & visiting faculty in various prominent institutions • Taught more than 1,00,000 students [10,000+ students for AY 21-22] • Member of ICAI & qualified company secretary.\n• Author of over 8 books on taxation and international taxation • Tax consultant of big export/import companies.\n• He is always available for Advice, related to CA course and beyond the course."
  },
  {
    "Name": "CS Arjun Chhabra",
    "Teaches": "CA & CMA",
    "Bio": "CS LLM Arjun Chhabra is a seasoned law faculty with qualifications including Company Secretary (CS), LLB, LLM, and B.com, known for his practical and concept-based teaching style in Corporate and Business Laws.\nWith over 7 years of experience, he teaches CA, CS, and CMA students across India, offering regular and fast-track batches in subjects like Company Law, Contract Act, and Economic Laws.\nHis classes are available in Hindi-English mix through various online platforms and are appreciated for their clarity and affordability, though some students mention his pace can be fast and notes may require supplementation."
  },
  {
    "Name": "CA Santosh Kumar",
    "Teaches": "CA & CMA",
    "Bio": "CA/CMA Santosh Kumar is a Qualified CA/CMA By Profession.\nHe Has Vast Experience Of Teaching Accounts To CA,CMA,CS, B.Com And Academic Students For Last 15 Years.\nHe Has Taught More Than 50,000 Students In His Career. He Has Vast Experience In Practical Working Of Accounting Standards.\nHe Is Also Associated With Many Companies For Providing Practical Training In Accounting Fields."
  },
  {
    "Name": "CA Divya Agarwal",
    "Teaches": "CA & CMA",
    "Bio": "CA CS Divya Agarwal is a highly regarded educator specializing in law and related subjects for Chartered Accountancy (CA), Company Secretary (CS), and Cost and Management Accountancy (CMA) courses.\nShe is known for her practical approach and is a rank holder at the CA final level.\nCA CS Divya Agarwal is associated with MEPL Classes, where she teaches subjects like Law, Operation Management , Strategic Management, and more."
  },
  {
    "Name": "CA Aaditya Jain",
    "Teaches": "CA & CMA",
    "Bio": "CA Aaditya Jain is well known amongst the students as Finance Guru, the Stock Market Guru with the motto of Learn More Earn More.\nAaditya Jain Sir is considered the best faculty for CA /CMA Final Advanced Financial Management (AFM) & Strategic Financial Management (SFM).\nHis video classes are the best AFM & SFM classes for CA/CMA Final in India and are available for delivery in Pen Drive and Google Drive.\nHe is a qualified CA, MBA(FINANCE), NCFM, B.COM, M.COM. Currently teaching CA, CMA Final & CA, CMA Inter students All Over India.\nHaving vast experience of teaching CA, CMA Inter FM, CA Final AFM, CMA Final SFM faculty at New Delhi for the last 20 years and also a visiting faculty of ICAI.\nHis classes are a perfect blend of Concepts and Practical knowledge.\nHis classes are not only exam-oriented but job-oriented as well, as he helps the students to explore various career opportunities during the batch.\nHis results have been consistently the best all over the country. He is the best Finance faculty.\nHis teaching is based on the concept of Learn More Earn More."
  },
  {
    "Name": "CA Avinash Sancheti",
    "Teaches": "CA & CMA",
    "Bio": "CA CS Avinash Sancheti is a top-ranking professional and renowned faculty, known for his expertise in Accounting and Financial Reporting for CA, CS, and CMA courses.\nHe is the Co-Founder of Navin Classes and has an exceptional academic record, including AIR 1 in CS Executive, AIR 3 in CA Final, and a perfect 100 in CA Inter Accounts.\nWith a teaching style that simplifies complex concepts and a focus on exam-oriented learning, he has mentored thousands of students and produced numerous rank-holders and exemptions across India."
  },
  {
    "Name": "CA Bishnu kedia",
    "Teaches": "CA & CMA",
    "Bio": "CA Bishnu Kedia is an eminent faculty of Accounting and Financial Reporting and has over 6 years of teaching experience to all India students across all levels of various courses.\nHe has more than 4 years of experience in Assurance Practice with Big Four firms KPMG and PWC wherein he was actively engaged in auditing the financial statements of companies from various industries complying with Accounting Standards / Ind-AS.\nBishnu Kedia Sir is a first-class commerce graduate from Calcutta University.\nHis explanation of the concepts with practical and real-life examples makes his classes very interesting.\nHis classes are high on energy and helps students in preparing during the class itself requiring minimum revision time.\nCurrently, Bishnu Sir is providing best quality comprehensive classes for the following courses: 1.CMA Final – Corporate Financial Reporting (CFR) 2.CMA Inter – Financial Accounting 3.CMA Inter – Corporate Accounting and Auditing 4.CA Inter – Accounting These classes are provided in Live at Home Mode, Google Drive (GD) Mode and Pen Drive (PD) Mode.\nClasses can be played on Windows Laptop / Desktop or on Android Device.\nThese classes are provided with best-in-class features some of which includes: a.\nBackup of Live Classes are uploaded on the same day. b. Recorded Classes comes with Unlimited Views. c.\nValidity till Exam month. d. User friendly application. e. Support from the team within 24 hours."
  },
  {
    "Name": "CA Gaurav Kabra",
    "Teaches": "CA & CMA",
    "Bio": "CA Gourav Kabra is a critically acclaimed Chartered Accountant and CFA charterholder from St. Xavier's College, Kolkata, widely known for his expertise in Cost Accounting, Financial Management, and Strategic Financial Management (SFM), particularly tailored for CMA and CA aspirants.\nWith over 7+ years of teaching experience and exposure to more than 15,000 students worldwide via platforms like Edutors and Lecturewala, he brings a real-world perspective to the classroom using practical examples and simplified explanations of complex topics.\nHis online courses—ranging from ~120 hours for Cost Accounting to ~150 hours for FM & Management Accounting and ~100‑125 hours for Final SFM—are delivered in a bilingual Hindi‑English mix, include hard copy study materials, and come with unlimited views (or long validity periods), along with doubt-solving support via Telegram or email."
  },
  {
    "Name": "CA Shivangi Agarwal",
    "Teaches": "CA & CMA",
    "Bio": "CA Shivangi Agarwal is a qualified Chartered Accountant who cleared CA in her first attempt at just 21, celebrated for her academic excellence and becoming a sought-after law faculty for CA and CMA aspirants.\nWith over a decade of experience teaching Business Laws & Ethics (CMA Inter), Corporate & Economic Laws (CMA Final), and CA Inter/Foundation law papers, she delivers full-English or Hindi-English mixed lectures.\nHer teaching style features simple, real-life examples and chart-based presentations that many students find revision-friendly."
  },
  {
    "Name": "CA Yashwant Mangal",
    "Teaches": "CA & CMA",
    "Bio": "CA Yashwant Mangal is a highly respected Chartered Accountant and Company Secretary known across India for his expertise in Indirect Tax Laws (GST and Customs) for CA, CMA, and CS students.\nWith over a decade of teaching experience, he is the author of the well-regarded Conceptual Learning on Indirect Tax Laws (now 22nd–26th editions) and offers both regular (≈140–150 hours) and fast‑track (≈90–120 hours) batches in Hindi‑English, supported by extensive study material (main book, questionnaire & MCQs, summary, chart book) that cover all syllabus updates through October 2024–May 2025.  He has taught tens of thousands of students nationwide, and his teaching style is praised for clarity, conciseness, and practical examples—though some students note that he does not annotate study material during lectures and may require revisiting content post-class.\nThroughout student forums, Yashwant Mangal is frequently recommended for IDT preparation and fast‑track revision, with many reporting high scores and exam success based on his lectures and books"
  },
  {
    "Name": "CA Mayank Saraf",
    "Teaches": "CA & CMA",
    "Bio": "CA Mayank Saraf is a standout Chartered Accountant and CFA professional known for his exceptional academic achievements—AIR 10 in CA Inter, AIR 47 in CA Final, CFA cleared on first attempt, and gold medalist graduate from St. Xavier's College in Finance edugyan.org +7 in.linkedin.com +7 abhimanyyuagarrwal.com +7 .\nHe brings practical exposure from roles at KPMG, Futures First, and VT Capital, which enriches his teaching of subjects like Strategic Management, Financial Management, Law, and CMA papers abhimanyyuagarrwal.com +1 abhimanyyuagarrwal.com +1 .\nHis interactive, exam‑focused pedagogy combines conceptual clarity, real‑world case discussions, structured study plans, mock tests, and customized study material.\nFavoured by students across platforms like Lecturewala, Zeroinfy, Edugyan, and Ranjan Periwal Classes, he has earned a reputation for clarity, strong doubt support, and high pass‑rates in CA/CMA exams."
  },
  {
    "Name": "CA Avinash Lala",
    "Teaches": "CA & CMA",
    "Bio": "CA Avinash Lala is a seasoned educator and Chartered Accountant with over 11 years of teaching experience, specializing in subjects like Financial Accounting, Corporate Accounting, and Corporate Financial Reporting for CA and CMA students.\nKnown for his clear teaching style, handwritten notes, and exam-focused approach, he offers Hindi-English mixed lectures with flexible viewing options through Google Drive and mobile apps.\nHis courses are popular for their comprehensive ICMAI syllabus coverage, frequent mock tests, and reliable student support via WhatsApp and Zoom."
  },
  {
    "Name": "CA Nikunj Goenka",
    "Teaches": "CA & CMA",
    "Bio": "CA Nikunj Goenka is a Chartered Accountant and a tax mentor who specializes in teaching taxation to students pursuing Chartered Accountancy (CA), Cost and Management Accountancy (CMA), and Company Secretary (CS) degrees.\nHe has over 13 years of experience in tax management and planning, having worked with firms like DB Desai and Ernst & Young.\nNikunj Goenka is known for his engaging and clear teaching style, which helps students grasp complex tax concepts according to Nikunj Goenka Classes."
  },
  {
    "Name": "CMA Sumit Rastogi",
    "Teaches": "CMA",
    "Bio": "CMA Sumit Rastogi is a qualified CMA and B.Com (Hons.) graduate from Delhi University who topped India in Advanced Financial Management at the CMA Final level.\nWith over a decade of teaching experience, he is known for teaching Cost Accounting, Financial Management & Business Data Analytics (FMBDA), Management Accounting (MA), and Operations Management & Strategic Management (OMSM), largely for CMA Inter (2022 syllabus) students.\nHis style emphasizes flowcharts, shortcuts, and concept clarity through structured video lectures—many students have praised his unique problem‑solving techniques and practical teaching approach."
  },
  {
    "Name": "CMA Akshay sen",
    "Teaches": "CMA",
    "Bio": "CMA Akshay Sen is a CMA professional and experienced educator known for his exam-aligned, CMA-specific courses in subjects such as Direct & Indirect Tax, OMSM, and Cost & Management Audit, offered through generous video hours (160–170 hrs), bilingual instruction, unlimited access, and supportive doubt-resolution channels.\nHe's frequently recommended by students on CMA forums—especially for taxation papers—to those preparing for upcoming CMA Inter and Final attempts, though demo lectures are strongly suggested to ensure the style suits individual learning preferences."
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
      const success = updateFacultyDetails(matchingFaculty.id, {
        bio: providedFaculty.Bio,
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
