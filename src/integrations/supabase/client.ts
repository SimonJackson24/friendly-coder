import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const SUPABASE_URL = 'https://jpiqubhwpoqukqapsstp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaXF1Ymh3cG9xdWtxYXBzc3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4ODc1NTAsImV4cCI6MjAyMjQ2MzU1MH0.SbUXk3ow4xkzCJXmf2oT9GXKZVxJqvNj2IsgGv-_9Ic';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});