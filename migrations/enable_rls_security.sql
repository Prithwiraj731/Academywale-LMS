-- ============================================================================
-- AcademyWale: Enable RLS & Security Policies Migration
-- ============================================================================
-- Fixes:
--   1. RLS Disabled on 7 tables (faculties, institutes, courses, purchases,
--      coupons, testimonials, users)
--   2. Sensitive password column exposed on users table
--   3. Overly permissive RLS policies on notes table (then drop it)
--
-- NOTE: The backend uses supabaseAdmin (service_role key) which bypasses RLS.
--       These policies only govern direct PostgREST API access (anon/authenticated).
-- ============================================================================

-- =============================================
-- STEP 1: Enable RLS on all 7 public tables
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 2: Policies for PUBLIC CATALOG tables
--         (Read-only via PostgREST, write via service_role only)
-- =============================================

-- ---- faculties: Public read, no direct write ----
CREATE POLICY "Allow public read access on faculties"
  ON public.faculties
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- institutes: Public read, no direct write ----
CREATE POLICY "Allow public read access on institutes"
  ON public.institutes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- courses: Public read, no direct write ----
CREATE POLICY "Allow public read access on courses"
  ON public.courses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- testimonials: Public read, no direct write ----
CREATE POLICY "Allow public read access on testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================
-- STEP 3: Policies for SENSITIVE tables
--         (Explicit deny-all — satisfies linter's rls_enabled_no_policy check)
-- =============================================

-- ---- users: Deny all direct access (protects password column and PII) ----
CREATE POLICY "Deny all direct access on users"
  ON public.users
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ---- purchases: Deny all direct access (financial data, server-only) ----
CREATE POLICY "Deny all direct access on purchases"
  ON public.purchases
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ---- coupons: Deny all direct access (validated server-side only) ----
CREATE POLICY "Deny all direct access on coupons"
  ON public.coupons
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- =============================================
-- STEP 4: Fix & Drop the unused 'notes' table
-- =============================================

-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Public delete access" ON public.notes;
DROP POLICY IF EXISTS "Public insert access" ON public.notes;
DROP POLICY IF EXISTS "Public read access" ON public.notes;  -- Drop any other policies too
DROP POLICY IF EXISTS "Public update access" ON public.notes;

-- Drop the notes table entirely (it is not used by the application)
DROP TABLE IF EXISTS public.notes;

-- ============================================================================
-- VERIFICATION QUERIES (run after applying to confirm)
-- ============================================================================
-- Check RLS is enabled:
--   SELECT schemaname, tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--   ORDER BY tablename;
--
-- Check policies exist:
--   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
-- ============================================================================
