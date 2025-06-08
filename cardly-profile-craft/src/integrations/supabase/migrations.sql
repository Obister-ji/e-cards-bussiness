-- Migration to add missing columns to business_cards table
-- This fixes the "Could not find the 'animations' column" error

-- First, let's create the business_cards table if it doesn't exist
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
  theme TEXT,
  badge TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add the missing animations column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'animations'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN animations TEXT[];
  END IF;
END $$;

-- Add the missing effects column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'business_cards' 
    AND column_name = 'effects'
  ) THEN
    ALTER TABLE public.business_cards ADD COLUMN effects TEXT[];
  END IF;
END $$;

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_business_cards_user_id ON public.business_cards(user_id);

-- Create an index on created_at for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_business_cards_created_at ON public.business_cards(created_at);
