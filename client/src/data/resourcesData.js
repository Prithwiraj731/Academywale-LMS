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
    paper: 'Paper 1: Principles and Practice of Accounting',
    title: 'CA Foundation Principles & Practice of Accounting: Chapter-Wise Weightage & 90-Day Strategy',
    description: 'Master CA Foundation Paper 1 with high-weightage topic breakdowns, journal entry masteries, depreciation schedules, partnership accounts, and sample working note presentations.',
    author: 'CA Expert Panel & AcademyWale Faculty',
    publishedDate: '2025-01-15',
    lastUpdated: '2025-02-20',
    readTime: '12 min read',
    featured: true,
    tags: ['CA Foundation', 'Accounting', 'Study Plan', 'Exam Weightage', 'Working Notes'],
    syllabusCoverage: [
      { module: 'Module 1: Theoretical Framework & Accounting Process', weightage: '15-20%', topics: ['Accounting Concepts, Principles & Conventions', 'Capital vs Revenue Expenditures', 'Contingent Assets & Liabilities', 'Accounting Policies & Standards Overview'] },
      { module: 'Module 2: Bank Reconciliation, Inventories & Depreciation', weightage: '20-25%', topics: ['BRS with Adjusted Cash Book', 'Inventory Valuation Methods (FIFO, Weighted Avg)', 'Depreciation (SLM, WDV, Change in Method)'] },
      { module: 'Module 3: Special Transactions & Bills of Exchange', weightage: '15-20%', topics: ['Bills of Exchange & Accommodation Bills', 'Consignment Accounting', 'Sale of Goods on Approval / Return Basis'] },
      { module: 'Module 4: Final Accounts of Sole Proprietors & NPO', weightage: '20-25%', topics: ['Trading, P&L Account & Balance Sheet with adjustments', 'Receipts & Payments, Income & Expenditure, NPO Balance Sheets'] },
      { module: 'Module 5: Partnership Accounts & Company Accounts', weightage: '20-25%', topics: ['Admission, Retirement, Death of Partner, Goodwill treatment', 'Issue of Shares, Forfeiture, Re-issue, Debentures basics'] },
    ],
    keyTakeaways: [
      'Focus 40% of revision time on Partnership Accounts, NPO, and Final Accounts as they consistently form 40-50 marks of the question paper.',
      'Always draw neat ledger rulings and show explicit Working Notes with step markings—ICAI examiners award 30-40% of marks for working steps.',
      'Solve past 5 terms ICAI RTPs (Revision Test Papers) and MTPs (Mock Test Papers) under timed 3-hour exam conditions.',
      'Bank Reconciliation Statement with amended cash book is an easy 10-mark scoring question if overdraft rules are mastered.'
    ],
    sections: [
      {
        heading: '1. Understanding the CA Foundation Paper 1 Pattern',
        content: `Principles and Practice of Accounting is a 100-mark subjective descriptive paper. The question paper typically consists of 6 compulsory/optional questions:
- Question 1 is compulsory (20 marks): Generally includes 6 True/False statements with mandatory reasons (12 marks) and two short practical/theory questions (4 marks each).
- Questions 2 to 6 (20 marks each): Students must attempt any 4 out of these 5 questions.

To clear this paper with an exemption (60+ marks), mastering Question 1 is non-negotiable. True/False questions require conceptual clarity from ICAI Study Material Study Modules.`
      },
      {
        heading: '2. High-Yield Chapters to Target First',
        content: `Based on trend analysis of recent ICAI exam papers, prioritizing the following chapters guarantees a solid score:
1. Partnership Accounts: Admission, Retirement cum Death, and Goodwill valuation (AS 26 compliant treatment).
2. Financial Statements of Non-Profit Organizations (NPO): Preparation of Income and Expenditure Account from Receipts and Payments Account with subscription adjustments.
3. Accounting for Special Transactions: Consignment accounts (Normal vs Abnormal loss calculation) and Bills of Exchange (Accommodation Bills).
4. Company Accounts: Issue of shares at premium/discount, pro-rata allotment, forfeiture, and reissue entries.`
      },
      {
        heading: '3. Working Notes Presentation: How to Score Full Step Marks',
        content: `ICAI marking schemes heavily reward proper working notes. Common student mistakes include doing rough calculations in margins without cross-referencing.
Follow this standard protocol:
- Main Answer: Present the Primary Balance Sheet, P&L, or Ledger first.
- Working Notes (WN): Clearly label every supporting computation as "Working Note 1: Calculation of Sacrificing Ratio", "Working Note 2: Valuation of Hidden Goodwill", etc.
- Always cross-reference the WN number directly inside the primary ledger or financial statement line item.`
      },
      {
        heading: '4. 90-Day Study Timeline Blueprint',
        content: `Phase 1 (Days 1 - 40): Core Syllabus Completion
- Dedicate 3 hours daily to concept lectures and solving ICAI module illustration problems. Write down every journal entry manually rather than doing visual reading.

Phase 2 (Days 41 - 70): Chapter-Wise Practice & Working Note Perfection
- Solve all Back Questions and 'Test Your Knowledge' questions from the ICAI study kit. Build a personal formula & adjustment summary notebook.

Phase 3 (Days 71 - 90): RTP, MTP & 3-Hour Timed Mock Tests
- Solve the last 4 ICAI RTPs and 2 full-length Mock Test series strictly from 2:00 PM to 5:00 PM to condition your biological exam clock.`
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'foundation', paperId: '1', title: 'CA Foundation Principles and Practice of Accounting Video Classes' }
    ]
  },
  {
    id: 2,
    slug: 'ca-intermediate-taxation-gst-direct-tax-mastery-guide',
    category: 'ca',
    subCategory: 'study-guides',
    level: 'CA Intermediate',
    paper: 'Paper 3: Taxation (Income Tax Law & Indirect Tax - GST)',
    title: 'CA Inter Taxation: Complete Blueprint for Income Tax (50 Marks) and GST (50 Marks)',
    description: 'A comprehensive preparation roadmap for CA Intermediate Paper 3. Learn how to tackle Total Income computation, TDS/TCS provisions, GST Input Tax Credit (ITC) matching, and amendments.',
    author: 'CA Indirect & Direct Tax Advisory Team',
    publishedDate: '2025-01-20',
    lastUpdated: '2025-02-22',
    readTime: '15 min read',
    featured: true,
    tags: ['CA Inter', 'Taxation', 'Income Tax', 'GST', 'Input Tax Credit', 'TDS'],
    syllabusCoverage: [
      { module: 'Section A: Income Tax Law (50 Marks)', weightage: '50%', topics: ['Basic Concepts, Residential Status & Scope of Total Income', 'Heads of Income (Salary, House Property, PGBP, Capital Gains, IFOS)', 'Clubbing, Set-off & Carry Forward of Losses', 'Deductions from GTI (Chapter VI-A)', 'TDS, TCS, Advance Tax & Return of Income'] },
      { module: 'Section B: Goods and Services Tax (50 Marks)', weightage: '50%', topics: ['Concept of Supply (Sec 7 & Schedule I/II/III)', 'Charge of GST & Composition Levy (Sec 9 & Sec 10)', 'Place of Supply & Time of Supply', 'Value of Supply (Sec 15)', 'Input Tax Credit (Sec 16, 17, 18 & Rule 37/37A)', 'Registration, Tax Invoice, E-Way Bill & Returns (GSTR-1, GSTR-3B)'] },
    ],
    keyTakeaways: [
      'GST is typically higher-scoring than Direct Tax. Ensure 100% mastery over Section 16 & 17(5) Blocked Credit provisions to secure 40+ out of 50 marks in GST.',
      'For Income Tax, Total Income problems invariably integrate PGBP with Capital Gains, Clubbing, and Chapter VI-A deductions (80C, 80D, 80G, 80JJAA).',
      'Never skip statutory amendments applicable for your exam term (Statutory Updates booklet issued by ICAI 6 months prior to exams).',
      'In Total Income computations, state clear explanatory notes beneath the solution explaining why an exemption or deduction was allowed or disallowed.'
    ],
    sections: [
      {
        heading: '1. Structuring the Paper 3 Exam Approach',
        content: `Taxation is a 100-mark paper divided equally between Section A (Income Tax Law - 50 Marks) and Section B (GST - 50 Marks).
Both sections feature a mix of 30% Multiple Choice Questions (Case Scenario based MCQs) and 70% Descriptive Practical Problems.

Strategy: Begin the exam with Section B (GST). GST provisions are direct, highly structured, and less prone to lengthy computational traps compared to complex Income Tax total income statements.`
      },
      {
        heading: '2. Section A: Income Tax High-Priority Areas',
        content: `To build an ironclad preparation for Income Tax:
- PGBP: Section 32 Depreciation (Additional Depreciation, Block of Assets), Section 35 (Scientific Research), Section 37 (General Deductions vs Inadmissible expenses), Section 40(a)(ia) TDS defaults, Section 40A(2) related party payments, and Section 43B statutory dues.
- Capital Gains: Section 50C/50CA stamp duty valuation, Section 54/54EC/54F capital gain exemptions, and Section 112A/111A special rates.
- Deductions: Section 80C, 80D (health insurance limits for self/parents/senior citizens), 80G (qualifying limits), and 80JJAA (employment generation deduction).
- TDS/TCS: 194C, 194J, 194I, 194Q vs 206C(1H) cross-linkages.`
      },
      {
        heading: '3. Section B: Goods & Services Tax (GST) Scoring Blueprint',
        content: `The 5 pillars of GST at CA Intermediate level:
1. Input Tax Credit (ITC): Eligibility conditions under Sec 16(2), Ineligible/Blocked credits under Sec 17(5), and Reversal mechanics under Rule 42/43.
2. Time & Value of Supply: Section 12 (Goods), Section 13 (Services), and Section 15 (Valuation inclusions, post-supply discounts).
3. Composition Scheme: Section 10 eligibility thresholds (₹1.5 Crore for manufacturers/traders, ₹75 Lakhs for special category states, Sec 10(2A) for service providers up to ₹50 Lakhs).
4. Reverse Charge Mechanism (RCM): Section 9(3) notified goods & services (GTA, Legal services by Advocates, Director services, Sponsorship).`
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'inter', paperId: '7', title: 'CA Intermediate Taxation Comprehensive Batch (DT + GST)' }
    ]
  },
  {
    id: 3,
    slug: 'cma-intermediate-cost-accounting-high-scoring-techniques',
    category: 'cma',
    subCategory: 'study-guides',
    level: 'CMA Intermediate',
    paper: 'Paper 8: Cost Accounting',
    title: 'CMA Inter Cost Accounting: How to Score 75+ Marks with Standard Costing & Marginal Costing',
    description: 'Detailed analysis of ICMAI CMA Intermediate Cost Accounting. Master variance analysis, break-even decision making, cost accounting standards (CAS), and process costing valuation.',
    author: 'CMA Senior Faculty Panel',
    publishedDate: '2025-01-25',
    lastUpdated: '2025-02-18',
    readTime: '14 min read',
    featured: true,
    tags: ['CMA Inter', 'Cost Accounting', 'Marginal Costing', 'Standard Costing', 'Process Costing'],
    syllabusCoverage: [
      { module: 'Module 1: Introduction to Cost Accounting & Cost Concepts', weightage: '10-15%', topics: ['Cost Objects, Cost Centers, Classification of Costs', 'Cost Sheet preparation with latest CAS taxonomy', 'Direct Materials, EOQ, ABC Analysis, Stock levels'] },
      { module: 'Module 2: Elements of Cost (Material, Employee & Overheads)', weightage: '25-30%', topics: ['Material Costing (FIFO, LIFO, Weighted Avg, Scrap)', 'Employee Cost (Halsey, Rowan, Taylor differential rates)', 'Overheads allocation, apportionment, primary/secondary distribution, machine hour rate'] },
      { module: 'Module 3: Cost Accounting Methods', weightage: '20-25%', topics: ['Job Costing, Batch Costing, Contract Costing (AS 7 / IND AS 115)', 'Process Costing (Equivalent Production, FIFO vs Weighted Avg, Joint & By-Products)'] },
      { module: 'Module 4: Cost Accounting Techniques for Decision Making', weightage: '30-35%', topics: ['Marginal Costing (P/V Ratio, BEP, Margin of Safety, Key Factor analysis, Shut-down point)', 'Standard Costing & Variance Analysis (Material, Labour, Variable & Fixed Overhead variances)', 'Budget & Budgetary Control (Flexible Budget, Cash Budget, Zero-Based Budgeting)'] },
    ],
    keyTakeaways: [
      'Standard Costing and Marginal Costing together account for 35 to 45 marks in CMA Inter exams. Practice at least 20 comprehensive variance analysis problems.',
      'In Process Costing, Statement of Equivalent Units requires crystal-clear understanding of opening WIP treatment under FIFO vs Weighted Average method.',
      'Always memorize Cost Accounting Standards (CAS 1 to CAS 24) definitions and objectives for short-notes and MCQ sections.',
      'Reconciliation of Cost and Financial Accounts is a scoring 8-10 mark question—remember the sign conventions (+/-) based on starting profit base.'
    ],
    sections: [
      {
        heading: '1. Why Cost Accounting is the Backbone of CMA',
        content: `For every CMA student, Cost Accounting is not merely a scoring subject—it represents the foundational core of the Institute of Cost Accountants of India (ICMAI) qualification.
In CMA Intermediate Paper 8, the examiner evaluates your ability to apply quantitative costing tools to real-world industrial decision making.`
      },
      {
        heading: '2. Mastering Marginal Costing & Decision Making',
        content: `Marginal Costing formulas must be understood conceptually rather than memorized mechanically:
- Profit Volume (P/V) Ratio = (Contribution / Sales) × 100 = (Change in Profit / Change in Sales) × 100.
- Break-Even Point (Units) = Fixed Cost / Contribution per unit.
- Break-Even Point (Value) = Fixed Cost / P/V Ratio.
- Margin of Safety (MOS) = Total Sales - Break-Even Sales = Profit / P/V Ratio.
- Key Factor / Limiting Factor Decisions: Always rank products based on Contribution per unit of limiting factor (e.g., Contribution per raw material kg or per machine hour).`
      },
      {
        heading: '3. Variance Analysis Formula Matrix for Standard Costing',
        content: `Material Variances:
1. Material Cost Variance (MCV) = (Standard Quantity × Standard Price) - (Actual Quantity × Actual Price)
2. Material Price Variance (MPV) = Actual Quantity × (Standard Price - Actual Price)
3. Material Usage Variance (MUV) = Standard Price × (Standard Quantity - Actual Quantity)
4. Verification: MCV = MPV + MUV.

Labour Variances:
1. Labour Cost Variance (LCV) = (Standard Hours × Standard Rate) - (Actual Hours Paid × Actual Rate)
2. Labour Rate Variance (LRV) = Actual Hours Paid × (Standard Rate - Actual Rate)
3. Labour Efficiency Variance (LEV) = Standard Rate × (Standard Hours - Actual Hours Worked)
4. Idle Time Variance (ITV) = Actual Idle Hours × Standard Rate (Always Adverse).`
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
    paper: 'General Exam Strategy',
    title: '3-Hour Exam Masterclass: How to Maximize Score, Avoid Panic, and Present Answers for Step Marks',
    description: 'An essential guide for professional exams. Learn the 15-minute reading time strategy, question selection matrix, working note formatting, and psychological stamina during the 3-hour marathon.',
    author: 'AcademyWale Senior Mentors & Toppers Council',
    publishedDate: '2025-01-28',
    lastUpdated: '2025-02-25',
    readTime: '10 min read',
    featured: true,
    tags: ['Exam Strategy', 'Time Management', 'Answer Presentation', 'ICAI Exams', 'ICMAI Exams'],
    keyTakeaways: [
      'The 15-minute initial reading time must be used solely to select the sequence of questions and identify the 1 optional question to leave out.',
      'Target 1.8 minutes per mark (e.g., a 10-mark question must be completed within 18 minutes).',
      'Start every new answer on a fresh page. Clearly write "Answer to Question No. 2(a)" in bold center.',
      'Never erase errors aggressively. Draw a single clean line across incorrect text to maintain answer booklet neatness.'
    ],
    sections: [
      {
        heading: '1. The 15-Minute Reading Time Strategy',
        content: `When the question paper is handed out 15 minutes before the writing time begins (1:45 PM to 2:00 PM for ICAI):
- Do NOT start calculating complex sums mentally.
- Read through all 6 questions rapidly.
- Strike out the ONE question that contains unfamiliar topics or complicated multi-step adjustments.
- Rank the remaining 4 optional questions from strongest to weakest: Order of Attempt = [Best Question] -> [Second Best] -> [Third Best] -> [Compulsory Q1] -> [Weakest Question].`
      },
      {
        heading: '2. The 1.8-Minute Rule for 100 Marks',
        content: `A 100-mark paper has 180 minutes of writing time:
- 100 Marks × 1.8 Minutes = 180 Minutes.
- 5-mark question = Max 9 minutes.
- 10-mark question = Max 18 minutes.
- 14-mark question = Max 25 minutes.

If a calculation does not tally at the 18-minute mark for a 10-mark sum, do NOT keep recalculating. Leave 4 blank lines, write "Working Notes continued on page X", and move to the next question. You will receive 7/10 for steps completed, but saving 15 minutes enables you to attempt another 10-mark question.`
      },
      {
        heading: '3. Legal & Theory Paper Presentation Blueprint',
        content: `For Corporate Law, Audit, and Business Laws descriptive questions, present answers in a 4-paragraph format:
1. Applicable Legal Provision / Section: Quote the Act name and section if 100% certain (e.g., "As per Section 135 of the Companies Act, 2013..."). If uncertain about section number, write "As per relevant provisions of the Companies Act, 2013".
2. Facts of the Case: Summarize the dispute in 2-3 concise lines.
3. Analysis & Correlation: Apply the statutory provision to the given case facts.
4. Conclusion: State the final verdict clearly in a single sentence (e.g., "Therefore, the appointment of Mr. X as director is void ab initio").`
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
    paper: 'Paper 1: Financial Reporting',
    title: 'CA Final Financial Reporting: High-Yield Ind AS Summary Cheat Sheet (Ind AS 115, 116, 109, 103)',
    description: 'Quick-reference revision summary of key Indian Accounting Standards (Ind AS) covering Revenue from Contracts (115), Leases (116), Financial Instruments (109), and Business Combinations (103).',
    author: 'CA Final FR Mentorship Group',
    publishedDate: '2025-02-01',
    lastUpdated: '2025-02-24',
    readTime: '16 min read',
    featured: false,
    tags: ['CA Final', 'Financial Reporting', 'Ind AS 115', 'Ind AS 116', 'Ind AS 109', 'Ind AS 103'],
    keyTakeaways: [
      'Ind AS 115 follows a 5-step revenue recognition model: Identify Contract -> Identify PO -> Determine TP -> Allocate TP -> Recognize Revenue.',
      'Ind AS 116 eliminates operating lease classification for lessees. Lessees must recognize Right-of-Use (ROU) Asset and Lease Liability for almost all leases.',
      'Ind AS 109 classifies financial assets into Amortized Cost, FVTOCI, or FVTPL based on Business Model Test and SPPI Test.',
      'Ind AS 103 mandates Acquisition Method for Business Combinations. Purchase consideration must be measured at fair value on acquisition date.'
    ],
    sections: [
      {
        heading: '1. Ind AS 115: Revenue from Contracts with Customers (5-Step Framework)',
        content: `Step 1: Identify the Contract with the customer (Commercial substance, enforceable rights, payment terms, probable collectability).
Step 2: Identify Performance Obligations (PO) in the contract (Distinct goods or services).
Step 3: Determine the Transaction Price (TP) (Consider variable consideration, significant financing component, non-cash consideration, consideration payable to customer).
Step 4: Allocate the Transaction Price to the performance obligations based on relative Standalone Selling Prices (SSP).
Step 5: Recognize revenue when (or as) the entity satisfies a performance obligation (Over time vs Point in time).`
      },
      {
        heading: '2. Ind AS 116: Leases Accounting Framework',
        content: `Lessee Accounting:
- Initial Measurement of Lease Liability: Present value of lease payments discounted using interest rate implicit in the lease (or incremental borrowing rate).
- Initial Measurement of ROU Asset: Lease Liability + Initial direct costs + Lease payments made at/before commencement - Lease incentives received + Dismantling/restoration provision.
- Subsequent Measurement:
  - ROU Asset: Depreciated over shorter of lease term or useful life.
  - Lease Liability: Increased by finance charge (interest expense) and reduced by lease payments.
- Short-term lease (< 12 months) and Low-value asset exemptions: Can be expensed straight-line over lease term.`
      },
      {
        heading: '3. Ind AS 109: Financial Instruments Classification Matrix',
        content: `Financial Assets (Debt Instruments):
1. Amortized Cost: Contractual cash flows solely represent Solely Payments of Principal & Interest (SPPI) + Held to collect contractual cash flows.
2. FVTOCI (Fair Value Through Other Comprehensive Income): SPPI test passed + Held to both collect cash flows AND sell financial assets.
3. FVTPL (Fair Value Through Profit or Loss): Default category for assets not meeting Amortized Cost or FVTOCI criteria.

Equity Instruments:
- Default: FVTPL.
- Irrevocable Election at Initial Recognition: FVTOCI (without subsequent recycling of cumulative gains/losses to P&L upon derecognition).`
      }
    ],
    relatedCourses: [
      { courseType: 'ca', level: 'final', paperId: '11', title: 'CA Final Financial Reporting (Ind AS) Comprehensive Video Lectures' }
    ]
  },
  {
    id: 6,
    slug: 'cma-final-strategic-financial-management-formula-sheet',
    category: 'cma',
    subCategory: 'notes',
    level: 'CMA Final',
    paper: 'Paper 14: Strategic Financial Management',
    title: 'CMA Final Strategic Financial Management (SFM): Complete Derivatives, Forex & Portfolio Formula Sheet',
    description: 'Comprehensive formula repository and calculation models for Foreign Exchange Risk Management, Interest Rate Futures, Black-Scholes Option Pricing, and Markowitz Portfolio Theory.',
    author: 'CMA Treasury & SFM Specialist Faculty',
    publishedDate: '2025-02-05',
    lastUpdated: '2025-02-23',
    readTime: '13 min read',
    featured: false,
    tags: ['CMA Final', 'SFM', 'Forex', 'Derivatives', 'Portfolio Management', 'Formulas'],
    keyTakeaways: [
      'Interest Rate Parity (IRP): Forward Rate = Spot Rate × (1 + Interest Rate Domestic) / (1 + Interest Rate Foreign).',
      'Capital Asset Pricing Model (CAPM): Expected Return = Rf + Beta × (Rm - Rf).',
      'Black-Scholes Model relies on 5 variables: Current Stock Price (S), Strike Price (X), Time to Expiration (t), Risk-free Rate (r), and Volatility (σ).',
      'In Forex cross-currency quotes, always use Ask/Bid spread rules: Buy at Ask, Sell at Bid.'
    ],
    sections: [
      {
        heading: '1. Foreign Exchange Arithmetic & Arbitrage Formulas',
        content: `1. Direct vs Indirect Quote:
- Direct Quote (1 Foreign Currency = x Domestic Currency).
- Indirect Quote (1 Domestic Currency = x Foreign Currency).
- Direct Quote = 1 / Indirect Quote.

2. Bid-Ask Spread:
- Spread % = [(Ask Price - Bid Price) / Ask Price] × 100.

3. Purchasing Power Parity (PPP):
- Forward Rate = Spot Rate × [(1 + Inflation Domestic) / (1 + Inflation Foreign)].

4. Triangular Arbitrage Condition:
- If Implied Cross Rate ≠ Market Cross Rate, triangular arbitrage profit exists. Route trades from undervalued currency to overvalued currency.`
      },
      {
        heading: '2. Portfolio Management & Risk Analysis',
        content: `1. Portfolio Return: Rp = (w1 × R1) + (w2 × R2).
2. Portfolio Variance (2 Assets):
   σp² = (w1² × σ1²) + (w2² × σ2²) + 2 × w1 × w2 × Cov(1,2).
   where Cov(1,2) = Correlation(1,2) × σ1 × σ2.
3. Sharpe Ratio = (Rp - Rf) / σp (Measures excess return per unit of total risk).
4. Treynor Ratio = (Rp - Rf) / βp (Measures excess return per unit of systematic risk).
5. Jensen's Alpha = Actual Return - [Rf + β × (Rm - Rf)].`
      }
    ],
    relatedCourses: [
      { courseType: 'cma', level: 'final', paperId: '14', title: 'CMA Final Strategic Financial Management (SFM) Video Classes' }
    ]
  },
  {
    id: 7,
    slug: 'ca-cma-passing-marks-exemption-rules-guide',
    category: 'exam-updates',
    subCategory: 'exam-updates',
    level: 'All Levels (CA & CMA)',
    paper: 'Official Examination Regulations',
    title: 'ICAI & ICMAI Passing Criteria, Aggregate Rules, and Paper Exemption Regulations Explained',
    description: 'An authoritative guide explaining how the 40% individual subject mark, 50% group aggregate mark, set-off rules, and 3-term 60+ exemption rules function in CA and CMA exams.',
    author: 'AcademyWale Student Compliance Cell',
    publishedDate: '2025-02-10',
    lastUpdated: '2025-02-26',
    readTime: '8 min read',
    featured: false,
    tags: ['Exam Rules', 'Passing Criteria', 'Exemption Rules', 'Set-off Rules', 'ICAI', 'ICMAI'],
    keyTakeaways: [
      'To pass a single group, a candidate must obtain minimum 40% in each individual paper and minimum 50% in the aggregate of all papers in that group.',
      'When appearing for Both Groups simultaneously, excess marks obtained in Group 1 can be set-off against deficit in Group 2 to meet the overall 50% aggregate.',
      'Scoring 60 or more marks in any paper entitles you to an exemption for that paper for the next 3 consecutive examination terms.',
      'To claim an exemption, a student must have appeared in all papers of that group in that examination term.'
    ],
    sections: [
      {
        heading: '1. Passing Criteria for Single Group vs Both Groups',
        content: `Single Group Rule:
- Minimum marks required in each individual paper: 40 out of 100.
- Minimum total marks required in the group: 50% of total aggregate (e.g., 150 out of 300 for a 3-paper group).

Both Groups Set-Off Advantage:
- If a student appears in both groups in the same exam cycle:
  - Example: Group 1 (3 papers) Score = 175/300 (Cleared + 25 surplus marks).
  - Group 2 (3 papers) Score = 135/300 (All individual papers >= 40, but aggregate is 15 marks short of 150).
  - Combined Total = 175 + 135 = 310 / 600 (> 50%).
  - Result: The candidate is declared PASSED in BOTH groups through the statutory Set-Off rule!`
      },
      {
        heading: '2. The 60+ Marks Exemption Rules & Validity',
        content: `Under ICAI and ICMAI regulations:
1. Eligibility: If a student fails a group but secures 60% or more marks in one or more papers of that group, an exemption is automatically granted in those papers.
2. Condition: The candidate must have appeared in all papers of that group. If absent in even one paper, no exemption can be claimed.
3. Validity: The exemption remains valid for the next 3 consecutive exam terms.
4. Calculation in subsequent terms: To pass the remaining papers, the student must score minimum 40 marks in each remaining paper and achieve 50% aggregate on the remaining papers combined.`
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
    subject: 'CA Foundation Principles of Accounting',
    category: 'ca',
    level: 'Foundation',
    title: 'Accounting Standards, Capital & Revenue Expenditures, and BRS',
    questions: [
      {
        id: 1,
        question: 'An expenditure incurred on the overhaul of a second-hand machinery purchased before putting it into working condition is a:',
        options: [
          'Revenue expenditure',
          'Capital expenditure',
          'Deferred revenue expenditure',
          'Operating expense'
        ],
        correctIndex: 1,
        explanation: 'Any expenditure incurred to bring a fixed asset into its working condition or ready-to-use location is capitalized as part of the asset cost under Accounting Standard principles.'
      },
      {
        id: 2,
        question: 'Under AS 2 (Revised) "Valuation of Inventories", inventories must be valued at:',
        options: [
          'Historical Cost only',
          'Net Realizable Value (NRV) only',
          'Lower of Cost and Net Realizable Value',
          'Higher of Cost and Net Realizable Value'
        ],
        correctIndex: 2,
        explanation: 'AS 2 strictly requires that inventories should be valued at the lower of historical cost and net realizable value (NRV), in accordance with the prudence (conservatism) concept.'
      },
      {
        id: 3,
        question: 'When preparing a Bank Reconciliation Statement starting with Cash Book Overdraft balance, an unpresented cheque should be:',
        options: [
          'Added to overdraft balance',
          'Deducted from overdraft balance',
          'Ignored completely',
          'Multiplied by 2'
        ],
        correctIndex: 1,
        explanation: 'An unpresented cheque increases the passbook balance (or reduces the passbook overdraft). Since we are reconciling cash book to passbook, we deduct the unpresented cheque from the cash book overdraft.'
      },
      {
        id: 4,
        question: 'In the absence of a partnership deed, the rate of interest allowed on advances/loans given by a partner to the firm is:',
        options: [
          'No interest is allowed',
          '6% per annum',
          '10% per annum',
          '12% per annum'
        ],
        correctIndex: 1,
        explanation: 'Section 13(d) of the Indian Partnership Act, 1932 stipulates that subject to contract between the partners, a partner is entitled to interest at the rate of 6% per annum on any payment or advance beyond capital.'
      }
    ]
  },
  {
    id: 'mcq-set-2',
    subject: 'CA Intermediate GST & Taxation',
    category: 'ca',
    level: 'Intermediate',
    title: 'Input Tax Credit (Sec 16 & 17) and Value of Supply (Sec 15)',
    questions: [
      {
        id: 1,
        question: 'Under Section 17(5) of the CGST Act, 2017, Input Tax Credit (ITC) is blocked on motor vehicles for transportation of persons having approved seating capacity of:',
        options: [
          'Up to 13 persons (including driver), subject to exceptions',
          'Up to 20 persons',
          'More than 13 persons',
          'All motor vehicles without any exception'
        ],
        correctIndex: 0,
        explanation: 'Sec 17(5)(a) blocks ITC on motor vehicles for transportation of persons having approved seating capacity of not more than 13 persons (including driver), unless used for making taxable supply of further supply of vehicles, passenger transportation, or driving training.'
      },
      {
        id: 2,
        question: 'What is the maximum time limit to claim Input Tax Credit for a financial year under Section 16(4) of the CGST Act?',
        options: [
          '31st March of the relevant financial year',
          '30th November following the end of the financial year, or furnishing of annual return, whichever is earlier',
          '31st December following the end of the financial year',
          '3 years from the date of invoice'
        ],
        correctIndex: 1,
        explanation: 'As per the amended Section 16(4), the deadline is 30th November following the end of the financial year to which the invoice pertains, or the actual date of filing the annual return, whichever is earlier.'
      },
      {
        id: 3,
        question: 'Under Section 15 of the CGST Act, which of the following is NOT included in the Value of Supply?',
        options: [
          'Any taxes, duties, cesses levied under other Acts (except CGST, SGST, IGST)',
          'Incidental expenses charged by supplier (packaging, commission)',
          'Subsidies directly linked to price (excluding government subsidies)',
          'Post-supply discount agreed before/at supply and linked to relevant invoices'
        ],
        correctIndex: 3,
        explanation: 'Section 15(3)(b) specifically excludes post-supply discounts from the value of supply if established in terms of an agreement entered into before or at the time of supply and specifically linked to relevant invoices.'
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
        question: 'If Total Sales = ₹10,00,000, Variable Cost = ₹6,00,000, and Fixed Cost = ₹2,00,000, the Margin of Safety (MOS) is:',
        options: [
          '₹4,00,000',
          '₹5,00,000',
          '₹6,00,000',
          '₹2,00,000'
        ],
        correctIndex: 1,
        explanation: 'Contribution = Sales - VC = 10,00,000 - 6,00,000 = 4,00,000. P/V Ratio = 4,00,000 / 10,00,000 = 40%. Break-Even Sales = Fixed Cost / PV Ratio = 2,00,000 / 0.40 = ₹5,00,000. MOS = Total Sales - Break-Even Sales = 10,00,000 - 5,00,000 = ₹5,00,000.'
      },
      {
        id: 2,
        question: 'Material Price Variance (MPV) is computed as:',
        options: [
          'Standard Price × (Standard Quantity - Actual Quantity)',
          'Actual Quantity × (Standard Price - Actual Price)',
          'Actual Price × (Standard Quantity - Actual Quantity)',
          'Standard Quantity × (Standard Price - Actual Price)'
        ],
        correctIndex: 1,
        explanation: 'Material Price Variance is calculated on the actual quantity consumed/purchased: MPV = Actual Quantity × (Standard Price - Actual Price).'
      },
      {
        id: 3,
        question: 'Under Cost Accounting Standard 4 (CAS-4), the Cost of Production for captive consumption includes:',
        options: [
          'Direct Material + Direct Wages + Factory Overheads + Quality Control Cost + Admin Overheads relating to production',
          'Direct Material + Selling Overheads + Distribution Costs',
          'Selling Price minus Profit Margin only',
          'Only Prime Cost'
        ],
        correctIndex: 0,
        explanation: 'CAS-4 specifies that Cost of Production comprises Material Consumed, Direct Wages, Direct Expenses, Works Overheads, Quality Control cost, R&D cost, and Administration Overheads related to production activity.'
      }
    ]
  }
];

export const examSyllabusBlueprints = {
  ca: {
    foundation: {
      title: 'ICAI CA Foundation New Scheme Syllabus Architecture',
      papers: [
        { paperNumber: 1, name: 'Accounting', marks: 100, type: 'Descriptive', keyFocus: 'Company Accounts, Partnership, NPO, Accounting Standards' },
        { paperNumber: 2, name: 'Business Laws', marks: 100, type: 'Descriptive', keyFocus: 'Indian Regulatory Framework, Contract Act 1872, Sale of Goods 1930, Partnership Act 1932, LLP 2008, Companies Act 2013' },
        { paperNumber: 3, name: 'Quantitative Aptitude', marks: 100, type: 'Objective (MCQ with Negative Marking)', keyFocus: 'Mathematics (40 Marks), Logical Reasoning (20 Marks), Statistics (40 Marks)' },
        { paperNumber: 4, name: 'Business Economics', marks: 100, type: 'Objective (MCQ with Negative Marking)', keyFocus: 'Micro Economics, Macro Economics, National Income, Public Finance, Money Market, International Trade' }
      ]
    },
    inter: {
      title: 'ICAI CA Intermediate New Scheme Syllabus Architecture',
      group1: [
        { paperNumber: 1, name: 'Advanced Accounting', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Consolidated Financial Statements, AS 1 to AS 29, Business Restructuring, Internal Reconstruction' },
        { paperNumber: 2, name: 'Corporate and Other Laws', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Company Law (Sec 1-148), Foreign Exchange Management Act (FEMA), General Clauses Act, Interpretation of Statutes' },
        { paperNumber: 3, name: 'Taxation (Direct Tax & GST)', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Income Tax Law (50 Marks), Indirect Taxes / GST (50 Marks)' }
      ],
      group2: [
        { paperNumber: 4, name: 'Cost and Management Accounting', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Standard Costing, Marginal Costing, Budgetary Control, Process & Service Costing' },
        { paperNumber: 5, name: 'Auditing and Ethics', marks: 100, type: 'Descriptive + 30% MCQ', keyFocus: 'Standards on Auditing (SAs), Audit Evidence, Internal Control, Company Audit, Ethics' },
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
