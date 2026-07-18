-- Migration: Ensure courses can track update timestamps
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
