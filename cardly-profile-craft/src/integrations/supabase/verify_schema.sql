-- Verify the business_cards table schema
-- Run this in Supabase SQL Editor to check if all required columns exist

-- Check if the business_cards table exists
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'business_cards';

-- List all columns in the business_cards table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'business_cards'
ORDER BY ordinal_position;

-- Check specifically for the animations and effects columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  CASE 
    WHEN column_name IN ('animations', 'effects') THEN '✅ Required column found'
    ELSE '⚠️  Other column'
  END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'business_cards'
  AND column_name IN ('animations', 'effects');

-- If the above query returns no rows, the columns are missing
-- Run the add_animations_columns.sql script to fix this
