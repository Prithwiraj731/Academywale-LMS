-- SQL Schema for AcademyWale Supabase Provisioning

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(50),           -- For MongoDB reference mapping
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
    mobile VARCHAR(50) UNIQUE,      -- Made nullable/optional in signup flow
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 2. Faculties Table
CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(50),               -- For MongoDB reference mapping
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    bio TEXT DEFAULT '',
    teaches VARCHAR(50)[] DEFAULT '{}',
    image_url TEXT DEFAULT '',
    public_id VARCHAR(255) DEFAULT '', -- Cloudinary / Supabase Storage path
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Institutes Table
CREATE TABLE IF NOT EXISTS public.institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(50),               -- For MongoDB reference mapping
    name VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    public_id VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Courses Table (Normalized - Canonical course collection)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(50),                     -- For MongoDB reference mapping (standalone or nested)
    title VARCHAR(255) DEFAULT 'Untitled Course',
    subject VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    category VARCHAR(100) DEFAULT '',         -- 'CA' or 'CMA'
    subcategory VARCHAR(100) DEFAULT '',      -- 'Foundation', 'Inter', 'Final'
    paper_id VARCHAR(50) DEFAULT '',          -- e.g., '1', '2', '3', etc.
    paper_name VARCHAR(255) DEFAULT '',
    course_type VARCHAR(255) NOT NULL,        -- e.g., 'CA Foundation', 'CMA Final'
    no_of_lecture VARCHAR(100) DEFAULT '',
    books VARCHAR(255) DEFAULT '',
    video_language VARCHAR(100) DEFAULT 'Hindi',
    video_run_on VARCHAR(255) DEFAULT '',
    timing VARCHAR(255) DEFAULT '',
    doubt_solving VARCHAR(255) DEFAULT '',
    support_mail VARCHAR(255) DEFAULT '',
    support_call VARCHAR(255) DEFAULT '',
    validity_start_from VARCHAR(255) DEFAULT '',
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    faculty_name VARCHAR(255),
    faculty_slug VARCHAR(255),
    institute_id UUID REFERENCES public.institutes(id) ON DELETE SET NULL,
    institute_name VARCHAR(255),
    poster_url TEXT DEFAULT '',
    poster_public_id TEXT DEFAULT '',
    mode_attempt_pricing JSONB DEFAULT '[]'::jsonb, -- Attempts and modes represented dynamically
    custom_details JSONB DEFAULT '[]'::jsonb,       -- Dynamic course details fields
    cost_price NUMERIC DEFAULT 0,
    selling_price NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Purchases Table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(50),          -- For MongoDB reference mapping
    user_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    course_id UUID REFERENCES public.courses(id) ON DELETE RESTRICT,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE RESTRICT,
    course_details JSONB NOT NULL, -- Stores course details at purchase time (snapshot)
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_method VARCHAR(100) DEFAULT 'online',
    amount NUMERIC NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    access_expiry TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    course VARCHAR(255),
    message TEXT NOT NULL,
    image VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --- INDEXES FOR QUERY OPTIMIZATION ---
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_faculties_slug ON public.faculties(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category_subcategory ON public.courses(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_courses_paper ON public.courses(category, subcategory, paper_id);
CREATE INDEX IF NOT EXISTS idx_courses_faculty_id ON public.courses(faculty_id);
CREATE INDEX IF NOT EXISTS idx_courses_institute_id ON public.courses(institute_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(payment_status);

-- Full-text search helper for courses
CREATE INDEX IF NOT EXISTS idx_courses_search ON public.courses USING gin(to_tsvector('english', title || ' ' || subject || ' ' || description));
