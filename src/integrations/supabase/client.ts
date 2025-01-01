import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default to public Supabase URL and anon key if environment variables are not set
const SUPABASE_URL = 'https://jpiqubhwpoqukqapsstp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaXF1Ymh3cG9xdWtxYXBzc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NTY5MTcsImV4cCI6MjAyMzQzMjkxN30.qDj6zwPkHh90lKhQjT5_omcw21gkUQqxF5DzQvBR7Ys';

console.log('Initializing Supabase client with:', { 
  url: SUPABASE_URL,
  hasAnonKey: !!SUPABASE_ANON_KEY 
});

// Initialize the Supabase client with explicit types
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