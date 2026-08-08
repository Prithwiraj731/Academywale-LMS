-- Supports admin-assisted/offline course enrollment records.

ALTER TABLE public.purchases
ADD COLUMN IF NOT EXISTS user_details JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'purchases'
      AND constraint_name = 'purchases_payment_status_check'
  ) THEN
    ALTER TABLE public.purchases DROP CONSTRAINT purchases_payment_status_check;
  END IF;
END $$;

ALTER TABLE public.purchases
ADD CONSTRAINT purchases_payment_status_check
CHECK (payment_status IN ('pending', 'pending_verification', 'completed', 'failed', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_purchases_user_details_manual
ON public.purchases USING gin (user_details);
