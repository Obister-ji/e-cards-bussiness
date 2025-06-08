-- Add ALL missing columns to business_cards table
-- Run this SQL in your Supabase SQL editor to fix the schema cache error

-- Add the theme column if it doesn't exist
ALTER TABLE public.business_cards
ADD COLUMN IF NOT EXISTS theme TEXT;

-- Add the badge column if it doesn't exist
ALTER TABLE public.business_cards
ADD COLUMN IF NOT EXISTS badge TEXT;

-- Add the animations column if it doesn't exist
ALTER TABLE public.business_cards
ADD COLUMN IF NOT EXISTS animations TEXT[];

-- Add the effects column if it doesn't exist
ALTER TABLE public.business_cards
ADD COLUMN IF NOT EXISTS effects TEXT[];

-- Verify ALL columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'business_cards'
  AND column_name IN ('theme', 'badge', 'animations', 'effects')
ORDER BY column_name;
