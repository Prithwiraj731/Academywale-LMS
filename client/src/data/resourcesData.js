// AcademyWale Educational Resources & Learning Hub Dataset
// Curated comprehensive guides, study plans, subject notes, MCQs, and exam strategies for CA & CMA aspirants

export const resourceCategories = [
  { id: 'all', label: 'All Resources', icon: 'BookOpen' },
  { id: 'ca', label: 'CA Resources', icon: 'GraduationCap' },
  { id: 'cma', label: 'CMA Resources', icon: 'Award' },
  { id: 'study-guides', label: 'Study Guides', icon: 'FileText' },
  { id: 'exam-preparation', label: 'Exam Strategies', icon: 'Compass' },
  { id: 'notes', label: 'Revision Notes', icon: 'Bookmark' },
  { id: 'mcqs', label: 'MCQ Practice', icon: 'HelpCircle' },
  { id: 'exam-updates', label: 'Syllabus & Updates', icon: 'Bell' },
];

export const educationalArticles = [
  {
    id: 1,
    slug: 'ca-foundation-accounting-complete-preparation-strategy',
    category: 'ca',
    subCategory: 'study-guides',
    level: 'CA Foundation',
    paper: 'Paper 1: Accounting (ICAI New Scheme)',
    title: 'CA Foundation Accounting: Comprehensive Preparation Strategy, Working Notes & Curriculum Analysis',
    description: 'Master CA Foundation Paper 1 under the ICAI New Scheme. Explore module-wise academic focus areas, journal entry conventions, depreciation schedules, partnership accounts, and working note presentation for step marks.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '12 min read',
    featured: true,
    tags: ['CA Foundation', 'Accounting', 'Study Plan', 'Curriculum Analysis', 'Working Notes'],
    syllabusCoverage: [
      { module: 'Module 1: Theoretical Framework & Accounting Process', weightage: '15-20%', topics: ['Accounting Concepts, Principles & Conventions', 'Capital vs Revenue Expenditures', 'Contingent Assets & Contingent Liabilities', 'Accounting Standards Overview'] },
      { module: 'Module 2: Bank Reconciliation, Inventories & Depreciation', weightage: '20-25%', topics: ['BRS with Adjusted Cash Book', 'Inventory Valuation (AS 2 / FIFO & Weighted Average)', 'Depreciation (SLM, WDV, Change in Accounting Method)'] },
      { module: 'Module 3: Special Transactions & Bills of Exchange', weightage: '15-20%', topics: ['Bills of Exchange & Accommodation Bills', 'Consignment Accounting', 'Sale of Goods on Approval or Return Basis'] },
      { module: 'Module 4: Final Accounts of Sole Proprietors & NPO', weightage: '20-25%', topics: ['Financial Statements of Sole Proprietors with Adjustments', 'Receipts & Payments, Income & Expenditure, Balance Sheets for NPO'] },
      { module: 'Module 5: Partnership Accounts & Company Accounts', weightage: '20-25%', topics: ['Admission, Retirement, Death of Partner, Goodwill Accounting', 'Issue of Shares, Forfeiture, Re-issue, Debentures Basics'] },
    ],
    keyTakeaways: [
      'Focus substantial revision time on Partnership Accounts, NPO, and Final Accounts as they represent core practical areas in the curriculum.',
      'Always draw structured ledger rulings and provide explicit Working Notes—ICAI examiners award dedicated step marks for intermediate calculations.',
      'Solve previous examination papers, Revision Test Papers (RTPs), and Mock Test Papers (MTPs) published by the ICAI Board of Studies under timed 3-hour conditions.',
      'For Bank Reconciliation Statements, mastering the adjusted cash book technique simplifies multi-point overdraft reconciliations.'
    ],
    sections: [
      {
        heading: '1. Overview of the CA Foundation Paper 1 Pattern',
        content: `Under the ICAI New Scheme of Education and Training, Paper 1: Accounting is a 100-mark subjective, descriptive paper:
- Question 1 is compulsory (20 marks): It typically features 6 True/False statements requiring statutory or conceptual reasoning (12 marks: 6 items × 2 marks each) and two short descriptive or practical computational questions (4 marks each).
- Questions 2 to 6 (20 marks each): Candidates are required to attempt any 4 out of the 5 remaining questions.

To establish a strong foundation for an exemption (60+ marks), thorough understanding of the theoretical concepts in Module 1 of the ICAI Study Material is essential.`
      },
      {
        heading: '2. Core Curricular Modules Emphasized in Study Practice',
        content: `In the academic syllabus prescribed by ICAI, the following key modules form the foundation of practical problem-solving:
1. Partnership Accounts: Admission, Retirement cum Death, and treatment of Goodwill in accordance with applicable accounting principles.
2. Financial Statements of Non-Profit Organizations (NPO): Preparing the Income and Expenditure Account and Balance Sheet from given Receipts and Payments data with subscription adjustments.
3. Accounting for Special Transactions: Consignment transactions (distinguishing Normal vs. Abnormal losses) and Bills of Exchange (including Accommodation Bills).
4. Company Accounts: Accounting for share capital, pro-rata allotment, forfeiture of shares, and reissue entries.`
      },
      {
        heading: '3. Working Notes Presentation: Maximizing Step Marks',
        content: `ICAI marking schemes allocate dedicated marks for working notes and intermediate calculations. Common student errors include performing calculations in margins without formal documentation.
Recommended presentation standard:
- Primary Solution: Present the main Ledger Accounts, Balance Sheet, or Profit & Loss statement first.
- Working Notes (WN): Clearly title every supporting computation beneath the main solution (e.g., "Working Note 1: Calculation of Sacrificing Ratio", "Working Note 2: Allocation of Subscription Income").
- Reference: Direct the examiner to the specific Working Note number directly inside the primary ledger or financial statement line item.`
      },
      {
        heading: '4. Suggested 90-Day Study Timeline',
        content: `Phase 1 (Days 1 - 40): Comprehensive Syllabus Coverage
- Dedicate daily study sessions to core concepts and working through illustrations from the ICAI Study Material. Write out full journal entries and ledger accounts manually.

Phase 2 (Days 41 - 70): Chapter-End Practice & Summary Revision
- Complete the "Test Your Knowledge" questions at the end of each module. Maintain a concise revision notebook for key adjustment entries and formulas.

Phase 3 (Days 71 - 90): RTP, MTP & Timed Mock Practice
- Solve the most recent ICAI Revision Test Papers (RTPs) and complete at least two full-length Mock Test Papers (MTPs) under timed 3-hour conditions (2:00 PM to 5:00 PM) to simulate official examination conditions.`
      }
    ],
    references: [
      {
        title: 'ICAI Board of Studies Knowledge Portal (CA Foundation Course)',
        url: 'https://www.icai.org/post/foundation-course',
        description: 'Official ICAI BoS syllabus, study material modules, Revision Test Papers (RTPs), and Mock Test Papers (MTPs).'
      },
      {
        title: 'ICAI Examination Guidance & Regulations',
        url: 'https://www.icai.org/post/examination',
        description: 'Official examination dates, guidelines, passing regulations, and instructions to candidates.'
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'foundation', paperId: '1', title: 'CA Foundation Accounting Video Lectures & Mentorship' }
    ]
  },
  {
    id: 2,
    slug: 'ca-intermediate-taxation-gst-direct-tax-mastery-guide',
    category: 'ca',
    subCategory: 'study-guides',
    level: 'CA Intermediate',
    paper: 'Paper 3: Taxation (ICAI New Scheme)',
    title: 'CA Intermediate Taxation: Comprehensive Guide to Income Tax (50 Marks) and GST (50 Marks)',
    description: 'An academic guide for CA Intermediate Paper 3. Review total income computation provisions, PGBP deductions, capital gain exemptions, TDS/TCS mechanisms, and GST Input Tax Credit (ITC) statutory conditions.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '15 min read',
    featured: true,
    tags: ['CA Inter', 'Taxation', 'Income Tax', 'GST', 'Input Tax Credit', 'TDS'],
    syllabusCoverage: [
      { module: 'Section A: Income-tax Law (50 Marks)', weightage: '50%', topics: ['Basic Concepts, Residential Status & Scope of Total Income', 'Heads of Income (Salaries, House Property, PGBP, Capital Gains, Other Sources)', 'Clubbing of Income, Set-off and Carry Forward of Losses', 'Deductions from Gross Total Income (Chapter VI-A)', 'TDS, TCS, Advance Tax & Filing of Return of Income'] },
      { module: 'Section B: Goods and Services Tax (50 Marks)', weightage: '50%', topics: ['Concept of Supply (Section 7, Schedule I, II, III)', 'Charge of GST & Composition Levy (Section 9 & Section 10)', 'Place of Supply & Time of Supply', 'Value of Supply (Section 15)', 'Input Tax Credit (Section 16, 17, 18 & Rules 37/37A)', 'Tax Invoice, Credit/Debit Notes, E-Way Bill & Returns (GSTR-1, GSTR-3B)'] },
    ],
    keyTakeaways: [
      'Paper 3 comprises Section A (Income-tax Law - 50 Marks) and Section B (GST - 50 Marks), featuring 30% case-scenario based MCQs and 70% descriptive questions.',
      'In GST, master Section 16 eligibility criteria, Section 17(5) blocked credits, and Section 15 valuation provisions.',
      'In Income Tax, Total Income comprehensive problems integrate multiple heads of income with Chapter VI-A deductions and loss set-off provisions.',
      'Always review the statutory amendments applicable for the relevant exam attempt as notified in the ICAI BoS Statutory Updates.'
    ],
    sections: [
      {
        heading: '1. Structuring the Paper 3 Examination Approach',
        content: `CA Intermediate Paper 3: Taxation evaluates both direct and indirect tax laws:
- Section A: Income-tax Law (50 Marks)
- Section B: Goods and Services Tax (50 Marks)

Both sections incorporate 30% Multiple Choice Questions (including case-scenario questions with no negative marking) and 70% Descriptive Practical Problems.

Academic Recommendation: Many students find starting with Section B (GST) advantageous, as GST statutory provisions are highly structured and involve direct application of statutory rules.`
      },
      {
        heading: '2. Section A: Key Income Tax Provisions',
        content: `Core areas in the Income-tax curriculum include:
- Profits and Gains of Business or Profession (PGBP): Section 32 (Depreciation on block of assets), Section 35 (Scientific research expenditure), Section 37(1) (General deduction principles), Section 40(a)(ia) (30% disallowance for non-deduction of resident TDS), and Section 43B (Deduction on actual payment basis).
- Capital Gains: Section 50C (Stamp duty valuation for land/building), Section 54, 54EC, and 54F (Capital gains exemptions), and special tax rates under Sections 111A and 112A.
- Chapter VI-A Deductions: Key sections including 80C, 80D (Health insurance limits), 80G (Donations), and 80JJAA (Deduction in respect of employment of new employees).
- Tax Deduction at Source (TDS): Key compliance sections including 194C (Contractors), 194J (Professional fees), 194I (Rent), and 194Q (Purchase of goods).`
      },
      {
        heading: '3. Section B: Key Goods & Services Tax (GST) Provisions',
        content: `Fundamental pillars of the GST curriculum:
1. Input Tax Credit (ITC): Eligibility conditions under Section 16(2), Ineligible/Blocked credits under Section 17(5) (such as motor vehicles with seating capacity ≤ 13 persons, subject to specified business exceptions), and reversal mechanics under Rule 37/37A.
2. Time and Value of Supply: Time of supply provisions under Section 12 (Goods) and Section 13 (Services), along with transaction value determination and post-supply discount rules under Section 15.
3. Composition Levy: Eligibility conditions and turnover thresholds under Section 10(1) (₹1.5 Crore for manufacturers/traders; ₹75 Lakhs for special category states) and Section 10(2A) for service providers (up to ₹50 Lakhs).
4. Reverse Charge Mechanism (RCM): Tax liability on recipient for notified goods and services under Section 9(3) of the CGST Act.`
      }
    ],
    references: [
      {
        title: 'ICAI BoS Knowledge Portal (CA Intermediate Paper 3: Taxation)',
        url: 'https://www.icai.org/post/intermediate-course',
        description: 'Official syllabus, study material modules, and statutory update supplements.'
      },
      {
        title: 'Income Tax Department, Government of India',
        url: 'https://incometaxindia.gov.in',
        description: 'Statutory provisions, tax acts, rules, and circulars.'
      },
      {
        title: 'Central Board of Indirect Taxes and Customs (CBIC)',
        url: 'https://cbic-gst.gov.in',
        description: 'CGST/IGST Acts, statutory notifications, and GST rules.'
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'inter', paperId: '7', title: 'CA Intermediate Taxation Comprehensive Classes (DT + GST)' }
    ]
  },
  {
    id: 3,
    slug: 'cma-intermediate-cost-accounting-high-scoring-techniques',
    category: 'cma',
    subCategory: 'study-guides',
    level: 'CMA Intermediate',
    paper: 'Paper 8: Cost Accounting (ICMAI Syllabus 2022)',
    title: 'CMA Intermediate Cost Accounting: Practical Techniques, Variance Analysis & Decision Making',
    description: 'A study guide for ICMAI CMA Intermediate Paper 8. Review standard costing variance analysis formulas, marginal costing decision models, Cost Accounting Standards (CAS), and process costing statements.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '14 min read',
    featured: true,
    tags: ['CMA Inter', 'Cost Accounting', 'Marginal Costing', 'Standard Costing', 'Process Costing'],
    syllabusCoverage: [
      { module: 'Module 1: Introduction to Cost Accounting & Cost Concepts', weightage: '10-15%', topics: ['Cost Objects, Cost Centers, Classification of Costs', 'Cost Sheet Preparation & CAS Taxonomy', 'Direct Materials, EOQ, ABC Analysis, Stock Levels'] },
      { module: 'Module 2: Elements of Cost (Material, Employee & Overheads)', weightage: '25-30%', topics: ['Material Costing (FIFO, LIFO, Weighted Average)', 'Employee Cost (Halsey, Rowan, Differential Piece Rates)', 'Overhead Allocation, Apportionment & Machine Hour Rate'] },
      { module: 'Module 3: Cost Accounting Methods', weightage: '20-25%', topics: ['Job Costing & Batch Costing', 'Contract Costing Principles', 'Process Costing (Equivalent Production Units, FIFO vs Weighted Average, Joint & By-Products)'] },
      { module: 'Module 4: Cost Accounting Techniques for Decision Making', weightage: '30-35%', topics: ['Marginal Costing (P/V Ratio, BEP, Margin of Safety, Key Factor Analysis)', 'Standard Costing & Variance Analysis (Material, Labour, Overhead Variances)', 'Budget & Budgetary Control (Flexible Budget, Cash Budget, Zero-Based Budgeting)'] },
    ],
    keyTakeaways: [
      'Standard Costing and Marginal Costing represent substantial practical components of Paper 8 in the ICMAI Syllabus 2022.',
      'In Process Costing, preparing the Statement of Equivalent Production requires precise application of Opening WIP under FIFO vs. Weighted Average methods.',
      'Memorize core definitions, principles, and classifications prescribed under the Cost Accounting Standards (CAS) issued by ICMAI.',
      'When preparing the Reconciliation of Cost and Financial Accounts, ensure consistent arithmetic adjustments relative to the starting profit base.'
    ],
    sections: [
      {
        heading: '1. Role of Cost Accounting in the CMA Curriculum',
        content: `Cost Accounting forms the core foundational discipline of the Institute of Cost Accountants of India (ICMAI) professional qualification.
In CMA Intermediate Paper 8, candidates are assessed on their understanding of cost ascertainment, cost control, and analytical decision-making frameworks.`
      },
      {
        heading: '2. Marginal Costing Principles & Key Formulas',
        content: `Marginal Costing focuses on the behavior of costs with changes in volume of output:
- Profit Volume (P/V) Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100.
- Break-Even Point (Units) = Fixed Cost / Contribution per unit.
- Break-Even Point (Value) = Fixed Cost / P/V Ratio.
- Margin of Safety (MOS) = Total Sales - Break-Even Sales = Profit / P/V Ratio.
- Key Factor / Limiting Factor Decision: When resources (such as raw material or labor hours) are restricted, rank products based on Contribution per unit of the limiting factor.`
      },
      {
        heading: '3. Variance Analysis Formula Framework in Standard Costing',
        content: `Material Cost Variances:
1. Material Cost Variance (MCV) = (Standard Quantity × Standard Price) - (Actual Quantity × Actual Price)
2. Material Price Variance (MPV) = Actual Quantity × (Standard Price - Actual Price)
3. Material Usage Variance (MUV) = Standard Price × (Standard Quantity - Actual Quantity)
- Check: MCV = MPV + MUV.

Labour Cost Variances:
1. Labour Cost Variance (LCV) = (Standard Hours × Standard Rate) - (Actual Hours Paid × Actual Rate)
2. Labour Rate Variance (LRV) = Actual Hours Paid × (Standard Rate - Actual Rate)
3. Labour Efficiency Variance (LEV) = Standard Rate × (Standard Hours - Actual Hours Worked)
4. Idle Time Variance (ITV) = Actual Idle Hours × Standard Rate (Always Adverse).`
      }
    ],
    references: [
      {
        title: 'ICMAI Directorate of Studies (Syllabus 2022)',
        url: 'https://icmai.in/studentswebsite/studymat.php',
        description: 'Official study material, syllabus architecture, and workbook resources for CMA Intermediate.'
      },
      {
        title: 'Cost Accounting Standards Board (CASB)',
        url: 'https://icmai.in',
        description: 'Authoritative Cost Accounting Standards (CAS 1 to CAS 24) issued by ICMAI.'
      }
    ],
    relatedCourses: [
      { courseType: 'cma', level: 'inter', paperId: '8', title: 'CMA Intermediate Cost Accounting Video Classes & Test Series' }
    ]
  },
  {
    id: 4,
    slug: 'ca-cma-3-hour-exam-time-management-presentation-masterclass',
    category: 'exam-preparation',
    subCategory: 'exam-preparation',
    level: 'All Levels (CA & CMA)',
    paper: 'General Examination Strategy',
    title: '3-Hour Professional Exam Masterclass: Time Allocation, Answer Structuring & Step-Marking Guidelines',
    description: 'An academic guide for CA & CMA examinations. Learn how to optimize the 15-minute initial reading time, apply the 1.8-minute per mark pacing rule, structure legal answers, and maintain clarity across descriptive papers.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '10 min read',
    featured: true,
    tags: ['Exam Strategy', 'Time Management', 'Answer Presentation', 'ICAI Exams', 'ICMAI Exams'],
    keyTakeaways: [
      'Utilize the 15-minute initial reading period to evaluate question options and determine the optimal sequence of attempt.',
      'Maintain an average pacing guideline of 1.8 minutes per mark (e.g., allocate maximum 18 minutes for a 10-mark question).',
      'Begin each major question on a fresh page of the answer booklet, with clear headings identifying the question number.',
      'Format legal and theory answers with clear separation between statutory provisions, facts of the case, and final conclusions.'
    ],
    sections: [
      {
        heading: '1. Strategic Use of the 15-Minute Reading Period',
        content: `In examinations offering an initial 15-minute reading period prior to writing (such as 1:45 PM to 2:00 PM for ICAI afternoon sessions):
- Read across all available questions to assess familiarity with the underlying concepts.
- Identify and select the optional question you plan to omit from your attempt.
- Sequence the remaining questions, beginning with the question where your conceptual understanding and recall are strongest to build early momentum.`
      },
      {
        heading: '2. The 1.8-Minute per Mark Pacing Guideline',
        content: `In a 100-mark paper with 180 minutes of writing time:
- Pacing ratio: 180 Minutes ÷ 100 Marks = 1.8 Minutes per Mark.
- 5-mark question: ~9 minutes maximum.
- 10-mark question: ~18 minutes maximum.
- 14-mark question: ~25 minutes maximum.

Academic Tip: If a practical computation does not balance at the allocated time limit, avoid spending excessive time searching for minor errors. Clearly label all completed steps and proceed to the next question. You retain step marks for the correct workings completed, while preserving valuable time for the remaining paper.`
      },
      {
        heading: '3. Presentation Framework for Law and Auditing Descriptive Answers',
        content: `For questions on Corporate Law, Taxation, and Auditing standards, structuring responses in four distinct components enhances readability:
1. Applicable Statutory Provision / Standard: State the relevant Act, section, or Standard on Auditing (e.g., "As per the provisions of Section 135 of the Companies Act, 2013..."). If uncertain about the exact section number, cite the Act accurately without guessing specific section digits.
2. Facts of the Problem: Briefly summarize the key facts presented in the question.
3. Analysis & Statutory Application: Apply the legal provision to the factual scenario.
4. Conclusion: State a clear and unambiguous conclusion addressing the specific query raised in the question.`
      }
    ],
    references: [
      {
        title: 'ICAI Examination Guidance & Instructions to Examinees',
        url: 'https://www.icai.org/post/examination',
        description: 'Official rules, booklet formatting guidelines, and instructions for CA examinations.'
      },
      {
        title: 'ICMAI Examination Department Guidance',
        url: 'https://icmai.in/studentswebsite/exam.php',
        description: 'Official instructions, admit card regulations, and exam hall protocols for CMA candidates.'
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'all', paperId: 'all', title: 'Complete CA & CMA Test Series & Mentorship Program' }
    ]
  },
  {
    id: 5,
    slug: 'ca-final-financial-reporting-ind-as-cheat-sheet',
    category: 'ca',
    subCategory: 'notes',
    level: 'CA Final',
    paper: 'Paper 1: Financial Reporting (ICAI New Scheme)',
    title: 'CA Final Financial Reporting: High-Yield Ind AS Reference Summary (Ind AS 115, 116, 109, 103)',
    description: 'A structured revision summary of key Indian Accounting Standards (Ind AS) covering Revenue from Contracts (Ind AS 115), Leases (Ind AS 116), Financial Instruments (Ind AS 109), and Business Combinations (Ind AS 103).',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '16 min read',
    featured: false,
    tags: ['CA Final', 'Financial Reporting', 'Ind AS 115', 'Ind AS 116', 'Ind AS 109', 'Ind AS 103'],
    keyTakeaways: [
      'Ind AS 115 implements a 5-step revenue recognition model based on transfer of control rather than transfer of risks and rewards.',
      'Ind AS 116 mandates a single lessee accounting model where lessees recognize a Right-of-Use (ROU) Asset and Lease Liability on the balance sheet.',
      'Ind AS 109 classifies debt financial assets into Amortized Cost, FVTOCI, or FVTPL based on Business Model and SPPI tests.',
      'Ind AS 103 requires the Acquisition Method for business combinations, with identifiable net assets and purchase consideration measured at acquisition-date fair value.'
    ],
    sections: [
      {
        heading: '1. Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
        content: `Ind AS 115 establishes a comprehensive framework for recognizing revenue:
- Step 1: Identify the Contract with the customer (enforceable rights, commercial substance, approved terms, collection is probable).
- Step 2: Identify Performance Obligations (PO) in the contract (promises to transfer distinct goods or services).
- Step 3: Determine the Transaction Price (TP) (accounting for variable consideration, significant financing components, and non-cash consideration).
- Step 4: Allocate the Transaction Price to performance obligations based on relative Standalone Selling Prices (SSP).
- Step 5: Recognize revenue when (or as) the entity satisfies a performance obligation (over time or at a point in time).`
      },
      {
        heading: '2. Ind AS 116: Leases Accounting Framework',
        content: `Lessee Accounting Principles:
- Initial Measurement of Lease Liability: Present value of future lease payments discounted using the interest rate implicit in the lease (or lessee's incremental borrowing rate).
- Initial Measurement of ROU Asset: Lease liability amount + Initial direct costs + Advance lease payments - Lease incentives received + Estimated restoration/dismantling costs.
- Subsequent Measurement:
  - ROU Asset: Depreciated over the shorter of lease term or useful life.
  - Lease Liability: Increased by finance charges and reduced by lease payments made.
- Practical Exemptions: Short-term leases (≤ 12 months without purchase option) and leases of low-value assets may be expensed on a straight-line basis.`
      },
      {
        heading: '3. Ind AS 109: Financial Instruments Classification Matrix',
        content: `Classification of Financial Assets (Debt Instruments):
1. Amortized Cost: Contractual cash flows solely represent Solely Payments of Principal & Interest (SPPI) + Held to collect contractual cash flows.
2. FVTOCI (Fair Value Through Other Comprehensive Income): SPPI test passed + Business model involves both collecting contractual cash flows and selling financial assets.
3. FVTPL (Fair Value Through Profit or Loss): Default category for assets not qualifying for Amortized Cost or FVTOCI.

Classification of Equity Instruments:
- Standard Classification: FVTPL.
- Irrevocable Election at Initial Recognition: FVTOCI for non-held-for-trading equity investments (without subsequent recycling of accumulated OCI gains/losses to Profit & Loss upon derecognition).`
      }
    ],
    references: [
      {
        title: 'Ministry of Corporate Affairs (MCA) Ind AS Compendium',
        url: 'https://mca.gov.in',
        description: 'Official statutory text of Companies (Indian Accounting Standards) Rules as notified by the Government of India.'
      },
      {
        title: 'ICAI Accounting Standards Board (ASB)',
        url: 'https://www.icai.org/post/indian-accounting-standards-indas',
        description: 'Educational material, Ind AS guidance notes, and implementation guidelines.'
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'final', paperId: '11', title: 'CA Final Financial Reporting (Ind AS) Comprehensive Classes' }
    ]
  },
  {
    id: 6,
    slug: 'cma-final-strategic-financial-management-formula-sheet',
    category: 'cma',
    subCategory: 'notes',
    level: 'CMA Final',
    paper: 'Paper 14: Strategic Financial Management (ICMAI Syllabus 2022)',
    title: 'CMA Final Strategic Financial Management (SFM): Formulas for Derivatives, Forex & Portfolio Theory',
    description: 'A reference formula sheet for CMA Final Paper 14. Review key quantitative models for Foreign Exchange Risk Management, Interest Rate Parity, Black-Scholes Option Pricing, and Markowitz Portfolio Theory.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '13 min read',
    featured: false,
    tags: ['CMA Final', 'SFM', 'Forex', 'Derivatives', 'Portfolio Management', 'Formulas'],
    keyTakeaways: [
      'Interest Rate Parity (IRP): Forward Rate = Spot Rate × (1 + r_domestic) / (1 + r_foreign).',
      'Capital Asset Pricing Model (CAPM): Expected Return E(R) = Rf + Beta × [E(Rm) - Rf].',
      'The Black-Scholes formula incorporates Spot Price (S), Strike Price (X), Time to Expiration (t), Risk-free Rate (r), and Volatility (σ).',
      'When executing foreign exchange quotations, remember standard market spread conventions: Bank buys at Bid and sells at Ask.'
    ],
    sections: [
      {
        heading: '1. Foreign Exchange Arithmetic & Parity Relations',
        content: `1. Direct vs. Indirect Quotations:
- Direct Quote: 1 Foreign Currency Unit = x Domestic Currency Units.
- Indirect Quote: 1 Domestic Currency Unit = x Foreign Currency Units.
- Conversion: Direct Quote = 1 / Indirect Quote.

2. Bid-Ask Spread Percentage:
- Spread % = [(Ask Price - Bid Price) / Ask Price] × 100.

3. Purchasing Power Parity (PPP):
- Forward Rate = Spot Rate × [(1 + Inflation_domestic) / (1 + Inflation_foreign)].

4. Interest Rate Parity (IRP):
- Forward Rate = Spot Rate × [(1 + Interest_domestic) / (1 + Interest_foreign)].
- When market forward rate deviates from IRP rate, Covered Interest Arbitrage (CIA) opportunities arise.`
      },
      {
        heading: '2. Portfolio Theory & Risk-Adjusted Performance Measures',
        content: `1. Portfolio Expected Return (2 Assets):
   Rp = (w1 × R1) + (w2 × R2).

2. Portfolio Variance (2 Assets):
   σp² = (w1² × σ1²) + (w2² × σ2²) + [2 × w1 × w2 × Cov(1,2)].
   where Cov(1,2) = Correlation(1,2) × σ1 × σ2.

3. Sharpe Ratio (Total Risk):
   Sharpe = (Rp - Rf) / σp.

4. Treynor Ratio (Systematic Risk):
   Treynor = (Rp - Rf) / βp.

5. Jensen's Alpha:
   Alpha = Actual Return - [Rf + β × (Rm - Rf)].`
      }
    ],
    references: [
      {
        title: 'ICMAI Directorate of Studies (CMA Final Syllabus 2022)',
        url: 'https://icmai.in/studentswebsite/studymat.php',
        description: 'Official CMA Final study materials, workbooks, and mock examination papers for Paper 14.'
      },
      {
        title: 'Reserve Bank of India (RBI) Foreign Exchange Guidelines',
        url: 'https://www.rbi.org.in',
        description: 'Statutory guidelines and regulations governing foreign exchange transactions in India.'
      }
    ],
    relatedCourses: [
      { courseType: 'cma', level: 'final', paperId: '14', title: 'CMA Final Strategic Financial Management (SFM) Classes' }
    ]
  },
  {
    id: 7,
    slug: 'ca-cma-passing-marks-exemption-rules-guide',
    category: 'exam-updates',
    subCategory: 'exam-updates',
    level: 'All Levels (CA & CMA)',
    paper: 'Official Examination Regulations',
    title: 'ICAI & ICMAI Passing Criteria, Aggregate Rules, Set-Off Mechanics, and Exemption Regulations Explained',
    description: 'An authoritative reference explaining how the 40% individual paper minimum, 50% group aggregate, both-group set-off rules, and 60+ marks exemption carry-forward regulations operate in CA and CMA examinations.',
    author: 'AcademyWale Academic Content Team',
    publishedDate: '2025-08-15',
    lastUpdated: '2026-08-30',
    readTime: '8 min read',
    featured: false,
    tags: ['Exam Rules', 'Passing Criteria', 'Exemption Rules', 'Set-off Rules', 'ICAI', 'ICMAI'],
    keyTakeaways: [
      'To pass an individual group, a candidate must obtain minimum 40% marks in each paper and minimum 50% marks in the aggregate of that group.',
      'When appearing for Both Groups simultaneously in the same exam term, surplus aggregate marks from one group can be set-off against deficit in the other group.',
      'Scoring 60 or more marks in any paper while appearing in all papers of a group grants a paper exemption under official institute regulations.',
      'Under the ICAI New Scheme Regulation 38D, exemptions can be carried forward beyond 3 terms permanently with a 50% pass threshold in remaining papers.'
    ],
    sections: [
      {
        heading: '1. Passing Criteria for Single Group vs Both Groups',
        content: `Single Group Passing Requirements:
- Minimum marks in each individual paper: 40 out of 100.
- Minimum total marks in the group: 50% of the maximum aggregate (e.g., 150 out of 300 for a 3-paper group; 200 out of 400 for a 4-paper group).

Both Groups Set-Off Mechanics:
When a candidate sits for all papers of both groups simultaneously in a single examination term:
- Example: 
  - Group 1 (3 papers) Total = 175 / 300 (Cleared with 25 marks surplus).
  - Group 2 (3 papers) Total = 135 / 300 (Every individual paper has ≥ 40 marks, but group total is 15 marks below 150).
  - Cumulative Total = 175 + 135 = 310 / 600 (Exceeds 50% aggregate threshold of 300).
- Statutory Result: The candidate is declared to have PASSED in both groups by virtue of the institutional Set-Off regulation.`
      },
      {
        heading: '2. The 60+ Marks Exemption Framework & Regulations',
        content: `Under the official regulations of ICAI and ICMAI:
1. Eligibility: If a student appears in all papers of a group and fails the group as a whole, but secures 60% or more marks in one or more individual papers, an exemption is granted for those specific papers.
2. Mandatory Condition: The candidate must have appeared in all papers of the group during that examination attempt. Absence in any paper disqualifies the student from claiming exemptions.
3. Standard Exemption Duration: The exemption remains valid for the next 3 consecutive following examination terms.
4. ICAI New Scheme Regulation 38D Permanent Extension: Under the ICAI New Scheme regulations, if a candidate is unable to clear the remaining papers within 3 terms, the exemption can be continued permanently, with the condition that the candidate must score minimum 50% marks in each of the remaining papers to pass the group.`
      }
    ],
    references: [
      {
        title: 'The Chartered Accountants Regulations, 1988 (as amended)',
        url: 'https://www.icai.org',
        description: 'Official statutory regulations governing CA examinations, passing requirements, and Regulation 38D exemption provisions.'
      },
      {
        title: 'The Institute of Cost Accountants of India Examination Bye-Laws',
        url: 'https://icmai.in/studentswebsite/exam.php',
        description: 'Official examination bye-laws, passing criteria, and paper exemption guidelines for CMA students.'
      }
    ],
    relatedCourses: [
      { courseType: 'all', level: 'all', paperId: 'all', title: 'Explore CA & CMA Foundation, Inter and Final Courses' }
    ]
  }
];

