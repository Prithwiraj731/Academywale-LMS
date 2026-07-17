-- Migration: Add custom_details to courses and make subject nullable/optional
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS custom_details JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ALTER COLUMN subject DROP NOT NULL;
ALTER TABLE public.courses ALTER COLUMN subject SET DEFAULT '';
