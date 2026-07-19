-- Migration: Ensure OTP fields exist for signup verification and password reset
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10);

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ;