export const practiceMCQSets = [
  {
    id: 'mcq-set-1',
    subject: 'CA Foundation Accounting',
    category: 'ca',
    level: 'Foundation',
    title: 'Accounting Principles, Capital & Revenue Expenditures, and BRS',
    questions: [
      {
        id: 1,
        question: 'An expenditure incurred on the complete overhaul of a second-hand machine purchased prior to putting it into working condition is classified as:',
        options: [
          'Revenue expenditure',
          'Capital expenditure',
          'Deferred revenue expenditure',
          'Administrative operating expense'
        ],
        correctIndex: 1,
        explanation: 'Under fundamental accounting principles, any expenditure incurred to bring a fixed asset to its working condition and location for its intended use is capitalized as part of the cost of the asset.'
      },
      {
        id: 2,
        question: 'Under AS 2 "Valuation of Inventories", inventories must be measured at:',
        options: [
          'Historical Cost only',
          'Net Realizable Value (NRV) only',
          'Lower of Cost and Net Realizable Value',
          'Higher of Cost and Net Realizable Value'
        ],
        correctIndex: 2,
        explanation: 'AS 2 (and Ind AS 2) requires that inventories be measured at the lower of cost and net realizable value (NRV), following the accounting principle of prudence (conservatism).'
      },
      {
        id: 3,
        question: 'When preparing a Bank Reconciliation Statement starting from an Overdraft balance as per the Cash Book, an unpresented cheque issued to a creditor should be:',
        options: [
          'Added to the overdraft balance',
          'Deducted from the overdraft balance',
          'Ignored in reconciliation',
          'Doubled in the cash book'
        ],
        correctIndex: 1,
        explanation: 'An unpresented cheque has not yet been debited by the bank, meaning the passbook overdraft is lower than the cash book overdraft. Reconciling from cash book to passbook requires deducting the unpresented cheque amount.'
      },
      {
        id: 4,
        question: 'In the absence of any partnership agreement, what rate of interest is allowed on loans/advances advanced by a partner to the partnership firm?',
        options: [
          'No interest is permitted',
          '6% per annum',
          '10% per annum',
          '12% per annum'
        ],
        correctIndex: 1,
        explanation: 'Under Section 13(d) of the Indian Partnership Act, 1932, in the absence of a contract to the contrary, a partner is entitled to interest at the rate of 6% per annum on any advance made beyond agreed capital.'
      }
    ]
  },
  {
    id: 'mcq-set-2',
    subject: 'CA Intermediate GST & Taxation',
    category: 'ca',
    level: 'Intermediate',
    title: 'Input Tax Credit (Section 16 & 17) and Value of Supply (Section 15)',
    questions: [
      {
        id: 1,
        question: 'Under Section 17(5)(a) of the CGST Act, 2017, Input Tax Credit (ITC) is blocked on motor vehicles for transportation of persons having approved seating capacity of:',
        options: [
          'Not more than 13 persons (including the driver), subject to specified business exceptions',
          'Not more than 20 persons',
          'More than 13 persons in all circumstances',
          'All passenger motor vehicles without exception'
        ],
        correctIndex: 0,
        explanation: 'Section 17(5)(a) of the CGST Act blocks ITC on motor vehicles for transportation of persons having approved seating capacity of ≤ 13 persons (including driver), unless used for taxable supplies of further supply of vehicles, passenger transportation, or driving training.'
      },
      {
        id: 2,
        question: 'What is the statutory deadline to claim Input Tax Credit for a financial year under Section 16(4) of the CGST Act, 2017?',
        options: [
          '31st March of the relevant financial year',
          '30th November following the end of the financial year, or actual date of furnishing the annual return, whichever is earlier',
          '31st December following the end of the financial year',
          '3 years from the date of invoice issuance'
        ],
        correctIndex: 1,
        explanation: 'As amended, Section 16(4) of the CGST Act stipulates that ITC for any invoice/debit note must be availed up to 30th November following the end of the financial year or the date of filing the annual return under Section 44, whichever is earlier.'
      },
      {
        id: 3,
        question: 'Under Section 15 of the CGST Act, 2017, which of the following is excluded from the Value of Supply?',
        options: [
          'Taxes and duties levied under other Acts (excluding CGST, SGST, UTGST, and IGST)',
          'Incidental expenses charged by the supplier (packing, commission)',
          'Subsidies directly linked to the price (other than Government subsidies)',
          'Post-supply discount agreed upon at/before supply and specifically linked to relevant invoices'
        ],
        correctIndex: 3,
        explanation: 'Section 15(3)(b) excludes post-supply discounts from the transaction value if established in terms of an agreement entered into before or at the time of supply and specifically linked to relevant invoices.'
      }
    ]
  },
  {
    id: 'mcq-set-3',
    subject: 'CMA Intermediate Cost Accounting',
    category: 'cma',
    level: 'Intermediate',
    title: 'Marginal Costing, P/V Ratio, and Variance Analysis',
    questions: [
      {
        id: 1,
        question: 'If Total Sales = ₹10,00,000, Variable Cost = ₹6,00,000, and Fixed Cost = ₹2,00,000, the Margin of Safety (MOS) in value is:',
        options: [
          '₹4,00,000',
          '₹5,00,000',
          '₹6,00,000',
          '₹2,00,000'
        ],
        correctIndex: 1,
        explanation: 'Contribution = Sales - VC = ₹10,00,000 - ₹6,00,000 = ₹4,00,000. P/V Ratio = (₹4,00,000 / ₹10,00,000) = 40%. Break-Even Sales = Fixed Cost / PV Ratio = ₹2,00,000 / 0.40 = ₹5,00,000. Margin of Safety = Total Sales - Break-Even Sales = ₹10,00,000 - ₹5,00,000 = ₹5,00,000.'
      },
      {
        id: 2,
        question: 'In Standard Costing, Material Price Variance (MPV) is calculated as:',
        options: [
          'Standard Price × (Standard Quantity - Actual Quantity)',
          'Actual Quantity × (Standard Price - Actual Price)',
          'Actual Price × (Standard Quantity - Actual Quantity)',
          'Standard Quantity × (Standard Price - Actual Price)'
        ],
        correctIndex: 1,
        explanation: 'Material Price Variance measures the difference between standard price and actual price multiplied by the actual quantity purchased/consumed: MPV = Actual Quantity × (Standard Price - Actual Price).'
      },
      {
        id: 3,
        question: 'Under Cost Accounting Standard 4 (CAS-4) issued by ICMAI, the Cost of Production for captive consumption comprises:',
        options: [
          'Direct Material + Direct Wages + Direct Expenses + Works Overheads + Quality Control Cost + R&D Cost + Administration Overheads relating to production',
          'Direct Material + Selling Overheads + Distribution Overheads',
          'Selling Price minus Profit Margin only',
          'Prime Cost only'
        ],
        correctIndex: 0,
        explanation: 'CAS-4 specifies that Cost of Production includes Material Consumed, Direct Wages, Direct Expenses, Works Overheads, Quality Control costs, R&D costs, and Administration Overheads related to production activity.'
      }
    ]
  }
];

