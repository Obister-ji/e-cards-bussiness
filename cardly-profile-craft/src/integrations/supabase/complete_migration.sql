-- Complete migration to ensure business_cards table has all required columns
-- This will create the table if it doesn't exist and add any missing columns

-- First, create the business_cards table if it doesn't exist with all basic columns
CREATE TABLE IF NOT EXISTS public.business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  logo TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  whatsapp TEXT,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add theme column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'theme'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN theme TEXT;
    RAISE NOTICE 'Added theme column';
  ELSE
    RAISE NOTICE 'Theme column already exists';
  END IF;
END $$;

-- Add badge column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'badge'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN badge TEXT;
    RAISE NOTICE 'Added badge column';
  ELSE
    RAISE NOTICE 'Badge column already exists';
  END IF;
END $$;

-- Add animations column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'animations'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN animations TEXT[];
    RAISE NOTICE 'Added animations column';
  ELSE
    RAISE NOTICE 'Animations column already exists';
  END IF;
END $$;

-- Add effects column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'effects'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN effects TEXT[];
    RAISE NOTICE 'Added effects column';
  ELSE
    RAISE NOTICE 'Effects column already exists';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_cards_user_id ON public.business_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_business_cards_created_at ON public.business_cards(created_at);

-- Verify all required columns exist
SELECT 
  column_name,
  data_type,
  is_nullable,
  '✅ Column exists' as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'business_cards'
  AND column_name IN ('id', 'name', 'tagline', 'logo', 'email', 'phone', 'website', 'instagram', 'whatsapp', 'description', 'theme', 'badge', 'animations', 'effects', 'user_id', 'created_at', 'updated_at')
ORDER BY 
  CASE column_name
    WHEN 'id' THEN 1
    WHEN 'name' THEN 2
    WHEN 'tagline' THEN 3
    WHEN 'logo' THEN 4
    WHEN 'email' THEN 5
    WHEN 'phone' THEN 6
    WHEN 'website' THEN 7
    WHEN 'instagram' THEN 8
    WHEN 'whatsapp' THEN 9
    WHEN 'description' THEN 10
    WHEN 'theme' THEN 11
    WHEN 'badge' THEN 12
    WHEN 'animations' THEN 13
    WHEN 'effects' THEN 14
    WHEN 'user_id' THEN 15
    WHEN 'created_at' THEN 16
    WHEN 'updated_at' THEN 17
    ELSE 99
  END;
