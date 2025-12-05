-- Add new columns to patients table
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS patient_code text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS therapy_date date;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS complaint text;