export const examSyllabusBlueprints = {
  ca: {
    foundation: {
      title: 'ICAI CA Foundation New Scheme Syllabus Architecture',
      papers: [
        { paperNumber: 1, name: 'Accounting', marks: 100, type: 'Descriptive', keyFocus: 'Company Accounts, Partnership, NPO, Accounting Standards Overview' },
        { paperNumber: 2, name: 'Business Laws', marks: 100, type: 'Descriptive', keyFocus: 'Indian Regulatory Framework, Contract Act 1872, Sale of Goods 1930, Partnership Act 1932, LLP Act 2008, Companies Act 2013' },
        { paperNumber: 3, name: 'Quantitative Aptitude', marks: 100, type: 'Objective (MCQ with Negative Marking)', keyFocus: 'Mathematics (40 Marks), Logical Reasoning (20 Marks), Statistics (40 Marks)' },
        { paperNumber: 4, name: 'Business Economics', marks: 100, type: 'Objective (MCQ with Negative Marking)', keyFocus: 'Micro Economics, Macro Economics, National Income, Public Finance, Money Market, International Trade' }
      ]
    },
    inter: {
      title: 'ICAI CA Intermediate New Scheme Syllabus Architecture',
      group1: [
        { paperNumber: 1, name: 'Advanced Accounting', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Consolidated Financial Statements, Accounting Standards (AS 1 to AS 29), Business Restructuring, Internal Reconstruction' },
        { paperNumber: 2, name: 'Corporate and Other Laws', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Company Law (Sections 1-148), Foreign Exchange Management Act (FEMA), General Clauses Act, Interpretation of Statutes' },
        { paperNumber: 3, name: 'Taxation (Direct Tax & GST)', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Income-tax Law (50 Marks), Indirect Taxes / GST (50 Marks)' }
      ],
      group2: [
        { paperNumber: 4, name: 'Cost and Management Accounting', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Standard Costing, Marginal Costing, Budgetary Control, Process & Service Costing' },
        { paperNumber: 5, name: 'Auditing and Ethics', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Standards on Auditing (SAs), Audit Evidence, Internal Control, Company Audit, Professional Ethics' },
        { paperNumber: 6, name: 'Financial Management and Strategic Management', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Financial Management (50 Marks), Strategic Management (50 Marks)' }
      ]
    },
    final: {
      title: 'ICAI CA Final New Scheme Syllabus Architecture',
      group1: [
        { paperNumber: 1, name: 'Financial Reporting (FR)', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Comprehensive Ind AS, Business Combinations, Financial Instruments, Consolidation, CSR Reporting' },
        { paperNumber: 2, name: 'Advanced Financial Management (AFM)', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Forex Risk, Derivatives, Portfolio Management, Business Valuation, Mutual Funds, Mergers' },
        { paperNumber: 3, name: 'Advanced Auditing, Assurance & Professional Ethics', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Standards on Auditing (SAs 200-799), Professional Ethics (CA Act 1949), Forensic Accounting, Digital Auditing' }
      ],
      group2: [
        { paperNumber: 4, name: 'Direct Tax Laws & International Taxation', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Corporate Assessment, Transfer Pricing, Double Tax Avoidance Agreements (DTAA), BEPS, Equalization Levy' },
        { paperNumber: 5, name: 'Indirect Tax Laws (GST & Customs)', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Comprehensive CGST/IGST Act, Customs Law, Foreign Trade Policy (FTP), Advance Rulings, Appeals' },
        { paperNumber: 6, name: 'Integrated Business Solutions (Multi-Disciplinary Case Study)', marks: 100, type: 'Open Book Case Study (Descriptive + MCQ)', keyFocus: 'Cross-functional integration of FR, AFM, Audit, Law, Taxation, and Strategic Costing' }
      ]
    }
  },
  cma: {
    foundation: {
      title: 'ICMAI CMA Foundation Syllabus 2022 Structure',
      papers: [
        { paperNumber: 1, name: 'Fundamentals of Business Laws and Business Communication', marks: 100, type: 'Objective / Descriptive', keyFocus: 'Commercial Laws, Industrial Laws, Business Communication' },
        { paperNumber: 2, name: 'Fundamentals of Financial and Cost Accounting', marks: 100, type: 'Objective / Descriptive', keyFocus: 'Financial Accounting Principles, Cost Accounting Basics, Preparation of Final Accounts' },
        { paperNumber: 3, name: 'Fundamentals of Business Mathematics and Statistics', marks: 100, type: 'Objective / Descriptive', keyFocus: 'Arithmetic, Algebra, Calculus Basics, Measures of Central Tendency, Probability' },
        { paperNumber: 4, name: 'Fundamentals of Business Economics and Management', marks: 100, type: 'Objective / Descriptive', keyFocus: 'Basic Economics, Market Forms, Management Process, Leadership, Motivation' }
      ]
    },
    inter: {
      title: 'ICMAI CMA Intermediate Syllabus 2022 Structure',
      group1: [
        { paperNumber: 5, name: 'Business Laws and Ethics', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Commercial Laws, Industrial Laws, Corporate Laws, Business Ethics' },
        { paperNumber: 6, name: 'Financial Accounting', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Accounting Standards, Partnership Accounts, Special Transactions, Branch & Departmental Accounts' },
        { paperNumber: 7, name: 'Direct and Indirect Taxation', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Income Tax (50 Marks), GST & Customs (50 Marks)' },
        { paperNumber: 8, name: 'Cost Accounting', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Cost Sheet, Overheads, Process Costing, Marginal Costing, Standard Costing, CAS' }
      ],
      group2: [
        { paperNumber: 9, name: 'Operations Management and Strategic Management', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Operations Planning, Production Control, Strategic Analysis, Strategy Implementation' },
        { paperNumber: 10, name: 'Corporate Accounting and Auditing', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Company Accounts, Cash Flow, Banking/Electricity Companies, Auditing Principles' },
        { paperNumber: 11, name: 'Financial Management and Business Data Analytics', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Financial Management Tools, Working Capital, Data Analytics for Business' },
        { paperNumber: 12, name: 'Management Accounting', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Activity Based Costing (ABC), Decision Making Tools, Transfer Pricing, Budgetary Control' }
      ]
    },
    final: {
      title: 'ICMAI CMA Final Syllabus 2022 Structure',
      group1: [
        { paperNumber: 13, name: 'Corporate and Economic Laws', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Companies Act, Insolvency and Bankruptcy Code (IBC 2016), SEBI Regulations, Competition Act' },
        { paperNumber: 14, name: 'Strategic Financial Management (SFM)', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Investment Decisions, Derivatives & Risk Management, Security Analysis, Valuation' },
        { paperNumber: 15, name: 'Direct Tax Laws and International Taxation', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Assessment of Entities, Tax Planning, Transfer Pricing, International Treaties' },
        { paperNumber: 16, name: 'Strategic Cost Management', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Target Costing, Life Cycle Costing, Quality Cost Management, Lean Operations, Value Chain' }
      ],
      group2: [
        { paperNumber: 17, name: 'Cost and Management Audit', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Cost Audit Rules (CRA-1 to CRA-4), Internal Audit, Operational Audit, Compliance' },
        { paperNumber: 18, name: 'Corporate Financial Reporting', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Ind AS Implementation, Group Financial Statements, Valuation of Shares, Valuation of Goodwill' },
        { paperNumber: 19, name: 'Indirect Tax Laws and Practice', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Comprehensive GST Law, Customs Act, Foreign Trade Policy, Tax Planning in Indirect Taxes' },
        { paperNumber: 20, name: 'Strategic Performance Management and Business Valuation', marks: 100, type: 'Descriptive + MCQ', keyFocus: 'Economic Value Added (EVA), Balanced Scorecard, Business Valuation Models, M&A' }
      ]
    }
  }
};
