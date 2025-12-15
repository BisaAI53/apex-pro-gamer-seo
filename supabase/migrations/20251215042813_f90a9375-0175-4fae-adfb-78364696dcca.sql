-- Add 'patient' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'patient';

-- Create table to link auth users to patients
CREATE TABLE public.patient_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (patient_id)
);

-- Enable RLS
ALTER TABLE public.patient_accounts ENABLE ROW LEVEL SECURITY;

-- Patients can view their own account link
CREATE POLICY "Patients can view their own account"
  ON public.patient_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Admin and staff can view all patient accounts
CREATE POLICY "Admin and staff can view patient accounts"
  ON public.patient_accounts FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Admin and staff can manage patient accounts
CREATE POLICY "Admin and staff can manage patient accounts"
  ON public.patient_accounts FOR ALL
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Allow patients to insert their own account link during registration
CREATE POLICY "Users can create their own patient account"
  ON public.patient_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update patients RLS to allow patients to view their own data
CREATE POLICY "Patients can view their own patient data"
  ON public.patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patient_accounts pa 
      WHERE pa.patient_id = patients.id 
      AND pa.user_id = auth.uid()
    )
  );

-- Update financial_entries RLS to allow patients to view their own transactions
CREATE POLICY "Patients can view their own transactions"
  ON public.financial_entries FOR SELECT
  USING (
    patient_id IN (
      SELECT pa.patient_id FROM public.patient_accounts pa 
      WHERE pa.user_id = auth.uid()
    )
  );

-- Update memberships RLS to allow patients to view their own memberships
CREATE POLICY "Patients can view their own memberships"
  ON public.memberships FOR SELECT
  USING (
    patient_id IN (
      SELECT pa.patient_id FROM public.patient_accounts pa 
      WHERE pa.user_id = auth.uid()
    )
  );