# Database Schema Fix

## Problem
You're encountering the error: "Failed to create card: Could not find the 'animations' column of 'business_cards' in the schema cache"

This error occurs because your database table is missing the `animations` and `effects` columns that your application code expects.

## Solution

### Option 1: Quick Fix (Recommended)
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `src/integrations/supabase/add_animations_columns.sql`
4. Run the SQL query

### Option 2: Complete Migration
1. Open your Supabase dashboard
2. Go to the SQL Editor  
3. Copy and paste the contents of `src/integrations/supabase/migrations.sql`
4. Run the SQL query

## What the fix does

The SQL migration will:
- Add the missing `animations` column (TEXT[] type) to the `business_cards` table
- Add the missing `effects` column (TEXT[] type) to the `business_cards` table
- Create indexes for better performance
- Handle the case where the table or columns already exist

## Verification

After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'business_cards' 
  AND column_name IN ('animations', 'effects');
```

You should see both columns listed.

## Error Handling

The application has been updated with better error handling. If you still encounter column-related errors after running the migration, the error message will now clearly indicate that it's a database schema issue and guide you to run the migration.

## Files Modified

1. `src/integrations/supabase/add_animations_columns.sql` - Quick fix SQL
2. `src/integrations/supabase/migrations.sql` - Complete migration SQL  
3. `src/lib/cardUtils.ts` - Added better error handling for missing columns
4. This README file

## Next Steps

1. Run the SQL migration in your Supabase dashboard
2. Try creating a business card again
3. The error should be resolved

If you continue to have issues, check that:
- You're connected to the correct Supabase project
- You have the necessary permissions to modify the database schema
- The SQL was executed successfully without errors
