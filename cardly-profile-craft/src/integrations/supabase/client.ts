// Secure Supabase Client - Uses environment variables
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables safely
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sooomjmnfmwpfbypjqqj.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb29tam1uZm13cGZieXBqcXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDM1MzYsImV4cCI6MjA2MzA3OTUzNn0.KOPygh9UDJeTxDfzwRBzsWKUJmc2Qm5-MlZJYYkiF6k";

// Log environment status in development
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Environment:', {
    url: SUPABASE_URL ? '✅ Configured' : '❌ Missing',
    key: SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing'
  });
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);